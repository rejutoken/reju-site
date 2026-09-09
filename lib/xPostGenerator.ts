// lib/xPostGenerator.ts
// Shared logic for generating high-quality REJU X posts
// Two core categories — never mixed in a single post:
//   1. Rejuvenation (health sciences + REJU Event) — grounded in Kat's Legacy (Amazon)
//   2. Crypto (Rejunomics, industry, token utility, news, trends)

import {
  getBookContentForTheme,
  getBookSinglePostForTheme,
  getBookThreadForTheme,
  KATS_LEGACY_BOOK,
  REJUVENATION_POST_INSTRUCTION,
} from "./katsLegacyBook";
import type { ConceptMatch } from "./conceptLibrary";
import { buildConceptBridge, getTopAlignedConcept } from "./conceptLibrary";
import type { ResearchNote } from "./postResearch";

const X_SINGLE_MAX = 280;
const HOME_LINK = "rejutkn.com";
const REJUNOMICS_PAGE_LINK = "rejutkn.com/rejunomics";
const PROGRAM_PAGE_LINK = "rejutkn.com/program";
/** Wednesday and Friday: Rejunomics on crypto, program link on rejuvenation. */
export const REJUNOMICS_PROMO_WEEKDAYS = new Set([3, 5]);

export { KATS_LEGACY_BOOK, REJUVENATION_POST_INSTRUCTION };
export type { ResearchNote };

export type PostCategory = "crypto" | "rejuvenation" | "rest";

export const REJUVENATION_THEME_IDS = [
  "health",
  "ketosis",
  "cellular_repair",
  "immunity",
  "lymphatic",
  "event",
] as const;

export const CRYPTO_THEME_IDS = [
  "rejunomics",
  "industry",
  "crypto",
  "token_utility",
  "crypto_news",
  "crypto_news_today",
  "crypto_trends",
] as const;

export type RejuvenationThemeId = (typeof REJUVENATION_THEME_IDS)[number];
export type CryptoThemeId = (typeof CRYPTO_THEME_IDS)[number];

export const THEMES_MAP: Record<string, string> = {
  rejunomics: "Rejunomics & Token Transparency",
  industry: "2026 Crypto Industry Analysis",
  crypto: "Crypto Ecosystem & Participation",
  token_utility: "Token Utility & 6-Month Lock",
  crypto_news: "Token & Crypto News",
  crypto_news_today: "Today's Crypto News",
  crypto_trends: "Crypto Trends",
  health: "Autophagy & Fasting",
  ketosis: "Ketosis & Metabolic Flexibility",
  cellular_repair: "Cellular Repair & Renewal",
  immunity: "Immunity & Inflammation",
  lymphatic: "Lymphatic System & Detox",
  event: "REJU Rejuvenation Event",
};

const CRYPTO_DAYS = new Set([1, 3, 5]); // Mon, Wed, Fri
const REJUVENATION_DAYS = new Set([2, 4, 6]); // Tue, Thu, Sat
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SAT_REJUVENATION_ROTATION: RejuvenationThemeId[] = ["cellular_repair", "immunity", "lymphatic"];

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
  conceptMatches?: ConceptMatch[];
  variantSeed?: number;
  includeHomeLink?: boolean;
  linkUrl?: string | null;
  investorDayCopy?: boolean;
}

export interface GeneratedPost {
  text: string;
  thread?: string[];
  imagePrompt: string;
  hashtags: string;
  theme: string;
  category: PostCategory;
}

interface ThemeContent {
  hook: string;
  body: string;
  imagePrompt: string;
  hashtags: string;
}

