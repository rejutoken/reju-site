/**
 * One-time: remove leftover reju-config.json / blog-engagement.json from bookadmin.
 * Live config now lives in GOOGLE_DRIVE_JSONFILES.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { google } from "googleapis";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val.replace(/\\n/g, "\n");
  }
}

loadEnvLocal();

const NAMES = ["reju-config.json", "blog-engagement.json"];

async function listNamed(drive, folderId, name) {
  const files = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and name = '${name}' and trashed = false`,
      fields: "nextPageToken, files(id,name)",
      pageSize: 100,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    files.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files;
}

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});
const drive = google.drive({ version: "v3", auth });
const bookId = process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN;
const jsonId = process.env.GOOGLE_DRIVE_JSONFILES;

if (!bookId || !jsonId) {
  console.error("Missing folder IDs.");
  process.exit(1);
}

for (const name of NAMES) {
  const jsonCopies = await listNamed(drive, jsonId, name);
  if (jsonCopies.length === 0) {
    console.log(`Skip trash ${name}: not present in JSON folder yet.`);
    continue;
  }
  const leftovers = await listNamed(drive, bookId, name);
  for (const file of leftovers) {
    await drive.files.update({
      fileId: file.id,
      requestBody: { trashed: true },
      supportsAllDrives: true,
    });
    console.log("Trashed from bookadmin:", name, file.id);
  }
}

const remaining = await drive.files.list({
  q: `'${bookId}' in parents and trashed = false`,
  fields: "files(name)",
  pageSize: 50,
  supportsAllDrives: true,
  includeItemsFromAllDrives: true,
});
console.log(
  "bookadmin remaining:",
  (remaining.data.files || []).map((f) => f.name).join(" | ") || "(empty)"
);
