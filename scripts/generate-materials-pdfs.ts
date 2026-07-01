import { writeFileSync, readdirSync, existsSync } from "fs";
import { join, basename } from "path";
import { markdownFileToPdf } from "../lib/markdownToPdf";

const materialsDir = join(process.cwd(), "public", "materials");

const REQUIRED = [
  "20-day-cohort-daily-instructions.md",
  "four-week-reset-program.md",
  "kats-jol-recipe.md",
  "body-city-system.md",
  "chronic-illnesses-diet-healing.md",
  "book-authoring-guide.md",
];

async function main() {
  const mdFiles = readdirSync(materialsDir).filter((f) => f.endsWith(".md"));
  const targets = [...new Set([...REQUIRED, ...mdFiles])];

  for (const file of targets) {
    const input = join(materialsDir, file);
    if (!existsSync(input)) {
      console.warn(`Skip missing: ${file}`);
      continue;
    }
    const pdfName = file.replace(/\.md$/i, ".pdf");
    const output = join(materialsDir, pdfName);
    const bytes = await markdownFileToPdf(input);
    writeFileSync(output, bytes);
    console.log(`PDF: ${pdfName} (${bytes.length} bytes)`);
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});