const CRYPTO_CONTENT: Record<CryptoThemeId, ThemeContent> = {
  rejunomics: {
    hook: "Most tokenomics show you the map. Rejunomics shows you the terrain ahead.",
    body: "Traditional tokenomics lists allocations. Rejunomics discloses what happens next:\n\n• Release behavior & conditions\n• Finite incentive lifecycles\n• Real ecosystem activity after launch hype fades\n\nThis is how projects move from speculation to sustained participation.",
    imagePrompt:
      "Clean minimalist infographic comparing Traditional Tokenomics (pie chart) vs Rejunomics (flow diagram with release, incentives, continuity). Gold and dark background, professional crypto aesthetic.",
    hashtags: "#Rejunomics #TokenTransparency #Crypto",
  },
  industry: {
    hook: "53% of crypto projects fail. The survivors answer a different question.",
    body: "Most projects optimize for launch. Few plan for what happens when incentives fade and hype disappears.\n\nThe 2026 industry data is clear: transparency, continuity disclosures, and real post-launch activity separate survivors from statistics.\n\nREJU is built around that gap — not around another short-cycle narrative.",
    imagePrompt:
      "Data-driven crypto infographic showing project failure rates and continuity factors. Dark professional dashboard aesthetic with gold REJU accents.",
    hashtags: "#Crypto #Tokenomics #IndustryAnalysis #REJU",
  },
  crypto: {
    hook: "Speculation fills the room fast. Continuity keeps the lights on.",
    body: "Crypto ecosystems decay when participation has no structure after the initial rush.\n\nREJU approaches crypto as a long-horizon system: transparent economics, aligned incentives, and an ecosystem designed for ongoing engagement — not one-time extraction.",
    imagePrompt:
      "Abstract crypto ecosystem network with nodes representing sustained participation vs fading hype. Elegant dark gold REJU branding.",
    hashtags: "#Crypto #Web3 #Ecosystem #REJU",
  },
  token_utility: {
    hook: "A utility token earns its name when utility outlasts the launch window.",
    body: "REJU utility is tied to real commitment:\n\n• 6-month lock aligns long-term participation\n• Access to the Rejuvenation Event ecosystem\n• Education, certification, and documented transformation\n\nThis is token utility connected to behavior — not just narrative.",
    imagePrompt:
      "REJU token at center of a utility map: lock period, event access, certification, ecosystem continuity. Professional crypto product aesthetic.",
    hashtags: "#TokenUtility #REJU #Crypto #Rejunomics",
  },
  crypto_news: {
    hook: "Headlines move fast. Ecosystems that last answer a slower question.",
    body: "Token and crypto news cycles reward speed — but projects that survive publish what happens after the headline fades.\n\nREJU connects today's industry narrative to Rejunomics: release disclosures, finite incentives, and documented continuity beyond launch week.",
    imagePrompt:
      "News ticker overlay transitioning into a Rejunomics continuity timeline. Dark crypto dashboard with gold REJU accents.",
    hashtags: "#CryptoNews #Rejunomics #TokenTransparency #REJU",
  },
  crypto_news_today: {
    hook: "Today's crypto news is loud. Continuity is quiet — and decisive.",
    body: "Whatever dominates today's feed — regulation, launches, or market swings — the structural question stays the same: what happens when incentives end?\n\nREJU is built for that post-headline window with transparent economics and sustained ecosystem participation.",
    imagePrompt:
      "Split visual: breaking crypto news headlines on one side, REJU continuity framework on the other. Modern dark gold aesthetic.",
    hashtags: "#CryptoNews #Crypto #REJU #Rejunomics",
  },
  crypto_trends: {
    hook: "Trending assets rotate. Trending transparency doesn't.",
    body: "Crypto trends spotlight what's hot this week — but durable ecosystems disclose release behavior, incentive lifecycles, and post-hype activity.\n\nRejunomics maps that terrain so participants see beyond the trend cycle.",
    imagePrompt:
      "Trending crypto chart morphing into a Rejunomics disclosure diagram. Sleek dark background, gold highlights.",
    hashtags: "#CryptoTrends #Rejunomics #Crypto #REJU",
  },
};

const REJUVENATION_CONTENT: Record<Exclude<RejuvenationThemeId, "event">, ThemeContent> = {
  health: {
    hook: "Your cells know how to clean house. The question is: are you giving them the chance?",
    body: "Autophagy — your body's cellular recycling system — ramps up during fasting. It clears damaged components, supports repair, and extends healthspan.\n\nIn the REJU Rejuvenation Event™, daily practices through the REJU Protocol™ compound this renewal. Your journal entries become chapters in a book you author.",
    imagePrompt:
      "Serene image of a person journaling at sunrise during a fast. Soft golden light, subtle glowing cellular patterns representing autophagy. REJU wellness aesthetic.",
    hashtags: "#Autophagy #Fasting #CellularRenewal #REJU",
  },
  ketosis: {
    hook: "When glucose quiets down, ketones step up — and your metabolism remembers how to adapt.",
    body: "Ketosis begins when carbohydrate availability drops and the body converts stored fat into ketones — an alternative fuel for brain and body.\n\nWeeks 3–4 of the REJU Rejuvenation Event™ guide participants toward ketosis-supportive states through the REJU Protocol™ and Kat's JOL™.",
    imagePrompt:
      "Elegant diagram of metabolic flexibility: glucose and ketone pathways with a person in calm focus. Dark background, gold accents, REJU rejuvenation branding.",
    hashtags: "#Ketosis #MetabolicFlexibility #REJU #Rejuvenation",
  },
  cellular_repair: {
    hook: "Clearing damaged cells is only half the story. Repair and renewal complete the cycle.",
    body: "Autophagy removes what no longer serves. Cellular repair rebuilds what does — supporting mitochondrial quality, protein recycling, and resilience.\n\nThe REJU Rejuvenation Event™ structures this full cycle: fasting physiology, ketosis, autophagy, and ongoing cellular renewal — documented in your Transformation Book.",
    imagePrompt:
      "Abstract visualization of cellular components being recycled and renewed. Mitochondria glowing, repair pathways highlighted. REJU science-meets-wellness style.",
    hashtags: "#CellularRepair #CellularRenewal #Longevity #REJU",
  },
  immunity: {
    hook: "Renewal isn't vanity — it's how your immune system stays calibrated.",
    body: "Fasting and metabolic adaptation are associated with reduced inflammation and improved immune resilience. When the body isn't constantly processing excess fuel, repair pathways get priority.\n\nREJU participants track these shifts through daily journaling and establish a personal REJU Health Benchmark™.",
    imagePrompt:
      "Symbolic immune system visualization: shield formed from glowing cells, calm figure in meditation. Gold and deep navy, REJU health aesthetic.",
    hashtags: "#Immunity #Inflammation #Healthspan #REJU",
  },
  lymphatic: {
    hook: "Your lymphatic system has no pump. Movement, hydration, and fasting give it flow.",
    body: "The lymphatic network clears waste, supports immunity, and depends on daily movement and hydration — especially during fasting and rejuvenation protocols.\n\nThe REJU Rejuvenation Event™ integrates nourishment timing and structured practices so lymphatic support becomes part of a documented transformation.",
    imagePrompt:
      "Flowing lymphatic network illustration around a person walking at dawn. Gentle water-like currents, cellular glow, REJU gold-on-dark wellness design.",
    hashtags: "#LymphaticSystem #Detox #Rejuvenation #REJU",
  },
};

