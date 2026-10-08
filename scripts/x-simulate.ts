/**
 * Simulate the X auto-post engine without touching X, Drive, or Vercel.
 *
 *   npx tsx scripts/x-simulate.ts [--days 21] [--out x_preview/sample_posts.md] [--csv path/to/posts.csv] [--live]
 *
 * - Checks every bank post, bridge, and card line against the quality gate
 * - Runs gate unit tests with real past mistakes (leaked drafts, truncated or stale headlines)
 * - Simulates N days per account (default 21) and verifies: no duplicates or near-duplicates,
 *   gate passes, link ratio about 1/3, pillar variety, card variants never repeat within 3 posts,
 *   "Follow @REJUvenationTKN" at most 2 per 7 days, no headline reused
 * - Runs 120-day stress runs (normal news and a full news outage) and counts missed days
 * - --live: also plans tomorrow's real posts from live crypto RSS (dry run, nothing is posted)
 * Writes a markdown report and x_preview/cards.json (card specs for scripts/x-render-previews.tsx).
 */

import fs from "fs";
import path from "path";
import type { ResearchNote } from "../lib/postResearch";
import type { XAutoLogEntry } from "../lib/xAutoLog";
import { planPost, pacificDateKey, headlineVerdict, scheduledPillar, type PlannedPost, type EngineAccount } from "../lib/xAutoEngine";
import { EVENT_BANK, TOKEN_BANK, TOKEN_BRIDGES, TAKES } from "../lib/xContentBank";
import { checkPost, hashText, headlineProblems, jaccard, weightedLength } from "../lib/xQualityGate";
import { CARD_LINE_MAX_CHARS } from "../lib/xCardVariants";

const DAY = 24 * 60 * 60 * 1000;
const args = process.argv.slice(2);
const arg = (name: string, fallback?: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : fallback;
};
const DAYS = Number(arg("days", "21"));
const OUT = arg("out", "x_preview/sample_posts.md")!;
const CSV = arg("csv");
const LIVE = args.includes("--live");
const START = new Date(arg("start", "2026-10-09T14:00:00Z")!);

type Check = { name: string; pass: boolean; detail: string };
const checks: Check[] = [];
const check = (name: string, pass: boolean, detail: string) => checks.push({ name, pass, detail });

// ---------------------------------------------------------------------------
// Seed history from the real posts (optional CSV from the reach study)
// ---------------------------------------------------------------------------

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

