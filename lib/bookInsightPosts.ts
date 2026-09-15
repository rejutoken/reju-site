/** Teaching posts from the published PDF. Cite the full title so Amazon search does not hit another "Kat's Legacy". */

export const BOOK_FULL_TITLE =
  "Kat's Legacy: A Science-Based Path to Healing and Longevity";

export type BookInsightPost = {
  themes: string[];
  text: string;
};

export const BOOK_INSIGHT_POSTS: BookInsightPost[] = [
  {
    themes: ["health", "event", "immunity"],
    text: "A 12-oz soda holds about 39g of sugar. One a day is roughly 51,100 extra calories a year, about 14.6 lbs if you do not burn them. Chapter 5, pages 28-29 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["health", "immunity", "event"],
    text: "Sugar is not only candy. It hides in sauces, breads, and drinks. Otto Warburg found cancer cells prefer sugar for energy and make the tissue more acidic. Chapter 5, pages 28-33 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["lymphatic", "event", "health"],
    text: "Alkaline water is made by electrolysis or by adding minerals that raise pH. The book names magnesium, calcium, and potassium as the main minerals. Chapter 11, pages 67-68 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["lymphatic", "health", "event"],
    text: "Magnesium in alkaline water supports muscle, nerve, and heart rhythm. Calcium supports bone and nerve function. Potassium is listed with them. Chapter 11, pages 67-68 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["ketosis", "event", "health"],
    text: "What is ketosis? Drop carbs to about 20-50g a day. The liver turns stored fat into ketones: BHB, acetoacetate, and acetone. The brain can run on those. Chapter 8, pages 46-47 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["ketosis", "cellular_repair"],
    text: "How ketosis works: glucose runs low, the liver breaks down fat, ketone bodies circulate and fuel organs. The book calls this anti-inflammatory fuel. Chapter 8, pages 46-47 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["health", "cellular_repair"],
    text: "At about 16 hours of fasting, autophagy begins. Cells recycle damaged parts and inflammation can drop. Week 1 of the 4-Week Reset. Chapter 7 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["cellular_repair", "ketosis"],
    text: "Week 2 uses longer fasting so ketosis deepens and cells repair after the cleanup. Autophagy clears. Repair rebuilds. Chapters 8-9 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["lymphatic", "event"],
    text: "The lymphatic system has no pump. It moves with hydration and motion. That is why Chapter 1 starts the healing path there. Kat's Legacy: A Science-Based Path to Healing and Longevity, Chapter 1.",
  },
  {
    themes: ["immunity", "health"],
    text: "Chapter 2 treats immunity as a defense army. Fasting and ketosis lower inflammatory noise so that army stays calibrated. Kat's Legacy: A Science-Based Path to Healing and Longevity, Chapter 2.",
  },
  {
    themes: ["event", "cellular_repair", "health", "immunity"],
    text: "How to heal yourself: the body is a self-healing machine. It repairs bone, skin, and daily wear every day. About 6 in 10 adults live with a chronic illness. Chapter 9, page 51 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["event", "health", "cellular_repair"],
    text: "The Healing Section starts on page 74: Program to Restore Your Health. A Four-Week Reset. Prep 3 days, Week 1 detox, Week 2 cellular repair, Week 3 solids, Week 4 maintenance. Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["event", "health", "lymphatic"],
    text: "How to heal yourself in that section: super-hydrate first. Liters of water per day = your weight in kg divided by 30. Then fasting plus Kat's JOL. Pages 74-76 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["event", "cellular_repair", "health"],
    text: "Detoxification opens the path to healing. Toxins come from air, processed food, medicines, and metabolism. The liver leads the cleanup crew. Chapter 10, pages 59-61 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
  {
    themes: ["event", "ketosis", "health"],
    text: "The Healing Section Reset is built to eliminate toxins, turn on autophagy, switch to fat fuel (ketosis), then reintroduce real food. Pages 74-75 of Kat's Legacy: A Science-Based Path to Healing and Longevity.",
  },
];

export function pickBookInsightPost(
  themeId: string,
  variantSeed: number
): string | null {
  const matching = BOOK_INSIGHT_POSTS.filter((post) => post.themes.includes(themeId));
  const pool = matching.length > 0 ? matching : BOOK_INSIGHT_POSTS;
  if (pool.length === 0) return null;
  return pool[variantSeed % pool.length].text;
}
