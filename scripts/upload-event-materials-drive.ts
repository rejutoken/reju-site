/**
 * Upload public/materials PDFs (+ PPTX) to Google Drive eventmaterials folder.
 * Requires: GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY
 * Folder: GOOGLE_DRIVE_EVENTMATERIALS or default eventmaterials folder ID
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { Readable } from "stream";
import { google } from "googleapis";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();

const DEFAULT_FOLDER_ID = "1lHo-fpI6yJ_j8Ze-ZwZNSE5fUV9rPLBB";

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".md": "text/markdown",
};

async function main() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const folderId = process.env.GOOGLE_DRIVE_EVENTMATERIALS?.trim() || DEFAULT_FOLDER_ID;

  if (!clientEmail || !privateKey) {
    console.error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in environment.");
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });

  const materialsDir = join(process.cwd(), "public", "materials");
  const files = readdirSync(materialsDir).filter((f) => {
    const ext = f.slice(f.lastIndexOf(".")).toLowerCase();
    return [".pdf", ".pptx", ".md"].includes(ext) && !f.startsWith("~$");
  });

  console.log(`Uploading ${files.length} files to folder ${folderId}...`);

  for (const name of files) {
    const path = join(materialsDir, name);
    const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
    const mimeType = MIME[ext] || "application/octet-stream";
    const body = readFileSync(path);

    const existing = await drive.files.list({
      q: `'${folderId}' in parents and name = '${name.replace(/'/g, "\\'")}' and trashed = false`,
      fields: "files(id,name)",
      supportsAllDrives: true,
    });

    const stream = Readable.from(Buffer.from(body));
    const media = { mimeType, body: stream };

    if (existing.data.files?.length) {
      const fileId = existing.data.files[0].id!;
      await drive.files.update({
        fileId,
        media,
        supportsAllDrives: true,
      });
      console.log(`Updated: ${name} (${fileId})`);
    } else {
      const res = await drive.files.create({
        requestBody: { name, parents: [folderId] },
        media,
        fields: "id",
        supportsAllDrives: true,
      });
      console.log(`Created: ${name} (${res.data.id})`);
    }
  }

  console.log(`\nFolder: https://drive.google.com/drive/folders/${folderId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});