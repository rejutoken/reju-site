import { NextRequest, NextResponse } from "next/server";
import {
  entryHasLink,
  readXAutoStore,
  writeXAutoStore,
  type XAccountWeekMetrics,
  type XWeeklyMetrics,
} from "../../../../lib/xAutoLog";
import { getXPostSession } from "../../../../lib/xPostAuth";
import { fetchTweetMetrics, type XAccount, type XTweetMetrics } from "../../../../lib/xPublish";

export const runtime = "nodejs";
export const maxDuration = 30;

const ACCOUNTS: XAccount[] = ["crypto", "rejuvenation"];

function isCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round(((s[mid - 1] + s[mid]) / 2) * 10) / 10;
}

/**
 * Weekly metrics (Vercel cron Mondays 17:00 UTC). Reads public_metrics for the last 7 days of
 * logged tweet ids (one X API read per account) and stores a summary in the same store as the
 * auto-post log. GET ?view=1 with an X Post session returns stored summaries without calling X.
 */
export async function GET(req: NextRequest) {
  const cron = isCron(req);
  if (!cron) {
    const session = await getXPostSession().catch(() => null);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const store = await readXAutoStore();
    return NextResponse.json({ success: true, metrics: store.metrics || [] });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - 7 * 24 * 3_600_000);
  const store = await readXAutoStore();
  const summary: XWeeklyMetrics = {
    generatedAt: now.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: now.toISOString(),
    accounts: {},
    errors: [],
  };

  for (const account of ACCOUNTS) {
    const entries = store.recent.filter(
      (e) => e.account === account && e.tweetId && Date.parse(e.at) >= windowStart.getTime()
    );
    if (entries.length === 0) continue;
    let metrics: XTweetMetrics[] = [];
    try {
      metrics = await fetchTweetMetrics(entries.map((e) => e.tweetId as string), account);
    } catch (error) {
      summary.errors?.push(`${account}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    const byId = new Map(metrics.map((m) => [m.id, m]));
    const rows = entries
      .map((e) => ({ entry: e, m: byId.get(e.tweetId as string) }))
      .filter((r): r is { entry: typeof r.entry; m: XTweetMetrics } => Boolean(r.m));
    const imps = rows.map((r) => r.m.impressions);
    const totalImpressions = imps.reduce((a, b) => a + b, 0);
    const likes = rows.reduce((a, r) => a + r.m.likes, 0);
    const replies = rows.reduce((a, r) => a + r.m.replies, 0);
    const reposts = rows.reduce((a, r) => a + r.m.reposts, 0);
    const byPillar: XAccountWeekMetrics["byPillar"] = {};
    for (const r of rows) {
      const key = r.entry.pillar || "unknown";
      byPillar[key] = byPillar[key] || { posts: 0, medianImpressions: null };
      byPillar[key].posts += 1;
    }
    for (const key of Object.keys(byPillar)) {
      byPillar[key].medianImpressions = median(rows.filter((r) => (r.entry.pillar || "unknown") === key).map((r) => r.m.impressions));
    }
    summary.accounts[account] = {
      posts: rows.length,
      withMedia: rows.filter((r) => r.entry.hasMedia).length,
      withLink: rows.filter((r) => entryHasLink(r.entry)).length,
      medianImpressions: median(imps),
      totalImpressions,
      likes,
      replies,
      reposts,
      quotes: rows.reduce((a, r) => a + r.m.quotes, 0),
      bookmarks: rows.reduce((a, r) => a + r.m.bookmarks, 0),
      engagementRate: totalImpressions > 0 ? Math.round(((likes + replies + reposts) / totalImpressions) * 1000) / 10 : null,
      byPillar,
      byLink: {
        link: median(rows.filter((r) => entryHasLink(r.entry)).map((r) => r.m.impressions)),
        noLink: median(rows.filter((r) => !entryHasLink(r.entry)).map((r) => r.m.impressions)),
      },
      byMedia: {
        media: median(rows.filter((r) => r.entry.hasMedia).map((r) => r.m.impressions)),
        noMedia: median(rows.filter((r) => !r.entry.hasMedia).map((r) => r.m.impressions)),
      },
      posts_detail: rows.map((r) => ({
        tweetId: r.m.id,
        at: r.entry.at,
        pillar: r.entry.pillar,
        cardVariant: r.entry.cardVariant,
        impressions: r.m.impressions,
        likes: r.m.likes,
        replies: r.m.replies,
        reposts: r.m.reposts,
      })),
    };
  }

  const fresh = await readXAutoStore();
  fresh.metrics = [summary, ...(fresh.metrics || [])];
  await writeXAutoStore(fresh);
  return NextResponse.json({ success: true, summary });
}
