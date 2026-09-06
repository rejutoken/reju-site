import {
  addArticleComment,
  addCommentReply,
  getArticleEngagement,
  isValidVoterId,
  recordArticleView,
  sanitizeText,
  toggleArticleLike,
} from "@/lib/blogEngagement";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { isSafeSlug } from "@/lib/safeError";

export const runtime = "nodejs";

const emptyEngagement = {
  viewCount: 0,
  likeCount: 0,
  likedByViewer: false,
  comments: [],
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!isSafeSlug(slug)) {
      return NextResponse.json(emptyEngagement, { status: 200 });
    }
    const voterId = new URL(request.url).searchParams.get("voterId") || undefined;

    const engagement = await getArticleEngagement(slug, voterId);
    return NextResponse.json(engagement);
  } catch (error) {
    console.error("Blog engagement GET error:", error);
    return NextResponse.json(emptyEngagement, { status: 200 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!isSafeSlug(slug)) {
      return NextResponse.json({ error: "Invalid article." }, { status: 400 });
    }
    const ip = clientIp(request);
    const payload = await request.json();
    const action = String(payload.action || "");

    if (action === "view") {
      if (!rateLimit(`blog-view:${ip}`, 60, 15 * 60 * 1000)) {
        return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
      }
      const result = await recordArticleView(slug);
      return NextResponse.json(result);
    }

    if (!rateLimit(`blog:${ip}`, 20, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts. Please wait." }, { status: 429 });
    }

    if (action === "like") {
      const voterId = String(payload.voterId || "");
      if (!isValidVoterId(voterId)) {
        return NextResponse.json({ error: "Invalid viewer id." }, { status: 400 });
      }

      const result = await toggleArticleLike(slug, voterId);
      return NextResponse.json(result);
    }

    if (action === "comment") {
      const authorName = sanitizeText(String(payload.authorName || ""), 60);
      const body = sanitizeText(String(payload.body || ""), 2000);

      if (authorName.length < 2) {
        return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
      }
      if (body.length < 3) {
        return NextResponse.json({ error: "Please enter a comment." }, { status: 400 });
      }

      const comment = await addArticleComment(slug, authorName, body);
      return NextResponse.json({ comment });
    }

    if (action === "reply") {
      const commentId = String(payload.commentId || "");
      const authorName = sanitizeText(String(payload.authorName || ""), 60);
      const body = sanitizeText(String(payload.body || ""), 2000);

      if (!commentId) {
        return NextResponse.json({ error: "Missing comment id." }, { status: 400 });
      }
      if (authorName.length < 2) {
        return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
      }
      if (body.length < 3) {
        return NextResponse.json({ error: "Please enter a reply." }, { status: 400 });
      }

      const reply = await addCommentReply(slug, commentId, authorName, body);
      return NextResponse.json({ reply });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    console.error("Blog engagement POST error:", error);
    const message =
      error instanceof Error && error.message === "Comment not found."
        ? error.message
        : "Unable to save engagement right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
