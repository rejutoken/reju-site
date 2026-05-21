const links = {
  home: "/",
  buy: "/buy",
  onboarding: "/onboarding",
  program: "/program",
  rejunomics: "/rejunomics",
  telegramCommunity: "https://t.me/rejutokencommunity",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

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

        <p className="mx-auto mt-4 max-w-5xl text-xl font-semibold leading-relaxed text-white">
          Introducing Rejunomics™ — Transparent Holdings-Release Disclosure designed to show investors not only what REJU holds, but why it is held, how it may release, and what that reveals about long-term intent.
        </p>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-300">
          REJU combines a participation-driven rejuvenation ecosystem with controlled circulation, verifiable locks, qualification-based rewards, delayed release behavior, and long-term ecosystem alignment.
        </p>

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
            <p className="mt-4 text-center text-sm text-gray-300">
              This allows investors to evaluate REJU’s release philosophy, circulation behavior, and long-term intent before committing.
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
            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b] md:text-4xl">
              Tokenomics with REJU Transparent Release Disclosure
            </h2>
          </div>

          <div className="mt-10 grid gap-5">
            <DisclosureRow
              percent="20%"
              title="Ecosystem Growth & Participation Awards"
              purpose={[
                "Participant, certification, and referral awards reserved for qualified ecosystem activity",
                "Referral awards calculated from verified locked-purchase volume",
                "Example: 10 referred participants × $600 locked REJU value = $6,000 qualified locked volume",
                "Referral award equals 10% of qualified locked volume, paid in REJU equivalent value",
              ]}
              behavior={[
                "Referral award example: $600 in REJU equivalent value from $6,000 qualified locked volume",
                "33.3% of the referral award releases immediately after qualification",
                "66.7% of the referral award is locked for 6 months before release",
                "Awards are distributed in REJU and tied to verified participation or locked-purchase activity",
              ]}
              signal={[
                "Creates transparent reward math",
                "Reduces immediate sell pressure",
                "Connects awards to real ecosystem participation",
                "Aligns referrals with longer-term REJU growth",
              ]}
            />

            <DisclosureRow
              percent="40%"
              title="Public Market Release"
              purpose={["Initial circulation", "Public access", "Trading availability", "Market participation"]}
              behavior={["Released at launch", "Available for open market trading", "Creates functional circulation", "Supports investor access"]}
              signal={["Gives the market room to operate", "Avoids excessive insider control", "Supports public price discovery", "Creates accessible entry for investors"]}
            />

            <DisclosureRow
              percent="15%"
              title="Team & Development"
              purpose={["Development", "Operations", "Infrastructure", "Long-term execution"]}
              behavior={["Locked for 6 months", "Released progressively after lock", "1% released monthly", "Structured for delayed circulation"]}
              signal={["Shows long-term team commitment", "Reduces early destabilizing pressure", "Aligns developers with investors", "Supports healthier token growth"]}
            />

            <DisclosureRow
              percent="15%"
              title="Treasury"
              purpose={["Operational reserve", "Emergency protection", "Infrastructure support", "Project continuity"]}
              behavior={["Held as reserve", "Used for strategic needs", "Supports survival and execution", "Not treated as routine market supply"]}
              signal={["Strengthens project stability", "Protects long-term execution", "Supports responsible reserve planning", "Improves investor confidence"]}
            />

            <DisclosureRow
              percent="10%"
              title="Marketing & Expansion"
              purpose={["Launch visibility", "Partnerships", "Exchange exposure", "Community growth"]}
              behavior={["Used for growth campaigns", "Supports early visibility", "Deployed for expansion needs", "Focused on adoption and reach"]}
              signal={["Supports market awareness", "Drives ecosystem adoption", "Creates exposure for REJU", "Helps expand investor participation"]}
            />
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <img src="/trust-map.png" alt="REJU Trust Infrastructure" className="w-full rounded-3xl border border-[#f5c26b]/20 shadow-[0_0_30px_rgba(245,194,107,0.12)]" />
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-[#f5c26b]">Enter the REJU Ecosystem™</h2>
        <h3 className="text-xl font-bold text-[#f5c26b]">Participation-Driven Ecosystem</h3>

        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Built for participants. Structured for investors. Designed for long-term longevity-oriented participation.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>Buy REJU</a>
          <a href={links.onboarding} className={buttonClass}>Start Onboarding</a>
          <a href={links.program} className={buttonClass}>Dive Deeper into the Program</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            Join Telegram Community
          </a>
        </div>
      </section>
    </main>
  );
}

function SmallCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-6 shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
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

function DisclosureRow({
  percent,
  title,
  purpose,
  behavior,
  signal,
}: {
  percent: string;
  title: string;
  purpose: string[];
  behavior: string[];
  signal: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6">
      <div className="grid gap-4 md:grid-cols-[90px_1fr] md:items-start">
        <div className="text-3xl font-bold text-[#f5c26b]">{percent}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <DisclosureBlock label="Purpose" items={purpose} />
        <DisclosureBlock label="Release Behavior" items={behavior} />
        <DisclosureBlock label="Investor Signal" items={signal} />
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