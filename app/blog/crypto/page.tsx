import { BlogThemeIndex } from "../../components/BlogThemeIndex";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crypto Blog | REJU",
  description:
    "The token is a door into the Rejuvenation Event. This desk is background, not the product.",
};

export default function CryptoBlogPage() {
  return <BlogThemeIndex theme="crypto" />;
}
