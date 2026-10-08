// Runs the daily auto post for one or both accounts: plan (engine + gate), render the card,
// upload it, publish, log. Shared by /api/x-post/auto and the health check retry.

import { planPost, type PlanResult } from "./xAutoEngine";
import { fetchWebResearch, type ResearchNote } from "./postResearch";
import { SITE_NEWS } from "./siteNews";
import { renderCardPng } from "./xCards";
import { publishTweet, uploadImage, type XAccount, type XPublishResult } from "./xPublish";
import {
  readXAutoStore,
  recordFailure,
  recordPosted,
  hashPostText,
  type XAutoLogEntry,
} from "./xAutoLog";

/** Headlines that can bridge to long-term utility (unchanged from the Oct 5 voice). */
export const TOKEN_NEWS_QUERY =
  '(cryptocurrency OR bitcoin OR ethereum OR RWA OR "real world asset" OR "token utility" OR "utility token" OR stablecoin OR ETF OR regulation OR institutional) when:2d';

/** Skip the image when the run is already this slow, so the text post still lands. */
const MEDIA_DEADLINE_MS = 38_000;

export async function fetchTokenNewsNotes(): Promise<ResearchNote[]> {
  try {
    const live = await fetchWebResearch({ category: "crypto", themes: ["crypto_news"], query: TOKEN_NEWS_QUERY });
    return live.notes;
  } catch (error) {
    console.error("X AUTO TOKEN NEWS FETCH FAILED:", error);
    return [];
  }
}

export type AccountRunResult = {
  account: XAccount;
  posted: boolean;
  dryRun?: boolean;
  reason?: string;
  url?: string;
  tweetId?: string;
  text?: string;
  pillar?: string;
  sourceId?: string;
  headline?: string;
  linkUsed?: boolean;
  followCta?: boolean;
  usedFallback?: boolean;
  card?: { variant: string; line: string; kicker: string; bytes?: number };
  media: { attached: boolean; note?: string };
  rejectedCandidates?: Array<{ sourceId: string; reasons: string[] }>;
};

export async function runAutoPost(opts: {
  accounts?: XAccount[];
  now?: Date;
  dryRun?: boolean;
  salt?: string;
} = {}): Promise<{ results: AccountRunResult[]; newsCount: number }> {
  const started = Date.now();
  const now = opts.now ?? new Date();
  const accounts: XAccount[] = opts.accounts?.length ? opts.accounts : ["rejuvenation", "crypto"];
  const store = await readXAutoStore();
  const history: XAutoLogEntry[] = store.recent;
  const founderApproved = process.env.X_FOUNDER_NOTES_APPROVED?.trim() === "1";
  let news: ResearchNote[] | null = null;
  const results: AccountRunResult[] = [];

  for (const account of accounts) {
    // Event first: it needs no network, so a slow news fetch can never cost the Event its day.
    if (account === "crypto" && news === null) news = await fetchTokenNewsNotes();

    let plan: PlanResult;
    try {
      plan = planPost({
        account,
        now,
        history,
        news: account === "crypto" ? news ?? [] : undefined,
        options: { enrollmentOpen: SITE_NEWS.enrollmentOpen, founderApproved, salt: opts.salt },
      });
    } catch (error) {
      const reason = `Planner crashed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`X AUTO ${account}: ${reason}`);
      if (!opts.dryRun) await recordFailure({ account, at: now.toISOString(), stage: "generate", reason });
      results.push({ account, posted: false, reason, media: { attached: false } });
      continue;
    }

    if (!plan.ok) {
      console.error(`X AUTO ${account}: ${plan.reason}`);
      const skippedForSpacing = /Already posted/.test(plan.reason);
      if (!opts.dryRun && !skippedForSpacing) {
        await recordFailure({ account, at: now.toISOString(), stage: "gate", reason: plan.reason });
      }
      results.push({ account, posted: false, reason: plan.reason, media: { attached: false }, rejectedCandidates: plan.attempts });
      continue;
    }

    let png: Buffer | null = null;
    let mediaNote: string | undefined;
    try {
      png = await renderCardPng(plan.card);
    } catch (error) {
      mediaNote = `Card render failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`X AUTO ${account}: ${mediaNote}`);
    }

    const base: Omit<AccountRunResult, "posted" | "media"> = {
      account,
      text: plan.text,
      pillar: plan.pillar,
      sourceId: plan.sourceId,
      headline: plan.headline,
      linkUsed: plan.linkUsed,
      followCta: plan.followCta,
      usedFallback: plan.usedFallback,
      card: { variant: plan.card.variant, line: plan.card.line, kicker: plan.card.kicker, bytes: png?.length },
      rejectedCandidates: plan.attempts,
    };

    if (opts.dryRun) {
      results.push({ ...base, posted: false, dryRun: true, media: { attached: false, note: mediaNote || "dry run: nothing uploaded or posted" } });
      continue;
    }

    let mediaIds: string[] = [];
    if (png && Date.now() - started < MEDIA_DEADLINE_MS) {
      const upload = await uploadImage(png, account);
      if (upload.ok) mediaIds = [upload.mediaId];
      else {
        mediaNote = `Media upload failed, posting text only: ${upload.reason}`;
        console.error(`X AUTO ${account}: ${mediaNote}`);
        await recordFailure({ account, at: now.toISOString(), stage: "media", reason: upload.reason });
      }
    } else if (png) {
      mediaNote = "Skipped image to stay inside the function time limit.";
    }

    let publish: XPublishResult = await publishTweet(plan.text, account, { mediaIds });
    if (!publish.posted && mediaIds.length) {
      mediaNote = `Post with image was rejected (${publish.reason}); retried text only.`;
      console.error(`X AUTO ${account}: ${mediaNote}`);
      mediaIds = [];
      publish = await publishTweet(plan.text, account);
    }

    if (!publish.posted) {
      console.error(`X AUTO PUBLISH FAILED account=${account} reason=${publish.reason}`);
      await recordFailure({ account, at: now.toISOString(), stage: "publish", reason: publish.reason });
      results.push({ ...base, posted: false, reason: publish.reason, media: { attached: false, note: mediaNote } });
      continue;
    }

    const entry: XAutoLogEntry = {
      account,
      textHash: hashPostText(plan.text),
      text: plan.text,
      tweetId: publish.tweetId,
      slot: "morning",
      at: new Date().toISOString(),
      pillar: plan.pillar,
      sourceId: plan.sourceId,
      bridgeId: plan.bridgeId,
      takeId: plan.takeId,
      headline: plan.headline,
      headlineKey: plan.headlineKey,
      headlineUrl: plan.headlineUrl,
      linkUsed: plan.linkUsed,
      followCta: plan.followCta,
      cardVariant: plan.card.variant,
      hasMedia: mediaIds.length > 0,
      mediaNote,
      usedFallback: plan.usedFallback,
    };
    history.unshift(entry);
    await recordPosted(entry);
    results.push({
      ...base,
      posted: true,
      url: publish.url,
      tweetId: publish.tweetId,
      media: { attached: mediaIds.length > 0, note: mediaNote },
    });
  }

  return { results, newsCount: news?.length ?? 0 };
}
