const links = {
  home: "/",
  onboarding: "/onboarding",
  telegramCommunity: "https://t.me/rejutokencommunity",
  katShortVideo: "https://www.youtube.com/embed/qqu3x0Gy-AM",
  katLongVideo: "https://www.youtube.com/embed/pzi4Qj5HMwM",
  book: "https://square.link/u/zH7dIuF5",
  streamflowLock: "#",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function ProgramPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] px-6 py-20 text-gray-300">
      <section className="mx-auto max-w-7xl space-y-20">

        <section className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
            REJU Program
          </p>

          <h1 className="text-5xl font-bold text-[#f5c26b] md:text-6xl">
            REJU Rejuvenation Event™
          </h1>

          <h2 className="mt-4 text-4xl font-bold md:text-4xl">
            A Structured 6-Week Rejuvenation Experience
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-lg text-left leading-relaxed text-gray-300">
            Built from lived experience, scientific structure, disciplined execution,
            and a relentless pursuit of rejuvenation from within.
        
            <p>The REJU Rejuvenation Event™ is a structured metabolic and rejuvenation-focused
            protocol designed to help participants reconnect with energy, discipline,
            metabolic balance, visible transformation, and stronger inside-and-out results
            through guided execution and accountability.
          </p>
</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href="#proof" className={buttonClass}>
              Watch Results
            </a>

            <a href={links.onboarding} className={buttonClass}>
              Enter Program
            </a>

            <a href={links.streamflowLock} className={buttonClass}>
              Lock REJU with Streamflow
            </a>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">

          <Card>
            <h2 className="text-4xl font-bold text-[#f5c26b]">
              Rejuvenating From the Inside Out
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Many people spend years feeling trapped inside a body that no longer feels like their own.
              Low energy, inflammation, weight gain, processed nutritional dependency, mental fog,
              lack of motivation, inconsistent habits, and the quiet frustration of watching their
              physical condition drift away from where it once was.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              The REJU Rejuvenation Event™ was created to interrupt that cycle.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              Built around the REJU Protocol™, this guided 6-week rejuvenation experience helps
              participants reconnect with structure, discipline, metabolic balance, physical awareness,
              and visible transformation through a realistic process rooted in lived experience.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              REJU focuses on visible rejuvenation, body composition changes, reduced inflammation,
              restored consistency, and rebuilding the relationship between the participant and their body.
              Daily pictures, journaling, and accountability create a visible transformation history.
            </p>
			
			<div className="mt-10 rounded-3xl border border-[#f5c26b]/20 bg-black/20 p-6">
  <h3 className="text-3xl font-bold text-[#f5c26b]">
    Enter the REJU Program
  </h3>

  <p className="mt-4 text-base leading-relaxed text-gray-300">
    Join the guided 6-week rejuvenation program built around structure,
    accountability, visible transformation, and metabolic rejuvenation.
  </p>

  <div className="mt-6 grid gap-4 md:grid-cols-2">

    <Info
      title="Program Format"
      text="6-week guided rejuvenation program with daily structure, education, accountability, and recorded sessions."
    />

    <Info
      title="Required Entry"
      text="$69 book + admin fee required. The book is the guide and contains Kat’s JOL™ recipe."
    />

    <Info
      title="REJU Lock Path"
      text="Program access included with a $600 REJU lock commitment for 6 months through Streamflow."
    />

    <Info
      title="Direct Entry Path"
      text="Participants may enter directly through the $600 program entry path plus the required book/admin fee."
    />
  </div>

  <div className="mt-8 flex flex-col gap-4 text-center sm:flex-row sm:justify-center">

    <a href={links.streamflowLock} className={buttonClass}>
      Lock REJU with Streamflow
    </a>

    <a href={links.onboarding} className={buttonClass}>
      Start Onboarding
    </a>

  </div>
