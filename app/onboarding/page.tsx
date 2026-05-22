const links = {
  home: "/",
  buy: "/buy",
  program: "/program",
  onboarding: "/onboarding",
  telegramCommunity: "https://t.me/rejutokencommunity",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function Onboarding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href={links.home} className="font-bold text-[#f5c26b]">REJU</a>

        <div className="hidden gap-6 text-sm text-gray-300 md:flex">
          <a href={links.buy} className="hover:text-[#f5c26b]">Buy REJU</a>
          <a href={links.program} className="hover:text-[#f5c26b]">Program</a>
          <a href={links.onboarding} className="hover:text-[#f5c26b]">Onboarding</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className="hover:text-[#f5c26b]">Telegram</a>
        </div>
      </nav>

      <section className="px-6 py-16 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Onboarding
        </p>

        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight text-[#f5c26b] md:text-7xl">
          Enter the REJU Rejuvenation Event™
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-gray-100 md:text-xl">
          Enrollment begins with the required $69 REJU Guide + Admin Registration. After that, choose your entry path: lock REJU for 6 months or enter directly through the standard program path.
        </p>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-300 md:text-lg">
          After registration, submit your verification so your participation can be reviewed and your cohort access can be approved.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href="#enrollment-steps" className={buttonClass}>View Enrollment Steps</a>
          <a href={links.program} className={buttonClass}>View Program</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className={buttonClass}>Join Telegram</a>
        </div>
      </section>

      <section id="enrollment-steps" className="px-6 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 shadow-[0_0_40px_rgba(245,194,107,0.14)] backdrop-blur-md md:p-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              How to Enroll
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b] md:text-5xl">
              Four Simple Steps
            </h2>
          </div>

          <div className="mt-10 grid gap-6">
            <Step
              number="1"
              title="Purchase the REJU Guide + Admin Registration"
              text="All participants begin by paying the required $69 registration amount. This covers the REJU guide/book and administrative onboarding."
            />

            <Step
              number="2"
              title="Choose Your Entry Path"
              text="Crypto participants may enter by locking REJU for 6 months. This makes the program practically free because participation is connected to the REJU ecosystem. Non-crypto participants may choose direct program entry."
            />

            <Step
              number="3"
              title="Submit Verification"
              text="After registering, submit your payment confirmation and, when applicable, your REJU lock verification. This allows the team to confirm your entry path."
            />

            <Step
              number="4"
              title="Receive Cohort Access"
              text="Once verification is approved, you will receive the next onboarding instructions and access to the REJU Rejuvenation Event™ cohort."
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <PathCard
            title="Crypto Entry Path"
            subtitle="Lock REJU for 6 Months"
            items={[
              "$69 guide + admin registration required",
              "Lock REJU for 6 months",
              "Submit lock verification",
              "Receive cohort access after approval",
              "Designed for REJU ecosystem participants",
            ]}
          />

          <PathCard
            title="Direct Entry Path"
            subtitle="Standard Program Enrollment"
            items={[
              "$69 guide + admin registration required",
              "Direct program entry for non-crypto users",
              "No REJU lock required",
              "Submit registration verification",
              "Receive cohort access after approval",
            ]}
          />
        </div>
      </section>

      <section className="px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-[#f5c26b]">
          Ready to Begin?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Start with registration, choose your path, submit verification, and enter the REJU Rejuvenation Event™.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a href={links.buy} className={buttonClass}>Buy / Lock REJU</a>
          <a href={links.program} className={buttonClass}>View Program</a>
          <a href={links.telegramCommunity} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            Join Telegram Community
          </a>
        </div>
      </section>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="grid gap-4 rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6 md:grid-cols-[80px_1fr] md:items-start">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#f5c26b] text-2xl font-bold text-[#f5c26b]">
        {number}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[#f5c26b]">{title}</h3>
        <p className="mt-3 text-base leading-relaxed text-gray-300 md:text-lg">{text}</p>
      </div>
    </div>
  );
}

function PathCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#160b05]/85 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold text-white">
        {subtitle}
      </h3>

      <ul className="mt-6 space-y-3 text-left text-gray-300">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-[#f5c26b]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}