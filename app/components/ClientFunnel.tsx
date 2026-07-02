export const CLIENT_FUNNEL_STEPS = [
  {
    number: "1",
    title: "Program",
    subtitle: "Learn the Event",
    href: "/program",
  },
  {
    number: "2",
    title: "Onboarding",
    subtitle: "Choose your path",
    href: "/onboarding",
  },
  {
    number: "3",
    title: "Pay & Lock",
    subtitle: "Square or Streamflow",
    href: "/onboarding#payments",
  },
  {
    number: "4",
    title: "Register",
    subtitle: "Get your Participant ID",
    href: "/participant-registration?flow=event",
  },
  {
    number: "5",
    title: "Author",
    subtitle: "Daily journal",
    href: "/daily-transformation-log",
  },
] as const;

const primaryButtonClass =
  "inline-block rounded-full border border-[#f5c26b] bg-[#f5c26b] px-8 py-3 text-center font-semibold text-black transition duration-300 hover:bg-[#ffd88a]";

const secondaryButtonClass =
  "inline-block rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export function ClientFunnel({ currentStep }: { currentStep: number }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/25 bg-[#120904]/80 p-6 md:p-8">
      <p className="text-center text-sm font-bold uppercase tracking-[0.3em] text-[#f5c26b]">
        Your Path to the Event
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-gray-400">
        Follow these five steps in order. Marketing and research pages are optional — this is the
        enrollment path every participant takes.
      </p>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CLIENT_FUNNEL_STEPS.map((step) => {
          const stepNum = Number(step.number);
          const isCurrent = stepNum === currentStep;
          const isComplete = stepNum < currentStep;

          return (
            <li
              key={step.number}
              className={`rounded-2xl border p-4 text-center transition ${
                isCurrent
                  ? "border-[#f5c26b] bg-[#f5c26b]/10 shadow-[0_0_20px_rgba(245,194,107,0.12)]"
                  : isComplete
                    ? "border-[#f5c26b]/30 bg-black/20"
                    : "border-[#f5c26b]/10 bg-black/10 opacity-80"
              }`}
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                  isCurrent
                    ? "bg-[#f5c26b] text-black"
                    : isComplete
                      ? "border border-[#f5c26b] text-[#f5c26b]"
                      : "border border-[#f5c26b]/40 text-[#f5c26b]/70"
                }`}
              >
                {step.number}
              </div>
              <p className="mt-3 text-base font-bold text-[#f5c26b]">{step.title}</p>
              <p className="mt-1 text-xs text-gray-400">{step.subtitle}</p>
              {isCurrent && (
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-[#f5c26b]/80">
                  You are here
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function FunnelPrimaryCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a href={href} className={primaryButtonClass}>
      {label}
    </a>
  );
}

export function FunnelSecondaryCta({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a href={href} className={secondaryButtonClass}>
      {label}
    </a>
  );
}