</div>
			
          </Card>

          <Card>
            <h2 className="text-4xl font-bold text-[#f5c26b]">
              The REJU Rejuvenation Journey™
            </h2>

            <div className="mt-6 space-y-6">
              <JourneyWeek
                title="Week 1 — Establishing Your Starting Point"
                text="Participants document their current condition through daily pictures, journaling, and personal reflections describing energy, emotional state, habits, physical condition, and overall well-being."
              />

              <JourneyWeek
                title="Week 2 — Metabolic Transition and Adaptation"
                text="Nourishment timing and intake are systematically adjusted through the REJU Protocol™ and Kat’s JOL™ to guide the body toward ketosis and autophagy-supportive rejuvenation states."
              />

              <JourneyWeek
                title="Week 3 — Entering a Rejuvenation State"
                text="Energy stability, reduced bloating, improved mental clarity, visible volume reduction, and stronger physical awareness often become more noticeable."
              />

              <JourneyWeek
                title="Week 4 — Reinforcing Cellular Rejuvenation"
                text="The body continues adapting to the rejuvenation-focused metabolic environment, supporting deeper physical transformation, clearer thinking, discipline, and well-being."
              />

              <JourneyWeek
                title="Week 5 — Building Longevity Habits"
                text="Week five reinforces structure, consistency, metabolic efficiency, confidence, self-awareness, and habits designed to continue into the REJU Longevity Group™."
              />

              <JourneyWeek
                title="Week 6 — Reclaiming Control"
                text="Participants complete the event with documented transformation history, visible physical changes, stronger metabolic awareness, and renewed control over body, habits, and energy."
              />
            </div>
          </Card>
        </section>

        <Card>
          <div className="flex flex-col items-center text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f5c26b]">
              Foundational Guide — The Book
            </p>

            <h2 className="mt-4 max-w-4xl text-4xl font-bold text-[#f5c26b]">
              Kat’s Legacy: A Science-Based Path to Healing and Longevity
            </h2>

            <div className="mt-10 flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:text-left">

              <div className="flex shrink-0 justify-center">
                <img
                  src="/book-cover.jpg"
                  alt="Kat's Legacy Book Cover"
                  className="w-[280px] rounded-2xl border border-[#f5c26b]/20 shadow-[0_0_35px_rgba(245,194,107,0.18)]"
                />
              </div>

              <div className="max-w-3xl">
                <p className="text-lg leading-relaxed text-gray-300">
                  <em>Kat’s Legacy</em> is the foundation of the REJU Protocol™ and the starting point
                  of the REJU Ecosystem™. It contains the structure behind the rejuvenation process,
                  the self-guided version of the event, and the recipe for Kat’s JOL™ — Juice Of Life™.
                </p>

                <p className="mt-4 text-lg leading-relaxed text-gray-300">
                  Readers can begin their rejuvenation journey directly through the book. Participants
                  who want support, accountability, daily structure, and guided execution can enter the
                  REJU Rejuvenation Event™.
                </p>
              </div>
            </div>

            <div className="mt-12 grid w-full gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Info title="Kat’s JOL™" text="The original Juice Of Life™ rejuvenation recipe." />
              <Info title="Self-Guided Event" text="Follow the rejuvenation structure directly through the book." />
              <Info title="REJU Protocol™" text="The philosophy and rejuvenation framework behind the event." />
              <Info title="Metabolic Rejuvenation" text="Structured rejuvenation principles designed for long-term longevity habits." />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={links.book} className={buttonClass}>
                Buy the Book — Start Self-Guided
              </a>

              <a href={links.onboarding} className={buttonClass}>
                Join the Guided program
              </a>
            </div>
          </div>
        </Card>

        <section id="proof" className="space-y-8">

          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#f5c26b]">
              Real Transformation. Real Discipline.
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-gray-300">
              The videos below show visible transformation, disciplined execution,
              and the power of following the REJU structure.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Video title="Short Transformation Video" src={links.katShortVideo} />
            <Video title="Full Transformation Video" src={links.katLongVideo} />
          </div>
        </section>

 
      </section>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_30px_rgba(245,194,107,0.08)]">
      {children}
    </div>
  );
}

function JourneyWeek({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/30 p-5">
      <h3 className="text-xl font-bold text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function Info({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/30 p-5">
      <h3 className="font-bold text-[#f5c26b]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function Video({ title, src }: { title: string; src: string }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-4">
      <h3 className="mb-4 text-xl font-bold text-[#f5c26b]">{title}</h3>

      <div className="aspect-video overflow-hidden rounded-2xl">
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}