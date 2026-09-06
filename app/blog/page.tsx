import Link from "next/link";
import BlogThemeButtons from "../components/BlogThemeButtons";

export const metadata = {
  title: "REJU Blog | Rejuvenation and Crypto",
  description:
    "Two REJU research desks: science-informed rejuvenation, and transparent crypto through Rejunomics™.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
          REJU Research
        </p>
        <h1 className="mb-4 text-xl font-semibold text-[#f5c26b]">Blog</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-400">
          Choose a desk. Articles live on their own pages. This page is the map.
        </p>
      </header>

      <div className="mb-12">
        <BlogThemeButtons />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <section className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-8">
          <h2 className="text-xl font-semibold text-[#f5c26b]">Rejuvenation</h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-gray-300">
            <p>
              The Rejuvenation blog is a teaching desk. Each article takes one
              relevant subject — fasting, ketosis, autophagy, cellular repair,
              immunity, lymphatic flow — and explains it in plain language so
              you can see how renewal actually works in the body.
            </p>
            <p>
              This site is built so those subjects do not stay theoretical. Read
              an article to understand the science, then use the Rejuvenation
              Event™, the Health Benchmark™, and your Transformation Book to
              put the same ideas into a structured six-week practice.
            </p>
            <p>
              Start here when you need a topic. Open the article that matches
              the question you have. From there, the rest of REJU shows you
              how to apply it: lock or enroll, follow the protocol, and
              document what changes.
            </p>
          </div>
          <Link
            href="/blog/rejuvenation"
            className="mt-6 inline-flex font-bold text-[#f5c26b] hover:underline"
          >
            Open the Rejuvenation blog →
          </Link>
        </section>

        <section className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-8">
          <h2 className="text-xl font-semibold text-[#f5c26b]">Crypto</h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-gray-300">
            <p>
              The Crypto blog is the public record of Rejunomics™ — REJU’s
              model for disclosing how tokens are allocated, released, and
              kept useful after the launch window. That framework was written
              before the CLARITY Act. The Act now moves the industry toward
              the same demand: clear rules, visible economics, and projects
              that can explain what happens after hype fades.
            </p>
            <p>
              We are waiting for the right time to launch. In the meantime
              these articles show why REJU is designed as more than a ticker:
              a transparent token tied to a real operating system — a six-month
              lock, Event access, education, and documented participation —
              so the market has a working example of how crypto can be made
              more honest.
            </p>
            <p>
              That is the basis for our confidence. REJU is built as a
              long-horizon commitment: the first token in this category to
              pair full economic transparency with an actual system that
              improves how the industry treats participants. Read the desk,
              then judge the design on its disclosures, not on a launch date.
            </p>
          </div>
          <Link
            href="/blog/crypto"
            className="mt-6 inline-flex font-bold text-[#f5c26b] hover:underline"
          >
            Open the Crypto blog →
          </Link>
        </section>
      </div>
    </div>
  );
}
