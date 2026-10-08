// Approved content bank for the two X accounts.
//
// Style rules for everything in this file (Wilson, Oct 2026):
//  - direct, positive statements; no negation-for-contrast lines
//  - commas instead of em or en dashes
//  - no new medical claims; book facts cite Kat's Legacy
//  - prices and terms exactly as on the site: $600 / 6-month lock / Kat's Legacy ($69)
//  - enrollment is NOT open yet: say "getting ready" / "follow for the day enrollment opens"
//  - readers know nothing about REJU, so every post explains itself
//
// Each post carries a short `cardLine` for the image card (never the full post) and a `cardKicker`.
// Links are appended by the engine on a 1-in-3 rotation, so bank texts carry no URLs.

export type EventPillar = "fact" | "story" | "day" | "practice" | "question" | "status";
export type TokenPillar = "news" | "build" | "path_b" | "question" | "founder" | "event_quote";

export type BankPost<P extends string = string> = {
  id: string;
  pillar: P;
  text: string;
  cardLine: string;
  cardKicker: string;
  /** Big badge for the "chapter" card variant, e.g. a chapter number. */
  cardBadge?: string;
  /** False for posts where a link reads oddly (questions). Default true. */
  linkOk?: boolean;
  /** Founder-voice drafts: never auto-posted until Wilson approves (X_FOUNDER_NOTES_APPROVED=1). */
  requiresApproval?: boolean;
};

export const EVENT_LINK = "https://rejutkn.com/program";
export const TOKEN_LINK = "https://rejutkn.com";
export const EVENT_HANDLE = "@REJUvenationTKN";
export const TOKEN_FOLLOW_LINE = `Follow ${EVENT_HANDLE} for the Event.`;

/** Daily pillar rotation (study section 5d). Index = day number mod 7, Pacific date. */
export const EVENT_ROTATION: EventPillar[] = ["fact", "story", "fact", "day", "practice", "question", "status"];
/**
 * Token: 2 news + build + Path B + question + founder + Event quote per week.
 * The founder slot posts the news hook until Wilson approves founder notes.
 */
export const TOKEN_ROTATION: TokenPillar[] = ["news", "path_b", "news", "question", "build", "founder", "event_quote"];

// ---------------------------------------------------------------------------
// @REJUvenationTKN (Event side, health seekers 40 to 65)
// ---------------------------------------------------------------------------

