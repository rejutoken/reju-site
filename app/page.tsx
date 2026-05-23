const links = {
  home: "/",
  buy: "/buy",
  onboarding: "/onboarding",
  program: "/program",
  rejunomics: "/rejunomics",
  telegramCommunity: "https://t.me/rejutokencommunity",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href={links.home} className="font-bold text-[#f5c26b]">REJU</a>

        <div className="hidden gap-6 text-sm text-gray-300 md:flex">
          <a href={links.buy} className="hover:text-[#f5c26b]">Buy REJU</a>
          <a href="#tokenomics" className="hover:text-[#f5c26b]">Tokenomics</a>
          <a href={links.rejunomics} className="hover:text-[#f5c26b]">Rejunomics</a>
          <a href={links.program} className="hover:text-[#f5c26b]">Program</a>
          <a href={links.onboarding} className="hover:text-[#f5c26b]">Onboarding</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className="hover:text-[#f5c26b]">Telegram</a>
        </div>
      </nav>

      <section className="px-6 py-16 text-center">
        <img src="/logo.png" alt="REJU Logo" className="mx-auto mb-6 w-32" />

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
          Current Stage: Early Access Cohorts
        </p>

        <h1 className="text-6xl font-bold tracking-tight text-[#f5c26b] md:text-8xl">
          REJU
        </h1>

        <h2 className="mt-4 text-2xl font-bold leading-relaxed text-[#f5c26b] md:text-3xl">
          Rejuvenation Ecosystem™
        </h2>

        <div className="mx-auto mt-10 max-w-6xl rounded-3xl border border-[#f5c26b]/50 bg-[#f5c26b]/10 p-6 shadow-[0_0_45px_rgba(245,194,107,0.22)] backdrop-blur-md md:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
            REJU Differentiator
          </p>

          <h3 className="mt-4 text-2xl font-bold leading-snug text-[#f5c26b] md:text-4xl">
            A token engineered to be sustained by its ecosystem.
          </h3>

          <p className="mx-auto mt-5 max-w-5xl text-lg font-semibold leading-relaxed text-gray-100 md:text-xl">
            REJU was designed as a regenerative ecosystem where utility, participation, and ecosystem activity reinforce long-term sustainability beyond speculation.
          </p>

          <p className="mx-auto mt-5 max-w-5xl text-lg font-semibold leading-relaxed text-gray-100 md:text-xl">
            Unlike traditional token models dependent on hype cycles, REJU integrates token participation into an operational structure engineered for long-term continuity and supported by a transparent release disclosure system designed to reinforce investor trust.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>Buy REJU</a>
          <a href={links.onboarding} className={buttonClass}>Enter REJU</a>
          <a href={links.program} className={buttonClass}>View Program</a>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <SmallCard>
            <h2 className="text-center text-2xl font-bold text-[#f5c26b]">REJU Ecosystem™</h2>
            <p className="mt-4 text-center text-sm text-gray-300">
              A participation-driven rejuvenation ecosystem designed around education, guided cohorts, certification, accountability, and longevity-oriented participation.
            </p>
            <div className="mt-6 grid gap-3">
              <Box text="REJU Rejuvenation Event™" />
              <Box text="Kat’s Legacy foundation" />
              <Box text="REJU Protocol™" />
              <Box text="CRP certification structure" />
              <Box text="Guided cohort participation" />
              <Box text="REJU Longevity Group™" />
            </div>
          </SmallCard>

          <SmallCard>
            <h2 className="text-center text-2xl font-bold text-[#f5c26b]">REJU Holdings Release Transparency</h2>
            <p className="mt-4 text-center text-sm text-gray-300">
              REJU introduces a transparent disclosure structure designed to show how holdings, locks, rewards, reserves, and releases are intended to behave over time.
            </p>
            <div className="mt-6 grid gap-3">
              <Box text="Why tokens are held" />
              <Box text="When they may release" />
              <Box text="What conditions apply" />
              <Box text="Which holdings are locked" />
              <Box text="How rewards enter circulation" />
              <Box text="What intent the release shows" />
            </div>
          </SmallCard>
        </div>

        <div id="tokenomics" className="mx-auto mt-16 max-w-7xl rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)] backdrop-blur-md">
          <div className="text-center">
            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Tokenomics with REJU Transparent Release Disclosure
            </h2>
          </div>

          <div className="mt-10 grid gap-5">
            <DisclosureRow
              percent="20%"
              title="Ecosystem Growth & Participation Awards"
              purpose={[
                "Participant completion awards for qualified REJU Rejuvenation Event™ participants",
                "CRP certification awards for approved Certified Rejuvenation Practitioner™ participants",
                "Referral awards for qualified referral activity tied to locked REJU participation",
                "Ecosystem incentives designed to reward participation, certification, and growth",
              ]}
              behavior={[
                "All awards issued in REJU",
                "Participant and certification awards locked for 6 months",
                "Referral awards distributed 33.3% immediately and 66.7% locked for 6 months",
                "Awards released only through qualified ecosystem activity",
              ]}
            />

            <DisclosureRow
              percent="40%"
              title="Public Market Release"
              purpose={["Initial circulation", "Public access"]}
              behavior={["Released at launch", "Available for open market trading"]}
            />

            <DisclosureRow
              percent="15%"
              title="Team & Development"
              purpose={["Development and operations", "Infrastructure"]}
              behavior={["Locked for 6 months", "Released progressively 1% monthly after lock"]}
            />

            <DisclosureRow
              percent="15%"
              title="Treasury"
              purpose={["Operational reserve and emergency protection", "Infrastructure support and project continuity"]}
              behavior={["Held as reserve for strategic needs", "Supports survival and execution"]}
            />

            <DisclosureRow
              percent="10%"
              title="Marketing & Expansion"
              purpose={["Launch visibility", "Community growth"]}
              behavior={["Growth campaigns and visibility", "Deployed for expansion needs"]}
            />
          </div>
        </div>

        <InfrastructureSection />
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-[#f5c26b]">Enter the REJU Ecosystem™</h2>
        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Built for participants. Structured for investors. Designed for long-term longevity-oriented participation.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>Buy REJU</a>
          <a href={links.onboarding} className={buttonClass}>Start Onboarding</a>
          <a href={links.program} className={buttonClass}>View Program</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className={buttonClass}>Join Telegram</a>
        </div>
      </section>
    </main>
  );
}

