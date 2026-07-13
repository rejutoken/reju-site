// Fresh concept library from Kat's Legacy + Google Drive event materials.
// Loaded on every post generation so new Drive uploads stay in sync.

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { google } from "googleapis";
import bookKnowledge from "./katsLegacyBook.knowledge.json";
import type { BookKnowledge } from "./katsLegacyBook";
import type { ResearchNote } from "./postResearch";
import { EVENT_MATERIALS_DRIVE_FOLDER } from "./rejuMaterials";

const KNOWLEDGE = bookKnowledge as BookKnowledge;

const DEFAULT_EVENT_MATERIALS_FOLDER_ID = "1lHo-fpI6yJ_j8Ze-ZwZNSE5fUV9rPLBB";

const TEXT_MIME_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
]);

const EXPORTABLE_GOOGLE_MIME: Record<string, string> = {
  "application/vnd.google-apps.document": "text/plain",
};

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "from", "that", "this", "your", "body", "into",
  "about", "their", "have", "been", "when", "what", "how", "are", "was", "will",
]);

export interface LibraryConcept {
  id: string;
  name: string;
  description: string;
  source: "kats-legacy" | "drive";
  sourceFile?: string;
  themeId?: string;
  keywords: string[];
}

export interface ConceptMatch {
  researchNoteId: string;
  researchText: string;
  matchedConcepts: LibraryConcept[];
  alignmentScore: number;
}

export interface ConceptAlignmentResult {
  library: LibraryConcept[];
  matches: ConceptMatch[];
  libraryLoadedAt: string;
  driveFileCount: number;
  driveConceptCount: number;
  bookConceptCount: number;
}

interface DriveFileMeta {
  id: string;
  name: string;
  mimeType: string;
}

function getDriveFolderId(): string {
  const env = process.env.GOOGLE_DRIVE_EVENTMATERIALS?.trim();
  if (env) return env;
  const match = EVENT_MATERIALS_DRIVE_FOLDER.match(/folders\/([^/?]+)/);
  return match?.[1] ?? DEFAULT_EVENT_MATERIALS_FOLDER_ID;
}

function getDriveAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) return null;

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return google.drive({ version: "v3", auth });
}

function titleFromFilename(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));
}

function uniqueKeywords(...parts: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    for (const token of tokenize(part)) {
      if (!seen.has(token)) {
        seen.add(token);
        out.push(token);
      }
    }
  }
  return out.slice(0, 24);
}