const REJUVENATION_EVENT_ADDENDUM =
  "The REJU Rejuvenation Event™ turns daily practice into documented transformation — your personal book, your Health Benchmark™, real skin in the game.";

const CRYPTO_SINGLE_POSTS: Record<CryptoThemeId, string[]> = {
  rejunomics: [
    "Most tokenomics show the map. Rejunomics shows the terrain — release behavior, finite incentives, and ecosystem continuity after hype fades. → rejutkn.com",
    "Allocations tell you who got what. Rejunomics tells you what happens next — release disclosures, incentive lifecycles, post-launch activity. → rejutkn.com",
    "Speculation needs a story. Continuity needs disclosures. Rejunomics maps release behavior and ecosystem activity beyond the launch window. → rejutkn.com",
  ],
  industry: [
    "53% of crypto projects fail. Survivors plan for what happens when incentives fade — transparency and continuity disclosures matter. REJU is built for that gap. → rejutkn.com",
    "Most projects answer 'How do we launch?' Few answer 'How do we continue?' REJU is designed around that survival gap. → rejutkn.com",
    "11.6M tokens failed in 2025 alone. The pattern: thin disclosures, fading incentives, no post-hype plan. Rejunomics addresses that structural gap. → rejutkn.com",
  ],
  crypto: [
    "Speculation fills the room fast. Continuity keeps the lights on. REJU is a long-horizon ecosystem — transparent economics and sustained participation. → rejutkn.com",
    "Crypto ecosystems decay when participation has no structure after the rush. REJU aligns incentives for ongoing engagement — not one-time extraction. → rejutkn.com",
    "Hype cycles end. Ecosystems that disclose economics and reward long-term participation don't. REJU is built for the post-rush window. → rejutkn.com",
  ],
  token_utility: [
    "REJU utility ties to real commitment: 6-month lock, Rejuvenation Event access, education, and documented transformation — not launch-window narrative. → rejutkn.com",
    "Utility that outlasts hype: lock REJU, join the Rejuvenation Event, earn certification, author your Transformation Book. → rejutkn.com",
    "A token earns utility when behavior follows — 6-month lock, structured rejuvenation, documented results. That's REJU. → rejutkn.com",
  ],
  crypto_news: [
    "Crypto headlines rotate daily. The structural question stays: what happens when incentives end? Rejunomics discloses release behavior and post-launch continuity. → rejutkn.com",
    "Today's token news is loud. Survivors publish what happens after the headline — release disclosures and ecosystem activity. That's Rejunomics. → rejutkn.com",
    "News cycles reward speed. Durable projects reward transparency. REJU connects today's narrative to disclosed economics. → rejutkn.com",
  ],
  crypto_news_today: [
    "Whatever dominates today's crypto feed — the continuity question remains. Rejunomics maps release behavior and post-hype ecosystem activity. → rejutkn.com",
    "Today's headlines fade. Transparent token economics don't. REJU is built for the window after the news cycle moves on. → rejutkn.com",
    "Breaking crypto news moves markets. Rejunomics moves participants from speculation to sustained engagement. → rejutkn.com",
  ],
  crypto_trends: [
    "Trending assets change weekly. Trending transparency doesn't. Rejunomics discloses release behavior and incentive lifecycles beyond the hype cycle. → rejutkn.com",
    "What's hot today may be gone tomorrow. Ecosystems with disclosed economics and real utility endure. REJU maps that terrain. → rejutkn.com",
    "Crypto trends spotlight momentum. Rejunomics spotlights continuity — what keeps an ecosystem alive after the trend passes. → rejutkn.com",
  ],
};

const WEDNESDAY_CLARITY_POSTS = [
  "The CLARITY Act asks originators to furnish supply, allocation, release, and purpose. Rejunomics answers with Allocation Clarity and Token Intent, a readable format the industry can adopt. See Rejunomics.",
  "Committee text already names launch, supply, release schedule, and purpose. Allocation Clarity and Token Intent put those facts in a standard reading. That helps the Act’s investor protection aim in practice.",
  "Tokenomics shows slices. Rejunomics names Allocation Clarity and Token Intent so the CLARITY Act’s disclosure aims have a comparable economic form. The industry can adopt it. See Rejunomics.",
  "CLARITY assigns who regulates digital assets. Rejunomics gives Allocation Clarity and Token Intent, holdings, release, and purpose in one disclosure practice. See Rejunomics.",
];