function seedHistory(): XAutoLogEntry[] {
  if (!CSV || !fs.existsSync(CSV)) return [];
  const rows = parseCsv(fs.readFileSync(CSV, "utf8"));
  return rows
    .filter((r) => r.kind === "post" && r.pt_time >= "2026-09-01")
    .map((r) => {
      const [d, t] = r.pt_time.replace(" PT", "").split(" ");
      const at = new Date(`${d}T${t}:00-07:00`).toISOString();
      const account: EngineAccount = r.acct === "REJUvenationTKN" ? "rejuvenation" : "crypto";
      return { account, text: r.text, textHash: hashText(r.text), tweetId: r.id, at, slot: "morning" } as XAutoLogEntry;
    })
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

// ---------------------------------------------------------------------------
// Fixture news (fictional headlines, clearly labeled in the report)
// ---------------------------------------------------------------------------

const GOOD_FIXTURES = [
  "BlackRock Bitcoin ETF Adds $420 Million in One Day of Inflows",
  "Stablecoin Supply Climbs to a Record as Payment Firms Expand Settlement",
  "SEC Approves New Listing Standards for Crypto Exchange-Traded Products",
  "Ethereum Validators Lock More ETH in Staking as Withdrawal Queue Shrinks",
  "Major Bank Pilots Tokenized Treasury Fund for Institutional Clients",
  "Bitcoin Holds Above $80K as Long-Term Holders Keep Accumulating",
  "Hardware Wallet Sales Jump After Exchange Security Incident",
  "Visa Expands Stablecoin Settlement to More Partner Banks",
  "Senate Committee Schedules Hearing on Digital Asset Market Structure",
  "Pension Fund Discloses First Allocation to a Spot Bitcoin ETF",
  "Real Estate Firm Tokenizes $50 Million Office Portfolio on Ethereum",
  "Crypto Payments App Reaches 10 Million Users Across Latin America",
  "Bitcoin Slides 4% as Traders Take Profits After Weekly Rally",
  "IRS Publishes Updated Guidance on Reporting Digital Asset Sales",
  "Self-Custody Wallet Downloads Hit a New High This Quarter",
  "Asset Manager Files for a Staked Ethereum ETF",
  "Ethereum Fees Fall to Multi-Year Low as Layer 2 Activity Grows",
  "Corporate Treasury Adds Bitcoin to Its Reserve Strategy",
];

const BAD_FIXTURES = [
  { title: "Top 10 Cryptocurrencies to Invest in February 2026", why: "stale month/year" },
  { title: "Bitcoin ETF inflows hit $3.", why: "truncated" },
  { title: "Clarity Act Heads to the Senate Floor This Week", why: "banned theme" },
  { title: "Analysts say bitcoin could fall to...", why: "ellipsis" },
  { title: "Memecoin Mania Returns as Traders Chase New Tokens", why: "off-voice topic" },
];

let newsDaySeen = 0;
const newsDayIndex = new Map<number, number>();
function fixtureNews(day: number, now: Date): ResearchNote[] {
  // 4th news day: feed outage. 6th news day: only unusable headlines. 8th: re-offers day 1's headline.
  if (!newsDayIndex.has(day) && scheduledPillar("crypto", now) === "news") newsDayIndex.set(day, ++newsDaySeen);
  const nth = newsDayIndex.get(day) ?? 0;
  if (nth === 4) return [];
  const notes: ResearchNote[] = [];
  const bad = nth === 6 ? BAD_FIXTURES : [BAD_FIXTURES[day % BAD_FIXTURES.length]];
  bad.forEach((b, i) =>
    notes.push({ id: `bad-${day}-${i}`, title: b.title, text: b.title, source: "fixture", publishedAt: new Date(now.getTime() - 3 * 3_600_000).toISOString() })
  );
  if (nth !== 6) {
    const picks = nth === 8 ? [GOOD_FIXTURES[0], GOOD_FIXTURES[2]] : [GOOD_FIXTURES[(day * 2) % GOOD_FIXTURES.length], GOOD_FIXTURES[(day * 2 + 1) % GOOD_FIXTURES.length]];
    picks.forEach((t, i) =>
      notes.push({ id: `good-${day}-${i}`, title: t, text: t, source: "fixture", url: "https://example.com/fixture", publishedAt: new Date(now.getTime() - (4 + i * 5) * 3_600_000).toISOString() })
    );
    // An old (48h) article that must be skipped for freshness.
    notes.push({ id: `old-${day}`, title: "Ethereum Foundation Announces New Research Grants Program", text: "x", source: "fixture", publishedAt: new Date(now.getTime() - 48 * 3_600_000).toISOString() });
  }
  return notes;
}

// ---------------------------------------------------------------------------
// Simulation
// ---------------------------------------------------------------------------

type SimRow = { day: number; date: string; account: EngineAccount; plan?: PlannedPost; skipped?: string; fixtureHeadline?: boolean };

function entryFrom(plan: PlannedPost, at: Date): XAutoLogEntry {
  return {
    account: plan.account,
    textHash: hashText(plan.text),
    text: plan.text,
    tweetId: `sim-${plan.account}-${at.getTime()}`,
    at: at.toISOString(),
    slot: "morning",
    pillar: plan.pillar,
    sourceId: plan.sourceId,
    bridgeId: plan.bridgeId,
    takeId: plan.takeId,
    headline: plan.headline,
    headlineKey: plan.headlineKey,
    linkUsed: plan.linkUsed,
    followCta: plan.followCta,
    cardVariant: plan.card.variant,
    hasMedia: true,
    usedFallback: plan.usedFallback,
  };
}

function simulate(days: number, seed: XAutoLogEntry[], newsFor: (day: number, now: Date) => ResearchNote[]) {
  const history = [...seed];
  const rows: SimRow[] = [];
  for (let day = 0; day < days; day += 1) {
    const now = new Date(START.getTime() + day * DAY);
    for (const account of ["rejuvenation", "crypto"] as EngineAccount[]) {
      const at = new Date(now.getTime() + (account === "crypto" ? 20_000 : 5_000));
      const plan = planPost({ account, now: at, history, news: account === "crypto" ? newsFor(day, now) : undefined, options: { enrollmentOpen: false } });
      if (plan.ok) {
        history.unshift(entryFrom(plan, at));
        rows.push({ day, date: pacificDateKey(at), account, plan, fixtureHeadline: Boolean(plan.headline) });
      } else {
        rows.push({ day, date: pacificDateKey(at), account, skipped: plan.reason });
      }
    }
  }
  return { rows, history };
}

function verify(rows: SimRow[], seed: XAutoLogEntry[], label: string) {
  for (const account of ["rejuvenation", "crypto"] as EngineAccount[]) {
    const mine = rows.filter((r) => r.account === account);
    const posts = mine.filter((r) => r.plan).map((r) => r.plan!);
    const handle = account === "crypto" ? "@REJUTOKEN" : "@REJUvenationTKN";
    check(`${label} ${handle}: posted every day`, posts.length === mine.length, `${posts.length}/${mine.length} days posted`);

    const all = [
      ...seed.filter((e) => e.account === account).map((e) => ({ text: e.text, at: Date.parse(e.at) })),
      ...mine.filter((r) => r.plan).map((r) => ({ text: r.plan!.text, at: Date.parse(`${r.date}T14:00:00Z`) })),
    ].sort((a, b) => a.at - b.at);
    let exact = 0;
    let near = 0;
    let maxSim = 0;
    let maxPair = "";
    const simPosts = new Set(posts.map((p) => p.text));
    for (let i = 0; i < all.length; i += 1) {
      for (let j = i + 1; j < all.length; j += 1) {
        if (!simPosts.has(all[j].text)) continue;
        const gap = (all[j].at - all[i].at) / DAY;
        if (gap <= 45 && hashText(all[i].text) === hashText(all[j].text)) exact += 1;
        if (gap <= 30) {
          const s = jaccard(all[i].text, all[j].text);
          if (s > maxSim) { maxSim = s; maxPair = `"${all[i].text.slice(0, 50)}" vs "${all[j].text.slice(0, 50)}"`; }
          if (s > 0.6) near += 1;
        }
      }
    }
    check(`${label} ${handle}: no exact duplicates in 45 days`, exact === 0, `${exact} exact duplicates`);
    check(`${label} ${handle}: no near-duplicates (>60% word overlap) in 30 days`, near === 0, `max overlap ${Math.round(maxSim * 100)}%${maxPair ? ` (${maxPair})` : ""}`);

    const gateOk = posts.every((p) => p.gate.ok && weightedLength(p.text) <= 280);
    check(`${label} ${handle}: every post passed the gate`, gateOk, `${posts.filter((p) => p.gate.ok).length}/${posts.length}`);

    const links = posts.filter((p) => p.linkUsed).length;
    const ratio = posts.length ? links / posts.length : 0;
    check(`${label} ${handle}: link on about 1 in 3 posts`, ratio >= 0.25 && ratio <= 0.4, `${links}/${posts.length} = ${(ratio * 100).toFixed(0)}%`);

    let variantRepeat = 0;
    posts.forEach((p, i) => {
      const prev = posts.slice(Math.max(0, i - 3), i).map((x) => x.card.variant);
      if (prev.includes(p.card.variant)) variantRepeat += 1;
    });
    check(`${label} ${handle}: card variant never repeats within 3 posts`, variantRepeat === 0, `${new Set(posts.map((p) => p.card.variant)).size} variants used, ${variantRepeat} repeats`);

    const pillars: Record<string, number> = {};
    posts.forEach((p) => { pillars[p.pillar] = (pillars[p.pillar] || 0) + 1; });
    check(`${label} ${handle}: pillar variety`, Object.keys(pillars).length >= 4, Object.entries(pillars).map(([k, v]) => `${k} ${v}`).join(", "));

    if (account === "crypto") {
      let maxFollow = 0;
      posts.forEach((_, i) => {
        const window = posts.slice(Math.max(0, i - 6), i + 1).filter((p) => p.followCta).length;
        maxFollow = Math.max(maxFollow, window);
      });
      check(`${label} ${handle}: "Follow @REJUvenationTKN" at most 2 per 7 days`, maxFollow <= 2, `max ${maxFollow} in any 7-day window, ${posts.filter((p) => p.followCta).length} total`);
      const heads = posts.filter((p) => p.headline).map((p) => p.headline!);
      check(`${label} ${handle}: no headline used twice`, new Set(heads).size === heads.length, `${heads.length} news posts, ${new Set(heads).size} distinct headlines`);
    }
  }
}

// ---------------------------------------------------------------------------
// Static checks
// ---------------------------------------------------------------------------

function staticChecks() {
  const now = START;
  const bankFails: string[] = [];
  for (const p of [...EVENT_BANK, ...TOKEN_BANK]) {
    const account = EVENT_BANK.includes(p as (typeof EVENT_BANK)[number]) ? "rejuvenation" : "crypto";
    const r = checkPost(p.text, { account, now, history: [] });
    if (!r.ok) bankFails.push(`${p.id}: ${r.reasons.join("; ")}`);
    const withLink = `${p.text}\n\nhttps://rejutkn.com/program`;
    if (weightedLength(withLink) > 280) bankFails.push(`${p.id}: too long once a link is added`);
    if (p.cardLine.length > CARD_LINE_MAX_CHARS || !checkPost(p.cardLine, { account, now, history: [] }).ok) bankFails.push(`${p.id}: card line`);
  }
  for (const b of TOKEN_BRIDGES) {
    const r = checkPost(b.text, { account: "crypto", now, history: [] });
    if (!r.ok) bankFails.push(`${b.id}: ${r.reasons.join("; ")}`);
  }
  for (const t of TAKES) {
    const r = checkPost(t.text, { account: "crypto", now, history: [] });
    if (!r.ok) bankFails.push(`${t.id}: ${r.reasons.join("; ")}`);
  }
  check("Bank: every post, bridge, take and card line passes the gate", bankFails.length === 0, bankFails.length ? bankFails.join(" | ") : `${EVENT_BANK.length} Event posts, ${TOKEN_BANK.length} token posts, ${TOKEN_BRIDGES.length} bridges, ${TAKES.length} takes`);

  let worst = { s: 0, a: "", b: "" };
  for (const bank of [EVENT_BANK, TOKEN_BANK]) {
    for (let i = 0; i < bank.length; i += 1) {
      for (let j = i + 1; j < bank.length; j += 1) {
        const s = jaccard(bank[i].text, bank[j].text);
        if (s > worst.s) worst = { s, a: bank[i].id, b: bank[j].id };
      }
    }
  }
  check("Bank: no two bank posts are near-duplicates of each other", worst.s <= 0.6, `closest pair ${worst.a} / ${worst.b} at ${Math.round(worst.s * 100)}%`);

  const eventAuto = EVENT_BANK.length;
  const tokenAuto = TOKEN_BANK.filter((p) => !p.requiresApproval).length;
  check("Bank sizes meet the spec", eventAuto >= 30 && TOKEN_BRIDGES.length >= 10 && tokenAuto >= 10, `Event ${eventAuto} (min 30), token bridges ${TOKEN_BRIDGES.length} (min 10), token non-news ${tokenAuto} auto + ${TOKEN_BANK.length - tokenAuto} founder drafts (min 10)`);

  const bad: Array<[string, string]> = [
    ["@web3dinn reply, ready to paste: love the energy", "leaked draft"],
    ["Full article: [Link to your blog", "bracket placeholder"],
    ["Shout out to @OpenUSD (or their official handle)", "drafting note"],
    ["In Rejunomics, this ties to transparent economics beyond the launch window.", "banned theme"],
    ["Update on the Clarity Act: the Senate has delayed the vote.", "banned theme"],
    ["The token is a door \u2014 lock $600 in REJU.", "em dash"],
    ["REJU is not a rug. Lock with confidence.", "negation for contrast"],
    ["TODO: write the REJU line", "TODO"],
    ["REJU launches soon.  Two spaces here.", "double space"],
    ["Enrollment is now open for the Rejuvenation Event.", "false enrollment claim"],
    ["Bitcoin rallies today. " + "REJU ".repeat(60), "over 280"],
    ["Big news for crypto\u2026 more soon", "ellipsis character"],
    ["Allocation Clarity and Token Intent explained.", "banned phrase"],
    ["Month seven is a person.", "banned phrase"],
    ["Fasting cures disease, says the book.", "medical claim"],
  ];
  const missed = bad.filter(([t]) => checkPost(t, { account: "crypto", now, history: [] }).ok);
  check("Gate rejects known bad copy", missed.length === 0, missed.length ? `missed: ${missed.map((m) => m[1]).join(", ")}` : `${bad.length}/${bad.length} rejected (leaked drafts, brackets, banned themes, dashes, negation, TODO, double space, enrollment claim, length, ellipsis, medical claim)`);

  const headlineCases: Array<[string, string | undefined, boolean]> = [
    ["Bitcoin ETF inflows hit $3.", new Date(now.getTime() - 3_600_000).toISOString(), false],
    ["Top 10 Cryptocurrencies to Invest in February 2026", new Date(now.getTime() - 3_600_000).toISOString(), false],
    ["Pension Fund Discloses First Allocation to a Spot Bitcoin ETF.", new Date(now.getTime() - 40 * 3_600_000).toISOString(), false],
    ["Pension Fund Discloses First Allocation to a Spot Bitcoin ETF.", new Date(now.getTime() - 5 * 3_600_000).toISOString(), true],
    ["Treasury and IRS Guidance Target Certain ETF Transactions and.", undefined, false],
  ];
  const wrong = headlineCases.filter(([h, at, ok]) => (headlineProblems(h, at, now).length === 0) !== ok);
  check("Gate: truncated, stale, and older-than-36h headlines are blocked", wrong.length === 0, wrong.length ? `wrong: ${wrong.map((w) => w[0]).join(" | ")}` : `${headlineCases.length}/${headlineCases.length} cases correct`);

  const spacingHistory: XAutoLogEntry[] = [{ account: "crypto", text: "x", textHash: "x", tweetId: "1", at: new Date(now.getTime() - 3 * 3_600_000).toISOString() }];
  const spaced = planPost({ account: "crypto", now, history: spacingHistory, news: [] });
  check("Gate: a second post within 6 hours is refused", !spaced.ok && /Already posted/.test(spaced.reason), spaced.ok ? "planner allowed it" : spaced.reason);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function quote(text: string) {
  return text.split("\n").map((l) => `> ${l || " "}`).join("\n");
}

async function liveSection(seed: XAutoLogEntry[]): Promise<string> {
  if (!LIVE) return "";
  const { fetchTokenNewsNotes } = await import("../lib/xAutoRunner");
  const notes = await fetchTokenNewsNotes();
  const now = new Date();
  const lines: string[] = [
    "## Live dry run (real headlines, nothing posted)",
    "",
    `Fetched ${notes.length} live crypto headlines at ${now.toISOString()} with the production query. History = real posts from the study CSV. Each headline gets the same verdict the engine uses.`,
    "",
    "| Headline | Published | Verdict |",
    "|---|---|---|",
  ];
  for (const n of notes.slice(0, 12)) {
    const v = headlineVerdict(n, now, seed.filter((e) => e.account === "crypto"));
    const title = (n.title || n.text).replace(/\|/g, "/");
    lines.push(`| ${title.slice(0, 110)} | ${n.publishedAt || "n/a"} | ${v.reason} |`);
  }
  lines.push("");
  for (const account of ["rejuvenation", "crypto"] as EngineAccount[]) {
    const plan = planPost({ account, now, history: seed, news: account === "crypto" ? notes : undefined, options: { enrollmentOpen: false } });
    const handle = account === "crypto" ? "@REJUTOKEN" : "@REJUvenationTKN";
    if (!plan.ok) { lines.push(`**${handle}:** skipped: ${plan.reason}`, ""); continue; }
    lines.push(`**${handle}** (${plan.pillar}, card \`${plan.card.variant}\`${plan.linkUsed ? ", link" : ""}${plan.usedFallback ? ", fallback" : ""})`, "", quote(plan.text), "", `Card line: "${plan.card.line}"`, "");
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    const livePath = path.join(path.dirname(OUT), "cards.json");
    const existing = fs.existsSync(livePath) ? JSON.parse(fs.readFileSync(livePath, "utf8")) : [];
    existing.push({ label: `live-${account}`, spec: plan.card, text: plan.text, live: true });
    fs.writeFileSync(livePath, JSON.stringify(existing, null, 2));
  }
  return lines.join("\n");
}

async function main() {
  const seed = seedHistory();
  staticChecks();

  const main21 = simulate(DAYS, seed, fixtureNews);
  verify(main21.rows, seed, `${DAYS}-day`);

  const long = simulate(120, seed, fixtureNews);
  const longMissed = long.rows.filter((r) => r.skipped).length;
  check("120-day run (fixture news): no missed days", longMissed === 0, `${longMissed} missed account-days of 240`);
  const outage = simulate(120, seed, () => []);
  const outageMissed = outage.rows.filter((r) => r.skipped).length;
  check("120-day run with zero news (feeds down): no missed days", outageMissed === 0, `${outageMissed} missed account-days of 240`);

  // Bank reuse spacing in the long run.
  let minGap = Infinity;
  for (const account of ["rejuvenation", "crypto"] as EngineAccount[]) {
    const seen = new Map<string, number>();
    long.rows.filter((r) => r.account === account && r.plan && r.plan.sourceId !== "news" && !r.plan.sourceId.startsWith("evergreen")).forEach((r) => {
      const prev = seen.get(r.plan!.sourceId);
      if (prev !== undefined) minGap = Math.min(minGap, r.day - prev);
      seen.set(r.plan!.sourceId, r.day);
    });
  }
  check("120-day run: a bank post never returns inside 45 days", minGap >= 45, `shortest gap between reuses: ${minGap === Infinity ? "no reuse" : `${minGap} days`}`);
  const evergreenUsed = outage.rows.filter((r) => r.plan?.pillar === "evergreen").length;
  let outageDup = 0;
  for (const account of ["rejuvenation", "crypto"] as EngineAccount[]) {
    const lastSeen = new Map<string, number>();
    outage.rows.filter((r) => r.account === account && r.plan).forEach((r) => {
      const h = hashText(r.plan!.text);
      const prev = lastSeen.get(h);
      if (prev !== undefined && r.day - prev <= 45) outageDup += 1;
      lastSeen.set(h, r.day);
    });
  }
  check("120-day zero-news run: no exact duplicate inside 45 days", outageDup === 0, `${outageDup} repeats; ${evergreenUsed} evergreen take + bridge posts filled the gap after the token bank ran dry`);

  const cards = main21.rows.filter((r) => r.plan).map((r) => ({ label: `${r.account}-day${r.day + 1}`, spec: r.plan!.card, text: r.plan!.text, day: r.day + 1, date: r.date, pillar: r.plan!.pillar }));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(path.join(path.dirname(OUT), "cards.json"), JSON.stringify(cards, null, 2));

  const failed = checks.filter((c) => !c.pass);
  const md: string[] = [
    "# REJU X auto-post engine: simulated posts",
    "",
    `Generated ${new Date().toISOString()} by \`scripts/x-simulate.ts\`. Simulated start ${START.toISOString()} (7 AM PT), ${DAYS} days per account. Nothing was posted.`,
    CSV ? `History seeded with the real Sep and Oct posts from \`${path.basename(CSV)}\`, so the dedupe also runs against what already went out.` : "",
    "",
    "News headlines in the simulation are **fictional fixtures** (labeled below) mixed with deliberately bad ones (stale, truncated, banned theme, ellipsis, 48h old) to exercise the filters. On the 4th news day the feeds are down, on the 6th every headline is unusable, and on the 8th the feed re-offers headlines already used, so the token account must fall back or skip them.",
    "",
    `## Checks: ${checks.length - failed.length}/${checks.length} pass`,
    "",
    "| Check | Result | Detail |",
    "|---|---|---|",
    ...checks.map((c) => `| ${c.name} | ${c.pass ? "PASS" : "**FAIL**"} | ${c.detail.replace(/\|/g, "/")} |`),
    "",
  ];
  for (const account of ["rejuvenation", "crypto"] as EngineAccount[]) {
    const handle = account === "crypto" ? "@REJUTOKEN" : "@REJUvenationTKN";
    md.push(`## ${handle}`, "");
    for (const r of main21.rows.filter((x) => x.account === account)) {
      if (!r.plan) { md.push(`### Day ${r.day + 1} (${r.date}): SKIPPED`, "", r.skipped || "", ""); continue; }
      const p = r.plan;
      const tags = [
        `pillar **${p.pillar}**`,
        `card \`${p.card.variant}\``,
        p.linkUsed ? "link" : "no link",
        p.followCta ? "follow line" : "",
        p.usedFallback ? "fallback (no usable headline)" : "",
        p.headline ? "headline = fixture (fictional)" : "",
        p.attempts.length ? `${p.attempts.length} candidate(s) rejected first` : "",
      ].filter(Boolean);
      md.push(`### Day ${r.day + 1} (${r.date}) · ${tags.join(" · ")}`, "", quote(p.text), "", `Card: _${p.card.kicker}_ / "${p.card.line}" · ${weightedLength(p.text)} chars`, "");
    }
  }
  md.push(await liveSection(seed));
  fs.writeFileSync(OUT, md.filter((l) => l !== undefined).join("\n"));

  console.log(`Wrote ${OUT}`);
  for (const c of checks) console.log(`${c.pass ? "PASS" : "FAIL"}  ${c.name}: ${c.detail}`);
  if (failed.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
