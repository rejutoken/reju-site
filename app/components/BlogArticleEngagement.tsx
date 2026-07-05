"use client";

import { useCallback, useEffect, useState } from "react";
import type { BlogComment } from "@/lib/blogEngagement";
import { getOrCreateVoterId } from "@/lib/blogVoter";

type EngagementState = {
  likeCount: number;
  likedByViewer: boolean;
  comments: BlogComment[];
};

const inputClass =
  "w-full rounded-2xl border border-[#f5c26b]/25 bg-black/30 px-4 py-3 text-gray-200 placeholder:text-gray-500 focus:border-[#f5c26b] focus:outline-none";

const buttonClass =
  "rounded-full border border-[#f5c26b] px-5 py-2 text-sm font-semibold text-[#f5c26b] transition hover:bg-[#f5c26b] hover:text-black disabled:cursor-not-allowed disabled:opacity-50";

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function BlogArticleEngagement({ slug }: { slug: string }) {
  const [engagement, setEngagement] = useState<EngagementState>({
    likeCount: 0,
    likedByViewer: false,
    comments: [],
  });
  const [loading, setLoading] = useState(true);
  const [likeBusy, setLikeBusy] = useState(false);
  const [status, setStatus] = useState("");

  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);

  const [replyTargetId, setReplyTargetId] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);

  const loadEngagement = useCallback(async () => {
    setLoading(true);
    try {
      const voterId = getOrCreateVoterId();
      const res = await fetch(
        `/api/blog/${encodeURIComponent(slug)}/engagement?voterId=${encodeURIComponent(voterId)}`
      );
      const data = await res.json();
      setEngagement({
        likeCount: Number(data.likeCount || 0),
        likedByViewer: Boolean(data.likedByViewer),
        comments: Array.isArray(data.comments) ? data.comments : [],
      });
    } catch {
      setStatus("Unable to load likes and comments.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadEngagement();
  }, [loadEngagement]);

  async function handleLike() {
    setLikeBusy(true);
    setStatus("");
    try {
      const voterId = getOrCreateVoterId();
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", voterId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Like failed.");
      setEngagement((current) => ({
        ...current,
        likeCount: Number(data.likeCount || 0),
        likedByViewer: Boolean(data.likedByViewer),
      }));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save like.");
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleCommentSubmit(event: React.FormEvent) {
    event.preventDefault();
    setCommentBusy(true);
    setStatus("");
    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "comment",
          authorName: commentName,
          body: commentBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Comment failed.");

      setEngagement((current) => ({
        ...current,
        comments: [data.comment, ...current.comments],
      }));
      setCommentBody("");
      setStatus("Comment posted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to post comment.");
    } finally {
      setCommentBusy(false);
    }
  }

  async function handleReplySubmit(event: React.FormEvent, commentId: string) {
    event.preventDefault();
    setReplyBusy(true);
    setStatus("");
    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          commentId,
          authorName: replyName,
          body: replyBody,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reply failed.");

      setEngagement((current) => ({
        ...current,
        comments: current.comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, data.reply] }
            : comment
        ),
      }));
      setReplyBody("");
      setReplyTargetId(null);
      setStatus("Reply posted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to post reply.");
    } finally {
      setReplyBusy(false);
    }
  }

  return (
    <section className="mt-10 border-t border-[#f5c26b]/20 pt-8">
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleLike}
          disabled={likeBusy || loading}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
            engagement.likedByViewer
              ? "border-[#f5c26b] bg-[#f5c26b] text-black"
              : "border-[#f5c26b]/40 text-[#f5c26b] hover:bg-[#f5c26b] hover:text-black"
          }`}
          aria-pressed={engagement.likedByViewer}
        >
          <span aria-hidden="true">👍</span>
          <span>{engagement.likedByViewer ? "Liked" : "Like"}</span>
          <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs">
            {engagement.likeCount}
          </span>
        </button>
        <p className="text-sm text-gray-500">
          {engagement.comments.length} comment{engagement.comments.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#f5c26b]">Comments</h2>

        <form onSubmit={handleCommentSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            value={commentName}
            onChange={(event) => setCommentName(event.target.value)}
            placeholder="Your name"
            className={inputClass}
            maxLength={60}
            required
          />
          <textarea
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            placeholder="Share your thoughts on this article..."
            className={`${inputClass} min-h-[110px] resize-y`}
            maxLength={2000}
            required
          />
          <button type="submit" disabled={commentBusy} className={buttonClass}>
            {commentBusy ? "Posting..." : "Post Comment"}
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-gray-400">{status}</p>}

        <div className="mt-8 space-y-5">
          {loading && <p className="text-sm text-gray-500">Loading comments...</p>}

          {!loading && engagement.comments.length === 0 && (
            <p className="text-sm text-gray-500">Be the first to comment on this article.</p>
          )}

          {engagement.comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-2xl border border-[#f5c26b]/15 bg-black/25 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-[#f5c26b]">{comment.authorName}</p>
                <p className="text-xs text-gray-500">{formatWhen(comment.createdAt)}</p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-gray-300">{comment.body}</p>

              <button
                type="button"
                onClick={() => {
                  setReplyTargetId((current) =>
                    current === comment.id ? null : comment.id
                  );
                  setReplyName(commentName);
                }}
                className="mt-3 text-sm font-semibold text-[#f5c26b] underline underline-offset-4"
              >
                {replyTargetId === comment.id ? "Cancel reply" : "Reply"}
              </button>

              {comment.replies.length > 0 && (
                <div className="mt-4 space-y-3 border-l border-[#f5c26b]/20 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="rounded-xl bg-black/20 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#f5c26b]">
                          {reply.authorName}
                        </p>
                        <p className="text-xs text-gray-500">{formatWhen(reply.createdAt)}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-300">
                        {reply.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {replyTargetId === comment.id && (
                <form
                  onSubmit={(event) => handleReplySubmit(event, comment.id)}
                  className="mt-4 space-y-3"
                >
                  <input
                    type="text"
                    value={replyName}
                    onChange={(event) => setReplyName(event.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                    maxLength={60}
                    required
                  />
                  <textarea
                    value={replyBody}
                    onChange={(event) => setReplyBody(event.target.value)}
                    placeholder="Write your reply..."
                    className={`${inputClass} min-h-[90px] resize-y`}
                    maxLength={2000}
                    required
                  />
                  <button type="submit" disabled={replyBusy} className={buttonClass}>
                    {replyBusy ? "Posting..." : "Post Reply"}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}