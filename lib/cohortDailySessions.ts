/**
 * 20 daily cohort meeting sessions (max 10 minutes each).
 * Sourced from D:\REJU\course_event (Bolivia Health Course) and aligned with Kat's Legacy.
 */
import { COHORT_MATERIALS_DRIVE_FOLDER } from "./rejuMaterials";

export interface CohortDailySession {
  day: number;
  title: string;
  bookChapter: string;
  courseSource: string;
  durationMinutes: number;
  meetingFocus: string;
  teachingPoints: string[];
  participantActions: string[];
  facilitatorNote?: string;
}

export const COHORT_SESSION_DURATION = 10;

export const COHORT_DAILY_SESSIONS: CohortDailySession[] = [
  {
    day: 1,
    title: "Welcome, Kat's Legacy & Your Health Benchmark",
    bookChapter: "Introduction",
    courseSource: "Curso de Salud — Course Introduction; EVENTO DE SALUD",
    durationMinutes: 10,
    meetingFocus:
      "Open the cohort. Introduce the REJU Rejuvenation Event™, Kat's story, and the non-negotiable baseline every participant must record today.",
    teachingPoints: [
      "Kat's Legacy began when Wilson Fischmann refused to accept a brain-dead diagnosis for his daughter Kat — leading to Kat's JOL™ and a decade of documented resilience.",
      "This program is not a quick fix; it is a structured commitment to transformation through the REJU Protocol™ and the Four-Week Reset in Kat's Legacy.",
      "Three maintenance types from the Bolivia course: corrective (repair damage), preventive (stop decline), and autonomous (self-directed longevity).",
      "The 6-week REJU event: 1 week preparation → 4 weeks protocol → 1 week celebration — matching the Health Event structure.",
      "Establish your Health Benchmark™ now: photos, journal, how you feel physically and emotionally — avoid mirrors and scales during the reset; your record is your early-warning system.",
    ],
    participantActions: [
      "Download Kat's Legacy and read the Introduction.",
      "Take baseline photos and write your starting benchmark in the daily transformation log.",
      "Save your Participant ID on every entry going forward.",
      "Join REJU Official on Telegram for live session times.",
    ],
    facilitatorNote: "End with one Today's Victory — the first of 20+.",
  },
  {
    day: 2,
    title: "The Lymphatic System — Your Body's Drainage Network",
    bookChapter: "Chapter 1",
    courseSource: "Day 1 — Sistemas del Cuerpo; The Human Body as a City System",
    durationMinutes: 10,
    meetingFocus:
      "Teach the lymphatic system as the body's garbage collection service — the foundation chapter in Kat's Legacy.",
    teachingPoints: [
      "Imagine your body as a city: lymph nodes are waste-processing plants; lymph vessels are garbage truck routes (Kat's Legacy Ch. 1 + City System doc).",
      "Key functions: drain waste and toxins, defend against pathogens with immune cells, absorb fats and fat-soluble vitamins.",
      "Lymph has no central pump — it moves through muscle contractions, movement, and deep breathing. Sedentary life stalls the system.",
      "Signs of dysfunction: swelling, bloating, frequent infections, fatigue, brain fog — the body is not draining.",
      "Support: hydration (weight kg ÷ 30 = liters/day), movement, deep breaths, and reducing toxic load entering the system.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 1.",
      "Practice 5 minutes of deep diaphragmatic breathing today.",
      "Log lymph-related observations: bloating, swelling, energy — in your daily log.",
      "Drink your calculated hydration target before noon.",
    ],
  },
  {
    day: 3,
    title: "The Immune System — Innate & Adaptive Defense",
    bookChapter: "Chapter 2",
    courseSource: "Day 1 — Sistema Inmune slides",
    durationMinutes: 10,
    meetingFocus:
      "Explain the immune system's two-tier defense and why Kat remained remarkably resilient for over a decade.",
    teachingPoints: [
      "First barriers: skin, mucous membranes, stomach acid — the city's walls before invaders enter.",
      "Innate immunity: immediate, non-specific — fever, inflammation, macrophages, neutrophils, NK cells.",
      "Adaptive immunity: memory-based — B cells produce antibodies; T cells attack from within. This is the principle behind vaccination.",
      "Autoimmunity occurs when the system cannot distinguish self from threat — lupus, rheumatoid arthritis, Type 1 diabetes, psoriasis.",
      "Chronic stress suppresses immunity (cortisol, adrenaline) — mental toxicity directly weakens physical defense.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 2.",
      "Note any recurring infections, inflammation, or autoimmune patterns in your benchmark journal.",
      "Identify one stress source you can reduce today.",
      "Record Today's Victory related to immune-supporting behavior (sleep, hydration, or stress pause).",
    ],
  },
  {
    day: 4,
    title: "The Digestive System — Foundation of All Health",
    bookChapter: "Chapter 3",
    courseSource: "Day 1 — Sistema Digestivo; Chronic Illnesses article",
    durationMinutes: 10,
    meetingFocus:
      "Position digestion as the root system — every chronic illness conversation in the course returns here.",
    teachingPoints: [
      "The gut is not just about food — it houses the microbiome, produces neurotransmitters, and connects to immunity and detox.",
      "Processing time matters: the course teaches ~10 hours for digestion — constant eating never lets the system rest.",
      "Leaky gut (intestinal permeability) allows toxins and undigested particles into blood — linking diet to systemic inflammation.",
      "Chronic illnesses — cancer, diabetes, hypertension, obesity, NAFLD — all have documented dietary drivers (Chronic Illnesses article).",
      "Rule from the Bolivia course echoed in Kat's Legacy: elimination is as important as intake — 'it is more important to eliminate than to swallow.'",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 3.",
      "Track elimination patterns honestly (frequency, quality) — data, not judgment.",
      "Begin reducing one processed food category from your intake.",
      "Log digestive comfort scores in the daily transformation log.",
    ],
  },
  {
    day: 5,
    title: "Physical Toxicity — Hidden Dangers in Food & Environment",
    bookChapter: "Chapter 4",
    courseSource: "Day 1 — Comidas Tóxicas, Metales Pesados, Químicos Industriales",
    durationMinutes: 10,
    meetingFocus:
      "Wake participants to physical toxicity — you cannot detox a body that keeps ingesting poison.",
    teachingPoints: [
      "Step one of detoxification: stop ingesting toxins. You cannot clean a dirty jar while pouring mud into it.",
      "Water toxicity: fluoride, BPA bottles, heavy metals — filter and source matter.",
      "Food toxicity: processed meats (nitrites), farmed fish (PCBs, antibiotics), GMOs, grilled PAHs, hydrogenated oils, microwave popcorn chemicals, non-organic produce (glyphosate).",
      "Sugar is not food — it is a neurotoxin and the preferred fuel of cancer cells (Warburg).",
      "Heavy metals (lead, mercury, arsenic) and industrial chemicals (benzene, BPA, phthalates) accumulate silently — cilantro and clean nutrition support chelation.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 4.",
      "Audit your kitchen: list 5 toxic items to remove this week.",
      "Switch one water or food source to a cleaner alternative.",
      "Photograph your pantry baseline for your Transformation Book.",
    ],
  },
  {
    day: 6,
    title: "Sugar — Metabolic Damage & the Warburg Effect",
    bookChapter: "Chapter 5",
    courseSource: "Day 1 — Azúcar slides; Robert Lustig research",
    durationMinutes: 10,
    meetingFocus:
      "Deliver the sugar session with numbers — participants must feel the weight of daily invisible intake.",
    teachingPoints: [
      "Americans consume ~141 lbs of sugar per year — one soda daily = ~15.6 lbs of fat equivalent annually (course math).",
      "Fructose converts to uric acid (gout), raises triglycerides, and drives small dense LDL-B — the dangerous particle.",
      "Sugar suppresses immunity, feeds cancer preferentially (Warburg: cancer lives in acidic, low-oxygen, high-sugar environments).",
      "Soda combines caffeine (diuretic) + salt (55 mg) — dual dehydration disguised as refreshment.",
      "Ketogenic logic: remove sugar → body must find another fuel → ketones become available.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 5.",
      "Eliminate all sodas, juices, and added sugar today.",
      "Read labels — identify hidden sugars in sauces, breads, and 'health' products.",
      "Log mood and energy shifts as sugar clears — expect a rollercoaster.",
    ],
  },
  {
    day: 7,
    title: "Mental Toxicity, Stress & Emotional Eating",
    bookChapter: "Chapter 4 (Mental Toxicity)",
    courseSource: "Day 1 — Toxicidad Mental, Estrés; Day 3 — Salud Mental",
    durationMinutes: 10,
    meetingFocus:
      "Address the invisible toxin — stress-driven eating and the mind as governor vs. instrument.",
    teachingPoints: [
      "When stressed, the sympathetic system activates fight-or-flight: blood leaves digestion, immunity suppresses, cortisol and adrenaline surge.",
      "Emotional eating satisfies a feeling, not hunger — when the emotion returns, the cycle repeats (course: 'eating for satisfaction').",
      "Chronic stress manifests physically: headaches, ulcers, hair loss, irregular cycles, hypertension, insomnia, acne.",
      "Reframe from the course: the mind as instrument, not governor — Wayne Dyer (Power of Intention), Eckhart Tolle (Power of Now).",
      "Two focus modes for problems: 'why is this happening to me' vs. 'how can I resolve this' — only the second heals.",
    ],
    participantActions: [
      "Identify your top stress-eating trigger and write it in your log.",
      "Practice 10 minutes of stillness, breath work, or the 'O' meditation system from the course.",
      "Record Today's Victory that is emotional, not food-related.",
      "Reach out on Telegram if you need cohort support today.",
    ],
  },
  {
    day: 8,
    title: "Water, Hydration, pH & Alkaline Foundations",
    bookChapter: "Chapter 11",
    courseSource: "Day 2 — Agua; Day 3 — Agua formula; El Agua Y sus Secretos",
    durationMinutes: 10,
    meetingFocus:
      "Water is the master carrier — structured, mineralized, alkaline water supports every other system.",
    teachingPoints: [
      "Hydration formula (course): body weight in kg ÷ 10 ÷ 3 = liters daily (e.g., 90 kg → 3 L). Book: kg ÷ 30 or half body weight in oz.",
      "Morning ritual: warm water + lemon + pinch of Himalayan salt — activates digestion and remineralizes.",
      "Acidity drives osteoporosis, gout, and creates hostile terrain — Otto Warburg linked acidic environments to disease.",
      "Alkaline, structured water supports lymph flow, nutrient delivery, and detox pathways (Kat's Legacy Ch. 11).",
      "Apple cider vinegar (2 tbsp in water, morning) and celery juice support gut pH balance per course protocol.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 11.",
      "Calculate your personal water target and hit it today.",
      "Start morning lemon-salt water ritual.",
      "Log skin dryness, mouth dryness, and urine color — body's hydration language.",
    ],
  },
  {
    day: 9,
    title: "Colon Health, Elimination & Detox Pathways",
    bookChapter: "Chapter 10",
    courseSource: "Day 2 — Limpieza del Colon, Desintoxicación; Curso de Salud GUIDE",
    durationMinutes: 10,
    meetingFocus:
      "The colon is the exit door — if blocked, every upstream system fails. Preparation for Week 1 detox.",
    teachingPoints: [
      "Colon toxicity links to systemic disease — 5–25 lbs of accumulated waste is common before a proper cleanse (course reference).",
      "Tools: prunes (5 after meals, adjust up/down), colon hydrotherapy/colonics on Day 3 of preparation, magnesium, triphala, plum juice.",
      "Stop toxins in → give digestion rest (10-hour processing window) → flush with water → support with antioxidants.",
      "Probiotic foods: kombucha, kefir, kimchi, sauerkraut, yogurt — rebuild the gut after cleansing.",
      "Sauna, coffee enemas (Gerson tradition), and sweating support elimination through skin — the third detox organ.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 10.",
      "If in Preparation Phase: follow prune protocol and schedule colon cleanse for Day 3.",
      "Add one fermented food to your day.",
      "Log elimination quality — this is clinical data for your benchmark.",
    ],
  },
  {
    day: 10,
    title: "Kat's JOL™ — The Juice of Life",
    bookChapter: "Introduction + Four-Week Reset / Kat's JOL Recipe",
    courseSource: "Day 2 — KAT'S JOL, La Receta Milagrosa; Kats JOL.txt",
    durationMinutes: 10,
    meetingFocus:
      "Introduce the cellular nutrition formula that sustained Kat and reversed Wilson's own health markers.",
    teachingPoints: [
      "Kat's JOL combines kale, moringa, leafy greens, beets, peas, apple, ginger, citrus, celery, carrot, banana, cucumber, zucchini, cilantro, parsley, chia, flax, lemon, spinach, dates, maca, and turmeric with pepper.",
      "Prepare with alkaline water — yields three 500 ml servings: morning, midday, ~5 PM (last food of the day).",
      "Vegetable soup (weekly, 3×): chard, kale, squash, zucchini, cucumber, onion, garlic, celery, potatoes with skin, cabbage, carrot, herbs — cooked with pink salt only.",
      "Bone broth (osso buco, 2 hr simmer, marrow crushed back in): 2 servings, twice weekly — deep mineral support.",
      "Wilson tested JOL on himself before giving it to Kat — lab results documented cholesterol, PSA, and vitality improvements.",
    ],
    participantActions: [
      "Read the Kat's JOL recipe section at the end of Kat's Legacy.",
      "Source ingredients and prepare your first JOL batch — or confirm your supply chain.",
      "Photograph your first JOL — Transformation Book chapter moment.",
      "Begin Week 1 JOL schedule if preparation phase is complete.",
    ],
  },
  {
    day: 11,
    title: "Superfoods, Ferments & Cellular Nutrition",
    bookChapter: "Chapters 3, 6, 11",
    courseSource: "Day 3 — Nutrición, Súper alimentos; Curso de Salud GUIDE — Nutricion",
    durationMinutes: 10,
    meetingFocus:
      "Beyond JOL — the seven nutrients, superfoods, and why nutrient density beats calorie counting.",
    teachingPoints: [
      "Seven essential nutrients framework from the course — vitamins, minerals, protein, fats, carbohydrates (quality not quantity), water, and oxygen.",
      "Superfoods in the protocol: wheatgrass, mushrooms (Chaga), chia, turmeric, ginger, maca, spirulina, flax, cilantro (metal chelation), He Shou Wu, goji, black garlic, broccoli.",
      "Kale alone delivers 200% vitamin A, 134% vitamin C, 684% vitamin K per cup — why it anchors JOL.",
      "Ferments rebuild microbiome: kefir, kombucha, kimchi, sauerkraut — living food vs. dead processed calories.",
      "Deficiency awareness: magnesium, zinc, vitamin D, iodine — many medications deplete these (course drug-induced deficiency chart).",
    ],
    participantActions: [
      "Add one new superfood from the list to today's JOL or meal.",
      "Read Kat's Legacy Chapter 6 (Energy & Digestion).",
      "Log energy before and after meals — notice fatigue vs. fuel.",
      "Note which ingredients your body responds to positively.",
    ],
  },
  {
    day: 12,
    title: "Autophagy — Your Cellular Recycling System",
    bookChapter: "Chapter 7",
    courseSource: "Day 2 — Autofagia, Nobel Ohsumi; Curso de Salud GUIDE — Healing Methods",
    durationMinutes: 10,
    meetingFocus:
      "Introduce the Nobel Prize science that underpins the fasting windows in the REJU Protocol™.",
    teachingPoints: [
      "Autophagy (Greek: 'self-eating') — cells recycle damaged components, reduce inflammation, and renew structure (Yoshinori Ohsumi, Nobel 2016).",
      "Activation timeline: 0–12 hrs glycogen use; 12–16 hrs fat transition; at ~16 hrs autophagy begins meaningfully.",
      "Fasting tiers from the course: 8-hr eating window → 4-hr window → one meal per day — each deepens the clean-up.",
      "Hippocrates: 'Our food should be our medicine' — Plutarch: 'Instead of medicine, fast a day.'",
      "Shinya Yamanaka (Nobel 2012): mature cells can be reprogrammed to stem-like state — the science of cellular rejuvenation.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 7.",
      "If on Week 1: maintain 16:8 fasting with Kat's JOL — note the hour you last eat.",
      "Log mental clarity and inflammation changes as fasting windows hold.",
      "Record any emotional resistance to fasting — normal, document it.",
    ],
  },
  {
    day: 13,
    title: "Preparation Complete — Week 1 Detoxification Begins",
    bookChapter: "Four-Week Reset — Preparation & Week 1",
    courseSource: "EVENTO DE SALUD — 1ra Semana; 4 Week Program doc",
    durationMinutes: 10,
    meetingFocus:
      "Launch Week 1: 16:8 fasting, three Kat's JOL servings, and the physiological map for Days 1–7.",
    teachingPoints: [
      "Preparation recap: warm lemon-salt water, prunes, Day-3 colon cleanse — colon must be ready.",
      "Week 1 schedule: Mon–Sun JOL servings per EVENTO DE SALUD table — Thu reduces midday; Fri–Sat skip midday.",
      "16 hours fasting / 8 hours eating — body clears toxins, depletes glycogen, begins autophagy at hour 16.",
      "Avoid mirrors and scales — trust the process; your written benchmark detects drift.",
      "Three live touchpoints per week in the REJU event — this daily session is your fourth anchor.",
    ],
    participantActions: [
      "Follow today's JOL volume from the Week 1 schedule table in Kat's Legacy.",
      "Complete full daily transformation log with photos.",
      "Confirm 16-hour fast window — write eating window times.",
      "Share one observation on Telegram (optional but encouraged).",
    ],
  },
  {
    day: 14,
    title: "Ketosis — Fat as Clean Fuel",
    bookChapter: "Chapter 8",
    courseSource: "Day 3 — Cetogenia, Cocina Cetogénica; Day 2 — Ayuno",
    durationMinutes: 10,
    meetingFocus:
      "Week 2 preview and ketosis science — the brain runs on ketones, not just glucose.",
    teachingPoints: [
      "Ketosis: liver converts fat to β-hydroxybutyrate, acetoacetate, acetone — anti-inflammatory brain and body fuel.",
      "Carbohydrate ceiling: ~20–50 g/day to maintain ketosis (Kat's Legacy Ch. 8).",
      "The brain uses glucose OR ketones — coconut oil and MCTs supply ketones; Dr. Mary Newport's Alzheimer's case used ketones for cognitive recovery.",
      "Ketogenic kitchen rules from course: no high-glycemic ingredients; max 25 g glycemic load per portion; cook low-temperature to preserve enzymes.",
      "Week 2 protocol: 20-hour fast, 4-hour eating window, three 500 ml JOL servings — deepest autophagy week.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 8.",
      "If entering Week 2: compress eating to 4-hour window today.",
      "Remove remaining high-carb items from your environment.",
      "Log ketosis signals: mental clarity, reduced bloating, breath change, energy stability.",
    ],
  },
  {
    day: 15,
    title: "Cellular Repair & The Body's Healing Intelligence",
    bookChapter: "Chapter 9",
    courseSource: "Day 2 — Neuroregeneración, Yamanaka; Chronic Illnesses article",
    durationMinutes: 10,
    meetingFocus:
      "The body heals itself when given the environment — surgery holds tissue; nutrition and fasting do the repair.",
    teachingPoints: [
      "Heart surgery sutures do not heal — they hold tissue while the body repairs (Chronic Illnesses article opening).",
      "Apoptosis: programmed cell death removes damaged cells — autophagy and ketosis support this precision.",
      "Neuroregeneration: peripheral nerves can regrow; ketones support brain repair (course + Newport case).",
      "Skin rejuvenation is external proof of internal repair — daily photos capture what memory forgets.",
      "Week 2 spiritual recommendation from Kat's Legacy: meditation, prayer, gratitude — stress reduction amplifies repair.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 9.",
      "Take comparison photos — same angles as Day 1.",
      "Practice 10-minute gratitude meditation or prayer.",
      "Log skin clarity, inflammation, and energy scores — trend over single days.",
    ],
  },
  {
    day: 16,
    title: "Mental Health, Meditation & Emotional Sustainability",
    bookChapter: "Chapter 6 + Four-Week Reset spiritual notes",
    courseSource: "Day 3 — Salud Mental; Curso de Salud GUIDE — Meditation (Wim Hof, Tolle, Dyer)",
    durationMinutes: 10,
    meetingFocus:
      "Sustainability requires mental architecture — air, water, food in that order; 3 minutes without air, 3 days without water, 30 days without food.",
    teachingPoints: [
      "Warning signs of mental health strain: sleep changes, isolation, numbness, unexplained pain, hopeless thoughts — seek professional help when needed.",
      "Meditation tools from course: Wim Hof Method (breath + cold), Eckhart Tolle (present moment), Wayne Dyer (intention), Anthony Robbins (Awaken the Giant Within).",
      "The Gospel of Thomas teaching (course spirituality): make inner like outer — alignment of imagined self and physical action.",
      "Sustainability = habits that survive after the event — ketogenic cooking, enzyme-preserving temperatures, pink salt + quality fats, glycemic discipline.",
      "Week 3 begins digestive reactivation — light solids while maintaining 16:8 and ketosis benefits.",
    ],
    participantActions: [
      "Read Kat's Legacy Chapter 6 (Energy & Digestion).",
      "Try one meditation method from today's session — log how you feel after.",
      "If on Week 3: introduce first light ketogenic meal per schedule.",
      "Write your sustainability plan: what habits continue after Day 20?",
    ],
  },
  {
    day: 17,
    title: "Week 3–4 Transition — Soups, Broth & Ketogenic Meals",
    bookChapter: "Four-Week Reset — Weeks 3 & 4",
    courseSource: "EVENTO DE SALUD — 3ra y 4ta Semana; 4 Week Program doc",
    durationMinutes: 10,
    meetingFocus:
      "Guide the gentle return to solids without losing ketosis, autophagy, or digestive gains.",
    teachingPoints: [
      "Week 3: reduce JOL volumes, introduce ketogenic meals (meat + vegetables) on Sat–Sun per schedule — 16:8 maintained.",
      "Week 4: morning JOL → bone broth midday → ketogenic dinner; vegetable soup 3× weekly; full ketogenic meals by weekend.",
      "Bone broth and vegetable soup provide collagen, minerals, and amino acids without shocking the gut.",
      "Sunday Week 3 optional: coffee colonics, sauna, massage — deep elimination celebration.",
      "Digestive reactivation 'wakes' the gut microbiome without overload — slow reintroduction is discipline, not weakness.",
    ],
    participantActions: [
      "Follow your week's schedule table from Kat's Legacy Four-Week Reset.",
      "Prepare bone broth or vegetable soup if scheduled this week.",
      "Log digestive response to reintroduced solids — bloating, energy, satisfaction.",
      "Maintain 16-hour fasting window regardless of food form.",
    ],
  },
  {
    day: 18,
    title: "Your Body's Language — Alerts, Benchmarks & Longevity",
    bookChapter: "Four-Week Reset — Final Reflections + Introduction goals",
    courseSource: "Curso de Salud GUIDE — Longevidad; Day 1 longevity alerts",
    durationMinutes: 10,
    meetingFocus:
      "Teach participants to read signals — dry mouth, skin spots, fatigue, cravings — as communication, not noise.",
    teachingPoints: [
      "Body alerts: dry mouth, dry skin, spots, aches, acne, fatigue, hair loss — each is a message, not random bad luck.",
      "Reset the alarms by responding with protocol adherence — not suppression with snacks or stimulants.",
      "Shift attention from taste pleasure to body need — the course calls this transforming gustatory attention to cellular necessity.",
      "Track elimination vs. intake volume — the Bolivia rule: elimination priority over ingestion.",
      "Define your optimal health baseline — a vitality state you can recognize, feel, and return to (Kat's Legacy Introduction).",
    ],
    participantActions: [
      "Re-read your Day 1 benchmark — compare honestly to today.",
      "List 3 body signals you now understand that you ignored before.",
      "Update Health Benchmark™ scores in daily log.",
      "Set your post-event maintenance non-negotiables (3 items max).",
    ],
  },
  {
    day: 19,
    title: "Healing Methods, Faith & the Rejuvenation Mindset",
    bookChapter: "Chapters 7–10 synthesis",
    courseSource: "Day 2 — Gerson, Warburg, Burzynski; The 4 Weeks Program spirituality",
    durationMinutes: 10,
    meetingFocus:
      "Connect science to spirit — gratitude, intention, and the 21-day habit architecture of transformation.",
    teachingPoints: [
      "Healing traditions converge: Gerson (plant nutrition), Warburg (oxygen + alkaline + no sugar), fasting (autophagy), JOL (cellular density).",
      "21-day significance from course: 3 weeks × 7 days — habit formation, adulthood metaphor, pattern completion.",
      "Masaru Emoto water intention (Kat's JOL preparation): consciousness in preparation affects the healing vehicle.",
      "Faith in healing = knowing repair is underway while symptoms fluctuate — gratitude before evidence.",
      "REJU Longevity Group™ is the bridge from event to life — this week prepares that handoff.",
    ],
    participantActions: [
      "Write a gratitude letter to your body — include it in your Transformation Book.",
      "Review all 19 prior daily log entries — notice the arc.",
      "Prepare celebration week intentions: how will you honor completion?",
      "Confirm book authoring password works for daily log submission.",
    ],
  },
  {
    day: 20,
    title: "Celebration, Maintenance & Authoring Your Legacy",
    bookChapter: "Four-Week Reset — After Completion + Full book arc",
    courseSource: "EVENTO DE SALUD — celebration week; Curso de Salud — 6-week structure",
    durationMinutes: 10,
    meetingFocus:
      "Close the 20-day instruction arc. Transition from cohort meetings to autonomous maintenance and book completion.",
    teachingPoints: [
      "Compare baseline photos and journal to today — the Transformation Book is already being written.",
      "Celebration week is not abandonment — it is integrated maintenance: ketogenic habits, JOL or soups, fasting rhythm, hydration.",
      "Corrective / preventive / autonomous maintenance (Day 1) — you now operate in autonomous mode with REJU support.",
      "Day 42 of the full 6-week event: contact REJU to compile your Personalized Transformation Book™.",
      "Kat's legacy lives through your documented transformation — science and love merged into your chapters.",
    ],
    participantActions: [
      "Take final comparison photos for this 20-day instruction arc.",
      "Download and archive all cohort materials from the Google Drive folder.",
      "Submit today's daily log with a comprehensive Today's Victory.",
      "Schedule your REJU Longevity Group™ continuation path on Telegram.",
    ],
    facilitatorNote: "Congratulate the cohort. Preview the next 22 days of the full 42-day event protocol.",
  },
];

