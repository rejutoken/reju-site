import { getArticlesPublicStats } from "@/lib/blogEngagement";
import { BLOG_THEME_COPY } from "@/lib/blogTheme";
import { getAllPostsMeta, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BlogArticleEngagement from "../../components/BlogArticleEngagement";
import BlogPostList from "../../components/BlogPostList";

export const dynamic = "force-dynamic";

const articleProseClass = `
  blog-article-content max-w-none text-gray-300 leading-relaxed
  [&_h1]:mt-8 [&_h1]:mb-4
  [&_h2]:mt-10 [&_h2]:mb-4
  [&_h3]:mt-8 [&_h3]:mb-3
  [&_p]:text-lg [&_p]:leading-8 [&_p]:mb-6
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
  [&_li]:text-lg [&_li]:leading-8
  [&_strong]:text-white [&_strong]:font-semibold
  [&_a]:text-[#f5c26b] [&_a]:font-semibold [&_a]:underline
  [&_em]:text-gray-200
  [&_img]:my-8 [&_img]:mx-auto [&_img]:block [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-[#f5c26b]/20
`;

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article | REJU Blog" };
  return {
    title: `${post.title} | REJU Blog`,
    description: post.description,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const theme = BLOG_THEME_COPY[post.theme];
  const related = (await getAllPostsMeta())
    .filter((item) => item.theme === post.theme && item.slug !== post.slug)
    .slice(0, 3);
  const statsMap = await getArticlesPublicStats([post.slug, ...related.map((item) => item.slug)]);
  const stats = statsMap[post.slug] || { viewCount: 0, likeCount: 0, commentCount: 0 };

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12">
      <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/blog" className="hover:text-[#f5c26b]">
          Blog
        </Link>
        <span className="px-2">/</span>
        <Link href={theme.href} className="hover:text-[#f5c26b]">
          {theme.label}
        </Link>
        <span className="px-2">/</span>
        <span className="text-gray-400">Article</span>
      </nav>

      <article>
        <header className="mb-10 border-b border-[#f5c26b]/20 pb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <Link
              href={theme.href}
              className="rounded-full border border-[#f5c26b]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5c26b] hover:bg-[#f5c26b] hover:text-black"
            >
              {theme.label}
            </Link>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <h1 className="text-xl font-semibold leading-snug text-[#f5c26b]">
            {post.title}
          </h1>
          {post.description ? (
            <p className="mt-5 text-lg leading-8 text-gray-400">{post.description}</p>
          ) : null}
          <p className="mt-6 text-sm text-gray-500">
            {formatCount(stats.viewCount)} view{stats.viewCount === 1 ? "" : "s"}
            <span className="px-2">·</span>
            {formatCount(stats.likeCount)} like{stats.likeCount === 1 ? "" : "s"}
            <span className="px-2">·</span>
            {formatCount(stats.commentCount)} comment
            {stats.commentCount === 1 ? "" : "s"}
          </p>
        </header>

        <div
          className={articleProseClass}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <BlogArticleEngagement slug={post.slug} recordView />
      </article>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-semibold text-[#f5c26b]">
            More in {theme.label}
          </h2>
          <BlogPostList posts={related} stats={statsMap} featuredFirst={false} />
        </section>
      )}
    </div>
  );
}
