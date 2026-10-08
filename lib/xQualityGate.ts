// Quality gate for auto posts. Pure functions, no I/O, so the simulation script can run them.
// A post must pass every check before it is published. The engine regenerates on failure and
// finally falls back to an approved bank post (which must pass the same gate).

import { createHash } from "crypto";

export type GateAccount = "crypto" | "rejuvenation";

/** Minimal view of a log entry the gate needs (matches XAutoLogEntry). */
export type GateHistoryEntry = {
  account: GateAccount;
  text: string;
  textHash?: string;
  at: string;
  tweetId?: string;
  headline?: string;
  headlineKey?: string;
};

export type GateContext = {
  account: GateAccount;
  now: Date;
  /** Successful posts, newest first (both accounts are fine, filtered here). */
  history: GateHistoryEntry[];
  /** The news headline used in the post, if any. */
  headline?: string | null;
  headlinePublishedAt?: string | null;
  enrollmentOpen?: boolean;
};

export type GateResult = { ok: boolean; reasons: string[] };

export const X_MAX_WEIGHTED = 280;
export const DUP_WINDOW_DAYS = 45;
export const NEAR_DUP_WINDOW_DAYS = 30;
export const NEAR_DUP_THRESHOLD = 0.6;
export const MIN_HOURS_BETWEEN_POSTS = 6;
export const HEADLINE_MAX_AGE_HOURS = 36;

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const MONTH_ABBR = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** Literal fragments that must never appear (drafting leftovers, banned themes). */
const FORBIDDEN_LITERALS: Array<{ needle: string; caseSensitive?: boolean; label: string }> = [
  { needle: "...", label: 'contains "..."' },
  { needle: "\u2026", label: "contains an ellipsis character" },
  { needle: "[", label: 'contains "["' },
  { needle: "]", label: 'contains "]"' },
  { needle: "ready to paste", label: 'contains "ready to paste"' },
  { needle: "(or their", label: 'contains "(or their"' },
  { needle: "TODO", caseSensitive: true, label: 'contains "TODO"' },
  { needle: "  ", label: "contains a double space" },
  { needle: "\u2014", label: "contains an em dash" },
  { needle: "\u2013", label: "contains an en dash" },
  { needle: "clarity", label: 'contains "Clarity"' },
  { needle: "rejunomics", label: 'contains "Rejunomics"' },
  { needle: "allocation clarity", label: 'contains "Allocation Clarity"' },
  { needle: "token intent", label: 'contains "Token Intent"' },
  { needle: "month seven", label: 'contains "month seven"' },
  { needle: "lorem", label: "contains placeholder text" },
  { needle: "undefined", caseSensitive: true, label: 'contains "undefined"' },
  { needle: "null", caseSensitive: true, label: 'contains "null"' },
  { needle: "NaN", caseSensitive: true, label: 'contains "NaN"' },
];

/** Style rules: no negation-for-contrast, no medical claims. */
const STYLE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bnot (a|another|just) (rug|hype|meme|pump)/i, label: "negation-for-contrast copy" },
  { pattern: /\b(this|it) is not\b/i, label: 'negation-for-contrast copy ("this is not")' },
  { pattern: /\bisn'?t (a|just|another) /i, label: "negation-for-contrast copy" },
  { pattern: /\bnot hype\b/i, label: 'negation-for-contrast copy ("not hype")' },
  { pattern: /\b(cures?|cured|curing)\b/i, label: "medical claim (cure)" },
  { pattern: /\b(treats?|treatment for|prevents?) (cancer|disease|diabetes|illness)/i, label: "medical claim (treat/prevent disease)" },
  { pattern: /\bguarantee(d|s)?\b/i, label: "guarantee language" },
  { pattern: /\b(100x|moon(ing)?|to the moon|get rich)\b/i, label: "hype language" },
  { pattern: /\bwhat happened in crypto today\b/i, label: "banned framing" },
  { pattern: /--/, label: "double hyphen used as a dash" },
];

const ENROLLMENT_OPEN_CLAIMS = /\b(enroll(ment)? (is )?(now )?open|enroll now|enroll today|sign up now|doors are open)\b/i;

