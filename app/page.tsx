import Nav from "./components/Nav";
import SiteNewsBanner from "./components/SiteNewsBanner";

const links = {
  program: "/program",
  onboarding: "/onboarding",
  book: "/daily-transformation-log",
  buy: "/buy",
  telegramOfficial: "https://t.me/rejuofficial",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

const primaryButtonClass =
  "rounded-full border border-[#f5c26b] bg-[#f5c26b] px-8 py-3 text-center font-semibold text-black transition duration-300 hover:bg-[#ffd88a]";

export default function Home() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-white"
      id="main-content"
    >
      <Nav />

      <section className="px-6 py-16 text-center">
        <img src="/logo.png" alt="REJU Logo" className="mx-auto mb-6 w-32" />

        <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          Science by Nature. Engineered for Life.
        </p>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-[#f5c26b] sm:text-6xl md:text-7xl">
          Rejuvenate in 6 weeks.
        </h1>
        <h2 className="mx-auto mt-6 max-w-3xl text-xl font-semibold leading-relaxed text-[#f5c26b] sm:text-2xl">
          Rejuvenation, by renewing your health.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">
          That is the product. The Rejuvenation Event™ is one structured path: you renew your health,
          you document the days, and you leave with a Transformation Book that is yours. You set a
          Health Benchmark™, follow the REJU Protocol™, and author the book. REJU is the editorial
          partner. You are the author.
        </p>

        <SiteNewsBanner />

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.program} className={primaryButtonClass}>
            See the Event
          </a>
          <a href={links.onboarding} className={buttonClass}>
            How you enter
          </a>
          <a href={links.book} className={buttonClass}>
            Author your book
          </a>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#f5c26b]">The Event</p>
          <h2 className="mt-3 text-3xl font-bold text-[#f5c26b]">Rejuvenate in 6 weeks.</h2>
          <p className="mt-5 text-left text-lg leading-relaxed text-gray-300">
            Rejuvenation is the product. It is done by renewing your health — one sequence, not
            eleven protocols in a cart: preparation, four core weeks of the REJU Protocol™, then a
            week to see what you documented.
          </p>
          <ul className="mt-6 space-y-3 text-left text-lg text-gray-300">
            <li>Health Benchmark™ — your honest Day 1, same place, same light, same camera.</li>
            <li>REJU Protocol™ — the structured weeks from Kat&apos;s Legacy.</li>
            <li>Daily journal — each day becomes a chapter.</li>
            <li>Limited cohorts — a group you can finish with.</li>
          </ul>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <QuietCard
            title="Daily system"
            text="Journal the day. Progress selfies in the same place, same light, same camera. That is the input for the book you are writing."
          />
          <QuietCard
            title="Transformation Book"
            text="At the end you hold a publishable hard-cover record of your recovery. You write every chapter. REJU edits and produces."
          />
          <QuietCard
            title="Kat's Legacy"
            text="The $69 science-based guide for the Event — lymphatic flow, ketosis, autophagy, and the protocol you actually follow."
          />
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#f5c26b]/20 bg-black/40 p-8">
          <p className="text-center text-sm font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
            How you enter
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold text-[#f5c26b]">The token is a door.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-gray-300">
            We sell rejuvenation. Rejuvenate in 6 weeks by renewing your health. The token is a door,
            not the product. Paths B and C also include Kat&apos;s Legacy ($69). Enrollment opens when
            this site says it is open.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <EntryCard
              letter="A"
              title="Hold REJU"
              text="Hold the token. No Event. Full flexibility."
            />
            <EntryCard
              letter="B"
              title="Lock $600 REJU"
              text="Lock six months on Streamflow. Non-custodial — you keep the keys. That lock opens the Event and the book."
            />
            <EntryCard
              letter="C"
              title="Pay $600"
              text="Pay fiat. Same Event, same book, no lock."
            />
          </div>
          <p className="mx-auto mt-8 max-w-3xl text-center text-base text-gray-400">
            Built to trust. Transparency. You keep the keys.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href={links.onboarding} className={buttonClass}>
              How you enter
            </a>
            <a href={links.buy} className={buttonClass}>
              Buy REJU
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 text-center">
        <h2 className="text-3xl font-bold text-[#f5c26b]">Rejuvenate in 6 weeks</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
          Rejuvenation is the product. You do it by renewing your health. Then write the book.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.program} className={primaryButtonClass}>
            See the Event
          </a>
          <a href={links.onboarding} className={buttonClass}>
            How you enter
          </a>
          <a href={links.book} className={buttonClass}>
            Author your book
          </a>
          <a
            href={links.telegramOfficial}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            Telegram
          </a>
        </div>
      </section>
    </main>
  );
}

function QuietCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-6 text-left">
      <h3 className="text-xl font-bold text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-lg leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function EntryCard({ letter, title, text }: { letter: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-6 text-left">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#f5c26b] text-lg font-bold text-[#f5c26b]">
        {letter}
      </div>
      <h3 className="text-xl font-bold uppercase text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-gray-300">{text}</p>
    </div>
  );
}
