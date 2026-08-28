const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  ExternalHyperlink,
} = require("docx");

const GOLD = "8B5A2B";
const GOLD_LIGHT = "F3E6C8";
const CREAM = "FFF9F0";
const DARK = "1A1208";
const MUTED = "555555";
const WHITE = "FFFFFF";
const LINE = "D4C4A8";
const ALERT = "F4E4C8";
const PAGE_W = 12240;
const PAGE_H = 15840;
const MARGIN = 1080;
const CONTENT_W = PAGE_W - MARGIN * 2; // 10080

const thin = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const goldLeft = {
  top: thin,
  bottom: thin,
  right: thin,
  left: { style: BorderStyle.SINGLE, size: 24, color: GOLD },
};

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: "Arial",
    size: opts.size || 22,
    bold: opts.bold || false,
    italics: opts.italics || false,
    color: opts.color || DARK,
    underline: opts.underline ? {} : undefined,
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: 276 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [run(text, opts)],
  });
}

function rich(children, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: 276 },
    alignment: opts.align || AlignmentType.LEFT,
    children,
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 4 } },
    children: [run(text, { size: 36, bold: true, color: GOLD })],
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [run(text, { size: 28, bold: true, color: GOLD })],
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [run(text, { size: 24, bold: true, color: "3A2A18" })],
  });
}

function bullet(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80, line: 276 },
    children: [run(text, { size: 22 })],
  });
}

function bullet2(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 1 },
    spacing: { after: 60, line: 276 },
    children: [run(text, { size: 21, color: "333333" })],
  });
}

function numbered(text, ref = "numbers") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 80, line: 276 },
    children: [run(text, { size: 22 })],
  });
}

function cell(text, width, opts = {}) {
  const fill = opts.fill || WHITE;
  const isHeader = opts.header;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 70, bottom: 70, left: 100, right: 100 },
    columnSpan: opts.span,
    children: [
      new Paragraph({
        alignment: opts.align || AlignmentType.LEFT,
        children: [
          run(String(text), {
            size: opts.size || (isHeader ? 20 : 20),
            bold: isHeader || opts.bold || false,
            color: opts.color || (isHeader ? WHITE : DARK),
          }),
        ],
      }),
    ],
  });
}

function cellPara(paragraphs, width, opts = {}) {
  return new TableCell({
    borders: opts.borders || borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: opts.fill || WHITE, type: ShadingType.CLEAR },
    verticalAlign: opts.vAlign || VerticalAlign.TOP,
    margins: { top: 80, bottom: 80, left: 110, right: 110 },
    children: paragraphs,
  });
}

function table(columnWidths, rows) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths,
    rows,
  });
}

function headerRow(labels, widths, fill = GOLD) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((label, i) =>
      cell(label, widths[i], { header: true, fill, color: WHITE, bold: true })
    ),
  });
}

function dataRow(values, widths, opts = {}) {
  return new TableRow({
    children: values.map((v, i) =>
      cell(v, widths[i], { fill: opts.fill || (opts.stripe && i === -1 ? CREAM : WHITE) })
    ),
  });
}

function stripedRows(rows, widths) {
  return rows.map((values, idx) =>
    new TableRow({
      children: values.map((v, i) =>
        cell(v, widths[i], { fill: idx % 2 === 0 ? CREAM : WHITE })
      ),
    })
  );
}

function callout(title, bodyLines) {
  const paras = [
    new Paragraph({
      spacing: { after: 80 },
      children: [run(title, { bold: true, size: 22, color: GOLD })],
    }),
    ...bodyLines.map(
      (line) =>
        new Paragraph({
          spacing: { after: 60, line: 260 },
          children: [run(line, { size: 21 })],
        })
    ),
  ];
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [cellPara(paras, CONTENT_W, { fill: GOLD_LIGHT, borders: goldLeft })],
      }),
    ],
  });
}

function spacer(after = 200) {
  return new Paragraph({ spacing: { after }, children: [] });
}

function linkP(label, url) {
  return new Paragraph({
    spacing: { after: 80, line: 276 },
    children: [
      new ExternalHyperlink({
        children: [run(label, { size: 22, color: "1B4F8A", underline: true })],
        link: url,
      }),
    ],
  });
}

