import { NextRequest, NextResponse } from "next/server";
import { alignResearchWithLibrary } from "../../../../lib/conceptLibrary";
import { fetchWebResearch } from "../../../../lib/postResearch";
import { requireXPostSession } from "../../../../lib/xPostAuth";

export async function POST(req: NextRequest) {
  const auth = await requireXPostSession();
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const category = body.category === "crypto" ? "crypto" : "rejuvenation";
    const themes: string[] = Array.isArray(body.themes) ? body.themes : [];
    const query: string = body.query || body.customFocus || "";

    const result = await fetchWebResearch({
      query,
      category,
      themes,
    });

    const alignment = await alignResearchWithLibrary({
      notes: result.notes,
      themes,
      category,
    });

    return NextResponse.json({
      success: true,
      queryUsed: result.queryUsed,
      notes: result.notes,
      sourcesUsed: result.sourcesUsed,
      fetchedAt: result.fetchedAt,
      category,
      live: true,
      conceptMatches: alignment.matches,
      libraryStats: {
        bookConceptCount: alignment.bookConceptCount,
        driveConceptCount: alignment.driveConceptCount,
        driveFileCount: alignment.driveFileCount,
        libraryLoadedAt: alignment.libraryLoadedAt,
      },
    });
  } catch (error: unknown) {
    console.error("X-POST RESEARCH ERROR:", error);
    return NextResponse.json({ success: false, error: "Research failed", live: false }, { status: 502 });
  }
}