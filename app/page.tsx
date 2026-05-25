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
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className="hover:text-[#f5c26b]">
            Telegram
          </a>
        </div>
      </nav>

      <section className="px-6 py-16 text-center">
        <img src="/logo.png" alt="REJU Logo" className="mx-auto mb-6 w-32" />

        <h1 className="text-6xl font-bold tracking-tight text-[#f5c26b] md:text-8xl">
          REJU
        </h1>

        <h2 className="mt-4 text-2xl font-bold leading-relaxed text-[#f5c26b] md:text-3xl">
          A Token With an Ecosystem™
        </h2>

        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#f5c26b]/15 bg-[#f5c26b]/[0.02] p-8 shadow-[0_0_10px_rgba(245,194,107,0.04)] backdrop-blur-sm">
          <p className="text-center text-lg font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
            REJU Differentiator
          </p>

          <h3 className="mt-6 text-left text-2xl font-bold leading-snug text-[#f5c26b]">
            A token engineered to be sustained by its ecosystem.
          </h3>

          <p className="mt-5 text-left text-lg font-semibold leading-relaxed text-gray-100">
            REJU was designed as a regenerative ecosystem where utility,
            participation, and ecosystem activity reinforce long-term
            sustainability beyond speculation.
          </p>

          <p className="mt-5 text-left text-lg font-semibold leading-relaxed text-gray-100">
            Unlike traditional token models dependent on hype cycles, REJU
            integrates token participation into an operational structure
            engineered for long-term continuity and supported by a transparent
            release disclosure system designed to reinforce investor trust.
          </p>

          <h3 className="mt-10 text-left text-2xl font-bold leading-snug text-[#f5c26b]">
            REJU Lifecycle™
          </h3>

          <p className="mt-5 text-left text-lg font-semibold leading-relaxed text-gray-100">
            Lock $600 in REJU for 6 months and participate in the REJU
            Rejuvenation Event™ without paying the standard program fee. At the
            end of the lock period, your REJU unlocks back to your wallet.
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
              A participation-driven rejuvenation ecosystem designed around guided cohorts,
              accountability, certification, and long-term participation.
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
            <h2 className="text-center text-2xl font-bold text-[#f5c26b]">Transparent Release Disclosure</h2>
            <p className="mt-4 text-center text-sm text-gray-300">
              REJU introduces a transparent disclosure structure showing how locks,
              rewards, reserves, and releases are designed to behave over time.
            </p>

            <div className="mt-6 grid gap-3">
              <Box text="Why tokens are held" />
              <Box text="When they may release" />
              <Box text="Which holdings are locked" />
              <Box text="How rewards enter circulation" />
            </div>
          </SmallCard>
        </div>

        <div
          id="tokenomics"
          className="mx-auto mt-16 max-w-7xl rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)] backdrop-blur-md"
        >
          <div className="text-center">
            <h2 className="text-4xl font-bold uppercase tracking-[0.18em] text-[#f5c26b] md:text-5xl">
              TOKENOMICS
            </h2>

            <h3 className="mt-4 text-2xl font-bold text-[#f5c26b]">
              Includes REJU&apos;s Transparent Release Disclosure and Renewable Economic Engine™
            </h3>
          </div>

          <div className="mt-10 grid gap-5">
            <DisclosureRow
              percent="20%"
              title="Ecosystem Growth & Participation Awards"
              purpose={[
                "Participant completion awards",
                "CRP certification awards",
                "Referral participation awards",
              ]}
              behavior={[
                "All awards issued in REJU",
                "Participant and certification awards locked for 6 months",
                "Referral awards distributed 33.3% immediately and 66.7% locked for 6 months",
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
              purpose={["Development", "Infrastructure"]}
              behavior={["Locked for 6 months", "Progressive release after lock, 1.5% monthly"]}
            />

            <DisclosureRow
              percent="15%"
              title="Treasury"
              purpose={["Operational reserve", "Infrastructure continuity"]}
              behavior={["Held for strategic needs", "Supports execution and stability"]}
            />

            <DisclosureRow
              percent="10%"
              title="Marketing & Expansion"
              purpose={["Visibility", "Community growth and expansion"]}
              behavior={["Growth campaigns", "Expansion support"]}
            />

            <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6 md:p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold uppercase tracking-[0.18em] text-[#f5c26b] md:text-4xl">
                  Renewable Economic Engine™
                </h2>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/70 p-6">
                  <h4 className="text-2xl font-bold text-[#f5c26b]">
                    REJU Lifecycle™
                  </h4>

                  <p className="mt-4 text-base leading-relaxed text-gray-300">
                    Lock $600 in REJU for 6 months and participate in the REJU
                    Rejuvenation Event™ without paying the standard program fee.
                  </p>

                  <p className="mt-4 text-base leading-relaxed text-gray-300">
                    At the end of the lock period, REJU unlocks back to the
                    participant&apos;s wallet while the lifecycle structure continues
                    regenerating ecosystem participation and activity.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/70 p-6">
                  <h4 className="text-2xl font-bold text-[#f5c26b]">
                    Expansion & Participation Incentives
                  </h4>

                  <p className="mt-4 text-base leading-relaxed text-gray-300">
                    Qualified referral participation rewards are designed to support
                    ecosystem expansion through aligned participation and locked
                    engagement.
                  </p>

                  <p className="mt-4 text-base leading-relaxed text-gray-300">
                    Participation incentives strengthen REJU&apos;s economic life by
                    encouraging verified ecosystem growth instead of short-term
                    speculative activity.
                  </p>
                </div>
              </div>

              <p className="mx-auto mt-8 max-w-4xl text-center text-base font-semibold leading-relaxed text-gray-300">
                The Renewable Economic Engine™ is designed to reinforce ecosystem
                continuity through participation, alignment, and operational activity
                beyond speculative cycles.
              </p>
            </div>
          </div>
        </div>

        <InfrastructureSection />
      </section>

      <section className="px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-[#f5c26b]">
          Enter the REJU Ecosystem™
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Built for participants. Structured for investors. Designed for long-term participation.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>Buy REJU</a>
          <a href={links.onboarding} className={buttonClass}>Start Onboarding</a>
          <a href={links.program} className={buttonClass}>View Program</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className={buttonClass}>
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
        <h2 className="text-4xl font-bold text-white">REJU Infrastructure</h2>

        <p className="mt-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
          Three Ways to Enter REJU
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <EntryCard letter="A" title="Buy REJU" text="Buy REJU as an investment token." items={["No lock required", "Full flexibility"]} />

        <EntryCard letter="B" title="Lock REJU" text="Lock $600 in REJU for 6 months and enter the ecosystem path." items={["Program participation included", "REJU stays in your wallet"]} />

        <EntryCard letter="C" title="Direct Program Entry" text="Enter the program directly without locking REJU." items={["No REJU lock required", "Standard enrollment path"]} />
      </div>

      <div className="mt-8 rounded-2xl border border-[#f5c26b]/40 bg-[#120904] p-5 text-center text-xl font-bold text-white">
        All participants pay the <span className="text-[#f5c26b]">$69 Book + Admin fee.</span>
      </div>

      <h3 className="mt-12 text-center text-2xl font-bold text-[#f5c26b]">
        The REJU Participation Flow
      </h3>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FlowStep number="1" title="Buy or Hold REJU" text="Acquire and hold REJU in your wallet." />
        <FlowStep number="2" title="Lock REJU" text="Lock $600 in REJU for 6 months." />
        <FlowStep number="3" title="Submit Verification" text="Submit proof of participation." />
        <FlowStep number="4" title="Receive Cohort Access" text="Gain access to your assigned cohort." />
        <FlowStep number="5" title="Complete the Program" text="Participate in the REJU program." />
        <FlowStep number="6" title="Earn Incentives" text="Receive structured participation incentives." />
        <FlowStep number="7" title="Continue in REJU" text="Continue participating in the REJU ecosystem." />
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#f5c26b]/40 bg-[#120904] p-6 text-center">
        <h3 className="text-2xl font-bold text-[#f5c26b]">You Maintain Control</h3>
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

      <div className="mt-8 rounded-2xl border border-[#f5c26b]/30 bg-black/40 p-5 text-center font-semibold text-gray-200">
        REJU is built on honesty, transparency, and long-term value creation.{" "}
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
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/20 p-3 text-center text-sm text-gray-200">
      {text}
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

      <h3 className="text-left text-2xl font-bold uppercase text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-left text-gray-300">{text}</p>

      <ul className="mt-5 space-y-2 text-sm text-gray-300">
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