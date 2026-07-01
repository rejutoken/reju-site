/**
 * Generates REJU 20-Day Cohort Instructions PowerPoint
 * Run: npm run generate:cohort-pptx
 */
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import pptxgen from "pptxgenjs";
import { COHORT_DAILY_SESSIONS } from "../lib/cohortDailySessions";

const COLORS = {
  bg: "0B0B0C",
  card: "120904",
  gold: "F5C26B",
  goldDark: "6F5320",
  text: "E5E7EB",
  textDim: "9CA3AF",
  white: "FFFFFF",
  accent: "2B1A12",
};

const EMOTIONAL_HOOKS: Record<number, string> = {
  1: "A father refused to accept the word impossible — and that love became Kat's Legacy, and your protocol.",
  2: "Your body is a living city. When the drainage stops, the whole city floods.",
  3: "You were born with an army inside you. Stress is the traitor that disarms it.",
  4: "Every chronic illness conversation eventually returns to one room: your gut.",
  5: "You cannot clean a jar while pouring poison into it. Stop the intake first.",
  6: "Sugar is not comfort — it is fuel for the very inflammation you came here to escape.",
  7: "You are not weak when you stress-eat. You are human. Now learn to hear the emotion before the fork.",
  8: "Water is not background noise. It is the river that carries every healing signal through your body.",
  9: "Elimination is not optional — it is the exit door of detox. Open it.",
  10: "Kat's JOL was tested on a father's own body before it touched his daughter. That is the standard you hold today.",
  11: "You do not need more calories. You need more life in every bite.",
  12: "At hour sixteen, your cells begin to eat what no longer serves them. Let them.",
  13: "Week one is not punishment. It is permission — permission to finally clear the path.",
  14: "Your brain was never meant to run on sugar alone. Ketones are clarity arriving.",
  15: "Surgery holds the wound together. Your body does the healing. Trust the intelligence inside you.",
  16: "Sustainability is not willpower. It is the mind learning to serve the body, not govern it.",
  17: "Solids return gently — like spring after winter. Rush it, and you lose everything you built.",
  18: "Dry skin, fatigue, cravings — these are not random. They are your body speaking. Learn the language.",
  19: "Science and faith are not opponents here. Gratitude is the amplifier of repair.",
  20: "You did not just survive twenty days. You authored the opening chapters of your transformation.",
};

const PHASES: { startDay: number; title: string; subtitle: string }[] = [
  { startDay: 1, title: "Phase I — Know Your Body", subtitle: "Days 1–4 · Lymph · Immune · Digestion · Awareness" },
  { startDay: 5, title: "Phase II — Clear the Poison", subtitle: "Days 5–9 · Toxins · Sugar · Mind · Water · Colon" },
  { startDay: 10, title: "Phase III — Fuel the Repair", subtitle: "Days 10–12 · Kat's JOL · Superfoods · Autophagy" },
  { startDay: 13, title: "Phase IV — Live the Protocol", subtitle: "Days 13–17 · Detox · Ketosis · Repair · Transition" },
  { startDay: 18, title: "Phase V — Own Your Legacy", subtitle: "Days 18–20 · Body Language · Faith · Celebration" },
];

function phaseForDay(day: number) {
  let phase = PHASES[0];
  for (const p of PHASES) {
    if (day >= p.startDay) phase = p;
  }
  return phase;
}

function addDarkBackground(slide: pptxgen.Slide, pres: pptxgen) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 10,
    h: 5.625,
    fill: { color: COLORS.bg },
    line: { color: COLORS.bg, width: 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.12,
    h: 5.625,
    fill: { color: COLORS.gold },
    line: { color: COLORS.gold, width: 0 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 5.45,
    w: 10,
    h: 0.18,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent, width: 0 },
  });
}

function addDecorativeOrbs(slide: pptxgen.Slide, pres: pptxgen) {
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2,
    y: -0.8,
    w: 2.4,
    h: 2.4,
    fill: { color: COLORS.gold, transparency: 88 },
    line: { color: COLORS.gold, width: 0 },
  });
  slide.addShape(pres.shapes.OVAL, {
    x: -0.6,
    y: 4.2,
    w: 1.8,
    h: 1.8,
    fill: { color: COLORS.goldDark, transparency: 70 },
    line: { color: COLORS.goldDark, width: 0 },
  });
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trim() + "…";
}

