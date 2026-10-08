// REJU X auto-post engine (Oct 2026 reach recovery).
//
// Pure planning logic: given the account, the date, the posting history and (for @REJUTOKEN) live
// news, return the one post to publish today plus its image card spec. No network, no storage,
// so scripts/x-simulate.ts can run 21+ simulated days against it.
//
//   @REJUvenationTKN: approved bank posts by daily pillar (fact, story, day, practice, question, status)
//   @REJUTOKEN:       fresh news hook + one sentence of take + rotating REJU bridge, plus non-news
//                     pillars (build, Path B, question, Event quote) on their days and as fallback
//
// Every candidate goes through lib/xQualityGate.ts. Rejected candidates are replaced by the next
// one (up to MAX_ATTEMPTS), then by a safe fallback from the approved bank.

import type { ResearchNote } from "./postResearch";
import type { XAutoLogEntry } from "./xAutoLog";
import {
  EVENT_BANK,
  EVENT_LINK,
  EVENT_HANDLE,
  EVENT_ROTATION,
  TAKES,
  TAKE_CATEGORY_RULES,
  TOKEN_BANK,
  TOKEN_BRIDGES,
  TOKEN_FOLLOW_LINE,
  TOKEN_LINK,
  TOKEN_ROTATION,
  type BankPost,
  type BridgeLine,
  type Take,
  type TakeCategory,
} from "./xContentBank";
import { pickCardVariant, CARD_LINE_MAX_CHARS, type CardSpec } from "./xCardVariants";
import {
  DUP_WINDOW_DAYS,
  X_MAX_WEIGHTED,
  MIN_HOURS_BETWEEN_POSTS,
  checkPost,
  headlineKey,
  headlineProblems,
  weightedLength,
  type GateResult,
} from "./xQualityGate";

export type EngineAccount = "crypto" | "rejuvenation";

export const MAX_ATTEMPTS = 6;
export const LINK_EVERY = 3;
export const FOLLOW_CTA_PER_WEEK = 2;
const FOLLOW_PILLARS = new Set(["event_quote", "path_b"]);
const DAY_MS = 24 * 60 * 60 * 1000;

/** Headlines that do not bridge cleanly to a long-term token (banned, off-voice, or political). */
const NEWS_SKIP =
  /clarity|rejunomics|meme\s*coins?|memecoins?|pump\s*and\s*dump|pumpfun|rug\s*pull|kalshi|polymarket|prediction market|sports|betting|celebrity|dogecoin|shiba|\bpepe\b|airdrop|casino|gambl|lawsuit|sued|arrest|sentenced|fraud|scandal|probe|investigat|indict|bloodbath|carnage|massacre|death|dies|killed|\bwar\b|terror|trump|biden|harris|democrat|republican|election/i;
/** The story must be about crypto or digital assets (the feed also returns general tech news). */
const NEWS_RELEVANT =
  /\b(bitcoin|btc|ethereum|ether|eth|crypto\w*|tokens?|tokeni[sz]\w*|blockchain|stablecoins?|usdc|usdt|tether|defi|solana|web3|on.?chain|digital assets?|etfs?|staking|wallets?|layer.?2|nft)\b/i;
const NEWS_PREFER =
  /utilit|real.?world|\brwa\b|tokeni[sz]|ecosystem|long.?term|institut|regulat|compliance|product|build|adopt|treasury|fund|etf|stablecoin|on.?chain|staking|lock|vest|infrastructure|payment|settlement|custody|self.?custody/i;
const NEWS_GLOOM = /\b(crash\w*|plunge\w*|tumbl\w*|liquidat\w*|sell.?off|hack\w*|exploit\w*|stolen|bear\w*|fear)\b/i;

export type PlanOptions = {
  enrollmentOpen?: boolean;
  /** Allow founder-voice posts (only after Wilson approves the wording). */
  founderApproved?: boolean;
  /** Extra salt so a manual re-run picks different candidates. */
  salt?: string;
};

export type PlanAttempt = { sourceId: string; reasons: string[] };