const WEDNESDAY_BRIDGES = [
  "CLARITY names supply, release, and purpose; Allocation Clarity and Token Intent give those facts a standard reading.",
  "Rejunomics helps the Act’s investor protection aim with Allocation Clarity and Token Intent, a comparable disclosure format.",
  "When projects publish Allocation Clarity and Token Intent, the economic picture the Act already contemplates becomes easier to compare. That is Rejunomics.",
];

const WEDNESDAY_IMAGE_PROMPT =
  "Side-by-side professional infographic: CLARITY Act market-structure column next to Rejunomics Allocation Clarity and Token Intent disclosure column. Dark gold crypto aesthetic, no URL.";

const CRYPTO_REJU_BRIDGES = [
  "Projects with Rejunomics-style disclosures plan past the hype window.",
  "REJU answers the continuity question — transparent economics and sustained participation.",
  "That's the gap Rejunomics fills: release behavior, finite incentives, post-launch activity.",
  "REJU is built for that structural gap — not another short-cycle narrative.",
  "Rejunomics maps what most tokenomics skip: what happens after launch week.",
];

const REJUVENATION_REJU_BRIDGES = [
  "The REJU token turns this science into utility: 6-month lock, Event access, and your Transformation Book.",
  "Lock REJU for Rejuvenation Event access, education, and documented transformation.",
  "That's REJU token utility — lock, Event access, education, and a book you author.",
  "Wilson Fischmann mapped this in Kat's Legacy — now a token with real participation benefits.",
  "Science-informed rejuvenation with skin in the game: lock REJU, join the Event, author your book.",
];

export function getThemeCategory(themeId: string): PostCategory | null {
  if ((REJUVENATION_THEME_IDS as readonly string[]).includes(themeId)) return "rejuvenation";
  if ((CRYPTO_THEME_IDS as readonly string[]).includes(themeId)) return "crypto";
  return null;
}

export function resolveCoreCategory(
  selectedThemes: string[],
  explicit?: PostCategory
): PostCategory {
  if (explicit === "crypto" || explicit === "rejuvenation") return explicit;

  const categories = new Set(
    selectedThemes.map(getThemeCategory).filter((c): c is PostCategory => c !== null)
  );

  if (categories.has("crypto") && !categories.has("rejuvenation")) return "crypto";
  if (categories.has("rejuvenation") && !categories.has("crypto")) return "rejuvenation";

  return "rejuvenation";
}

export function filterThemesForCategory(themes: string[], category: PostCategory): string[] {
  return themes.filter((t) => getThemeCategory(t) === category);
}

export function getCryptoThemesForDay(day: number): CryptoThemeId[] {
  switch (day) {
    case 1:
      return ["rejunomics"];
    case 3:
      return ["industry"];
    case 5:
      return ["token_utility"];
    default:
      return ["crypto"];
  }
}

export function getCryptoFocusForDay(day: number): string {
  switch (day) {
    case 1:
      return "Rejunomics, release disclosures, and token transparency";
    case 3:
      return "2026 crypto industry failure data and ecosystem continuity";
    case 5:
      return "REJU token utility, the 6-month lock, and long-term participation";
    default:
      return "transparent crypto economics and sustained REJU ecosystem activity";
  }
}

export function getRejuvenationThemesForDay(day: number, date: Date = new Date()): RejuvenationThemeId[] {
  switch (day) {
    case 2:
      return ["health"];
    case 4:
      return ["ketosis"];
    case 6: {
      const satTheme = SAT_REJUVENATION_ROTATION[Math.floor(date.getDate() / 7) % SAT_REJUVENATION_ROTATION.length];
      return [satTheme];
    }
    default:
      return ["health"];
  }
}

export function getRejuvenationFocusForDay(day: number): string {
  switch (day) {
    case 2:
      return "autophagy, fasting, and cellular housekeeping within the REJU Rejuvenation Event";
    case 4:
      return "ketosis and metabolic flexibility through the REJU Protocol";
    case 6:
      return "cellular renewal, immunity, and lymphatic support in the REJU ecosystem";
    default:
      return "science-informed rejuvenation and the REJU Health Benchmark";
  }
}

export type PostSlot = "morning" | "afternoon";

export type SlotPostSpec = {
  category: "crypto" | "rejuvenation";
  themes: string[];
  customFocus: string;
  account: "crypto" | "rejuvenation";
  linkUrl: string | null;
  investorDayCopy: boolean;
};

export type DualSlotPlan = {
  slot: PostSlot;
  dayName: string;
  relation: string;
  posts: SlotPostSpec[];
};

/** Related crypto + rejuvenation pair for each weekday. Same pair morning and afternoon; variants differ by hour. */
const RELATED_DAILY_PAIRS: Record<
  number,
  {
    crypto: CryptoThemeId;
    rejuvenation: RejuvenationThemeId;
    relation: string;
    cryptoFocus: string;
    healthFocus: string;
  }
