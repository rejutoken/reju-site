import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const runtime = "nodejs";

const folderMap: Record<string, string | undefined> = {
  rejulock: process.env.GOOGLE_DRIVE_UPLOADREJULOCK,
  bookadmin: process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN,
  fiatpay: process.env.GOOGLE_DRIVE_UPLOADFIATPAY,
  crp: process.env.GOOGLE_DRIVE_UPLOADCRP,
  dailyjournal: process.env.GOOGLE_DRIVE_UPLOADDAILYJOURNAL,
};

function cleanFilePart(value: string) {
  return value
    .replace(/[^a-zA-Z0-9-_ .]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const type = String(formData.get("type") || "").trim();
    const name = String(formData.get("name") || "unknown").trim();
    const notes = String(formData.get("notes") || "").trim();
    const file = formData.get("file") as File | null;

    const folderId = folderMap[type];

    if (!folderId) {
      return NextResponse.json(
        { error: "Invalid upload type." },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "No file received." },
        { status: 400 }
      );
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!clientEmail || !privateKey) {
      return NextResponse.json(
        { error: "Google credentials missing." },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const drive = google.drive({ version: "v3", auth });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = cleanFilePart(name) || "unknown";
    const dateOnly = new Date().toISOString().slice(0, 10);

    const baseName = `${safeName}_${dateOnly}_${type}`;
    const pdfName = `${baseName}.pdf`;

    let finalPdfBytes: Uint8Array;

    // ---------------------------------------------------
    // IF USER UPLOADED A PDF
    // ---------------------------------------------------

    if (file.type === "application/pdf") {
      finalPdfBytes = buffer;
    }

    // ---------------------------------------------------
    // IF USER UPLOADED IMAGE
    // ---------------------------------------------------

    else if (
      file.type === "image/png" ||
      file.type === "image/jpeg" ||
      file.type === "image/jpg"
    ) {
      const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([700, 950]);
const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

const gold = rgb(0.85, 0.65, 0.2);
const black = rgb(0, 0, 0);

page.drawText("REJU Verification Upload", {
  x: 50,
  y: 900,
  size: 24,
  font: boldFont,
  color: gold,
});

page.drawText(`Name: ${name}`, {
  x: 50,
  y: 860,
  size: 12,
  font,
  color: black,
});

page.drawText(`Upload Type: ${type}`, {
  x: 50,
  y: 842,
  size: 12,
  font,
  color: black,
});

page.drawText(`Date: ${dateOnly}`, {
  x: 50,
  y: 824,
  size: 12,
  font,
  color: black,
});

page.drawText(`Original File: ${file.name}`, {
  x: 50,
  y: 806,
  size: 12,
  font,
  color: black,
});

page.drawText("Notes / Reference:", {
  x: 50,
  y: 775,
  size: 13,
  font: boldFont,
  color: black,
});

const cleanNotes = notes || "None";
const noteLines = cleanNotes.match(/.{1,90}/g) || ["None"];

let noteY = 755;

for (const line of noteLines.slice(0, 8)) {
  page.drawText(line, {
    x: 50,
    y: noteY,
    size: 11,
    font,
    color: black,
  });
  noteY -= 15;
}

let embeddedImage;

if (file.type === "image/png") {
  embeddedImage = await pdfDoc.embedPng(buffer);
} else {
  embeddedImage = await pdfDoc.embedJpg(buffer);
}

const imgWidth = embeddedImage.width;
const imgHeight = embeddedImage.height;

const maxWidth = 600;
const maxHeight = 520;

const widthRatio = maxWidth / imgWidth;
const heightRatio = maxHeight / imgHeight;
const scale = Math.min(widthRatio, heightRatio, 1);

const displayWidth = imgWidth * scale;
const displayHeight = imgHeight * scale;

const imageX = (700 - displayWidth) / 2;
const imageY = 80;

page.drawImage(embeddedImage, {
  x: imageX,
  y: imageY,
  width: displayWidth,
  height: displayHeight,
});

finalPdfBytes = await pdfDoc.save();
    }

    // ---------------------------------------------------
    // UNSUPPORTED FILE TYPE
    // ---------------------------------------------------

    else {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload PDF, JPG, JPEG, or PNG.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------
    // UPLOAD FINAL PDF TO DRIVE
    // ---------------------------------------------------

    const uploaded = await drive.files.create({
      requestBody: {
        name: pdfName,
        parents: [folderId],
      },
      media: {
        mimeType: "application/pdf",
        body: Readable.from(Buffer.from(finalPdfBytes)),
      },
      fields: "id,name",
      supportsAllDrives: true,
    });

    return NextResponse.json({
      success: true,
      file: uploaded.data,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Upload failed." },
      { status: 500 }
    );
  }
}