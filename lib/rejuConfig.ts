import { google } from "googleapis";

export interface RejuConfig {
  registrationPassword: string;
  bookPassword: string;
  adminPassword: string;
  currentCohort: string;
  active: boolean;
}

const CONFIG_FILE_NAME = "reju-config.json";

function getEnv() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const bookFolderId = process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN;

  if (!clientEmail || !privateKey || !bookFolderId) {
    throw new Error("Missing Google credentials or GOOGLE_DRIVE_UPLOADBOOKADMIN for REJU config.");
  }
  return { clientEmail, privateKey, bookFolderId };
}

async function getDriveAndFolder() {
  const { clientEmail, privateKey, bookFolderId } = getEnv();
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });
  return { drive, bookFolderId };
}

async function findConfigFileId(drive: any, bookFolderId: string): Promise<string | null> {
  const list = await drive.files.list({
    q: `'${bookFolderId}' in parents and name = '${CONFIG_FILE_NAME}' and trashed = false`,
    fields: "files(id)",
    supportsAllDrives: true,
  });
  return list.data.files?.[0]?.id || null;
}

export async function getRejuConfig(): Promise<RejuConfig> {
  const { drive, bookFolderId } = await getDriveAndFolder();
  let configId = await findConfigFileId(drive, bookFolderId);

  if (!configId) {
    // Initial first-cohort values (2026). Change via /admin after first creation.
    // Admin default is now REJUAdmin2026. Delete reju-config.json in Drive if you need to force recreation.
    const defaultConfig: RejuConfig = {
      registrationPassword: "REJU1stcohort2026",
      bookPassword: "REJU1stcohort2026",
      adminPassword: "REJUAdmin2026",
      currentCohort: "1st Cohort 2026",
      active: true,
    };

    const createRes = await drive.files.create({
      requestBody: {
        name: CONFIG_FILE_NAME,
        parents: [bookFolderId],
      },
      media: {
        mimeType: "application/json",
        body: JSON.stringify(defaultConfig, null, 2),
      },
      fields: "id",
      supportsAllDrives: true,
    });
    configId = createRes.data.id!;
    return defaultConfig;
  }

  const res = await drive.files.get(
    { fileId: configId, alt: "media" },
    { responseType: "text" }
  );

  const raw = JSON.parse((res.data as string) || "{}");
  return {
    registrationPassword: raw.registrationPassword || "REJU1stcohort2026",
    bookPassword: raw.bookPassword || "REJU1stcohort2026",
    adminPassword: raw.adminPassword || "REJUAdmin2026",
    currentCohort: raw.currentCohort || "1st Cohort 2026",
    active: raw.active !== false,
  };
}

export async function updateRejuConfig(partial: Partial<RejuConfig>): Promise<RejuConfig> {
  const { drive, bookFolderId } = await getDriveAndFolder();
  const current = await getRejuConfig();
  const next: RejuConfig = { ...current, ...partial };

  let configId = await findConfigFileId(drive, bookFolderId);
  if (!configId) {
    // create path
    const createRes = await drive.files.create({
      requestBody: { name: CONFIG_FILE_NAME, parents: [bookFolderId] },
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

export async function verifyPassword(type: "registration" | "book" | "admin", password: string): Promise<boolean> {
  const config = await getRejuConfig();
  if (!config.active) return false;

  let current = "";
  if (type === "registration") current = config.registrationPassword;
  else if (type === "book") current = config.bookPassword;
  else if (type === "admin") current = config.adminPassword;
  else return false;

  return password === current;
}
