import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { getDriveClient, getJsonFilesFolderId } from "./driveJsonFolder";
import { DUP_WINDOW_DAYS, hashText } from "./xQualityGate";
import type { XAccount } from "./xPublish";

/** One successful auto post. Fields after `at` were added Oct 2026 and are optional for old entries. */
export type XAutoLogEntry = {
  account: XAccount;
  textHash: string;
  text: string;
  tweetId?: string;
  slot?: string;
  at: string;
  /** Content pillar (fact, story, news, path_b, ...). */
  pillar?: string;
  /** Bank post id or "news". */
  sourceId?: string;
  bridgeId?: string;
  takeId?: string;
  headline?: string;
  headlineKey?: string;
  headlineUrl?: string;
  linkUsed?: boolean;
  followCta?: boolean;
  cardVariant?: string;
  /** True when the image uploaded and the post went out with it. */
  hasMedia?: boolean;
  mediaNote?: string;
  usedFallback?: boolean;
};

export type XAutoFailure = {
  account: XAccount;
  at: string;
  stage: "generate" | "gate" | "publish" | "media";
  reason: string;
};

export type XAccountWeekMetrics = {
  posts: number;
  withMedia: number;
  withLink: number;
  medianImpressions: number | null;
  totalImpressions: number;
  likes: number;
  replies: number;
  reposts: number;
  quotes: number;
  bookmarks: number;
  engagementRate: number | null;
  byPillar: Record<string, { posts: number; medianImpressions: number | null }>;
  byLink: { link: number | null; noLink: number | null };
  byMedia: { media: number | null; noMedia: number | null };
  posts_detail: Array<{
    tweetId: string;
    at: string;
    pillar?: string;
    cardVariant?: string;
    impressions: number;
    likes: number;
    replies: number;
    reposts: number;
  }>;
};

export type XWeeklyMetrics = {
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  accounts: Partial<Record<XAccount, XAccountWeekMetrics>>;
  errors?: string[];
};

export type XAutoStore = {
  recent: XAutoLogEntry[];
  failures?: XAutoFailure[];
  metrics?: XWeeklyMetrics[];
  alerts?: Array<{ at: string; message: string; delivered: string[] }>;
};

const FILE_NAME = "x-auto-log.json";
const LOCAL_PATH = path.join(process.cwd(), ".data", "x-auto-log.json");
/** About 100 days of history for two accounts posting once a day. */
export const MAX_ENTRIES = 200;
const MAX_FAILURES = 60;
const MAX_METRICS = 30;
const MAX_ALERTS = 30;
export const DUP_WINDOW_MS = DUP_WINDOW_DAYS * 24 * 60 * 60 * 1000;

function driveConfigured() {
  return Boolean(
    process.env.GOOGLE_DRIVE_JSONFILES?.trim() &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

export function hashPostText(text: string): string {
  return hashText(text);
}

function emptyStore(): XAutoStore {
  return { recent: [], failures: [], metrics: [], alerts: [] };
}

function normalizeStore(raw: unknown): XAutoStore {
  if (!raw || typeof raw !== "object") return emptyStore();
  const obj = raw as Partial<XAutoStore>;
  const recent = Array.isArray(obj.recent)
    ? obj.recent.filter(
        (entry) => entry && typeof entry.textHash === "string" && typeof entry.account === "string"
      )
    : [];
  return {
    recent,
    failures: Array.isArray(obj.failures) ? obj.failures : [],
    metrics: Array.isArray(obj.metrics) ? obj.metrics : [],
    alerts: Array.isArray(obj.alerts) ? obj.alerts : [],
  };
}

function readLocal(): XAutoStore {
  try {
    if (!fs.existsSync(LOCAL_PATH)) return emptyStore();
    return normalizeStore(JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8")));
  } catch {
    return emptyStore();
  }
}

function writeLocal(store: XAutoStore) {
  fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function findFileId(drive: ReturnType<typeof getDriveClient>, folderId: string) {
  const list = await drive.files.list({
    q: `'${folderId}' in parents and name = '${FILE_NAME}' and trashed = false`,
    fields: "files(id)",
    orderBy: "modifiedTime desc",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return list.data.files?.[0]?.id || null;
}

async function readDrive(): Promise<XAutoStore> {
  const drive = getDriveClient();
  const folderId = getJsonFilesFolderId();
  const fileId = await findFileId(drive, folderId);
  if (!fileId) return emptyStore();
  const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "text" });
  return normalizeStore(JSON.parse((res.data as string) || "{}"));
}

async function writeDrive(store: XAutoStore) {
  const drive = getDriveClient();
  const folderId = getJsonFilesFolderId();
  const body = JSON.stringify(store, null, 2);
  const media = {
    mimeType: "application/json",
    body: Readable.from(Buffer.from(body, "utf8")),
  };
  const fileId = await findFileId(drive, folderId);
  if (!fileId) {
    await drive.files.create({
      requestBody: { name: FILE_NAME, parents: [folderId] },
      media,
      fields: "id",
      supportsAllDrives: true,
    });
    return;
  }
  await drive.files.update({
    fileId,
    media,
    fields: "id",
    supportsAllDrives: true,
  });
}

export async function readXAutoStore(): Promise<XAutoStore> {
  if (driveConfigured()) {
    try {
      return await readDrive();
    } catch (error) {
      console.error("X auto log Drive read failed, using local:", error);
    }
  }
  return readLocal();
}

export async function writeXAutoStore(store: XAutoStore): Promise<void> {
  store.recent = store.recent.slice(0, MAX_ENTRIES);
  store.failures = (store.failures || []).slice(0, MAX_FAILURES);
  store.metrics = (store.metrics || []).slice(0, MAX_METRICS);
  store.alerts = (store.alerts || []).slice(0, MAX_ALERTS);
  if (driveConfigured()) {
    try {
      await writeDrive(store);
      return;
    } catch (error) {
      console.error("X auto log Drive write failed, using local:", error);
    }
  }
  writeLocal(store);
}

/** Kept for older callers: exact-text check inside the dedupe window. */
export async function wasRecentlyPosted(account: XAccount, text: string, now = new Date()): Promise<boolean> {
  const hash = hashPostText(text);
  const cutoff = now.getTime() - DUP_WINDOW_MS;
  const store = await readXAutoStore();
  return store.recent.some(
    (entry) =>
      entry.account === account &&
      entry.textHash === hash &&
      new Date(entry.at).getTime() >= cutoff
  );
}

export async function recordPosted(entry: XAutoLogEntry): Promise<void> {
  const store = await readXAutoStore();
  store.recent.unshift(entry);
  await writeXAutoStore(store);
}

export async function recordFailure(failure: XAutoFailure): Promise<void> {
  try {
    const store = await readXAutoStore();
    store.failures = [failure, ...(store.failures || [])];
    await writeXAutoStore(store);
  } catch (error) {
    console.error("X auto log failure write failed:", error);
  }
}

/** Backfill fields that older entries lack, so cadence rules work across the upgrade. */
export function entryHasLink(entry: Pick<XAutoLogEntry, "linkUsed" | "text">): boolean {
  if (typeof entry.linkUsed === "boolean") return entry.linkUsed;
  return /rejutkn\.com|https?:\/\/t\.co\//i.test(entry.text);
}

export function entryHasFollowCta(entry: Pick<XAutoLogEntry, "followCta" | "text">): boolean {
  if (typeof entry.followCta === "boolean") return entry.followCta;
  return /follow\s+(the event at\s+)?@REJUvenationTKN/i.test(entry.text);
}
