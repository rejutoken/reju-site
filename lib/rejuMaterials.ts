/** Google Workspace folder for cohort instructional materials */
export const COHORT_MATERIALS_DRIVE_FOLDER =
  "https://drive.google.com/drive/u/2/folders/1HxxLKwjjbRSd-5QgT7JWhLQA3Heq5X8B";

/** Google Workspace eventmaterials — research & knowledge library */
export const EVENT_MATERIALS_DRIVE_FOLDER =
  "https://drive.google.com/drive/u/2/folders/1lHo-fpI6yJ_j8Ze-ZwZNSE5fUV9rPLBB";

export interface MaterialDownload {
  id: string;
  title: string;
  description: string;
  /** Site-hosted path (served from /public) */
  localPath?: string;
  /** Google Drive file view link — add after uploading to the cohort folder */
  driveUrl?: string;
}

export const COHORT_DOWNLOADS: MaterialDownload[] = [
  {
    id: "20-day-instructions-pptx",
    title: "20-Day Cohort Instructions (PowerPoint)",
    description:
      "Emotional, facilitator-ready slide deck — 10-minute daily sessions with REJU branding. Present at cohort meetings.",
    localPath: "/materials/REJU-20-Day-Cohort-Instructions.pptx",
  },
  {
    id: "20-day-instructions",
    title: "20-Day Cohort Daily Instructions (PDF)",
    description:
      "Full written guide for facilitators — aligned with Kat's Legacy and the Bolivia Health Course material.",
    localPath: "/materials/20-day-cohort-daily-instructions.pdf",
  },
  {
    id: "four-week-reset",
    title: "Four-Week Reset Program (PDF)",
    description: "Fasting windows, Kat's JOL schedule, and phase-by-phase physiological guide.",
    localPath: "/materials/four-week-reset-program.pdf",
  },
  {
    id: "kats-jol-recipe",
    title: "Kat's JOL Recipe & Schedule (PDF)",
    description: "Juice of Life recipe, vegetable soup, bone broth, and weekly serving schedule.",
    localPath: "/materials/kats-jol-recipe.pdf",
  },
  {
    id: "body-city-system",
    title: "The Human Body as a City System (PDF)",
    description: "Teaching analogy for lymphatic, nervous, and circulatory systems — ideal for Day 2 sessions.",
    localPath: "/materials/body-city-system.pdf",
  },
  {
    id: "chronic-illnesses",
    title: "Chronic Illnesses & Diet in Healing (PDF)",
    description: "How nutrition influences cancer, diabetes, hypertension, obesity, and NAFLD — Warburg Effect.",
    localPath: "/materials/chronic-illnesses-diet-healing.pdf",
  },
  {
    id: "drive-folder",
    title: "Event Materials Library (Google Drive)",
    description: "Research archive — PDFs, PowerPoints, and course_event_info uploads.",
    driveUrl: EVENT_MATERIALS_DRIVE_FOLDER,
  },
  {
    id: "participant-agreement",
    title: "Participant Agreement & Disclaimers",
    description: "Legal terms, health disclaimers, and participation responsibilities.",
    driveUrl: EVENT_MATERIALS_DRIVE_FOLDER,
  },
  {
    id: "book-authoring",
    title: "Book Authoring Guide (PDF)",
    description: "How to structure daily entries, photos, and reflections for your Transformation Book.",
    localPath: "/materials/book-authoring-guide.pdf",
  },
  {
    id: "knowledge-library",
    title: "REJU Knowledge Library",
    description: "Password-protected research archive — course_event_info materials and health science library.",
    localPath: "/course-event-info",
  },
];

/** Markdown sources that have matching PDF copies in /public/materials */
export const MATERIALS_WITH_PDF = [
  "20-day-cohort-daily-instructions",
  "four-week-reset-program",
  "kats-jol-recipe",
  "body-city-system",
  "chronic-illnesses-diet-healing",
  "book-authoring-guide",
] as const;

export function resolveDownloadUrl(item: MaterialDownload): string {
  return item.localPath || item.driveUrl || COHORT_MATERIALS_DRIVE_FOLDER;
}