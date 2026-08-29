"use client";

import React, { useState, useEffect } from "react";
import { getBookKnowledgeMeta, KATS_LEGACY_BOOK } from "../../lib/katsLegacyBook";
import { EVENT_MATERIALS_DRIVE_FOLDER } from "../../lib/rejuMaterials";

type XPostEntry = "admin" | "collaborator";
type XPostRole = "admin" | "collaborator";

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

interface LibraryConcept {
  id: string;
  name: string;
  description: string;
  source: "kats-legacy" | "drive";
  sourceFile?: string;
}

interface ConceptMatch {
  researchNoteId: string;
  researchText: string;
  matchedConcepts: LibraryConcept[];
  alignmentScore: number;
}

interface LibraryStats {
  bookConceptCount: number;
  driveConceptCount: number;
  driveFileCount: number;
  libraryLoadedAt: string;
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

export default function XPostStudio({ entry = "admin" }: { entry?: XPostEntry }) {
  const [authRole, setAuthRole] = useState<XPostRole | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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
  const [conceptMatches, setConceptMatches] = useState<ConceptMatch[]>([]);
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null);
  const [drafts, setDrafts] = useState<GeneratedPost[]>([]);
  const [editText, setEditText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/x-post/auth", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.role) {
          setAuthRole(data.role);
        }
      })
      .catch(() => setLoginError("Could not verify session."))
      .finally(() => setAuthChecking(false));
  }, []);

  async function handleLogin() {
    if (!loginPassword.trim()) {
      setLoginError("Enter your access password.");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/x-post/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: loginPassword.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthRole(data.role);
        setLoginPassword("");
      } else {
        setLoginError(data.error || "Invalid password.");
      }
    } catch {
      setLoginError("Login failed. Check your connection.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/x-post/auth", { method: "DELETE", credentials: "include" });
    setAuthRole(null);
    setStatus("Signed out.");
  }

  // Load drafts from localStorage + seed high-quality examples on first visit
  useEffect(() => {
    if (!authRole) return;
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
  }, [authRole]);

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
    setConceptMatches([]);
    setLibraryStats(null);
    setResearchQuery("");
  };

  const fetchLiveResearch = async (queryOverride?: string) => {
    const query = (queryOverride ?? researchQuery).trim();
    const res = await fetch("/api/x-post/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
    setConceptMatches(data.conceptMatches || []);
    setLibraryStats(data.libraryStats || null);
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
          ? `Live results for "${queryUsed}" from ${sourceList}. Concepts aligned to Kat's Legacy / Drive library — generate to draft the post.`
          : `Live results from ${sourceList}, aligned to concept library. Generate to draft the post.`
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setResearchNotes([]);
      setResearchSources([]);
      setConceptMatches([]);
      setLibraryStats(null);
      setStatus("Live research failed: " + message);
    } finally {
      setIsResearching(false);
    }
  };

  const generateHighQualityPost = async (): Promise<
    GeneratedPost & { sourcesUsed?: string[]; conceptMatches?: ConceptMatch[]; libraryStats?: LibraryStats }
  > => {
    const res = await fetch("/api/x-post/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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
    if (data.post?.conceptMatches?.length) {
      setConceptMatches(data.post.conceptMatches);
    }
    if (data.post?.libraryStats) {
      setLibraryStats(data.post.libraryStats);
    }

    return {
      ...data.post,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString(),
      sourcesUsed: data.post.sourcesUsed,
      conceptMatches: data.post.conceptMatches,
      libraryStats: data.post.libraryStats,
    };
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatus("Searching the internet and reloading concept library from Drive...");

    try {
      const post = await generateHighQualityPost();
      setGeneratedPost(post);
      setEditText(post.text);

      const sourceHint = post.sourcesUsed?.length ? ` Built from live ${post.sourcesUsed.join(", ")}.` : "";
      const matchCount = post.conceptMatches?.filter((m) => m.matchedConcepts.length > 0).length ?? 0;
      const libraryHint = post.libraryStats
        ? ` Library: ${post.libraryStats.bookConceptCount} book + ${post.libraryStats.driveConceptCount} Drive concepts (${post.libraryStats.driveFileCount} files).`
        : "";
      const alignHint = matchCount > 0 ? ` ${matchCount} research note(s) aligned to Kat's Legacy / Drive library.` : "";
      setStatus(`Post generated from internet research, aligned to our concept library.${sourceHint}${libraryHint}${alignHint} Review and save.`);
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

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white flex items-center justify-center p-8">
        <p className="text-gray-400">Checking access...</p>
      </div>
    );
  }

  if (!authRole) {
    return (
      <div className="min-h-screen bg-[#0b0b0c] text-white p-8">
        <div className="max-w-md mx-auto mt-24 bg-[#120904] border border-[#f5c26b]/30 p-8 rounded-3xl">
          <p className="text-[#f5c26b] font-bold text-sm tracking-[3px] uppercase mb-2">
            {entry === "collaborator" ? "X Post Collaborator" : "X Post Studio"}
          </p>
          <h1 className="text-2xl font-semibold mb-2">Sign in to continue</h1>
          <p className="text-sm text-gray-400 mb-6">
            {entry === "collaborator"
              ? "Enter your collaborator password to research topics and generate X posts. You will not have access to admin settings."
              : "Enter your admin or collaborator password to open the X Post Generator."}
          </p>
          <input
            type="password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
            placeholder="Access password"
            className="w-full p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl mb-4 font-mono"
          />
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full py-4 bg-[#f5c26b] text-black font-bold rounded-2xl hover:opacity-90 disabled:opacity-50"
          >
            {loginLoading ? "Signing in..." : "Sign In"}
          </button>
          {loginError && <p className="text-red-400 mt-3 text-sm">{loginError}</p>}
        </div>
      </div>
    );
  }

  const showAdminLink = entry === "admin" && authRole === "admin";
  const isCollaborator = authRole === "collaborator";

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="mb-8 p-5 border border-[#f5c26b]/40 bg-[#120904] rounded-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-[#f5c26b] font-bold text-sm tracking-[3px] uppercase">
                {isCollaborator ? "X POST COLLABORATOR" : "REJU PERSONNEL ONLY"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                X Content Studio — research-backed posts for @rejutoken
                {isCollaborator ? " (draft & export only)" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              {showAdminLink && (
                <a href="/admin" className="text-sm border border-[#f5c26b]/60 px-4 py-2 rounded hover:bg-[#f5c26b] hover:text-black transition">
                  ← Back to Admin
                </a>
              )}
              <button
                onClick={handleLogout}
                className="text-sm border border-white/20 px-4 py-2 rounded hover:bg-white/5 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#f5c26b] mb-2">X Post Generator &amp; Manager</h1>
        <p className="text-gray-400 mb-8 max-w-3xl">
          Research relevant crypto transparency and health rejuvenation topics. Refine into high-quality, on-brand X posts and threads. 
          Proprietary concepts (like Rejunomics) automatically include backing links to rejutkn.com. Generate visuals. Export ready-to-post content.
          <br /><br />
          <strong>Two core themes — never mixed:</strong> Rejuvenation (health sciences + Event) and Crypto (Rejunomics, news, trends, utility). Use Research Online for custom topics.
          {!isCollaborator && (
            <>
              <br />
              <strong>Automated schedule:</strong> Mon=rejunomics, Wed=industry, Fri=token utility | Tue=autophagy, Thu=ketosis, Sat=cellular/immunity/lymphatic (rotates) | Sun=rest.
              <br />
              <strong>For automation:</strong> Vercel Cron hits <code>GET /api/x-post/auto</code> daily at 14:00 UTC.
            </>
          )}
          <br />
          <strong>Concept sources (reloaded every generation):</strong>{" "}
          <em>{KATS_LEGACY_BOOK.title}</em> by {KATS_LEGACY_BOOK.author} —{" "}
          <a href={KATS_LEGACY_BOOK.amazonPaperback} target="_blank" rel="noopener noreferrer" className="text-[#f5c26b] underline">
            Amazon
          </a>
          {" "}+{" "}
          <a href={EVENT_MATERIALS_DRIVE_FOLDER} target="_blank" rel="noopener noreferrer" className="text-[#f5c26b] underline">
            Event Materials Library (Google Drive)
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
                  Searches the live internet (Google News, crypto RSS, PubMed), then aligns findings to Kat&apos;s Legacy and the Drive concept library — reloaded on every generate so new uploads stay current.
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
                  Rejuvenation posts are trained on the published book{" "}
                  <em>{KATS_LEGACY_BOOK.title}</em>{" "}
                  ({getBookKnowledgeMeta().extractedChars.toLocaleString()} chars, {getBookKnowledgeMeta().chapters.length} sections).
                  Topics: {getBookKnowledgeMeta().coreConcepts.slice(0, 6).join(", ")}, and more.
                </p>
              </div>
            )}

            {libraryStats && (
              <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-6 text-sm text-gray-300">
                <p className="text-[#f5c26b] font-semibold uppercase tracking-widest text-xs mb-2">Concept library (live)</p>
                <p>
                  {libraryStats.bookConceptCount} Kat&apos;s Legacy concepts · {libraryStats.driveConceptCount} from Drive ({libraryStats.driveFileCount} files) · loaded{" "}
                  {new Date(libraryStats.libraryLoadedAt).toLocaleString()}
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
                  {researchNotes.map((note) => {
                    const match = conceptMatches.find((m) => m.researchNoteId === note.id);
                    return (
                      <li key={note.id} className="flex gap-2">
                        <span className="text-[#f5c26b]">•</span>
                        <span>
                          {note.text}{" "}
                          <span className="text-xs text-gray-500">
                            — {note.source}
                            {note.publishedAt ? ` (${note.publishedAt})` : ""}
                          </span>
                          {match && match.matchedConcepts.length > 0 && (
                            <span className="block text-xs text-[#f5c26b]/80 mt-1">
                              Aligned: {match.matchedConcepts.map((c) => `${c.name} (${c.source === "kats-legacy" ? "Kat's Legacy" : c.sourceFile ?? "Drive"})`).join(" · ")}
                            </span>
                          )}
                          {note.url && (
                            <a href={note.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-[#f5c26b]/70 underline mt-0.5">
                              View source
                            </a>
                          )}
                        </span>
                      </li>
                    );
                  })}
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
          Internet search pulls from Google News, Cointelegraph, Decrypt, PubMed, and CoinGecko. Each generation reloads the concept library from Kat&apos;s Legacy plus the{" "}
          <a href={EVENT_MATERIALS_DRIVE_FOLDER} target="_blank" rel="noopener noreferrer" className="text-[#f5c26b]/70 underline">
            Event Materials Drive folder
          </a>
          , then aligns research findings to matching concepts before drafting the post. Categories are never mixed.
        </div>
      </div>
    </div>
  );
}
