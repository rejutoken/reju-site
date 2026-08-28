/**
 * Find the newest reju-config.json / blog-engagement.json in bookadmin,
 * copy those into the JSON folder, then trash JSON copies left in bookadmin.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { google } from "googleapis";
import { Readable } from "stream";

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

const BOOKADMIN_ID = process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN;
const JSON_ID = process.env.GOOGLE_DRIVE_JSONFILES;

async function listNamed(drive, folderId, name) {
  const files = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and name = '${name}' and trashed = false`,
      fields: "nextPageToken, files(id,name,modifiedTime,createdTime,size)",
      orderBy: "modifiedTime desc",
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

async function readJson(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "text" }
  );
  try {
    return JSON.parse(res.data || "{}");
  } catch {
    return { _parseError: true, raw: String(res.data).slice(0, 200) };
  }
}

async function upsertJson(drive, folderId, name, content) {
  const existing = await listNamed(drive, folderId, name);
  const body = JSON.stringify(content, null, 2);
  const media = {
    mimeType: "application/json",
    body: Readable.from(Buffer.from(body, "utf8")),
  };

  if (existing[0]?.id) {
    await drive.files.update({
      fileId: existing[0].id,
      media,
      fields: "id",
      supportsAllDrives: true,
    });
    for (const extra of existing.slice(1)) {
      await drive.files.update({
        fileId: extra.id,
        requestBody: { trashed: true },
        supportsAllDrives: true,
      });
    }
    return existing[0].id;
  }

  const created = await drive.files.create({
    requestBody: { name, parents: [folderId] },
    media,
    fields: "id",
    supportsAllDrives: true,
  });
  return created.data.id;
}

async function trashAll(drive, files) {
  for (const f of files) {
    await drive.files.update({
      fileId: f.id,
      requestBody: { trashed: true },
      supportsAllDrives: true,
    });
  }
}

async function main() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey || !BOOKADMIN_ID || !JSON_ID) {
    console.error("Missing credentials or folder IDs.");
    process.exit(1);
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });

  const bookConfigs = await listNamed(drive, BOOKADMIN_ID, "reju-config.json");
  const jsonConfigs = await listNamed(drive, JSON_ID, "reju-config.json");
  const bookBlogs = await listNamed(drive, BOOKADMIN_ID, "blog-engagement.json");
  const jsonBlogs = await listNamed(drive, JSON_ID, "blog-engagement.json");

  console.log(`bookadmin reju-config.json: ${bookConfigs.length}`);
  console.log(`json folder reju-config.json: ${jsonConfigs.length}`);
  console.log(`bookadmin blog-engagement.json: ${bookBlogs.length}`);
  console.log(`json folder blog-engagement.json: ${jsonBlogs.length}`);

  const uniqueAdmins = new Map();
  const sample = bookConfigs.slice(0, 8);
  if (jsonConfigs[0]) sample.unshift(jsonConfigs[0]);

  for (const f of bookConfigs) {
    const data = await readJson(drive, f.id);
    const key = `${data.adminPassword || "?"} | ${data.registrationPassword || "?"} | ${data.bookPassword || "?"}`;
    if (!uniqueAdmins.has(key)) {
      uniqueAdmins.set(key, {
        adminPassword: data.adminPassword,
        registrationPassword: data.registrationPassword,
        bookPassword: data.bookPassword,
        xPostPassword: data.xPostPassword || "",
        currentCohort: data.currentCohort,
        active: data.active,
        count: 0,
        newest: f.modifiedTime,
      });
    }
    const row = uniqueAdmins.get(key);
    row.count += 1;
    if (f.modifiedTime > row.newest) row.newest = f.modifiedTime;
  }

  console.log("\nUnique password sets found in bookadmin:");
  for (const [key, row] of uniqueAdmins) {
    console.log(
      `  x${row.count}  newest=${row.newest}  admin=${row.adminPassword}  reg=${row.registrationPassword}  book=${row.bookPassword}  xpost=${row.xPostPassword || "(empty)"}  cohort=${row.currentCohort}  active=${row.active}`
    );
  }

  const newestBook = bookConfigs[0];
  const jsonCurrent = jsonConfigs[0];
  const newestData = newestBook ? await readJson(drive, newestBook.id) : null;
  const jsonData = jsonCurrent ? await readJson(drive, jsonCurrent.id) : null;

  console.log("\nNewest bookadmin config:", newestBook?.modifiedTime, newestBook?.id);
  console.log("JSON folder config:", jsonCurrent?.modifiedTime, jsonCurrent?.id);
  if (jsonData) {
    console.log(
      `JSON folder currently has admin=${jsonData.adminPassword} reg=${jsonData.registrationPassword}`
    );
  }

  if (!newestData) {
    console.error("No bookadmin config found.");
    process.exit(1);
  }

  const useThis = newestData;
  console.log(
    `\nWriting newest bookadmin config into JSON folder. admin=${useThis.adminPassword}`
  );
  await upsertJson(drive, JSON_ID, "reju-config.json", useThis);

  const newestBlog = bookBlogs[0];
  if (newestBlog) {
    const blogData = await readJson(drive, newestBlog.id);
    console.log("Writing newest blog-engagement.json into JSON folder. modified=", newestBlog.modifiedTime);
    await upsertJson(drive, JSON_ID, "blog-engagement.json", blogData);
  }

  console.log(`\nTrashing ${bookConfigs.length} reju-config.json from bookadmin...`);
  await trashAll(drive, bookConfigs);
  console.log(`Trashing ${bookBlogs.length} blog-engagement.json from bookadmin...`);
  await trashAll(drive, bookBlogs);

  const leftConfigs = await listNamed(drive, BOOKADMIN_ID, "reju-config.json");
  const leftBlogs = await listNamed(drive, BOOKADMIN_ID, "blog-engagement.json");
  const jsonLeft = await listNamed(drive, JSON_ID, "reju-config.json");
  const jsonBlogLeft = await listNamed(drive, JSON_ID, "blog-engagement.json");
  const remaining = await drive.files.list({
    q: `'${BOOKADMIN_ID}' in parents and trashed = false`,
    fields: "files(id,name,mimeType)",
    pageSize: 50,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  console.log("\nDONE");
  console.log("bookadmin json left:", leftConfigs.length, leftBlogs.length);
  console.log("json folder configs:", jsonLeft.length, "blogs:", jsonBlogLeft.length);
  console.log(
    "bookadmin remaining files:",
    (remaining.data.files || []).map((f) => f.name).join(" | ") || "(none)"
  );
  console.log("\nTRY THIS ADMIN PASSWORD:", useThis.adminPassword);
  console.log("registration:", useThis.registrationPassword);
  console.log("book:", useThis.bookPassword);
}

main().catch((err) => {
  console.error(err?.response?.data || err);
  process.exit(1);
});
