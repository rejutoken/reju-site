import {
  COHORT_MATERIALS_DRIVE_FOLDER,
  EVENT_MATERIALS_DRIVE_FOLDER,
} from "./rejuMaterials";

export type LibraryCategory =
  | "cohort-guides"
  | "protocol"
  | "research"
  | "book-authoring"
  | "archive";

export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  category: LibraryCategory;
  mdPath?: string;
  pdfPath?: string;
  pptxPath?: string;
  externalUrl?: string;
}

export const LIBRARY_CATEGORIES: Record<
  LibraryCategory,
  { label: string; description: string }
> = {
  "cohort-guides": {
    label: "Cohort Meeting Guides",
    description: "20-day facilitator sessions and presentation materials.",
  },
  protocol: {
    label: "Protocol & Nutrition",
    description: "Four-Week Reset, Kat's JOL, and program schedules.",
  },
  research: {
    label: "Research & Health Science",
    description: "Articles and teaching materials from the Bolivia Health Course.",
  },
  "book-authoring": {
    label: "Book Authoring",
    description: "How to build your Personalized REJU Transformation Book™.",
  },
  archive: {
    label: "Full Research Archive",
    description: "Google Drive library — past and new rejuvenation research.",
  },
};

export const COURSE_EVENT_LIBRARY: LibraryItem[] = [
  {
    id: "20-day-pptx",
    title: "20-Day Cohort Instructions (PowerPoint)",
    description: "Emotional facilitator deck — 10-minute daily cohort sessions.",
    category: "cohort-guides",
    pptxPath: "/materials/REJU-20-Day-Cohort-Instructions.pptx",
  },
  {
    id: "20-day-md",
    title: "20-Day Cohort Instructions (Written Guide)",
    description: "Full facilitator text for all 20 daily sessions.",
    category: "cohort-guides",
    mdPath: "/materials/20-day-cohort-daily-instructions.md",
    pdfPath: "/materials/20-day-cohort-daily-instructions.pdf",
  },
  {
    id: "four-week",
    title: "Four-Week Reset Program",
    description: "Fasting windows, Kat's JOL schedule, and phase-by-phase physiology.",
    category: "protocol",
    mdPath: "/materials/four-week-reset-program.md",
    pdfPath: "/materials/four-week-reset-program.pdf",
  },
  {
    id: "kats-jol",
    title: "Kat's JOL Recipe & Schedule",
    description: "Juice of Life, vegetable soup, bone broth, and serving times.",
    category: "protocol",
    mdPath: "/materials/kats-jol-recipe.md",
    pdfPath: "/materials/kats-jol-recipe.pdf",
  },
  {
    id: "body-city",
    title: "The Human Body as a City System",
    description: "Lymphatic, nervous, and circulatory systems teaching analogy.",
    category: "research",
    mdPath: "/materials/body-city-system.md",
    pdfPath: "/materials/body-city-system.pdf",
  },
  {
    id: "chronic-illness",
    title: "Chronic Illnesses & Diet in Healing",
    description: "Warburg Effect, diabetes, hypertension, obesity, and NAFLD.",
    category: "research",
    mdPath: "/materials/chronic-illnesses-diet-healing.md",
    pdfPath: "/materials/chronic-illnesses-diet-healing.pdf",
  },
  {
    id: "book-guide",
    title: "Book Authoring Guide",
    description: "Participant ID, daily log fields, 20 vs 42 days, and submission checklist.",
    category: "book-authoring",
    mdPath: "/materials/book-authoring-guide.md",
    pdfPath: "/materials/book-authoring-guide.pdf",
  },
  {
    id: "eventmaterials-drive",
    title: "Event Materials Library (Google Drive)",
    description: "All PDFs, research uploads, and cohort files — eventmaterials folder.",
    category: "archive",
    externalUrl: EVENT_MATERIALS_DRIVE_FOLDER,
  },
  {
    id: "cohort-drive",
    title: "Cohort Materials Folder (Google Drive)",
    description: "Participant-facing cohort downloads and shared event files.",
    category: "archive",
    externalUrl: COHORT_MATERIALS_DRIVE_FOLDER,
  },
];

export function itemsByCategory(category: LibraryCategory) {
  return COURSE_EVENT_LIBRARY.filter((item) => item.category === category);
}