function condensePoints(points: string[], max = 3): string[] {
  return points.slice(0, max).map((p) => truncate(p, 120));
}

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "REJU | Wilson Fischmann CA";
  pres.title = "REJU 20-Day Cohort Daily Instructions";
  pres.subject = "REJU Rejuvenation Event — Cohort Meeting Guide";
  pres.company = "REJU Token";

  const logoPath = join(process.cwd(), "public", "logo.png");
  const outDir = join(process.cwd(), "public", "materials");
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "REJU-20-Day-Cohort-Instructions.pptx");

  // ── Title slide ──
  {
    const slide = pres.addSlide();
    addDarkBackground(slide, pres);
    addDecorativeOrbs(slide, pres);

    if (existsSync(logoPath)) {
      slide.addImage({ path: logoPath, x: 3.75, y: 0.55, w: 2.5, h: 1.0, sizing: { type: "contain", w: 2.5, h: 1.0 } });
    }

    slide.addText("REJU REJUVENATION EVENT™", {
      x: 0.5,
      y: 1.75,
      w: 9,
      h: 0.45,
      fontSize: 14,
      fontFace: "Calibri",
      color: COLORS.gold,
      bold: true,
      charSpacing: 4,
      align: "center",
      margin: 0,
    });

    slide.addText("20-Day Cohort\nDaily Instructions", {
      x: 0.5,
      y: 2.2,
      w: 9,
      h: 1.4,
      fontSize: 40,
      fontFace: "Georgia",
      color: COLORS.white,
      bold: true,
      align: "center",
      margin: 0,
    });

    slide.addText("Ten minutes a day. One transformation at a time.", {
      x: 1,
      y: 3.65,
      w: 8,
      h: 0.5,
      fontSize: 18,
      fontFace: "Calibri",
      color: COLORS.text,
      italic: true,
      align: "center",
      margin: 0,
    });

    slide.addText("Aligned with Kat's Legacy · REJU Protocol™ · Bolivia Health Course", {
      x: 0.5,
      y: 4.35,
      w: 9,
      h: 0.35,
      fontSize: 11,
      color: COLORS.textDim,
      align: "center",
      margin: 0,
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 3.1,
      y: 4.85,
      w: 3.8,
      h: 0.45,
      fill: { color: COLORS.card },
      line: { color: COLORS.gold, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText("rejutkn.com/reju-event-materials", {
      x: 3.1,
      y: 4.85,
      w: 3.8,
      h: 0.45,
      fontSize: 11,
      color: COLORS.gold,
      align: "center",
      valign: "middle",
      margin: 0,
    });
  }

  // ── Emotional opening ──
  {
    const slide = pres.addSlide();
    addDarkBackground(slide, pres);
    addDecorativeOrbs(slide, pres);

    slide.addText("WHY YOU ARE HERE", {
      x: 0.55,
      y: 0.45,
      w: 5,
      h: 0.35,
      fontSize: 12,
      color: COLORS.gold,
      bold: true,
      charSpacing: 3,
      margin: 0,
    });

    slide.addText("This Is Not a Diet.\nIt Is a Reclamation.", {
      x: 0.55,
      y: 0.95,
      w: 8.5,
      h: 1.3,
      fontSize: 34,
      fontFace: "Georgia",
      color: COLORS.white,
      bold: true,
      margin: 0,
    });

    const storyLines = [
      { text: "Kat's Legacy was born from love under impossible odds.", options: { bullet: true, breakLine: true } },
      {
        text: "You are not here to perform perfection — you are here to document honest transformation.",
        options: { bullet: true, breakLine: true },
      },
      {
        text: "Twenty guided sessions open the door. Your daily log writes the book.",
        options: { bullet: true, breakLine: true },
      },
      {
        text: "Expect a rollercoaster — frustration, breakthrough, doubt, clarity. All of it is data.",
        options: { bullet: true },
      },
    ];

    slide.addText(storyLines, {
      x: 0.55,
      y: 2.5,
      w: 5.8,
      h: 2.4,
      fontSize: 15,
      color: COLORS.text,
      valign: "top",
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.6,
      y: 2.35,
      w: 2.85,
      h: 2.55,
      fill: { color: COLORS.card },
      line: { color: COLORS.gold, width: 1.5 },
      rectRadius: 0.1,
    });
    slide.addText(
      [
        { text: "YOUR PROMISE\n", options: { bold: true, fontSize: 13, color: COLORS.gold, breakLine: true } },
        {
          text: "Show up for 10 minutes.\nLog the truth.\nTrust the protocol.\nCelebrate every victory.",
          options: { fontSize: 14, color: COLORS.text, italic: true },
        },
      ],
      { x: 6.75, y: 2.55, w: 2.55, h: 2.2, margin: 0 }
    );
  }

  // ── How it works + 42-day note ──
  {
    const slide = pres.addSlide();
    addDarkBackground(slide, pres);

    slide.addText("HOW THIS COHORT WORKS", {
      x: 0.55,
      y: 0.4,
      w: 6,
      h: 0.35,
      fontSize: 12,
      color: COLORS.gold,
      bold: true,
      charSpacing: 3,
      margin: 0,
    });

    const boxes = [
      { n: "20", label: "Cohort Sessions", sub: "10 min live · facilitator-led" },
      { n: "42", label: "Book Days Available", sub: "Optional deeper authoring journey" },
      { n: "1", label: "Participant ID", sub: "Links every log & book chapter" },
    ];

    boxes.forEach((box, i) => {
      const x = 0.55 + i * 3.15;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x,
        y: 1.0,
        w: 2.9,
        h: 2.2,
        fill: { color: COLORS.card },
        line: { color: COLORS.gold, width: 1 },
        rectRadius: 0.1,
      });
      slide.addText(box.n, {
        x,
        y: 1.15,
        w: 2.9,
        h: 0.9,
        fontSize: 44,
        fontFace: "Georgia",
        color: COLORS.gold,
        bold: true,
        align: "center",
        margin: 0,
      });
      slide.addText(box.label, {
        x,
        y: 2.05,
        w: 2.9,
        h: 0.4,
        fontSize: 14,
        color: COLORS.white,
        bold: true,
        align: "center",
        margin: 0,
      });
      slide.addText(box.sub, {
        x: x + 0.15,
        y: 2.5,
        w: 2.6,
        h: 0.55,
        fontSize: 11,
        color: COLORS.textDim,
        align: "center",
        margin: 0,
      });
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.55,
      y: 3.55,
      w: 8.9,
      h: 1.55,
      fill: { color: "1A1410" },
      line: { color: COLORS.goldDark, width: 1 },
      rectRadius: 0.08,
    });
    slide.addText(
      [
        { text: "About your Transformation Book: ", options: { bold: true, color: COLORS.gold } },
        {
          text: "These 20 sessions guide your cohort experience. Your Daily Transformation Log supports up to 42 days — continue journaling beyond Day 20 if you want a richer, longer book. REJU compiles your chapters at Day 42.",
          options: { color: COLORS.text },
        },
      ],
      { x: 0.75, y: 3.7, w: 8.5, h: 1.3, fontSize: 13, valign: "top" }
    );
  }

  // ── Journey map ──
  {
    const slide = pres.addSlide();
    addDarkBackground(slide, pres);

    slide.addText("YOUR 20-DAY JOURNEY", {
      x: 0.55,
      y: 0.35,
      w: 6,
      h: 0.35,
      fontSize: 12,
      color: COLORS.gold,
      bold: true,
      charSpacing: 3,
      margin: 0,
    });

    PHASES.forEach((phase, i) => {
      const y = 0.95 + i * 0.88;
      slide.addShape(pres.shapes.OVAL, {
        x: 0.55,
        y: y + 0.08,
        w: 0.35,
        h: 0.35,
        fill: { color: COLORS.gold },
        line: { color: COLORS.gold, width: 0 },
      });
      if (i < PHASES.length - 1) {
        slide.addShape(pres.shapes.LINE, {
          x: 0.72,
          y: y + 0.43,
          w: 0,
          h: 0.55,
          line: { color: COLORS.goldDark, width: 2 },
        });
      }
      slide.addText(phase.title, {
        x: 1.05,
        y,
        w: 8,
        h: 0.35,
        fontSize: 16,
        color: COLORS.white,
        bold: true,
        margin: 0,
      });
      slide.addText(phase.subtitle, {
        x: 1.05,
        y: y + 0.38,
        w: 8,
        h: 0.3,
        fontSize: 11,
        color: COLORS.textDim,
        margin: 0,
      });
    });
  }

  let lastPhaseStart = 0;

  for (const session of COHORT_DAILY_SESSIONS) {
    const phase = phaseForDay(session.day);

    if (session.day === phase.startDay && session.day !== lastPhaseStart) {
      lastPhaseStart = phase.startDay;
      const slide = pres.addSlide();
      addDarkBackground(slide, pres);
      addDecorativeOrbs(slide, pres);

      slide.addText(phase.title.toUpperCase(), {
        x: 0.55,
        y: 1.6,
        w: 8.9,
        h: 0.7,
        fontSize: 32,
        fontFace: "Georgia",
        color: COLORS.gold,
        bold: true,
        align: "center",
        margin: 0,
      });
      slide.addText(phase.subtitle, {
        x: 0.55,
        y: 2.45,
        w: 8.9,
        h: 0.5,
        fontSize: 16,
        color: COLORS.text,
        align: "center",
        margin: 0,
      });
      slide.addShape(pres.shapes.LINE, {
        x: 3.5,
        y: 3.2,
        w: 3,
        h: 0,
        line: { color: COLORS.gold, width: 2 },
      });
    }

    const slide = pres.addSlide();
    addDarkBackground(slide, pres);
    addDecorativeOrbs(slide, pres);

    slide.addShape(pres.shapes.OVAL, {
      x: 0.45,
      y: 0.35,
      w: 0.85,
      h: 0.85,
      fill: { color: COLORS.gold },
      line: { color: COLORS.gold, width: 0 },
    });
    slide.addText(String(session.day), {
      x: 0.45,
      y: 0.35,
      w: 0.85,
      h: 0.85,
      fontSize: 28,
      color: COLORS.bg,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });

    slide.addText(`DAY ${session.day}  ·  ${session.durationMinutes} MIN SESSION`, {
      x: 1.45,
      y: 0.42,
      w: 5,
      h: 0.3,
      fontSize: 10,
      color: COLORS.gold,
      bold: true,
      charSpacing: 2,
      margin: 0,
    });

    slide.addText(truncate(session.title, 70), {
      x: 1.45,
      y: 0.72,
      w: 8.2,
      h: 0.55,
      fontSize: 22,
      fontFace: "Georgia",
      color: COLORS.white,
      bold: true,
      margin: 0,
    });

    slide.addText(session.bookChapter, {
      x: 1.45,
      y: 1.25,
      w: 4,
      h: 0.25,
      fontSize: 9,
      color: COLORS.textDim,
      margin: 0,
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.55,
      y: 1.55,
      w: 8.9,
      h: 0.75,
      fill: { color: COLORS.card },
      line: { color: COLORS.goldDark, width: 1 },
      rectRadius: 0.06,
    });
    slide.addText(`"${EMOTIONAL_HOOKS[session.day] || session.meetingFocus}"`, {
      x: 0.7,
      y: 1.62,
      w: 8.6,
      h: 0.62,
      fontSize: 12,
      color: COLORS.gold,
      italic: true,
      valign: "middle",
      margin: 0,
    });

    const bullets = condensePoints(session.teachingPoints, 3).map((p) => ({
      text: p,
      options: { bullet: true, breakLine: true },
    }));
    if (bullets.length) {
      (bullets[bullets.length - 1].options as { breakLine?: boolean }).breakLine = false;
    }

    slide.addText(bullets, {
      x: 0.55,
      y: 2.45,
      w: 5.5,
      h: 2.0,
      fontSize: 12,
      color: COLORS.text,
      valign: "top",
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 6.25,
      y: 2.4,
      w: 3.2,
      h: 2.15,
      fill: { color: "1A1410" },
      line: { color: COLORS.gold, width: 1.5 },
      rectRadius: 0.08,
    });
    slide.addText("YOUR MOVE TODAY", {
      x: 6.4,
      y: 2.5,
      w: 2.9,
      h: 0.3,
      fontSize: 10,
      color: COLORS.gold,
      bold: true,
      charSpacing: 2,
      margin: 0,
    });

    const actions = session.participantActions.slice(0, 3).map((a, idx, arr) => ({
      text: truncate(a, 80),
      options: { bullet: { type: "number" as const }, breakLine: idx < arr.length - 1 },
    }));

    slide.addText(actions, {
      x: 6.35,
      y: 2.85,
      w: 2.95,
      h: 1.55,
      fontSize: 10,
      color: COLORS.text,
      valign: "top",
    });

    if (session.facilitatorNote) {
      slide.addText(truncate(session.facilitatorNote, 90), {
        x: 0.55,
        y: 4.75,
        w: 8.9,
        h: 0.35,
        fontSize: 9,
        color: COLORS.textDim,
        italic: true,
        margin: 0,
      });
    }
  }

  // ── Closing slide ──
  {
    const slide = pres.addSlide();
    addDarkBackground(slide, pres);
    addDecorativeOrbs(slide, pres);

    slide.addText("Day 20 Complete.\nThe Book Continues.", {
      x: 0.5,
      y: 1.2,
      w: 9,
      h: 1.5,
      fontSize: 36,
      fontFace: "Georgia",
      color: COLORS.white,
      bold: true,
      align: "center",
      margin: 0,
    });

    slide.addText(
      "Keep authoring through Day 42 for your fullest Transformation Book.\nContact REJU to compile your legacy.",
      {
        x: 1,
        y: 2.9,
        w: 8,
        h: 0.9,
        fontSize: 16,
        color: COLORS.text,
        align: "center",
        margin: 0,
      }
    );

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 2.5,
      y: 4.0,
      w: 5,
      h: 0.55,
      fill: { color: COLORS.gold },
      line: { color: COLORS.gold, width: 0 },
      rectRadius: 0.1,
    });
    slide.addText("Today's Victory — write it now.", {
      x: 2.5,
      y: 4.0,
      w: 5,
      h: 0.55,
      fontSize: 16,
      color: COLORS.bg,
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
  }

  await pres.writeFile({ fileName: outFile });
  console.log(`Created ${outFile}`);
  console.log(`Slides: ${pres.slides.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});