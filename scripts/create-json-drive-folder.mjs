/**
 * One-time: create a Drive folder for JSON config files next to bookadmin,
 * then copy reju-config.json and blog-engagement.json into it.
 */
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

const JSON_NAMES = ["reju-config.json", "blog-engagement.json"];
const BOOKADMIN_ID = process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN;

async function main() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey || !BOOKADMIN_ID) {
    console.error("Missing Google credentials or GOOGLE_DRIVE_UPLOADBOOKADMIN.");
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });

  const bookadmin = await drive.files.get({
    fileId: BOOKADMIN_ID,
    fields: "id,name,parents,driveId,webViewLink",
    supportsAllDrives: true,
  });

  const parentId = bookadmin.data.parents?.[0];
  console.log("Bookadmin folder:", bookadmin.data.name, BOOKADMIN_ID);
  console.log("Parent:", parentId || "(none)");

  const existing = await drive.files.list({
    q: `${parentId ? `'${parentId}' in parents and ` : ""}name = 'REJU JSON Files' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: "files(id,name,webViewLink)",
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
    corpora: bookadmin.data.driveId ? "drive" : "user",
    driveId: bookadmin.data.driveId || undefined,
  });

  let folderId = existing.data.files?.[0]?.id;
  let webViewLink = existing.data.files?.[0]?.webViewLink;

  if (!folderId) {
    const created = await drive.files.create({
      requestBody: {
        name: "REJU JSON Files",
        mimeType: "application/vnd.google-apps.folder",
        parents: parentId ? [parentId] : undefined,
      },
      fields: "id,name,webViewLink",
      supportsAllDrives: true,
    });
    folderId = created.data.id;
    webViewLink = created.data.webViewLink;
    console.log("Created folder:", folderId);
  } else {
    console.log("Folder already exists:", folderId);
  }

  for (const name of JSON_NAMES) {
    const src = await drive.files.list({
      q: `'${BOOKADMIN_ID}' in parents and name = '${name}' and trashed = false`,
      fields: "files(id,name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const source = src.data.files?.[0];
    if (!source?.id) {
      console.log(`Skip ${name}: not found in bookadmin.`);
      continue;
    }

    const dest = await drive.files.list({
      q: `'${folderId}' in parents and name = '${name}' and trashed = false`,
      fields: "files(id,name)",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    if (dest.data.files?.[0]?.id) {
      console.log(`Already in JSON folder: ${name}`);
      continue;
    }

    await drive.files.copy({
      fileId: source.id,
      requestBody: {
        name,
        parents: [folderId],
      },
      supportsAllDrives: true,
      fields: "id,name",
    });
    console.log(`Copied ${name} → JSON folder`);
  }

  console.log("\nGOOGLE_DRIVE_JSONFILES=" + folderId);
  console.log("Folder URL:", webViewLink || `https://drive.google.com/drive/folders/${folderId}`);
}

main().catch((err) => {
  console.error(err?.response?.data || err);
  process.exit(1);
});