> = {
  0: {
    crypto: "rejunomics",
    rejuvenation: "cellular_repair",
    relation: "Systems that keep working after the rush: disclosed token behavior and cellular repair.",
    cryptoFocus: "Rejunomics, release disclosures, and continuity after hype",
    healthFocus: "cellular repair after autophagy in the REJU Protocol",
  },
  1: {
    crypto: "token_utility",
    rejuvenation: "event",
    relation: "Commitment with a body: 6-month lock and the Rejuvenation Event.",
    cryptoFocus: "REJU token utility, the 6-month lock, and long-term participation",
    healthFocus: "the REJU Rejuvenation Event and authoring your Transformation Book",
  },
  2: {
    crypto: "industry",
    rejuvenation: "health",
    relation: "Most projects fail; structured fasting and autophagy are a real protocol.",
    cryptoFocus: "crypto project failure rates and why continuity disclosures matter",
    healthFocus: "autophagy, fasting, and cellular housekeeping",
  },
  3: {
    crypto: "rejunomics",
    rejuvenation: "ketosis",
    relation: "CLARITY sets the market map; Rejunomics discloses Allocation Clarity and Token Intent.",
    cryptoFocus:
      "Rejunomics aligned with the CLARITY Act: Allocation Clarity and Token Intent as industry disclosure",
    healthFocus: "ketosis and metabolic flexibility through the REJU Protocol",
  },
  4: {
    crypto: "crypto",
    rejuvenation: "immunity",
    relation: "Resilience: ecosystems that last and an immune system that stays calibrated.",
    cryptoFocus: "sustained crypto participation vs short-cycle hype",
    healthFocus: "immune resilience, inflammation, and Kat's JOL",
  },
  5: {
    crypto: "rejunomics",
    rejuvenation: "event",
    relation: "CLARITY and the Event: Allocation Clarity, Token Intent, and a program you can enter.",
    cryptoFocus:
      "Rejunomics aligned with the CLARITY Act: Allocation Clarity and Token Intent as industry disclosure",
    healthFocus: "REJU Rejuvenation Event, Health Benchmark, and daily authoring",
  },
  6: {
    crypto: "crypto_trends",
    rejuvenation: "lymphatic",
    relation: "Flow: market trends fade; lymphatic flow and participation continue.",
    cryptoFocus: "crypto trends versus ecosystems built for continuity",
    healthFocus: "lymphatic system, drainage, hydration, and movement",
  },
};

export function resolvePostSlot(now: Date = new Date(), query?: string | null): PostSlot {
  if (query === "morning" || query === "afternoon") return query;
  return now.getUTCHours() < 19 ? "morning" : "afternoon";
}

export function isRejunomicsPromoDay(now: Date): boolean {
  return REJUNOMICS_PROMO_WEEKDAYS.has(now.getDay());
}

export function linkForAutoPost(now: Date, category: PostCategory): string | null {
  if (!isRejunomicsPromoDay(now)) return null;
  if (category === "crypto") return REJUNOMICS_PAGE_LINK;
  if (category === "rejuvenation") return PROGRAM_PAGE_LINK;
  return null;
}

