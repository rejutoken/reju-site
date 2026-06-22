import Nav from "../components/Nav";

const links = {
  home: "/",
  buy: "/buy",
  onboarding: "/onboarding",
  program: "/program",
  rejunomics: "/rejunomics",
  telegramOfficial: "https://t.me/rejuofficial",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function RejunomicsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-white" id="main-content">
      <Nav />

      <section className="px-6 py-16 text-center">
        <p className="text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          Developed by REJU
        </p>

        <h1 className="mt-10 text-5xl font-bold tracking-tight text-[#f5c26b] md:text-7xl">
          Rejunomics
          <span className="relative -top-7 ml-1 text-2xl md:-top-10 md:text-3xl">
            ™
          </span>
        </h1>

        <h2 className="mx-auto mt-12 max-w-5xl text-3xl font-bold leading-tight text-[#f5c26b] md:text-4xl">
          Tokenomics show allocation.
        		<p>Rejunomics™ shows release behavior.</p>
		
		
		</h2>

        <p className="mx-auto mt-8 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
          Rejunomics™ is a transparency disclosure system for tokenomics. It
          expands traditional tokenomics by revealing where holdings are
          allocated, how they may enter circulation, what mechanisms are intended
          to support token life, and how ecosystem continuity is intended to
          operate beyond launch.
        </p>

        <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
          Rejunomics™ was developed with standardized notation for easier
          understanding, clearer investor review, and potential industry
          adoption by projects seeking stronger transparency disclosures.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="#framework" className={buttonClass}>
            View Framework
          </a>
          <a href="#disclosure-example" className={buttonClass}>
            View Example
          </a>
          <a href="#notation" className={buttonClass}>
            View Notation
          </a>
          <a href="/daily-transformation-log" className={buttonClass}>
            Start Authoring Your Personalized Book (with Participant ID)
          </a>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#f5c26b]">
              Why Rejunomics™ Was Developed
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-xl leading-relaxed text-gray-300">
              Traditional tokenomics usually shows supply and allocation.
              Rejunomics™ adds a disclosure layer that helps investors
              understand holding behavior, release behavior, token life, and
              continuity mechanisms.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ProblemCard
              title="Traditional Tokenomics Commonly Shows"
              items={[
                "Total supply",
                "Allocation percentages",
                "Basic distribution categories",
                "Simple charts or tables",
              ]}
            />

            <ProblemCard
              title="Investors Still Need to Understand"
              items={[
                "Where holdings are allocated",
                "When holdings may enter circulation",
                "Which incentives are finite",
                "What remains after incentives are exhausted",
              ]}
            />
          </div>

          <div className="mt-8 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6 text-center">
            <p className="text-xl font-semibold leading-relaxed text-gray-300">
              The objective is to expand tokenomics with clear transparency disclosures of token intent.
            </p>
          </div>
        </div>
      </section>

      <section id="framework" className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/55 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Rejunomics™ Framework
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Three Disclosure Layers
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-xl leading-relaxed text-gray-300">
              Rejunomics™ organizes token transparency into three disclosure
              layers: holdings, token life, and the economic engine intended to
              support continuity.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <FrameworkCard
              acronym="THD"
              title="Transparent Holdings Disclosure™"
              subtitle="Where the holdings are and how they may behave."
              items={[
                "Allocation percentages",
                "Designated holdings",
                "Lock periods",
                "Release schedules",
                "Reward distribution behavior",
              ]}
            />

            <FrameworkCard
              acronym="TLD"
              title="Token Life Disclosure™"
              subtitle="What is intended to support token continuity beyond launch."
              items={[
                "Token life intent",
                "Finite incentive disclosure",
                "Post-incentive continuity",
                "Business activity support",
                "Long-term ecosystem participation",
              ]}
            />

            <FrameworkCard
              acronym="REE"
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
        </div>
      </section>

      <section id="disclosure-example" className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              REJU Implementation
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#f5c26b]">
              REJU Tokenomics with Rejunomics™ Disclosures
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-lg leading-relaxed text-gray-300">
              This section shows how REJU's tokenomics would be reported if
              Rejunomics™ were implemented as an industry transparency
              disclosure framework. The first box mirrors the tokenomics format
              used on the landing page. The Rejunomics™ disclosure underneath
              shows the same tokenomics using standardized technical notation.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6 md:p-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold uppercase tracking-[0.18em] text-[#f5c26b]">
                Tokenomics
              </h3>
            </div>

            <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="grid gap-3">
                <TokenomicsLine title="Public Market Release" percent="40%" />
                <TokenomicsLine title="Ecosystem Growth & Participation Awards" percent="20%" />
                <TokenomicsLine title="Team & Development" percent="15%" />
                <TokenomicsLine title="Treasury" percent="15%" />
                <TokenomicsLine title="Marketing & Expansion" percent="10%" />
              </div>

        <div className="flex min-w-0 flex-col items-center">
          <div className="relative h-64 w-64 rounded-full border border-[#f5c26b]/40 bg-[conic-gradient(#f5c26b_0_40%,#d89b45_40%_60%,#9f6d2e_60%_75%,#6b471d_75%_90%,#3a2410_90%_100%)] shadow-[0_0_35px_rgba(245,194,107,0.18)] sm:h-80 sm:w-80">
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

            <div className="mt-10 border-t border-[#f5c26b]/20 pt-8">
              <div className="text-center">
                <p className="text-lg font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
                  Rejunomics™ Disclosure
                </p>

                <h3 className="mt-3 text-2xl font-bold text-[#f5c26b]">
                  Technical Reporting Layer
                </h3>

                <p className="mx-auto mt-4 max-w-4xl text-left text-lg leading-relaxed text-gray-300">
                  Traditional tokenomics shows allocation. Rejunomics™ adds the
                  technical disclosure layer: holdings behavior, release
                  behavior, token life, continuity mechanisms, and event-based
                  incentive disclosures.
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-4">
                <TechnicalDisclosureGroup title="Token">
                  <TechnicalDisclosureLine code="REJU-PMR-40" />
                  <TechnicalDisclosureLine code="REJU-EGPA-20" />
                  <TechnicalDisclosureLine code="REJU-TD-15/6/1.5" />
                  <TechnicalDisclosureLine code="REJU-TR-15" />
                  <TechnicalDisclosureLine code="REJU-ME-10" />
                </TechnicalDisclosureGroup>

                <TechnicalDisclosureGroup title="Token Life">
                  <TechnicalDisclosureLine code="REJU-TLD-FI" />
                  <TechnicalDisclosureLine code="REJU-TLD-BC" />
                  <TechnicalDisclosureLine code="REJU-TLD-LC" />
                </TechnicalDisclosureGroup>

                <TechnicalDisclosureGroup title="REE">
                  <TechnicalDisclosureLine code="REJU-REE-LC" />
                  <TechnicalDisclosureLine code="REJU-REE-PI" />
                  <TechnicalDisclosureLine code="REJU-REE-BA" />
                </TechnicalDisclosureGroup>

                <TechnicalDisclosureGroup title="Events">
                  <TechnicalDisclosureLine code="REJU-R10-10/6" />
                  <TechnicalDisclosureLine code="REJU-PA-60/6" />
                  <TechnicalDisclosureLine code="REJU-CRP-60/6" />
                </TechnicalDisclosureGroup>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="meaning" className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Rejunomics™ Meaning
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#f5c26b]">
              How to Read the Technical Disclosure
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-lg leading-relaxed text-gray-300">
              The technical notation above is the reporting layer. This section
              explains the meaning of the acronyms and shows how to read the
              disclosure codes.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Rejunomics™ Nomenclature Key
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <NomenclatureItem code="REJU" meaning="Token Identifier" />
              <NomenclatureItem code="PMR" meaning="Public Market Release" />
              <NomenclatureItem code="EGPA" meaning="Ecosystem Growth & Participation Awards" />
              <NomenclatureItem code="TD" meaning="Team & Development" />
              <NomenclatureItem code="TR" meaning="Treasury" />
              <NomenclatureItem code="ME" meaning="Marketing & Expansion" />
              <NomenclatureItem code="TLD" meaning="Token Life Disclosure" />
              <NomenclatureItem code="REE" meaning="Renewable Economic Engine" />
              <NomenclatureItem code="FI" meaning="Finite Incentives" />
              <NomenclatureItem code="BC" meaning="Business Continuity" />
              <NomenclatureItem code="LC" meaning="Lifecycle Continuity" />
              <NomenclatureItem code="PI" meaning="Participation Incentives" />
              <NomenclatureItem code="R10" meaning="Referral Structure requiring 10 referrals" />
              <NomenclatureItem code="PA" meaning="Program Award" />
              <NomenclatureItem code="CRP" meaning="Certified Rejuvenation Practitioner Award" />
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Example Interpretation
            </h3>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-6">
                <h4 className="text-xl font-bold text-[#f5c26b]">
                  REJU-TD-15/6/1.5
                </h4>

                <ul className="mt-4 space-y-2 text-lg text-gray-300">
                  <li><span className="font-bold text-[#f5c26b]">REJU</span> = REJU Token</li>
                  <li><span className="font-bold text-[#f5c26b]">TD</span> = Team & Development</li>
                  <li><span className="font-bold text-[#f5c26b]">15</span> = 15% Allocation</li>
                  <li><span className="font-bold text-[#f5c26b]">6</span> = 6-Month Lock</li>
                  <li><span className="font-bold text-[#f5c26b]">1.5</span> = 1.5% Monthly Progressive Release</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-6">
                <h4 className="text-xl font-bold text-[#f5c26b]">
                  REJU-R10-10/6
                </h4>

                <ul className="mt-4 space-y-2 text-lg text-gray-300">
                  <li><span className="font-bold text-[#f5c26b]">REJU</span> = REJU Token</li>
                  <li><span className="font-bold text-[#f5c26b]">R10</span> = Referral Structure</li>
                  <li><span className="font-bold text-[#f5c26b]">10</span> = 10% Reward Allocation</li>
                  <li><span className="font-bold text-[#f5c26b]">6</span> = 6-Month Structured Release</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="notation" className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Standardized Notation
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#f5c26b]">
              Why Standardized Notation?
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-xl text-left leading-relaxed text-gray-300">
              Rejunomics™ notation was developed to reduce interpretation and
              improve transparency. Rather than requiring investors to analyze
              lengthy tokenomics documents, disclosures can be summarized using
              standardized notation that identifies allocation behavior, release
              behavior, token life disclosures, and continuity mechanisms in a
              consistent format.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-xl text-left leading-relaxed text-gray-300">
              The objective is to make disclosures easier to read, compare,
              review, and understand. Rejunomics™ notation is intended to
              provide a common disclosure language that may be adopted by token
              projects seeking stronger transparency standards.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#f5c26b]">
              Designed for Industry Adoption
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-xl text-left leading-relaxed text-gray-300">
              Rejunomics™ was developed as a transparency disclosure framework
              that may be adopted by token projects seeking greater clarity
              regarding holdings, release behavior, token life, and ecosystem
              continuity.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-xl text-left leading-relaxed text-gray-300">
              The proposal is simple: tokenomics should not only show
              allocation. It should also disclose where holdings are, when they
              may enter circulation, which incentives are finite, and what
              mechanisms are intended to support token life beyond launch.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            <AdoptionCard title="Allocation" text="What exists." />
            <AdoptionCard title="Holdings" text="Where it is allocated." />
            <AdoptionCard title="Release" text="How it may enter circulation." />
            <AdoptionCard title="Token Life" text="What is intended to continue." />
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Rejunomics™ Vision
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Expanding Tokenomics Through Transparency
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-5 text-left text-xl leading-relaxed text-gray-300">
            <p>Tokenomics tells investors how tokens are allocated. Rejunomics™ discloses holdings behavior, release behavior, token life, and ecosystem continuity.</p>

            <p>
              Rejunomics™ proposes that token projects also disclose holdings
              behavior, release behavior, token life, and continuity mechanisms
              through a standardized transparency framework.
            </p>

            <p>
              The objective is not to replace tokenomics. 
			  The objective is to expand tokenomics through 
			  structured transparency disclosures regarding holdings behavior, 
			  release behavior, token life, and ecosystem continuity.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <h2 className="text-4xl font-bold text-[#f5c26b]">
            Rejunomics™ Summary
          </h2>

          <div className="mx-auto mt-8 max-w-4xl space-y-4 text-left text-xl leading-relaxed text-gray-300">
            <p>Traditional tokenomics explains allocation.</p>
            <p>Rejunomics™ expands disclosure.</p>
            <p>
              Transparent Holdings Disclosure™ explains where holdings are and
              how they may behave.
            </p>
            <p>
              Token Life Disclosure™ explains what is intended to support
              continuity after launch and after incentive allocations are
              exhausted.
            </p>
            <p>
              Renewable Economic Engine™ Disclosure explains how continuity is
              intended to operate through participation, incentives, and business
              activity.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href={links.home} className={buttonClass}>
              Back to Landing Page
            </a>
            <a href={links.onboarding} className={buttonClass}>
              Start Onboarding
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function ProblemCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
      <h3 className="text-2xl font-bold text-[#f5c26b]">{title}</h3>

      <ul className="mt-5 space-y-3 text-lg text-gray-300">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FrameworkCard({
  acronym,
  title,
  subtitle,
  items,
}: {
  acronym: string;
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-6">
      <p className="text-lg font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
        {acronym}
      </p>

      <h3 className="mt-3 text-2xl font-bold text-[#f5c26b]">{title}</h3>

      <p className="mt-4 text-lg leading-relaxed text-gray-300">{subtitle}</p>

      <ul className="mt-5 space-y-2 text-lg text-gray-300">
        {items.map((item, index) => (
          <li key={index}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function DisclosureGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-3">
      <h3 className="text-2xl font-bold text-[#f5c26b]">{title}</h3>

      <div className="mt-5 grid gap-4">{children}</div>
    </div>
  );
}

function NotationRow({
  code,
  title,
  details,
}: {
  code: string;
  title: string;
  details: string[];
}) {
  return (
    <div className="grid gap-4 rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-5 lg:grid-cols-[240px_1fr_1.4fr] lg:items-start">
      <div className="rounded-full border border-[#f5c26b]/50 bg-black/35 px-4 py-2 text-center text-lg font-bold text-[#f5c26b]">
        {code}
      </div>

      <h4 className="text-xl font-bold text-[#f5c26b]">{title}</h4>

      <ul className="space-y-2 text-lg leading-relaxed text-gray-300">
        {details.map((detail, index) => (
          <li key={index}>• {detail}</li>
        ))}
      </ul>
    </div>
  );
}

function TokenomicsLine({ title, percent }: { title: string; percent: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-4">
      <span className="font-semibold text-xl text-gray-300">{title}</span>
      <span className="text-xl font-bold text-[#f5c26b]">{percent}</span>
    </div>
  );
}

function TechnicalDisclosureGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-5">
      <h4 className="mb-5 text-center text-xl font-bold text-[#f5c26b]">
        {title}
      </h4>

      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function TechnicalDisclosureLine({ code }: { code: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 px-5 py-3 text-center text-xl font-bold tracking-wide text-[#f5c26b]">
      {code}
    </div>
  );
}

function NomenclatureItem({ code, meaning }: { code: string; meaning: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-4 text-lg">
      <span className="font-bold text-[#f5c26b]">{code}</span>
      <span className="text-gray-300"> = {meaning}</span>
    </div>
  );
}

function AdoptionCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-[#120904]/80 p-5 text-center">
      <h3 className="text-xl font-bold text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-lg text-gray-300">{text}</p>
    </div>
  );
}
