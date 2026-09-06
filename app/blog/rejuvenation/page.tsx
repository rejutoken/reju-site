import { BlogThemeIndex } from "../../components/BlogThemeIndex";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rejuvenation Blog | REJU",
  description:
    "REJU rejuvenation research: fasting, ketosis, autophagy, cellular renewal, and the Rejuvenation Event™.",
};

export default function RejuvenationBlogPage() {
  return <BlogThemeIndex theme="rejuvenation" />;
}
