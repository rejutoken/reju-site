// Two-account engine. We sell rejuvenation. Token is a door.
// Once a day at 7:00 AM California: EVENT (@REJUvenationTKN) + TOKEN (@rejutoken).

import { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION } from "./katsLegacyBook";
import type { ResearchNote } from "./postResearch";
import { SITE_NEWS } from "./siteNews";

const X_SINGLE_MAX = 280;
const PROGRAM_LINK = "rejutkn.com/program";
const ONBOARDING_LINK = "rejutkn.com/onboarding";
const HOME_LINK = "rejutkn.com";

const BANNED =
  /rejunomics|allocation clarity|token intent|what happened in crypto today|clarity act|kalshi|coinbase premium|pasted news/i;

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
  renew: "EVENT — renew",
  practice: "EVENT — practice",
  event_book: "EVENT — book",
  enter: "EVENT — enter",
  vision: "TOKEN — vision",
  trust_lock: "TOKEN — lock",
  bridge: "TOKEN — bridge",
  question: "TOKEN — question",
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

const EVENT_TEMPLATES: Record<RejuvenationThemeId, string> = {
  renew: `Rejuvenation is not eleven protocols in a cart.
It is one path: recover the baseline, renew the days, write them down.
The Rejuvenation Event is that path. You leave with a Transformation Book that is yours. ${PROGRAM_LINK}`,
  event_book: `Every day of the Event becomes a chapter.
Journal the day. Same place, same light, same camera. At the end you hold a publishable book — your recovery on paper.
That is the work. ${PROGRAM_LINK}`,
  practice: `The lymphatic system has no pump. It moves when you do — water and motion.
Chapter 1 of Kat's Legacy starts there. The Event turns the page into a week you can finish. ${PROGRAM_LINK}`,
  enter: `Two ways into the Rejuvenation Event:
Pay $600. Or lock $600 in REJU for 6 months — you keep the keys.
Both paths include Kat's Legacy ($69) and the book you author. Enrollment opens when rejutkn.com says it is open.`,
};

const TOKEN_TEMPLATES: Record<CryptoThemeId, string> = {
  vision: `Most tokens end at launch week.
REJU was built so month seven is a person in a Rejuvenation Event authoring their Transformation Book.
Built to trust. You keep the keys. The Event → @REJUvenationTKN ${HOME_LINK}`,
  trust_lock: `The token is a door.
Lock $600 in REJU for 6 months on Streamflow. Non-custodial. It returns to your wallet. That lock opens the Event and the book.
${ONBOARDING_LINK}`,
  bridge: `Path B: lock $600 in REJU for 6 months. Non-custodial. You keep the keys.
That lock opens the Rejuvenation Event and the book you author.
The Event → @REJUvenationTKN ${ONBOARDING_LINK}`,
  question: `What should a token still be doing after launch week?
A living Event. Month seven is a person rejuvenating — renewing their health — and authoring their book.
The Event → @REJUvenationTKN ${HOME_LINK}`,
};

const EVENT_IMAGES: Record<RejuvenationThemeId, string> = {
  renew: "Calm figure at sunrise with a journal. Gold light on dark ground. REJU recovery. No URL.",
  event_book: "Journal and hardcover book beside a simple same-place selfie setup. Gold-on-dark. No URL.",
  practice: "Walking at dawn with water, gold light. Quiet lymphatic-motion wellness. No URL.",
  enter: "Two quiet doors into a six-week path. Dark gold editorial. No URL.",
};

const TOKEN_IMAGES: Record<CryptoThemeId, string> = {
  vision: "Launch-week fade versus month seven: a person with their book. Dark gold. No URL.",
  trust_lock: "A lock as a ticket, keys remaining with the holder. Dark gold. No URL.",
  bridge: "A door opening onto a six-week rejuvenation path. Dark gold. No URL.",
  question: "A living program after launch week, not a chart. Dark gold. No URL.",
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
  return "morning";
}

export function isRejunomicsPromoDay(_now: Date): boolean {
  return false;
}

export function linkForAutoPost(): string | null {
  return null;
}

function dailyPosts(now: Date): SlotPostSpec[] {
  const day = now.getDay();
  const eventPillar = EVENT_BY_DAY[day];
  const tokenPillar = TOKEN_BY_DAY[day];
  return [
    {
      category: "rejuvenation",
      themes: [eventPillar],
      customFocus: THEMES_MAP[eventPillar],
      account: "rejuvenation",
      linkUrl: null,
      investorDayCopy: false,
      onboardingCopy: false,
    },
    {
      category: "crypto",
      themes: [tokenPillar],
      customFocus: THEMES_MAP[tokenPillar],
      account: "crypto",
      linkUrl: null,
      investorDayCopy: false,
      onboardingCopy: false,
    },
  ];
}

export function getDualSlotPlan(now: Date = new Date(), slot?: PostSlot): DualSlotPlan {
  const resolved = slot ?? resolvePostSlot(now);
  return {
    slot: resolved,
    dayName: DAY_NAMES[now.getDay()],
    relation: "Once a day at 7:00 AM California: Event voice and token door. Same product.",
    posts: resolved === "afternoon" ? [] : dailyPosts(now),
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

function fitTweet(text: string): string {
  const trimmed = text.replace(/\n{3,}/g, "\n\n").trim();
  if (trimmed.length <= X_SINGLE_MAX) return trimmed;
  return trimmed.slice(0, X_SINGLE_MAX - 1).trim();
}

function eventText(pillar: string, enrollmentOpen: boolean): string {
  if (pillar === "enter") {
    if (enrollmentOpen) {
      return `Two ways into the Rejuvenation Event:
Pay $600. Or lock $600 in REJU for 6 months — you keep the keys.
Both paths include Kat's Legacy ($69) and the book you author. ${ONBOARDING_LINK}`;
    }
    return EVENT_TEMPLATES.enter;
  }
  return EVENT_TEMPLATES[(pillar as RejuvenationThemeId) in EVENT_TEMPLATES ? (pillar as RejuvenationThemeId) : "renew"];
}

function tokenText(pillar: string): string {
  return TOKEN_TEMPLATES[(pillar as CryptoThemeId) in TOKEN_TEMPLATES ? (pillar as CryptoThemeId) : "vision"];
}

export function generateHighQualityPost(input: GeneratePostInput): GeneratedPost {
  const category = resolveCoreCategory(input.selectedThemes || [], input.coreCategory);
  const rawTheme = (input.selectedThemes || [])[0] || (category === "crypto" ? "vision" : "renew");
  const pillar = mapToPillar(rawTheme, category);
  const enrollmentOpen =
    input.enrollmentOpen !== undefined ? Boolean(input.enrollmentOpen) : SITE_NEWS.enrollmentOpen;

  const built =
    category === "crypto"
      ? {
          text: tokenText(pillar),
          image: TOKEN_IMAGES[(pillar as CryptoThemeId) in TOKEN_IMAGES ? (pillar as CryptoThemeId) : "vision"],
          tags: "#REJU #RejuvenationEvent",
        }
      : {
          text: eventText(pillar, enrollmentOpen),
          image: EVENT_IMAGES[(pillar as RejuvenationThemeId) in EVENT_IMAGES ? (pillar as RejuvenationThemeId) : "renew"],
          tags: "#Rejuvenation #REJU",
        };

  let text = fitTweet(built.text);
  if (BANNED.test(text) || (input.researchContext && input.researchContext.length > 0 && /news|headline|kalshi/i.test(text))) {
    text =
      category === "crypto"
        ? fitTweet(TOKEN_TEMPLATES.vision)
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
