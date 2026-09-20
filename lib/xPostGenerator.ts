// Two-account post engine: EVENT (@REJUvenationTKN) and TOKEN (@rejutoken).
// Product is the Rejuvenation Event and the book. Token is a door.

import {
  getBookSinglePostForTheme,
  KATS_LEGACY_BOOK,
  REJUVENATION_POST_INSTRUCTION,
} from "./katsLegacyBook";
import type { ResearchNote } from "./postResearch";

const X_SINGLE_MAX = 280;
const HOME_LINK = "rejutkn.com";
const PROGRAM_LINK = "rejutkn.com/program";
const ONBOARDING_LINK = "rejutkn.com/onboarding";

const BANNED =
  /rejunomics|allocation clarity|token intent|what happened in crypto today|clarity act/i;

export { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION };
export type { ResearchNote };

export type PostCategory = "crypto" | "rejuvenation" | "rest";
export type PostSlot = "morning" | "afternoon";

export const EVENT_PILLARS = ["renew", "practice", "event_book", "enter"] as const;
export const TOKEN_PILLARS = ["vision", "trust_lock", "bridge", "question"] as const;

export const REJUVENATION_THEME_IDS = EVENT_PILLARS;
export const CRYPTO_THEME_IDS = TOKEN_PILLARS;

export type RejuvenationThemeId = (typeof EVENT_PILLARS)[number];
export type CryptoThemeId = (typeof TOKEN_PILLARS)[number];

export const THEMES_MAP: Record<string, string> = {
  renew: "Renew / recover",
  practice: "Practice from Kat's Legacy",
  event_book: "Event + book",
  enter: "How you enter",
  vision: "Month seven is the Event",
  trust_lock: "Lock / you keep the keys",
  bridge: "Path B opens the Event",
  question: "What a token should still be doing",
  health: "Renew / recover",
  ketosis: "Practice from Kat's Legacy",
  cellular_repair: "Practice from Kat's Legacy",
  immunity: "Practice from Kat's Legacy",
  lymphatic: "Practice from Kat's Legacy",
  event: "Event + book",
  bitcoin_news: "Month seven is the Event",
  crypto_news: "Month seven is the Event",
  crypto_news_today: "Month seven is the Event",
  crypto_policy: "Lock / you keep the keys",
  crypto_international: "Path B opens the Event",
  crypto_trends: "What a token should still be doing",
  rejunomics: "Month seven is the Event",
  industry: "Month seven is the Event",
  crypto: "Month seven is the Event",
  token_utility: "Lock / you keep the keys",
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
  const first = selectedThemes[0];
  return getThemeCategory(first || "") || "rejuvenation";
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
  if (themeId === "token_utility" || themeId === "trust_lock") return "trust_lock";
  if (themeId === "question") return "question";
  if (themeId === "bridge") return "bridge";
  return "vision";
}

export function resolvePostSlot(now: Date = new Date(), query?: string | null): PostSlot {
  if (query === "morning" || query === "afternoon") return query;
  return now.getUTCHours() < 19 ? "morning" : "afternoon";
}

export function isRejunomicsPromoDay(_now: Date): boolean {
  return false;
}

export function linkForAutoPost(
  _now: Date,
  category: PostCategory,
  _slot?: PostSlot
): string | null {
  return category === "crypto" ? HOME_LINK : PROGRAM_LINK;
}

export function getDualSlotPlan(now: Date = new Date(), slot?: PostSlot): DualSlotPlan {
  const resolved = slot ?? resolvePostSlot(now);
  const day = now.getDay();
  const eventPillar = EVENT_BY_DAY[day];
  const tokenPillar = TOKEN_BY_DAY[day];

  const eventPost: SlotPostSpec = {
    category: "rejuvenation",
    themes: [eventPillar],
    customFocus: THEMES_MAP[eventPillar],
    account: "rejuvenation",
    linkUrl: eventPillar === "enter" ? ONBOARDING_LINK : PROGRAM_LINK,
    investorDayCopy: false,
    onboardingCopy: false,
  };

  const tokenPost: SlotPostSpec = {
    category: "crypto",
    themes: [tokenPillar],
    customFocus: THEMES_MAP[tokenPillar],
    account: "crypto",
    linkUrl: tokenPillar === "trust_lock" || tokenPillar === "bridge" ? ONBOARDING_LINK : HOME_LINK,
    investorDayCopy: false,
    onboardingCopy: false,
  };

  return {
    slot: resolved,
    dayName: DAY_NAMES[day],
    relation: "Same product, two doors: Event voice in the morning, token door in the afternoon.",
    posts: resolved === "morning" ? [eventPost] : [tokenPost],
  };
}

