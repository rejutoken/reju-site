// Health status for the two auto-posting accounts, computed from the auto-post log.

import type { XAutoStore, XAutoLogEntry } from "./xAutoLog";
import { entryHasLink } from "./xAutoLog";
import { X_ACCOUNT_HANDLES, type XAccount } from "./xPublish";

export const HEALTH_MAX_GAP_HOURS = 26;

export type AccountHealth = {
  account: XAccount;
  handle: string;
  ok: boolean;
  lastPostAt: string | null;
  hoursSinceLastPost: number | null;
  lastPostUrl: string | null;
  postsLast7Days: number;
  withImageLast7Days: number;
  withLinkLast9Posts: number;
  recentFailures: Array<{ at: string; stage: string; reason: string }>;
};

export function accountHealth(store: XAutoStore, account: XAccount, now = new Date()): AccountHealth {
  const mine: XAutoLogEntry[] = store.recent.filter((e) => e.account === account && e.tweetId);
  const last = mine[0];
  const hours = last ? (now.getTime() - Date.parse(last.at)) / 3_600_000 : null;
  const weekAgo = now.getTime() - 7 * 24 * 3_600_000;
  const lastWeek = mine.filter((e) => Date.parse(e.at) >= weekAgo);
  const handle = X_ACCOUNT_HANDLES[account];
  return {
    account,
    handle: `@${handle}`,
    ok: hours !== null && hours <= HEALTH_MAX_GAP_HOURS,
    lastPostAt: last?.at ?? null,
    hoursSinceLastPost: hours === null ? null : Math.round(hours * 10) / 10,
    lastPostUrl: last?.tweetId ? `https://x.com/${handle}/status/${last.tweetId}` : null,
    postsLast7Days: lastWeek.length,
    withImageLast7Days: lastWeek.filter((e) => e.hasMedia).length,
    withLinkLast9Posts: mine.slice(0, 9).filter(entryHasLink).length,
    recentFailures: (store.failures || [])
      .filter((f) => f.account === account && Date.parse(f.at) >= weekAgo)
      .slice(0, 5)
      .map((f) => ({ at: f.at, stage: f.stage, reason: f.reason })),
  };
}
