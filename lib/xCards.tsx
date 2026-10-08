// Branded image cards for X posts, rendered with next/og (satori + resvg).
// Gold on dark, matching rejutkn.com (#f5c26b gold, #ffd88a light gold, #120904 / #0b0b0c dark,
// Geist type). 7 layouts per account. No photos of people, no third-party logos, no claims:
// the big line is always an approved short line from the post.

import crypto from "crypto";
import fs from "fs";
import path from "path";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { ImageResponse } from "next/og";
import { CARD_HEIGHT, CARD_WIDTH, type CardSpec } from "./xCardVariants";

export const BRAND = {
  gold: "#f5c26b",
  goldLight: "#ffd88a",
  goldDeep: "#d6a650",
  goldMuted: "#d6b96b",
  bronze: "#6f5320",
  ink: "#0b0b0c",
  brown: "#120904",
  brownWarm: "#2b1608",
  brownSoft: "#2b2119",
  cream: "#fbf1de",
  creamText: "#fff3dc",
  muted: "#bfae8f",
};

const HANDLES = { crypto: "@REJUTOKEN", rejuvenation: "@REJUvenationTKN" } as const;

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

type FontDef = { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: "normal" };
let fontCache: FontDef[] | null = null;
let markCache: string | null = null;

function assetPath(...parts: string[]) {
  return path.join(process.cwd(), "assets", ...parts);
}

export function loadCardFonts(): FontDef[] {
  if (fontCache) return fontCache;
  const read = (f: string) => fs.readFileSync(assetPath("fonts", f));
  fontCache = [
    { name: "Geist", data: read("Geist-Regular.ttf"), weight: 400, style: "normal" },
    { name: "Geist", data: read("Geist-SemiBold.ttf"), weight: 600, style: "normal" },
    { name: "Geist", data: read("Geist-Bold.ttf"), weight: 700, style: "normal" },
    { name: "Geist Mono", data: read("GeistMono-Medium.ttf"), weight: 500, style: "normal" },
  ];
  return fontCache;
}

function markDataUri(): string {
  if (markCache) return markCache;
  const buf = fs.readFileSync(assetPath("x-cards", "reju-mark.png"));
  markCache = `data:image/png;base64,${buf.toString("base64")}`;
  return markCache;
}

function svgUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

// ---------------------------------------------------------------------------
// Text fitting (never truncates: picks the largest size where every word fits)
// ---------------------------------------------------------------------------

function charWidth(ch: string): number {
  if (ch === " ") return 0.27;
  if (/[il.,:;'!|]/.test(ch)) return 0.27;
  if (/[fjrt()\-]/.test(ch)) return 0.38;
  if (/[mw]/.test(ch)) return 0.84;
  if (/[MW]/.test(ch)) return 0.92;
  if (/[A-Z]/.test(ch)) return 0.68;
  if (/[0-9$]/.test(ch)) return 0.6;
  if (/[a-z]/.test(ch)) return 0.56;
  return 0.6;
}

function textWidth(text: string, size: number, weight: number): number {
  const factor = weight >= 700 ? 1.04 : weight >= 600 ? 1.0 : 0.96;
  let w = 0;
  for (const ch of text) w += charWidth(ch);
  return w * size * factor;
}

function countLines(text: string, size: number, maxW: number, weight: number): number | null {
  const words = text.split(/\s+/).filter(Boolean);
  let lines = 1;
  let current = 0;
  const space = textWidth(" ", size, weight);
  for (const word of words) {
    const w = textWidth(word, size, weight);
    if (w > maxW) return null; // a word would have to break: size too large
    if (current === 0) current = w;
    else if (current + space + w <= maxW) current += space + w;
    else {
      lines += 1;
      current = w;
    }
  }
  return lines;
}

export function fitFontSize(
  text: string,
  box: { w: number; h: number },
  opts: { max: number; min: number; weight: number; lineHeight: number; maxLines?: number }
): number {
  const safeW = box.w * 0.92; // margin for estimation error
  for (let size = opts.max; size >= opts.min; size -= 2) {
    const lines = countLines(text, size, safeW, opts.weight);
    if (lines === null) continue;
    if (opts.maxLines && lines > opts.maxLines) continue;
    if (lines * size * opts.lineHeight <= box.h) return size;
  }
  return opts.min;
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

type Tone = "dark" | "light";

function Frame({ background, children }: { background: string; children: ReactNode }) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: "flex",
        position: "relative",
        background,
        fontFamily: "Geist",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function Layer({ style, children }: { style: CSSProperties; children?: ReactNode }) {
  return <div style={{ position: "absolute", display: "flex", ...style }}>{children}</div>;
}

function Footer({ account, tone, left = 96, right = 96, bottom = 56, handleTone }: {
  account: CardSpec["account"];
  tone: Tone;
  left?: number;
  right?: number;
  bottom?: number;
  handleTone?: Tone;
}) {
  const word = tone === "dark" ? BRAND.gold : BRAND.brown;
  const hTone = handleTone || tone;
  const handle = hTone === "dark" ? BRAND.muted : BRAND.bronze;
  return (
    <Layer style={{ left, right, bottom, alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri()} width={64} height={64} alt="" style={{ borderRadius: 32 }} />
        <div style={{ display: "flex", marginLeft: 18, fontSize: 38, fontWeight: 700, letterSpacing: 8, color: word }}>
          REJU
        </div>
      </div>
      <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 28, color: handle, letterSpacing: 1 }}>
        {HANDLES[account]}
      </div>
    </Layer>
  );
}

function Kicker({ text, color, align = "left", size = 28 }: { text: string; color: string; align?: "left" | "center"; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: "Geist Mono",
        fontSize: size,
        letterSpacing: 5,
        textTransform: "uppercase",
        color,
      }}
    >
      {text}
    </div>
  );
}