function InfrastructureSection() {
  return (
    <div className="mx-auto mt-16 max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.16)]">
      <div className="text-center">
        <h2 className="text-5xl font-bold text-white">REJU Infrastructure</h2>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
          Three Ways to Enter REJU
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <EntryCard letter="A" title="Buy REJU" text="Buy REJU as any investment token." items={["No lock required", "Full flexibility"]} />
        <EntryCard letter="B" title="Join the Program by Locking REJU" text="Lock $600 in REJU for 6 months and enter the program path." items={["Program access included", "REJU remains in your wallet"]} />
        <EntryCard letter="C" title="Purchase the Program" text="Pay $600 directly for program access." items={["No REJU lock required", "Full flexibility"]} />
      </div>

      <div className="mt-8 rounded-2xl border border-[#f5c26b]/40 bg-[#120904] p-5 text-center text-xl font-bold text-white">
        All program participants pay the <span className="text-[#f5c26b]">$69 Book + Admin fee.</span>
      </div>

      <h3 className="mt-12 text-center text-2xl font-bold text-[#f5c26b]">
        The REJU Participation Flow
      </h3>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FlowStep number="1" title="Buy or Hold REJU" text="Acquire REJU through supported markets or hold it in your personal wallet." />
        <FlowStep number="2" title="Lock REJU" text="Lock $600 in REJU for 6 months when choosing the program path." />
        <FlowStep number="3" title="Submit Verification" text="Submit proof of lock through the verification system." />
        <FlowStep number="4" title="Receive Cohort Access" text="Once verified, gain access to your assigned cohort and program." />
        <FlowStep number="5" title="Complete the REJU Program" text="Participate in the structured program and fulfill requirements." />
        <FlowStep number="6" title="Earn Structured Incentives" text="Receive incentives based on completion and ecosystem rules." />
        <FlowStep number="7" title="Continue in the Ecosystem" text="Reinvest, participate in future cohorts, and grow with the REJU ecosystem." />
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#f5c26b]/40 bg-[#120904] p-6 text-center">
        <h3 className="text-2xl font-bold text-[#f5c26b]">You Maintain Control</h3>
        <p className="mt-3 text-gray-300">
          REJU never takes custody of your funds. Your REJU stays in your wallet while the lock structure verifies participation.
        </p>
      </div>

      <h3 className="mt-12 text-center text-2xl font-bold text-[#f5c26b]">
        Why Investors Trust REJU
      </h3>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <TrustCard title="Secure Locking" text="Your REJU stays in your wallet. You maintain control of your assets at all times." />
        <TrustCard title="Transparent Verification" text="A clear, auditable process with no hidden steps or manual confusion." />
        <TrustCard title="Limited Cohorts" text="Cohorts are capped to preserve quality, value, and sustainability." />
        <TrustCard title="Merit-Based Access" text="Access is earned through commitment, not purchased advantage." />
        <TrustCard title="Aligned Incentives" text="Incentives reward real participation and long-term ecosystem growth." />
      </div>

      <div className="mt-8 rounded-2xl border border-[#f5c26b]/30 bg-black/40 p-5 text-center font-semibold text-gray-200">
        REJU is built on honesty, transparency, and long-term value creation.{" "}
        <span className="text-[#f5c26b]">Participation-Driven Ecosystem.</span>
      </div>
    </div>
  );
}

function SmallCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-6 shadow-[0_0_25px_rgba(245,194,107,0.08)]">
      {children}
    </div>
  );
}

function Box({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/30 bg-black/20 p-3 text-center text-sm text-gray-200">
      {text}
    </div>
  );
}

function DisclosureRow({ percent, title, purpose, behavior }: {
  percent: string;
  title: string;
  purpose: string[];
  behavior: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6">
      <div className="grid gap-4 md:grid-cols-[90px_1fr]">
        <div className="text-3xl font-bold text-[#f5c26b]">{percent}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <DisclosureBlock label="Purpose" items={purpose} />
        <DisclosureBlock label="Release Behavior" items={behavior} />
      </div>
    </div>
  );
}

function DisclosureBlock({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 p-4">
      <h4 className="font-bold text-[#f5c26b]">{label}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-gray-300">
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

function EntryCard({ letter, title, text, items }: {
  letter: string;
  title: string;
  text: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-6">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#f5c26b] text-lg font-bold text-[#f5c26b]">
        {letter}
      </div>
      <h3 className="text-2xl font-bold uppercase text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-gray-300">{text}</p>
      <ul className="mt-5 space-y-2 text-sm text-gray-300">
        {items.map((item, index) => (
          <li key={index}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FlowStep({ number, title, text }: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/25 bg-[#120904]/90 p-5">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5c26b] text-sm font-bold text-black">
        {number}
      </div>
      <h4 className="font-bold text-[#f5c26b]">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function TrustCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/30 p-4 text-center">
      <h4 className="font-bold text-[#f5c26b]">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}