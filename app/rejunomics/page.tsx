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
        </h2>
        <p className="mx-auto mt-4 max-w-5xl text-2xl font-semibold leading-tight text-[#f5c26b] md:text-3xl">
          Allocation Clarity and Token Intent — transparency that protects investors.
        </p>

        <p className="mx-auto mt-8 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
          Rejunomics™ is a transparency disclosure system for tokenomics. It expands traditional tokenomics by clearly revealing where holdings are allocated, how they may enter circulation, what mechanisms support token life, and how the ecosystem is intended to operate beyond launch. With standardized notation, it gives investors easy understanding and confident review.
        </p>

        <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
          When projects adopt Rejunomics™, investors no longer invest blindly. They gain full visibility into release behavior and aligned incentives. This builds trust, attracts serious long-term supporters, and sets a new standard for the industry.
        </p>

		<p className="mx-auto mt-5 max-w-4xl text-left text-2xl leading-relaxed text-[#f5c26b]">
           Rejunomics™ turns transparency into protection and clarity into confidence.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="#concepts" className={buttonClass}>
            Allocation Clarity &amp; Token Intent
          </a>
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

      <section id="concepts" className="px-6 py-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              The Two Disclosures
            </p>
            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Allocation Clarity™ and Token Intent™
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Rejunomics™ is built around two named concepts. Together they
              turn a pie chart into a readable economic design: what exists,
              where it sits, why it was created, and how it is meant to behave
              after launch.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ProblemCard
              title="Allocation Clarity™"
              items={[
                "Not only the percentage — where that allocation is held.",
                "Who can move it, and under what lock or vesting condition.",
                "When it may enter circulation, and at what pace.",
                "Which buckets are public, team, treasury, rewards, or reserves.",
                "A standardized reading of supply so investors are not guessing from a slide.",
              ]}
            />
            <ProblemCard
              title="Token Intent™"
              items={[
                "Why each allocation exists — purpose, not just a label.",
                "Which incentives are finite, and what happens when they end.",
                "What the project intends the token to do after the launch window.",
                "The continuity mechanism: participation, business activity, token life.",
                "A disclosure of design, so “utility” can be inspected instead of assumed.",
              ]}
            />
          </div>

          <div className="mt-8 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-center text-2xl font-bold text-[#f5c26b]">
              Aligned with the CLARITY Act — and what it still leaves open
            </h3>
            <div className="mx-auto mt-5 max-w-4xl space-y-4 text-left text-lg leading-relaxed text-gray-300">
              <p>
                The CLARITY Act is a market-structure bill. It aims to say who
                regulates digital assets, how investors are protected, and what
                a responsible launch looks like at the legal layer. That is
                necessary. It is not, by itself, a readable token design.
              </p>
              <p>
                Rejunomics™ was written before the Act, for the gap the Act
                still leaves: a project can be in the right jurisdiction and
                still publish opaque tokenomics. Allocation Clarity™ and Token
                Intent™ are the disclosure practice underneath those rules —
                so “investor protection” has something concrete to read.
              </p>
              <p>
                The invitation to the industry is quiet and practical. Adopt
                the two disclosures. The CLARITY Act would be more complete if
                market-structure law sat on top of Allocation Clarity and
                Token Intent, instead of on top of a pie chart.
              </p>
            </div>
          </div>
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
                  Traditional tokenomics shows allocation. Rejunomics™ adds a
                  technical disclosure layer using standardized distribution
                  notation: type, allocation, and release duration in one
                  consistent code.
                </p>

                <p className="mx-auto mt-4 max-w-4xl rounded-2xl border border-[#f5c26b]/20 bg-black/40 px-5 py-4 font-mono text-lg font-bold tracking-wide text-[#f5c26b] md:text-xl">
                  REJU-[TYPE]-[ALLOCATION]/[DURATION]
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <TechnicalDisclosureGroup title="Core Allocations">
                  <TechnicalDisclosureLine
                    code="REJU-LA-40"
                    meaning="Liquidity Allocation — 40% public market release"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-ER-20"
                    meaning="Ecosystem Rewards — 20% growth & participation awards"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-TA-1.0/6"
                    meaning="Team Allocation locked 6 months, distributed 1% monthly"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-VA-15"
                    meaning="Vesting Allocation — 15% treasury holdings"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-ER-10"
                    meaning="Ecosystem Rewards — 10% marketing & expansion"
                  />
                </TechnicalDisclosureGroup>

                <TechnicalDisclosureGroup title="Distribution Examples">
                  <TechnicalDisclosureLine
                    code="REJU-AD-5/6"
                    meaning="Airdrop Distribution — 5% allocation, 6-month progressive release"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-RA10-10/12"
                    meaning="Referral Award (10 referrals required) — 10% allocation, 12-month progressive release"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-SD-8/12"
                    meaning="Staking Distribution — 8% allocation, 12-month progressive release"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-YD-4/6"
                    meaning="Yield Distribution — 4% allocation, 6-month progressive release"
                  />
                </TechnicalDisclosureGroup>

                <TechnicalDisclosureGroup title="Token Life & REE">
                  <TechnicalDisclosureLine
                    code="REJU-TLD-FI"
                    meaning="Token Life Disclosure — Finite Incentives"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-TLD-BC"
                    meaning="Token Life Disclosure — Business Continuity"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-REE-LC"
                    meaning="Renewable Economic Engine — Lifecycle Continuity"
                  />
                  <TechnicalDisclosureLine
                    code="REJU-REE-PI"
                    meaning="Renewable Economic Engine — Participation Incentives"
                  />
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
              Rejunomics™ distribution notation uses a fixed structure so
              investors can parse type, allocation, and release duration without
              reading a full tokenomics document.
            </p>

            <p className="mx-auto mt-6 max-w-4xl rounded-2xl border border-[#f5c26b]/25 bg-black/40 px-5 py-4 font-mono text-xl font-bold tracking-wide text-[#f5c26b] md:text-2xl">
              REJU-[TYPE]-[ALLOCATION]/[DURATION]
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Distribution Type Definitions
            </h3>

            <p className="mt-3 text-lg text-gray-400">
              Standard <span className="font-bold text-[#f5c26b]">[TYPE]</span> codes used in Rejunomics™ notation.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-left text-lg">
                <thead>
                  <tr className="border-b border-[#f5c26b]/30">
                    <th className="px-4 py-3 font-bold text-[#f5c26b]">Code</th>
                    <th className="px-4 py-3 font-bold text-[#f5c26b]">Distribution Type</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <DistributionTypeRow code="AD" meaning="Airdrop Distribution" />
                  <DistributionTypeRow code="RA" meaning="Referral Award" />
                  <DistributionTypeRow code="SD" meaning="Staking Distribution" />
                  <DistributionTypeRow code="YD" meaning="Yield Distribution" />
                  <DistributionTypeRow code="TA" meaning="Team Allocation" />
                  <DistributionTypeRow code="VA" meaning="Vesting Allocation" />
                  <DistributionTypeRow code="LA" meaning="Liquidity Allocation" />
                  <DistributionTypeRow code="ER" meaning="Ecosystem Rewards" />
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-base leading-relaxed text-gray-400">
              Type codes may include parameters when needed (for example{" "}
              <span className="font-mono font-semibold text-[#f5c26b]">RA10</span>{" "}
              = Referral Award requiring 10 referrals). Duration is expressed in
              months. Where a rate appears (for example{" "}
              <span className="font-mono font-semibold text-[#f5c26b]">1.0/6</span>
              ), it means monthly distribution after a lock period.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Example Interpretation
            </h3>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-6">
                <h4 className="font-mono text-xl font-bold text-[#f5c26b]">
                  REJU-AD-5/6
                </h4>
                <p className="mt-2 text-base leading-relaxed text-gray-400">
                  Airdrop Distribution — 5% allocation, 6-month progressive release
                </p>

                <ul className="mt-4 space-y-2 text-lg text-gray-300">
                  <li><span className="font-bold text-[#f5c26b]">REJU</span> = Token identifier</li>
                  <li><span className="font-bold text-[#f5c26b]">AD</span> = Airdrop distribution</li>
                  <li><span className="font-bold text-[#f5c26b]">5</span> = 5% allocation</li>
                  <li><span className="font-bold text-[#f5c26b]">6</span> = 6-month progressive release</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-6">
                <h4 className="font-mono text-xl font-bold text-[#f5c26b]">
                  REJU-RA10-10/12
                </h4>
                <p className="mt-2 text-base leading-relaxed text-gray-400">
                  Referral Award (10 referrals required) — 10% allocation, 12-month progressive release
                </p>

                <ul className="mt-4 space-y-2 text-lg text-gray-300">
                  <li><span className="font-bold text-[#f5c26b]">REJU</span> = Token identifier</li>
                  <li><span className="font-bold text-[#f5c26b]">RA10</span> = Referral award (10 referrals required)</li>
                  <li><span className="font-bold text-[#f5c26b]">10</span> = 10% allocation</li>
                  <li><span className="font-bold text-[#f5c26b]">12</span> = 12-month progressive release</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-6">
                <h4 className="font-mono text-xl font-bold text-[#f5c26b]">
                  REJU-TA-1.0/6
                </h4>
                <p className="mt-2 text-base leading-relaxed text-gray-400">
                  Team Allocation locked 6 months, distributed 1% monthly
                </p>

                <ul className="mt-4 space-y-2 text-lg text-gray-300">
                  <li><span className="font-bold text-[#f5c26b]">REJU</span> = Token identifier</li>
                  <li><span className="font-bold text-[#f5c26b]">TA</span> = Team allocation</li>
                  <li><span className="font-bold text-[#f5c26b]">1.0</span> = 1% monthly distribution</li>
                  <li><span className="font-bold text-[#f5c26b]">6</span> = 6-month lock</li>
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
              Rejunomics™ Distribution Notation
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Rejunomics™ introduces a standardized notation structure designed
              to make token distribution models easier to read, compare, and
              understand across ecosystems.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Rather than requiring investors to analyze lengthy tokenomics
              documents, disclosures can be summarized in a consistent format
              that identifies distribution type, allocation percentage, and
              release duration at a glance.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/80 p-6 md:p-8">
            <p className="text-center text-sm font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
              Notation Structure
            </p>
            <p className="mt-4 text-center font-mono text-2xl font-bold tracking-wide text-[#f5c26b] md:text-3xl">
              REJU-[TYPE]-[ALLOCATION]/[DURATION]
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 p-4 text-center">
                <p className="font-mono text-lg font-bold text-[#f5c26b]">TYPE</p>
                <p className="mt-2 text-base text-gray-300">Distribution code (AD, RA, TA…)</p>
              </div>
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 p-4 text-center">
                <p className="font-mono text-lg font-bold text-[#f5c26b]">ALLOCATION / RATE</p>
                <p className="mt-2 text-base text-gray-300">Supply % or monthly distribution rate</p>
              </div>
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 p-4 text-center">
                <p className="font-mono text-lg font-bold text-[#f5c26b]">DURATION</p>
                <p className="mt-2 text-base text-gray-300">Lock or release period in months</p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <p className="text-center text-lg font-bold uppercase tracking-[0.28em] text-[#f5c26b]">
              Quick Examples
            </p>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 px-5 py-4">
                <p className="font-mono text-lg font-bold text-[#f5c26b]">REJU-AD-5/6</p>
                <p className="mt-1 text-base text-gray-300">
                  Airdrop Distribution — 5% allocation, 6-month progressive release
                </p>
              </div>
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 px-5 py-4">
                <p className="font-mono text-lg font-bold text-[#f5c26b]">REJU-RA10-10/12</p>
                <p className="mt-1 text-base text-gray-300">
                  Referral Award (10 referrals required) — 10% allocation, 12-month progressive release
                </p>
              </div>
              <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 px-5 py-4">
                <p className="font-mono text-lg font-bold text-[#f5c26b]">REJU-TA-1.0/6</p>
                <p className="mt-1 text-base text-gray-300">
                  Team Allocation locked 6 months, distributed 1% monthly
                </p>
              </div>
            </div>
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
              allocation. It should also disclose Allocation Clarity™ and
              Token Intent™ — where holdings are, when they may enter
              circulation, which incentives are finite, and what mechanisms
              are intended to support token life beyond launch. That is the
              disclosure layer a market-structure law like the CLARITY Act
              still needs underneath it.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <AdoptionCard
              title="Allocation Clarity™"
              text="What exists, where it is held, and how it may enter circulation."
            />
            <AdoptionCard
              title="Token Intent™"
              text="Why it exists, which incentives end, and what is meant to continue."
            />
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

function TechnicalDisclosureLine({
  code,
  meaning,
}: {
  code: string;
  meaning: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-black/30 px-4 py-3 text-left">
      <div className="font-mono text-base font-bold tracking-wide text-[#f5c26b] md:text-lg">
        {code}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-300 md:text-base">
        <span className="text-[#f5c26b]/80">= </span>
        {meaning}
      </p>
    </div>
  );
}

function DistributionTypeRow({
  code,
  meaning,
}: {
  code: string;
  meaning: string;
}) {
  return (
    <tr className="border-b border-[#f5c26b]/10">
      <td className="px-4 py-3 font-mono font-bold text-[#f5c26b]">{code}</td>
      <td className="px-4 py-3 text-gray-300">{meaning}</td>
    </tr>
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
