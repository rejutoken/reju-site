import { BlogThemeIndex } from "../../components/BlogThemeIndex";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crypto Blog | REJU",
  description:
    "REJU crypto research: token utility, Rejunomics, industry survival, and long-horizon ecosystem design.",
};

export default function CryptoBlogPage() {
  return <BlogThemeIndex theme="crypto" />;
}
