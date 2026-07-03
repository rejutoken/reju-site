import { SITE_NEWS } from "@/lib/siteNews";

export default function SiteNewsBanner() {
  return (
    <div
      className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#f5c26b]/35 bg-[#1a1008]/90 px-6 py-5 text-left shadow-[0_0_24px_rgba(245,194,107,0.08)]"
      role="status"
      aria-live="polite"
    >
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
        {SITE_NEWS.headline}
      </p>
      {SITE_NEWS.launchDate && (
        <p className="mt-2 text-sm font-semibold text-white">
          Launch: {SITE_NEWS.launchDate}
        </p>
      )}
      <p className="mt-3 text-base leading-relaxed text-gray-300">{SITE_NEWS.message}</p>
    </div>
  );
}