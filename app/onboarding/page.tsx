const links = {
  home: "/",
  buy: "/buy",
  program: "/program",
  onboarding: "/onboarding",
  telegramCommunity: "https://t.me/rejutokencommunity",

  bookAdminPayment: "https://square.link/u/zH7dIuF5",
  directProgramPayment: "https://square.link/u/fmBzbrPI",
  verificationForm: "https://docs.google.com/forms/d/e/1FAIpQLSfvvLPXPEBuzDkh99vkjCD9iw-t_TOMUY6y_2qYt2CDhk_g0A/viewform?usp=header",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function Onboarding() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href={links.home} className="font-bold text-[#f5c26b]">
          REJU
        </a>

        <div className="hidden gap-6 text-sm text-gray-300 md:flex">
          <a href={links.buy} className="hover:text-[#f5c26b]">
            Buy REJU
          </a>
          <a href={links.program} className="hover:text-[#f5c26b]">
            Program
          </a>
          <a href={links.onboarding} className="hover:text-[#f5c26b]">
            Onboarding
          </a>
          <a
            href={links.telegramCommunity}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f5c26b]"
          >
            Telegram
          </a>
        </div>
      </nav>

      <section className="px-6 py-16 text-center">
        <p className="mb-4 text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Onboarding
        </p>

        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight text-[#f5c26b] md:text-5xl">
          Enter the REJU Rejuvenation Event™
        </h1>

      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 shadow-[0_0_40px_rgba(245,194,107,0.14)] backdrop-blur-md md:p-10">
          <div className="text-center">
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
              How to Enroll
            </p>

            <h2 className="mt-4 text-4xl font-bold text-[#f5c26b] md:text-5xl">
              Four Simple Steps
            </h2>
          </div>

          <div className="mt-10 grid gap-6">
            <Step
              number="1"
              title="Pay the $69 Book + Admin Registration"
              text="This payment is required for all participants and covers the book/program guide and administrative onboarding."
            />

            <Step
              number="2"
              title="Choose Your Entry Path"
              text="Crypto users may lock REJU for 6 months. Non-crypto users may enter through the direct program payment path."
            />

            <Step
              number="3"
              title="Submit Verification"
              text="Submit your payment confirmation and, when applicable, your REJU lock verification."
            />

            <Step
              number="4"
              title="Receive Program Access"
              text="Once verification is approved, you will receive the next instructions to enter the REJU Rejuvenation Event™."
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <PathCard
            title="Crypto Entry Path"
            subtitle="Lock REJU for 6 Months"
            description="For participants entering through REJU token participation."
            items={[
              "Pay $69 Book + Admin Registration",
              "Buy or hold the required REJU amount",
              "Lock REJU for 6 months",
              "Submit payment and lock verification",
              "Receive program access after approval",
            ]}
            buttons={[
              { label: "Pay $69 Book + Admin", href: links.bookAdminPayment },
              { label: "Buy / Lock REJU", href: links.buy },
              { label: "Submit Verification", href: links.verificationForm },
            ]}
          />

          <PathCard
            title="Direct Entry Path"
            subtitle="Standard Program Enrollment"
            description="For participants entering without using crypto."
            items={[
              "Pay $69 Book + Admin Registration",
              "Pay direct program entry fee",
              "Submit payment verification",
              "Receive program access after approval",
              "Designed for participants entering without a REJU lock",
            ]}
            buttons={[
              { label: "Pay $69 Book + Admin", href: links.bookAdminPayment },
              { label: "Pay Program Entry", href: links.directProgramPayment },
              { label: "Submit Verification", href: links.verificationForm },
            ]}
          />
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

      <h3 className="mt-3 text-3xl font-bold text-[#f5c26b]">
        {subtitle}
      </h3>

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
