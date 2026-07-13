import { NextRequest, NextResponse } from "next/server";
import {
  generateHighQualityPost,
  GeneratePostInput,
  KATS_LEGACY_BOOK,
  resolveCoreCategory,
} from "../../../../lib/xPostGenerator";
import { alignResearchWithLibrary } from "../../../../lib/conceptLibrary";
import { fetchWebResearch } from "../../../../lib/postResearch";
import { requireXPostSession } from "../../../../lib/xPostAuth";

export async function POST(req: NextRequest) {
  const auth = await requireXPostSession();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json() as Partial<GeneratePostInput> & {
      researchQuery?: string;
      fetchLiveResearch?: boolean;
    };

    const category = resolveCoreCategory(body.selectedThemes || [], body.coreCategory);
    let researchContext = body.researchContext;
    let researchMeta: {
      sourcesUsed?: string[];
      queryUsed?: string;
      fetchedAt?: string;
      researchNotes?: typeof researchContext;
    } = {};

    const shouldFetchLive =
      body.fetchLiveResearch !== false &&
      (!researchContext || researchContext.length === 0 || body.fetchLiveResearch === true);

    if (shouldFetchLive) {
      const live = await fetchWebResearch({
        query: body.researchQuery || body.customFocus || "",
        category: category === "crypto" ? "crypto" : "rejuvenation",
        themes: body.selectedThemes || [],
      });
      researchContext = live.notes;
      researchMeta = {
        sourcesUsed: live.sourcesUsed,
        queryUsed: live.queryUsed,
        fetchedAt: live.fetchedAt,
        researchNotes: live.notes,
      };
    }

    let conceptAlignment:
      | Awaited<ReturnType<typeof alignResearchWithLibrary>>
      | undefined;

    if (researchContext && researchContext.length > 0) {
      conceptAlignment = await alignResearchWithLibrary({
        notes: researchContext,
        themes: body.selectedThemes || [],
        category: category === "crypto" ? "crypto" : "rejuvenation",
      });
    }

    const input: GeneratePostInput = {
      selectedThemes: body.selectedThemes || [],
      coreCategory: body.coreCategory,
      customFocus: body.customFocus || "",
      postType: body.postType || "single",
      tone: body.tone || "Educational",
      includeVisual: body.includeVisual !== false,
      researchContext,
      conceptMatches: conceptAlignment?.matches,
      variantSeed: body.variantSeed ?? Date.now(),
    };

    const post = generateHighQualityPost(input);

    return NextResponse.json({
      success: true,
      post: {
        text: post.text,
        thread: post.thread,
        imagePrompt: post.imagePrompt,
        hashtags: post.hashtags,
        theme: post.theme,
        category: post.category,
        researchUsed: researchContext?.length ?? 0,
        ...researchMeta,
        ...(conceptAlignment && {
          conceptMatches: conceptAlignment.matches,
          libraryStats: {
            bookConceptCount: conceptAlignment.bookConceptCount,
            driveConceptCount: conceptAlignment.driveConceptCount,
            driveFileCount: conceptAlignment.driveFileCount,
            libraryLoadedAt: conceptAlignment.libraryLoadedAt,
          },
        }),
        ...(post.category === "rejuvenation" && {
          bookSource: KATS_LEGACY_BOOK.title,
          bookAmazon: KATS_LEGACY_BOOK.amazonPaperback,
        }),
      },
    });
  } catch (error: any) {
    console.error("X-POST GENERATE ERROR:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate post" },
      { status: 500 }
    );
  }
}

// Optional GET for testing (admin/collaborator session required)
export async function GET() {
  const auth = await requireXPostSession();
  if (auth instanceof NextResponse) return auth;

  const sample = generateHighQualityPost({
    selectedThemes: ["rejunomics"],
    coreCategory: "crypto",
    customFocus: "",
    postType: "single",
    tone: "Educational",
    includeVisual: true,
  });

  return NextResponse.json({ success: true, sample });
}