function MainLine({ text, box, color, weight = 700, align = "left", max = 104, min = 48, lineHeight = 1.12 }: {
  text: string;
  box: { w: number; h: number };
  color: string;
  weight?: 400 | 600 | 700;
  align?: "left" | "center";
  max?: number;
  min?: number;
  lineHeight?: number;
}) {
  const size = fitFontSize(text, box, { max, min, weight, lineHeight });
  return (
    <div
      style={{
        display: "flex",
        width: box.w,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        color,
        letterSpacing: size > 80 ? -1.5 : -0.5,
        textAlign: align,
        justifyContent: align === "center" ? "center" : "flex-start",
      }}
    >
      {text}
    </div>
  );
}

function TextBlock({ spec, x, y, w, h, color, kickerColor, align = "left", weight = 700, max, gap = 34 }: {
  spec: CardSpec;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  kickerColor: string;
  align?: "left" | "center";
  weight?: 400 | 600 | 700;
  max?: number;
  gap?: number;
}) {
  return (
    <Layer
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      <Kicker text={spec.kicker} color={kickerColor} align={align} />
      <div style={{ display: "flex", height: gap }} />
      <MainLine text={spec.line} box={{ w, h: h - gap - 40 }} color={color} align={align} weight={weight} max={max} />
    </Layer>
  );
}

// SVG patterns ---------------------------------------------------------------

function gridSvg(w: number, h: number, step: number, color: string) {
  let lines = "";
  for (let x = step; x < w; x += step) lines += `<line x1="${x}" y1="0" x2="${x}" y2="${h}" />`;
  for (let y = step; y < h; y += step) lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" />`;
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g stroke="${color}" stroke-width="1.5">${lines}</g></svg>`);
}

function raysSvg(w: number, h: number, cx: number, cy: number, count: number, color: string) {
  let wedges = "";
  const r = Math.hypot(w, h) * 1.2;
  for (let i = 0; i < count; i += 1) {
    if (i % 2) continue;
    const a1 = (Math.PI * 2 * i) / count;
    const a2 = (Math.PI * 2 * (i + 1)) / count;
    wedges += `<polygon points="${cx},${cy} ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} ${cx + r * Math.cos(a2)},${cy + r * Math.sin(a2)}" />`;
  }
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="${color}">${wedges}</g></svg>`);
}

function ruledSvg(w: number, h: number, step: number, color: string, marginX: number, marginColor: string) {
  let lines = "";
  for (let y = step * 2; y < h; y += step) lines += `<line x1="0" y1="${y}" x2="${w}" y2="${y}" />`;
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g stroke="${color}" stroke-width="2">${lines}</g><line x1="${marginX}" y1="0" x2="${marginX}" y2="${h}" stroke="${marginColor}" stroke-width="3"/><line x1="${marginX + 10}" y1="0" x2="${marginX + 10}" y2="${h}" stroke="${marginColor}" stroke-width="1.5"/></svg>`
  );
}

function diagonalSvg(w: number, h: number, step: number, color: string) {
  let lines = "";
  for (let x = -h; x < w; x += step) lines += `<line x1="${x}" y1="${h}" x2="${x + h}" y2="0" />`;
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g stroke="${color}" stroke-width="2">${lines}</g></svg>`);
}

