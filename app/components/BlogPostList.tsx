import Link from "next/link";
import type { ArticlePublicStats } from "@/lib/blogEngagement";
import type { PostMeta } from "@/lib/posts";
import { BLOG_THEME_COPY } from "@/lib/blogTheme";

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

function emptyStats(): ArticlePublicStats {
  return { viewCount: 0, likeCount: 0, commentCount: 0 };
}

function PostCard({
  post,
  stats,
  featured = false,
}: {
  post: PostMeta;
  stats: ArticlePublicStats;
  featured?: boolean;
}) {
  const theme = BLOG_THEME_COPY[post.theme];

  return (
    <article
      className={`group rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 transition hover:border-[#f5c26b] ${
        featured ? "p-8 md:p-10" : "p-7"
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
        <Link
          href={theme.href}
          className="rounded-full border border-[#f5c26b]/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5c26b] hover:bg-[#f5c26b] hover:text-black"
        >
          {theme.label}
        </Link>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </div>

      <h3 className="text-xl font-semibold leading-snug text-white group-hover:text-[#f5c26b]">
        <Link href={`/blog/${post.slug}`} className="focus:outline-none">
          {post.title}
        </Link>
      </h3>

      <p className={`mt-4 text-gray-400 ${featured ? "text-lg leading-8" : "line-clamp-3 text-base"}`}>
        {post.description}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
        <span>{formatCount(stats.viewCount)} view{stats.viewCount === 1 ? "" : "s"}</span>
        <span>{formatCount(stats.likeCount)} like{stats.likeCount === 1 ? "" : "s"}</span>
        <span>
          {formatCount(stats.commentCount)} comment{stats.commentCount === 1 ? "" : "s"}
        </span>
        <Link
          href={`/blog/${post.slug}`}
          className="ml-auto font-semibold text-[#f5c26b] hover:underline"
        >
          Read article →
        </Link>
      </div>
    </article>
  );
}

export default function BlogPostList({
  posts,
  stats,
  emptyMessage = "Articles coming soon.",
  featuredFirst = true,
}: {
  posts: PostMeta[];
  stats: Record<string, ArticlePublicStats>;
  emptyMessage?: string;
  featuredFirst?: boolean;
}) {
  if (posts.length === 0) {
    return <p className="text-gray-400">{emptyMessage}</p>;
  }

  const featured = featuredFirst ? posts[0] : null;
  const list = featured ? posts.slice(1) : posts;

  return (
    <div className="space-y-6">
      {featured && (
        <PostCard
          post={featured}
          stats={stats[featured.slug] || emptyStats()}
          featured
        />
      )}
      <div className="grid gap-6 md:grid-cols-1">
        {list.map((post) => (
          <PostCard key={post.slug} post={post} stats={stats[post.slug] || emptyStats()} />
        ))}
      </div>
    </div>
  );
}
