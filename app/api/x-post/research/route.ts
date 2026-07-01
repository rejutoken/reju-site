import { NextRequest, NextResponse } from "next/server";
import { fetchWebResearch } from "../../../../lib/postResearch";

export async function POST(req: NextRequest) {
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

    return NextResponse.json({
      success: true,
      queryUsed: result.queryUsed,
      notes: result.notes,
      sourcesUsed: result.sourcesUsed,
      fetchedAt: result.fetchedAt,
      category,
      live: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Research failed";
    console.error("X-POST RESEARCH ERROR:", error);
    return NextResponse.json({ success: false, error: message, live: false }, { status: 502 });
  }
}