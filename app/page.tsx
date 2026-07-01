



import Nav from "./components/Nav";

const links = {
  home: "/",
  buy: "/buy",
  onboarding: "/onboarding",
  program: "/program",
  rejunomics: "/rejunomics",
  blog: "/blog",
  industry: "/crypto-industry-analysis-2026",
  telegramOfficial: "https://t.me/rejuofficial",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

const tokenomics = [
  { percent: "40%", title: "Public Market Release" },
  { percent: "20%", title: "Ecosystem Growth & Participation Awards" },
  { percent: "15%", title: "Team & Development" },
  { percent: "15%", title: "Treasury" },
  { percent: "10%", title: "Marketing & Expansion" },
];



export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-white" id="main-content">
      <Nav />

      <section className="px-6 py-16 text-center">
        <img src="/logo.png" alt="REJU Logo" className="mx-auto mb-6 w-32" />

        <h1 className="text-5xl font-bold tracking-tight text-[#f5c26b] sm:text-6xl md:text-8xl">
          REJU
        </h1>

        <h2 className="mt-4 text-xl font-bold leading-relaxed text-[#f5c26b] sm:text-2xl md:text-3xl">
          Participation-Driven Ecosystem™
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-300">
          Lock REJU. Transform in the Event. <strong>You Are Authoring Your Personalized REJU Transformation Book</strong>. Sustained by Rejunomics™.
        </p>
        <div className="mt-6">
          <a href="/daily-transformation-log" className="inline-block text-[#f5c26b] underline hover:no-underline text-lg">
            Start Authoring Your Personalized Book →
          </a>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#f5c26b]/15 bg-[#f5c26b]/[0.02] p-8 shadow-[0_0_10px_rgba(245,194,107,0.04)] backdrop-blur-sm">
          <p className="text-center text-lg font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
            REJU Differentiator
          </p>

          <h3 className="mt-6 text-left text-2xl font-bold leading-snug text-[#f5c26b]">
            A token engineered to be supported by its ecosystem.
          </h3>

          <p className="mt-5 text-left text-[1.05rem] font-normal leading-relaxed text-gray-300">
            REJU was designed with a{" "}
            <span className="font-bold text-[#f5c26b]">
              Renewable Economic Engine™
            </span>
            , where participation, utility, and business activity are structured
            to support ecosystem continuity beyond launch speculation.
          </p>

          <div className="mt-5 text-left text-[1.05rem] font-normal leading-relaxed text-gray-300">
            <h3 className="mt-8 text-left text-2xl font-bold leading-snug text-[#f5c26b]">
              REJU integrates:
            </h3>

            <ol className="ml-12 list-decimal text-lg text-gray-100 space-y-3">
              <li>
                <span className="mt-10 font-bold text-lg text-gray-100">
                  Transparent Holdings Disclosure:
                </span>{" "}
                visibility into allocations, holdings, locks, releases, and
                reward behavior.
              </li>

              <li>
                <span className="font-bold text-lg text-gray-100">
                  Renewable Economic Engine™ Disclosure:
                </span>{" "}
                visibility into the participation and business activity intended
                to support ongoing ecosystem continuity.
              </li>
            </ol>
          </div>

          <h3 className="mt-10 text-left text-2xl font-bold leading-snug text-[#f5c26b]">
            REJU Lifecycle™
          </h3>

          <p className="mt-5 text-left text-[1.05rem] font-normal leading-relaxed text-gray-300">
            Lock $600 in REJU for 6 months and participate in the REJU
            Rejuvenation Event™ without paying the standard program fee. At the
            end of the lock period, your REJU unlocks back to your wallet.
          </p>
          <p className="mt-4 text-left text-[1.05rem] font-normal leading-relaxed text-gray-300">
            Daily journaling throughout the Event becomes your REJU Transformation Book, 
            a personal record of rejuvenation, co-authored with REJU as editorial.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>
            Buy REJU
          </a>

          <a href={links.onboarding} className={buttonClass}>
            Enter REJU
          </a>

          <a href={links.program} className={buttonClass}>
            View Program
          </a>

          <a href={links.industry} className={buttonClass}>
            Industry Analysis
          </a>

          <a href="/blog" className={buttonClass}>
            Read REJU Research
          </a>
        </div>
      </section>

      {/* The REJU Transformation Book - prominent and coherent */}
      <section className="px-6 py-12 text-center bg-[#120904]/60">
        <div className="max-w-4xl mx-auto">
          <p className="uppercase tracking-[0.3em] text-sm text-[#f5c26b] mb-3">The Heart of Participation</p>
          <h2 className="text-4xl font-bold text-[#f5c26b] mb-6">You Are Authoring Your Personalized REJU Transformation Book</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            When you go through the REJU Rejuvenation Event, you are <strong>Authoring Your Personalized REJU Transformation Book</strong>.
            Every journal entry, photo, and reflection is a chapter you write. You are the Author. REJU is editorial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/daily-transformation-log" className={buttonClass}>
              Start Authoring Your Personalized Book
            </a>
            <a href="/program" className={buttonClass}>
              Discover the Event
            </a>
          </div>
        </div>
      </section>

     <section className="px-4 py-8 sm:py-12">
  <div
    id="tokenomics"
    className="mx-auto mt-16 w-full max-w-7xl overflow-hidden rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/90 p-4 shadow-[0_0_35px_rgba(245,194,107,0.14)] backdrop-blur-md sm:p-6 md:p-8"
  >
    <div className="text-center">
      <h2 className="text-3xl font-bold uppercase tracking-[0.12em] text-[#f5c26b] sm:text-4xl md:text-5xl">
        TOKENOMICS
      </h2>
    </div>

    <div className="mt-8 rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-4 sm:p-6 md:p-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="min-w-0">
          <div className="mt-6 grid gap-3">
            {tokenomics.map((item) => (
              <div
                key={item.title}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-4"
              >
                <span className="min-w-0 text-base font-semibold text-gray-300 sm:text-xl">
                  {item.title}
                </span>

                <span className="shrink-0 text-lg font-bold text-[#f5c26b] sm:text-xl">
                  {item.percent}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center">
          <div className="relative h-48 w-48 rounded-full border border-[#f5c26b]/40 bg-[conic-gradient(#f5c26b_0_40%,#d89b45_40%_60%,#9f6d2e_60%_75%,#6b471d_75%_90%,#3a2410_90%_100%)] shadow-[0_0_35px_rgba(245,194,107,0.18)] sm:h-64 sm:w-64 md:h-80 md:w-80">
            <div className="absolute left-[74%] top-[42%] text-base font-bold text-black sm:text-xl">40%</div>
            <div className="absolute left-[47%] top-[75%] text-base font-bold text-black sm:text-xl">20%</div>
            <div className="absolute left-[15%] top-[65%] text-base font-bold text-white sm:text-xl">15%</div>
            <div className="absolute left-[15%] top-[32%] text-base font-bold text-white sm:text-xl">15%</div>
            <div className="absolute left-[35%] top-[14%] text-base font-bold text-white sm:text-xl">10%</div>
          </div>

          <p className="mt-5 text-center text-base text-gray-400 sm:text-xl">
            Allocation view
          </p>
        </div>
      </div>
    </div>
	
	
	

            <h3 className="mx-auto mt-6 max-w-4xl text-center text-xl font-bold leading-snug text-[#f5c26b] sm:text-2xl">
              <a
                href={links.rejunomics}
                className="font-semibold hover:underline"
              >
                Rejunomics™: The transparent foundation that expands tokenomics
                by disclosing token intent and allocation behavior.
              </a>
            </h3>
		  
		  <div className="mt-8 rounded-3xl border border-[#f5c26b]/30 bg-black/35 p-6 md:p-8">
            <div className="text-center">
              <p className="text-2xl font-bold uppercase tracking-[0.14em] text-[#f5c26b] sm:text-3xl sm:tracking-[0.28em]">
                Rejunomics™
              </p>

              <h3 className="mt-4 font-bold text-[#f5c26b] md:text-2xl">
                Transparency and Ecosystem Continuity Disclosure
              </h3>

              <p className="mx-auto mt-6 max-w-3xl text-left text-lg text-gray-300">
                Rejunomics™ reveals holdings, release schedules, finite incentives, and the mechanisms that support long-term continuity, so your personal transformation is backed by a transparent, enduring economy.
              </p>

              <a
                href={links.rejunomics}
                className="mt-6 inline-block font-semibold text-[#f5c26b] hover:underline"
              >
                See how Rejunomics™ powers lasting participation →
              </a>
            </div>

           <div className="mt-10 grid gap-6 lg:grid-cols-3">
  <FrameworkCard
    title="Transparent Holdings Disclosure™"
    subtitle="Where the holdings are and how they may behave."
    items={[
      "Allocation percentages",
      "Designated REJU holdings",
      "Lock periods",
      "Release schedules",
      "Reward distribution behavior",
    ]}
  />

  <FrameworkCard
    title="Token Life Disclosure™"
    subtitle="What is intended to support token continuity beyond launch."
    items={[
      "Token survivability intent",
      "Finite incentive disclosure",
      "Post-incentive continuity",
      "Business activity support",
      "Long-term ecosystem participation",
    ]}
  />

  <FrameworkCard
    title="Renewable Economic Engine™ Disclosure"
    subtitle="The mechanism designed to support Token Life."
    items={[
      "REJU Lifecycle™",
      "Participation pathways",
      "Incentives funded by REJU holdings",
      "Business activity continuity",
      "Expansion and participation mechanisms",
    ]}
  />
</div>

            <div className="mt-10 grid gap-5">
              <DisclosureRow
                percent="40%"
                title="Public Market Release"
                purpose={["Initial circulation", "Public access", "Market availability"]}
                behavior={["Released at launch", "Available for open market trading"]}
              />

              <DisclosureRow
                percent="20%"
                title="Ecosystem Growth & Participation Awards"
                purpose={[
                  "Completion awards",
                  "CRP certification awards",
                  "Referral participation awards",
                  "Early ecosystem growth",
                ]}
                behavior={[
                  "Funded from designated REJU incentive allocations",
                  "Available while those designated REJU allocations remain available",
                  "Referral awards distributed 33.3% immediately and 66.7% locked for 6 months",
                  "Startup and participation incentives may be adjusted as the ecosystem matures",
                ]}
              />

              <DisclosureRow
                percent="15%"
                title="Team & Development"
                purpose={["Development", "Infrastructure", "Execution support"]}
                behavior={["Locked for 6 months", "Progressive release after lock, 1.5% monthly"]}
              />

              <DisclosureRow
                percent="15%"
                title="Treasury"
                purpose={["Operational reserve", "Infrastructure continuity", "Strategic needs"]}
                behavior={["Held for strategic use", "Supports execution, stability, and continuity planning"]}
              />

              <DisclosureRow
                percent="10%"
                title="Marketing & Expansion"
                purpose={["Visibility", "Community growth", "Expansion support"]}
                behavior={["Supports growth campaigns", "Supports communication, reach, and ecosystem expansion"]}
              />
            </div>

            <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/70 p-6 md:p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold uppercase tracking-[0.12em] text-[#f5c26b] sm:text-3xl md:text-4xl md:tracking-[0.18em]">
                  Renewable Economic Engine™
                </h2>

                <p className="mx-auto mt-4 max-w-4xl text-gray-300">
                  REJU separates finite incentives from long-term business
                  activity so investors can see what depends on designated REJU
                  holdings and what is intended to continue through ecosystem
                  operations.
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <EngineCard
                  title="REJU Lifecycle™"
                  text="Lock $600 in REJU for 6 months and participate in the Rejuvenation Event™ without paying the standard program fee. At the end of the lock period, REJU unlocks back to the participant’s wallet."
                />

                <EngineCard
                  title="Incentives Funded by REJU Holdings"
                  text="Referral rewards, completion rewards, CRP rewards, and participation incentives are funded from designated REJU allocations and remain available while those allocations last."
                />

                <EngineCard
                  title="Business Activity Continuity"
                  text="Fiat program enrollment, Rejuvenation Events, Longevity Group activity, educational services, and future ecosystem services are designed to continue independently of remaining REJU incentive allocations."
                />
              </div>

              <p className="mx-auto mt-8 max-w-4xl text-center text-base font-semibold leading-relaxed text-gray-300">
                The Renewable Economic Engine™ is designed to connect token
                participation with real ecosystem activity, while clearly
                separating finite allocation-funded incentives from
                business-funded continuity.
              </p>
            </div>
          </div>
        </div>

        <InfrastructureSection />
      </section>

      <section className="px-6 py-12 sm:py-20 text-center">
        <h2 className="text-4xl font-bold text-[#f5c26b]">Enter REJU™</h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Participation-driven ecosystem access.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>
            Buy REJU
          </a>

          <a href={links.onboarding} className={buttonClass}>
            Start Onboarding
          </a>

          <a href={links.program} className={buttonClass}>
            View Program
          </a>

          <a
            href={links.telegramOfficial}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            Join Telegram
          </a>
        </div>
      </section>
    </main>
  );
}

function InfrastructureSection() {
  return (
    <div className="mx-auto mt-24 max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.16)]">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-[#f5c26b]">
          REJU Participation Infrastructure™
        </h2>

        <p className="mt-3 text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
          Three Ways to Enter REJU
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <EntryCard
          letter="A"
          title="Buy REJU"
          text="Buy REJU as an investment token."
          items={["No lock required", "Full flexibility"]}
        />

        <EntryCard
          letter="B"
          title="Lock REJU"
          text="Lock $600 in REJU for 6 months and enter the ecosystem path."
          items={["Program participation included", "REJU stays in your wallet"]}
        />

        <EntryCard
          letter="C"
          title="Direct Program Entry"
          text="Enter the program directly without locking REJU."
          items={["No REJU lock required", "Standard enrollment path"]}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-[#f5c26b]/40 bg-[#120904] p-5 text-center text-xl font-bold text-gray-300">
        All participants in groups B and C above pay the{" "}
        <span className="text-[#f5c26b]">$69 Book + Admin fee.</span>
      </div>

      <h3 className="mt-12 text-center text-2xl font-bold text-[#f5c26b]">
        The REJU Participation Flow — You Are Authoring the Book
      </h3>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FlowStep number="1" title="Buy or Hold REJU" text="Acquire and hold REJU in your wallet." />
        <FlowStep number="2" title="Lock REJU" text="Lock $600 in REJU for 6 months." />
        <FlowStep number="3" title="Submit Verification" text="Submit proof of participation." />
        <FlowStep number="4" title="Receive Cohort Access" text="Gain access to your assigned cohort." />
        <FlowStep number="5" title="Complete the Program" text="Participate + Journal daily." />
        <FlowStep number="6" title="Author Your Book" text="You are Authoring Your Personalized REJU Transformation Book." />
        <FlowStep number="7" title="Sustain & Share" text="Supported by transparent Rejunomics™." />
      </div>

      <div className="mx-auto mt-10 max-w-7xl rounded-2xl border border-[#f5c26b]/40 bg-[#120904] p-6 text-center">
        <h3 className="text-2xl font-bold text-[#f5c26b]">
          You Maintain Control
        </h3>

        <p className="mt-3 text-gray-300">
          REJU never takes custody of your funds. Your REJU stays in your wallet
          while the lock structure verifies participation.
        </p>
      </div>

      <h3 className="mt-12 text-center text-2xl font-bold text-[#f5c26b]">
        Why Investors Trust REJU
      </h3>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <TrustCard title="Secure Locking" text="Your REJU stays in your wallet." />
        <TrustCard title="Transparent Verification" text="Clear and auditable participation verification." />
        <TrustCard title="Limited Cohorts" text="Structured participation with controlled scaling." />
        <TrustCard title="Merit-Based Access" text="Participation through commitment and verification." />
        <TrustCard title="Aligned Incentives" text="Participation rewards tied to ecosystem growth." />
      </div>

      <div className="mt-8 rounded-2xl border border-[#f5c26b]/30 bg-black/40 p-5 text-center font-semibold text-gray-300">
        REJU is built on transparency and long-term value creation.{" "}
        <span className="text-[#f5c26b]">Participation-Driven Ecosystem.</span>
      </div>
    </div>
  );
}

function SmallCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/10 bg-[#120904]/55 p-6">
      {children}
    </div>
  );
}

function Box({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/20 p-3 text-center text-lg text-gray-300">
      {text}
    </div>
  );
}

function FrameworkCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/75 p-6">
      <h4 className="text-2xl font-bold text-[#f5c26b]">{title}</h4>
      <p className="mt-3 text-lg leading-relaxed text-gray-300">{subtitle}</p>

      <ul className="mt-5 space-y-2 text-lg text-gray-300">
        {items.map((item, index) => (
          <li key={index}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function DisclosureRow({
  percent,
  title,
  purpose,
  behavior,
}: {
  percent: string;
  title: string;
  purpose: string[];
  behavior: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-[90px_1fr]">
        <div className="text-3xl font-bold text-[#f5c26b]">{percent}</div>

        <h3 className="text-xl font-bold text-[#f5c26b]">{title}</h3>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DisclosureBlock label="Purpose" items={purpose} />
        <DisclosureBlock label="Disclosure" items={behavior} />
      </div>
    </div>
  );
}

function DisclosureBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 p-4">
      <h4 className="font-bold text-[#f5c26b]">{label}</h4>

      <ul className="mt-3 space-y-2 text-lg leading-relaxed text-gray-300">
        {items.map((item, index) => (
          <li key={index} className="flex gap-2">
            <span className="text-[#f5c26b]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EngineCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 p-6">
      <h4 className="text-xl font-bold text-[#f5c26b]">{title}</h4>
      <p className="mt-4 text-lg leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function EntryCard({
  letter,
  title,
  text,
  items,
}: {
  letter: string;
  title: string;
  text: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-6 text-left">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#f5c26b] text-lg font-bold text-[#f5c26b]">
        {letter}
      </div>

      <h3 className="text-left text-2xl font-bold uppercase text-[#f5c26b]">
        {title}
      </h3>

      <p className="mt-3 text-left text-gray-300">{text}</p>

      <ul className="mt-5 space-y-2 text-lg text-gray-300">
        {items.map((item, index) => (
          <li key={index}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FlowStep({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/25 bg-[#120904]/90 p-5">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5c26b] text-lg font-bold text-black">
        {number}
      </div>

      <h4 className="font-bold text-[#f5c26b]">{title}</h4>
      <p className="mt-2 text-lg leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/30 p-4 text-center">
      <h4 className="font-bold text-[#f5c26b]">{title}</h4>
      <p className="mt-2 text-lg leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}
