const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat,
} = require("docx");

const GOLD = "8B5A2B";
const GOLD_LIGHT = "F3E6C8";
const CREAM = "FFF9F0";
const DARK = "1A1208";
const MUTED = "555555";
const WHITE = "FFFFFF";
const LINE = "D4C4A8";
const PAGE_W = 12240;
const PAGE_H = 15840;
const MARGIN = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2;

const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: opts.size || 22,
    bold: opts.bold || false,
    italics: opts.italics || false,
    color: opts.color || DARK,
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: 276 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [run(text, opts)],
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 4 } },
    children: [run(text, { size: 32, bold: true, color: GOLD })],
  });
}

function cell(text, width, opts = {}) {
  const fill = opts.fill || WHITE;
  const bold = opts.bold || false;
  const color = opts.color || DARK;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        children: [run(String(text), { size: opts.size || 20, bold, color })],
      }),
    ],
  });
}

function table(colWidths, rows) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: colWidths,
    rows,
  });
}

function headerRow(labels, widths) {
  return new TableRow({
    children: labels.map((label, i) =>
      cell(label, widths[i], { fill: GOLD, bold: true, color: WHITE, size: 20 })
    ),
  });
}

function stripedRows(data, widths) {
  return data.map((row, i) =>
    new TableRow({
      children: row.map((text, j) =>
        cell(text, widths[j], { fill: i % 2 === 0 ? CREAM : WHITE, size: 20 })
      ),
    })
  );
}

function callout(title, body) {
  return table(
    [CONTENT_W],
    [
      new TableRow({
        children: [
          new TableCell({
            borders: {
              top: thin,
              bottom: thin,
              right: thin,
              left: { style: BorderStyle.SINGLE, size: 24, color: GOLD },
            },
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { fill: CREAM, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 200, right: 200 },
            children: [
              p(title, { size: 20, bold: true, color: GOLD, after: 80 }),
              p(body, { size: 20, after: 0 }),
            ],
          }),
        ],
      }),
    ]
  );
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: GOLD },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H },
          margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 6 } },
              spacing: { after: 120 },
              children: [
                run("REJU  |  Working with Grok", { size: 18, bold: true, color: GOLD }),
                run("          Confidential — operators only", { size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 6 } },
              spacing: { before: 80 },
              children: [
                run("REJU Participation-Driven Ecosystem  ·  Page ", { size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 40 },
          children: [run("REJU", { size: 56, bold: true, color: GOLD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 280 },
          children: [run("PARTICIPATION-DRIVEN ECOSYSTEM™", { size: 18, bold: true, color: GOLD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: GOLD, space: 8 } },
          children: [run("Grok Bot, This Coding Session, and Hiring", { size: 36, bold: true, color: GOLD })],
        }),
        p("How the two Groks stay aligned, what each one is for, and whether you still need a human operator.", {
          size: 22,
          after: 240,
          align: AlignmentType.CENTER,
          color: MUTED,
        }),

        table(
          [2800, 7280],
          [
            new TableRow({
              children: [
                cell("Document purpose", 2800, { fill: GOLD, bold: true, color: WHITE }),
                cell("Give Wilson a short playbook for using a Grok bot on daily chores without mixing it up with the coding Grok that maintains rejutkn.com.", 7280, { fill: CREAM }),
              ],
            }),
            new TableRow({
              children: [
                cell("Live site", 2800, { fill: GOLD, bold: true, color: WHITE }),
                cell("https://rejutkn.com", 7280, { fill: WHITE }),
              ],
            }),
            new TableRow({
              children: [
                cell("Updated", 2800, { fill: GOLD, bold: true, color: WHITE }),
                cell("August 28, 2026", 7280, { fill: CREAM }),
              ],
            }),
          ]
        ),

        callout(
          "The important fact",
          "This Grok (the one on your computer, working on the website code) and a Grok bot you use for chores are separate. They do not share chats, passwords, or Drive access unless you give both the same instructions."
        ),

        h1("How to keep us aligned"),
        p("Give the bot the operator playbook, not this coding session. Point it at:"),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 80 },
          children: [run("docs/REJU-Website-System-Handoff.docx (or the PDF)", { size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 200 },
          children: [run("README.md in the reju-site folder", { size: 22 })],
        }),
        p("Tell the bot, in one pinned message:"),
        callout(
          "Pinned instruction for the Grok bot",
          "You are the REJU operator assistant. Follow the handoff. Do not change prices, tokenomics, or medical claims. Do not invent passwords. Confirm payment in Square/Streamflow/Drive before telling anyone they are in. Escalate legal, refund, wallet, and CRP fee questions to Wilson."
        ),
        p("Then split the work:", { before: 200 }),

        table(
          [5040, 5040],
          [
            headerRow(["This Grok (coding session)", "Grok bot (chores)"], [5040, 5040]),
            ...stripedRows(
              [
                [
                  "Code, security, deploy, site bugs",
                  "Daily checklist: Telegram, Square, Drive, Sheet",
                ],
                [
                  "New pages, APIs, Vercel",
                  "Draft replies to participants",
                ],
                [
                  "Drive JSON / passwords in the system",
                  "Remind you to rotate passwords after an event",
                ],
              ],
              [5040, 5040]
            ),
          ]
        ),

        p("When something on the site is wrong, bring it here (the coding Grok). When someone paid and needs the registration password, that is the bot — and you — until you trust a person.", {
          before: 200,
        }),
        p("Do not put the admin password in a public Grok chat, Telegram group, or X. If the bot needs it to help you click /admin, use a private chat only, and treat that as sensitive."),

        h1("Do you still need to hire someone?"),
        p("Not while enrollment is closed and you are only doing a few checks a week. The bot plus you is enough for chores: “did anyone pay?”, “what is the next step?”, “where is the receipt folder?”"),
        p("Yes — or you stay in that seat — once people are paying. A bot cannot:"),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [run("Log into Square or Streamflow as REJU and see a real payment", { size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [run("Open Google Drive/Sheets unless that account is shared with a human", { size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [run("Answer Telegram DMs from participants", { size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [run("Decide “this lock screenshot is fake”", { size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 60 },
          children: [run("Hand a password only to paid people", { size: 22 })],
        }),
        new Paragraph({
          numbering: { reference: "bullets", level: 0 },
          spacing: { after: 200 },
          children: [run("Compile a book and send the Drive link at the end", { size: 22 })],
        }),
        p("Those are trust jobs. Grok can remind the checklist and draft the script. A person still has to confirm money and send the password."),

        p("Practical setup:", { bold: true }),
        table(
          [2800, 7280],
          [
            headerRow(["When", "What to do"], [2800, 7280]),
            ...stripedRows(
              [
                [
                  "Now (development)",
                  "No hire. Use the bot as your checklist. You confirm any rare payment yourself.",
                ],
                [
                  "When enrollment opens",
                  "Either you block 20–30 minutes a day for operator work, or you hire someone part-time and give them the handoff plus Drive/Sheet access — not the admin password in a group chat. The bot can sit next to them so they don’t guess.",
                ],
              ],
              [2800, 7280]
            ),
          ]
        ),

        p("You do not need a developer hire for daily chores. You need an operator (you or one trusted person) the moment real $69 / $600 / locks start arriving. The bot makes that job smaller; it does not replace it.", {
          before: 240,
        }),
      ],
    },
  ],
});

const out = path.join(__dirname, "REJU-Grok-Bot-and-Hiring.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(out, buffer);
  console.log("Wrote", out);
});
