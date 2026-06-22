import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { participantId } = await req.json();
    if (!participantId) return NextResponse.json({ error: "Participant ID is required" }, { status: 400 });

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

    const cleanParticipantId = participantId.replace(/[^a-zA-Z0-9-_ .]/g, "").replace(/\s+/g, "_").trim().toLowerCase();

    // List all daily journal PDFs in the folder, then filter client-side for reliability
    // (names include date, and search 'contains' can be finicky on shared drives)
    const listRes = await drive.files.list({
      q: `'${dailyFolderId}' in parents and name contains '_dailyjournal.pdf' and mimeType = 'application/pdf' and trashed = false`,
      fields: "files(id, name, createdTime)",
      orderBy: "name asc",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    let files = listRes.data.files || [];

    // Filter by the Participant ID, case-insensitive
    const searchTerm = cleanParticipantId;
    files = files.filter((f: any) => 
      (f.name || '').toLowerCase().includes(searchTerm)
    );
    if (files.length === 0) {
      return NextResponse.json({ error: `No daily journal entries found for participant ID: ${participantId}` }, { status: 404 });
    }

    // Merge PDFs
    const bookDoc = await PDFDocument.create();
    const font = await bookDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await bookDoc.embedFont(StandardFonts.HelveticaBold);
    const gold = rgb(0.85, 0.65, 0.2);
    const darkGold = rgb(0.7, 0.55, 0.15);

    // Cover page
    const coverPage = bookDoc.addPage([432, 648]);
    let cy = 580;
    coverPage.drawText("REJU", { x: 50, y: cy, size: 28, font: boldFont, color: gold });
    cy -= 35;
    coverPage.drawText("Transformation Book", { x: 50, y: cy, size: 20, font: boldFont, color: gold });
    cy -= 30;
    coverPage.drawText(`For Participant ${participantId}`, { x: 50, y: cy, size: 16, font, color: rgb(0,0,0) });
    cy -= 25;
    coverPage.drawText("Authored by the Participant", { x: 50, y: cy, size: 12, font });
    cy -= 18;
    coverPage.drawText("with REJU as Editorial Partner", { x: 50, y: cy, size: 12, font });
    cy -= 30;
    if (files.length > 0) {
      const first = (files[0] as any).name.match(/(\d{4}-\d{2}-\d{2})/)?.[0] || "";
      const last = (files[files.length - 1] as any).name.match(/(\d{4}-\d{2}-\d{2})/)?.[0] || "";
      coverPage.drawText(`${first} — ${last}`, { x: 50, y: cy, size: 11, font });
    }
    cy -= 40;
    coverPage.drawText("This book is the personal record of a journey of", { x: 50, y: cy, size: 10, font });
    cy -= 14;
    coverPage.drawText("rejuvenation, discipline, and transformation.", { x: 50, y: cy, size: 10, font });

    // Append each daily chapter
    for (const f of files) {
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
  } catch (error: any) {
    console.error("BOOK GENERATION ERROR:", error);
    return NextResponse.json({ error: error.message || "Failed to generate book." }, { status: 500 });
  }
}
