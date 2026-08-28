import { google } from "googleapis";

/** Google Drive folder for site JSON files (passwords, blog engagement, future config). */
export function getJsonFilesFolderId(): string {
  const jsonFolder = process.env.GOOGLE_DRIVE_JSONFILES?.trim();
  if (jsonFolder) return jsonFolder;
  throw new Error("Missing GOOGLE_DRIVE_JSONFILES for JSON config storage.");
}

export function getDriveClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google credentials.");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
}
