import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Why Do Most Crypto Projects Fail? | Crypto Project Survival, Token Utility, and Transparency",
  description:
    "A REJU industry analysis on crypto project failure, token utility, tokenomics, crypto transparency, ecosystem continuity, and renewable economic systems.",
};

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

import Nav from "../components/Nav";

export default function IndustryAnalysisPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-white" id="main-content">
      <Nav />

      <section className="px-6 py-16 text-center">
        <p className="text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Industry Analysis
        </p>

        <h1 className="mx-auto mt-10 max-w-6xl text-4xl sm:text-5xl font-bold tracking-tight text-[#f5c26b] md:text-7xl">
          Most Crypto Projects Fail
        </h1>

        <h2 className="mx-auto mt-10 max-w-5xl text-2xl sm:text-3xl font-bold leading-tight text-[#f5c26b] md:text-4xl">
          A statistical analysis of crypto project survival, token utility,
          transparency, and long-term continuity.
        </h2>

        <p className="mx-auto mt-8 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
          The cryptocurrency industry has created one of the most innovative
          financial and technological ecosystems in modern history. It has also
          experienced a significant challenge: project mortality.
        </p>

        <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
          This study examines common factors affecting crypto project survival
          and proposes enhanced transparency disclosures, ecosystem continuity
          planning, token utility, and renewable economic systems as potential
          improvements for the industry.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="#statistics" className={buttonClass}>
            View Statistics
          </a>
          <a href="#framework" className={buttonClass}>
            View Framework
          </a>
          <a href="#references" className={buttonClass}>
            View References
          </a>
        </div>
      </section>

      <section id="statistics" className="px-6 py-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Cryptocurrency Project Survival Statistics
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              The Industry Has a Survival Problem
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              CoinGecko Research reported that 53.2% of cryptocurrencies on
              GeckoTerminal have failed, with the majority of failures occurring
              in 2025. The same report stated that 11.6 million tokens failed in
              2025 alone.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Academic research examining 592 cryptocurrency projects found that
              approximately half had not been updated for six months and that
              about three-quarters disappeared, became inactive, or were reported
              as scams within two years.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <StatCard
              value="53.2%"
              title="Failed Cryptocurrencies"
              text="CoinGecko reported that 53.2% of cryptocurrencies on GeckoTerminal have failed."
            />
            <StatCard
              value="11.6M"
              title="Token Failures in 2025"
              text="CoinGecko reported 11.6 million token failures in 2025 alone."
            />
            <StatCard
              value="~75%"
              title="Inactive, Disappeared, or Reported as Scams"
              text="Academic research found that about three-quarters of studied projects disappeared, became inactive, or were reported as scams within two years."
            />
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Graphic 1 — Crypto Project Survival Statistics
            </h3>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <BarMetric label="Failed / Inactive" percent="53.2%" width="53.2%" />
              <BarMetric label="Active / Remaining" percent="46.8%" width="46.8%" />
            </div>

            <p className="mt-5 text-lg leading-relaxed text-gray-300">
              Source: CoinGecko Research. This visual summarizes the reported
              failure rate among cryptocurrencies tracked on GeckoTerminal.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/55 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Why Crypto Projects Fail After Launch
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Launch Strategy and Continuity Strategy Are Different
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Most crypto projects successfully answer one question: how do we
              launch? Far fewer clearly answer a second question: how do we
              continue?
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Launches commonly focus on token distribution, marketing
              campaigns, community growth, exchange listings, and incentive
              programs. Long-term crypto project survival requires additional
              planning around token utility, ecosystem continuity, investor
              visibility, post-incentive participation, and renewable economic
              activity.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Graphic 2 — Traditional Token Lifecycle
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[
                "Launch",
                "Marketing",
                "Community Growth",
                "Incentives",
                "Market Decline",
                "Participation Decline",
              ].map((item) => (
                <FlowBox key={item} text={item} />
              ))}
            </div>

            <p className="mt-5 text-lg leading-relaxed text-gray-300">
              The traditional token lifecycle often depends on market attention,
              speculative demand, and incentive activity. When these forces
              decline, ecosystem participation may decline as well.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Tokenomics, Transparency, and Investor Visibility
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Tokenomics Explains Allocation. Investors Also Need Continuity
              Visibility.
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Traditional tokenomics generally provides information regarding
              total supply, token allocation, and distribution categories. This
              information is valuable, but investor due diligence often requires
              additional visibility into future token releases, release
              conditions, treasury activity, incentive structures, ecosystem
              continuity planning, and long-term token utility.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Greater crypto transparency allows investors to better understand
              how a project intends to operate beyond its initial launch phase.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ProblemCard
              title="Traditional Tokenomics Commonly Shows"
              items={[
                "Total supply",
                "Token allocation",
                "Distribution categories",
                "Basic tokenomics model",
              ]}
            />

            <ProblemCard
              title="Crypto Investors Also Ask"
              items={[
                "When may future releases occur?",
                "Which incentives are finite?",
                "What happens after incentives are exhausted?",
                "What token utility remains beyond speculation?",
                "How does the ecosystem intend to continue?",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Token Utility Beyond Speculation
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              If Speculation Disappeared Tomorrow, What Activity Would Remain?
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Many crypto projects generate participation through market
              attention, incentive programs, community growth, and trading
              activity. These mechanisms can be effective during favorable
              market conditions, but participation levels often change as market
              cycles evolve.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              A utility token becomes stronger when token utility connects to
              identifiable ecosystem activity. Businesses, services, educational
              programs, certifications, membership systems, community
              participation structures, and real-world ecosystem activity can
              provide additional continuity beyond speculation alone.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Incentive Exhaustion
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Rewards Can Start Participation. Continuity Must Carry It.
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Many token ecosystems utilize rewards, incentives, and promotional
              programs to encourage participation and growth. While these
              mechanisms can be effective during launch and expansion phases,
              investors often receive limited visibility regarding what occurs
              after those incentives have been fully distributed or exhausted.
              As incentive programs conclude, participation levels may change,
              making long-term continuity planning an important consideration.
              Greater transparency regarding incentive lifecycles and
              post-incentive ecosystem activity helps investors better evaluate
              the long-term structure of a project.
            </p>
          </div>
        </div>
      </section>

      <section id="framework" className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/55 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Proposed Industry Improvements
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Transparency, Token Utility, and Ecosystem Continuity
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              The objective of these proposals is to improve transparency,
              investor visibility, and long-term understanding of token
              ecosystem structure. Traditional tokenomics provides valuable
              information regarding supply and allocation; additional
              disclosures can further assist investors in evaluating how a crypto
              project intends to operate over time.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <FrameworkCard
              acronym="RD"
              title="Enhanced Release Disclosures"
              subtitle="Visibility into how holdings may enter circulation."
              items={[
                "Release schedules",
                "Release conditions",
                "Treasury visibility",
                "Future circulation mechanisms",
              ]}
            />

            <FrameworkCard
              acronym="ILD"
              title="Incentive Lifecycle Disclosures"
              subtitle="Visibility into incentives from launch through exhaustion."
              items={[
                "Active incentives",
                "Finite incentive programs",
                "Incentive expiration events",
                "Post-incentive participation strategies",
              ]}
            />

            <FrameworkCard
              acronym="ECD"
              title="Ecosystem Continuity Disclosures"
              subtitle="Visibility into ongoing ecosystem activity."
              items={[
                "Revenue-generating operations",
                "Community participation models",
                "Renewable economic activity",
                "Long-term continuity planning",
              ]}
            />
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Graphic 3 — Rejunomics™ Transparency Framework
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {[
                "Traditional Tokenomics",
                "Release Disclosure",
                "Incentive Lifecycle Disclosure",
                "Ecosystem Continuity Disclosure™",
                "Token Life Disclosure™",
              ].map((item) => (
                <FlowBox key={item} text={item} />
              ))}
            </div>

            <p className="mt-5 text-lg leading-relaxed text-gray-300">
              Rejunomics™ expands traditional tokenomics by adding structured
              disclosures for release behavior, incentive lifecycles, ecosystem
              continuity, and token life.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Renewable Economic System™
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              A Proposed Model for Long-Term Crypto Project Continuity
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              A Renewable Economic System™ connects a token ecosystem to
              identifiable economic activity capable of generating ongoing
              participation. The objective is to supplement market activity with
              ecosystem activity.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              Educational programs, professional certifications, community
              participation systems, membership structures, businesses, services,
              and real-world ecosystem activity can help support token utility
              and long-term crypto project continuity.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Graphic 4 — Renewable Economic System™
            </h3>

            <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[
                "Market Activity",
                "Business Activity",
                "Education",
                "Certification",
                "Community Participation",
                "Ecosystem Activity",
              ].map((item) => (
                <FlowBox key={item} text={item} />
              ))}
            </div>

            <p className="mt-5 text-lg leading-relaxed text-gray-300">
              The Renewable Economic System™ concept is designed to ask one
              direct question: what ecosystem activity remains when market hype
              declines?
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              REJU Case Study
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              A Practical Implementation of Transparency and Continuity
            </h2>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              REJU was designed as a practical implementation of these concepts.
              It combines Rejunomics™, release disclosure, incentive lifecycle
              disclosure, ecosystem continuity disclosure, Token Life
              Disclosure™, a Renewable Economic System™, non-custodial
              participation structures, educational programs, practitioner
              certification pathways, community participation systems, and
              Transformation Books You Are Authoring™.
            </p>

            <p className="mx-auto mt-5 max-w-4xl text-left text-xl leading-relaxed text-gray-300">
              REJU serves as an example of how crypto transparency, token
              utility, ecosystem continuity, and renewable economic activity may
              be integrated into a token ecosystem.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            <AdoptionCard title="Transparency" text="Rejunomics™ disclosures." />
            <AdoptionCard title="Utility" text="Wellness and education pathways." />
            <AdoptionCard title="Continuity" text="Ecosystem activity beyond launch." />
            <AdoptionCard title="Renewability" text="Participation supported by real-world activity." />
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Questions for the Industry
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              A Higher Standard for Crypto Due Diligence
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-4 text-left text-xl leading-relaxed text-gray-300">
            <p>Should future release behavior be disclosed more clearly?</p>
            <p>Should incentive exhaustion be disclosed?</p>
            <p>Should ecosystem continuity plans be disclosed?</p>
            <p>
              Should crypto investors receive greater visibility into long-term
              participation mechanisms?
            </p>
            <p>
              Should token projects disclose renewable economic activity
              supporting ecosystem continuity?
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              Conclusion
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Investors Should Understand How a Project Intends to Survive
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl space-y-5 text-left text-xl leading-relaxed text-gray-300">
            <p>
              The future of cryptocurrency may depend on more than innovation
              alone. Transparency, token utility, ecosystem continuity, and
              investor visibility may become increasingly important as the
              industry matures.
            </p>

            <p>
              The statistics demonstrate that crypto project mortality remains a
              significant challenge. The opportunity is not simply to launch more
              projects. The opportunity is to build projects that communicate
              more clearly, operate more transparently, and maintain ecosystem
              participation for longer periods of time.
            </p>

            <p>
              REJU presents one proposed framework for contributing to that
              discussion. The goal is to encourage higher standards of
              transparency, stronger continuity planning, and a more informed
              relationship between projects, investors, and communities.
            </p>

            <p className="font-semibold text-[#f5c26b]">
              Investors should be able to understand not only how a project
              launches, but also how it intends to survive.
            </p>
          </div>
        </div>
      </section>

      <section id="references" className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/90 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              References
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b]">
              Sources Used in This Analysis
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <ReferenceCard
              title="CoinGecko Research"
              subtitle="Dead Coins: How Many Cryptocurrencies Have Failed?"
              url="https://www.coingecko.com/research/publications/how-many-cryptocurrencies-failed"
              text="CoinGecko reported that 53.2% of cryptocurrencies on GeckoTerminal have failed and that 11.6 million tokens failed in 2025 alone."
            />

            <ReferenceCard
              title="Choi, Choi, Aiken, Kim, Huh, Kim, Kim, and Anderson"
              subtitle="Attack of the Clones: Measuring the Maintainability, Originality and Security of Bitcoin 'Forks' in the Wild"
              url="https://arxiv.org/abs/2201.08678"
              text="This academic study examined 592 crypto projects and reported that about half had not been updated for six months and that about three-quarters disappeared, became inactive, or were reported as scams within two years."
            />
          </div>

          <div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              Disclaimer
            </h3>

            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              This study is intended for educational and informational purposes.
              The analysis discusses industry-wide trends and proposes potential
              transparency and continuity frameworks. References are provided to
              support publicly available statistics and research. Nothing
              contained in this study should be interpreted as investment, legal,
              tax, or financial advice.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#f5c26b]/25 bg-black/60 p-8 shadow-[0_0_35px_rgba(245,194,107,0.14)]">
          <h2 className="text-4xl font-bold text-[#f5c26b]">
            Continue Exploring REJU
          </h2>

          <p className="mx-auto mt-5 max-w-4xl text-xl leading-relaxed text-gray-300">
            This industry analysis explains why REJU was designed around
            transparency, token utility, ecosystem continuity, and renewable
            economic activity.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href={links.rejunomics} className={buttonClass}>
              View Rejunomics™
            </a>
            <a href={links.home} className={buttonClass}>
              Back to REJU
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

