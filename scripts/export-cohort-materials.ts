import { mkdirSync, writeFileSync } from "fs";
import { allSessionsToMarkdown } from "../lib/cohortDailySessions";

const outDir = "public/materials";
mkdirSync(outDir, { recursive: true });

const path = `${outDir}/20-day-cohort-daily-instructions.md`;
writeFileSync(path, allSessionsToMarkdown(), "utf-8");
console.log(`Wrote ${path}`);