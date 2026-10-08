// X Post Studio generator (manual drafts in /x-post). The daily auto posts use lib/xAutoEngine.ts;
// this module drafts from the same approved bank and bridge lines so manual and auto copy match.
//   @REJUvenationTKN: Event bank (fact, story, day, practice, question, status)
//   @REJUTOKEN: live headline + one sentence of take + REJU bridge, or a non-news bank post

import { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION } from "./katsLegacyBook";
import type { ResearchNote } from "./postResearch";
import { SITE_NEWS } from "./siteNews";
import {
  EVENT_BANK,
  EVENT_LINK,
  TAKES,
  TOKEN_BANK,
  TOKEN_BRIDGES,
  TOKEN_LINK,
  type BankPost,
} from "./xContentBank";
import { rankHeadlines, takeCategory } from "./xAutoEngine";
import { checkPost, weightedLength } from "./xQualityGate";

const X_SINGLE_MAX = 280;

export { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION };
export type { ResearchNote };

export type PostCategory = "crypto" | "rejuvenation" | "rest";

export const EVENT_PILLARS = ["renew", "practice", "event_book", "enter"] as const;
export const TOKEN_PILLARS = ["vision", "trust_lock", "bridge", "question"] as const;

export const REJUVENATION_THEME_IDS = EVENT_PILLARS;
export const CRYPTO_THEME_IDS = TOKEN_PILLARS;

export type RejuvenationThemeId = (typeof EVENT_PILLARS)[number];
export type CryptoThemeId = (typeof TOKEN_PILLARS)[number];

export const THEMES_MAP: Record<string, string> = {
  renew: "EVENT, story and status",
  practice: "EVENT, practice and Kat's Legacy facts",
  event_book: "EVENT, a day in the Event",
  enter: "EVENT, status and paths in",
  vision: "TOKEN, news hook or Event quote",
  trust_lock: "TOKEN, news hook or Path B",
  bridge: "TOKEN, news hook or build update",
  question: "TOKEN, news hook or question",
  health: "EVENT, practice and Kat's Legacy facts",
  ketosis: "EVENT, practice and Kat's Legacy facts",
  cellular_repair: "EVENT, practice and Kat's Legacy facts",
  immunity: "EVENT, practice and Kat's Legacy facts",
  lymphatic: "EVENT, practice and Kat's Legacy facts",
  event: "EVENT, a day in the Event",
};

const EVENT_THEME_TO_PILLARS: Record<string, string[]> = {
  renew: ["story", "status"],
  practice: ["practice", "fact"],
  event_book: ["day"],
  enter: ["status"],
  health: ["fact", "practice"],
  ketosis: ["fact"],
  cellular_repair: ["fact"],
  immunity: ["fact"],
  lymphatic: ["fact", "practice"],
  event: ["day", "status"],
};

const TOKEN_THEME_TO_PILLAR: Record<string, string> = {
  vision: "event_quote",
  trust_lock: "path_b",
  bridge: "build",
  question: "question",
  token_utility: "path_b",
};

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

function getThemeCategory(themeId: string): PostCategory | null {
  if ((EVENT_PILLARS as readonly string[]).includes(themeId)) return "rejuvenation";
  if ((TOKEN_PILLARS as readonly string[]).includes(themeId)) return "crypto";
  if (themeId in EVENT_THEME_TO_PILLARS) return "rejuvenation";
  return "crypto";
}

export function resolveCoreCategory(selectedThemes: string[], explicit?: PostCategory): PostCategory {
  if (explicit === "crypto" || explicit === "rejuvenation") return explicit;
  return getThemeCategory(selectedThemes[0] || "") || "rejuvenation";
}

export function filterThemesForCategory(themes: string[], category: PostCategory): string[] {
  return themes.filter((t) => getThemeCategory(t) === category);
}

