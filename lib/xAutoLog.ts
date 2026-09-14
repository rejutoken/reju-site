import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { getDriveClient, getJsonFilesFolderId } from "./driveJsonFolder";
import type { XAccount } from "./xPublish";

export type XAutoLogEntry = {
  account: XAccount;
  textHash: string;
  text: string;
  tweetId?: string;
  slot?: string;
  at: string;
};

type XAutoLogStore = {
  recent: XAutoLogEntry[];
};

const FILE_NAME = "x-auto-log.json";
const LOCAL_PATH = path.join(process.cwd(), ".data", "x-auto-log.json");
const MAX_ENTRIES = 40;
const DUP_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function driveConfigured() {
  return Boolean(
    process.env.GOOGLE_DRIVE_JSONFILES?.trim() &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

export function hashPostText(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

function emptyStore(): XAutoLogStore {
  return { recent: [] };
}

function normalizeStore(raw: unknown): XAutoLogStore {
  if (!raw || typeof raw !== "object" || !("recent" in raw) || !Array.isArray((raw as XAutoLogStore).recent)) {
    return emptyStore();
  }
  return {
    recent: (raw as XAutoLogStore).recent.filter(
      (entry) => entry && typeof entry.textHash === "string" && typeof entry.account === "string"
    ),
  };
}

function readLocal(): XAutoLogStore {
  try {
    if (!fs.existsSync(LOCAL_PATH)) return emptyStore();
    return normalizeStore(JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8")));
  } catch {
    return emptyStore();
  }
}

function writeLocal(store: XAutoLogStore) {
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

async function readDrive(): Promise<XAutoLogStore> {
  const drive = getDriveClient();
  const folderId = getJsonFilesFolderId();
  const fileId = await findFileId(drive, folderId);
  if (!fileId) return emptyStore();
  const res = await drive.files.get({ fileId, alt: "media" }, { responseType: "text" });
  return normalizeStore(JSON.parse((res.data as string) || "{}"));
}

async function writeDrive(store: XAutoLogStore) {
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

async function readStore(): Promise<XAutoLogStore> {
  if (driveConfigured()) {
    try {
      return await readDrive();
    } catch (error) {
      console.error("X auto log Drive read failed, using local:", error);
    }
  }
  return readLocal();
}

async function writeStore(store: XAutoLogStore): Promise<void> {
  store.recent = store.recent.slice(0, MAX_ENTRIES);
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

export async function wasRecentlyPosted(account: XAccount, text: string, now = new Date()): Promise<boolean> {
  const hash = hashPostText(text);
  const cutoff = now.getTime() - DUP_WINDOW_MS;
  const store = await readStore();
  return store.recent.some(
    (entry) =>
      entry.account === account &&
      entry.textHash === hash &&
      new Date(entry.at).getTime() >= cutoff
  );
}

export async function recordPosted(entry: XAutoLogEntry): Promise<void> {
  const store = await readStore();
  store.recent.unshift(entry);
  await writeStore(store);
}
