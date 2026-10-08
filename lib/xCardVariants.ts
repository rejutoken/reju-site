// Card variant catalog shared by the engine (pure) and the renderer (lib/xCards.tsx).

export type CardAccount = "crypto" | "rejuvenation";

export const TOKEN_CARD_VARIANTS = ["horizon", "door", "grid", "lock", "ledger", "gold", "rays"] as const;
export const EVENT_CARD_VARIANTS = ["page", "sunrise", "journal", "chapter", "weeks", "petals", "cream"] as const;

export type TokenCardVariant = (typeof TOKEN_CARD_VARIANTS)[number];
export type EventCardVariant = (typeof EVENT_CARD_VARIANTS)[number];
export type CardVariant = TokenCardVariant | EventCardVariant;

export type CardSpec = {
  account: CardAccount;
  variant: CardVariant;
  /** Short key line shown large on the card (never the full post). */
  line: string;
  /** Small uppercase label above the line. */
  kicker: string;
  /** Optional big badge (chapter number, D1, W1) used by the chapter variant. */
  badge?: string;
};

export const CARD_WIDTH = 1600;
export const CARD_HEIGHT = 900;
/** Keep card lines short so they read at phone size. */
export const CARD_LINE_MAX_CHARS = 90;

const PILLAR_AFFINITY: Record<string, CardVariant[]> = {
  // Event
  fact: ["chapter", "page", "journal"],
  story: ["page", "sunrise", "cream"],
  day: ["journal", "weeks", "chapter"],
  practice: ["petals", "journal", "cream"],
  question: ["cream", "petals", "sunrise"],
  status: ["weeks", "sunrise", "page"],
  // Token
  news: ["horizon", "door", "grid", "rays", "ledger", "gold"],
  path_b: ["lock", "ledger", "door"],
  build: ["grid", "ledger", "horizon"],
  event_quote: ["door", "horizon", "rays"],
  founder: ["gold", "horizon"],
  evergreen: ["rays", "gold", "horizon", "door"],
};

export function variantsFor(account: CardAccount): readonly CardVariant[] {
  return account === "rejuvenation" ? EVENT_CARD_VARIANTS : TOKEN_CARD_VARIANTS;
}

/**
 * Rotate variants: never repeat one of the last 3 variants used on this account,
 * prefer variants that suit the pillar, and pick deterministically from the seed.
 */
export function pickCardVariant(
  account: CardAccount,
  pillar: string,
  recentVariants: string[],
  seed: number
): CardVariant {
  const all = variantsFor(account);
  const blocked = new Set(recentVariants.slice(0, 3));
  const allowed = all.filter((v) => !blocked.has(v));
  const pool = allowed.length > 0 ? allowed : [...all];
  const preferred = (PILLAR_AFFINITY[pillar] || []).filter((v) => pool.includes(v));
  const choices = preferred.length > 0 ? preferred : pool;
  return choices[Math.abs(seed) % choices.length];
}