/** X weighted length: URLs count 23, most Latin text counts 1, other code points count 2. */
export function weightedLength(text: string): number {
  const withUrls = text.replace(/https?:\/\/\S+/gi, "u".repeat(23));
  let total = 0;
  for (const ch of withUrls) {
    const cp = ch.codePointAt(0) ?? 0;
    const light =
      (cp >= 0 && cp <= 4351) ||
      (cp >= 8192 && cp <= 8205) ||
      (cp >= 8208 && cp <= 8223) ||
      (cp >= 8242 && cp <= 8247);
    total += light ? 1 : 2;
  }
  return total;
}

export function normalizeForHash(text: string): string {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

export function hashText(text: string): string {
  return createHash("sha256").update(normalizeForHash(text)).digest("hex");
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "at", "by", "is", "it", "its", "be", "are",
  "with", "as", "that", "this", "you", "your", "from", "into", "one", "s",
]);

/** Content words used for near-duplicate detection (URLs removed). */
export function wordSet(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/@\w+/g, " ")
    .replace(/[^a-z0-9$']+/g, " ")
    .split(" ")
    .map((w) => w.replace(/^'+|'+$/g, ""))
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w));
  return new Set(words);
}

export function jaccard(a: string, b: string): number {
  const sa = wordSet(a);
  const sb = wordSet(b);
  if (sa.size === 0 && sb.size === 0) return 1;
  let inter = 0;
  for (const w of sa) if (sb.has(w)) inter += 1;
  return inter / (sa.size + sb.size - inter);
}

export function headlineKey(headline: string): string {
  return hashText(headline.replace(/[^a-z0-9 ]/gi, " "));
}

/** True when a headline mentions a month/year (or a year) earlier than the current month. */
export function hasStaleDate(text: string, now: Date): boolean {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const lower = text.toLowerCase();

  const monthYear = new RegExp(
    `\\b(${[...MONTHS, ...MONTH_ABBR].join("|")})\\.?\\s+(?:\\d{1,2}(?:st|nd|rd|th)?,?\\s+)?(\\d{4})\\b`,
    "g"
  );
  for (const m of lower.matchAll(monthYear)) {
    const name = m[1];
    const y = Number(m[2]);
    const idx = MONTHS.indexOf(name) >= 0 ? MONTHS.indexOf(name) : MONTH_ABBR.indexOf(name);
    if (y < year || (y === year && idx < month)) return true;
  }
  // Any bare year before the current one ("Top coins for 2025").
  for (const m of lower.matchAll(/\b(20\d{2})\b/g)) {
    if (Number(m[1]) < year) return true;
  }
  return false;
}

