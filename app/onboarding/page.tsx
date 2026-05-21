const links = {
  home: "/",
  buy: "/buy",
  program: "/program",

  squareBookAdmin: "https://square.link/u/zH7dIuF5",
  squareProgramEntry: "https://square.link/u/fmBzbrPI",
  squareCRP: "https://square.link/u/rNg4gKpu",

  verification:
    "https://docs.google.com/forms/d/e/1FAIpQLScO4vzCRK-gmb5CWU1TcpzpCkyk5t_3hhagYDzlRnaPdRY2Hw/viewform?usp=publish-editor",

  telegramOfficial: "https://t.me/rejutokenofficial",

  streamflowLock: "#",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function OnboardingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl space-y-16">
        <section className="text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
            REJU ONBOARDING
          </p>

          <h1 className="text-5xl font-bold text-[#f5c26b] md:text-7xl">
            Enter the REJU Rejuvenation Event™
          </h1>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-300">
            The onboarding process begins with <em>Kat’s Legacy: A Science-Based
            Path to Healing and Longevity</em>, the foundational guide behind the
            REJU Protocol™, Kat’s JOL™, and the rejuvenation structure used during
            the REJU Rejuvenation Event™.
          </p>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-300">
            Participants may follow the self-guided rejuvenation structure directly
            through the book or join the guided cohort experience for accountability,
            support, education, and structured execution.
          </p>

          <p className="mt-6 font-semibold text-[#f5c26b]">
            Cohort 1 is limited to 30 verified participants.
          </p>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <StepCard
            number="1"
            title="Book + Admin Access"
            text="Every participant begins with the required book and administrative access. The book contains the REJU Protocol™, the self-guided rejuvenation structure, and Kat’s JOL™ recipe used during the event."
            button="Pay $69 with Square"
            link={links.squareBookAdmin}
          />

          <StepCard
            number="2"
            title="Choose Your Entry Path"
            text="Participants may enter through the REJU locking path or through direct program entry using fiat payment."
            button="View Entry Paths"
            link="#entry-paths"
          />

          <StepCard
            number="3"
            title="Submit Verification"
            text="After payment or REJU lock confirmation, submit your onboarding verification form to receive private cohort access."
            button="Submit Verification"
            link={links.verification}
          />
        </section>

        <section id="entry-paths" className="grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="text-3xl font-bold text-[#f5c26b]">
              REJU Locking Path
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Participants choosing the REJU alignment path lock $600 worth of
              REJU for 24 months and receive program access included.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              REJU does not custody your locked tokens. Participants maintain
              wallet control while the lock is independently verified through
              the onboarding process.
            </p>

            <div className="mt-8 space-y-4">
              <Bullet text="Buy or hold $600 worth of REJU" />
              <Bullet text="Lock REJU for 24 months" />
              <Bullet text="Submit verification form" />
              <Bullet text="Receive cohort approval and access" />
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href={links.buy} className={`${buttonClass} flex-1`}>
                Buy REJU
              </a>

              <a href={links.streamflowLock} className={`${buttonClass} flex-1`}>
                Lock REJU
              </a>
            </div>
          </Card>

          <Card>
            <h2 className="text-3xl font-bold text-[#f5c26b]">
              Direct Program Entry
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Participants who do not wish to lock REJU may enter directly through
              the fiat onboarding path using secure Square payment processing.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-gray-300">
              This option includes access to the guided cohort experience,
              accountability structure, education, support, and rejuvenation
              framework used throughout the REJU Rejuvenation Event™.
            </p>

            <div className="mt-8 space-y-4">
              <Bullet text="Complete $69 Book + Admin payment" />
              <Bullet text="Complete $600 Program Entry payment" />
              <Bullet text="Submit verification form" />
              <Bullet text="Receive cohort approval and access" />
            </div>

            <a
              href={links.squareProgramEntry}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-10 block ${buttonClass}`}
            >
              Pay $600 with Square
            </a>
          </Card>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <Card>
            <h2 className="text-3xl font-bold text-[#f5c26b]">
              Verification Process
            </h2>

            <div className="mt-8 space-y-5">
              <Flow text="Book/Admin payment completed" />
              <Flow text="REJU lock or direct entry completed" />
              <Flow text="Verification form submitted" />
              <Flow text="Manual review and cohort approval" />
              <Flow text="Private Telegram cohort access delivered" />
            </div>

            <div className="mt-8 rounded-2xl border border-[#f5c26b]/20 bg-black/20 p-5">
              <p className="text-sm leading-relaxed text-gray-300">
                During the initial launch phase, verification is handled manually
                to maintain onboarding quality, participant integrity, and
                accountability.
              </p>
            </div>
          </Card>

          <Card>
            <h2 className="text-3xl font-bold text-[#f5c26b]">
              Current Cohort Structure
            </h2>

            <div className="mt-8 space-y-4">
              <Cohort text="Cohort 1 — 30 Participants" />
              <Cohort text="Cohort 2 — 60 Participants" />
              <Cohort text="Cohort 3 — 90 Participants" />
            </div>

            <p className="mt-8 text-lg leading-relaxed text-gray-300">
              REJU expansion is intentionally controlled to maintain participant
              support, onboarding quality, accountability, execution, and visible
              transformation integrity throughout the REJU Ecosystem™.
            </p>

            <a
              href={links.telegramOfficial}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-10 block rounded-full ${buttonClass}`}
            >
              Official REJU Telegram
            </a>
          </Card>
        </section>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
      {children}
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
  button,
  link,
}: {
  number: string;
  title: string;
  text: string;
  button: string;
  link: string;
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 text-center shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5c26b] font-bold text-black">
        {number}
      </div>

      <h2 className="mt-6 text-2xl font-bold text-[#f5c26b]">
        {title}
      </h2>

      <p className="mt-4 leading-relaxed text-gray-300">
        {text}
      </p>

      <a href={link} className={`mt-8 block ${buttonClass}`}>
        {button}
      </a>
    </div>
  );
}

function Flow({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/30 bg-black/20 p-4 text-center text-gray-200">
      {text}
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/20 p-4 text-gray-300">
      • {text}
    </div>
  );
}

function Cohort({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/30 bg-black/20 p-5 text-center text-[#f5c26b]">
      {text}
    </div>
  );
}