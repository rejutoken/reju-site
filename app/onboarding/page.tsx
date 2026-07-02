import Nav from "../components/Nav";
import { ClientFunnel, FunnelPrimaryCta } from "../components/ClientFunnel";

const links = {
  program: "/program",
  buy: "/buy",
  crpWelcome: "/crp-welcome",
  bookAdminPayment: "https://square.link/u/zH7dIuF5",
  directProgramPayment: "https://square.link/u/fmBzbrPI",
  participantRegistration: "/participant-registration?flow=event",
  crpRegistration: "/participant-registration?flow=crp",
  uploadCrp: "/uploadcrp",
  streamflowLock: "https://app.streamflow.finance/token-lock",
  bookAuthoring: "/daily-transformation-log",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function Onboarding() {
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300"
      id="main-content"
    >
      <Nav />

      <section className="px-6 py-12 text-center">
        <a href={links.program} className="text-sm text-[#f5c26b] underline hover:no-underline">
          ← Back to Program
        </a>

        <p className="mb-4 mt-6 text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Onboarding
        </p>

        <h1 className="mx-auto max-w-4xl text-3xl font-bold leading-tight text-[#f5c26b] md:text-4xl">
          Enroll in the REJU Rejuvenation Event™
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
          Choose your entry path, complete payment or your REJU lock, register for your Participant
          ID, then begin Authoring Your Book.
        </p>

        <div className="mx-auto mt-10 max-w-5xl">
          <ClientFunnel currentStep={2} />
        </div>
      </section>

      <section id="payments" className="scroll-mt-24 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
              Event Enrollment — Pay &amp; Lock
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#f5c26b]">Choose Your Entry Path</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400">
              All participants pay the $69 book + admin fee. Then complete registration below.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <PathCard
              tag="Path A"
              title="Crypto Lock"
              steps={[
                "Buy $600 worth of REJU",
                "Lock with Streamflow (6 months, non-custodial)",
                "Pay $69 book + admin (Square)",
              ]}
              actions={[
                { label: "Buy REJU", href: links.buy },
                { label: "Lock on Streamflow", href: links.streamflowLock, external: true },
                { label: "Pay $69 Book + Admin", href: links.bookAdminPayment, external: true },
              ]}
            />

            <PathCard
              tag="Path B"
              title="Direct Entry"
              steps={["Pay $600 program fee (Square)", "Pay $69 book + admin (Square)"]}
              actions={[
                { label: "Pay $600 Program Fee", href: links.directProgramPayment, external: true },
                { label: "Pay $69 Book + Admin", href: links.bookAdminPayment, external: true },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 text-center shadow-[0_0_40px_rgba(245,194,107,0.14)]">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
            Event Registration
          </p>
          <h2 className="mt-3 text-2xl font-bold text-[#f5c26b]">Complete Participant Registration</h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">
            After payment, register to receive your Participant ID. REJU provides the current
            cohort password to paid participants only.
          </p>
          <div className="mt-8">
            <FunnelPrimaryCta
              href={links.participantRegistration}
              label="Continue to Registration →"
            />
          </div>
          <p className="mt-6 text-sm text-gray-500">
            After registration you receive event materials and begin daily book authoring.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#f5c26b]">
              Separate Path
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#f5c26b]">
              CRP Certification
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              The Certified Rejuvenation Practitioner path is for participants who want to
              understand, support, and eventually guide the REJU rejuvenation process with
              professionalism and responsibility. This is not the standard Event enrollment.
            </p>
          </div>

          <ul className="mx-auto mt-6 max-w-xl space-y-2 text-left text-gray-300">
            <li className="flex gap-2">
              <span className="text-[#f5c26b]">•</span>
              <span>Complete the CRP training and certification requirements</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#f5c26b]">•</span>
              <span>Register on the CRP participant record</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#f5c26b]">•</span>
              <span>Upload your CRP payment receipt when required</span>
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a href={links.crpRegistration} className={buttonClass}>
              CRP Registration
            </a>
            <a href={links.uploadCrp} className={buttonClass}>
              Upload CRP Receipt
            </a>
            <a href={links.crpWelcome} className="text-sm text-[#f5c26b] underline hover:no-underline">
              Learn about CRP
            </a>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-gray-500">
          Already registered?{" "}
          <a href={links.bookAuthoring} className="text-[#f5c26b] underline hover:no-underline">
            Go to book authoring
          </a>
        </p>
      </section>
    </main>
  );
}

function PathCard({
  tag,
  title,
  steps,
  actions,
}: {
  tag: string;
  title: string;
  steps: string[];
  actions: { label: string; href: string; external?: boolean }[];
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#160b05]/85 p-8 shadow-[0_0_30px_rgba(245,194,107,0.10)]">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f5c26b]">{tag}</p>
      <h3 className="mt-2 text-xl font-bold text-[#f5c26b]">{title}</h3>
      <ol className="mt-4 space-y-2 text-left text-gray-300">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="text-[#f5c26b]">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex flex-col gap-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={buttonClass}
            {...(action.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}