function petalsSvg(size: number, petals: number, color: string, opacity: number) {
  const c = size / 2;
  let shapes = "";
  for (let i = 0; i < petals; i += 1) {
    const angle = (360 / petals) * i;
    shapes += `<ellipse cx="${c}" cy="${c - size * 0.3}" rx="${size * 0.07}" ry="${size * 0.17}" transform="rotate(${angle} ${c} ${c})" />`;
  }
  for (let i = 0; i < petals; i += 1) {
    const angle = (360 / petals) * i + 360 / petals / 2;
    shapes += `<ellipse cx="${c}" cy="${c - size * 0.24}" rx="${size * 0.05}" ry="${size * 0.13}" transform="rotate(${angle} ${c} ${c})" opacity="0.6" />`;
  }
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><g fill="${color}" opacity="${opacity}">${shapes}</g><circle cx="${c}" cy="${c}" r="${size * 0.13}" fill="none" stroke="${color}" stroke-width="6" opacity="${opacity * 1.6}"/></svg>`
  );
}

function Img({ src, x, y, w, h, opacity = 1 }: { src: string; x: number; y: number; w: number; h: number; opacity?: number }) {
  return (
    <Layer style={{ left: x, top: y, width: w, height: h, opacity }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={w} height={h} alt="" />
    </Layer>
  );
}

// ---------------------------------------------------------------------------
// @REJUTOKEN variants
// ---------------------------------------------------------------------------

function TokenHorizon({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`radial-gradient(ellipse at 50% 115%, rgba(245,194,107,0.30) 0%, rgba(18,9,4,0.6) 45%, ${BRAND.ink} 75%)`}>
      <Layer
        style={{
          left: -500,
          top: 610,
          width: 2600,
          height: 1500,
          borderRadius: 1300,
          border: `4px solid ${BRAND.goldLight}`,
          boxShadow: "0 0 90px 18px rgba(245,194,107,0.45)",
        }}
      />
      <TextBlock spec={spec} x={150} y={120} w={1300} h={470} color={BRAND.creamText} kickerColor={BRAND.gold} align="center" />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function TokenDoor({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`linear-gradient(135deg, ${BRAND.brown} 0%, ${BRAND.ink} 70%)`}>
      <Layer
        style={{
          left: 70,
          top: 640,
          width: 520,
          height: 180,
          borderRadius: 260,
          background: "radial-gradient(ellipse at 50% 0%, rgba(255,216,138,0.38) 0%, rgba(245,194,107,0) 70%)",
        }}
      />
      <Layer
        style={{
          left: 150,
          top: 110,
          width: 360,
          height: 560,
          borderTopLeftRadius: 180,
          borderTopRightRadius: 180,
          border: `6px solid ${BRAND.gold}`,
          background: "radial-gradient(ellipse at 50% 100%, rgba(255,216,138,0.75) 0%, rgba(245,194,107,0.22) 45%, rgba(18,9,4,0.2) 80%)",
          boxShadow: "0 0 60px 6px rgba(245,194,107,0.25)",
        }}
      />
      <Layer
        style={{
          left: 182,
          top: 142,
          width: 296,
          height: 528,
          borderTopLeftRadius: 148,
          borderTopRightRadius: 148,
          border: "2px solid rgba(255,216,138,0.45)",
        }}
      />
      <Layer style={{ left: 444, top: 410, width: 22, height: 22, borderRadius: 11, background: BRAND.goldLight }} />
      <TextBlock spec={spec} x={620} y={110} w={880} h={560} color={BRAND.creamText} kickerColor={BRAND.gold} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function TokenGrid({ spec }: { spec: CardSpec }) {
  const bracket = (style: CSSProperties) => (
    <Layer style={{ width: 70, height: 70, borderColor: BRAND.gold, borderStyle: "solid", borderWidth: 0, ...style }} />
  );
  return (
    <Frame background={`radial-gradient(circle at 88% 8%, rgba(245,194,107,0.22) 0%, ${BRAND.ink} 45%)`}>
      <Img src={gridSvg(CARD_WIDTH, CARD_HEIGHT, 80, "rgba(245,194,107,0.10)")} x={0} y={0} w={CARD_WIDTH} h={CARD_HEIGHT} />
      {bracket({ left: 60, top: 60, borderTopWidth: 5, borderLeftWidth: 5 })}
      {bracket({ right: 60, top: 60, borderTopWidth: 5, borderRightWidth: 5 })}
      {bracket({ left: 60, bottom: 150, borderBottomWidth: 5, borderLeftWidth: 5 })}
      {bracket({ right: 60, bottom: 150, borderBottomWidth: 5, borderRightWidth: 5 })}
      <TextBlock spec={spec} x={150} y={120} w={1300} h={540} color={BRAND.creamText} kickerColor={BRAND.gold} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function TokenLock({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`radial-gradient(circle at 80% 52%, ${BRAND.brownSoft} 0%, ${BRAND.ink} 55%)`}>
      <Layer
        style={{
          left: 1150,
          top: 150,
          width: 300,
          height: 360,
          borderRadius: 150,
          border: `34px solid ${BRAND.goldMuted}`,
        }}
      />
      <Layer
        style={{
          left: 1090,
          top: 360,
          width: 420,
          height: 340,
          borderRadius: 40,
          background: `linear-gradient(180deg, ${BRAND.goldLight} 0%, ${BRAND.gold} 55%, ${BRAND.goldDeep} 100%)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", width: 74, height: 74, borderRadius: 37, background: BRAND.brown }} />
        <div style={{ display: "flex", width: 30, height: 90, marginTop: -14, borderRadius: 8, background: BRAND.brown }} />
      </Layer>
      <TextBlock spec={spec} x={140} y={110} w={880} h={560} color={BRAND.creamText} kickerColor={BRAND.gold} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function TokenLedger({ spec }: { spec: CardSpec }) {
  const dots = [0, 1, 2, 3, 4, 5];
  return (
    <Frame background={`linear-gradient(180deg, ${BRAND.brown} 0%, ${BRAND.ink} 100%)`}>
      <Layer style={{ left: 110, top: 150, width: 10, height: 520, borderRadius: 5, background: `linear-gradient(180deg, ${BRAND.goldLight}, ${BRAND.goldDeep})` }} />
      <Layer style={{ right: 110, top: 90, alignItems: "center" }}>
        {dots.map((d) => (
          <div key={d} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 26,
                height: 26,
                borderRadius: 13,
                border: `3px solid ${BRAND.gold}`,
                background: d === 5 ? BRAND.gold : "transparent",
              }}
            />
            {d < 5 ? <div style={{ display: "flex", width: 34, height: 3, background: "rgba(245,194,107,0.55)" }} /> : null}
          </div>
        ))}
      </Layer>
      <TextBlock spec={spec} x={170} y={130} w={1290} h={540} color={BRAND.creamText} kickerColor={BRAND.gold} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function TokenGold({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`linear-gradient(135deg, ${BRAND.goldLight} 0%, ${BRAND.gold} 45%, ${BRAND.goldDeep} 100%)`}>
      <Img src={diagonalSvg(CARD_WIDTH, CARD_HEIGHT, 46, "rgba(18,9,4,0.06)")} x={0} y={0} w={CARD_WIDTH} h={CARD_HEIGHT} />
      <Layer style={{ right: -220, top: -220, width: 700, height: 700, borderRadius: 350, border: "3px solid rgba(18,9,4,0.25)" }} />
      <Layer style={{ right: -120, top: -120, width: 500, height: 500, borderRadius: 250, border: "3px solid rgba(18,9,4,0.18)" }} />
      <TextBlock spec={spec} x={140} y={120} w={1240} h={540} color={BRAND.brown} kickerColor={BRAND.bronze} />
      <Footer account={spec.account} tone="light" />
    </Frame>
  );
}

