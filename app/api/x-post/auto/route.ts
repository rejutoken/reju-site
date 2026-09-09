import { NextRequest, NextResponse } from "next/server";
import {
  generateHighQualityPost,
  getDualSlotPlan,
  resolvePostSlot,
  KATS_LEGACY_BOOK,
  type SlotPostSpec,
} from "../../../../lib/xPostGenerator";
import { alignResearchWithLibrary } from "../../../../lib/conceptLibrary";
import { fetchWebResearch } from "../../../../lib/postResearch";
import { publishTweet } from "../../../../lib/xPublish";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function generateAndPublish(spec: SlotPostSpec, variantSeed: number) {
  let live: Awaited<ReturnType<typeof fetchWebResearch>> | null = null;
  if (!spec.onboardingCopy) {
    try {
      live = await fetchWebResearch({
        query: spec.customFocus,
        category: spec.category,
        themes: spec.themes,
      });
    } catch (error) {
      console.error("X-POST AUTO RESEARCH SKIPPED:", error);
    }
  }

  const alignment = await alignResearchWithLibrary({
    notes: live?.notes ?? [],
    themes: spec.themes,
    category: spec.category,
  });

  const post = generateHighQualityPost({
    selectedThemes: spec.themes,
    coreCategory: spec.category,
    customFocus: spec.customFocus,
    postType: "single",
    tone: "Educational",
    includeVisual: true,
    researchContext: live?.notes,
    conceptMatches: alignment.matches,
    variantSeed,
    linkUrl: spec.linkUrl,
    investorDayCopy: spec.investorDayCopy,
    onboardingCopy: spec.onboardingCopy,
  });

  let publish: Awaited<ReturnType<typeof publishTweet>>;
  try {
    publish = await publishTweet(post.text, spec.account);
  } catch (error) {
    console.error("X PUBLISH ERROR:", error);
    publish = { posted: false, reason: "X API rejected the post.", account: spec.account };
  }

  return {
    published: publish,
    post: {
      text: post.text,
      imagePrompt: post.imagePrompt,
      hashtags: post.hashtags,
      theme: post.theme,
      category: post.category,
      account: spec.account,
      linkUrl: spec.linkUrl,
    },
    researchQuery: live?.queryUsed ?? spec.customFocus,
  };
}

async function handleAuto(req: NextRequest) {
  try {
    if (!verifyCronAuth(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const slot = resolvePostSlot(now, req.nextUrl.searchParams.get("slot"));
    const plan = getDualSlotPlan(now, slot);
    const hourSeed = now.getUTCHours() * 1000 + now.getUTCDate() * 10;

    const results = [];
    for (let i = 0; i < plan.posts.length; i += 1) {
      const spec = plan.posts[i];
      const variantSeed = hourSeed + i * 17 + spec.category.length;
      results.push(await generateAndPublish(spec, variantSeed));
    }

    return NextResponse.json({
      success: true,
      slot: plan.slot,
      relation: plan.relation,
      schedule:
        "Four posts daily: 14:00 UTC morning and 22:00 UTC afternoon. Crypto to @rejutoken, rejuvenation to @REJUvenationTKN. Wednesday: Rejunomics + rejutkn.com/rejunomics, rejuvenation + rejutkn.com/program. Friday morning: how to get on board (crypto → onboarding, rejuvenation → program). Friday afternoon: Rejunomics and program links.",
      meta: {
        generatedAt: now.toISOString(),
        day: plan.dayName,
        bookSource: KATS_LEGACY_BOOK.title,
      },
      posts: results,
    });
  } catch (error: unknown) {
    console.error("X-POST AUTO ERROR:", error);
    const message = error instanceof Error ? error.message : "Auto post failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleAuto(req);
}

export async function POST(req: NextRequest) {
  return handleAuto(req);
}
