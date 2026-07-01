"use client";

import React, { useState, useEffect } from "react";
import { BOOK_SOURCE_DIR, getBookKnowledgeMeta, KATS_LEGACY_BOOK } from "../../../lib/katsLegacyBook";

interface GeneratedPost {
  id: string;
  text: string;
  thread?: string[];
  imagePrompt: string;
  hashtags: string;
  theme: string;
  createdAt: string;
}

interface ResearchNote {
  id: string;
  text: string;
  source: string;
  url?: string;
  publishedAt?: string;
}

type CoreCategory = "rejuvenation" | "crypto";

const REJUVENATION_THEMES = [
  { id: "health", label: "Autophagy & Fasting" },
  { id: "ketosis", label: "Ketosis & Metabolic Flexibility" },
  { id: "cellular_repair", label: "Cellular Repair & Renewal" },
  { id: "immunity", label: "Immunity & Inflammation" },
  { id: "lymphatic", label: "Lymphatic System & Detox" },
  { id: "event", label: "REJU Rejuvenation Event" },
];

const CRYPTO_THEMES = [
  { id: "rejunomics", label: "Rejunomics & Token Transparency" },
  { id: "crypto_news", label: "Token & Crypto News" },
  { id: "crypto", label: "Crypto Ecosystem & Participation" },
  { id: "crypto_news_today", label: "Today's Crypto News" },
  { id: "crypto_trends", label: "Crypto Trends" },
  { id: "industry", label: "2026 Crypto Industry Analysis" },
  { id: "token_utility", label: "Token Utility & 6-Month Lock" },
];

const TONES = ["Educational", "Inspirational", "Analytical", "Conversational"];