function TokenRays({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={BRAND.ink}>
      <Img src={raysSvg(CARD_WIDTH, CARD_HEIGHT, 1600, 900, 40, "rgba(245,194,107,0.07)")} x={0} y={0} w={CARD_WIDTH} h={CARD_HEIGHT} />
      <Layer
        style={{
          left: 1250,
          top: 550,
          width: 700,
          height: 700,
          borderRadius: 350,
          background: "radial-gradient(circle, rgba(255,216,138,0.85) 0%, rgba(245,194,107,0.35) 40%, rgba(245,194,107,0) 70%)",
        }}
      />
      <TextBlock spec={spec} x={130} y={110} w={1080} h={560} color={BRAND.creamText} kickerColor={BRAND.gold} />
      <Footer account={spec.account} tone="dark" handleTone="light" />
    </Frame>
  );
}

// ---------------------------------------------------------------------------
// @REJUvenationTKN variants
// ---------------------------------------------------------------------------

function EventPage({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`radial-gradient(ellipse at 50% 40%, ${BRAND.brownWarm} 0%, ${BRAND.brown} 70%)`}>
      <Layer
        style={{
          left: 110,
          top: 80,
          width: 1380,
          height: 650,
          borderRadius: 20,
          background: `linear-gradient(160deg, #fff7e8 0%, ${BRAND.cream} 60%, #f3e2c2 100%)`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
        }}
      />
      <Layer style={{ left: 170, top: 70, fontSize: 280, fontWeight: 700, color: BRAND.gold, lineHeight: 1 }}>{"\u201C"}</Layer>
      <TextBlock spec={spec} x={260} y={170} w={1140} h={500} color={BRAND.brownSoft} kickerColor={BRAND.bronze} weight={600} max={96} />
      <Footer account={spec.account} tone="dark" bottom={46} />
    </Frame>
  );
}

