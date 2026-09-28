import Link from "next/link";
import BlogThemeButtons from "../components/BlogThemeButtons";

export const metadata = {
  title: "REJU Blog | Event science & Transformation Book",
  description:
    "REJU research on the Rejuvenation Event, fasting, ketosis, autophagy, and the Transformation Book you author. Crypto desk is background only.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12">
      <header className="mb-10 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
          REJU Research
        </p>
        <h1 className="mb-4 text-xl font-semibold text-[#f5c26b]">
          Event science &amp; Transformation Book
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-400">
          Start with Rejuvenation. The Crypto desk is background only. Articles
          live on their own pages. This page is the map.
        </p>
      </header>

      <div className="mb-12">
        <BlogThemeButtons />
      </div>

      <div className="grid gap-8">
        <section className="rounded-3xl border border-[#f5c26b]/35 bg-[#120904]/90 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f5c26b]">
            Primary desk
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#f5c26b]">Rejuvenation</h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-gray-300">
            <p>
              The Rejuvenation blog is a teaching desk. Each article takes one
              relevant subject, fasting, ketosis, autophagy, cellular repair,
              immunity, lymphatic flow, and explains it in plain language so
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
              how to apply it: enter when enrollment opens, follow the protocol,
              and document what changes.
            </p>
          </div>
          <Link
            href="/blog/rejuvenation"
            className="mt-6 inline-flex font-bold text-[#f5c26b] hover:underline"
          >
            Open the Rejuvenation blog →
          </Link>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/25 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gray-500">
            Secondary / background
          </p>
          <h2 className="mt-2 text-xl font-semibold text-gray-300">Crypto</h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-gray-400">
            <p>
              The Event is the product. This desk is not the front of the brand.
              If you read here, read it as background. We sell a Rejuvenation
              Event and a book you author. The token is a Path B door into that
              Event, not the thing itself.
            </p>
            <p>
              These articles explain why REJU is designed as more than a ticker:
              a transparent token tied to a real operating system, Event access,
              education, and documented participation, so the market has a
              working example of how crypto can be made more honest.
            </p>
            <p>
              Read the desk if you want the industry context. Then go back to
              the Event and the book. Judge the design on its disclosures and
              practice, not on a launch date.
            </p>
          </div>
          <Link
            href="/blog/crypto"
            className="mt-6 inline-flex font-semibold text-gray-400 hover:text-[#f5c26b] hover:underline"
          >
            Open the Crypto blog →
          </Link>
        </section>
      </div>
    </div>
  );
}
