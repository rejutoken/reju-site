"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const isOpen = slug !== null;

  const handleClose = useCallback(() => {
    setPost(null);
    setError("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll only when modal opens/closes — NOT when switching articles
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const previousPosition = document.body.style.position;
    const previousTop = document.body.style.top;
    const previousWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.position = previousPosition;
      document.body.style.top = previousTop;
      document.body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, handleClose]);

  // Load article when slug changes
  useEffect(() => {
    if (!slug) {
      setPost(null);
      setError("");
      setLoading(false);
      return;
    }

    const requestedSlug = slug;
    let cancelled = false;

    setLoading(true);
    setError("");
    setPost(null);

    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }

    fetch(`/api/blog/${encodeURIComponent(requestedSlug)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Article could not be loaded.");
        return res.json() as Promise<Post>;
      })
      .then((data) => {
        if (cancelled || data.slug !== requestedSlug) return;
        setPost(data);
        requestAnimationFrame(() => {
          if (scrollBodyRef.current) {
            scrollBodyRef.current.scrollTop = 0;
          }
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError("Unable to load this article. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!slug || !mounted) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="blog-article-title">
      <button
        type="button"
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-label="Close article"
      />

      <div
        key={slug}
        className="blog-article-modal-panel fixed z-[201] overflow-hidden rounded-2xl border border-[#f5c26b]/30 bg-[#120904] shadow-[0_0_50px_rgba(245,194,107,0.15)]
          left-2 right-2
          sm:left-1/2 sm:right-auto sm:top-1/2 sm:bottom-auto sm:flex sm:w-full sm:max-w-4xl sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
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

        <div
          ref={scrollBodyRef}
          className="blog-article-modal-body min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:flex-1 sm:px-8 sm:py-6"
        >
          {loading && (
            <p className="py-12 text-center text-gray-400">Loading article…</p>
          )}

          {error && !loading && (
            <div className="py-12 text-center">
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
                className="mt-2 text-xl font-bold leading-snug text-[#f5c26b] sm:mt-3 sm:text-3xl"
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

        <div className="shrink-0 border-t border-[#f5c26b]/20 bg-[#120904] px-4 py-3 sm:px-8 sm:py-4">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-full border border-[#f5c26b] bg-[#f5c26b] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#ffd88a] sm:w-auto sm:px-8"
          >
            {error ? "Back to Blog" : "Close & Read Another Article"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}