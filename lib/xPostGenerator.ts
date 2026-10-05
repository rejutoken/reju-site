// Two-account engine. We sell rejuvenation. Token is a door.
// Once per day per account (morning cron ~7:00 AM California):
//   @REJUvenationTKN — Event / rejuvenation (Event-first voice)
//   @REJUTOKEN — crypto news hook + cold-reader REJU bridge (Wilson 2026-10-05)

import { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION } from "./katsLegacyBook";
import type { ResearchNote } from "./postResearch";
import { SITE_NEWS } from "./siteNews";

const X_SINGLE_MAX = 280;
const PROGRAM_LINK = "rejutkn.com/program";
const ONBOARDING_LINK = "rejutkn.com/onboarding";
const HOME_LINK = "rejutkn.com";
const EVENT_HANDLE = "@REJUvenationTKN";

const BANNED =
  /rejunomics|allocation clarity|token intent|what happened in crypto today|clarity act|kalshi|coinbase premium|pasted news|month seven is a person|not a rug|not a hype|this token is not|isn't a hype|is not just another/i;

/** Headlines that do not connect cleanly to long-term utility / ecosystem claims. */
const NEWS_SKIP =
  /clarity act|\bclarity\b|rejunomics|meme\s*coin|pump\s*and\s*dump|rug\s*pull|kalshi|prediction market|celebrity token|dogecoin|shiba|pepe\b|airdrop farm/i;

/** Prefer headlines that can bridge to substance, longevity, utility, RWAs, regulation-of-substance. */
const NEWS_PREFER =
  /utilit|real.?world|rwa\b|tokeni[sz]e|ecosystem|long.?term|institut|regulat|securit(?:y|ies)|compliance|product|build(?:ing)?|adopt|treasury|fund|etf|stablecoin|on.?chain|governance|staking|lock|vest|sustain|substance|infrastructure|payment|settlement|custody/i;

export { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION };
export type { ResearchNote };

export type PostCategory = "crypto" | "rejuvenation" | "rest";
export type PostSlot = "morning" | "afternoon";

export const EVENT_PILLARS = ["renew", "practice", "event_book", "enter"] as const;
/** Bridge angles for @REJUTOKEN (news + cold-reader REJU). Path B lock stays one rotating variant. */
export const TOKEN_PILLARS = ["vision", "trust_lock", "bridge", "question"] as const;

export const REJUVENATION_THEME_IDS = EVENT_PILLARS;
export const CRYPTO_THEME_IDS = TOKEN_PILLARS;

export type RejuvenationThemeId = (typeof EVENT_PILLARS)[number];
export type CryptoThemeId = (typeof TOKEN_PILLARS)[number];

export type TokenBridgeAngle = "long_term" | "ecosystem" | "door" | "book" | "path_b";