export type PlannedPost = {
  ok: true;
  account: EngineAccount;
  dateKey: string;
  scheduledPillar: string;
  pillar: string;
  text: string;
  sourceId: string;
  bridgeId?: string;
  takeId?: string;
  headline?: string;
  headlineKey?: string;
  headlineUrl?: string;
  headlinePublishedAt?: string;
  linkUsed: boolean;
  followCta: boolean;
  usedFallback: boolean;
  card: CardSpec;
  gate: GateResult;
  attempts: PlanAttempt[];
};

export type PlanSkipped = {
  ok: false;
  account: EngineAccount;
  dateKey: string;
  scheduledPillar: string;
  reason: string;
  attempts: PlanAttempt[];
};

export type PlanResult = PlannedPost | PlanSkipped;

type Candidate = {
  text: string;
  pillar: string;
  sourceId: string;
  bridgeId?: string;
  takeId?: string;
  headline?: string;
  headlineUrl?: string;
  headlinePublishedAt?: string;
  linkUsed: boolean;
  followCta: boolean;
  cardLine: string;
  cardKicker: string;
  cardBadge?: string;
  fallback: boolean;
};

// ---------------------------------------------------------------------------
// Small deterministic helpers
// ---------------------------------------------------------------------------

export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Pacific calendar date, e.g. "2026-10-09". */
export function pacificDateKey(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

export function scheduledPillar(account: EngineAccount, now: Date, opts: PlanOptions = {}): string {
  const n = dayNumber(pacificDateKey(now));
  if (account === "rejuvenation") return EVENT_ROTATION[n % EVENT_ROTATION.length];
  const p = TOKEN_ROTATION[n % TOKEN_ROTATION.length];
  return p === "founder" && !opts.founderApproved ? "news" : p;
}

function mine(history: XAutoLogEntry[], account: EngineAccount): XAutoLogEntry[] {
  return history.filter((e) => e.account === account && e.tweetId !== "");
}

/** Index of the most recent use (0 = newest), or Infinity if never used. */
function lastUseIndex(history: XAutoLogEntry[], match: (e: XAutoLogEntry) => boolean): number {
  const idx = history.findIndex(match);
  return idx === -1 ? Number.POSITIVE_INFINITY : idx;
}

/** Least recently used first; ties broken by a seeded hash so order varies by day. */
function lruOrder<T>(items: T[], idOf: (t: T) => string, useIndex: (t: T) => number, seed: string): T[] {
  return [...items].sort((a, b) => {
    const ua = useIndex(a);
    const ub = useIndex(b);
    if (ua !== ub) return ub - ua;
    return fnv1a(`${seed}:${idOf(a)}`) - fnv1a(`${seed}:${idOf(b)}`);
  });
}

function usedWithinDays(entry: XAutoLogEntry, now: Date, days: number): boolean {
  const at = Date.parse(entry.at);
  return !Number.isNaN(at) && now.getTime() - at <= days * DAY_MS;
}

function hasLink(entry: XAutoLogEntry): boolean {
  if (typeof entry.linkUsed === "boolean") return entry.linkUsed;
  return /rejutkn\.com|https?:\/\/t\.co\//i.test(entry.text);
}

function hasFollow(entry: XAutoLogEntry): boolean {
  if (typeof entry.followCta === "boolean") return entry.followCta;
  return /follow\s+(the event at\s+)?@REJUvenationTKN/i.test(entry.text);
}

/** Link on every 3rd post: when the last two posts on this account carried no link. */
export function linkDue(history: XAutoLogEntry[], account: EngineAccount): boolean {
  const recent = mine(history, account).slice(0, LINK_EVERY - 1);
  if (recent.length < LINK_EVERY - 1) return false;
  return recent.every((e) => !hasLink(e));
}

export function followCtaAllowed(history: XAutoLogEntry[], now: Date, pillar: string): boolean {
  if (!FOLLOW_PILLARS.has(pillar)) return false;
  const lastWeek = mine(history, "crypto").filter((e) => usedWithinDays(e, now, 7));
  return lastWeek.filter(hasFollow).length < FOLLOW_CTA_PER_WEEK;
}

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

function joinParts(body: string, follow: string | null, link: string | null): string {
  let out = body.trim();
  if (follow) out += `\n\n${follow}`;
  if (link) out += follow ? `\n${link}` : `\n\n${link}`;
  return out;
}

/** Compose with at most one call to action: the link when it is due, otherwise the follow line. */
function composeWithExtras(
  body: string,
  account: EngineAccount,
  wantLink: boolean,
  wantFollow: boolean
): { text: string; linkUsed: boolean; followCta: boolean } | null {
  const link = account === "rejuvenation" ? EVENT_LINK : TOKEN_LINK;
  const follow = wantFollow && !wantLink && !body.includes(EVENT_HANDLE) ? TOKEN_FOLLOW_LINE : null;
  const options: Array<[string | null, string | null]> = [
    [follow, wantLink ? link : null],
    [null, wantLink ? link : null],
  ];
  for (const [f, l] of options) {
    const text = joinParts(body, f, l);
    if (weightedLength(text) <= X_MAX_WEIGHTED) return { text, linkUsed: Boolean(l), followCta: Boolean(f) };
  }
  return null;
}

// ---------------------------------------------------------------------------
// News hook (@REJUTOKEN)
// ---------------------------------------------------------------------------

export type CleanHeadline = { headline: string; url?: string; publishedAt?: string; score: number };

/** Full, untruncated headline from a research note, or null if the note only has a cut version. */
export function headlineFromNote(note: ResearchNote): string | null {
  const raw = (note.title || "").trim() || (note.text || "").split(/:\s/)[0].trim();
  if (!raw) return null;
  let h = raw
    .replace(/\s+[|]\s+[^|]+$/g, "")
    .replace(/\s+-\s+[^-]{2,40}$/g, "")
    .replace(/[\u2013\u2014]/g, ",")
    .replace(/\s+,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (/(\.\.\.|\u2026)/.test(h)) return null;
  if (!/[.!?]$/.test(h)) h = `${h}.`;
  return h;
}

export type HeadlineVerdict = { headline: string | null; usable: boolean; reason: string; score: number };

/** Why a research note can or cannot lead today's token post. */
export function headlineVerdict(note: ResearchNote, now: Date, accountHistory: XAutoLogEntry[]): HeadlineVerdict {
  const headline = headlineFromNote(note);
  if (!headline) return { headline, usable: false, reason: "only a cut-off version of the title", score: 0 };
  if (headline.length < 28 || headline.length > 120) return { headline, usable: false, reason: `length ${headline.length} (28 to 120)`, score: 0 };
  if (NEWS_SKIP.test(headline)) return { headline, usable: false, reason: "topic filter (banned, off-voice, or political)", score: 0 };
  if (!NEWS_RELEVANT.test(headline)) return { headline, usable: false, reason: "not a crypto or digital-asset story", score: 0 };
  const problems = headlineProblems(headline, note.publishedAt, now, accountHistory);
  if (problems.length) return { headline, usable: false, reason: problems.join("; "), score: 0 };
  let score = 0;
  if (NEWS_PREFER.test(headline)) score += 5;
  if (/\b(bitcoin|ethereum|crypto|token|blockchain|defi|stablecoin|solana)\b/i.test(headline)) score += 2;
  if (NEWS_GLOOM.test(headline)) score -= 3;
  if (headline.length > 100) score -= 1;
  const published = note.publishedAt ? Date.parse(note.publishedAt) : NaN;
  if (!Number.isNaN(published)) {
    const ageH = (now.getTime() - published) / 3_600_000;
    score += ageH <= 12 ? 2 : ageH <= 24 ? 1 : 0;
  } else {
    score -= 2; // undated headlines are allowed but ranked lower
  }
  return { headline, usable: true, reason: `usable (score ${score})`, score };
}

export function rankHeadlines(
  notes: ResearchNote[] | undefined,
  now: Date,
  accountHistory: XAutoLogEntry[]
): CleanHeadline[] {
  if (!notes?.length) return [];
  const seen = new Set<string>();
  const out: CleanHeadline[] = [];
  for (const note of notes) {
    const v = headlineVerdict(note, now, accountHistory);
    if (!v.usable || !v.headline) continue;
    const key = headlineKey(v.headline);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ headline: v.headline, url: note.url, publishedAt: note.publishedAt, score: v.score });
  }
  return out.sort((a, b) => b.score - a.score);
}