export const EVENT_BANK: BankPost<EventPillar>[] = [
  // Kat's Legacy fact cards (approved excerpts, chapter cited)
  {
    id: "ev-fact-soda",
    pillar: "fact",
    text: "A 12-oz soda holds about 39g of sugar. One a day adds up to roughly 51,100 extra calories a year, about 14.6 lbs if you do not burn them off. Kat's Legacy, Chapter 5, pages 28-29.",
    cardLine: "One soda a day: about 51,100 extra calories a year.",
    cardKicker: "Kat's Legacy · Chapter 5",
    cardBadge: "5",
  },
  {
    id: "ev-fact-lymph-pump",
    pillar: "fact",
    text: "The lymphatic system has no pump of its own. Lymph moves when you move: walking, muscle contractions, and deep breathing. That is why Kat's Legacy starts the healing path with Chapter 1.",
    cardLine: "The lymphatic system has no pump. It moves when you move.",
    cardKicker: "Kat's Legacy · Chapter 1",
    cardBadge: "1",
  },
  {
    id: "ev-fact-lymph-city",
    pillar: "fact",
    text: "Picture your body as a city. In Chapter 1 of Kat's Legacy, lymph nodes are the processing plants, lymph vessels are the truck routes, and movement keeps the traffic flowing.",
    cardLine: "Your body as a city: movement keeps the traffic flowing.",
    cardKicker: "Kat's Legacy · Chapter 1",
    cardBadge: "1",
  },
  {
    id: "ev-fact-water",
    pillar: "fact",
    text: "A simple hydration guide from Kat's Legacy: your weight in kilograms divided by 30 gives liters of water per day. At 75 kg, that comes to 2.5 liters. Pages 74-76.",
    cardLine: "Weight in kg ÷ 30 = liters of water a day.",
    cardKicker: "Kat's Legacy · Pages 74-76",
    cardBadge: "74",
  },
  {
    id: "ev-fact-ketosis",
    pillar: "fact",
    text: "What is ketosis? When carbs drop to about 20-50g a day, the liver turns stored fat into ketones: BHB, acetoacetate, and acetone. Kat's Legacy, Chapter 8, pages 46-47.",
    cardLine: "Ketosis: the liver turns stored fat into ketones.",
    cardKicker: "Kat's Legacy · Chapter 8",
    cardBadge: "8",
  },
  {
    id: "ev-fact-autophagy",
    pillar: "fact",
    text: "Autophagy is the body's recycling system: cells break down worn-out parts and reuse them. Kat's Legacy places it at about 16 hours of fasting, in Week 1 of the Four-Week Reset. Chapter 7.",
    cardLine: "Autophagy: your cells' own recycling system.",
    cardKicker: "Kat's Legacy · Chapter 7",
    cardBadge: "7",
  },
  {
    id: "ev-fact-alkaline",
    pillar: "fact",
    text: "Alkaline water is made by electrolysis or by adding minerals that raise pH. Kat's Legacy names magnesium, calcium, and potassium as the main minerals. Chapter 11, pages 67-68.",
    cardLine: "Magnesium, calcium, potassium: the minerals behind alkaline water.",
    cardKicker: "Kat's Legacy · Chapter 11",
    cardBadge: "11",
  },
  {
    id: "ev-fact-sugar-hides",
    pillar: "fact",
    text: "Sugar shows up far beyond the candy aisle: sauces, breads, dressings, and drinks. Chapter 5 of Kat's Legacy walks through where it hides, pages 28-33.",
    cardLine: "Sugar hides in sauces, breads, and drinks.",
    cardKicker: "Kat's Legacy · Chapter 5",
    cardBadge: "5",
  },
  {
    id: "ev-fact-reset",
    pillar: "fact",
    text: "The Healing Section of Kat's Legacy starts on page 74 with a Four-Week Reset: 3 prep days, then Week 1 detox, Week 2 cellular repair, Week 3 solids, and Week 4 maintenance.",
    cardLine: "Four weeks: prep, detox, repair, solids, maintenance.",
    cardKicker: "Kat's Legacy · Page 74",
    cardBadge: "74",
  },
  {
    id: "ev-fact-repair",
    pillar: "fact",
    text: "Chapter 9 of Kat's Legacy opens with one idea: your body repairs bone, skin, and everyday wear every single day. The Event gives that daily work a steady routine. Page 51.",
    cardLine: "Your body does repair work every single day.",
    cardKicker: "Kat's Legacy · Chapter 9",
    cardBadge: "9",
  },
  {
    id: "ev-fact-immunity",
    pillar: "fact",
    text: "Chapter 2 of Kat's Legacy explains immunity as a defense army: a front line that responds fast, and specialists that learn and remember.",
    cardLine: "Immunity, explained as a defense army.",
    cardKicker: "Kat's Legacy · Chapter 2",
    cardBadge: "2",
  },
  {
    id: "ev-fact-digestion",
    pillar: "fact",
    text: "Chapter 3 of Kat's Legacy treats digestion as the foundation chapter. In the Event it gets its own day, right after the lymphatic and immune systems.",
    cardLine: "Digestion: the foundation chapter.",
    cardKicker: "Kat's Legacy · Chapter 3",
    cardBadge: "3",
  },
  {
    id: "ev-fact-jol",
    pillar: "fact",
    text: "Kat's JOL, short for the Juice of Life, is the daily recipe at the center of Kat's Legacy. Day 10 of the Event gives it a full session of its own.",
    cardLine: "Kat's JOL: the Juice of Life.",
    cardKicker: "Kat's Legacy · Kat's JOL",
    cardBadge: "JOL",
  },

  // Story (Wilson and Kat)
  {
    id: "ev-story-search",
    pillar: "story",
    text: "Kat's Legacy began with a father searching for answers for his daughter. That search became a book, and the book became the Rejuvenation Event: six guided weeks you document and finish.",
    cardLine: "It began with a father searching for answers for his daughter.",
    cardKicker: "The story",
  },
  {
    id: "ev-story-wilson",
    pillar: "story",
    text: "Wilson Fischmann refused to accept a brain-dead diagnosis for his daughter, Kat. Years of research and a decade of documented resilience followed, and that work became Kat's Legacy.",
    cardLine: "A decade of documented resilience became a book.",
    cardKicker: "The story",
  },
  {
    id: "ev-story-jol",
    pillar: "story",
    text: "Kat's JOL started as part of one daughter's recovery journey. In the Rejuvenation Event, a whole cohort learns that recipe together, guided by the book her father wrote.",
    cardLine: "A recipe from one family's recovery, shared with a cohort.",
    cardKicker: "The story",
  },
  {
    id: "ev-story-written",
    pillar: "story",
    text: "Kat's Legacy exists because a father wrote his daughter's story down. The Rejuvenation Event gives you the same gift: six weeks of your own days, collected in a Transformation Book you author.",
    cardLine: "Her story lasts because it was written down.",
    cardKicker: "The story",
  },
  {
    id: "ev-story-protocol",
    pillar: "story",
    text: "After his daughter Kat's recovery, Wilson Fischmann followed the same protocol for his own health. That protocol is now the foundation of the Rejuvenation Event, taught one short session a day.",
    cardLine: "The same protocol, now a guided Event.",
    cardKicker: "The story",
  },
  {
    id: "ev-story-cohort",
    pillar: "story",
    text: "Kat's Legacy works as a self-guided book. The Rejuvenation Event adds a cohort, a daily 10-minute session, and a finish line six weeks out.",
    cardLine: "The book, plus a cohort and a finish line.",
    cardKicker: "The story",
  },
  {
    id: "ev-story-name",
    pillar: "story",
    text: "Why call it rejuvenation? The goal is renewal you can record: a Day 1 benchmark, six weeks of daily pages, and a book that tells the story in your words.",
    cardLine: "Renewal you can record.",
    cardKicker: "The story",
  },

  // A day in the Event
  {
    id: "ev-day-benchmark",
    pillar: "day",
    text: "Day 1 of the Event: set your Health Benchmark. Baseline photos, a first journal entry, and an honest note on how your body feels. Every later page is measured against this one.",
    cardLine: "Day 1: set your Health Benchmark.",
    cardKicker: "A day in the Event",
    cardBadge: "D1",
  },
  {
    id: "ev-day-session",
    pillar: "day",
    text: "Each Event day starts with a 10-minute cohort session. Then comes your own record: same place, same light, one photo and one journal page.",
    cardLine: "Same place. Same light. One page a day.",
    cardKicker: "A day in the Event",
  },
  {
    id: "ev-day-lymph",
    pillar: "day",
    text: "Day 2 of the Event covers the lymphatic system: ten minutes of teaching, a walk, a full glass of water, and a few lines in the journal.",
    cardLine: "Day 2: ten minutes, a walk, a glass of water, a page.",
    cardKicker: "A day in the Event",
    cardBadge: "D2",
  },
  {
    id: "ev-day-victory",
    pillar: "day",
    text: "Every Event session closes with Today's Victory: one thing that went right, written down. Six weeks of those make a book worth keeping.",
    cardLine: "Every session ends with Today's Victory.",
    cardKicker: "A day in the Event",
  },
  {
    id: "ev-day-structure",
    pillar: "day",
    text: "The Event runs six weeks: one week of preparation, four weeks of the core protocol, and one week of celebration. Every day leaves a page behind.",
    cardLine: "Six weeks. Every day leaves a page behind.",
    cardKicker: "How the Event works",
  },
  {
    id: "ev-day-celebration",
    pillar: "day",
    text: "The last week of the Event is celebration: you look back at your Day 1 benchmark, read your own pages, and shape them into your Transformation Book.",
    cardLine: "The final week: shape your pages into a book.",
    cardKicker: "A day in the Event",
  },
  {
    id: "ev-day-week1",
    pillar: "day",
    text: "Week 1 of the core protocol is the introduction: how your body works, the basics of ketosis and autophagy, and one short session each day.",
    cardLine: "Week 1: learn how your body works.",
    cardKicker: "A day in the Event",
    cardBadge: "W1",
  },
  {
    id: "ev-day-maintenance",
    pillar: "day",
    text: "Day 1 of the Event introduces three kinds of body maintenance: corrective, which repairs; preventive, which slows decline; and autonomous, which you direct yourself for the long run.",
    cardLine: "Corrective. Preventive. Autonomous.",
    cardKicker: "A day in the Event",
  },
  {
    id: "ev-day-stress",
    pillar: "day",
    text: "Day 7 of the Event is about stress and emotional eating, because how you feel shapes what you reach for. Ten minutes of teaching, then one honest journal entry.",
    cardLine: "Day 7: stress, emotions, and an honest journal entry.",
    cardKicker: "A day in the Event",
    cardBadge: "D7",
  },

  // Practice tips from the book
  {
    id: "ev-practice-walk-water",
    pillar: "practice",
    text: "Chapter 1 of Kat's Legacy starts with motion and water. Today's practice: a 10-minute walk and a full glass of water before your first coffee.",
    cardLine: "A 10-minute walk and a glass of water before coffee.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-three-lines",
    pillar: "practice",
    text: "Tonight, write three lines in a journal: what you ate, how you slept, and how you feel. Small daily records add up to a clear picture of your health.",
    cardLine: "Three lines tonight: food, sleep, how you feel.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-water-number",
    pillar: "practice",
    text: "Find your water number with the Kat's Legacy guide: body weight in kg divided by 30 equals liters a day. Fill a bottle to match and keep it where you can see it.",
    cardLine: "Find your water number, then fill a bottle to match.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-photo",
    pillar: "practice",
    text: "Take one photo today: same spot, same light, same time. Repeat it tomorrow. A daily photo is the simplest record of how six weeks unfold.",
    cardLine: "One photo a day, same spot, same light.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-breaths",
    pillar: "practice",
    text: "Five slow, deep breaths before each meal today. Kat's Legacy lists deep breathing alongside movement as part of how lymph keeps flowing.",
    cardLine: "Five deep breaths before each meal.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-label",
    pillar: "practice",
    text: "Check one label today: a sauce, a bread, or a drink. Chapter 5 of Kat's Legacy shows how often sugar turns up in everyday food.",
    cardLine: "Check one label today.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-victory",
    pillar: "practice",
    text: "End today with one sentence about something that went right. In the Event it is called Today's Victory, and every session closes with it.",
    cardLine: "One sentence about something that went right.",
    cardKicker: "Today's practice",
  },
  {
    id: "ev-practice-hourly-walk",
    pillar: "practice",
    text: "Sitting most of the day? Stand and walk for five minutes every hour. Movement is what keeps lymph flowing, Chapter 1 of Kat's Legacy.",
    cardLine: "Five minutes of walking every hour.",
    cardKicker: "Today's practice",
  },

  // Questions to the audience
  {
    id: "ev-q-habit",
    pillar: "question",
    text: "Over 40 and rebuilding your energy: what is one habit you kept this year?",
    cardLine: "What is one habit you kept this year?",
    cardKicker: "Your turn",
    linkOk: false,
  },
  {
    id: "ev-q-first-line",
    pillar: "question",
    text: "If you wrote one page about your health today, what would the first line say?",
    cardLine: "What would the first line say?",
    cardKicker: "Your turn",
    linkOk: false,
  },
  {
    id: "ev-q-walk",
    pillar: "question",
    text: "Morning walk or evening walk: which one actually sticks for you?",
    cardLine: "Morning walk or evening walk?",
    cardKicker: "Your turn",
    linkOk: false,
  },
  {
    id: "ev-q-six-weeks",
    pillar: "question",
    text: "Six weeks from now, what would you most like to feel different: your energy, your sleep, or how your clothes fit?",
    cardLine: "Energy, sleep, or how your clothes fit?",
    cardKicker: "Your turn",
    linkOk: false,
  },
  {
    id: "ev-q-water",
    pillar: "question",
    text: "What is the hardest part of drinking enough water for you: remembering, the taste, or finding the time?",
    cardLine: "Remembering, the taste, or the time?",
    cardKicker: "Your turn",
    linkOk: false,
  },
  {
    id: "ev-q-teacher",
    pillar: "question",
    text: "Who taught you the most about taking care of your health: a parent, a doctor, a book, or your own trial and error?",
    cardLine: "Who taught you the most about your health?",
    cardKicker: "Your turn",
    linkOk: false,
  },
  {
    id: "ev-q-time-of-day",
    pillar: "question",
    text: "What time of day do you feel most like yourself: early morning, midday, or late evening?",
    cardLine: "When do you feel most like yourself?",
    cardKicker: "Your turn",
    linkOk: false,
  },

  // Event status (accurate: enrollment is getting ready)
  {
    id: "ev-status-ready",
    pillar: "status",
    text: "The Rejuvenation Event is getting ready. Six guided weeks, two paths in, one Transformation Book out. Follow for the day enrollment opens.",
    cardLine: "Getting ready. Follow for the day enrollment opens.",
    cardKicker: "Event status",
  },
  {
    id: "ev-status-paths",
    pillar: "status",
    text: "Two ways into the Event once enrollment opens: pay $600, or lock $600 in REJU for 6 months and keep your keys. Both paths include Kat's Legacy ($69) and the book you author.",
    cardLine: "Two paths in. One Transformation Book out.",
    cardKicker: "Event status",
  },
  {
    id: "ev-status-sessions",
    pillar: "status",
    text: "Behind the scenes, the Rejuvenation Event is coming together: 20 daily cohort sessions, a daily transformation log, and Kat's Legacy as the guide. Follow along for opening day.",
    cardLine: "20 daily sessions. One guide. Getting ready.",
    cardKicker: "Event status",
  },
  {
    id: "ev-status-leave-with",
    pillar: "status",
    text: "What you leave the Event with: your Day 1 benchmark, six weeks of documented days, and a Transformation Book you authored. Enrollment is getting ready, follow for the date.",
    cardLine: "Leave with a book you authored.",
    cardKicker: "Event status",
  },
  {
    id: "ev-status-notify",
    pillar: "status",
    text: "Enrollment for the Rejuvenation Event is getting ready. Turn on notifications for this account and you will hear the moment the doors open.",
    cardLine: "Turn on notifications for opening day.",
    cardKicker: "Event status",
  },
  {
    id: "ev-status-plan",
    pillar: "status",
    text: "The full six-week plan for the Rejuvenation Event, from preparation week to celebration, is on the program page. Read it today and follow for the day enrollment opens.",
    cardLine: "Read the six-week plan today.",
    cardKicker: "Event status",
  },
  {
    id: "ev-status-midlife",
    pillar: "status",
    text: "The Rejuvenation Event is built for midlife: six structured weeks with a cohort, a daily routine, and a finish line. It is getting ready now, so follow along for opening day.",
    cardLine: "Six structured weeks, built for midlife.",
    cardKicker: "Event status",
  },
];