function StatCard({
  value,
  title,
  text,
}: {
  value: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6 text-center">
      <p className="text-5xl font-bold text-[#f5c26b]">{value}</p>
      <h3 className="mt-4 text-2xl font-bold text-[#f5c26b]">{title}</h3>
      <p className="mt-4 text-lg leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function BarMetric({
  label,
  percent,
  width,
}: {
  label: string;
  percent: string;
  width: string;
}) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/15 bg-[#120904]/80 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-gray-300">{label}</p>
        <p className="text-xl font-bold text-[#f5c26b]">{percent}</p>
      </div>

      <div className="mt-4 h-4 overflow-hidden rounded-full bg-black/50">
        <div
          className="h-full rounded-full bg-[#f5c26b]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function ProblemCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
      <h3 className="text-2xl font-bold text-[#f5c26b]">{title}</h3>

      <ul className="mt-5 space-y-3 text-lg text-gray-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
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
        {items.map((item) => (
          <li key={item}>✓ {item}</li>
        ))}
      </ul>
    </div>
  );
}

function FlowBox({ text }: { text: string }) {
  return (
    <div className="flex min-h-28 items-center justify-center rounded-2xl border border-[#f5c26b]/20 bg-[#120904]/80 p-4 text-center">
      <p className="text-lg font-semibold leading-snug text-gray-300">{text}</p>
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

function ReferenceCard({
  title,
  subtitle,
  url,
  text,
}: {
  title: string;
  subtitle: string;
  url: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-6">
      <h3 className="text-2xl font-bold text-[#f5c26b]">{title}</h3>

      <p className="mt-3 text-lg font-semibold text-gray-300">{subtitle}</p>

      <p className="mt-4 break-words text-lg text-[#f5c26b]">{url}</p>

      <p className="mt-4 text-lg leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}