export function takeCategory(headline: string): TakeCategory {
  for (const rule of TAKE_CATEGORY_RULES) if (rule.pattern.test(headline)) return rule.category;
  return "general";
}

function orderedTakes(category: TakeCategory, history: XAutoLogEntry[], seed: string): Take[] {
  const pool = TAKES.filter((t) => t.category === category);
  const general = TAKES.filter((t) => t.category === "general");
  const use = (t: Take) => lastUseIndex(history, (e) => e.takeId === t.id);
  return [...lruOrder(pool, (t) => t.id, use, seed), ...lruOrder(general, (t) => t.id, use, seed)];
}

const SHARED_WORD_IGNORE = new Set(["token", "tokens", "rejuvenation", "event", "launches", "launching"]);

/** True when take and bridge repeat a notable word ("Clear rules ... a clear job"). */
function echoes(take: string, bridge: string): boolean {
  const words = (t: string) =>
    new Set(t.toLowerCase().replace(/[^a-z\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 5 && !SHARED_WORD_IGNORE.has(w)));
  const a = words(take);
  for (const w of words(bridge)) if (a.has(w)) return true;
  return false;
}

function orderedBridges(category: TakeCategory, history: XAutoLogEntry[], seed: string): BridgeLine[] {
  const recentBridgeIds = history.filter((e) => e.bridgeId).map((e) => e.bridgeId as string);
  const recent = new Set(recentBridgeIds.slice(0, 6));
  const use = (b: BridgeLine) => {
    const i = recentBridgeIds.indexOf(b.id);
    return i === -1 ? Number.POSITIVE_INFINITY : i;
  };
  return [...TOKEN_BRIDGES].sort((a, b) => {
    // Bridges from the last 6 news or evergreen posts go to the back; then affinity; then LRU.
    const ra = recent.has(a.id) ? 1 : 0;
    const rb = recent.has(b.id) ? 1 : 0;
    if (ra !== rb) return ra - rb;
    const aa = a.affinity?.includes(category) ? 0 : 1;
    const ab = b.affinity?.includes(category) ? 0 : 1;
    if (aa !== ab) return aa - ab;
    const ua = use(a);
    const ub = use(b);
    if (ua !== ub) return ub - ua;
    return fnv1a(`${seed}:${a.id}`) - fnv1a(`${seed}:${b.id}`);
  });
}

function newsCandidates(
  notes: ResearchNote[] | undefined,
  now: Date,
  history: XAutoLogEntry[],
  seed: string,
  wantLink: boolean
): Candidate[] {
  const own = mine(history, "crypto");
  const ranked = rankHeadlines(notes, now, own).slice(0, 4);
  const out: Candidate[] = [];
  for (const h of ranked) {
    const category = takeCategory(h.headline);
    const take = orderedTakes(category, own, seed)[0];
    if (!take) continue;
    for (const bridge of orderedBridges(category, own, seed)) {
      if (echoes(take.text, bridge.text)) continue;
      const body = `${h.headline}\n\n${take.text} ${bridge.text}`;
      const composed = composeWithExtras(body, "crypto", wantLink, false);
      if (!composed) continue;
      out.push({
        text: composed.text,
        pillar: "news",
        sourceId: "news",
        bridgeId: bridge.id,
        takeId: take.id,
        headline: h.headline,
        headlineUrl: h.url,
        headlinePublishedAt: h.publishedAt,
        linkUsed: composed.linkUsed,
        followCta: false,
        cardLine: bridge.cardLine,
        cardKicker: "REJU · Launching soon",
        fallback: false,
      });
      break; // one candidate per headline; the next headline is the regeneration
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Bank posts
// ---------------------------------------------------------------------------

function bankCandidates(
  account: EngineAccount,
  pillars: string[],
  history: XAutoLogEntry[],
  now: Date,
  seed: string,
  wantLink: boolean,
  opts: PlanOptions,
  fallback: boolean
): Candidate[] {
  const bank: BankPost[] = account === "rejuvenation" ? EVENT_BANK : TOKEN_BANK;
  const own = mine(history, account);
  const out: Candidate[] = [];
  for (const pillar of pillars) {
    const items = bank.filter(
      (p) => p.pillar === pillar && (!p.requiresApproval || opts.founderApproved)
    );
    const fresh = items.filter(
      (p) => !own.some((e) => e.sourceId === p.id && usedWithinDays(e, now, DUP_WINDOW_DAYS))
    );
    const ordered = lruOrder(fresh, (p) => p.id, (p) => lastUseIndex(own, (e) => e.sourceId === p.id), `${seed}:${pillar}`);
    for (const item of ordered) {
      const linkThis = wantLink && item.linkOk !== false;
      const followThis = account === "crypto" && followCtaAllowed(history, now, item.pillar);
      const composed = composeWithExtras(item.text, account, linkThis, followThis);
      if (!composed) continue;
      out.push({
        text: composed.text,
        pillar: item.pillar,
        sourceId: item.id,
        linkUsed: composed.linkUsed,
        followCta: composed.followCta,
        cardLine: item.cardLine,
        cardKicker: item.cardKicker,
        cardBadge: item.cardBadge,
        fallback,
      });
    }
  }
  return out;
}

/**
 * Evergreen token posts for long news outages: one standalone take + one bridge line.
 * Only reached after every fresh bank post is used; the near-duplicate check keeps the same
 * bridge from returning inside 30 days.
 */
function evergreenCandidates(history: XAutoLogEntry[], now: Date, seed: string, wantLink: boolean): Candidate[] {
  const own = mine(history, "crypto");
  const takes = lruOrder(
    TAKES.filter((t) => t.standalone),
    (t) => t.id,
    (t) => lastUseIndex(own, (e) => e.takeId === t.id),
    `${seed}:evergreen`
  );
  const bridges = lruOrder(
    TOKEN_BRIDGES,
    (b) => b.id,
    (b) => lastUseIndex(own, (e) => e.bridgeId === b.id),
    `${seed}:evergreen`
  );
  const out: Candidate[] = [];
  bridges.forEach((bridge, i) => {
    const take = takes.slice(i).concat(takes.slice(0, i)).find((t) => !echoes(t.text, bridge.text)) || takes[i % takes.length];
    const composed = composeWithExtras(`${take.text} ${bridge.text}`, "crypto", wantLink, false);
    if (!composed) return;
    out.push({
      text: composed.text,
      pillar: "evergreen",
      sourceId: `evergreen:${take.id}+${bridge.id}`,
      bridgeId: bridge.id,
      takeId: take.id,
      linkUsed: composed.linkUsed,
      followCta: false,
      cardLine: bridge.cardLine,
      cardKicker: "REJU · Launching soon",
      fallback: true,
    });
  });
  return out;
}

const EVENT_FALLBACK_ORDER = ["fact", "practice", "day", "story", "status", "question"];
const TOKEN_FALLBACK_ORDER = ["path_b", "build", "event_quote", "question"];

/**
 * Fallback pillars, least recently posted first, so fallbacks do not cluster on one pillar.
 * Tomorrow's scheduled pillar goes last so a fallback does not run the same pillar two days in a row.
 */
function otherPillars(order: string[], primary: string, own: XAutoLogEntry[] = [], tomorrow?: string): string[] {
  return order
    .filter((p) => p !== primary)
    .map((p, i) => ({ p, i, use: p === tomorrow ? -Infinity : lastUseIndex(own, (e) => e.pillar === p) }))
    .sort((a, b) => (a.use !== b.use ? b.use - a.use : a.i - b.i))
    .map((x) => x.p);
}

// ---------------------------------------------------------------------------
// Planner
// ---------------------------------------------------------------------------

export function planPost(input: {
  account: EngineAccount;
  now: Date;
  history: XAutoLogEntry[];
  news?: ResearchNote[];
  options?: PlanOptions;
}): PlanResult {
  const { account, now, history } = input;
  const opts = input.options || {};
  const dateKey = pacificDateKey(now);
  const seed = `${account}:${dateKey}:${opts.salt || ""}`;
  const pillar = scheduledPillar(account, now, opts);
  const tomorrow = scheduledPillar(account, new Date(now.getTime() + 24 * 3_600_000), opts);
  const attempts: PlanAttempt[] = [];
  const own = mine(history, account);

  // Never two posts on one account inside 6 hours (protects against double cron runs).
  const last = own[0];
  if (last) {
    const ageH = (now.getTime() - Date.parse(last.at)) / 3_600_000;
    if (ageH >= 0 && ageH < MIN_HOURS_BETWEEN_POSTS) {
      return {
        ok: false,
        account,
        dateKey,
        scheduledPillar: pillar,
        reason: `Already posted ${ageH.toFixed(1)}h ago on this account (minimum ${MIN_HOURS_BETWEEN_POSTS}h).`,
        attempts,
      };
    }
  }

  const wantLink = linkDue(history, account);

  // Primary candidates (the regenerations), then the safe fallback stream.
  let primary: Candidate[];
  let fallback: Candidate[];
  if (account === "rejuvenation") {
    primary = bankCandidates(account, [pillar], history, now, seed, wantLink, opts, false);
    fallback = bankCandidates(account, otherPillars(EVENT_FALLBACK_ORDER, pillar, own, tomorrow), history, now, seed, wantLink, opts, true);
  } else if (pillar === "news") {
    primary = newsCandidates(input.news, now, history, seed, wantLink);
    fallback = [
      ...bankCandidates(account, otherPillars(TOKEN_FALLBACK_ORDER, "news", own, tomorrow), history, now, seed, wantLink, opts, true),
      ...evergreenCandidates(history, now, seed, wantLink),
    ];
  } else {
    primary = [
      ...bankCandidates(account, [pillar], history, now, seed, wantLink, opts, false).slice(0, 3),
      ...newsCandidates(input.news, now, history, seed, wantLink),
    ];
    fallback = [
      ...bankCandidates(account, otherPillars(TOKEN_FALLBACK_ORDER, pillar, own, tomorrow), history, now, seed, wantLink, opts, true),
      ...evergreenCandidates(history, now, seed, wantLink),
    ];
  }

  const tryList = [...primary.slice(0, MAX_ATTEMPTS), ...fallback];
  for (const c of tryList) {
    const gate = checkPost(c.text, {
      account,
      now,
      history: own,
      headline: c.headline,
      headlinePublishedAt: c.headlinePublishedAt,
      enrollmentOpen: opts.enrollmentOpen,
    });
    const cardLineOk = c.cardLine.length <= CARD_LINE_MAX_CHARS && checkPost(c.cardLine, { account, now, history: [] }).ok;
    if (!gate.ok || !cardLineOk) {
      attempts.push({ sourceId: c.bridgeId ? `${c.sourceId}:${c.bridgeId}` : c.sourceId, reasons: cardLineOk ? gate.reasons : [...gate.reasons, "card line failed"] });
      continue;
    }
    const recentVariants = own.map((e) => e.cardVariant).filter((v): v is string => Boolean(v));
    const variant = pickCardVariant(account, c.pillar, recentVariants, fnv1a(`${seed}:variant`));
    return {
      ok: true,
      account,
      dateKey,
      scheduledPillar: pillar,
      pillar: c.pillar,
      text: c.text,
      sourceId: c.sourceId,
      bridgeId: c.bridgeId,
      takeId: c.takeId,
      headline: c.headline,
      headlineKey: c.headline ? headlineKey(c.headline) : undefined,
      headlineUrl: c.headlineUrl,
      headlinePublishedAt: c.headlinePublishedAt,
      linkUsed: c.linkUsed,
      followCta: c.followCta,
      usedFallback: c.fallback || (pillar === "news" && c.pillar !== "news"),
      card: { account, variant, line: c.cardLine, kicker: c.cardKicker, badge: c.cardBadge },
      gate,
      attempts,
    };
  }

  return {
    ok: false,
    account,
    dateKey,
    scheduledPillar: pillar,
    reason: "No candidate passed the quality gate (bank exhausted inside the dedupe window).",
    attempts,
  };
}