function stripHomeLink(text: string): string {
  return text
    .replace(/https?:\/\/(?:www\.)?rejutkn\.com(?:\/[^\s]*)?/gi, "")
    .replace(/\brejutkn\.com(?:\/[^\s]*)?/gi, "")
    .replace(/\s*→\s*$/gm, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function withOptionalLink(
  text: string,
  linkUrl: string | null,
  maxLen: number = X_SINGLE_MAX
): string {
  const stripped = stripHomeLink(text);
  if (!linkUrl) return stripped;
  const tagged = `${stripped} → ${linkUrl}`;
  return tagged.length <= maxLen ? tagged : smartComplete(tagged, maxLen - 1);
}

export function getDualSlotPlan(now: Date = new Date(), slot?: PostSlot): DualSlotPlan {
  const resolved = slot ?? resolvePostSlot(now);
  const day = now.getDay();
  const pair = RELATED_DAILY_PAIRS[day];
  const promoDay = isRejunomicsPromoDay(now);
  const cryptoPost: SlotPostSpec = {
    category: "crypto",
    themes: [pair.crypto],
    customFocus: pair.cryptoFocus,
    account: "crypto",
    linkUrl: linkForAutoPost(now, "crypto"),
    investorDayCopy: promoDay,
  };
  const healthPost: SlotPostSpec = {
    category: "rejuvenation",
    themes: [pair.rejuvenation],
    customFocus: pair.healthFocus,
    account: "rejuvenation",
    linkUrl: linkForAutoPost(now, "rejuvenation"),
    investorDayCopy: false,
  };

  return {
    slot: resolved,
    dayName: DAY_NAMES[day],
    relation: pair.relation,
    posts: resolved === "morning" ? [healthPost, cryptoPost] : [cryptoPost, healthPost],
  };
}

export function getScheduledPostConfig(date: Date = new Date()): ScheduledPostConfig {
  const day = date.getDay();
  const dayName = DAY_NAMES[day];

  if (CRYPTO_DAYS.has(day)) {
    return {
      category: "crypto",
      themes: getCryptoThemesForDay(day),
      dayName,
      shouldGenerate: true,
      customFocus: getCryptoFocusForDay(day),
    };
  }

  if (REJUVENATION_DAYS.has(day)) {
    return {
      category: "rejuvenation",
      themes: getRejuvenationThemesForDay(day, date),
      dayName,
      shouldGenerate: true,
      customFocus: getRejuvenationFocusForDay(day),
    };
  }

  return {
    category: "rest",
    themes: [],
    dayName,
    shouldGenerate: false,
    customFocus: "",
  };
}

function smartComplete(text: string, max: number): string {
  if (text.length <= max) return text;
  let cut = text.slice(0, max - 3);
  const lastBreak = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("\n\n"), cut.lastIndexOf("• "));
  if (lastBreak > 80) cut = cut.slice(0, lastBreak + 1);
  return cut.trim() + "...";
}

function ensureTerminalPunctuation(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (/[.!?…]["']?$/.test(trimmed) || trimmed.endsWith("...")) return trimmed;
  return `${trimmed}.`;
}

function firstSentence(text: string, maxLen: number): string {
  const withPunctuation = text.match(/^[^.!?]+[.!?]/);
  if (withPunctuation) {
    const sentence = withPunctuation[0].trim();
    return sentence.length <= maxLen ? sentence : smartComplete(sentence, maxLen);
  }
  const clause = text.trim();
  return clause.length <= maxLen ? clause : smartComplete(clause, maxLen);
}

function joinInsightAndBridge(
  rawInsight: string,
  bridge: string,
  link: string,
  maxLen: number = X_SINGLE_MAX
): string {
  const bridgeSentence = ensureTerminalPunctuation(bridge.trim());
  const suffix = ` → ${link}`;
  const insightMax = Math.max(55, maxLen - bridgeSentence.length - suffix.length - 1);

  let insight = ensureTerminalPunctuation(firstSentence(rawInsight, insightMax));
  if (insight.length > insightMax) {
    insight = ensureTerminalPunctuation(smartComplete(insight, insightMax));
  }

  let post = `${insight} ${bridgeSentence}${suffix}`;
  if (post.length > maxLen) {
    const tighterInsightMax = Math.max(45, insightMax - (post.length - maxLen) - 2);
    insight = ensureTerminalPunctuation(smartComplete(firstSentence(rawInsight, tighterInsightMax), tighterInsightMax));
    post = `${insight} ${bridgeSentence}${suffix}`;
  }
  if (post.length > maxLen) {
    post = smartComplete(post, maxLen - 1);
  }
  return post;
}

function resolveVariantSeed(input: GeneratePostInput): number {
  if (input.variantSeed !== undefined) return Math.abs(input.variantSeed);
  return Date.now();
}

function pickCryptoSinglePost(
  themeId: CryptoThemeId,
  variantSeed: number,
  investorDayCopy = false
): string {
  const variants = investorDayCopy
    ? WEDNESDAY_CLARITY_POSTS
    : CRYPTO_SINGLE_POSTS[themeId] ?? CRYPTO_SINGLE_POSTS.rejunomics;
  return variants[variantSeed % variants.length];
}

function withTokenHomeCta(text: string): string {
  let next = text
    .replace(/https?:\/\/(?:www\.)?rejutkn\.com\/rejunomics/gi, HOME_LINK)
    .replace(/rejutkn\.com\/rejunomics/gi, HOME_LINK);

  const tokenBit = "Lock REJU for Event access.";
  const hasToken = /lock reju|reju token|6-month lock/i.test(next);
  const hasLink = /rejutkn\.com/i.test(next);

  if (!hasToken) {
    if (next.includes(`→ ${HOME_LINK}`)) {
      const candidate = next.replace(`→ ${HOME_LINK}`, `${tokenBit} → ${HOME_LINK}`);
      if (candidate.length <= X_SINGLE_MAX) return candidate;
    }
    const candidate = hasLink ? next : `${next} ${tokenBit} → ${HOME_LINK}`;
    if (!hasLink && candidate.length <= X_SINGLE_MAX) return candidate;
  }

  if (!hasLink) {
    const withLink = `${next} → ${HOME_LINK}`;
    return withLink.length <= X_SINGLE_MAX
      ? withLink
      : smartComplete(withLink, X_SINGLE_MAX - 1);
  }

  return next;
}

function buildResearchBridgedSinglePost(
  notes: ResearchNote[],
  category: PostCategory,
  variantSeed: number,
  conceptMatches?: ConceptMatch[],
  investorDayCopy = false
): string {
  const noteIndex = variantSeed % notes.length;
  const note = notes[noteIndex];
  const noteMatch = conceptMatches?.find((m) => m.researchNoteId === note.id);
  const alignedConcept = noteMatch?.matchedConcepts[0] ?? getTopAlignedConcept(conceptMatches ?? []);
  const bridgeCategory = category === "crypto" ? "crypto" : "rejuvenation";
  const conceptBridge = buildConceptBridge(alignedConcept, bridgeCategory);
  const bridges = investorDayCopy
    ? WEDNESDAY_BRIDGES
    : category === "crypto"
      ? CRYPTO_REJU_BRIDGES
      : REJUVENATION_REJU_BRIDGES;
  const fallbackBridge = bridges[(variantSeed + 1) % bridges.length];
  const useConcept =
    !investorDayCopy && alignedConcept && (noteMatch?.alignmentScore ?? 0) >= 4;
  const bridge = useConcept ? conceptBridge : fallbackBridge;

  return joinInsightAndBridge(note.text, bridge, HOME_LINK);
}

function buildCryptoPost(
  activeThemes: string[],
  focus: string,
  includeVisual: boolean,
  postType: "single" | "thread",
  researchContext: ResearchNote[] | undefined,
  conceptMatches: ConceptMatch[] | undefined,
  variantSeed: number,
  investorDayCopy = false
) {
  const cryptoThemes = filterThemesForCategory(activeThemes, "crypto") as CryptoThemeId[];
  const primaryId = cryptoThemes[0] || "rejunomics";
  const primary = CRYPTO_CONTENT[primaryId];
  const imagePrompt = investorDayCopy ? WEDNESDAY_IMAGE_PROMPT : primary.imagePrompt;
  const hashtags = investorDayCopy
    ? "#Rejunomics #CLARITYAct #AllocationClarity #TokenIntent"
    : primary.hashtags;

  if (postType === "single") {
    const hasResearch = researchContext && researchContext.length > 0;
    const text = hasResearch
      ? buildResearchBridgedSinglePost(
          researchContext,
          "crypto",
          variantSeed,
          conceptMatches,
          investorDayCopy
        )
      : pickCryptoSinglePost(primaryId, variantSeed, investorDayCopy);

    return {
      mainText: text,
      imagePrompt: includeVisual ? imagePrompt : "",
      hashtags,
      theme: investorDayCopy
        ? "Rejunomics + CLARITY Act"
        : cryptoThemes.map((t) => THEMES_MAP[t] || t).join(" + "),
    };
  }

  let mainText = `${primary.hook}\n\n${primary.body}`;

  if (researchContext && researchContext.length > 0) {
    const researchLead = researchContext[variantSeed % researchContext.length];
    mainText = `${firstSentence(researchLead.text, 200)}\n\n${primary.hook}\n\n${primary.body}`;
  }

  if (cryptoThemes.length > 1) {
    const secondary = CRYPTO_CONTENT[cryptoThemes[1]];
    const secondaryLead = secondary.body.split("\n\n")[0];
    if (!mainText.includes(secondaryLead.slice(0, 40))) {
      mainText += `\n\n${secondaryLead}`;
    }
  }

  if (focus && !mainText.toLowerCase().includes(focus.toLowerCase().slice(0, 10))) {
    mainText += `\n\nFocused on: ${focus}.`;
  }

  if (investorDayCopy) {
    mainText +=
      "\n\nAllocation Clarity and Token Intent — the disclosure layer CLARITY still needs. See Rejunomics.";
  } else {
    const showRejunomicsInvite =
      primaryId === "rejunomics" || primaryId === "token_utility" || activeThemes.includes("rejunomics");
    if (showRejunomicsInvite) {
      mainText += `\n\nLearn more about Rejunomics.`;
    }
    mainText += "\n\nExplore REJU token utility and ecosystem continuity.\n\nJoin the conversation on Telegram.";
  }

  return {
    mainText,
    imagePrompt: includeVisual ? imagePrompt : "",
    hashtags,
    theme: investorDayCopy
      ? "Rejunomics + CLARITY Act"
      : cryptoThemes.map((t) => THEMES_MAP[t] || t).join(" + "),
  };
}

function buildRejuvenationPost(
  activeThemes: string[],
  focus: string,
  includeVisual: boolean,
  postType: "single" | "thread",
  researchContext: ResearchNote[] | undefined,
  conceptMatches: ConceptMatch[] | undefined,
  variantSeed: number
) {
  const rejuvenationThemes = filterThemesForCategory(activeThemes, "rejuvenation");
  const scienceThemes = rejuvenationThemes.filter((t) => t !== "event") as Exclude<RejuvenationThemeId, "event">[];
  const primaryId: string = scienceThemes[0] || (rejuvenationThemes.includes("event") ? "event" : "health");
  const visualTheme = scienceThemes[0] || "health";
  const visual = REJUVENATION_CONTENT[visualTheme] ?? REJUVENATION_CONTENT.health;

  if (postType === "single") {
    const hasResearch = researchContext && researchContext.length > 0;
    const single = hasResearch
      ? buildResearchBridgedSinglePost(researchContext, "rejuvenation", variantSeed, conceptMatches)
      : getBookSinglePostForTheme(primaryId, new Date(), variantSeed) ||
        getBookSinglePostForTheme("health", new Date(), variantSeed) ||
        `${REJUVENATION_CONTENT.health.hook} Lock REJU for Event access, education, and your Transformation Book. → ${HOME_LINK}`;

    return {
      mainText: withTokenHomeCta(single),
      imagePrompt: includeVisual ? visual.imagePrompt : "",
      hashtags: visual.hashtags,
      theme: rejuvenationThemes.map((t) => THEMES_MAP[t] || t).join(" + "),
    };
  }

  const bookThread = getBookThreadForTheme(primaryId);
  if (bookThread) {
    let thread = bookThread;
    if (researchContext && researchContext.length > 0) {
      const lead = firstSentence(researchContext[variantSeed % researchContext.length].text, 220);
      thread = [lead, ...bookThread.slice(1)];
    }
    return {
      mainText: thread.join("\n\n"),
      imagePrompt: includeVisual ? visual.imagePrompt : "",
      hashtags: visual.hashtags,
      theme: rejuvenationThemes.map((t) => THEMES_MAP[t] || t).join(" + "),
    };
  }

  const bookContent = getBookContentForTheme(primaryId);
  const fallbackKey = primaryId === "event" ? "health" : primaryId;
  const fallback = REJUVENATION_CONTENT[fallbackKey as Exclude<RejuvenationThemeId, "event">] ?? REJUVENATION_CONTENT.health;

  let mainText = bookContent
    ? `${bookContent.hook}\n\n${bookContent.body}`
    : `${fallback.hook}\n\n${fallback.body}`;

  if (researchContext && researchContext.length > 0) {
    const researchLead = researchContext[variantSeed % researchContext.length];
    mainText = `${firstSentence(researchLead.text, 200)}\n\n${mainText}`;
  }

  if (scienceThemes.length > 1) {
    const secondaryBook = getBookContentForTheme(scienceThemes[1]);
    const secondaryLead = secondaryBook
      ? secondaryBook.body.split("\n\n")[0]
      : REJUVENATION_CONTENT[scienceThemes[1]].body.split("\n\n")[0];
    if (!mainText.includes(secondaryLead.slice(0, 40))) {
      mainText += `\n\n${secondaryLead}`;
    }
  }

  if (primaryId !== "event") {
    mainText += `\n\n${REJUVENATION_EVENT_ADDENDUM}`;
  }

  mainText += `\n\nThe REJU token funds that path: 6-month lock, Event access, education, and your Transformation Book.\n\n→ ${HOME_LINK}`;

  return {
    mainText,
    imagePrompt: includeVisual ? visual.imagePrompt : "",
    hashtags: visual.hashtags,
    theme: rejuvenationThemes.map((t) => THEMES_MAP[t] || t).join(" + "),
  };
}

export function generateHighQualityPost(input: GeneratePostInput): GeneratedPost {
  const {
    selectedThemes,
    coreCategory,
    customFocus = "",
    postType,
    tone,
    includeVisual,
    researchContext,
    conceptMatches,
    includeHomeLink,
    linkUrl,
    investorDayCopy = false,
  } = input;
  const resolvedLinkUrl =
    linkUrl !== undefined ? linkUrl : includeHomeLink === false ? null : HOME_LINK;
  const variantSeed = resolveVariantSeed(input);

  const category = resolveCoreCategory(selectedThemes, coreCategory);
  const activeThemes =
    selectedThemes.length > 0
      ? filterThemesForCategory(selectedThemes, category)
      : category === "crypto"
        ? ["rejunomics"]
        : ["health"];

  const focus =
    customFocus.trim() ||
    (category === "crypto"
      ? "transparent token economics and long-term ecosystem continuity"
      : "science-informed rejuvenation within the REJU ecosystem");

  const isThread = postType === "thread";

  const built =
    category === "crypto"
      ? buildCryptoPost(
          activeThemes,
          focus,
          includeVisual,
          postType,
          researchContext,
          conceptMatches,
          variantSeed,
          investorDayCopy
        )
      : buildRejuvenationPost(activeThemes, focus, includeVisual, postType, researchContext, conceptMatches, variantSeed);

  let mainText = built.mainText;
  let thread: string[] = [];

  if (isThread) {
    const parts = mainText.split("\n\n").filter(Boolean);
    thread = parts.map((part, i) => {
      let tweet = part.trim();
      if (i > 0 && !tweet.match(/^\d+\//)) tweet = `${i + 1}/ ${tweet}`;
      const isLast = i === parts.length - 1;
      tweet = withOptionalLink(tweet, isLast ? resolvedLinkUrl : null, 270);
      if (tweet.length > 270) tweet = smartComplete(tweet, 267);
      return tweet;
    });
    mainText = thread[0];
  } else {
    mainText = withOptionalLink(mainText, resolvedLinkUrl);
    if (mainText.length > X_SINGLE_MAX) {
      mainText = smartComplete(mainText, X_SINGLE_MAX - 1);
    }
  }

  if (tone === "Inspirational") {
    mainText = mainText.replace(/The question is:/g, "The real question is:");
  }

  return {
    text: mainText,
    thread: isThread ? thread : undefined,
    imagePrompt: built.imagePrompt,
    hashtags: built.hashtags,
    theme: built.theme,
    category,
  };
}