// ---------------------------------------------------------------------------
// @REJUTOKEN (crypto audience, token as the door)
// ---------------------------------------------------------------------------

export type TakeCategory =
  | "market"
  | "institutional"
  | "policy"
  | "payments"
  | "security"
  | "realworld"
  | "adoption"
  | "general";

/** Ordered: first match wins. Applied to the headline. */
export const TAKE_CATEGORY_RULES: Array<{ category: TakeCategory; pattern: RegExp }> = [
  { category: "security", pattern: /\b(hack\w*|exploit\w*|breach\w*|stolen|theft|scam\w*|phish\w*|drain\w*|private keys?|public keys?|custody|self.custody|wallets?|quantum|security)\b/i },
  { category: "realworld", pattern: /\b(rwa|real.world|tokeni[sz]\w*|real estate|bonds?)\b/i },
  { category: "policy", pattern: /\b(sec|cftc|congress|senate|house committee|bill|law|lawmakers?|regulat\w*|irs|tax\w*|treasury department|u\.?s\.? treasury|court|judge|policy|government|mica|licen[cs]\w*|compliance|white house|fed|federal reserve)\b/i },
  { category: "institutional", pattern: /\b(etfs?|blackrock|fidelity|institution\w*|pension|funds?|asset managers?|banks?|inflows?|outflows?|allocation|vc|venture|raises|funding|investors?)\b/i },
  { category: "payments", pattern: /\b(stablecoins?|usdc|usdt|payments?|settlement|remittances?|visa|mastercard|paypal)\b/i },
  { category: "adoption", pattern: /\b(adopt\w*|launch\w*|partner\w*|integrat\w*|users|treasury|reserves?|corporate|companies|upgrade)\b/i },
  { category: "market", pattern: /\b(price|prices|rall\w*|slides?|drops?|falls?|surges?|jumps?|climbs?|holds?|record|highs?|lows?|bulls?|bears?|volatil\w*|liquidat\w*|sell.?off|market|traders?|\$\d+k)\b/i },
];

