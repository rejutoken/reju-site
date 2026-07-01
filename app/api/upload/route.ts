import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { verifyPassword, getRejuConfig } from "../../../lib/rejuConfig";

export const runtime = "nodejs";

const folderMap: Record<string, string | undefined> = {
  dailyjournal: process.env.GOOGLE_DRIVE_UPLOADDAILYJOURNAL,
  rejulock: process.env.GOOGLE_DRIVE_UPLOADREJULOCK,
  bookadmin: process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN,
  crp: process.env.GOOGLE_DRIVE_UPLOADCRP,
  fiatpay: process.env.GOOGLE_DRIVE_UPLOADFIATPAY,
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
    if (!folderId) return NextResponse.json({ error: "Invalid upload type." }, { status: 400 });

    // For daily journal (book authoring), require the current book password
    if (type === "dailyjournal") {
      const accessPassword = String(formData.get("accessPassword") || "").trim();
      const cfg = await getRejuConfig();
      if (cfg.active) {
        if (!accessPassword) {
          return NextResponse.json(
            { error: "Book authoring password required. Enter the event password to submit your daily chapter." },
            { status: 403 }
          );
        }
        const ok = await verifyPassword("book", accessPassword);
        if (!ok) {
          return NextResponse.json(
            { error: "Invalid book authoring password." },
            { status: 403 }
          );
        }
      }
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!clientEmail || !privateKey) return NextResponse.json({ error: "Google credentials missing." }, { status: 500 });

    const auth = new google.auth.JWT({ email: clientEmail, key: privateKey, scopes: ["https://www.googleapis.com/auth/drive"] });
    const drive = google.drive({ version: "v3", auth });

    let data: any = {};
    try {
      data = JSON.parse(notes || "{}");
    } catch (e) {
      data = {};
    }

    const isDailyStructured = type === "dailyjournal" && (data.positiveThings || data.dayOfProgram || data.physicalCondition);

    if (isDailyStructured) {
      // Structured daily journal -> generate nice 6x9 PDF report (the book chapter)
      const pdfDoc = await PDFDocument.create();

      const PAGE_WIDTH = 432;   // 6 inches
      const PAGE_HEIGHT = 648;  // 9 inches
      const MARGIN = 36;        // 0.5 inch margins
      const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

      let currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const gold = rgb(0.85, 0.65, 0.2);
      const darkGold = rgb(0.7, 0.55, 0.15);
      const black = rgb(0, 0, 0);

      // Helper for wrapping text accurately using font metrics
      const wrapText = (text: string, maxWidth: number, size: number, fnt: any = font): string[] => {
        const words = (text || '').split(/\s+/);
        const lines: string[] = [];
        let current = '';
        for (const word of words) {
          const test = current ? `${current} ${word}` : word;
          if (fnt.widthOfTextAtSize(test, size) > maxWidth) {
            if (current) lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);
        return lines.length ? lines : [''];
      };

      const startNewPage = () => {
        currentPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        y = PAGE_HEIGHT - 48;
        currentPage.drawText(`REJU • Day ${data.dayOfProgram || '—'} • You Are Authoring This Book`, { 
          x: MARGIN, y: PAGE_HEIGHT - 26, size: 7, font, color: darkGold 
        });
        return currentPage;
      };

      let y = PAGE_HEIGHT - 48;

    // Running header for the book
    currentPage.drawText(`REJU • Day ${data.dayOfProgram || '—'} • You Are Authoring This Book`, { 
      x: MARGIN, y: PAGE_HEIGHT - 26, size: 7, font, color: darkGold 
    });

    // Elegant header
    currentPage.drawText("REJU", { x: MARGIN, y, size: 9, font, color: darkGold });
    y -= 14;
    currentPage.drawText("Daily Transformation Log — You Are Authoring This Book", { x: MARGIN, y, size: 14, font: boldFont, color: gold });
    y -= 20;

    // Subtle divider
    currentPage.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.6,
      color: gold,
    });
    y -= 18;

    currentPage.drawText(`${name}  •  Day ${data.dayOfProgram || '—'}  •  ${data.date || '—'}`, { 
      x: MARGIN, y, size: 9.5, font, color: black 
    });
    y -= 14;
    if (data.participantId) {
      currentPage.drawText(`Participant ID: ${data.participantId}`, { 
        x: MARGIN, y, size: 9, font, color: black 
      });
      y -= 12;
    }
    y -= 10;

    const addTextSection = (title: string, content: string) => {
      if (y < 70) {
        startNewPage();
      }
      currentPage.drawText(title, { x: MARGIN, y, size: 11, font: boldFont, color: gold });
      y -= 16;

      const lines = wrapText(content || "No data", CONTENT_WIDTH, 9);
      for (const line of lines) {
        if (y < 45) {
          startNewPage();
        }
        currentPage.drawText(line, { x: MARGIN, y, size: 9, font, color: black });
        y -= 13;
      }
      y -= 18;
    };

    addTextSection("Physical Condition", data.physicalCondition || "No data");
    addTextSection("Skin Condition", `Clarity: ${data.skinClarity || ''} | Dryness: ${data.skinDryness || ''} | Inflammation: ${data.inflammation || ''}`);
    addTextSection("Energy & Mental State", `Energy: ${data.energyLevel || ''} | Clarity: ${data.mentalClarity || ''} | Mood: ${data.mood || ''}`);

    // 11 Positive Events Today
    if (y < 90) {
      startNewPage();
    }
    currentPage.drawText("11 Positive Events Today", { x: MARGIN, y, size: 11, font: boldFont, color: gold });
    y -= 13;
    currentPage.drawText("Gratitude anchors your evolution.", { x: MARGIN, y, size: 8, font, color: darkGold });
    y -= 14;

    (data.positiveThings || []).forEach((item: string, i: number) => {
      if (item && item.trim()) {
        if (y < 55) {
          startNewPage();
        }

        const prefix = `${i + 1}. `;
        const fullText = prefix + item.trim();
        const lines = wrapText(fullText, CONTENT_WIDTH, 9);

        lines.forEach((line, lineIdx) => {
          if (y < 45) {
            startNewPage();
          }
          // Draw number in gold for first line of each event
          if (lineIdx === 0 && line.startsWith(`${i + 1}. `)) {
            const num = `${i + 1}. `;
            currentPage.drawText(num, { x: MARGIN, y, size: 9, font: boldFont, color: gold });
            const rest = line.substring(num.length);
            const numWidth = boldFont.widthOfTextAtSize(num, 9);
            currentPage.drawText(rest, { x: MARGIN + numWidth, y, size: 9, font, color: black });
          } else {
            currentPage.drawText(line, { x: MARGIN, y, size: 9, font, color: black });
          }
          y -= 12;
        });
        y -= 3; // gentle spacing between positive events
      }
    });
    y -= 12;

    addTextSection("Noticed Today", data.noticeToday || "No data");
    addTextSection("Changes Yesterday", data.changesYesterday || "No data");

    // Beautiful closing editorial note — you are Authoring the book
    if (y > 65) {
      y -= 6;
      currentPage.drawLine({
        start: { x: MARGIN, y },
        end: { x: PAGE_WIDTH - MARGIN, y },
        thickness: 0.5,
        color: gold,
      });
      y -= 13;
      currentPage.drawText("REJU  •  The Book You Author  •  Day " + (data.dayOfProgram || '—'), {
        x: MARGIN, y, size: 7, font, color: darkGold
      });
    }

    // Small editorial signature at bottom of last content page
    if (y > 50) {
      y -= 10;
      currentPage.drawText("— Authored by " + (name || 'you') + "  •  REJU Editorial —", {
        x: MARGIN, y, size: 6.5, font, color: darkGold
      });
    }

    // Photo on new page — beautifully centered for the 6×9 book
    if (file && file.type.startsWith("image/")) {
      const photoPage = startNewPage();
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      let embeddedImage = file.type === "image/png" 
        ? await pdfDoc.embedPng(buffer) 
        : await pdfDoc.embedJpg(buffer);

      const maxW = PAGE_WIDTH - 70;
      const maxH = PAGE_HEIGHT - 160;
      const scale = Math.min(maxW / embeddedImage.width, maxH / embeddedImage.height, 1);
      const w = embeddedImage.width * scale;
      const h = embeddedImage.height * scale;

      const imgY = (PAGE_HEIGHT - h) / 2 - 10;

      photoPage.drawImage(embeddedImage, {
        x: (PAGE_WIDTH - w) / 2,
        y: imgY,
        width: w,
        height: h,
      });

      // Elegant caption
      photoPage.drawText("My Rejuvenation Progress — A Page You Are Authoring", { 
        x: MARGIN, y: PAGE_HEIGHT - 38, size: 10, font: boldFont, color: gold 
      });
      photoPage.drawText("— REJU Editorial", { 
        x: MARGIN, y: 32, size: 7.5, font, color: darkGold 
      });
    } else {
      // Small closing editorial note when no photo
      if (y < 70) {
        startNewPage();
      }
      currentPage.drawText("— You are Authoring this book. Every entry is a chapter. —", {
        x: MARGIN, y, size: 8, font, color: darkGold
      });
    }

    const pdfBytes = await pdfDoc.save();

    const dateOnly = new Date().toISOString().slice(0, 10);
    const idPart = cleanFilePart(name); // now the Participant ID for consistency
    const pdfName = `${idPart}_${dateOnly}_dailyjournal.pdf`;

    const uploaded = await drive.files.create({
      requestBody: { name: pdfName, parents: [folderId] },
      media: { mimeType: "application/pdf", body: Readable.from(Buffer.from(pdfBytes)) },
      fields: "id,name",
      supportsAllDrives: true,
    });

    return NextResponse.json({ success: true, file: uploaded.data });
    } else {
      // Simple file upload for other types (rejulock, bookadmin, crp, fiatpay, or non-structured dailyjournal)
      if (!file) {
        return NextResponse.json({ error: "File is required." }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const safeName = `${cleanFilePart(name)}_${cleanFilePart(file.name || "file")}`;
      const uploaded = await drive.files.create({
        requestBody: {
          name: safeName,
          parents: [folderId],
          description: notes || ""
        },
        media: {
          mimeType: file.type || "application/octet-stream",
          body: Readable.from(buffer)
        },
        fields: "id,name"
      });
      return NextResponse.json({ success: true, file: uploaded.data });
    }
  } catch (error: any) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: error?.message || "Upload failed." }, { status: 500 });
  }
}