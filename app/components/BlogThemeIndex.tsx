import Link from "next/link";
import { getArticlesPublicStats } from "@/lib/blogEngagement";
import { BLOG_THEME_COPY } from "@/lib/blogTheme";
import type { BlogTheme } from "@/lib/posts";
import { getPostsByTheme } from "@/lib/posts";
import BlogPostList from "./BlogPostList";
import BlogThemeButtons from "./BlogThemeButtons";

export async function BlogThemeIndex({ theme }: { theme: BlogTheme }) {
  const copy = BLOG_THEME_COPY[theme];
  const posts = await getPostsByTheme(theme);
  const stats = await getArticlesPublicStats(posts.map((post) => post.slug));
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-12">
      <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/blog" className="hover:text-[#f5c26b]">
          Blog
        </Link>
        <span className="px-2">/</span>
        <span className="text-[#f5c26b]">{copy.label}</span>
      </nav>

      <header className="mb-10 border-b border-[#f5c26b]/20 pb-8">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
          REJU Blog
        </p>
        <h1 className="mb-4 text-xl font-semibold text-[#f5c26b]">{copy.title}</h1>
        <p className="max-w-2xl text-lg text-gray-400">{copy.description}</p>
        <div className="mt-6">
          <BlogThemeButtons active={theme} />
        </div>
      </header>

      <BlogPostList
        posts={posts}
        stats={stats}
        emptyMessage={`${copy.label} articles coming soon.`}
      />
    </div>
  );
}
