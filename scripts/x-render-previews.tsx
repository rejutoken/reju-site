/**
 * Render X card previews to PNG files. Nothing is posted.
 *
 *   npx tsx scripts/x-render-previews.tsx [--cards x_preview/cards.json] [--out x_preview]
 *
 * Reads the card specs written by scripts/x-simulate.ts, renders one card per
 * distinct variant per account, a contact sheet, and the profile assets
 * (two 1500x500 headers and two pinned-post images).
 */
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import React, { type ReactElement } from "react";
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  BRAND,
  buildBannerElement,
  buildPinnedElement,
  loadCardFonts,
  renderCardPng,
} from "../lib/xCards";
import { CARD_HEIGHT, CARD_WIDTH, variantsFor, type CardSpec } from "../lib/xCardVariants";

type CardSample = { label: string; spec: CardSpec; text: string; day?: number; date?: string; pillar?: string };

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

void React; // classic JSX runtime under tsx

async function renderElement(el: ReactElement, width: number, height: number): Promise<Buffer> {
  const res = new ImageResponse(el, { width, height, fonts: loadCardFonts() });
  return Buffer.from(await res.arrayBuffer());
}

function pickSamples(all: CardSample[], account: CardSpec["account"], max: number): CardSample[] {
  const seen = new Set<string>();
  const out: CardSample[] = [];
  for (const s of all) {
    if (s.spec.account !== account || seen.has(s.spec.variant)) continue;
    seen.add(s.spec.variant);
    out.push(s);
    if (out.length >= max) break;
  }
  // Show every variant: reuse an unused sample line for any variant the run never picked.
  for (const variant of variantsFor(account)) {
    if (out.length >= max || seen.has(variant)) continue;
    const donor = all.find((s) => s.spec.account === account && !out.includes(s));
    if (!donor) break;
    seen.add(variant);
    out.push({ ...donor, label: `${donor.label}-as-${variant}`, spec: { ...donor.spec, variant } });
  }
  return out;
}

async function main() {
  const outDir = path.resolve(arg("--out", "/workspace/x_preview"));
  const cardsPath = path.resolve(arg("--cards", path.join(outDir, "cards.json")));
  const all = JSON.parse(fs.readFileSync(cardsPath, "utf8")) as CardSample[];
  fs.mkdirSync(path.join(outDir, "profile"), { recursive: true });

  const rendered: { file: string; sample: CardSample; png: Buffer }[] = [];
  for (const account of ["crypto", "rejuvenation"] as const) {
    const samples = pickSamples(all, account, 7);
    if (samples.length < 4) throw new Error(`Only ${samples.length} distinct ${account} variants in ${cardsPath}`);
    for (const [i, sample] of samples.entries()) {
      const prefix = account === "crypto" ? "token" : "event";
      const file = `card_${prefix}_${String(i + 1).padStart(2, "0")}_${sample.spec.variant}.png`;
      const png = await renderCardPng(sample.spec);
      fs.writeFileSync(path.join(outDir, file), png);
      rendered.push({ file, sample, png });
      console.log(`${file}  ${png.length} bytes  "${sample.spec.line}"`);
    }
  }

  // Contact sheet: every rendered card, labelled.
  const cols = 4;
  const thumbW = 560;
  const thumbH = Math.round((thumbW * CARD_HEIGHT) / CARD_WIDTH);
  const pad = 36;
  const labelH = 44;
  const rows = Math.ceil(rendered.length / cols);
  const sheetW = cols * thumbW + (cols + 1) * pad;
  const headerH = 120;
  const sheetH = headerH + rows * (thumbH + labelH + pad) + pad;
  const sheet = (
    <div style={{ display: "flex", flexDirection: "column", width: sheetW, height: sheetH, background: "#151517", fontFamily: "Geist", padding: pad }}>
      <div style={{ display: "flex", flexDirection: "column", height: headerH - pad }}>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: BRAND.gold }}>REJU X image cards: preview</div>
        <div style={{ display: "flex", fontSize: 22, color: "#bdb6a8", marginTop: 8 }}>
          1600x900, rendered by the auto-poster. @REJUTOKEN cards: token_*. @REJUvenationTKN cards: event_*. Nothing here has been posted.
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", width: sheetW - 2 * pad }}>
        {rendered.map((r, i) => (
          <div
            key={r.file}
            style={{
              display: "flex",
              flexDirection: "column",
              width: thumbW,
              marginRight: i % cols === cols - 1 ? 0 : pad,
              marginBottom: pad,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/png;base64,${r.png.toString("base64")}`} width={thumbW} height={thumbH} alt="" style={{ borderRadius: 10 }} />
            <div style={{ display: "flex", height: labelH, alignItems: "center", fontSize: 20, color: "#d8d2c4" }}>
              {r.file.replace(/^card_/, "").replace(/\.png$/, "")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const sheetPng = await renderElement(sheet, sheetW, sheetH);
  fs.writeFileSync(path.join(outDir, "contact_sheet.png"), sheetPng);
  console.log(`contact_sheet.png  ${sheetW}x${sheetH}`);

  // Profile assets.
  const profile: [string, ReactElement, number, number][] = [
    ["header_REJUTOKEN_1500x500.png", buildBannerElement("crypto"), BANNER_WIDTH, BANNER_HEIGHT],
    ["header_REJUvenationTKN_1500x500.png", buildBannerElement("rejuvenation"), BANNER_WIDTH, BANNER_HEIGHT],
    ["pinned_REJUTOKEN_1600x900.png", buildPinnedElement("crypto"), CARD_WIDTH, CARD_HEIGHT],
    ["pinned_REJUvenationTKN_1600x900.png", buildPinnedElement("rejuvenation"), CARD_WIDTH, CARD_HEIGHT],
  ];
  for (const [file, el, w, h] of profile) {
    const png = await renderElement(el, w, h);
    fs.writeFileSync(path.join(outDir, "profile", file), png);
    console.log(`profile/${file}  ${png.length} bytes`);
  }

  const index = [
    "# Card preview index",
    "",
    "| File | Account | Variant | Card line | Post text |",
    "|---|---|---|---|---|",
    ...rendered.map(
      (r) =>
        `| ${r.file} | ${r.sample.spec.account === "crypto" ? "@REJUTOKEN" : "@REJUvenationTKN"} | ${r.sample.spec.variant} | ${r.sample.spec.line} | ${r.sample.text.replace(/\n+/g, " / ").replace(/\|/g, "/")} |`
    ),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "cards_index.md"), index);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