function withLink(text: string, link: string | null): string {
  if (!link) return text;
  const joined = `${text}\n\n${link}`;
  return weightedLength(joined) <= X_SINGLE_MAX ? joined : text;
}

function pickFrom(pool: BankPost[], seed: number): BankPost {
  return pool[Math.abs(seed) % pool.length];
}

/** Best live headline for a news hook, or null (never invents a headline). */
export function pickCryptoHeadline(notes: ResearchNote[] | undefined, seed = 0): string | null {
  const ranked = rankHeadlines(notes, new Date(), []);
  if (ranked.length === 0) return null;
  const top = ranked.slice(0, Math.min(4, ranked.length));
  return top[Math.abs(seed) % top.length].headline;
}

/** @REJUTOKEN draft: headline + take + bridge when a fresh headline exists, else a bank post. */
export function tokenCopy(opts: { pillar?: string; researchContext?: ResearchNote[]; variantSeed?: number }): {
  text: string;
  cardLine: string;
} {
  const seed = Math.abs(opts.variantSeed ?? 0);
  const headline = pickCryptoHeadline(opts.researchContext, seed);
  if (headline) {
    const category = takeCategory(headline);
    const takes = TAKES.filter((t) => t.category === category);
    const take = (takes.length ? takes : TAKES)[seed % (takes.length || TAKES.length)];
    for (let i = 0; i < TOKEN_BRIDGES.length; i += 1) {
      const bridge = TOKEN_BRIDGES[(seed + i) % TOKEN_BRIDGES.length];
      const text = `${headline}\n\n${take.text} ${bridge.text}`;
      if (weightedLength(text) <= X_SINGLE_MAX) return { text, cardLine: bridge.cardLine };
    }
  }
  const pillar = TOKEN_THEME_TO_PILLAR[opts.pillar || ""] || "event_quote";
  const pool = TOKEN_BANK.filter((p) => p.pillar === pillar && !p.requiresApproval);
  const post = pickFrom(pool, seed);
  return { text: post.text, cardLine: post.cardLine };
}

export function generateHighQualityPost(input: GeneratePostInput): GeneratedPost {
  const category = resolveCoreCategory(input.selectedThemes || [], input.coreCategory);
  const theme = (input.selectedThemes || [])[0] || (category === "crypto" ? "vision" : "renew");
  const seed = input.variantSeed ?? Date.now();
  const enrollmentOpen = input.enrollmentOpen ?? SITE_NEWS.enrollmentOpen;

  let text: string;
  let cardLine: string;
  if (category === "crypto") {
    const draft = tokenCopy({ pillar: theme, researchContext: input.researchContext, variantSeed: seed });
    text = withLink(draft.text, input.linkUrl === null ? null : TOKEN_LINK);
    cardLine = draft.cardLine;
  } else {
    const pillars = EVENT_THEME_TO_PILLARS[theme] || ["fact", "practice"];
    const pool = EVENT_BANK.filter((p) => pillars.includes(p.pillar));
    const post = pickFrom(pool, seed);
    text = withLink(post.text, input.linkUrl === null || post.linkOk === false ? null : EVENT_LINK);
    cardLine = post.cardLine;
  }

  // Same gate as the auto posts (history-free here: the studio is for human review).
  const gate = checkPost(text, { account: category === "crypto" ? "crypto" : "rejuvenation", now: new Date(), history: [], enrollmentOpen });
  if (!gate.ok) {
    const safe = category === "crypto" ? TOKEN_BANK.find((p) => p.id === "tk-eq-what")! : EVENT_BANK.find((p) => p.id === "ev-status-ready")!;
    text = safe.text;
    cardLine = safe.cardLine;
  }

  return {
    text,
    imagePrompt: input.includeVisual ? `Branded REJU card (gold on dark), key line: "${cardLine}"` : "",
    hashtags: category === "crypto" ? "#REJU #RejuvenationEvent" : "#Rejuvenation #REJU",
    theme: THEMES_MAP[theme] || theme,
    category,
  };
}
