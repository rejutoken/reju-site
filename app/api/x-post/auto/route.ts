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
import { hashPostText, recordPosted, wasRecentlyPosted } from "../../../../lib/xAutoLog";

export const runtime = "nodejs";
export const maxDuration = 60;

function verifyCronAuth(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function generateAndPublish(spec: SlotPostSpec, variantSeed: number, slot: string) {
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

  let post = generateHighQualityPost({
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

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const duplicate = await wasRecentlyPosted(spec.account, post.text);
    if (!duplicate) break;
    post = generateHighQualityPost({
      selectedThemes: spec.themes,
      coreCategory: spec.category,
      customFocus: spec.customFocus,
      postType: "single",
      tone: "Educational",
      includeVisual: true,
      researchContext: live?.notes,
      conceptMatches: alignment.matches,
      variantSeed: variantSeed + (attempt + 1) * 101,
      linkUrl: spec.linkUrl,
      investorDayCopy: spec.investorDayCopy,
      onboardingCopy: spec.onboardingCopy,
    });
  }

  if (await wasRecentlyPosted(spec.account, post.text)) {
    console.error(`X AUTO SKIPPED DUPLICATE account=${spec.account} slot=${slot}`);
    return {
      published: {
        posted: false as const,
        reason: "Skipped duplicate text for this account.",
        account: spec.account,
      },
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

  let publish: Awaited<ReturnType<typeof publishTweet>>;
  try {
    publish = await publishTweet(post.text, spec.account);
  } catch (error) {
    console.error("X PUBLISH ERROR:", error);
    publish = { posted: false, reason: "X API rejected the post.", account: spec.account };
  }

  if (!publish.posted) {
    console.error(`X AUTO PUBLISH FAILED account=${spec.account} reason=${publish.reason}`);
  } else if (publish.posted) {
    await recordPosted({
      account: spec.account,
      textHash: hashPostText(post.text),
      text: post.text,
      tweetId: publish.tweetId,
      slot,
      at: new Date().toISOString(),
    });
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
    const slotBias = plan.slot === "morning" ? 3 : 11;

    const results = [];
    for (let i = 0; i < plan.posts.length; i += 1) {
      const spec = plan.posts[i];
      const variantSeed = hourSeed + i * 17 + spec.category.length + slotBias * 997;
      results.push(await generateAndPublish(spec, variantSeed, plan.slot));
    }

    const failed = results.flatMap((item) =>
      item.published.posted
        ? []
        : [{ account: item.published.account, reason: item.published.reason }]
    );
    const allPosted = failed.length === 0;

    return NextResponse.json({
      success: allPosted,
      allPosted,
      failed,
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