/** Heuristics for a headline that was cut off by a feed or by earlier truncation. */
export function looksTruncated(headline: string): boolean {
  const h = headline.trim();
  if (!h) return true;
  if (/(\.\.\.|\u2026)/.test(h)) return true;
  // "$3." left from "$3.2B", "inflows hit 4." etc.
  if (/[$€£]?\d+\.$/.test(h)) return true;
  // Ends on a connector word.
  if (/\b(a|an|the|of|to|and|or|for|with|in|on|at|by|as|from|amid|after|before|over|into|its|their|his|her|is|are|was|were)\.?$/i.test(h)) {
    return true;
  }
  // Unbalanced quotes or parentheses.
  const quotes = (h.match(/"/g) || []).length;
  if (quotes % 2 === 1) return true;
  if ((h.match(/\(/g) || []).length !== (h.match(/\)/g) || []).length) return true;
  // Ends on a dangling punctuation mark.
  if (/[,:;\-'"]$/.test(h)) return true;
  return false;
}

export function headlineAgeHours(publishedAt: string | null | undefined, now: Date): number | null {
  if (!publishedAt) return null;
  const ms = Date.parse(publishedAt);
  if (Number.isNaN(ms)) return null;
  return (now.getTime() - ms) / HOUR_MS;
}

/** Problems with a headline on its own (used both to pick headlines and inside the gate). */
export function headlineProblems(
  headline: string,
  publishedAt: string | null | undefined,
  now: Date,
  history: GateHistoryEntry[] = []
): string[] {
  const reasons: string[] = [];
  if (looksTruncated(headline)) reasons.push("headline looks truncated");
  if (hasStaleDate(headline, now)) reasons.push("headline mentions a past month or year");
  const age = headlineAgeHours(publishedAt, now);
  if (age !== null && age > HEADLINE_MAX_AGE_HOURS) reasons.push(`headline is ${Math.round(age)}h old (max ${HEADLINE_MAX_AGE_HOURS}h)`);
  if (age !== null && age < -2) reasons.push("headline date is in the future");
  const key = headlineKey(headline);
  for (const entry of history) {
    const usedKey = entry.headlineKey || (entry.headline ? headlineKey(entry.headline) : null);
    if (usedKey && usedKey === key) {
      reasons.push("headline was already used");
      break;
    }
    if (entry.headline && jaccard(entry.headline, headline) > NEAR_DUP_THRESHOLD) {
      reasons.push("same story as an earlier headline");
      break;
    }
  }
  return reasons;
}

export function checkPost(text: string, ctx: GateContext): GateResult {
  const reasons: string[] = [];
  const nowMs = ctx.now.getTime();

  if (!text || !text.trim()) reasons.push("empty text");

  for (const rule of FORBIDDEN_LITERALS) {
    const hay = rule.caseSensitive ? text : text.toLowerCase();
    const needle = rule.caseSensitive ? rule.needle : rule.needle.toLowerCase();
    if (hay.includes(needle)) reasons.push(rule.label);
  }
  for (const rule of STYLE_PATTERNS) {
    if (rule.pattern.test(text)) reasons.push(rule.label);
  }
  if (/[ \t]+\n|\n[ \t]+/.test(text) || text !== text.trim()) reasons.push("stray whitespace");
  if (/\n{3,}/.test(text)) reasons.push("too many blank lines");
  if (!ctx.enrollmentOpen && ENROLLMENT_OPEN_CLAIMS.test(text)) reasons.push("says enrollment is open (it is not)");
  if (hasStaleDate(text, ctx.now)) reasons.push("mentions a past month or year");

  const len = weightedLength(text);
  if (len > X_MAX_WEIGHTED) reasons.push(`${len} weighted characters (max ${X_MAX_WEIGHTED})`);

  if (ctx.headline) {
    if (!text.includes(ctx.headline)) reasons.push("headline was altered or cut");
    reasons.push(
      ...headlineProblems(
        ctx.headline,
        ctx.headlinePublishedAt,
        ctx.now,
        ctx.history.filter((e) => e.account === ctx.account)
      )
    );
  }

  const mine = ctx.history.filter((e) => e.account === ctx.account);
  const hash = hashText(text);
  for (const entry of mine) {
    const at = Date.parse(entry.at);
    if (Number.isNaN(at)) continue;
    const ageMs = nowMs - at;
    if (ageMs >= 0 && ageMs < MIN_HOURS_BETWEEN_POSTS * HOUR_MS) {
      reasons.push(`this account already posted ${Math.round((ageMs / HOUR_MS) * 10) / 10}h ago (min ${MIN_HOURS_BETWEEN_POSTS}h)`);
      break;
    }
  }
  for (const entry of mine) {
    const at = Date.parse(entry.at);
    if (Number.isNaN(at) || nowMs - at > DUP_WINDOW_DAYS * DAY_MS) continue;
    if ((entry.textHash || hashText(entry.text)) === hash) {
      reasons.push(`exact duplicate of a post from ${entry.at.slice(0, 10)}`);
      break;
    }
  }
  for (const entry of mine) {
    const at = Date.parse(entry.at);
    if (Number.isNaN(at) || nowMs - at > NEAR_DUP_WINDOW_DAYS * DAY_MS) continue;
    const sim = jaccard(entry.text, text);
    if (sim > NEAR_DUP_THRESHOLD) {
      reasons.push(`near duplicate (${Math.round(sim * 100)}% word overlap) of a post from ${entry.at.slice(0, 10)}`);
      break;
    }
  }

  return { ok: reasons.length === 0, reasons: [...new Set(reasons)] };
}
