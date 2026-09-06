import Link from "next/link";
import type { BlogTheme } from "@/lib/posts";

const BUTTONS: { theme: BlogTheme; href: string; label: string }[] = [
  { theme: "rejuvenation", href: "/blog/rejuvenation", label: "Rejuvenation" },
  { theme: "crypto", href: "/blog/crypto", label: "Crypto Posts" },
];

export default function BlogThemeButtons({
  active,
}: {
  active?: BlogTheme;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BUTTONS.map((button) => {
        const isActive = active === button.theme;
        return (
          <Link
            key={button.theme}
            href={button.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-16 items-center justify-center rounded-2xl border px-4 py-5 text-center text-xl font-bold transition ${
              isActive
                ? "border-[#f5c26b] bg-[#f5c26b] text-black"
                : "border-[#f5c26b]/50 bg-[#120904] text-[#f5c26b] hover:border-[#f5c26b] hover:bg-[#f5c26b] hover:text-black"
            }`}
          >
            {button.label}
          </Link>
        );
      })}
    </div>
  );
}