export type Take = {
  id: string;
  category: TakeCategory;
  text: string;
  /** Reads well without a headline: used for evergreen posts when no fresh news is usable. */
  standalone?: boolean;
};

/** One original sentence of take after the headline. Positive, direct, no forecasts. */
export const TAKES: Take[] = [
  { id: "tk-market-1", category: "market", text: "Price moves fast, and patient holders set their own pace." },
  { id: "tk-market-2", category: "market", text: "Short-term swings make a long horizon more valuable." },
  { id: "tk-market-3", category: "market", text: "Volatility rewards people who hold with a plan and a timeline." },
  { id: "tk-inst-1", category: "institutional", text: "Big money keeps building positions measured in years." },
  { id: "tk-inst-2", category: "institutional", text: "Long-term capital keeps finding its way on-chain.", standalone: true },
  { id: "tk-inst-3", category: "institutional", text: "Institutions think in long holding periods, and so should builders." },
  { id: "tk-policy-1", category: "policy", text: "Clear rules favor projects built for the long term.", standalone: true },
  { id: "tk-policy-2", category: "policy", text: "Rules are catching up with crypto, and durable projects benefit." },
  { id: "tk-policy-3", category: "policy", text: "Good policy rewards tokens with a real job to do." },
  { id: "tk-pay-1", category: "payments", text: "Everyday use is the real test for any token.", standalone: true },
  { id: "tk-pay-2", category: "payments", text: "Payments are where crypto meets daily life." },
  { id: "tk-sec-1", category: "security", text: "Self-custody habits matter more every year.", standalone: true },
  { id: "tk-sec-2", category: "security", text: "Keeping your own keys is a skill worth building.", standalone: true },
  { id: "tk-rwa-1", category: "realworld", text: "Tokens tied to something real keep gaining ground." },
  { id: "tk-rwa-2", category: "realworld", text: "Real-world use is where a token earns its place.", standalone: true },
  { id: "tk-adopt-1", category: "adoption", text: "Adoption grows one useful product at a time.", standalone: true },
  { id: "tk-adopt-2", category: "adoption", text: "The projects that last give people something to use.", standalone: true },
  { id: "tk-gen-1", category: "general", text: "Crypto keeps rewarding builders who plan for years.", standalone: true },
  { id: "tk-gen-2", category: "general", text: "Long cycles reward patience.", standalone: true },
  { id: "tk-gen-3", category: "general", text: "The best tokens give holders a reason to stay.", standalone: true },
];

