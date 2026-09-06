import type { BlogTheme } from "./posts";

export type BlogThemeCopy = {
  id: BlogTheme;
  href: string;
  label: string;
  title: string;
  kicker: string;
  description: string;
};

export const BLOG_THEME_COPY: Record<BlogTheme, BlogThemeCopy> = {
  rejuvenation: {
    id: "rejuvenation",
    href: "/blog/rejuvenation",
    label: "Rejuvenation",
    title: "Rejuvenation",
    kicker: "Science, practice, documented transformation",
    description:
      "Fasting, ketosis, autophagy, cellular renewal, and the REJU Rejuvenation Event™ — written for people who want the science and the protocol.",
  },
  crypto: {
    id: "crypto",
    href: "/blog/crypto",
    label: "Crypto",
    title: "Crypto",
    kicker: "Transparent economics and long-horizon utility",
    description:
      "Why most tokens fade, what Rejunomics discloses, and how REJU ties a 6-month lock to Event access, education, and a book you author.",
  },
};

export const BLOG_THEME_ORDER: BlogTheme[] = ["rejuvenation", "crypto"];