function flowStepCard(num, title, body) {
  const wNum = 900;
  const wBody = CONTENT_W - 900;
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [wNum, wBody],
    rows: [
      new TableRow({
        children: [
          cellPara(
            [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [run(num, { size: 36, bold: true, color: WHITE })],
              }),
            ],
            wNum,
            { fill: GOLD, vAlign: VerticalAlign.CENTER }
          ),
          cellPara(
            [
              new Paragraph({
                spacing: { after: 60 },
                children: [run(title, { bold: true, size: 22, color: GOLD })],
              }),
              new Paragraph({
                spacing: { after: 0, line: 260 },
                children: [run(body, { size: 20 })],
              }),
            ],
            wBody,
            { fill: CREAM }
          ),
        ],
      }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: GOLD },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: GOLD },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 },
      },
      {
        id: "Heading3",
        name: "Heading 3",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "3A2A18" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
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
          {
            level: 1,
            format: LevelFormat.BULLET,
            text: "–",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "numbers",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "ops-daily",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "ops-event",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "crypto-steps",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "fiat-steps",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "after-event",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
      {
        reference: "crp-steps",
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
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
              border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 4 } },
              spacing: { after: 80 },
              children: [
                run("REJU  |  Website System Handoff", { size: 18, bold: true, color: GOLD }),
                run("                                          Confidential — operators only", {
                  size: 16,
                  color: MUTED,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 6 } },
              spacing: { before: 80 },
              children: [
                run("REJU Participation-Driven Ecosystem  ·  Page ", { size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: MUTED }),
                run(" of ", { size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        // COVER
        new Paragraph({
          spacing: { before: 600, after: 80 },
          alignment: AlignmentType.CENTER,
          children: [run("REJU", { size: 72, bold: true, color: GOLD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [run("PARTICIPATION-DRIVEN ECOSYSTEM™", { size: 20, bold: true, color: GOLD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: GOLD, space: 8 } },
          children: [run(" ")],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 120 },
          children: [run("Website & Operations Handoff", { size: 44, bold: true, color: DARK })],
        }),
        p("How the site works, how participants move through it, and how to run the system day to day.", {
          align: AlignmentType.CENTER,
          size: 24,
          color: MUTED,
          after: 400,
        }),
        spacer(200),
        table(
          [3200, 6880],
          [
            new TableRow({
              children: [
                cell("Document purpose", 3200, { fill: GOLD, header: true }),
                cell("Train a trusted operator to cover the live system while the founder focuses on the main job.", 6880, { fill: CREAM }),
              ],
            }),
            new TableRow({
              children: [
                cell("Audience", 3200, { fill: GOLD_LIGHT, bold: true }),
                cell("Non-technical or lightly technical operator. You do not need to be a programmer.", 6880),
              ],
            }),
            new TableRow({
              children: [
                cell("Live site", 3200, { fill: GOLD, header: true }),
                cell("https://rejutkn.com", 6880, { fill: CREAM }),
              ],
            }),
            new TableRow({
              children: [
                cell("Updated", 3200, { fill: GOLD_LIGHT, bold: true }),
                cell("August 20, 2026", 6880),
              ],
            }),
            new TableRow({
              children: [
                cell("Owner", 3200, { fill: GOLD, header: true }),
                cell("Wilson Fischmann / REJU  ·  rejutoken@gmail.com", 6880, { fill: CREAM }),
              ],
            }),
          ]
        ),
        spacer(300),
        callout("How to use this document", [
          "Read sections 1–4 first so the map makes sense. Then use the checklists in sections 12–14 as your daily playbook.",
          "Hidden admin URLs are listed later. Do not post them on social media, Telegram, or the public site.",
          "Passwords are not printed here. Get the current admin password from Wilson. You will see and change participant passwords inside the admin dashboard.",
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        h1("1. What you are responsible for", "s1"),
        p("You are covering operations of the REJU website and participant system. Think of yourself as the front desk, registrar, and proof-checker — not the software developer."),
        h3("You handle"),
        bullet("Answering participant questions (Telegram, email) about how to enroll, pay, lock, register, and journal."),
        bullet("Confirming payments and lock proofs, then giving paid people the current registration password."),
        bullet("Watching the participant registry (Google Sheet) for new sign-ups."),
        bullet("Checking Google Drive folders for receipts, lock screenshots, and daily journal PDFs."),
        bullet("Changing cohort passwords after each event from the hidden admin dashboard."),
        bullet("Generating each participant’s compiled Transformation Book when they finish."),
        bullet("Turning global access on or off if something is wrong or an event is closed."),
        bullet("Updating the public “project status” banner when Wilson asks (before/after launch)."),

        h3("You do not need to"),
        bullet("Rewrite the website code unless you are also hired as a developer."),
        bullet("Change tokenomics, legal copy, or prices without Wilson’s approval."),
        bullet("Hold anyone’s crypto. Locks are non-custodial on Streamflow. Tokens stay in the participant’s wallet."),
        bullet("Give medical advice. REJU is a structured lifestyle/rejuvenation protocol with disclaimers."),

        spacer(160),
        callout("Current public status (important)", [
          "The landing page currently tells visitors that REJU is still in development and that enrollment, payments, and program access are not open yet.",
          "That message lives in a small file: lib/siteNews.ts. When Wilson is ready to open enrollment, that banner should be updated so people are not told to wait.",
          "Until then: do not send strangers payment links as if the event is live, unless Wilson says it is open.",
        ]),

        h1("2. What REJU is, in plain language", "s2"),
        p("REJU is two things that share one website:"),
        numbered("A token (REJU) that people can buy and hold, or lock for six months."),
        numbered("A 6-week Rejuvenation Event™ — a guided health/transformation program. Participants document the journey daily and author a personal Transformation Book."),
        p("The health program is built around Kat’s Legacy (the guide book), the REJU Protocol, and Kat’s JOL (Juice of Life). Participants are not buying a magic title. They are going through a structured process and writing the record of it."),
        p("The website’s job is to explain this, collect payment or lock proof, register people, give them materials, collect daily journal chapters, and later compile those chapters into a book."),

        h3("The 6-week Event structure"),
        bullet("Preparation week — set the Health Benchmark (photos, energy, how the body feels). No scale obsession."),
        bullet("Weeks 1–4 — core protocol (introduction, repair, freedom/lightness, optimal state)."),
        bullet("Celebration week — compare the benchmark to results and carry habits forward."),
        p("The site also talks about a 20-day cohort instruction set used inside facilitator meetings. Treat that as teaching material, not a second product."),

        h1("3. Master flow map", "s3"),
        p("Almost every paying participant follows the same five-step path. Marketing pages (home, blog, Rejunomics, industry analysis) are optional reading. Enrollment always comes back to this path:"),
        spacer(80),
        flowStepCard("1", "Program  ·  /program", "Person learns what the 6-week Event is and decides they want in."),
        spacer(80),
        flowStepCard("2", "Onboarding  ·  /onboarding", "They choose Path A (crypto lock) or Path B (pay $600 in fiat). CRP certification is a separate path on the same page."),
        spacer(80),
        flowStepCard("3", "Pay & Lock", "Crypto: buy ~$600 of REJU, lock 6 months on Streamflow, pay $69 book+admin. Fiat: pay $600 program fee + $69 book+admin on Square."),
        spacer(80),
        flowStepCard("4", "Register  ·  /participant-registration", "After you confirm they paid/locked, you give them the current cohort password. They register and receive a Participant ID (example: REJU-202608201430-5821)."),
        spacer(80),
        flowStepCard("5", "Author  ·  /daily-transformation-log", "They journal daily with that Participant ID. Each entry becomes a chapter PDF in Google Drive. At the end you compile the book."),

        spacer(200),
        p("Visual map of the whole site:", { italics: true, color: MUTED }),
        table(
          [CONTENT_W],
          [
            new TableRow({
              children: [
                cellPara(
                  [
                    p("PUBLIC FRONT DOOR", { bold: true, size: 20, color: GOLD, after: 80 }),
                    p("Home  →  Buy REJU  |  Program  |  Rejunomics  |  Blog  |  Industry Analysis", { size: 19, after: 80 }),
                    p("Home also offers three entry stories: A invest only  ·  B lock $600 REJU  ·  C pay $600 fiat", { size: 19, after: 160 }),
                    p("ENROLLMENT CORE  (this is the system you operate)", { bold: true, size: 20, color: GOLD, after: 80 }),
                    p("Program → Onboarding → Square / Streamflow → optional proof upload → Registration → Event Materials → Daily Journal → Book compile", { size: 19, after: 160 }),
                    p("SIDE PATHS", { bold: true, size: 20, color: GOLD, after: 80 }),
                    p("CRP Certification  ·  Book-only (Kat’s Legacy)  ·  Knowledge Library  ·  X Post Studio (team only)", { size: 19, after: 0 }),
                  ],
                  CONTENT_W,
                  { fill: CREAM }
                ),
              ],
            }),
          ]
        ),

        h1("4. How people enter (the money paths)", "s4"),
        p("The home page describes three ways to be involved. Only B and C enroll in the Event. All Event participants also pay the $69 book + admin fee."),
        spacer(80),

        table(
          [1400, 2800, 5880],
          [
            headerRow(["Path", "Who it is for", "What they do"], [1400, 2800, 5880]),
            ...stripedRows(
              [
                [
                  "A",
                  "Investors only",
                  "Buy and hold REJU. No lock, no Event, no Participant ID. Buying the token is not joining the program.",
                ],
                [
                  "B  Crypto",
                  "Event via token lock",
                  "Buy about $600 of REJU, lock it 6 months on Streamflow (stays in their wallet), pay $69 on Square, then register.",
                ],
                [
                  "C  Fiat",
                  "Event without crypto",
                  "Pay $600 program fee on Square, pay $69 book+admin on Square, then register. Same Event and book journey.",
                ],
                [
                  "CRP",
                  "Future practitioners",
                  "Separate certification path. Register with flow=crp and upload a CRP payment receipt. Dollar amount is not printed on the public CRP pages — confirm the current fee with Wilson before quoting it.",
                ],
              ],
              [1400, 2800, 5880]
            ),
          ]
        ),
        spacer(200),
        h3("Official payment links (onboarding page)"),
        table(
          [3600, 6480],
          [
            headerRow(["What", "Where"], [3600, 6480]),
            ...stripedRows(
              [
                ["$69 Book + Admin (all Event participants)", "https://square.link/u/zH7dIuF5"],
                ["$600 Direct program fee (fiat Path C)", "https://square.link/u/fmBzbrPI"],
                ["Lock REJU (crypto Path B)", "https://app.streamflow.finance/token-lock"],
                ["Buy REJU (exchanges/wallets)", "https://rejutkn.com/buy"],
              ],
              [3600, 6480]
            ),
          ]
        ),
        spacer(160),
        callout("Operator rule on money", [
          "Do not invent a discount or a new price. The public site currently states $600 Event + $69 book/admin.",
          "Crypto lock is the alternative to the $600 fiat fee. They still pay $69.",
          "After lock, REJU returns to their wallet. If the token price drops, they can lose part of that $600 value — the site already discloses this. Do not promise “risk-free.”",
        ]),

        h1("5. Event journey, step by step", "s5"),
        h3("Path B — Crypto lock"),
        numbered("Person reads /program, then goes to /onboarding.", "crypto-steps"),
        numbered("They buy roughly $600 of REJU from /buy (Jupiter, Raydium, Phantom, etc.).", "crypto-steps"),
        numbered("They lock that REJU for 6 months on Streamflow. REJU never takes custody.", "crypto-steps"),
        numbered("They pay $69 book + admin on Square.", "crypto-steps"),
        numbered("They should upload lock proof at /uploadrejulock and/or the $69 receipt at /uploadbookadmin. If they forget, you can still confirm from Square/Streamflow and Telegram.", "crypto-steps"),
        numbered("You confirm payment + lock, then send them the current registration password (only to paid people).", "crypto-steps"),
        numbered("They open /participant-registration?flow=event, unlock with the password, and submit name, email, city, state, country (phone/Telegram/address optional).", "crypto-steps"),
        numbered("The site creates a Participant ID and a row in the Google Sheet. Status starts as “Pending • [current cohort name].”", "crypto-steps"),
        numbered("They land on /reju-event-materials with that ID. They save the ID. Without it, later book compile fails.", "crypto-steps"),
        numbered("They journal every day at /daily-transformation-log using the book password (often the same as registration, unless you split them).", "crypto-steps"),
        numbered("When they finish (around day 42 the form reminds them), you compile their book from /admin/generate-book.", "crypto-steps"),

        h3("Path C — Direct fiat"),
        numbered("Same as above, except they pay $600 on Square instead of buying/locking REJU.", "fiat-steps"),
        numbered("They should upload the $600 receipt at /uploadfiatpay and the $69 receipt at /uploadbookadmin.", "fiat-steps"),
        numbered("You confirm both Square payments, then give the registration password.", "fiat-steps"),

        h3("What happens at registration (the ID is everything)"),
        p("The website generates an ID like REJU-YYYYMMDDHHMMSS-1234. That ID is stored in the browser for the session and shown on the materials page. Tell every participant: write it down. Daily journal PDFs are named with this ID. The book generator searches Drive by that ID."),
        p("New rows are appended to the Google Sheet tab named Participants. Columns include date, ID, name, email, phone, Telegram, address, city, state, zip, country, and a status of Pending plus the current cohort name. After you verify payment, change Pending to Approved (or similar) in the sheet so you know who is real."),

        h1("6. Proof upload pages", "s6"),
        p("These pages are simple: name, notes (transaction ID, wallet, etc.), and a file. Files go into dedicated Google Drive folders via a service account. They are not linked loudly in the main navigation — you will often send the URL in Telegram."),
        spacer(80),
        table(
          [2800, 2800, 4480],
          [
            headerRow(["Page", "Upload type", "What belongs there"], [2800, 2800, 4480]),
            ...stripedRows(
              [
                ["/uploadbookadmin", "bookadmin", "$69 Square receipt for Kat’s Legacy + admin."],
                ["/uploadfiatpay", "fiatpay", "$600 Square receipt (fiat Event path)."],
                ["/uploadrejulock", "rejulock", "Streamflow lock screenshot / transaction proof."],
                ["/uploadcrp", "crp", "CRP certification payment receipt."],
                ["/daily-transformation-log", "dailyjournal", "Official daily chapter form. Builds a 6×9 PDF chapter automatically."],
              ],
              [2800, 2800, 4480]
            ),
          ]
        ),
        spacer(160),
        p("Successful upload message: “Upload successful. Your verification has been submitted.” Your job is to open the matching Drive folder, match the name to a Square/Streamflow payment, then reply to the person with next steps."),

        h1("7. After registration: materials and journaling", "s7"),
        h3("Event materials  ·  /reju-event-materials"),
        p("This is the “you’re in” page. It shows the Participant ID and starting instructions (set Day 1 benchmark, same light/same camera for photos). It lists downloads: 20-day cohort PowerPoint and PDF, four-week reset, Kat’s JOL recipe, body-as-city teaching piece, chronic illness/diet PDF, book-authoring guide, and a Google Drive research library."),
        p("There is also a password-protected Knowledge Library at /course-event-info. It uses the same registration password. Only paid cohort members should have that password."),
        p("Welcome-style pages that explain the vibe (not the payment mechanics):"),
        bullet("/reju-event-welcome — Event welcome, rules, 3 live sessions per week, daily victory."),
        bullet("/book-welcome — Kat’s Legacy download (Google Drive file) after the $69 path."),
        bullet("/crp-welcome — what a Certified Rejuvenation Practitioner is."),

        h3("Daily Transformation Log  ·  /daily-transformation-log"),
        p("This is the heart of the product. Participants unlock it with the book authoring password, then submit:"),
        bullet("Participant ID (required — without it the compiled book cannot be found)."),
        bullet("Day of program, date, physical condition, skin notes, 1–5 scores (clarity, dryness, inflammation, energy, mental clarity, mood)."),
        bullet("Protocol compliance, photos, “positive things,” what they noticed, changes since yesterday, consent."),
        p("The server turns that into a 6×9 inch PDF chapter and stores it in the daily-journal Drive folder. Progress autosaves in the browser. On day 42 they get a message to contact REJU personnel to generate the final book."),
        p("Nav label for this page is “Author Your Book.” /dailyjournal redirects here."),

        h1("8. Compiling the Transformation Book", "s8"),
        p("When a participant has enough daily PDFs, you (not them) compile the book."),
        numbered("Open the hidden page /admin/generate-book (linked from /admin). Enter the admin password. Do not share this URL publicly."),
        numbered("Paste their exact Participant ID."),
        numbered("The system finds every matching *_dailyjournal.pdf in Drive, merges them, and uploads a compiled PDF named like PARTICIPANTID_REJU_Transformation_Book.pdf into the book-admin Drive folder."),
        numbered("You get a Google Drive view link. Send that link (or a download) to the participant."),
        p("If it says no entries found: the ID they used in the journal does not match. Search the daily-journal folder by last name and fix the ID with them before retrying."),

        h1("9. CRP Certification path", "s9"),
        p("CRP = Certified Rejuvenation Practitioner. It is not the standard Event. It is for people who want to understand, support, and eventually help guide the REJU process professionally."),
        numbered("They read /crp-welcome.", "crp-steps"),
        numbered("They register at /participant-registration?flow=crp (same password gate as Event unless Wilson later splits it).", "crp-steps"),
        numbered("They upload payment proof at /uploadcrp.", "crp-steps"),
        numbered("You confirm the receipt in the CRP Drive folder and follow Wilson’s training/evaluation process. The website does not yet auto-issue a certificate.", "crp-steps"),
        spacer(80),
        callout("CRP fee", [
          "The public CRP pages do not currently show a dollar amount. They only say to upload a receipt “when required.”",
          "Do not guess. Ask Wilson for the current CRP fee before you quote anyone a price.",
        ]),

        h1("10. Hidden admin dashboard (your control room)", "s10"),
        p("Main URL: /admin  — marked “REJU PERSONNEL ONLY.” Never add this to the public navigation or social bios."),
        p("Unlock with the admin password. Inside you can:"),
        bullet("See and change the registration password (unlocks /participant-registration and the knowledge library)."),
        bullet("See and change the book authoring password (unlocks daily journal submissions)."),
        bullet("Set a collaborator password for X Post Studio at /x-post (research/generate posts only — no admin power)."),
        bullet("Change the admin password itself. Remember it. If you lose it, recovery is through the Google Drive config file (see below)."),
        bullet("Set the current cohort name (example: “1st Cohort 2026”). This is written onto new participant rows."),
        bullet("Global kill switch: disable access to instantly lock registration and journal submissions for everyone. Use this if you are attacked, passwords leak, or an event is closed."),
        p("Passwords and flags are stored in reju-config.json inside the REJU JSON Files Google Drive folder. Blog likes and comments are blog-engagement.json in that same folder. You normally never edit these by hand — use /admin for passwords."),
        p("Linked from the dashboard: Generate Books, X Post Studio (admin), and a collaborator link to /x-post."),
        spacer(80),
        callout("Password hygiene", [
          "Give the registration/book password only to people whose payment or lock you have confirmed.",
          "Change those passwords after every cohort so old unpaid visitors cannot reuse them.",
          "The admin password is for operators only. Do not put it in Telegram group chats.",
          "You may keep registration and book passwords the same for simplicity, or split them if Wilson wants tighter control.",
        ]),

        h1("11. Daily and weekly operator checklist", "s11"),
        h3("Every day (or every weekday)"),
        numbered("Check Telegram (@rejuofficial / DMs) and rejutoken@gmail.com for people stuck on pay, lock, or password.", "ops-daily"),
        numbered("Check Square for new $69 and $600 payments.", "ops-daily"),
        numbered("Check Drive folders: bookadmin, fiatpay, rejulock, crp — match names to payments.", "ops-daily"),
        numbered("Check the Participants Google Sheet for new Pending rows. Approve after proof is real.", "ops-daily"),
        numbered("Reply to each confirmed person with: (1) you are in, (2) current registration password, (3) link to /participant-registration, (4) “save your Participant ID.”", "ops-daily"),
        numbered("Spot-check the daily-journal folder: are people uploading? Anyone stuck without an ID?", "ops-daily"),
        numbered("If something looks like a security issue (password posted publicly, spam registrations), disable global access on /admin and message Wilson.", "ops-daily"),

        h3("During a live Event"),
        numbered("Remind the cohort: journal daily, same photo setup, use the Participant ID, no scale obsession.", "ops-event"),
        numbered("Point facilitators to the 20-day PowerPoint and PDFs on the materials page.", "ops-event"),
        numbered("Keep the knowledge library password current.", "ops-event"),
        numbered("Do not give medical diagnoses. Direct people to the protocol materials and their own professionals.", "ops-event"),

        h3("After each Event"),
        numbered("Generate books for finishers via /admin/generate-book.", "after-event"),
        numbered("Change registration and book passwords on /admin.", "after-event"),
        numbered("Update current cohort name for the next group.", "after-event"),
        numbered("Optionally disable global access until the next cohort is ready.", "after-event"),
        numbered("Archive or label last cohort’s sheet rows so the next Pending list is clean.", "after-event"),

        h1("12. Page directory", "s12"),
        h3("Public pages (safe to share)"),
        table(
          [3400, 6680],
          [
            headerRow(["URL", "Purpose"], [3400, 6680]),
            ...stripedRows(
              [
                ["/", "Home — story, tokenomics snapshot, three entry paths, status banner."],
                ["/program", "What the 6-week Event is. Main “Enter” button goes to onboarding."],
                ["/onboarding", "Choose crypto or fiat, pay/lock, CRP side path, then register."],
                ["/buy", "Where to buy REJU (exchanges/wallets) and reminder that buying ≠ joining."],
                ["/rejunomics", "Holdings/release transparency (tokenomics disclosure)."],
                ["/blog", "Research articles. Public. People can like/comment."],
                ["/crypto-industry-analysis-2026", "Long-form industry positioning piece."],
                ["/participant-registration", "Password-gated sign-up. Add ?flow=event, crp, book, or lock."],
                ["/daily-transformation-log", "Password-gated daily book chapters."],
                ["/crp-welcome", "Explains Certified Rejuvenation Practitioner."],
                ["/book-welcome", "Kat’s Legacy welcome + Drive download."],
                ["/reju-event-welcome", "Soft welcome / program rules after they are in."],
                ["/reju-event-materials", "Post-registration ID + downloads + Day 1 instructions."],
                ["/course-event-info", "Password-gated knowledge library."],
              ],
              [3400, 6680]
            ),
          ]
        ),
        spacer(200),
        h3("Operator / hidden pages (do not publicize)"),
        table(
          [3400, 6680],
          [
            headerRow(["URL", "Purpose"], [3400, 6680]),
            ...stripedRows(
              [
                ["/admin", "Passwords, cohort name, global on/off switch."],
                ["/admin/generate-book", "Compile a participant’s full Transformation Book."],
                ["/admin/x-post", "Admin X (Twitter) post studio."],
                ["/x-post", "Collaborator post studio (limited). Share only with trusted helpers."],
                ["/uploadbookadmin", "$69 receipt drop."],
                ["/uploadfiatpay", "$600 receipt drop."],
                ["/uploadrejulock", "Streamflow lock proof drop."],
                ["/uploadcrp", "CRP receipt drop."],
              ],
              [3400, 6680]
            ),
          ]
        ),

        h1("13. Google Drive and Sheets (where the real records live)", "s13"),
        p("The website does not keep a private database of people. Google is the filing cabinet. A Google service account uploads files and writes sheet rows. You need access to the same Shared Drives / folders Wilson uses (ask him to share them with your Google account)."),
        spacer(80),
        table(
          [2800, 7280],
          [
            headerRow(["Store", "What you will see"], [2800, 7280]),
            ...stripedRows(
              [
                ["Participants spreadsheet", "Master registry. Tab name: Participants. New sign-ups append as Pending + cohort."],
                ["Daily journal folder", "One 6×9 PDF per day per person. Filenames include Participant ID and date."],
                ["JSON files folder", "reju-config.json (passwords) and blog-engagement.json. Not mixed with client books."],
                ["Book admin folder", "$69 receipts and compiled Transformation Books only."],
                ["Fiat pay folder", "$600 receipts."],
                ["REJU lock folder", "Streamflow lock screenshots."],
                ["CRP folder", "CRP payment receipts."],
                ["Cohort materials folder", "Facilitator decks and instructional files."],
                ["Event materials library", "Research archive linked from the materials page."],
              ],
              [2800, 7280]
            ),
          ]
        ),
        spacer(160),
        p("If uploads suddenly fail for everyone, it is usually Google credentials or folder permissions — escalate to whoever maintains the Vercel hosting and .env keys. Do not paste private keys into Telegram or this document."),

        h1("14. Marketing, blog, and X posts", "s14"),
        p("You can run these without being a developer."),
        h3("Blog  ·  /blog"),
        p("Public research posts. Readers can like and leave threaded comments. Those are stored in Google Drive. You do not need to moderate unless something abusive appears — then tell Wilson."),
        h3("Landing banner"),
        p("The gold “Project Status” box on the home page is edited in lib/siteNews.ts (headline, optional launch date, message). Change it only when Wilson wants the public story to change (for example, “Enrollment is open”)."),
        h3("X Post Studio"),
        bullet("Admins: /admin/x-post"),
        bullet("Collaborators: /x-post with the collaborator password."),
        p("This tool researches and drafts posts aligned with REJU concepts (crypto days vs rejuvenation days). A scheduled job is set to run daily at 14:00 UTC against /api/x-post/auto (Mon/Wed/Fri crypto, Tue/Thu/Sat rejuvenation, Sunday rest). Confirm with Wilson whether auto-posting to X is actually connected and allowed. Drafting is safe; publishing to the live @rejutoken account is not something to freelance."),
        p("Public socials: X https://x.com/rejutoken  ·  Telegram https://t.me/rejuofficial"),

        h1("15. What to tell participants (scripts)", "s15"),
        h3("After you confirm payment or lock"),
        p("You can copy this:"),
        table(
          [CONTENT_W],
          [
            new TableRow({
              children: [
                cellPara(
                  [
                    p("Welcome to REJU. Your payment/lock is confirmed.", { size: 20, after: 80 }),
                    p("1) Open the registration page and enter the access password I am sending you in a separate message.", { size: 20, after: 40 }),
                    p("2) Complete the form. You will receive a Participant ID that looks like REJU-… Write it down and take a screenshot.", { size: 20, after: 40 }),
                    p("3) On the materials page, read Day 1 benchmark instructions and download the guides.", { size: 20, after: 40 }),
                    p("4) Start Author Your Book (daily journal) with the same (or book) password. Use your Participant ID on every entry.", { size: 20, after: 40 }),
                    p("Join Telegram: https://t.me/rejuofficial", { size: 20, after: 0 }),
                  ],
                  CONTENT_W,
                  { fill: CREAM }
                ),
              ],
            }),
          ]
        ),
        spacer(160),
        h3("If they say “I bought REJU, am I in the program?”"),
        p("No. Buying the token is Path A (investment). The Event requires a 6-month lock plus $69, or a $600 fiat payment plus $69, then registration."),
        h3("If they lost their Participant ID"),
        p("Look them up by email or name in the Participants sheet and send the ID again. Ask them to use that exact ID on the next journal so the book stays in one pile."),
        h3("If the password does not work"),
        p("Confirm they are a paid/approved person. Check /admin that global access is ENABLED and that you are giving the current password, not last cohort’s. Typos and extra spaces are the usual issue."),

        h1("16. Escalate to Wilson (do not guess)", "s16"),
        bullet("Any legal, medical, refund, or “can I get certified this week” question that is not already on the site."),
        bullet("Price changes, new Square links, or CRP fee quotes."),
        bullet("Website down, uploads failing for everyone, sheet not receiving rows."),
        bullet("Someone claiming to be admin or asking for the admin password."),
        bullet("Token/lock problems on Streamflow that look like a lost wallet (you cannot recover wallets)."),
        bullet("Anything that would change public copy, tokenomics, or the launch banner."),

        h1("17. Technical snapshot (only if a developer helps you)", "s17"),
        p("You do not need this to operate. It is here so a hired developer is not lost."),
        bullet("Stack: Next.js site, hosted on Vercel, live domain rejutkn.com."),
        bullet("Repo: reju-site. Main branch."),
        bullet("No traditional database. Google Drive + Google Sheets are the datastore."),
        bullet("Config files: reju-config.json and blog-engagement.json in the REJU JSON Files Drive folder (GOOGLE_DRIVE_JSONFILES)."),
        bullet("Environment variables live in Vercel (Google service account, folder IDs, sheet ID, cron secret). Local copies exist for development — never commit them."),
        bullet("Key APIs: /api/register-participant, /api/upload, /api/verify-password, /api/admin/config, /api/generate-book, /api/x-post/*."),
        bullet("If global active is false, registration and journal APIs reject submissions even with the right password."),

        h1("18. One-page cheat sheet", "s18"),
        table(
          [3600, 6480],
          [
            headerRow(["If this happens", "Do this"], [3600, 6480]),
            ...stripedRows(
              [
                ["New person wants the Event", "Send /program then /onboarding. Do not skip payment."],
                ["They paid $69 and $600", "Confirm Square → send registration password → they get an ID."],
                ["They locked $600 REJU", "Confirm Streamflow proof → still collect $69 → then password."],
                ["They only bought the token", "They are an investor, not a participant, until they lock or pay fiat."],
                ["They want CRP", "Send /crp-welcome and /uploadcrp. Confirm fee with Wilson."],
                ["They cannot register", "Check /admin: access ON, current password, they actually paid."],
                ["They cannot journal", "Book password + Participant ID. Prefer /daily-transformation-log."],
                ["Event finished", "Generate book by ID, then rotate passwords."],
                ["Emergency / leak", "Disable global access on /admin, then call Wilson."],
                ["Need the filing cabinet", "Google Sheet (people) + Drive folders (receipts, journals, books)."],
              ],
              [3600, 6480]
            ),
          ]
        ),
        spacer(280),
        callout("Closing note for the operator", [
          "The website looks like a marketing site. The operating system is actually: Square + Streamflow + a password + a Google Sheet + Drive folders + a daily journal that becomes a book.",
          "If you keep those five things straight, you can run REJU’s participant operations without touching code.",
          "When in doubt, do not improvise prices or medical claims. Confirm money, protect passwords, save IDs, and keep Wilson informed.",
        ]),
        spacer(200),
        p("End of handoff. Questions about this document should go to Wilson before you change the live system.", {
          italics: true,
          color: MUTED,
          align: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  const out = path.join(__dirname, "REJU-Website-System-Handoff.docx");
  fs.writeFileSync(out, buffer);
  console.log("Wrote", out);
});
