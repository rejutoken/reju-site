import { NextRequest, NextResponse } from "next/server";
import {
  generateHighQualityPost,
  getDualSlotPlan,
  resolvePostSlot,
  KATS_LEGACY_BOOK,
  type SlotPostSpec,
} from "../../../../lib/xPostGenerator";
import { SITE_NEWS } from "../../../../lib/siteNews";
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
  let post = generateHighQualityPost({
    selectedThemes: spec.themes,
    coreCategory: spec.category,
    customFocus: spec.customFocus,
    postType: "single",
    tone: "Educational",
    includeVisual: true,
    variantSeed,
    linkUrl: spec.linkUrl,
    enrollmentOpen: SITE_NEWS.enrollmentOpen,
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
      variantSeed: variantSeed + (attempt + 1) * 101,
      linkUrl: spec.linkUrl,
      enrollmentOpen: SITE_NEWS.enrollmentOpen,
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
      researchQuery: spec.customFocus,
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
  } else {
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
    researchQuery: spec.customFocus,
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

    return NextResponse.json({
      success: failed.length === 0,
      allPosted: failed.length === 0,
      failed,
      slot: plan.slot,
      relation: plan.relation,
      schedule:
        "One post per slot. Morning 14:00 UTC: @REJUvenationTKN Event voice. Afternoon 22:00 UTC: @rejutoken token-door into the same Event. No news. No Rejunomics. 7 posts/week per account.",
      meta: {
        generatedAt: now.toISOString(),
        day: plan.dayName,
        bookSource: KATS_LEGACY_BOOK.title,
        enrollmentOpen: SITE_NEWS.enrollmentOpen,
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
