"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Post } from "@/lib/posts";
import BlogArticleEngagement from "./BlogArticleEngagement";

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

const MOBILE_MAX_WIDTH = 639;
const VIEWPORT_MARGIN = 8;

type OverlayBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type OverlayStyle = OverlayBox & {
  position: "absolute" | "fixed";
};

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

/** Keep layout height so the modal does not shrink when the on-screen keyboard opens. */
function getLockedLayoutHeight() {
  return window.innerHeight;
}

/** Absolute + scrollY survives Google/in-app browsers where position:fixed scrolls away */
function getMobileOverlayGeometry(
  lockedHeight: number
): { panel: OverlayStyle; backdrop: OverlayStyle } {
  const vv = window.visualViewport;
  const scrollY = window.scrollY;
  const vvTop = vv?.offsetTop ?? 0;
  const vvLeft = vv?.offsetLeft ?? 0;
  const vvWidth = vv?.width ?? window.innerWidth;
  const m = VIEWPORT_MARGIN;

  return {
    backdrop: {
      position: "absolute",
      top: scrollY + vvTop,
      left: vvLeft,
      width: vvWidth,
      height: lockedHeight,
    },
    panel: {
      position: "absolute",
      top: scrollY + vvTop + m,
      left: vvLeft + m,
      width: Math.max(vvWidth - m * 2, 0),
      height: Math.max(lockedHeight - m * 2, 240),
    },
  };
}

function scrollFieldIntoView(field: HTMLElement, container: HTMLElement) {
  const vv = window.visualViewport;
  const visibleTop = vv?.offsetTop ?? 0;
  const visibleBottom = visibleTop + (vv?.height ?? window.innerHeight);
  const fieldRect = field.getBoundingClientRect();
  const headerOffset = 72;
  const keyboardPadding = 24;

  if (fieldRect.bottom > visibleBottom - keyboardPadding) {
    container.scrollTop += fieldRect.bottom - (visibleBottom - keyboardPadding);
  } else if (fieldRect.top < visibleTop + headerOffset) {
    container.scrollTop += fieldRect.top - (visibleTop + headerOffset);
  }
}

function boxToCss(box: OverlayStyle): React.CSSProperties {
  return {
    position: box.position,
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    maxHeight: `${box.height}px`,
    right: "auto",
    bottom: "auto",
  };
}

type BlogArticleModalProps = {
  slug: string | null;
  onClose: () => void;
};

export default function BlogArticleModal({ slug, onClose }: BlogArticleModalProps) {
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileLayout, setMobileLayout] = useState<{
    panel: OverlayStyle;
    backdrop: OverlayStyle;
  } | null>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const savedScrollYRef = useRef(0);
  const lockedViewportHeightRef = useRef(0);
  const [mobileInputFocused, setMobileInputFocused] = useState(false);
  const isOpen = slug !== null;

  const handleClose = useCallback(() => {
    setPost(null);
    setError("");
    onClose();
  }, [onClose]);

  const handleFieldFocus = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.matches("input, textarea")) {
      return;
    }
    if (isMobileViewport()) {
      setMobileInputFocused(true);
    }
    const container = scrollBodyRef.current;
    if (!container) return;
    requestAnimationFrame(() => {
      scrollFieldIntoView(target, container);
      window.setTimeout(() => scrollFieldIntoView(target, container), 120);
    });
  }, []);

  const handleFieldBlur = useCallback(() => {
    window.setTimeout(() => {
      const active = document.activeElement;
      const container = scrollBodyRef.current;
      const stillFocused =
        active instanceof HTMLElement &&
        active.matches("input, textarea") &&
        (container?.contains(active) ?? false);
      if (!stillFocused) {
        setMobileInputFocused(false);
      }
    }, 0);
  }, []);

  const updateMobileLayout = useCallback(() => {
    if (!isMobileViewport()) {
      setMobileLayout(null);
      return;
    }
    if (!lockedViewportHeightRef.current) {
      lockedViewportHeightRef.current = getLockedLayoutHeight();
    }
    setMobileLayout(getMobileOverlayGeometry(lockedViewportHeightRef.current));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock + reposition on every scroll/resize (Google in-app browser)
  useEffect(() => {
    if (!isOpen) return;

    savedScrollYRef.current = window.scrollY;
    lockedViewportHeightRef.current = getLockedLayoutHeight();
    window.scrollTo(0, 0);

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = "0";
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.classList.add("blog-modal-open");

    const isInsideModal = (target: EventTarget | null) => {
      if (!(target instanceof Node)) return false;
      return scrollBodyRef.current?.contains(target) ?? false;
    };

    const preventBackgroundScroll = (event: TouchEvent | WheelEvent) => {
      if (!isInsideModal(event.target)) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    updateMobileLayout();
    document.addEventListener("touchmove", preventBackgroundScroll, { passive: false });
    document.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    window.addEventListener("scroll", updateMobileLayout, { passive: true });
    window.visualViewport?.addEventListener("resize", updateMobileLayout);
    window.visualViewport?.addEventListener("scroll", updateMobileLayout);
    window.addEventListener("resize", updateMobileLayout);
    window.addEventListener("orientationchange", updateMobileLayout);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      body.classList.remove("blog-modal-open");

      document.removeEventListener("touchmove", preventBackgroundScroll);
      document.removeEventListener("wheel", preventBackgroundScroll);
      window.removeEventListener("scroll", updateMobileLayout);
      window.visualViewport?.removeEventListener("resize", updateMobileLayout);
      window.visualViewport?.removeEventListener("scroll", updateMobileLayout);
      window.removeEventListener("resize", updateMobileLayout);
      window.removeEventListener("orientationchange", updateMobileLayout);
      window.removeEventListener("keydown", onKeyDown);

      window.scrollTo(0, savedScrollYRef.current);
      lockedViewportHeightRef.current = 0;
      setMobileInputFocused(false);
      setMobileLayout(null);
    };
  }, [isOpen, handleClose, updateMobileLayout]);

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

  const useMobileLayout = Boolean(mobileLayout);
  const panelStyle = useMobileLayout ? boxToCss(mobileLayout!.panel) : undefined;
  const backdropStyle = useMobileLayout ? boxToCss(mobileLayout!.backdrop) : undefined;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-labelledby="blog-article-title">
      <button
        type="button"
        className={`z-[200] bg-black/85 max-sm:backdrop-blur-none sm:bg-black/80 sm:backdrop-blur-sm ${
          useMobileLayout ? "" : "fixed inset-0"
        }`}
        style={backdropStyle}
        onClick={handleClose}
        aria-label="Close article"
      />

      <div
        key={slug}
        className={`blog-article-modal-panel z-[201] overflow-hidden rounded-2xl border border-[#f5c26b]/30 bg-[#120904] shadow-[0_0_50px_rgba(245,194,107,0.15)]
          ${useMobileLayout ? "" : "fixed left-2 right-2"}
          sm:fixed sm:left-1/2 sm:right-auto sm:top-1/2 sm:bottom-auto sm:flex sm:w-full sm:max-w-4xl sm:max-h-[90vh] sm:-translate-x-1/2 sm:-translate-y-1/2`}
        style={panelStyle}
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
          onFocusCapture={handleFieldFocus}
          onBlurCapture={handleFieldBlur}
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
              <BlogArticleEngagement slug={post.slug} />
            </article>
          )}
        </div>

        <div
          className={`shrink-0 border-t border-[#f5c26b]/20 bg-[#120904] px-4 py-3 sm:px-8 sm:py-4 ${
            useMobileLayout && mobileInputFocused ? "hidden" : ""
          }`}
        >
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