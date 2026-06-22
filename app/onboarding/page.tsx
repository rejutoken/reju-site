const links = {
  home: "/",
  buy: "/buy",
  program: "/program",
  onboarding: "/onboarding",
  telegramCommunity: "https://t.me/rejuofficial",

  bookAdminPayment: "https://square.link/u/zH7dIuF5",
  directProgramPayment: "https://square.link/u/fmBzbrPI",
  participantRegistration: "/participant-registration",
  streamflowLock: "https://app.streamflow.finance/token-lock",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

import Nav from "../components/Nav";

export default function Onboarding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300" id="main-content">
      <Nav />

      <section className="px-6 py-16 text-center">
        <p className="mb-4 text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Onboarding
        </p>

        <h1 className="mx-auto max-w-5xl text-3xl font-bold leading-tight text-[#f5c26b] md:text-3xl">
          Enter the REJU Rejuvenation Event™
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-gray-300">
          Complete your enrollment and registration process for the next REJU
          Rejuvenation Event™.
        </p>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 shadow-[0_0_40px_rgba(245,194,107,0.14)] backdrop-blur-md md:p-10">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              How to Enroll
            </p>

            <h2 className="mt-4 text-3xl font-bold text-[#f5c26b] md:text-3xl">
              Four Simple Steps
            </h2>
          </div>

          <div className="mt-10 grid gap-6">
            <Step
              number="1"
              title="Pay the $69 Book + Admin Registration"
              text="This payment is required for all participants and covers the book/program guide and administrative onboarding — the foundation of the book you will Author using your Participant ID."
            />

            <Step
              number="2"
              title="Choose Your Entry Path"
              text="Lock $600 worth of REJU for 6 months (crypto) or pay the $600 program fee (direct). Both give free access to the program and redirect to registration."
            />

            <Step
              number="3"
              title="Complete Participant Registration"
              text="Create your REJU participant record for enrollment, communication, and transformation tracking. You will be redirected here automatically after paying/locking."
            />

            <Step
              number="4"
              title="Receive Program Access"
              text="Once enrollment is reviewed and approved, you will receive access instructions for the next REJU Rejuvenation Event™."
            />
          </div>
          <div className="mt-6 text-center">
            <a href="/daily-transformation-log" className={buttonClass}>
              Start Authoring Your Personalized Book (use your Participant ID)
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h3 className="text-2xl font-bold text-[#f5c26b] mb-6 text-center">Choose Your Entry Path</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Crypto Lock Path Card */}
            <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#160b05]/85 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
              <h4 className="text-xl font-bold text-[#f5c26b] mb-4">Crypto Lock Path</h4>
              <ul className="space-y-3 text-left text-gray-300">
                <li className="flex gap-3">
                  <span className="text-[#f5c26b]">•</span>
                  <span>Buy REJU $600</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5c26b]">•</span>
                  <span>Lock your REJU with Streamflow (6 Months)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5c26b]">•</span>
                  <span>Pay $69 for book guide</span>
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <a href={links.buy} className={buttonClass}>Buy REJU</a>
                <a href={links.streamflowLock} className={buttonClass}>Lock REJU</a>
                <a href={links.bookAdminPayment} className={buttonClass}>Buy Book $69</a>
              </div>
            </div>

            {/* Direct Entry Path Card */}
            <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#160b05]/85 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
              <h4 className="text-xl font-bold text-[#f5c26b] mb-4">Direct Entry Path</h4>
              <ul className="space-y-3 text-left text-gray-300">
                <li className="flex gap-3">
                  <span className="text-[#f5c26b]">•</span>
                  <span>Pay $600</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#f5c26b]">•</span>
                  <span>Pay 69 for the book guide</span>
                </li>
              </ul>
              <div className="mt-6 flex flex-col gap-3">
                <a href={links.directProgramPayment} className={buttonClass}>Pay $600</a>
                <a href={links.bookAdminPayment} className={buttonClass}>Buy Book $69</a>
              </div>
            </div>
          </div>
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
        <p className="mt-3 text-base leading-relaxed text-gray-300 md:text-lg">
          {text}
        </p>
      </div>
    </div>
  );
}

function PathCard({
  title,
  subtitle,
  description,
  items,
  buttons,
}: {
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  buttons: { label: string; href: string }[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#160b05]/85 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
        {title}
      </p>

      <h3 className="mt-3 text-3xl font-bold text-[#f5c26b]">{subtitle}</h3>

      <p className="mt-4 text-gray-300">{description}</p>

      <ul className="mt-6 space-y-3 text-left text-gray-300">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="text-[#f5c26b]">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3">
        {buttons.map((button, index) => (
          <a key={index} href={button.href} className={buttonClass}>
            {button.label}
          </a>
        ))}
      </div>
    </div>
  );
}