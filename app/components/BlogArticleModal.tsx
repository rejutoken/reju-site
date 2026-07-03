"use client";

import { useCallback, useEffect, useState } from "react";
import type { Post } from "@/lib/posts";

const articleProseClass = `
  max-w-none text-gray-300 leading-relaxed
  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#f5c26b] [&_h2]:mt-10 [&_h2]:mb-4
  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#f5c26b] [&_h3]:mt-8 [&_h3]:mb-3
  [&_p]:text-base [&_p]:leading-7 [&_p]:mb-5
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
  [&_li]:text-base [&_li]:leading-7
  [&_strong]:text-white [&_strong]:font-semibold
  [&_a]:text-[#f5c26b] [&_a]:font-semibold [&_a]:underline
`;

type BlogArticleModalProps = {
  slug: string | null;
  onClose: () => void;
};

export default function BlogArticleModal({ slug, onClose }: BlogArticleModalProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = useCallback(() => {
    setPost(null);
    setError("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!slug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [slug, handleClose]);

  useEffect(() => {
    if (!slug) {
      setPost(null);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    setPost(null);

    fetch(`/api/blog/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Article could not be loaded.");
        return res.json() as Promise<Post>;
      })
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load this article. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug) return null;

  const showFooter = Boolean(post && !loading && !error) || Boolean(error);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-3 pb-3 pt-2 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-article-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close article"
      />

      <div className="relative z-10 flex h-[calc(100dvh-0.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#f5c26b]/30 bg-[#120904] shadow-[0_0_50px_rgba(245,194,107,0.15)] sm:h-auto sm:max-h-[90vh]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#f5c26b]/20 px-4 py-3 sm:px-8 sm:py-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
            REJU Research
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[#f5c26b]/40 px-4 py-1.5 text-sm font-semibold text-[#f5c26b] transition hover:bg-[#f5c26b] hover:text-black"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-8 sm:py-8">
          {loading && (
            <p className="text-center text-gray-400">Loading article…</p>
          )}

          {error && (
            <div className="text-center">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {post && !loading && !error && (
            <article>
              <p className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1
                id="blog-article-title"
                className="mt-3 text-2xl font-bold leading-tight text-[#f5c26b] sm:text-3xl"
              >
                {post.title}
              </h1>
              <div
                className={articleProseClass}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          )}
        </div>

        {showFooter && (
          <div className="shrink-0 border-t border-[#f5c26b]/20 bg-[#120904] px-4 py-3 sm:px-8 sm:py-4">
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-full border border-[#f5c26b] bg-[#f5c26b] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ffd88a] sm:w-auto sm:px-8"
            >
              {error ? "Back to Blog" : "Close & Read Another Article"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}