export default function XPostStudio() {
  const [coreCategory, setCoreCategory] = useState<CoreCategory>("rejuvenation");
  const [selectedThemes, setSelectedThemes] = useState<string[]>(["health"]);
  const [customFocus, setCustomFocus] = useState("");
  const [researchQuery, setResearchQuery] = useState("");
  const [postType, setPostType] = useState<"single" | "thread">("single");
  const [tone, setTone] = useState("Educational");
  const [includeVisual, setIncludeVisual] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResearching, setIsResearching] = useState(false);

  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [researchSources, setResearchSources] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<GeneratedPost[]>([]);
  const [editText, setEditText] = useState("");
  const [status, setStatus] = useState("");

  // Load drafts from localStorage + seed high-quality examples on first visit
  useEffect(() => {
    const saved = localStorage.getItem("rejuXPostDrafts");
    if (saved && JSON.parse(saved).length > 0) {
      setDrafts(JSON.parse(saved));
    } else {
      // Seed two high-quality, relevant starter posts
      const starterDrafts: GeneratedPost[] = [
        {
          id: "seed1",
          text: "Most tokenomics show you the map.\n\nRejunomics shows you the terrain ahead.\n\nTraditional models list allocations. Rejunomics discloses:\n• When & how tokens may enter circulation\n• Which incentives are finite\n• What ecosystem activity continues after hype fades\n\nThis is how projects move from speculation to sustained participation.\n\nLearn more about Rejunomics → rejutkn.com/rejunomics\n\nLock REJU. Participate. Author real transformation.\n\nrejutkn.com",
          imagePrompt: "Minimalist infographic: side-by-side comparison of 'Traditional Tokenomics' (simple pie) vs 'Rejunomics' (flow with arrows showing release, incentives, continuity). Elegant dark background with gold accents.",
          hashtags: "#Rejunomics #TokenTransparency #Crypto",
          theme: "rejunomics + industry",
          createdAt: new Date().toISOString(),
        },
        {
          id: "seed2",
          text: "Your cells have a built-in cleanup crew called autophagy.\n\nIt ramps up during fasting, recycling damaged components and supporting longevity.\n\nIn the REJU Rejuvenation Event, daily practices + the 6-month lock turn personal renewal into a structured system.\n\nYour journal becomes chapters you author.\n\nThis is participation with real skin in the game.\n\n→ rejutkn.com",
          imagePrompt: "Serene visual of a person quietly journaling at dawn. Subtle glowing cellular patterns and soft gold light symbolizing renewal and autophagy. Clean, inspiring wellness-crypto aesthetic.",
          hashtags: "#Autophagy #Fasting #REJU #Rejuvenation",
          theme: "health + event",
          createdAt: new Date().toISOString(),
        },
      ];
      setDrafts(starterDrafts);
      localStorage.setItem("rejuXPostDrafts", JSON.stringify(starterDrafts));
    }
  }, []);

  // Save drafts to localStorage
  const saveDrafts = (newDrafts: GeneratedPost[]) => {
    setDrafts(newDrafts);
    localStorage.setItem("rejuXPostDrafts", JSON.stringify(newDrafts));
  };

  const toggleTheme = (themeId: string, category: CoreCategory) => {
    if (coreCategory !== category) {
      setCoreCategory(category);
      setSelectedThemes([themeId]);
      return;
    }
    setSelectedThemes((prev) =>
      prev.includes(themeId)
        ? prev.filter((t) => t !== themeId)
        : [...prev, themeId]
    );
  };

  const switchCoreCategory = (category: CoreCategory) => {
    setCoreCategory(category);
    setSelectedThemes(category === "crypto" ? ["rejunomics"] : ["health"]);
    setResearchNotes([]);
    setResearchSources([]);
    setResearchQuery("");
  };

  const fetchLiveResearch = async (queryOverride?: string) => {
    const query = (queryOverride ?? researchQuery).trim();
    const res = await fetch("/api/x-post/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query || undefined,
        category: coreCategory,
        themes: selectedThemes,
        customFocus: customFocus || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Live internet research failed");
    }

    const notes: ResearchNote[] = data.notes || [];
    const sources: string[] = data.sourcesUsed || [];
    setResearchNotes(notes);
    setResearchSources(sources);
    return { notes, sources, queryUsed: data.queryUsed as string | undefined };
  };

  const runOnlineResearch = async (queryOverride?: string) => {
    setIsResearching(true);
    setStatus("Searching the internet for latest news and research...");

    try {
      const { sources, queryUsed } = await fetchLiveResearch(queryOverride);
      const sourceList = sources.length > 0 ? sources.join(", ") : "live news feeds";
      setStatus(
        queryUsed
          ? `Live results for "${queryUsed}" from ${sourceList}. Generate to weave into a REJU post.`
          : `Live results loaded from ${sourceList}. Generate to weave into a REJU post.`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setResearchNotes([]);
      setResearchSources([]);
      setStatus("Live research failed: " + message);
    } finally {
      setIsResearching(false);
    }
  };

  // Uses shared server logic via API (identical to what n8n will call)
  const generateHighQualityPost = async (): Promise<GeneratedPost & { sourcesUsed?: string[] }> => {
    const res = await fetch("/api/x-post/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedThemes,
        coreCategory,
        customFocus,
        researchQuery: researchQuery.trim() || undefined,
        fetchLiveResearch: true,
        postType,
        tone,
        includeVisual,
        variantSeed: Date.now(),
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to generate post");
    }

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Generation failed");

    if (data.post?.researchNotes?.length) {
      setResearchNotes(data.post.researchNotes);
      setResearchSources(data.post.sourcesUsed || []);
    }

    return {
      ...data.post,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
      sourcesUsed: data.post.sourcesUsed,
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatus("Fetching latest news from the internet...");

    try {
      const post = await generateHighQualityPost();
      setGeneratedPost(post);
      setEditText(post.text);

      const sourceHint = post.sourcesUsed?.length ? ` Built from live ${post.sourcesUsed.join(", ")}.` : "";
      const isConcept = post.text.toLowerCase().includes("rejunomics") && post.text.includes("rejutkn.com/rejunomics");
      setStatus(
        isConcept
          ? `Post generated from latest internet research.${sourceHint} Rejunomics link included. Review and save.`
          : `Post generated from latest internet research.${sourceHint} Review and save.`
      );
    } catch (err: any) {
      setStatus("Error generating post: " + (err.message || "Unknown error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!generatedPost) return;

    const updated = { ...generatedPost, text: editText };
    const newDrafts = [updated, ...drafts.filter((d) => d.id !== updated.id)];
    saveDrafts(newDrafts);
    setStatus("Draft saved to your library.");
  };

  const loadDraft = (draft: GeneratedPost) => {
    setGeneratedPost(draft);
    setEditText(draft.text);
    setStatus("Draft loaded into editor.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDraft = (id: string) => {
    const newDrafts = drafts.filter((d) => d.id !== id);
    saveDrafts(newDrafts);
    if (generatedPost?.id === id) {
      setGeneratedPost(null);
      setEditText("");
    }
    setStatus("Draft removed.");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setStatus(`${label} copied to clipboard.`);
      setTimeout(() => setStatus(""), 1800);
    });
  };

  const generateImagePrompt = () => {
    if (!generatedPost) return;
    const prompt = generatedPost.imagePrompt || 
      `Professional X post visual for REJU: ${generatedPost.theme}. Clean dark background with gold accents. High quality, modern crypto/wellness aesthetic.`;
    copyToClipboard(prompt, "Image prompt");
  };

  const quickResearchButtons = [
    { label: "Autophagy & Fasting", category: "rejuvenation" as CoreCategory, themes: ["health"] },
    { label: "Ketosis", category: "rejuvenation" as CoreCategory, themes: ["ketosis"] },
    { label: "Cellular Repair", category: "rejuvenation" as CoreCategory, themes: ["cellular_repair"] },
    { label: "Immunity", category: "rejuvenation" as CoreCategory, themes: ["immunity"] },
    { label: "Lymphatic System", category: "rejuvenation" as CoreCategory, themes: ["lymphatic"] },
    { label: "REJU Event", category: "rejuvenation" as CoreCategory, themes: ["event"] },
    { label: "Rejunomics", category: "crypto" as CoreCategory, themes: ["rejunomics"] },
    { label: "Crypto News", category: "crypto" as CoreCategory, themes: ["crypto_news"] },
    { label: "Today's News", category: "crypto" as CoreCategory, themes: ["crypto_news_today"] },
    { label: "Crypto Trends", category: "crypto" as CoreCategory, themes: ["crypto_trends"] },
    { label: "Industry Analysis", category: "crypto" as CoreCategory, themes: ["industry"] },
    { label: "Token Utility", category: "crypto" as CoreCategory, themes: ["token_utility"] },
    { label: "Crypto Ecosystem", category: "crypto" as CoreCategory, themes: ["crypto"] },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="mb-8 p-5 border border-[#f5c26b]/40 bg-[#120904] rounded-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[#f5c26b] font-bold text-sm tracking-[3px] uppercase">REJU PERSONNEL ONLY</p>
              <p className="text-xs text-gray-400 mt-0.5">X Content Studio — High-quality, research-backed posts for @rejutoken</p>
            </div>
            <a href="/admin" className="text-sm border border-[#f5c26b]/60 px-4 py-2 rounded hover:bg-[#f5c26b] hover:text-black transition">
              ← Back to Admin
            </a>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#f5c26b] mb-2">X Post Generator &amp; Manager</h1>
        <p className="text-gray-400 mb-8 max-w-3xl">
          Research relevant crypto transparency and health rejuvenation topics. Refine into high-quality, on-brand X posts and threads. 
          Proprietary concepts (like Rejunomics) automatically include backing links to rejutkn.com. Generate visuals. Export ready-to-post content.
          <br /><br />
          <strong>Two core themes — never mixed:</strong> Rejuvenation (health sciences + Event) and Crypto (Rejunomics, news, trends, utility). Use Research Online for custom topics.
          <br />
          <strong>Automated schedule:</strong> Mon=rejunomics, Wed=industry, Fri=token utility | Tue=autophagy, Thu=ketosis, Sat=cellular/immunity/lymphatic (rotates) | Sun=rest.
          <br />
          <strong>For automation:</strong> Vercel Cron hits <code>GET /api/x-post/auto</code> daily at 14:00 UTC. Manual override: <code>?force=crypto</code> or <code>?force=rejuvenation</code>.
          <br />
          <strong>For n8n:</strong> Call <code>POST /api/x-post/generate</code> for custom themes, or <code>GET /api/x-post/auto</code> for the day&apos;s scheduled post.
          <br />
          <strong>Rejuvenation source of truth:</strong>{" "}
          <em>{KATS_LEGACY_BOOK.title}</em> by {KATS_LEGACY_BOOK.author} —{" "}
          <a href={KATS_LEGACY_BOOK.amazonPaperback} target="_blank" rel="noopener noreferrer" className="text-[#f5c26b] underline">
            Amazon
          </a>
        </p>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            {/* Core category + themes */}
            <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-semibold text-[#f5c26b] mb-2">1. Core Theme</h3>
              <p className="text-xs text-gray-500 mb-2">Pick one category. Sub-themes stay within that category only.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => switchCoreCategory("rejuvenation")}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition ${
                    coreCategory === "rejuvenation"
                      ? "bg-[#f5c26b] text-black border-[#f5c26b]"
                      : "border-[#f5c26b]/40 hover:bg-[#f5c26b]/10"
                  }`}
                >
                  Rejuvenation
                </button>
                <button
                  onClick={() => switchCoreCategory("crypto")}
                  className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition ${
                    coreCategory === "crypto"
                      ? "bg-[#f5c26b] text-black border-[#f5c26b]"
                      : "border-[#f5c26b]/40 hover:bg-[#f5c26b]/10"
                  }`}
                >
                  Crypto
                </button>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-3">
                  {coreCategory === "rejuvenation" ? "Rejuvenation sub-themes" : "Crypto sub-themes"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(coreCategory === "rejuvenation" ? REJUVENATION_THEMES : CRYPTO_THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => toggleTheme(theme.id, coreCategory)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        selectedThemes.includes(theme.id)
                          ? "bg-[#f5c26b] text-black border-[#f5c26b]"
                          : "border-[#f5c26b]/40 hover:bg-[#f5c26b]/10"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus & Options */}
            <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#f5c26b] mb-2">2. Research &amp; Focus</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Searches the live internet (Google News, crypto RSS, PubMed) — not site content. Generated posts connect findings back to REJU.
                </p>
                <input
                  type="text"
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  placeholder={
                    coreCategory === "crypto"
                      ? "e.g. hype-driven token launches fail, SEC regulation, DeFi trends"
                      : "e.g. autophagy fasting studies 2026, lymphatic detox research"
                  }
                  className="w-full p-4 mb-3 bg-black/60 border border-[#f5c26b]/30 rounded-2xl text-sm"
                />
                <button
                  onClick={() => runOnlineResearch()}
                  disabled={isResearching}
                  className="w-full py-3 mb-4 border border-[#f5c26b]/50 rounded-2xl text-sm font-semibold hover:bg-[#f5c26b]/10 disabled:opacity-50 transition"
                >
                  {isResearching ? "Researching online..." : "Research Online"}
                </button>
                <label className="block text-sm text-gray-400 mb-1">Additional focus (optional)</label>
                <textarea
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder="e.g. emphasize 6-month lock, Wilson Fischmann autophagy research"
                  className="w-full h-16 p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl text-sm resize-y"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Post Type</label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as any)}
                    className="w-full p-3 bg-black/60 border border-[#f5c26b]/30 rounded-2xl text-sm"
                  >
                    <option value="single">Single Post (≤280 chars)</option>
                    <option value="thread">Thread (4 tweets)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-3 bg-black/60 border border-[#f5c26b]/30 rounded-2xl text-sm"
                  >
                    {TONES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visual"
                  checked={includeVisual}
                  onChange={(e) => setIncludeVisual(e.target.checked)}
                  className="accent-[#f5c26b]"
                />
                <label htmlFor="visual" className="text-sm">Include custom visual/image prompt</label>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || isResearching || selectedThemes.length === 0}
                className="w-full py-4 bg-[#f5c26b] text-black font-bold text-lg rounded-2xl hover:opacity-90 disabled:opacity-50 transition"
              >
                {isGenerating ? "Researching & Refining..." : "Generate High-Quality Post"}
              </button>
            </div>

            {/* Quick Research */}
            <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8">
              <h3 className="text-xl font-semibold text-[#f5c26b] mb-4">Quick Research</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickResearchButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      switchCoreCategory(btn.category);
                      setSelectedThemes(btn.themes);
                      setResearchQuery("");
                      runOnlineResearch();
                    }}
                    className="px-4 py-2 text-sm border border-[#f5c26b]/40 rounded-full hover:bg-[#f5c26b]/10"
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => runOnlineResearch()}
                disabled={isResearching}
                className="text-sm underline text-[#f5c26b] disabled:opacity-50"
              >
                Fetch live news for current themes
              </button>
            </div>
          </div>

          {/* Output + Research */}
          <div className="lg:col-span-7 space-y-8">
            {/* Research Context */}
            {coreCategory === "rejuvenation" && (
              <div className="bg-[#120904] border border-[#f5c26b]/25 rounded-3xl p-6 text-sm text-gray-300">
                <p className="text-[#f5c26b] font-semibold uppercase tracking-widest text-xs mb-2">Primary book source</p>
                <p>
                  Rejuvenation posts are trained on the <strong>complete PDF</strong> from{" "}
                  <code className="text-[#f5c26b]/80">{BOOK_SOURCE_DIR}</code> — <em>{KATS_LEGACY_BOOK.title}</em>{" "}
                  ({getBookKnowledgeMeta().extractedChars.toLocaleString()} chars, {getBookKnowledgeMeta().chapters.length} sections).
                  Topics: {getBookKnowledgeMeta().coreConcepts.slice(0, 6).join(", ")}, and more.
                </p>
              </div>
            )}

            {researchNotes.length > 0 && (
              <div className="bg-[#111] border border-[#f5c26b]/15 rounded-3xl p-8">
                <h3 className="font-semibold mb-1 text-[#f5c26b]">Live Internet Research</h3>
                {researchSources.length > 0 && (
                  <p className="text-xs text-gray-500 mb-4">
                    Sources: {researchSources.join(" · ")}
                  </p>
                )}
                <ul className="space-y-3 text-sm text-gray-300">
                  {researchNotes.map((note) => (
                    <li key={note.id} className="flex gap-2">
                      <span className="text-[#f5c26b]">•</span>
                      <span>
                        {note.text}{" "}
                        <span className="text-xs text-gray-500">
                          — {note.source}
                          {note.publishedAt ? ` (${note.publishedAt})` : ""}
                        </span>
                        {note.url && (
                          <a href={note.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#f5c26b]/70 underline mt-0.5">
                            View source
                          </a>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Generated Output */}
            {generatedPost && (
              <div className="bg-[#120904] border border-[#f5c26b]/25 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-[#f5c26b]">Generated Post</h3>
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => copyToClipboard(generatedPost.text, "Post text")} className="px-3 py-1 border border-[#f5c26b]/40 rounded hover:bg-white/5">Copy Text</button>
                    {generatedPost.imagePrompt && (
                      <button onClick={generateImagePrompt} className="px-3 py-1 border border-[#f5c26b]/40 rounded hover:bg-white/5">Copy Image Prompt</button>
                    )}
                  </div>
                </div>

                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full min-h-[180px] p-5 bg-black/70 border border-[#f5c26b]/30 rounded-2xl font-mono text-[15px] leading-relaxed resize-y"
                />

                {generatedPost.thread && generatedPost.thread.length > 1 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Thread preview:</p>
                    {generatedPost.thread.map((t, i) => (
                      <div key={i} className="text-sm bg-black/40 p-3 rounded mb-2 border-l-2 border-[#f5c26b]/50">{t}</div>
                    ))}
                  </div>
                )}

                {generatedPost.imagePrompt && (
                  <div className="mt-4 text-sm">
                    <p className="text-[#f5c26b] font-medium mb-1">Visual Prompt:</p>
                    <p className="text-gray-400">{generatedPost.imagePrompt}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={handleSaveDraft} className="px-6 py-3 border border-[#f5c26b] text-[#f5c26b] rounded-2xl hover:bg-[#f5c26b] hover:text-black">Save as Draft</button>
                  <button onClick={handleGenerate} className="px-6 py-3 border border-[#f5c26b]/50 rounded-2xl hover:bg-white/5">Generate Variation</button>
                  <button onClick={() => copyToClipboard(generatedPost.hashtags, "Hashtags")} className="px-6 py-3 border border-[#f5c26b]/50 rounded-2xl hover:bg-white/5">Copy Hashtags</button>
                </div>
              </div>
            )}

            {!generatedPost && (
              <div className="bg-[#120904]/60 border border-[#f5c26b]/10 rounded-3xl p-12 text-center text-gray-400">
                Select themes and click <span className="text-[#f5c26b]">Generate High-Quality Post</span> to begin.
              </div>
            )}

            {status && (
              <div className="p-4 bg-[#120904] border border-[#f5c26b]/30 text-[#f5c26b] rounded-2xl text-sm">{status}</div>
            )}
          </div>
        </div>

        {/* Drafts Library */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-[#f5c26b] mb-6">Drafts Library ({drafts.length})</h2>
          {drafts.length === 0 ? (
            <p className="text-gray-500">No saved drafts yet. Generate and save high-quality posts here.</p>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-[#120904] border border-[#f5c26b]/15 rounded-3xl p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">{new Date(draft.createdAt).toLocaleDateString()} • {draft.theme}</div>
                    <p className="text-sm whitespace-pre-line leading-relaxed text-gray-200 line-clamp-4">{draft.text}</p>
                    {draft.imagePrompt && <p className="mt-2 text-xs text-[#f5c26b]">📷 Visual prompt available</p>}
                  </div>
                  <div className="flex md:flex-col gap-2 text-sm shrink-0">
                    <button onClick={() => loadDraft(draft)} className="px-4 py-2 border border-[#f5c26b]/40 rounded hover:bg-[#f5c26b]/10">Load &amp; Edit</button>
                    <button onClick={() => copyToClipboard(draft.text, "Draft")} className="px-4 py-2 border border-[#f5c26b]/40 rounded hover:bg-[#f5c26b]/10">Copy</button>
                    <button onClick={() => deleteDraft(draft.id)} className="px-4 py-2 border border-red-500/30 text-red-400 rounded hover:bg-red-950/30">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-xs text-gray-500 max-w-2xl">
          Search fields query the live internet — Google News, Cointelegraph, Decrypt, PubMed, CoinGecko trending. Generated posts weave those findings back to REJU/Rejunomics. Categories are never mixed.
        </div>
      </div>
    </div>
  );
}
