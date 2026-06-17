const links = {
  home: "/",
  onboarding: "/onboarding",
  participantRegistration: "/participant-registration",
  telegramOfficial: "https://t.me/rejuofficial",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

import Nav from "../components/Nav";

export default function RejuEventWelcome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300" id="main-content">
      <Nav />

      <section className="px-6 py-16 text-center">
        <p className="mb-4 text-lg font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          REJU Rejuvenation Event™
        </p>

        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-tight text-[#f5c26b] md:text-6xl">
          Welcome to Your Rejuvenation Program
        </h1>

        <p className="mx-auto mt-6 max-w-4xl text-lg leading-relaxed text-gray-300">
          This is a guided 6-week transformation experience built around structure, accountability, daily awareness, and visible progress from the inside out.
        </p>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 shadow-[0_0_40px_rgba(245,194,107,0.14)] backdrop-blur-md md:p-10">
          
<div className="grid gap-6 md:grid-cols-2">
  <Card title="What to Expect">
    <ul className="space-y-3 text-gray-300">
      <Bullet>A structured 6-week rejuvenation program.</Bullet>
      <Bullet>Three live sessions per week.</Bullet>
      <Bullet>Daily reflection, accountability, and progress tracking.</Bullet>
      <Bullet>A supportive participant environment.</Bullet>
      <Bullet>A focus on transformation, not perfection.</Bullet>
    </ul>
  </Card>

  <Card title="Rules of the Program">
    <ul className="space-y-3 text-gray-300">
      <Bullet>Follow the program structure as closely as possible.</Bullet>
      <Bullet>Respect the privacy and dignity of all participants.</Bullet>
      <Bullet>Use daily journaling honestly.</Bullet>
      <Bullet>Avoid scale obsession; focus on visible and lived transformation.</Bullet>
      <Bullet>Record one Today&apos;s Victory every day.</Bullet>
    </ul>
  </Card>
</div>

<div className="mt-8 rounded-3xl border border-[#f5c26b]/20 bg-black/25 p-6">
  <h2 className="text-3xl font-bold text-[#f5c26b]">Your Personal REJU Transformation Book™</h2>

  <p className="mt-4 leading-relaxed text-gray-300">
    During the program, your daily reflections, photos, scores, milestones, and Today&apos;s Victory entries will become the source material for your personal transformation book.
  </p>

  <p className="mt-4 leading-relaxed text-gray-300">
    This is not just a journal. It is your story of transformation, written by you throughout the program.
  </p>
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

