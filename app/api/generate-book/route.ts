import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { verifyPassword } from "../../../lib/rejuConfig";
import { clientIp, rateLimit } from "../../../lib/rateLimit";
import { publicErrorMessage } from "../../../lib/safeError";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!rateLimit(`generate-book:${ip}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
    }

    const { participantId, adminPassword } = await req.json();
    const offered = String(adminPassword || req.headers.get("x-reju-admin") || "").trim();
    if (!offered || !(await verifyPassword("admin", offered))) {
      return NextResponse.json({ error: "Admin password required." }, { status: 401 });
    }

    if (!participantId) {
      return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const dailyFolderId = process.env.GOOGLE_DRIVE_UPLOADDAILYJOURNAL;
    const bookFolderId = process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN;

    if (!clientEmail || !privateKey || !dailyFolderId || !bookFolderId) {
      return NextResponse.json({ error: "Google Drive configuration missing." }, { status: 500 });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });
    const drive = google.drive({ version: "v3", auth });

    const cleanParticipantId = participantId
      .replace(/[^a-zA-Z0-9-_ .]/g, "")
      .replace(/\s+/g, "_")
      .trim()
      .toLowerCase();

    if (!cleanParticipantId) {
      return NextResponse.json({ error: "Invalid Participant ID." }, { status: 400 });
    }

    const files: Array<{ id?: string | null; name?: string | null }> = [];
    let pageToken: string | undefined;
    do {
      const listRes = await drive.files.list({
        q: `'${dailyFolderId}' in parents and name contains '_dailyjournal.pdf' and mimeType = 'application/pdf' and trashed = false`,
        fields: "nextPageToken, files(id, name, createdTime)",
        orderBy: "name asc",
        pageSize: 100,
        pageToken,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      files.push(...(listRes.data.files || []));
      pageToken = listRes.data.nextPageToken || undefined;
    } while (pageToken);

    const matched = files.filter((f) => (f.name || "").toLowerCase().includes(cleanParticipantId));
    if (matched.length === 0) {
      return NextResponse.json(
        { error: "No daily journal entries found for that Participant ID." },
        { status: 404 }
      );
    }

    const bookDoc = await PDFDocument.create();
    const font = await bookDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await bookDoc.embedFont(StandardFonts.HelveticaBold);
    const gold = rgb(0.85, 0.65, 0.2);

    const coverPage = bookDoc.addPage([432, 648]);
    let cy = 580;
    coverPage.drawText("REJU", { x: 50, y: cy, size: 28, font: boldFont, color: gold });
    cy -= 35;
    coverPage.drawText("Transformation Book", { x: 50, y: cy, size: 20, font: boldFont, color: gold });
    cy -= 30;
    coverPage.drawText(`For Participant ${cleanParticipantId}`, {
      x: 50,
      y: cy,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });
    cy -= 25;
    coverPage.drawText("Authored by the Participant", { x: 50, y: cy, size: 12, font });
    cy -= 18;
    coverPage.drawText("with REJU as Editorial Partner", { x: 50, y: cy, size: 12, font });

    for (const f of matched) {
      const res = await drive.files.get(
        { fileId: f.id!, alt: "media" },
        { responseType: "arraybuffer" }
      );
      const dailyDoc = await PDFDocument.load(res.data as ArrayBuffer);
      const pages = await bookDoc.copyPages(dailyDoc, dailyDoc.getPageIndices());
      pages.forEach((p) => bookDoc.addPage(p));
    }

    const bookBytes = await bookDoc.save();
    const bookName = `${cleanParticipantId}_REJU_Transformation_Book.pdf`;

    const uploaded = await drive.files.create({
      requestBody: { name: bookName, parents: [bookFolderId] },
      media: { mimeType: "application/pdf", body: Readable.from(Buffer.from(bookBytes)) },
      fields: "id,name",
      supportsAllDrives: true,
    });

    return NextResponse.json({
      success: true,
      book: uploaded.data,
      url: `https://drive.google.com/file/d/${uploaded.data.id}/view`,
    });
  } catch (error) {
    console.error("BOOK GENERATION ERROR:", error);
    return NextResponse.json(
      { error: publicErrorMessage(error, "Failed to generate book.") },
      { status: 500 }
    );
  }
}