function EventSunrise({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`linear-gradient(180deg, #160b05 0%, ${BRAND.brownWarm} 62%, #3d1f0a 100%)`}>
      <Layer
        style={{
          left: 450,
          top: 560,
          width: 700,
          height: 700,
          borderRadius: 350,
          background: "radial-gradient(circle, rgba(255,216,138,0.95) 0%, rgba(245,194,107,0.55) 30%, rgba(245,194,107,0) 68%)",
        }}
      />
      <Layer style={{ left: 0, top: 742, width: CARD_WIDTH, height: 3, background: "rgba(255,216,138,0.55)" }} />
      <TextBlock spec={spec} x={150} y={100} w={1300} h={520} color={BRAND.creamText} kickerColor={BRAND.gold} align="center" weight={600} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function EventJournal({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`linear-gradient(180deg, #1a0d06 0%, ${BRAND.brown} 100%)`}>
      <Img src={ruledSvg(CARD_WIDTH, CARD_HEIGHT, 64, "rgba(245,194,107,0.10)", 200, "rgba(245,194,107,0.55)")} x={0} y={0} w={CARD_WIDTH} h={CARD_HEIGHT} />
      <TextBlock spec={spec} x={270} y={110} w={1200} h={560} color={BRAND.creamText} kickerColor={BRAND.gold} weight={600} />
      <Footer account={spec.account} tone="dark" left={270} />
    </Frame>
  );
}

function badgeParts(spec: CardSpec): { label: string; value: string } | null {
  const b = spec.badge?.trim();
  if (!b) return null;
  const day = b.match(/^D(\d+)$/i);
  if (day) return { label: "Day", value: day[1] };
  const week = b.match(/^W(\d+)$/i);
  if (week) return { label: "Week", value: week[1] };
  if (/^\d+$/.test(b)) return { label: /page/i.test(spec.kicker) ? "Page" : "Chapter", value: b };
  return { label: "Kat's", value: b };
}

