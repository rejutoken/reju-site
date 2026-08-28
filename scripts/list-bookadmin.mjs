import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { google } from "googleapis";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
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

async function listFolder(drive, folderId, label) {
  const files = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id,name,mimeType,modifiedTime,size)",
      orderBy: "modifiedTime desc",
      pageSize: 100,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    files.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  console.log(`\n${label} (${folderId}) — ${files.length} file(s)`);
  for (const f of files) {
    console.log(`  ${f.modifiedTime}  ${f.name}`);
  }
}

async function main() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });
  await listFolder(drive, process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN, "bookadmin");
  await listFolder(drive, process.env.GOOGLE_DRIVE_JSONFILES, "JSON files");
}

main().catch((err) => {
  console.error(err?.response?.data || err);
  process.exit(1);
});