export const THEMES_MAP: Record<string, string> = {
  renew: "EVENT — renew",
  practice: "EVENT — practice",
  event_book: "EVENT — book",
  enter: "EVENT — enter",
  vision: "TOKEN — news + long-term door",
  trust_lock: "TOKEN — news + Path B lock",
  bridge: "TOKEN — news + ecosystem",
  question: "TOKEN — news + book / after launch week",
  health: "EVENT — renew",
  ketosis: "EVENT — practice",
  cellular_repair: "EVENT — practice",
  immunity: "EVENT — practice",
  lymphatic: "EVENT — practice",
  event: "EVENT — book",
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EVENT_BY_DAY: RejuvenationThemeId[] = [
  "renew",
  "practice",
  "event_book",
  "enter",
  "renew",
  "practice",
  "event_book",
];

const TOKEN_BY_DAY: CryptoThemeId[] = [
  "vision",
  "trust_lock",
  "bridge",
  "question",
  "vision",
  "trust_lock",
  "bridge",
];

const PILLAR_TO_BRIDGE: Record<CryptoThemeId, TokenBridgeAngle> = {
  vision: "long_term",
  trust_lock: "path_b",
  bridge: "ecosystem",
  question: "book",
};

const EVENT_TEMPLATES: Record<RejuvenationThemeId, string> = {
  renew: `Rejuvenation is one path: recover the baseline, renew the days, write them down.
The Rejuvenation Event is that path. You leave with a Transformation Book that is yours. ${PROGRAM_LINK}`,
  event_book: `Every day of the Event becomes a chapter.
Journal the day. Same place, same light, same camera. At the end you hold a publishable book, your recovery on paper.
That is the work. ${PROGRAM_LINK}`,
  practice: `The lymphatic system has no pump. It moves when you do, water and motion.
Chapter 1 of Kat's Legacy starts there. The Event turns the page into a week you can finish. ${PROGRAM_LINK}`,
  enter: `Two ways into the Rejuvenation Event:
Pay $600. Or lock $600 in REJU for 6 months. You keep the keys.
Both paths include Kat's Legacy ($69) and the book you author. Enrollment opens when rejutkn.com says it is open.`,
};

/** Fallback token posts when live news is unavailable (no invented headlines). */
const TOKEN_FALLBACKS: Record<CryptoThemeId, string> = {
  vision: `REJU is launching soon as a long-term token with an ecosystem attached.
It opens the door to the Rejuvenation Event and the Transformation Book people author inside the program.
Follow the Event at ${EVENT_HANDLE} ${HOME_LINK}`,
  trust_lock: `REJU is launching soon. Path B: lock $600 in REJU for 6 months, non-custodial, you keep the keys.
That lock opens the Rejuvenation Event and the book you author.
Follow the Event at ${EVENT_HANDLE} ${ONBOARDING_LINK}`,
  bridge: `REJU is launching soon with an ecosystem attached to the token.
The token opens the door to the Rejuvenation Event and program. Details at ${HOME_LINK}
Follow the Event at ${EVENT_HANDLE}`,
  question: `What should a token still be doing after launch week?
REJU is built to last: door to the Rejuvenation Event, ecosystem attached, Transformation Book you author.
Follow the Event at ${EVENT_HANDLE} ${HOME_LINK}`,
};

const EVENT_IMAGES: Record<RejuvenationThemeId, string> = {
  renew: "Calm figure at sunrise with a journal. Gold light on dark ground. REJU recovery. No URL.",
  event_book: "Journal and hardcover book beside a simple same-place selfie setup. Gold-on-dark. No URL.",
  practice: "Walking at dawn with water, gold light. Quiet lymphatic-motion wellness. No URL.",
  enter: "Two quiet doors into a six-week path. Dark gold editorial. No URL.",
};

const TOKEN_IMAGES: Record<CryptoThemeId, string> = {
  vision: "A door opening onto a long-term rejuvenation path and finished book. Dark gold. No URL.",
  trust_lock: "A lock as a ticket, keys remaining with the holder. Dark gold. No URL.",
  bridge: "Token ecosystem map opening onto a rejuvenation event. Dark gold. No URL.",
  question: "A living program after launch week, person with journal. Dark gold. No URL.",
};

export interface ScheduledPostConfig {
  category: PostCategory;
  themes: string[];
  dayName: string;
  shouldGenerate: boolean;
  customFocus: string;
}

export interface GeneratePostInput {
  selectedThemes: string[];
  coreCategory?: PostCategory;
  customFocus?: string;
  postType: "single" | "thread";
  tone: string;
  includeVisual: boolean;
  researchContext?: ResearchNote[];
  conceptMatches?: unknown;
  variantSeed?: number;
  includeHomeLink?: boolean;
  linkUrl?: string | null;
  investorDayCopy?: boolean;
  onboardingCopy?: boolean;
  enrollmentOpen?: boolean;
}

export interface GeneratedPost {
  text: string;
  thread?: string[];
  imagePrompt: string;
  hashtags: string;
  theme: string;
  category: PostCategory;
}

export type SlotPostSpec = {
  category: "crypto" | "rejuvenation";
  themes: string[];
  customFocus: string;
  account: "crypto" | "rejuvenation";
  linkUrl: string | null;
  investorDayCopy: boolean;
  onboardingCopy: boolean;
  enrollmentOpen?: boolean;
};

export type DualSlotPlan = {
  slot: PostSlot;
  dayName: string;
  relation: string;
  posts: SlotPostSpec[];
};

function getThemeCategory(themeId: string): PostCategory | null {
  if ((EVENT_PILLARS as readonly string[]).includes(themeId)) return "rejuvenation";
  if ((TOKEN_PILLARS as readonly string[]).includes(themeId)) return "crypto";
  if (["health", "ketosis", "cellular_repair", "immunity", "lymphatic", "event"].includes(themeId)) {
    return "rejuvenation";
  }
  return "crypto";
}

export function resolveCoreCategory(
  selectedThemes: string[],
  explicit?: PostCategory
): PostCategory {
  if (explicit === "crypto" || explicit === "rejuvenation") return explicit;
  return getThemeCategory(selectedThemes[0] || "") || "rejuvenation";
}

export function filterThemesForCategory(themes: string[], category: PostCategory): string[] {
  return themes.filter((t) => getThemeCategory(t) === category);
}

function mapToPillar(themeId: string, category: PostCategory): string {
  if (category === "rejuvenation") {
    if ((EVENT_PILLARS as readonly string[]).includes(themeId)) return themeId;
    if (themeId === "event") return "event_book";
    if (["ketosis", "cellular_repair", "immunity", "lymphatic"].includes(themeId)) return "practice";
    return "renew";
  }
  if ((TOKEN_PILLARS as readonly string[]).includes(themeId)) return themeId;
  if (themeId === "token_utility") return "trust_lock";
  return "vision";
}

export function resolvePostSlot(now: Date = new Date(), query?: string | null): PostSlot {
  if (query === "morning" || query === "afternoon") return query;
  // Fallback when cron path has no ?slot=: UTC 14 = morning, UTC 22 = afternoon.
  const hour = now.getUTCHours();
  if (hour >= 19) return "afternoon";
  return "morning";
}

export function isRejunomicsPromoDay(_now: Date): boolean {
  return false;
}

export function linkForAutoPost(): string | null {
  return null;
}

function eventPost(now: Date): SlotPostSpec {
  const day = now.getDay();
  const eventPillar = EVENT_BY_DAY[day];
  return {
    category: "rejuvenation",
    themes: [eventPillar],
    customFocus: THEMES_MAP[eventPillar],
    account: "rejuvenation",
    linkUrl: null,
    investorDayCopy: false,
    onboardingCopy: false,
  };
}

function tokenPost(now: Date): SlotPostSpec {
  const day = now.getDay();
  const tokenPillar = TOKEN_BY_DAY[day];
  return {
    category: "crypto",
    themes: [tokenPillar],
    customFocus: THEMES_MAP[tokenPillar],
    account: "crypto",
    linkUrl: null,
    investorDayCopy: false,
    onboardingCopy: false,
  };
}

export function getDualSlotPlan(now: Date = new Date(), slot?: PostSlot): DualSlotPlan {
  const resolved = slot ?? resolvePostSlot(now);
  return {
    slot: resolved,
    dayName: DAY_NAMES[now.getDay()],
    relation:
      "Both accounts once daily at 7:00 AM California. Event on @REJUvenationTKN and news+bridge crypto door on @REJUTOKEN. Afternoon slot kept for later.",
    // Afternoon schedule is off; keep slot code ready if we turn it back on.
    posts: resolved === "afternoon" ? [] : [eventPost(now), tokenPost(now)],
  };
}

export function getScheduledPostConfig(date: Date = new Date()): ScheduledPostConfig {
  const day = date.getDay();
  return {
    category: "rejuvenation",
    themes: [EVENT_BY_DAY[day]],
    dayName: DAY_NAMES[day],
    shouldGenerate: true,
    customFocus: THEMES_MAP[EVENT_BY_DAY[day]],
  };
}

function stripDashes(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, ",")
    .replace(/\s*,\s*,+/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function fitTweet(text: string): string {
  const trimmed = stripDashes(text.replace(/\n{3,}/g, "\n\n").trim());
  if (trimmed.length <= X_SINGLE_MAX) return trimmed;
  const cut = trimmed.slice(0, X_SINGLE_MAX - 1);
  const lastBreak = Math.max(cut.lastIndexOf("\n"), cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return (lastBreak > 160 ? cut.slice(0, lastBreak) : cut).trim();
}

function eventText(pillar: string, enrollmentOpen: boolean): string {
  if (pillar === "enter") {
    if (enrollmentOpen) {
      return `Two ways into the Rejuvenation Event:
Pay $600. Or lock $600 in REJU for 6 months. You keep the keys.
Both paths include Kat's Legacy ($69) and the book you author. ${ONBOARDING_LINK}`;
    }
    return EVENT_TEMPLATES.enter;
  }
  return EVENT_TEMPLATES[(pillar as RejuvenationThemeId) in EVENT_TEMPLATES ? (pillar as RejuvenationThemeId) : "renew"];
}

function headlineFromNote(note: ResearchNote): string {
  const raw = (note.text || "").split(":")[0] || note.text || "";
  return stripDashes(
    raw
      .replace(/\s+[-|]\s+[^-|]+$/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function scoreHeadline(text: string): number {
  if (!text || text.length < 24) return -100;
  if (NEWS_SKIP.test(text) || BANNED.test(text)) return -100;
  let score = 0;
  if (NEWS_PREFER.test(text)) score += 5;
  if (/\b(bitcoin|ethereum|crypto|token|blockchain|defi|rwa)\b/i.test(text)) score += 2;
  if (text.length > 140) score -= 1;
  return score;
}

/** Pick a relevant live headline for the news hook. Returns null if nothing usable (do not invent). */
export function pickCryptoHeadline(
  notes: ResearchNote[] | undefined,
  seed = 0
): string | null {
  if (!notes || notes.length === 0) return null;
  const scored = notes
    .map((n) => {
      const headline = headlineFromNote(n);
      return { headline, score: scoreHeadline(headline) };
    })
    .filter((x) => x.score >= 0 && x.headline.length >= 24);

  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.min(6, scored.length));
  const idx = Math.abs(seed) % top.length;
  let hook = top[idx].headline;
  if (hook.length > 110) {
    const cut = hook.slice(0, 107);
    const sp = cut.lastIndexOf(" ");
    hook = (sp > 40 ? cut.slice(0, sp) : cut).trim() + "...";
  }
  // Prefer ending on word boundary; keep as a plain news lead (no "what happened today" framing).
  if (!/[.!?]$/.test(hook)) hook = `${hook}.`;
  return hook;
}

function bridgeLines(angle: TokenBridgeAngle, variant: number): string {
  const v = Math.abs(variant) % 3;
  switch (angle) {
    case "long_term":
      return [
        `REJU is launching soon, built for the long term with an ecosystem attached. The token opens the door to the Rejuvenation Event and the Transformation Book people author. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU launches soon as a long-term door into rejuvenation: ecosystem attached, Event and Transformation Book inside the program. Follow the Event at ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU is launching soon. Long-term design, ecosystem attached, door to the Rejuvenation Event. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
      ][v];
    case "ecosystem":
      return [
        `REJU is launching soon with an ecosystem attached to the token. That ecosystem opens the door to the Rejuvenation Event and program. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU token launching soon. Ecosystem attached. Door to the Rejuvenation Event where people renew and author a Transformation Book. ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU is launching soon. Token plus attached ecosystem, built to last past launch week, door to the Event. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
      ][v];
    case "door":
      return [
        `REJU is launching soon. The token opens the door to the Rejuvenation Event and the Transformation Book you author. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU launching soon: a door into the Rejuvenation Event and program. Long-term, ecosystem attached. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU is the door to rejuvenation. Token launching soon, Event and book inside the program. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
      ][v];
    case "book":
      return [
        `REJU is launching soon. Token opens the Event where people author their Transformation Book. Built to last, ecosystem attached. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
        `After launch week, REJU still opens a living Event and the Transformation Book people write. Launching soon. Follow ${EVENT_HANDLE} ${HOME_LINK}`,
        `REJU launching soon: long-term token, ecosystem attached, door to the Event and the book you author. ${EVENT_HANDLE} ${HOME_LINK}`,
      ][v];
    case "path_b":
      return [
        `REJU is launching soon. Path B: lock $600 in REJU for 6 months, non-custodial, you keep the keys. That lock opens the Event and the book. Follow ${EVENT_HANDLE} ${ONBOARDING_LINK}`,
        `REJU launching soon. Path B locks $600 in REJU for 6 months (you keep the keys) and opens the Rejuvenation Event plus Transformation Book. ${EVENT_HANDLE} ${ONBOARDING_LINK}`,
        `REJU is launching soon. A 6-month $600 REJU lock (Path B, keys stay with you) opens the Event and the book you author. ${EVENT_HANDLE} ${ONBOARDING_LINK}`,
      ][v];
    default:
      return TOKEN_FALLBACKS.vision;
  }
}

/**
 * @REJUTOKEN voice (Wilson approved 2026-10-05):
 * 1) Lead with relevant crypto news when available.
 * 2) Bridge plainly to REJU for cold readers (launching soon, long-term, ecosystem, Event door, Transformation Book).
 * 3) Concepts as positives. No em/en dashes. No banned themes. No negative-contrast copy.
 */
export function tokenCopy(opts: {
  pillar?: string;
  researchContext?: ResearchNote[];
  variantSeed?: number;
}): string {
  const pillar = (
    (opts.pillar as CryptoThemeId) in PILLAR_TO_BRIDGE ? (opts.pillar as CryptoThemeId) : "vision"
  ) as CryptoThemeId;
  const seed = opts.variantSeed ?? 0;
  const angle = PILLAR_TO_BRIDGE[pillar];
  // Rotate book angle toward "door" on alternate seeds for more variety on question days.
  const effectiveAngle: TokenBridgeAngle =
    angle === "book" && seed % 2 === 1 ? "door" : angle;

  const hook = pickCryptoHeadline(opts.researchContext, seed);
  const bridge = bridgeLines(effectiveAngle, seed);
  const combined = hook ? `${hook}\n${bridge}` : TOKEN_FALLBACKS[pillar];
  const text = fitTweet(combined);

  if (BANNED.test(text) || /[\u2013\u2014]/.test(text)) {
    return fitTweet(TOKEN_FALLBACKS[pillar]);
  }
  return text;
}

function tokenText(pillar: string, research?: ResearchNote[], seed = 0): string {
  return tokenCopy({ pillar, researchContext: research, variantSeed: seed });
}

export function generateHighQualityPost(input: GeneratePostInput): GeneratedPost {
  const category = resolveCoreCategory(input.selectedThemes || [], input.coreCategory);
  const rawTheme = (input.selectedThemes || [])[0] || (category === "crypto" ? "vision" : "renew");
  const pillar = mapToPillar(rawTheme, category);
  const enrollmentOpen =
    input.enrollmentOpen !== undefined ? Boolean(input.enrollmentOpen) : SITE_NEWS.enrollmentOpen;
  const seed = input.variantSeed ?? 0;

  const built =
    category === "crypto"
      ? {
          text: tokenText(pillar, input.researchContext, seed),
          image: TOKEN_IMAGES[(pillar as CryptoThemeId) in TOKEN_IMAGES ? (pillar as CryptoThemeId) : "vision"],
          tags: "#REJU #RejuvenationEvent",
        }
      : {
          text: eventText(pillar, enrollmentOpen),
          image: EVENT_IMAGES[(pillar as RejuvenationThemeId) in EVENT_IMAGES ? (pillar as RejuvenationThemeId) : "renew"],
          tags: "#Rejuvenation #REJU",
        };

  let text = fitTweet(built.text);
  if (BANNED.test(text)) {
    text =
      category === "crypto"
        ? fitTweet(TOKEN_FALLBACKS.vision)
        : fitTweet(EVENT_TEMPLATES.renew);
  }

  return {
    text,
    imagePrompt: input.includeVisual ? built.image : "",
    hashtags: built.tags,
    theme: THEMES_MAP[pillar] || pillar,
    category,
  };
}