function EventChapter({ spec }: { spec: CardSpec }) {
  const badge = badgeParts(spec);
  const valueSize = badge ? (badge.value.length >= 3 ? 150 : badge.value.length === 2 ? 220 : 280) : 0;
  return (
    <Frame background={`linear-gradient(120deg, ${BRAND.brownWarm} 0%, ${BRAND.brown} 55%)`}>
      <Layer style={{ left: 100, top: 120, width: 380, height: 560, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {badge ? (
          <>
            <Kicker text={badge.label} color={BRAND.goldMuted} align="center" size={34} />
            <div style={{ display: "flex", fontSize: valueSize, fontWeight: 700, color: BRAND.gold, lineHeight: 1, letterSpacing: -6, marginTop: 10 }}>
              {badge.value}
            </div>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={markDataUri()} width={240} height={240} alt="" style={{ borderRadius: 120 }} />
        )}
      </Layer>
      <Layer style={{ left: 520, top: 150, width: 4, height: 500, background: `linear-gradient(180deg, rgba(245,194,107,0), ${BRAND.gold}, rgba(245,194,107,0))` }} />
      <TextBlock spec={spec} x={590} y={110} w={900} h={560} color={BRAND.creamText} kickerColor={BRAND.gold} weight={600} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function EventWeeks({ spec }: { spec: CardSpec }) {
  const steps = ["Prep", "1", "2", "3", "4", "Celebrate"];
  return (
    <Frame background={`radial-gradient(ellipse at 50% 0%, ${BRAND.brownWarm} 0%, ${BRAND.brown} 70%)`}>
      <TextBlock spec={spec} x={150} y={80} w={1300} h={440} color={BRAND.creamText} kickerColor={BRAND.gold} align="center" weight={600} max={96} />
      <Layer style={{ left: 260, top: 598, width: 1080, height: 4, background: "rgba(245,194,107,0.45)" }} />
      <Layer style={{ left: 200, top: 570, width: 1200, justifyContent: "space-between" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
            <div
              style={{
                display: "flex",
                width: 60,
                height: 60,
                borderRadius: 30,
                border: `4px solid ${BRAND.gold}`,
                background: i === 0 || i === 5 ? BRAND.gold : BRAND.brown,
              }}
            />
            <div style={{ display: "flex", marginTop: 14, fontFamily: "Geist Mono", fontSize: 24, color: BRAND.goldMuted, letterSpacing: 2, textTransform: "uppercase" }}>
              {i >= 1 && i <= 4 ? `Week ${s}` : s}
            </div>
          </div>
        ))}
      </Layer>
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function EventPetals({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`radial-gradient(circle at 86% 50%, ${BRAND.brownWarm} 0%, ${BRAND.brown} 50%)`}>
      <Img src={petalsSvg(820, 24, BRAND.gold, 0.22)} x={1000} y={40} w={820} h={820} />
      <TextBlock spec={spec} x={130} y={110} w={1000} h={560} color={BRAND.creamText} kickerColor={BRAND.gold} weight={600} />
      <Footer account={spec.account} tone="dark" />
    </Frame>
  );
}

function EventCream({ spec }: { spec: CardSpec }) {
  return (
    <Frame background={`linear-gradient(180deg, #fff7e8 0%, ${BRAND.cream} 100%)`}>
      <Layer style={{ left: 0, top: 0, width: CARD_WIDTH, height: 18, background: `linear-gradient(90deg, ${BRAND.goldDeep}, ${BRAND.goldLight}, ${BRAND.goldDeep})` }} />
      <Layer style={{ right: -260, bottom: -320, width: 820, height: 820, borderRadius: 410, border: `3px solid rgba(214,166,80,0.55)` }} />
      <Layer style={{ right: -160, bottom: -220, width: 620, height: 620, borderRadius: 310, border: `3px solid rgba(214,166,80,0.35)` }} />
      <TextBlock spec={spec} x={140} y={110} w={1200} h={560} color={BRAND.brownSoft} kickerColor={BRAND.bronze} />
      <Footer account={spec.account} tone="light" />
    </Frame>
  );
}

const RENDERERS: Record<string, (props: { spec: CardSpec }) => ReactElement> = {
  horizon: TokenHorizon,
  door: TokenDoor,
  grid: TokenGrid,
  lock: TokenLock,
  ledger: TokenLedger,
  gold: TokenGold,
  rays: TokenRays,
  page: EventPage,
  sunrise: EventSunrise,
  journal: EventJournal,
  chapter: EventChapter,
  weeks: EventWeeks,
  petals: EventPetals,
  cream: EventCream,
};

export function buildCardElement(spec: CardSpec): ReactElement {
  const Renderer = RENDERERS[spec.variant] || (spec.account === "rejuvenation" ? EventSunrise : TokenHorizon);
  return <Renderer spec={spec} />;
}

export function cardImageResponse(spec: CardSpec): ImageResponse {
  return new ImageResponse(buildCardElement(spec), {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    fonts: loadCardFonts(),
  });
}

/** Render a card to PNG bytes (used by the auto route before media upload). */
export async function renderCardPng(spec: CardSpec): Promise<Buffer> {
  const res = cardImageResponse(spec);
  return Buffer.from(await res.arrayBuffer());
}

// ---------------------------------------------------------------------------
// Profile assets (same visual system): 1500x500 headers and pinned-post images
// ---------------------------------------------------------------------------

export const BANNER_WIDTH = 1500;
export const BANNER_HEIGHT = 500;

export function buildBannerElement(account: CardSpec["account"]): ReactElement {
  if (account === "crypto") {
    return (
      <div style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT, display: "flex", position: "relative", overflow: "hidden", fontFamily: "Geist", background: `radial-gradient(ellipse at 50% 140%, rgba(245,194,107,0.35) 0%, ${BRAND.ink} 65%)` }}>
        <Layer style={{ left: -400, top: 330, width: 2300, height: 1100, borderRadius: 1150, border: `4px solid ${BRAND.goldLight}`, boxShadow: "0 0 80px 16px rgba(245,194,107,0.45)" }} />
        <Layer style={{ left: 1160, top: 70, width: 190, height: 300, borderTopLeftRadius: 95, borderTopRightRadius: 95, border: `5px solid ${BRAND.gold}`, background: "radial-gradient(ellipse at 50% 100%, rgba(255,216,138,0.75) 0%, rgba(245,194,107,0.2) 50%, rgba(18,9,4,0.1) 85%)" }} />
        <Layer style={{ left: 1310, top: 220, width: 14, height: 14, borderRadius: 7, background: BRAND.goldLight }} />
        <Layer style={{ left: 430, top: 120, width: 680, flexDirection: "column", alignItems: "flex-end" }}>
          <Kicker text="REJU · Launching soon" color={BRAND.gold} size={24} />
          <div style={{ display: "flex", marginTop: 18, fontSize: 64, fontWeight: 700, color: BRAND.creamText, letterSpacing: -1.5, textAlign: "right", lineHeight: 1.05 }}>
            The door to rejuvenation.
          </div>
        </Layer>
      </div>
    );
  }
  return (
    <div style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT, display: "flex", position: "relative", overflow: "hidden", fontFamily: "Geist", background: `linear-gradient(180deg, #160b05 0%, ${BRAND.brownWarm} 70%, #3d1f0a 100%)` }}>
      <Layer style={{ left: 450, top: 300, width: 600, height: 600, borderRadius: 300, background: "radial-gradient(circle, rgba(255,216,138,0.95) 0%, rgba(245,194,107,0.5) 30%, rgba(245,194,107,0) 68%)" }} />
      <Layer style={{ left: 0, top: 430, width: BANNER_WIDTH, height: 3, background: "rgba(255,216,138,0.55)" }} />
      <Img src={petalsSvg(560, 24, BRAND.gold, 0.16)} x={1080} y={-40} w={560} h={560} />
      <Layer style={{ left: 300, top: 90, width: 900, flexDirection: "column", alignItems: "center" }}>
        <Kicker text="The Rejuvenation Event" color={BRAND.gold} align="center" size={24} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 18, fontSize: 66, fontWeight: 600, color: BRAND.creamText, letterSpacing: -1.5, lineHeight: 1.08 }}>
          <div style={{ display: "flex" }}>Renew. Document.</div>
          <div style={{ display: "flex" }}>Author your book.</div>
        </div>
      </Layer>
    </div>
  );
}

