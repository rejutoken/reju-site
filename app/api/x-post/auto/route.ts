import { NextRequest, NextResponse } from "next/server";
import {
  generateHighQualityPost,
  getScheduledPostConfig,
  getCryptoThemesForDay,
  getCryptoFocusForDay,
  getRejuvenationThemesForDay,
  getRejuvenationFocusForDay,
  KATS_LEGACY_BOOK,
  REJUVENATION_POST_INSTRUCTION,
  PostCategory,
} from "../../../../lib/xPostGenerator";
import { getBookKnowledgeMeta } from "../../../../lib/katsLegacyBook";
import { fetchWebResearch } from "../../../../lib/postResearch";

// Automated endpoint for Vercel Cron / n8n
// Schedule: Mon/Wed/Fri → crypto | Tue/Thu/Sat → rejuvenation | Sun → rest day

function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // Allow when secret not configured (local dev)
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

function resolveSchedule(req: NextRequest) {
  const force = req.nextUrl.searchParams.get("force") as PostCategory | null;
  if (force === "crypto" || force === "rejuvenation") {
    const config = getScheduledPostConfig();
    const day = new Date().getDay();
    if (force === "crypto") {
      return {
        category: "crypto" as const,
        themes: getCryptoThemesForDay(day),
        dayName: config.dayName,
        shouldGenerate: true,
        customFocus: getCryptoFocusForDay(day),
      };
    }
    return {
      category: "rejuvenation" as const,
      themes: getRejuvenationThemesForDay(day),
      dayName: config.dayName,
      shouldGenerate: true,
      customFocus: getRejuvenationFocusForDay(day),
    };
  }
  return getScheduledPostConfig();
}

async function handleAuto(req: NextRequest) {
  if (!verifyCronAuth(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const schedule = resolveSchedule(req);

  if (!schedule.shouldGenerate) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "Sunday is a rest day — no post generated",
      meta: {
        day: schedule.dayName,
        category: schedule.category,
        schedule: "Mon=rejunomics, Wed=industry, Fri=token utility | Tue=autophagy, Thu=ketosis, Sat=cellular/immunity/lymphatic | Sun=rest",
      },
    });
  }

  const now = new Date();
  const category = schedule.category === "crypto" ? "crypto" : "rejuvenation";
  const live = await fetchWebResearch({
    query: schedule.customFocus,
    category,
    themes: schedule.themes,
  });

  const post = generateHighQualityPost({
    selectedThemes: schedule.themes,
    coreCategory: schedule.category === "rest" ? undefined : schedule.category,
    customFocus: schedule.customFocus,
    postType: "single",
    tone: "Educational",
    includeVisual: true,
    researchContext: live.notes,
    variantSeed: now.getDay() * 10000 + now.getDate() * 100 + now.getHours(),
  });

  return NextResponse.json({
    success: true,
    post: {
      text: post.text,
      thread: post.thread,
      imagePrompt: post.imagePrompt,
      hashtags: post.hashtags,
      theme: post.theme,
      category: post.category,
      suggestedSchedule: "Post in the next 24-48h for best engagement",
    },
    meta: {
      generatedAt: new Date().toISOString(),
      day: schedule.dayName,
      category: post.category,
      themesUsed: schedule.themes,
      schedule: "Mon=rejunomics, Wed=industry, Fri=token utility | Tue=autophagy, Thu=ketosis, Sat=cellular/immunity/lymphatic | Sun=rest",
      researchSources: live.sourcesUsed,
      researchQuery: live.queryUsed,
      researchFetchedAt: live.fetchedAt,
      ...(post.category === "rejuvenation" && {
        bookSource: KATS_LEGACY_BOOK.title,
        bookAuthor: KATS_LEGACY_BOOK.author,
        bookAmazon: KATS_LEGACY_BOOK.amazonPaperback,
        bookTraining: getBookKnowledgeMeta(),
        postInstruction: REJUVENATION_POST_INSTRUCTION,
      }),
    },
  });
}

export async function GET(req: NextRequest) {
  return handleAuto(req);
}

export async function POST(req: NextRequest) {
  return handleAuto(req);
}