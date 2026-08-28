import { createHash, timingSafeEqual } from "crypto";
import { getDriveClient, getJsonFilesFolderId } from "./driveJsonFolder";

export interface RejuConfig {
  registrationPassword: string;
  bookPassword: string;
  adminPassword: string;
  /** Collaborator-only password for /x-post — no admin access */
  xPostPassword: string;
  currentCohort: string;
  active: boolean;
}

export type PublicAdminConfig = {
  registrationPassword: string;
  bookPassword: string;
  xPostPassword: string;
  currentCohort: string;
  active: boolean;
  adminPasswordSet: boolean;
};

const CONFIG_FILE_NAME = "reju-config.json";

function safeEqual(a: string, b: string): boolean {
  const left = createHash("sha256").update(String(a)).digest();
  const right = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(left, right);
}

async function getDriveAndFolder() {
  const drive = getDriveClient();
  const jsonFolderId = getJsonFilesFolderId();
  return { drive, jsonFolderId };
}

async function findConfigFileId(
  drive: ReturnType<typeof getDriveClient>,
  jsonFolderId: string
): Promise<string | null> {
  const list = await drive.files.list({
    q: `'${jsonFolderId}' in parents and name = '${CONFIG_FILE_NAME}' and trashed = false`,
    fields: "files(id)",
    orderBy: "modifiedTime desc",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return list.data.files?.[0]?.id || null;
}

export function toPublicAdminConfig(config: RejuConfig): PublicAdminConfig {
  return {
    registrationPassword: config.registrationPassword,
    bookPassword: config.bookPassword,
    xPostPassword: config.xPostPassword,
    currentCohort: config.currentCohort,
    active: config.active,
    adminPasswordSet: Boolean(config.adminPassword),
  };
}

export async function getRejuConfig(): Promise<RejuConfig> {
  const { drive, jsonFolderId } = await getDriveAndFolder();
  let configId = await findConfigFileId(drive, jsonFolderId);

  if (!configId) {
    const defaultConfig: RejuConfig = {
      registrationPassword: "REJU1stcohort2026",
      bookPassword: "REJU1stcohort2026",
      adminPassword: "REJUAdmin2026",
      xPostPassword: "",
      currentCohort: "1st Cohort 2026",
      active: true,
    };

    await drive.files.create({
      requestBody: {
        name: CONFIG_FILE_NAME,
        parents: [jsonFolderId],
      },
      media: {
        mimeType: "application/json",
        body: JSON.stringify(defaultConfig, null, 2),
      },
      fields: "id",
      supportsAllDrives: true,
    });
    return defaultConfig;
  }

  const res = await drive.files.get(
    { fileId: configId, alt: "media" },
    { responseType: "text" }
  );

  const raw = JSON.parse((res.data as string) || "{}");
  return {
    registrationPassword: String(raw.registrationPassword || ""),
    bookPassword: String(raw.bookPassword || ""),
    adminPassword: String(raw.adminPassword || ""),
    xPostPassword: String(raw.xPostPassword || ""),
    currentCohort: String(raw.currentCohort || "1st Cohort 2026"),
    active: raw.active !== false,
  };
}

export async function updateRejuConfig(partial: Partial<RejuConfig>): Promise<RejuConfig> {
  const { drive, jsonFolderId } = await getDriveAndFolder();
  const current = await getRejuConfig();
  const next: RejuConfig = { ...current, ...partial };

  let configId = await findConfigFileId(drive, jsonFolderId);
  if (!configId) {
    await drive.files.create({
      requestBody: { name: CONFIG_FILE_NAME, parents: [jsonFolderId] },
      media: { mimeType: "application/json", body: JSON.stringify(next, null, 2) },
      fields: "id",
      supportsAllDrives: true,
    });
    return next;
  }

  await drive.files.update({
    fileId: configId,
    media: {
      mimeType: "application/json",
      body: JSON.stringify(next, null, 2),
    },
    fields: "id",
    supportsAllDrives: true,
  });

  return next;
}

export async function verifyPassword(
  type: "registration" | "book" | "admin" | "xpost",
  password: string
): Promise<boolean> {
  const config = await getRejuConfig();
  const offered = String(password || "");

  // Staff passwords work even when participant access is disabled.
  if (type === "admin") {
    return Boolean(config.adminPassword) && safeEqual(offered, config.adminPassword);
  }

  if (type === "xpost") {
    if (config.adminPassword && safeEqual(offered, config.adminPassword)) return true;
    const collaborator = config.xPostPassword?.trim();
    return Boolean(collaborator) && safeEqual(offered, collaborator);
  }

  if (!config.active) return false;

  if (type === "registration") {
    return Boolean(config.registrationPassword) && safeEqual(offered, config.registrationPassword);
  }
  if (type === "book") {
    return Boolean(config.bookPassword) && safeEqual(offered, config.bookPassword);
  }
  return false;
}
