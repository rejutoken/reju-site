"use client";

import { useState } from "react";
import type { PostMeta } from "@/lib/posts";
import BlogArticleModal from "./BlogArticleModal";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PostCard({
  post,
  onOpen,
}: {
  post: PostMeta;
  onOpen: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(post.slug)}
      className="group w-full text-left"
    >
      <div className="h-full rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-8 transition-all hover:border-[#f5c26b]">
        <p className="mb-4 text-md text-gray-500">{formatDate(post.date)}</p>
        <h3 className="mb-4 text-xl font-semibold group-hover:text-[#f5c26b]">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-md text-gray-400">{post.description}</p>
        <p className="mt-4 text-sm font-semibold text-[#f5c26b] opacity-0 transition group-hover:opacity-100">
          Read article →
        </p>
      </div>
    </button>
  );
}

export default function BlogPostList({ posts }: { posts: PostMeta[] }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const cryptoPosts = posts.filter((p) => p.category === "crypto");
  const healthPosts = posts.filter((p) => p.category === "health");

  return (
    <>
      <section className="mb-10">
        <h2 className="mb-8 border-b border-[#f5c26b]/20 pb-4 text-3xl font-bold text-[#f5c26b]">
          Crypto &amp; Token
        </h2>
        <div className="grid gap-6 md:grid-cols-1">
          {cryptoPosts.map((post) => (
            <PostCard key={post.slug} post={post} onOpen={setActiveSlug} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-8 border-b border-[#f5c26b]/20 pb-4 text-3xl font-bold text-[#f5c26b]">
          Health &amp; Rejuvenation
        </h2>
        <div className="grid gap-8 md:grid-cols-1">
          {healthPosts.length > 0 ? (
            healthPosts.map((post) => (
              <PostCard key={post.slug} post={post} onOpen={setActiveSlug} />
            ))
          ) : (
            <p className="text-gray-400">Health &amp; Rejuvenation articles coming soon.</p>
          )}
        </div>
      </section>

      <BlogArticleModal slug={activeSlug} onClose={() => setActiveSlug(null)} />
    </>
  );
}