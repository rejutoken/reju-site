import { NextRequest, NextResponse } from "next/server";
import { readXAutoStore, writeXAutoStore } from "../../../../lib/xAutoLog";
import { accountHealth, HEALTH_MAX_GAP_HOURS } from "../../../../lib/xHealth";
import { alertChannelsConfigured, sendAlert } from "../../../../lib/xAlerts";
import { runAutoPost } from "../../../../lib/xAutoRunner";
import { getXPostSession } from "../../../../lib/xPostAuth";
import { xAuthMode, type XAccount } from "../../../../lib/xPublish";

export const runtime = "nodejs";
export const maxDuration = 60;

const ACCOUNTS: XAccount[] = ["rejuvenation", "crypto"];
const ALERT_COOLDOWN_MS = 20 * 60 * 60 * 1000;

function isCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * Missed-post check (Vercel cron 16:00 UTC, about 9 AM Pacific, two hours after the post cron).
 * Public GET: minimal JSON status. With CRON_SECRET or an X Post session: full detail, and on
 * the cron run it sends an alert when an account has not posted in 26 hours. Set
 * X_HEALTH_RETRY=1 to also re-run the missing account's post from here.
 */
export async function GET(req: NextRequest) {
  const cron = isCron(req);
  const session = cron ? null : await getXPostSession().catch(() => null);
  const detailed = cron || Boolean(session);
  const now = new Date();

  const store = await readXAutoStore();
  const accounts = ACCOUNTS.map((a) => accountHealth(store, a, now));
  const missing = accounts.filter((a) => !a.ok);

  let alert: { sent: boolean; delivered: string[]; errors: string[]; skipped?: string } | undefined;
  let retry: unknown;

  if (cron && missing.length > 0) {
    if (process.env.X_HEALTH_RETRY?.trim() === "1") {
      const run = await runAutoPost({ accounts: missing.map((m) => m.account), now });
      retry = run.results.map((r) => ({ account: r.account, posted: r.posted, reason: r.reason, url: r.url }));
    }
    const lastAlert = store.alerts?.[0];
    if (lastAlert && now.getTime() - Date.parse(lastAlert.at) < ALERT_COOLDOWN_MS) {
      alert = { sent: false, delivered: [], errors: [], skipped: "alert already sent in the last 20 hours" };
    } else {
      const lines = missing.map((m) =>
        m.lastPostAt
          ? `${m.handle}: last auto post ${m.hoursSinceLastPost}h ago (${m.lastPostAt}).${m.recentFailures[0] ? ` Last error: ${m.recentFailures[0].reason}` : ""}`
          : `${m.handle}: no auto post on record.`
      );
      const message = [
        `REJU auto-posting missed a day (no post in the last ${HEALTH_MAX_GAP_HOURS}h).`,
        ...lines,
        retry ? `Retry result: ${JSON.stringify(retry)}` : "",
        "Check Vercel > reju-site > Cron Jobs (enabled?) and the /api/x-post/auto function logs.",
      ]
        .filter(Boolean)
        .join("\n");
      const sent = await sendAlert("REJU X auto-post missed", message);
      alert = { sent: sent.delivered.length > 0, ...sent };
      const fresh = await readXAutoStore();
      fresh.alerts = [{ at: now.toISOString(), message, delivered: sent.delivered }, ...(fresh.alerts || [])];
      await writeXAutoStore(fresh);
    }
  }

  const body = {
    ok: missing.length === 0,
    checkedAt: now.toISOString(),
    maxGapHours: HEALTH_MAX_GAP_HOURS,
    accounts: detailed
      ? accounts.map((a) => ({ ...a, authMode: xAuthMode(a.account) }))
      : accounts.map((a) => ({ handle: a.handle, ok: a.ok, lastPostAt: a.lastPostAt, hoursSinceLastPost: a.hoursSinceLastPost, lastPostUrl: a.lastPostUrl })),
    ...(detailed ? { alertChannels: alertChannelsConfigured(), lastAlert: store.alerts?.[0] ?? null } : {}),
    ...(alert ? { alert } : {}),
    ...(retry ? { retry } : {}),
  };
  return NextResponse.json(body, { status: 200, headers: { "Cache-Control": "no-store" } });
}
