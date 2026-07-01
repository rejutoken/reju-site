// Primary research source for REJU rejuvenation X posts.
// Trained on the complete Kat's Legacy PDF (see katsLegacyBook.knowledge.json)

import bookKnowledge from "./katsLegacyBook.knowledge.json";

export interface BookThemeKnowledge {
  hook: string;
  excerpt: string;
  chapters: string[];
  source: string;
  singlePosts?: string[];
}

export interface BookKnowledge {
  title: string;
  author: string;
  bookSourceDir: string;
  pdfSource: string;
  amazonPaperback: string;
  extractedChars: number;
  themes: Record<string, BookThemeKnowledge>;
  coreConcepts: string[];
  chapters: string[];
  voiceGuidelines?: string[];
}

export const BOOK_SOURCE_DIR = "C:\\Users\\wifis\\OneDrive\\Desktop\\Kat's Legacy";

const KNOWLEDGE = bookKnowledge as BookKnowledge;

export const KATS_LEGACY_BOOK = {
  title: KNOWLEDGE.title,
  subtitle:
    "Unblocking the Mystery of Autophagy, Ketosis, and Cellular Repair to Detoxify, Heal, and Rejuvenate",
  author: KNOWLEDGE.author,
  published: "June 16, 2025",
  pages: 119,
  isbn: "979-8288364501",
  bookSourceDir: KNOWLEDGE.bookSourceDir || BOOK_SOURCE_DIR,
  pdfSource: KNOWLEDGE.pdfSource,
  amazonPaperback: KNOWLEDGE.amazonPaperback,
  amazonKindle: "https://www.amazon.com/Kats-Legacy-Longevity-Unblocking-Rejuvenate-ebook/dp/B0FDD7YZLK",
  transformationVideo: "https://youtu.be/pzi4Qj5HMwM",
  katJourney: "https://www.facebook.com/Katsluvsbak/",
  extractedChars: KNOWLEDGE.extractedChars,
  trainedChapters: KNOWLEDGE.chapters,
  voiceGuidelines: KNOWLEDGE.voiceGuidelines ?? [],
} as const;

export const REJUVENATION_POST_INSTRUCTION = `
When generating REJU rejuvenation posts, use the complete book "Kat's Legacy: A Science-Based Path to Healing and Longevity"
by Wilson Fischmann CA as the authoritative training source (full PDF + Amazon).

Trained on ${KNOWLEDGE.chapters.length} sections (${KNOWLEDGE.extractedChars.toLocaleString()} characters) from:
${KNOWLEDGE.bookSourceDir}

Voice guidelines:
${(KNOWLEDGE.voiceGuidelines ?? []).map((g) => `- ${g}`).join("\n")}

Theme → book mapping:
- health/autophagy → Ch. 7 + Week 1 (16h fasting, Ohsumi Nobel research)
- ketosis → Ch. 8 + Week 2 (ketone bodies, 20–50g carbs, anti-inflammatory)
- cellular_repair → Ch. 6/9 + Week 2 (20h fasting, repair after autophagy)
- immunity → Ch. 2 + Kat's JOL™ resilience story
- lymphatic → Ch. 1 (drainage network, hydration, movement)
- event → 4-Week Reset + Kat's journey + REJU Rejuvenation Event™

Use rotating singlePost variants from the knowledge base. Never duplicate hook + body opening.
Amazon: ${KNOWLEDGE.amazonPaperback}
`.trim();

export interface BookResearchNote {
  id: string;
  text: string;
  source: string;
}

const BOOK_CORE_NOTES: BookResearchNote[] = [
  {
    id: "book-1",
    text: "Kat's JOL (Juice of Life) sustained Kat for over a decade — tested on Wilson first, then used in her care after a traumatic brain injury.",
    source: "Kat's Legacy PDF — Introduction",
  },
  {
    id: "book-2",
    text: "4-Week Reset: Preparation (3 days) → Week 1 Detox → Week 2 Cellular Repair → Week 3 Solids → Week 4 Maintenance.",
    source: "Kat's Legacy PDF — Four-Week Reset",
  },
  {
    id: "book-3",
    text: "At 16 hours of fasting (Week 1), autophagy begins — damaged cells recycle, inflammation decreases.",
    source: "Kat's Legacy PDF — Week 1",
  },
  {
    id: "book-4",
    text: "Week 2: 20-hour fasting windows deepen ketosis and cellular repair with Kat's JOL™.",
    source: "Kat's Legacy PDF — Week 2",
  },
  {
    id: "book-5",
    text: "Wilson's documented rejuvenation: https://youtu.be/pzi4Qj5HMwM — lab results included in the book.",
    source: "Kat's Legacy PDF — Author results",
  },
];