export type BridgeLine = {
  id: string;
  text: string;
  cardLine: string;
  /** Take categories this bridge pairs well with (preferred, never required). */
  affinity?: TakeCategory[];
};

/** REJU line that follows the take on news-hook posts. Rotated least-recently-used. */
export const TOKEN_BRIDGES: BridgeLine[] = [
  {
    id: "br-door",
    text: "REJU launches soon: a long-term token that opens the door to the Rejuvenation Event.",
    cardLine: "The door to rejuvenation.",
    affinity: ["general", "adoption"],
  },
  {
    id: "br-last",
    text: "REJU is built to last past launch week, with a real program attached to the token.",
    cardLine: "Built to last past launch week.",
    affinity: ["market", "institutional"],
  },
  {
    id: "br-ecosystem",
    text: "REJU is a soon-to-launch token with an ecosystem attached: a guided Event, a book, and a cohort.",
    cardLine: "A token with an ecosystem attached.",
    affinity: ["adoption", "realworld"],
  },
  {
    id: "br-keys",
    text: "REJU Path B is a 6-month lock where you keep your keys, and the lock opens the Rejuvenation Event.",
    cardLine: "Lock for 6 months. Keep your keys.",
    affinity: ["security", "policy"],
  },
  {
    id: "br-book",
    text: "REJU opens the Rejuvenation Event, where each participant authors their own Transformation Book.",
    cardLine: "Your own Transformation Book.",
    affinity: ["general", "realworld"],
  },
  {
    id: "br-seasons",
    text: "REJU is designed for holders who think in seasons: lock, keep your keys, and step into a 6-week Event.",
    cardLine: "Designed for holders who think in seasons.",
    affinity: ["market", "institutional"],
  },
  {
    id: "br-job",
    text: "REJU gives the token a clear job: it is one of two ways into the Rejuvenation Event.",
    cardLine: "A token with a clear job.",
    affinity: ["payments", "policy", "realworld"],
  },
  {
    id: "br-long-run",
    text: "REJU, launching soon, is the long-term token behind the Rejuvenation Event and its Transformation Book.",
    cardLine: "Launching soon. Built for the long run.",
    affinity: ["institutional", "market"],
  },
  {
    id: "br-one-ecosystem",
    text: "Coming soon: REJU, a token with an ecosystem attached and a door to a 6-week Rejuvenation Event.",
    cardLine: "Token, Event, book. One ecosystem.",
    affinity: ["adoption", "general"],
  },
  {
    id: "br-ticket",
    text: "REJU turns a 6-month lock into a ticket: your keys stay with you and the Rejuvenation Event opens.",
    cardLine: "Your lock becomes your ticket.",
    affinity: ["security", "payments"],
  },
  {
    id: "br-hold-lock",
    text: "REJU launches soon. Hold it, lock it, and it opens the Rejuvenation Event and the Transformation Book.",
    cardLine: "Hold it. Lock it. Open the Event.",
    affinity: ["market", "general"],
  },
  {
    id: "br-use",
    text: "REJU is launching soon as a token people can use: it opens a guided Event and a book you write yourself.",
    cardLine: "A token people can use.",
    affinity: ["payments", "adoption"],
  },
];