export function getScheduledPostConfig(date: Date = new Date()): ScheduledPostConfig {
  const day = date.getDay();
  const morning = date.getUTCHours() < 19;
  const themes = morning ? [EVENT_BY_DAY[day]] : [TOKEN_BY_DAY[day]];
  return {
    category: morning ? "rejuvenation" : "crypto",
    themes,
    dayName: DAY_NAMES[day],
    shouldGenerate: true,
    customFocus: THEMES_MAP[themes[0]],
  };
}

function smartComplete(text: string, max: number): string {
  if (text.length <= max) return text;
  let cut = text.slice(0, max - 3);
  const lastBreak = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n"));
  if (lastBreak > 80) cut = cut.slice(0, lastBreak + 1);
  return cut.trim() + "...";
}

function withLink(text: string, link: string | null): string {
  const clean = text
    .replace(/https?:\/\/(?:www\.)?rejutkn\.com(?:\/[^\s]*)?/gi, "")
    .replace(/\brejutkn\.com(?:\/[^\s]*)?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!link) return clean.slice(0, X_SINGLE_MAX);
  const tagged = `${clean} ${link}`;
  return tagged.length <= X_SINGLE_MAX ? tagged : `${smartComplete(clean, X_SINGLE_MAX - link.length - 1)} ${link}`;
}

function pick<T>(items: T[], seed: number): T {
  return items[Math.abs(seed) % items.length];
}

function eventCopy(pillar: string, seed: number, enrollmentOpen: boolean): { text: string; image: string; tags: string } {
  if (pillar === "practice") {
    const book =
      getBookSinglePostForTheme("lymphatic", new Date(), seed) ||
      getBookSinglePostForTheme("health", new Date(), seed) ||
      "The lymphatic system has no pump. It moves when you do — water and motion.";
    return {
      text: `${book.replace(/→.*$/, "").trim()} The Event turns the page into a week you can finish.`,
      image: "Quiet wellness photograph: walking at dawn, water, gold light. REJU rejuvenation aesthetic. No URL.",
      tags: "#Rejuvenation #REJU #KatsLegacy",
    };
  }

  if (pillar === "event_book") {
    return {
      text: pick(
        [
          "Every day of the Event becomes a chapter. Journal the day. Same place, same light, same camera. At the end you hold a publishable book — your recovery on paper.",
          "You are the author. Daily input builds the Transformation Book. REJU is the editorial partner. That is the work.",
          "Health Benchmark on day one. Journal and selfies through the weeks. At the end you hold the book you wrote.",
        ],
        seed
      ),
      image: "Person journaling at a table with a hardcover book and a simple selfie setup. Gold-on-dark REJU wellness. No URL.",
      tags: "#RejuvenationEvent #TransformationBook #REJU",
    };
  }

  if (pillar === "enter") {
    const openLine = enrollmentOpen
      ? "Choose your path on the site when you are ready."
      : "Enrollment opens when rejutkn.com says it is open.";
    return {
      text: pick(
        [
          `Two ways into the Rejuvenation Event: pay $600, or lock $600 in REJU for 6 months — you keep the keys. Both include Kat's Legacy ($69) and the book you author. ${openLine}`,
          `The Event is the product. Enter with fiat or a 6-month lock. $69 for Kat's Legacy. Then you write the book. ${openLine}`,
        ],
        seed
      ),
      image: "Two quiet doors into a wellness program: a simple path, gold dark editorial. No URL.",
      tags: "#RejuvenationEvent #REJU",
    };
  }

  return {
    text: pick(
      [
        "Rejuvenate in 6 weeks. That is the product: rejuvenation, done by renewing your health. One path. You leave with a Transformation Book that is yours.",
        "Rejuvenation is the product. You renew your health in a structured Event, document the days, and leave with a book you authored.",
        "Rejuvenate in 6 weeks by renewing your health. Health Benchmark, daily work, then a book that is yours.",
      ],
      seed
    ),
    image: "Calm figure at sunrise, journal open, gold light on dark ground. REJU recovery aesthetic. No URL.",
    tags: "#Rejuvenation #HealthReset #REJU",
  };
}

