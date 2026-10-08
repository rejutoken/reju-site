import { NextRequest, NextResponse } from "next/server";
import { runAutoPost } from "../../../../lib/xAutoRunner";
import { SITE_NEWS } from "../../../../lib/siteNews";
import type { XAccount } from "../../../../lib/xPublish";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

function parseAccounts(value: string | null): XAccount[] | undefined {
  if (value === "crypto" || value === "rejuvenation") return [value];
  return undefined;
}

/**
 * Daily auto post, one per account (Vercel cron 14:00 UTC, about 7 AM Pacific).
 * Query: ?dry=1 plans and renders without uploading or posting; ?account=crypto|rejuvenation
 * runs one account. Requires Authorization: Bearer CRON_SECRET.
 */
async function handleAuto(req: NextRequest) {
  try {
    if (!verifyCronAuth(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const dryRun = req.nextUrl.searchParams.get("dry") === "1";
    const accounts = parseAccounts(req.nextUrl.searchParams.get("account"));
    const now = new Date();
    const { results, newsCount } = await runAutoPost({ accounts, now, dryRun });
    const failed = results.filter((r) => !r.posted && !r.dryRun).map((r) => ({ account: r.account, reason: r.reason }));

    return NextResponse.json({
      success: failed.length === 0,
      allPosted: !dryRun && failed.length === 0,
      dryRun,
      failed,
      schedule:
        "One post per account at 14:00 UTC (7 AM PDT / 6 AM PST). Every post carries a branded image card; text only if the upload fails.",
      meta: {
        generatedAt: now.toISOString(),
        enrollmentOpen: SITE_NEWS.enrollmentOpen,
        tokenNewsCount: newsCount,
      },
      posts: results,
    });
  } catch (error: unknown) {
    console.error("X-POST AUTO ERROR:", error);
    const message = error instanceof Error ? error.message : "Auto post failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleAuto(req);
}

export async function POST(req: NextRequest) {
  return handleAuto(req);
}
