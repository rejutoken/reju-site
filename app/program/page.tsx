import Nav from "../components/Nav";

const links = {
  onboarding: "/onboarding",
  katShortVideo: "https://www.youtube.com/embed/qqu3x0Gy-AM",
  katLongVideo: "https://www.youtube.com/embed/pzi4Qj5HMwM",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

const primaryButtonClass =
  "rounded-full border border-[#f5c26b] bg-[#f5c26b] px-8 py-3 text-center font-semibold text-black transition duration-300 hover:bg-[#ffd88a]";

export default function ProgramPage() {
  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] px-6 py-6 text-gray-300"
      id="main-content"
    >
      <Nav />

      <section className="mx-auto max-w-4xl space-y-14">
        <section className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
            REJU Program
          </p>

          <h1 className="text-3xl font-bold text-[#f5c26b] sm:text-4xl">
            REJU Rejuvenation Event™
          </h1>

          <h2 className="mt-4 text-xl text-[#f5c26b] sm:text-2xl">
            A 6-Week Benchmark-Setting Rejuvenation Experience
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-left text-lg leading-relaxed text-gray-300">
            A guided metabolic rejuvenation protocol built from lived experience, scientific
            structure, and disciplined execution. You document your starting point, follow the
            REJU Protocol™ for four core weeks, and finish with a clear before-and-after record
            of your transformation.
          </p>

          <p className="mx-auto mt-4 max-w-3xl text-left text-lg leading-relaxed text-gray-300">
            Throughout the Event you are <strong className="text-white">Authoring Your Personalized REJU Transformation Book</strong> — daily photos, journaling, and reflections become the chapters you write.
          </p>

          <ProgramCtas />
        </section>

        <Card>
          <h2 className="text-2xl font-bold text-[#f5c26b]">How the 6 Weeks Are Structured</h2>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            The Event runs six weeks total: one week of preparation, four weeks of core rejuvenation
            protocol, and one week of celebration. The preparation week sets your{" "}
            <strong className="text-white">REJU Health Benchmark™</strong> — your honest Day 1
            reference for photos, energy, and how your body feels. That benchmark is what you compare
            against at the end.
          </p>

          <div className="mt-8 space-y-4">
            <Phase
              label="Preparation Week"
              text="Set your benchmark. Document where you are before the protocol begins — photos, energy, habits, and how your body feels in daily life."
            />
            <Phase
              label="Week 1 — Introduction"
              text="Introduction to your body and to the systems of ketosis and autophagy. You learn the structure and begin the metabolic transition."
            />
            <Phase
              label="Week 2 — Repair Begins"
              text="Your body is in ketosis and autophagy. Cellular repair begins, the feeling of freedom starts, and you begin to see and feel changes."
            />
            <Phase
              label="Week 3 — Freedom & Lightness"
              text="The feeling of freedom becomes more apparent. Euphoria, lightness, and happiness often emerge as the body adapts."
            />
            <Phase
              label="Week 4 — Optimal State"
              text="You begin recognizing the optimal state you have achieved and how your body performs at its best. Before-and-after photos from Day 1 to now tell the story."
            />
            <Phase
              label="Celebration Week"
              text="Celebrate what you documented, compare your benchmark to your results, and carry the habits forward."
            />
          </div>

          <p className="mt-8 rounded-2xl border border-[#f5c26b]/20 bg-black/25 p-5 text-sm leading-relaxed text-gray-400">
            These outcomes are not a guarantee. They reflect what participants regularly experience
            when they adhere fully to the protocol and commit to recovering themselves.
          </p>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold text-[#f5c26b]">Built on Kat&apos;s Legacy</h2>
          <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <img
              src="/book-cover.jpg"
              alt="Kat's Legacy Book Cover"
              className="w-[200px] shrink-0 rounded-2xl border border-[#f5c26b]/20 shadow-[0_0_35px_rgba(245,194,107,0.18)]"
            />
            <p className="text-lg leading-relaxed text-gray-300">
              <em>Kat&apos;s Legacy</em> is the foundation of the REJU Protocol™ — the science-based
              path behind the Event, Kat&apos;s JOL™ (Juice Of Life™), and the self-guided structure
              participants follow. Enrollment, payment, and registration are handled on the onboarding
              page.
            </p>
          </div>
        </Card>

        <section id="proof" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#f5c26b]">Real Transformation. Real Results.</h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-400">
              Visible change through disciplined execution and the REJU structure.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Video title="Short Transformation Video" src={links.katShortVideo} />
            <Video title="Full Transformation Video" src={links.katLongVideo} />
          </div>
        </section>

        <section className="rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/70 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#f5c26b]">Ready to Enter?</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">
            Onboarding handles your entry path, payment, registration, and next steps.
          </p>
          <div className="mt-8">
            <ProgramCtas />
          </div>
        </section>
      </section>
    </main>
  );
}

function ProgramCtas() {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
      <a href={links.onboarding} className={primaryButtonClass}>
        Enter the Program
      </a>
      <a href={links.onboarding} className={buttonClass}>
        Onboarding
      </a>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_30px_rgba(245,194,107,0.08)]">
      {children}
    </div>
  );
}

function Phase({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/30 p-5">
      <h3 className="text-lg font-bold text-[#f5c26b]">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">{text}</p>
    </div>
  );
}

function Video({ title, src }: { title: string; src: string }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/30 p-4">
      <h3 className="mb-4 text-lg font-bold text-[#f5c26b]">{title}</h3>
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