export function sessionToMarkdown(session: CohortDailySession): string {
  const lines = [
    `## Day ${session.day} — ${session.title}`,
    ``,
    `**Duration:** ${session.durationMinutes} minutes max`,
    `**Kat's Legacy:** ${session.bookChapter}`,
    `**Course source:** ${session.courseSource}`,
    ``,
    `### Cohort meeting focus`,
    session.meetingFocus,
    ``,
    `### Teaching points (cover in session)`,
    ...session.teachingPoints.map((p) => `- ${p}`),
    ``,
    `### Participant actions (after session)`,
    ...session.participantActions.map((p) => `- ${p}`),
  ];
  if (session.facilitatorNote) {
    lines.push(``, `### Facilitator note`, session.facilitatorNote);
  }
  return lines.join("\n");
}

export function allSessionsToMarkdown(): string {
  const header = `# REJU Rejuvenation Event™
## 20-Day Cohort Daily Instructions

**Format:** One cohort meeting per day, maximum 10 minutes each.
**Language:** English (translated and adapted from the Bolivia Health Course — *Curso de Salud*).
**Alignment:** Kat's Legacy by Wilson Fischmann CA + REJU Protocol™ + Four-Week Reset Program.

**Materials folder (Google Drive):** ${COHORT_MATERIALS_DRIVE_FOLDER}

---

### How to use this guide

1. Facilitator leads a **10-minute live session** using the teaching points below.
2. Participants complete **participant actions** the same day.
3. Every action is logged in the **Daily Transformation Log** with Participant ID.
4. Sessions follow the **book chapter sequence** while integrating Bolivia course science.

---

`;
  return header + COHORT_DAILY_SESSIONS.map(sessionToMarkdown).join("\n\n---\n\n");
}