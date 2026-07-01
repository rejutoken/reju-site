import { readFileSync } from "fs";
import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const gold = rgb(0.85, 0.65, 0.2);
const darkGold = rgb(0.55, 0.4, 0.12);
const black = rgb(0.1, 0.1, 0.1);
const gray = rgb(0.45, 0.45, 0.45);

function sanitizeForPdf(text: string): string {
  return text
    .replace(/\u2192/g, "->")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2022/g, "-")
    .replace(/\u2122/g, "(TM)")
    .replace(/[^\x00-\xFF]/g, "");
}

function wrapText(text: string, maxWidth: number, size: number, font: PDFFont): string[] {
  const words = sanitizeForPdf(text || "").split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "li"; text: string }
  | { type: "hr" };

function parseMarkdown(md: string): Block[] {
  const blocks: Block[] = [];
  for (const rawLine of md.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (!line.trim()) continue;
    if (line.trim() === "---") {
      blocks.push({ type: "hr" });
      continue;
    }
    const clean = (s: string) => sanitizeForPdf(s.replace(/\*\*/g, "").replace(/\*/g, "").trim());
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: clean(line.slice(4)) });
    } else if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: clean(line.slice(3)) });
    } else if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: clean(line.slice(2)) });
    } else if (/^[-*]\s+/.test(line)) {
      blocks.push({ type: "li", text: clean(line.replace(/^[-*]\s+/, "")) });
    } else if (/^\d+\.\s+/.test(line)) {
      blocks.push({ type: "li", text: clean(line.replace(/^\d+\.\s+/, "")) });
    } else {
      blocks.push({ type: "p", text: clean(line) });
    }
  }
  return blocks;
}

export async function markdownFileToPdf(inputPath: string, title?: string): Promise<Uint8Array> {
  const md = readFileSync(inputPath, "utf-8");
  const blocks = parseMarkdown(md);
  const docTitle = title || blocks.find((b) => b.type === "h1")?.text || "REJU Materials";

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(docTitle);
  pdfDoc.setAuthor("REJU | Wilson Fischmann CA");
  pdfDoc.setSubject("REJU Rejuvenation Event — Participant Materials");

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const newPage = () => {
    page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN - 10;
    page.drawText("REJU · rejutkn.com", { x: MARGIN, y: PAGE_HEIGHT - 28, size: 8, font, color: darkGold });
  };

  const ensureSpace = (needed: number) => {
    if (y < MARGIN + needed) newPage();
  };

  page.drawText("REJU", { x: MARGIN, y, size: 10, font: boldFont, color: darkGold });
  y -= 18;
  page.drawText(docTitle, { x: MARGIN, y, size: 18, font: boldFont, color: gold });
  y -= 14;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: gold,
  });
  y -= 22;

  for (const block of blocks) {
    if (block.type === "hr") {
      ensureSpace(20);
      y -= 8;
      page.drawLine({
        start: { x: MARGIN, y },
        end: { x: PAGE_WIDTH - MARGIN, y },
        thickness: 0.5,
        color: gray,
      });
      y -= 16;
      continue;
    }

    if (block.type === "h1") {
      if (y < PAGE_HEIGHT - 120) newPage();
      ensureSpace(36);
      page.drawText(block.text, { x: MARGIN, y, size: 16, font: boldFont, color: gold });
      y -= 24;
      continue;
    }

    if (block.type === "h2") {
      ensureSpace(30);
      page.drawText(block.text, { x: MARGIN, y, size: 13, font: boldFont, color: darkGold });
      y -= 20;
      continue;
    }

    if (block.type === "h3") {
      ensureSpace(24);
      page.drawText(block.text, { x: MARGIN, y, size: 11, font: boldFont, color: black });
      y -= 16;
      continue;
    }

    if (block.type === "li") {
      const lines = wrapText(block.text, CONTENT_WIDTH - 14, 10, font);
      for (let i = 0; i < lines.length; i++) {
        ensureSpace(14);
        if (i === 0) {
          page.drawText("•", { x: MARGIN, y, size: 10, font: boldFont, color: gold });
        }
        page.drawText(lines[i], { x: MARGIN + 14, y, size: 10, font, color: black });
        y -= 13;
      }
      y -= 4;
      continue;
    }

    if (block.type === "p") {
      const isItalic = block.text.startsWith('"') || block.text.includes("Note:");
      const lines = wrapText(block.text, CONTENT_WIDTH, 10, font);
      for (const line of lines) {
        ensureSpace(14);
        page.drawText(line, {
          x: MARGIN,
          y,
          size: 10,
          font: isItalic ? italicFont : font,
          color: black,
        });
        y -= 13;
      }
      y -= 6;
    }
  }

  const pages = pdfDoc.getPages();
  const total = pages.length;
  pages.forEach((p: PDFPage, idx: number) => {
    p.drawText(`Page ${idx + 1} of ${total}`, {
      x: PAGE_WIDTH - MARGIN - 60,
      y: 28,
      size: 8,
      font,
      color: gray,
    });
  });

  return pdfDoc.save();
}