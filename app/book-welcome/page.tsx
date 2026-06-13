const links = {
  home: "/",
  onboarding: "/onboarding",
  participantRegistration: "/participant-registration",
  telegramOfficial: "https://t.me/rejuofficial",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

export default function BookWelcome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300">
      <Nav links={links} />

      <section className="px-6 py-16 text-center">
        <p className="mb-4 text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Book + Admin
        </p>

        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight text-[#f5c26b] md:text-6xl">
          Welcome to Kat’s Legacy
        </h1>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-300">
          This book is the foundation of the REJU experience. It introduces the story, science, structure, and mindset behind the path to healing and longevity.
        </p>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 shadow-[0_0_40px_rgba(245,194,107,0.14)] backdrop-blur-md md:p-10">
          
<div className="grid gap-6 md:grid-cols-2">
  <Card title="What You Are Receiving">
    <ul className="space-y-3 text-gray-300">
      <Bullet>Kat&apos;s Legacy: a science-based guide to healing and longevity.</Bullet>
      <Bullet>The REJU program foundation and preparation guide.</Bullet>
      <Bullet>The principles behind autophagy, ketosis, cellular repair, detoxification, and metabolic reset.</Bullet>
      <Bullet>Administrative onboarding for your REJU participant record.</Bullet>
    </ul>
  </Card>

  <Card title="Why the Book Matters">
    <p className="leading-relaxed text-gray-300">
      REJU is not built around shortcuts. The book prepares you to understand why the process works, what your body may experience, and how consistency, structure, and awareness create visible transformation.
    </p>
  </Card>
</div>


          <div className="mt-8 rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6">
            <h2 className="text-3xl font-bold text-[#f5c26b]">What Happens Next</h2>

            <p className="mt-4 leading-relaxed text-gray-300">
              Complete your participant registration so REJU can create your official participant record and guide you through the next step.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href={links.participantRegistration} className={buttonClass}>
                Complete Participant Registration
              </a>

              <a href={links.telegramOfficial} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                Join REJU Official
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


function Nav({ links }: { links: any }) {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <a href={links.home} className="font-bold text-[#f5c26b]">REJU</a>
      <div className="hidden gap-6 text-sm text-gray-300 md:flex">
        <a href={links.onboarding} className="hover:text-[#f5c26b]">Onboarding</a>
        <a href={links.participantRegistration} className="hover:text-[#f5c26b]">Registration</a>
        <a href={links.telegramOfficial} target="_blank" rel="noopener noreferrer" className="hover:text-[#f5c26b]">Telegram</a>
      </div>
    </nav>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6">
      <h2 className="text-3xl font-bold text-[#f5c26b]">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="text-[#f5c26b]">•</span>
      <span>{children}</span>
    </li>
  );
}

