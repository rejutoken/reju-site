export default function RejunomicsPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white px-6 py-20">
      <section className="mx-auto max-w-7xl space-y-24">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <p className="text-[#f5c26b] uppercase tracking-[0.3em] text-sm font-semibold">
            Developed by REJU
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-[#f5c26b]">
            Rejunomics™
          </h1>

          <h2 className="text-2xl md:text-3xl font-bold text-[#e6c36a]">
            A Regenerative Tokenomics Framework™
          </h2>

          <p className="text-xl text-gray-300 leading-relaxed">
            Tokenomics show allocation. Rejunomics™ shows release behavior.
          </p>

          <p className="text-lg text-gray-400 leading-relaxed">
            Rejunomics™ is a transparent release-behavior disclosure framework
            developed by REJU to help projects explain how held, rewarded, or
            allocated tokens may enter circulation over time.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <h2 className="text-4xl font-bold text-[#f5c26b]">
              Why Release Behavior Matters
            </h2>

            <p className="text-lg leading-relaxed text-gray-300">
              Most token launches disclose allocation percentages, but allocation
              alone does not explain how tokens may enter the market. A project
              can show a clean tokenomics chart while still hiding aggressive
              unlocks, unclear reward emissions, or release structures that may
              create future circulation pressure.
            </p>

            <p className="text-lg leading-relaxed text-gray-300">
              Release behavior matters because it affects supply pressure,
              investor confidence, holder alignment, and long-term ecosystem
              stability. When tokens enter circulation too quickly, the ecosystem
              may experience sell pressure before utility, liquidity, and
              participation have enough time to mature.
            </p>

            <p className="text-lg leading-relaxed text-gray-300">
              Rejunomics™ was created to make that behavior easier to see. The
              framework focuses on timing, conditions, maturity, and release
              structure — not only percentage allocation.
            </p>
          </div>

          <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
            <h3 className="text-2xl font-bold text-[#f5c26b]">
              The Core Difference
            </h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h4 className="font-bold text-[#f5c26b]">Tokenomics</h4>
                <p className="mt-2 text-sm text-gray-300">
                  Shows where tokens are allocated.
                </p>
              </div>

              <div className="rounded-2xl border border-[#f5c26b]/30 bg-black/30 p-5">
                <h4 className="font-bold text-[#f5c26b]">Rejunomics™</h4>
                <p className="mt-2 text-sm text-gray-300">
                  Shows how tokens are released into circulation.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/80 p-8 shadow-[0_0_30px_rgba(245,194,107,0.08)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f5c26b]">
                REJU Disclosure Model
              </p>

              <h2 className="text-4xl font-bold text-[#f5c26b]">
                REJU Begins With 75% Release Disclosure
              </h2>

              <p className="text-lg leading-relaxed text-gray-300">
                REJU is applying the Rejunomics™ philosophy to its own launch by
                disclosing the release logic behind 75% of total supply: public
                market release, team allocation, and ecosystem growth.
              </p>

              <p className="text-lg leading-relaxed text-gray-300">
                Treasury and marketing remain administrative allocations because
                they must respond to operational needs, infrastructure, liquidity
                support, partnerships, and expansion. The primary circulation
                components, however, are disclosed from the beginning.
              </p>

              <p className="text-lg leading-relaxed text-gray-300">
                The goal is to make release behavior understandable before the
                market has to discover it later.
              </p>
            </div>

            <div className="grid gap-4">
              <InfoCard
                title="40% Public Market Release"
                text="Released at launch to establish initial circulation, trading access, and market participation."
              />

              <InfoCard
                title="15% Team Allocation"
                text="Structured for long-term alignment rather than immediate release."
              />

              <InfoCard
                title="20% Ecosystem Growth"
                text="Released through ecosystem growth logic tied to qualified locked participation and delayed reward maturity."
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-[#f5c26b]">
            Ecosystem Growth Before Reward Circulation
          </h2>

          <p className="text-lg leading-relaxed text-gray-300">
            A central idea inside REJU’s release strategy is that rewards should
            not enter circulation before the ecosystem has received new locked
            participation. In the REJU model, ecosystem rewards are connected to
            qualified participation growth.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            For example, when qualified participants enter through locked
            commitments, the reward structure is delayed until maturity. This
            creates separation between ecosystem growth and reward circulation,
            helping reduce immediate emission pressure.
          </p>

          <p className="text-lg leading-relaxed text-gray-300">
            This does not guarantee market performance. It does create a more
            transparent and circulation-aware structure where release behavior is
            visible, delayed, and connected to participation.
          </p>
        </section>

        <section className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_30px_rgba(245,194,107,0.08)]">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f5c26b]">
                Standardized Disclosure
              </p>

              <h2 className="text-4xl font-bold text-[#f5c26b]">
                Making Release Intent Easier to Read
              </h2>

              <p className="text-lg leading-relaxed text-gray-300">
                Rejunomics™ introduces a standardized way to describe release
                behavior. The purpose is not to complicate tokenomics. The
                purpose is to make release intent easier to read, compare, and
                evaluate.
              </p>

              <p className="text-lg leading-relaxed text-gray-300">
                A clear release structure can show whether a project is using
                fast aggressive emissions, delayed release, progressive release,
                or more conservative circulation-aware growth mechanics.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#f5c26b]/30 bg-black/30 p-5">
                <h3 className="font-bold text-[#f5c26b]">
                  Rejunomics™ Notation
                </h3>
                <p className="mt-3 font-mono text-sm text-[#f5c26b]">
                  REJU-[TYPE][CONDITION]-[AMOUNT]/[TIME]-[MODE]
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="font-bold text-[#f5c26b]">
                  Release Modes
                </h3>

                <p className="mt-3 text-sm text-gray-300">
                  <span className="font-mono text-[#f5c26b]">P</span> —
                  Progressive release over time.
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  <span className="font-mono text-[#f5c26b]">O</span> —
                  One-time unlock after the stated condition or maturity period.
                </p>
              </div>

              <div className="rounded-2xl border border-[#f5c26b]/30 bg-black/30 p-5">
                <h3 className="font-bold text-[#f5c26b]">Example</h3>
                <p className="mt-3 font-mono text-xl font-bold text-[#f5c26b]">
                  REJU-R10-10/12-O
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">
                  Referral-based release: 10 qualified referrals earn a 10%
                  reward, released as a one-time unlock after 12 months.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-4xl font-bold text-[#f5c26b]">
            What Rejunomics™ Is Designed to Reveal
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <InfoCard
              title="Release Timing"
              text="When held or rewarded tokens may enter circulation."
            />
            <InfoCard
              title="Release Conditions"
              text="What must happen before tokens become available."
            />
            <InfoCard
              title="Release Behavior"
              text="Whether tokens enter circulation progressively or through a one-time unlock."
            />
            <InfoCard
              title="Tokenomic Intent"
              text="Whether the structure appears aggressive, delayed, conservative, or circulation-aware."
            />
          </div>
        </section>

        <section className="mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-4xl font-bold text-[#f5c26b]">
            A First Step Toward Clearer Launch Disclosure
          </h2>

          <p className="text-lg leading-relaxed text-gray-300">
            REJU is introducing Rejunomics™ as a first step toward clearer
            release architecture in token launches. The framework is intended to
            help projects communicate more transparently and help investors
            evaluate how tokens may enter circulation over time.
          </p>

          <p className="text-lg leading-relaxed text-gray-400">
            Rejunomics™ does not guarantee project success or market
            performance. It is a disclosure framework designed to improve
            visibility, comparison, and accountability around release behavior.
          </p>

          <a
            href="/"
            className="inline-flex rounded-full bg-[#f5c26b] px-8 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Back to REJU
          </a>
        </section>
      </section>
    </main>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/30 p-5">
      <h3 className="font-bold text-[#f5c26b]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}