/** Non-news posts for @REJUTOKEN: used on non-news days and whenever no fresh headline passes. */
export const TOKEN_BANK: BankPost<TokenPillar>[] = [
  // Build updates (facts about the live site)
  {
    id: "tk-build-program",
    pillar: "build",
    text: "Build update: the program page now lays out all six weeks of the Rejuvenation Event, from preparation to celebration. REJU, the token that opens it, launches soon.",
    cardLine: "All six weeks, mapped out.",
    cardKicker: "Build update",
  },
  {
    id: "tk-build-onboarding",
    pillar: "build",
    text: "Build update: the onboarding page shows both paths into the Event on one screen. Path A pays $600. Path B locks $600 in REJU for 6 months on Streamflow, and your keys stay with you.",
    cardLine: "Both paths, one screen.",
    cardKicker: "Build update",
  },
  {
    id: "tk-build-log",
    pillar: "build",
    text: "Build update: the Daily Transformation Log is live on the site. Each Event day gets an entry there, and those entries become chapters of the participant's Transformation Book.",
    cardLine: "The Daily Transformation Log is live.",
    cardKicker: "Build update",
  },
  {
    id: "tk-build-sessions",
    pillar: "build",
    text: "Build update: all 20 daily cohort sessions for the Rejuvenation Event are written. Ten minutes each, one per day, each tied to a chapter of Kat's Legacy.",
    cardLine: "20 sessions written. Ten minutes each.",
    cardKicker: "Build update",
  },
  {
    id: "tk-build-registration",
    pillar: "build",
    text: "Build update: participant registration is built and waiting for opening day. REJU launches soon, and the Event it opens is getting ready alongside it.",
    cardLine: "Registration built. Waiting for opening day.",
    cardKicker: "Build update",
  },
  {
    id: "tk-build-materials",
    pillar: "build",
    text: "Build update: Event materials are organized for the first cohort, with Kat's Legacy as the guide and a short session for every day of the program.",
    cardLine: "Materials ready for the first cohort.",
    cardKicker: "Build update",
  },
  {
    id: "tk-build-book",
    pillar: "build",
    text: "Build update: the Transformation Book flow is in place. Daily photos and journal entries from the Event come together as a book each participant authors.",
    cardLine: "Daily pages in. A finished book out.",
    cardKicker: "Build update",
  },

  // Path B explainers
  {
    id: "tk-pathb-steps",
    pillar: "path_b",
    text: "Path B in three steps: buy about $600 of REJU, lock it on Streamflow for 6 months, add Kat's Legacy ($69). Your keys stay with you, and the lock opens the Event.",
    cardLine: "Path B in three steps.",
    cardKicker: "Path B",
  },
  {
    id: "tk-pathb-noncustodial",
    pillar: "path_b",
    text: "A 6-month REJU lock on Streamflow is non-custodial. The tokens return to your wallet when it ends, and while it runs, the lock is your entry to the Rejuvenation Event.",
    cardLine: "Non-custodial. Back in your wallet after 6 months.",
    cardKicker: "Path B",
  },
  {
    id: "tk-pathb-same-event",
    pillar: "path_b",
    text: "Path A or Path B, same Event. Pay $600, or lock $600 in REJU for 6 months and keep your keys. Both include Kat's Legacy ($69) and the Transformation Book you author.",
    cardLine: "Path A or Path B. Same Event.",
    cardKicker: "Path B",
  },
  {
    id: "tk-pathb-ticket",
    pillar: "path_b",
    text: "Path B turns a lock into a ticket. Put $600 of REJU in a six-month Streamflow lock, and step into the Rejuvenation Event and the book you write there.",
    cardLine: "A lock that works as a ticket.",
    cardKicker: "Path B",
  },
  {
    id: "tk-pathb-holders",
    pillar: "path_b",
    text: "Path B is made for long-term holders. Your REJU sits in a Streamflow lock for six months, and that lock is how you enter the Rejuvenation Event.",
    cardLine: "Made for long-term holders.",
    cardKicker: "Path B",
  },
  {
    id: "tk-pathb-patience",
    pillar: "path_b",
    text: "Path B asks one thing of holders: patience. Six months in a REJU lock, keys in your hands, and a seat in the Rejuvenation Event.",
    cardLine: "Path B asks for patience.",
    cardKicker: "Path B",
  },
  {
    id: "tk-pathb-yours",
    pillar: "path_b",
    text: "Path B in one line: your REJU stays yours, locked for 6 months on Streamflow, and the lock is your pass into the Rejuvenation Event.",
    cardLine: "Your REJU stays yours.",
    cardKicker: "Path B",
  },

  // Questions
  {
    id: "tk-q-matters",
    pillar: "question",
    text: "What matters most to you in a new token: real utility, clear lock terms, a long roadmap, or a strong community?",
    cardLine: "What matters most in a new token?",
    cardKicker: "Question",
    linkOk: false,
  },
  {
    id: "tk-q-finish",
    pillar: "question",
    text: "If a token opened a door to something you could finish and hold in your hands, would you lock it for 6 months?",
    cardLine: "Would you lock it for 6 months?",
    cardKicker: "Question",
    linkOk: false,
  },
  {
    id: "tk-q-hold",
    pillar: "question",
    text: "How long do you usually hold a new token: days, months, or years? REJU is designed around a 6-month lock.",
    cardLine: "Days, months, or years?",
    cardKicker: "Question",
    linkOk: false,
  },
  {
    id: "tk-q-year-after",
    pillar: "question",
    text: "What should a token still be doing a year after launch? Our answer for REJU: opening a guided Event and a book people author.",
    cardLine: "What should a token do a year after launch?",
    cardKicker: "Question",
    linkOk: false,
  },
  {
    id: "tk-q-keys",
    pillar: "question",
    text: "Do you keep your tokens on an exchange or in your own wallet? With the REJU Path B lock, your keys stay with you the whole time.",
    cardLine: "Exchange or your own wallet?",
    cardKicker: "Question",
    linkOk: false,
  },
  {
    id: "tk-q-hold-longer",
    pillar: "question",
    text: "Which would make you hold a token longer: staking rewards, governance votes, or access to a real program? REJU is building the third.",
    cardLine: "What makes you hold a token longer?",
    cardKicker: "Question",
    linkOk: false,
  },
  {
    id: "tk-q-chapter",
    pillar: "question",
    text: "If your token came with a book you write yourself, what would the first chapter be about?",
    cardLine: "What would your first chapter be about?",
    cardKicker: "Question",
    linkOk: false,
  },

  // Quotes from the Event side
  {
    id: "tk-eq-pages",
    pillar: "event_quote",
    text: "From the Event side: every day of the Event becomes a page, and at the end you hold a book you authored. That is what a REJU lock opens.",
    cardLine: "Every day becomes a page.",
    cardKicker: "From the Event",
  },
  {
    id: "tk-eq-what",
    pillar: "event_quote",
    text: "This is what the token opens: six guided weeks, a daily record, and a Transformation Book in your own words. The Event lives at @REJUvenationTKN.",
    cardLine: "This is what the token opens.",
    cardKicker: "From the Event",
  },
  {
    id: "tk-eq-lymph",
    pillar: "event_quote",
    text: "Kat's Legacy, Chapter 1: the lymphatic system has no pump, it moves when you move. That book is the guide inside the Event that REJU opens.",
    cardLine: "The guide inside the Event.",
    cardKicker: "From the Event",
  },
  {
    id: "tk-eq-benchmark",
    pillar: "event_quote",
    text: "Inside the Event REJU opens, Day 1 is simple: set your Health Benchmark with photos and one honest journal page. Six weeks later you read it back.",
    cardLine: "Day 1: set your benchmark.",
    cardKicker: "From the Event",
  },
  {
    id: "tk-eq-victory",
    pillar: "event_quote",
    text: "Every session in the Rejuvenation Event ends with Today's Victory, one thing that went right. REJU is the token that opens that door.",
    cardLine: "Today's Victory, every day.",
    cardKicker: "From the Event",
  },
  {
    id: "tk-eq-story",
    pillar: "event_quote",
    text: "REJU exists because of Kat's Legacy, a father's search for answers for his daughter that became a book and then a six-week Event.",
    cardLine: "A father's search became a six-week Event.",
    cardKicker: "From the Event",
  },
  {
    id: "tk-eq-sixweeks",
    pillar: "event_quote",
    text: "Six weeks: one week of preparation, four weeks of protocol, one week of celebration. That is the Rejuvenation Event, and REJU is one of the two ways in.",
    cardLine: "Six weeks. Two ways in.",
    cardKicker: "From the Event",
  },

  // Founder notes: drafts in Wilson's voice. Never auto-posted until he approves the wording.
  {
    id: "tk-founder-why",
    pillar: "founder",
    text: "Why I built REJU, in one sentence: I wanted a token that opens a door to something people can finish and hold in their hands.",
    cardLine: "Something people can finish and hold in their hands.",
    cardKicker: "Founder note",
    requiresApproval: true,
  },
  {
    id: "tk-founder-kat",
    pillar: "founder",
    text: "Kat's story is why REJU exists. The token is how more people reach the program her recovery inspired.",
    cardLine: "Kat's story is why REJU exists.",
    cardKicker: "Founder note",
    requiresApproval: true,
  },
];

export function bankFor(account: "crypto" | "rejuvenation"): BankPost[] {
  return account === "rejuvenation" ? EVENT_BANK : TOKEN_BANK;
}