function FlowBox({ title, body, highlight }: { title: string; body: string; highlight?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 540,
        padding: "22px 30px",
        borderRadius: 22,
        border: `3px solid ${highlight ? BRAND.gold : "rgba(245,194,107,0.45)"}`,
        background: highlight ? "rgba(245,194,107,0.12)" : "rgba(255,255,255,0.03)",
      }}
    >
      <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 26, letterSpacing: 4, color: BRAND.gold, textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "flex", marginTop: 8, fontSize: 31, fontWeight: 600, color: BRAND.creamText, lineHeight: 1.2 }}>{body}</div>
    </div>
  );
}

const ARROW_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="84" height="28" viewBox="0 0 84 28"><line x1="2" y1="14" x2="66" y2="14" stroke="${BRAND.gold}" stroke-width="4" stroke-linecap="round"/><polygon points="62,3 82,14 62,25" fill="${BRAND.gold}"/></svg>`
)}`;

function Arrow() {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "0 22px" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={ARROW_SVG} width={84} height={28} alt="" />
    </div>
  );
}

export function buildPinnedElement(account: CardSpec["account"]): ReactElement {
  if (account === "crypto") {
    return (
      <Frame background={`radial-gradient(ellipse at 50% 120%, rgba(245,194,107,0.28) 0%, ${BRAND.ink} 65%)`}>
        <Layer style={{ left: 100, top: 80, width: 1400, flexDirection: "column" }}>
          <Kicker text="REJU in one minute" color={BRAND.gold} />
          <div style={{ display: "flex", marginTop: 18, fontSize: 66, fontWeight: 700, color: BRAND.creamText, letterSpacing: -1.5, lineHeight: 1.08 }}>
            A long-term token with a real program attached.
          </div>
        </Layer>
        <Layer style={{ left: 100, top: 345, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FlowBox title="Path A" body="Pay $600." />
            <div style={{ display: "flex", height: 22 }} />
            <FlowBox title="Path B" body="Lock $600 in REJU for 6 months. Keep your keys." highlight />
          </div>
          <Arrow />
          <div style={{ display: "flex", flexDirection: "column", width: 290, alignItems: "center", textAlign: "center" }}>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 24, letterSpacing: 3, color: BRAND.gold, textTransform: "uppercase" }}>6 weeks</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 42, fontWeight: 700, color: BRAND.creamText, lineHeight: 1.1, textAlign: "center" }}>Rejuvenation Event</div>
          </div>
          <Arrow />
          <div style={{ display: "flex", flexDirection: "column", width: 330, alignItems: "center" }}>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 24, letterSpacing: 3, color: BRAND.gold, textTransform: "uppercase" }}>You author</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 42, fontWeight: 700, color: BRAND.creamText, lineHeight: 1.1, textAlign: "center" }}>Transformation Book</div>
          </div>
        </Layer>
        <Layer style={{ left: 100, top: 715, fontSize: 30, color: BRAND.muted }}>
          {"Both paths include Kat's Legacy ($69). Enrollment is getting ready."}
        </Layer>
        <Footer account="crypto" tone="dark" bottom={48} />
      </Frame>
    );
  }
  const steps: Array<[string, string]> = [
    ["Renew", "Set your Day 1 benchmark and follow the protocol."],
    ["Document", "One photo and one journal page, every day."],
    ["Author", "Leave with a Transformation Book you wrote."],
  ];
  return (
    <Frame background={`linear-gradient(160deg, ${BRAND.brownWarm} 0%, ${BRAND.brown} 60%)`}>
      <Img src={petalsSvg(760, 24, BRAND.gold, 0.14)} x={1060} y={-120} w={760} h={760} />
      <Layer style={{ left: 100, top: 80, width: 1150, flexDirection: "column" }}>
        <Kicker text="The Rejuvenation Event · Built on Kat's Legacy" color={BRAND.gold} />
        <div style={{ display: "flex", marginTop: 18, fontSize: 70, fontWeight: 600, color: BRAND.creamText, letterSpacing: -1.5, lineHeight: 1.08 }}>
          Six guided weeks. One book with your name on it.
        </div>
      </Layer>
      <Layer style={{ left: 100, top: 380, width: 1400, justifyContent: "space-between" }}>
        {steps.map(([t, b], i) => (
          <div key={t} style={{ display: "flex", flexDirection: "column", width: 430, padding: "28px 30px", borderRadius: 22, border: `3px solid ${i === 2 ? BRAND.gold : "rgba(245,194,107,0.45)"}`, background: i === 2 ? "rgba(245,194,107,0.12)" : "rgba(255,255,255,0.03)" }}>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 26, letterSpacing: 4, color: BRAND.gold, textTransform: "uppercase" }}>{`0${i + 1} · ${t}`}</div>
            <div style={{ display: "flex", marginTop: 12, fontSize: 36, fontWeight: 600, color: BRAND.creamText, lineHeight: 1.2 }}>{b}</div>
          </div>
        ))}
      </Layer>
      <Layer style={{ left: 100, top: 680, fontSize: 28, color: BRAND.muted }}>
        Enrollment is getting ready. Follow for the day it opens.
      </Layer>
      <Footer account="rejuvenation" tone="dark" bottom={48} />
    </Frame>
  );
}

/** HMAC for custom card text on /api/x-card, so the route cannot stamp REJU branding on any text. */
export function signCardParams(parts: string[]): string {
  const secret = process.env.CRON_SECRET || "";
  return crypto.createHmac("sha256", secret).update(parts.join("|")).digest("hex").slice(0, 32);
}