export function getBookThemeKnowledge(themeId: string): BookThemeKnowledge | null {
  if (themeId === "event") return KNOWLEDGE.themes.event ?? null;
  return KNOWLEDGE.themes[themeId] ?? null;
}

/** Tuesday autophagy, Thursday ketosis, Saturday rotates — matches auto schedule */
const SCHEDULED_THEME_DAY: Record<string, number> = {
  health: 2,
  ketosis: 4,
  cellular_repair: 6,
  immunity: 6,
  lymphatic: 6,
};

export function getBookSinglePostForTheme(
  themeId: string,
  date: Date = new Date(),
  variantSeed?: number
): string | null {
  const knowledge = getBookThemeKnowledge(themeId);
  const variants = knowledge?.singlePosts;
  if (!variants || variants.length === 0) return null;

  if (variantSeed !== undefined) {
    return variants[variantSeed % variants.length];
  }

  const scheduledDay = SCHEDULED_THEME_DAY[themeId];
  if (scheduledDay !== undefined && date.getDay() === scheduledDay) {
    return variants[0];
  }

  const index = (date.getDay() + date.getDate()) % variants.length;
  return variants[index];
}

export function getBookThreadForTheme(themeId: string): string[] | null {
  const knowledge = getBookThemeKnowledge(themeId);
  if (!knowledge) return null;

  const sentences = knowledge.excerpt.match(/[^.!?]+[.!?]+/g) ?? [knowledge.excerpt];
  const science = sentences.slice(0, 2).join(" ").trim();

  return [
    knowledge.hook,
    science,
    `From Kat's Legacy by Wilson Fischmann — ${knowledge.chapters[0] ?? "REJU Protocol™"}. Join the REJU Rejuvenation Event™ and author your Transformation Book.`,
    "→ rejutkn.com",
  ];
}

export function getBookContentForTheme(themeId: string): { hook: string; body: string } | null {
  const knowledge = getBookThemeKnowledge(themeId);
  if (!knowledge) return null;
  return {
    hook: knowledge.hook,
    body: knowledge.excerpt,
  };
}

export function getBookResearchNotes(themes: string[]): BookResearchNote[] {
  const notes = [...BOOK_CORE_NOTES];
  const seen = new Set(notes.map((n) => n.id));

  for (const theme of themes) {
    const knowledge = getBookThemeKnowledge(theme);
    if (!knowledge) continue;

    const id = `book-theme-${theme}`;
    if (!seen.has(id)) {
      notes.push({
        id,
        text: knowledge.excerpt,
        source: `${knowledge.source} — ${knowledge.chapters.join(", ")}`,
      });
      seen.add(id);
    }
  }

  return notes;
}

export function getBookLineForTheme(themeId: string): string | null {
  const knowledge = getBookThemeKnowledge(themeId);
  return knowledge?.hook ?? null;
}

export function getBookAmazonLink(): string {
  return KATS_LEGACY_BOOK.amazonPaperback;
}

export function getBookCitation(): string {
  return `From Kat's Legacy by Wilson Fischmann → ${KATS_LEGACY_BOOK.amazonPaperback}`;
}

export function getBookCta(): string {
  return `\n\nGet Kat's Legacy on Amazon → ${KATS_LEGACY_BOOK.amazonPaperback}`;
}

export function getBookKnowledgeMeta() {
  return {
    title: KNOWLEDGE.title,
    author: KNOWLEDGE.author,
    bookSourceDir: KNOWLEDGE.bookSourceDir || BOOK_SOURCE_DIR,
    pdfSource: KNOWLEDGE.pdfSource,
    amazonPaperback: KNOWLEDGE.amazonPaperback,
    extractedChars: KNOWLEDGE.extractedChars,
    chapters: KNOWLEDGE.chapters,
    coreConcepts: KNOWLEDGE.coreConcepts,
    voiceGuidelines: KNOWLEDGE.voiceGuidelines ?? [],
  };
}