function tokenCopy(pillar: string, seed: number, quoteEvent: boolean): { text: string; image: string; tags: string } {
  if (quoteEvent) {
    return {
      text: "Most tokens end at launch week. REJU was built so month seven is a person in a Rejuvenation Event authoring their Transformation Book. Built to trust. You keep the keys. The Event → @REJUvenationTKN",
      image: "Month-seven calendar meeting a person with a hardcover book. Dark gold editorial. No URL.",
      tags: "#REJU #RejuvenationEvent",
    };
  }

  if (pillar === "trust_lock") {
    return {
      text: pick(
        [
          "The token is a door. Lock $600 in REJU for 6 months on Streamflow. Non-custodial. It returns to your wallet. That lock opens the Event and the book.",
          "Built to trust. You keep the keys. A 6-month lock is the ticket into the Rejuvenation Event — not a listing week.",
        ],
        seed
      ),
      image: "Non-custodial lock as a ticket, keys remaining with the holder. Dark gold, no URL.",
      tags: "#REJU #YouKeepTheKeys",
    };
  }

  if (pillar === "bridge") {
    return {
      text: pick(
        [
          "Path B: lock $600 REJU for six months. That lock opens the Rejuvenation Event and the Transformation Book. The Event → @REJUvenationTKN",
          "Crypto language, same product: lock opens the Event. Month seven is a person writing their book. → @REJUvenationTKN",
        ],
        seed
      ),
      image: "A door opening onto a six-week rejuvenation path. Dark gold editorial. No URL.",
      tags: "#REJU #RejuvenationEvent",
    };
  }

  if (pillar === "question") {
    return {
      text: "What should a token still be doing after incentives end? A living Event. Month seven is someone in the Rejuvenation Event authoring their book. → @REJUvenationTKN",
      image: "A quiet question mark over a living program, not a chart. Dark gold. No URL.",
      tags: "#REJU #RejuvenationEvent",
    };
  }

  return {
    text: pick(
      [
        "Most tokens end at launch week. REJU was built so month seven is a person in a Rejuvenation Event authoring their Transformation Book. Built to trust. You keep the keys. The Event → @REJUvenationTKN",
        "We are not selling a coin as the product. Rejuvenation is the product: rejuvenate in 6 weeks by renewing your health. The token is a door. → @REJUvenationTKN",
      ],
      seed
    ),
    image: "Launch-week fade versus month seven: a person with their book. Dark gold. No URL.",
    tags: "#REJU #RejuvenationEvent",
  };
}

export function generateHighQualityPost(input: GeneratePostInput): GeneratedPost {
  const category = resolveCoreCategory(input.selectedThemes || [], input.coreCategory);
  const seed = input.variantSeed !== undefined ? Math.abs(input.variantSeed) : Date.now();
  const rawTheme = (input.selectedThemes || [])[0] || (category === "crypto" ? "vision" : "renew");
  const pillar = mapToPillar(rawTheme, category);
  const enrollmentOpen = Boolean(input.enrollmentOpen);
  const quoteEvent = category === "crypto" && new Date().getDay() === 0;

  const built =
    category === "crypto" ? tokenCopy(pillar, seed, quoteEvent) : eventCopy(pillar, seed, enrollmentOpen);

  const defaultLink =
    category === "crypto"
      ? pillar === "trust_lock" || pillar === "bridge"
        ? ONBOARDING_LINK
        : HOME_LINK
      : pillar === "enter"
        ? ONBOARDING_LINK
        : PROGRAM_LINK;

  const link =
    input.linkUrl !== undefined
      ? input.linkUrl
      : input.includeHomeLink === false
        ? null
        : defaultLink;

  let text = withLink(built.text, link);
  if (BANNED.test(text)) {
    text = withLink(
      "Rejuvenate in 6 weeks. Rejuvenation, by renewing your health.",
      PROGRAM_LINK
    );
  }

  return {
    text,
    imagePrompt: input.includeVisual ? built.image : "",
    hashtags: built.tags,
    theme: THEMES_MAP[pillar] || pillar,
    category,
  };
}