function extractConceptsFromText(
  text: string,
  sourceFile: string,
  prefix: string
): LibraryConcept[] {
  const concepts: LibraryConcept[] = [];
  const seen = new Set<string>();

  const headingMatches = text.match(/^#{1,3}\s+(.+)$/gm) ?? [];
  for (const raw of headingMatches.slice(0, 12)) {
    const name = raw.replace(/^#+\s+/, "").replace(/\*\*/g, "").trim();
    if (!name || name.length < 4 || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());

    const idx = text.indexOf(raw);
    const after = text.slice(idx + raw.length, idx + raw.length + 400);
    const description = after.replace(/^[\s#*]+/gm, "").split("\n").find((l) => l.trim().length > 20)?.trim() ?? name;

    concepts.push({
      id: `${prefix}-${concepts.length}`,
      name,
      description: description.slice(0, 280),
      source: "drive",
      sourceFile,
      keywords: uniqueKeywords(name, description),
    });
  }

  const boldMatches = text.match(/\*\*([^*]{4,80})\*\*/g) ?? [];
  for (const raw of boldMatches.slice(0, 8)) {
    const name = raw.replace(/\*\*/g, "").trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    concepts.push({
      id: `${prefix}-b-${concepts.length}`,
      name,
      description: name,
      source: "drive",
      sourceFile,
      keywords: uniqueKeywords(name),
    });
  }

  if (concepts.length === 0) {
    const firstPara = text.split(/\n\n+/).find((p) => p.trim().length > 40)?.trim();
    const name = titleFromFilename(sourceFile);
    if (firstPara) {
      concepts.push({
        id: `${prefix}-file`,
        name,
        description: firstPara.slice(0, 280),
        source: "drive",
        sourceFile,
        keywords: uniqueKeywords(name, firstPara),
      });
    }
  }

  return concepts;
}

const REJUNOMICS_CONCEPTS: LibraryConcept[] = [
  {
    id: "reju-rejunomics",
    name: "Rejunomics & Token Transparency",
    description: "Release behavior, finite incentive lifecycles, and ecosystem continuity after launch hype fades.",
    source: "drive",
    sourceFile: "REJU Rejunomics",
    themeId: "rejunomics",
    keywords: uniqueKeywords("rejunomics", "tokenomics", "transparency", "release", "incentives", "continuity"),
  },
  {
    id: "reju-token-utility",
    name: "Token Utility & 6-Month Lock",
    description: "REJU utility tied to Rejuvenation Event access, education, certification, and documented transformation.",
    source: "drive",
    sourceFile: "REJU Token Utility",
    themeId: "token_utility",
    keywords: uniqueKeywords("utility", "token", "lock", "participation", "rejuvenation", "event"),
  },
  {
    id: "reju-industry",
    name: "Crypto Industry Continuity",
    description: "Projects that survive disclose what happens when incentives fade and hype disappears.",
    source: "drive",
    sourceFile: "REJU Industry Analysis",
    themeId: "industry",
    keywords: uniqueKeywords("crypto", "industry", "failure", "survivors", "transparency", "continuity"),
  },
];

function loadKatsLegacyConcepts(): LibraryConcept[] {
  const concepts: LibraryConcept[] = [];

  for (const [themeId, theme] of Object.entries(KNOWLEDGE.themes)) {
    concepts.push({
      id: `book-${themeId}`,
      name: THEMES_LABEL[themeId] ?? themeId,
      description: theme.excerpt,
      source: "kats-legacy",
      sourceFile: KNOWLEDGE.title,
      themeId,
      keywords: uniqueKeywords(theme.hook, theme.excerpt, themeId, ...theme.chapters),
    });
  }

  for (const name of KNOWLEDGE.coreConcepts) {
    concepts.push({
      id: `book-core-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      description: `Core concept from Kat's Legacy by ${KNOWLEDGE.author}`,
      source: "kats-legacy",
      sourceFile: KNOWLEDGE.title,
      keywords: uniqueKeywords(name),
    });
  }

  return concepts;
}

const THEMES_LABEL: Record<string, string> = {
  health: "Autophagy & Fasting",
  ketosis: "Ketosis & Metabolic Flexibility",
  cellular_repair: "Cellular Repair & Renewal",
  immunity: "Immunity & Inflammation",
  lymphatic: "Lymphatic System & Detox",
  event: "REJU Rejuvenation Event & 4-Week Reset",
};

async function listDriveFilesRecursive(
  drive: ReturnType<typeof google.drive>,
  folderId: string,
  depth = 0
): Promise<DriveFileMeta[]> {
  if (depth > 4) return [];

  const files: DriveFileMeta[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageSize: 100,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      pageToken,
    });

    for (const file of res.data.files ?? []) {
      if (!file.id || !file.name || !file.mimeType) continue;
      if (file.mimeType === "application/vnd.google-apps.folder") {
        const nested = await listDriveFilesRecursive(drive, file.id, depth + 1);
        files.push(...nested);
      } else {
        files.push({ id: file.id, name: file.name, mimeType: file.mimeType });
      }
    }
    pageToken = res.data.nextPageToken ?? undefined;
  } while (pageToken);

  return files;
}

async function readDriveFileText(
  drive: ReturnType<typeof google.drive>,
  file: DriveFileMeta
): Promise<string | null> {
  try {
    if (EXPORTABLE_GOOGLE_MIME[file.mimeType]) {
      const res = await drive.files.export(
        { fileId: file.id, mimeType: EXPORTABLE_GOOGLE_MIME[file.mimeType] },
        { responseType: "text" }
      );
      return ((res.data as string) || "").slice(0, 50000);
    }

    if (TEXT_MIME_TYPES.has(file.mimeType) || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
      const res = await drive.files.get(
        { fileId: file.id, alt: "media" },
        { responseType: "text" }
      );
      return ((res.data as string) || "").slice(0, 50000);
    }

    return null;
  } catch {
    return null;
  }
}

function readLocalMdFallback(pdfOrFileName: string): string | null {
  const base = pdfOrFileName.replace(/\.[^.]+$/, "");
  const localPath = join(process.cwd(), "public", "materials", `${base}.md`);
  if (!existsSync(localPath)) return null;
  try {
    return readFileSync(localPath, "utf-8").slice(0, 50000);
  } catch {
    return null;
  }
}

async function loadDriveConcepts(): Promise<{ concepts: LibraryConcept[]; fileCount: number }> {
  const drive = getDriveAuth();
  if (!drive) return { concepts: [], fileCount: 0 };

  const folderId = getDriveFolderId();
  const files = await listDriveFilesRecursive(drive, folderId);
  const concepts: LibraryConcept[] = [];
  const maxFiles = 40;

  for (const file of files.slice(0, maxFiles)) {
    let text = await readDriveFileText(drive, file);

    if (!text && file.name.toLowerCase().endsWith(".pdf")) {
      text = readLocalMdFallback(file.name);
    }

    if (text && text.trim().length > 40) {
      concepts.push(...extractConceptsFromText(text, file.name, `drive-${file.id.slice(0, 8)}`));
    } else if (!file.name.startsWith("~$")) {
      const name = titleFromFilename(file.name);
      concepts.push({
        id: `drive-meta-${file.id.slice(0, 8)}`,
        name,
        description: `Research material in the REJU event materials library (${file.name}).`,
        source: "drive",
        sourceFile: file.name,
        keywords: uniqueKeywords(name),
      });
    }
  }

  return { concepts, fileCount: files.length };
}

function scoreConceptAgainstText(
  text: string,
  concept: LibraryConcept,
  themes: string[]
): number {
  const haystack = text.toLowerCase();
  let score = 0;

  for (const kw of concept.keywords) {
    if (haystack.includes(kw)) score += 2;
  }

  const nameTokens = tokenize(concept.name);
  for (const token of nameTokens) {
    if (haystack.includes(token)) score += 3;
  }

  if (concept.themeId && themes.includes(concept.themeId)) score += 6;

  if (concept.source === "kats-legacy") score += 1;

  return score;
}

export function matchResearchToConcepts(
  notes: ResearchNote[],
  library: LibraryConcept[],
  themes: string[] = []
): ConceptMatch[] {
  return notes.map((note) => {
    const scored = library
      .map((concept) => ({
        concept,
        score: scoreConceptAgainstText(note.text, concept, themes),
      }))
      .filter((s) => s.score >= 4)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    return {
      researchNoteId: note.id,
      researchText: note.text,
      matchedConcepts: scored.map((s) => s.concept),
      alignmentScore: scored[0]?.score ?? 0,
    };
  });
}

export async function loadConceptLibrary(): Promise<{
  concepts: LibraryConcept[];
  bookConceptCount: number;
  driveConceptCount: number;
  driveFileCount: number;
}> {
  const bookConcepts = loadKatsLegacyConcepts();
  const drive = await loadDriveConcepts();

  const seen = new Set<string>();
  const merged: LibraryConcept[] = [];

  for (const concept of [...bookConcepts, ...drive.concepts]) {
    const key = `${concept.source}:${concept.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(concept);
  }

  return {
    concepts: merged,
    bookConceptCount: bookConcepts.length,
    driveConceptCount: drive.concepts.length,
    driveFileCount: drive.fileCount,
  };
}

export async function alignResearchWithLibrary(params: {
  notes: ResearchNote[];
  themes?: string[];
  category?: "crypto" | "rejuvenation";
}): Promise<ConceptAlignmentResult> {
  const { notes, themes = [] } = params;
  const loaded = await loadConceptLibrary();

  let library = loaded.concepts;
  if (params.category === "crypto") {
    const driveCrypto = loaded.concepts.filter(
      (c) =>
        c.source === "drive" &&
        ["crypto", "token", "rejunomics", "blockchain", "web3"].some((k) =>
          `${c.name} ${c.description} ${c.sourceFile ?? ""}`.toLowerCase().includes(k)
        )
    );
    library = [...REJUNOMICS_CONCEPTS, ...driveCrypto];
  }

  const matches = matchResearchToConcepts(notes, library, themes);

  return {
    library,
    matches,
    libraryLoadedAt: new Date().toISOString(),
    driveFileCount: loaded.driveFileCount,
    driveConceptCount: loaded.driveConceptCount,
    bookConceptCount: loaded.bookConceptCount,
  };
}

export function getTopAlignedConcept(matches: ConceptMatch[]): LibraryConcept | null {
  const best = matches
    .filter((m) => m.matchedConcepts.length > 0)
    .sort((a, b) => b.alignmentScore - a.alignmentScore)[0];
  return best?.matchedConcepts[0] ?? null;
}

export function buildConceptBridge(
  concept: LibraryConcept | null,
  category: "crypto" | "rejuvenation"
): string {
  if (!concept) {
    return category === "crypto"
      ? "REJU answers the continuity question — transparent economics and sustained participation."
      : "Kat's Legacy and the REJU Protocol™ structure this science into daily practice.";
  }

  if (category === "crypto") {
    return `In Rejunomics, this ties to ${concept.name} — transparent economics beyond the launch window.`;
  }

  if (concept.source === "kats-legacy") {
    return `In Kat's Legacy, this is ${concept.name} — structured in the REJU Protocol™.`;
  }

  return `In our research library, this connects to ${concept.name} — part of the REJU rejuvenation curriculum.`;
}