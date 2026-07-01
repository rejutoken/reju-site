"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "../components/Nav";
import { COHORT_DAILY_SESSIONS } from "../../lib/cohortDailySessions";
import {
  COHORT_DOWNLOADS,
  EVENT_MATERIALS_DRIVE_FOLDER,
  resolveDownloadUrl,
} from "../../lib/rejuMaterials";
import {
  PARTICIPANT_FLOW_CONFIG,
  PARTICIPANT_ID_STORAGE_KEY,
  parseParticipantFlow,
} from "../../lib/participantFlows";

const buttonClass =
  "inline-block rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

function EventMaterialsContent() {
  const searchParams = useSearchParams();
  const flow = parseParticipantFlow(searchParams.get("flow"));
  const flowConfig = PARTICIPANT_FLOW_CONFIG[flow];

  const [participantId, setParticipantId] = useState("");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  useEffect(() => {
    const fromUrl = searchParams.get("pid")?.trim() || "";
    const fromStorage = sessionStorage.getItem(PARTICIPANT_ID_STORAGE_KEY)?.trim() || "";
    const resolved = fromUrl || fromStorage;
    if (resolved) {
      setParticipantId(resolved);
      sessionStorage.setItem(PARTICIPANT_ID_STORAGE_KEY, resolved);
    }
  }, [searchParams]);

  const authoringHref = participantId
    ? `/daily-transformation-log?pid=${encodeURIComponent(participantId)}&day=1`
    : "/daily-transformation-log";

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300"
      id="main-content"
    >
      <Nav />

      <section className="px-6 py-12 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          {flowConfig.label}
        </p>
        <h1 className="mx-auto max-w-5xl text-4xl font-bold leading-tight text-[#f5c26b] md:text-5xl">
          Your Event Materials &amp; Starting Instructions
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed">
          Registration complete. Save your Participant ID — you will use it for daily journaling,
          book generation, and verification across the REJU ecosystem.
        </p>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-6 pb-20">
        <div className="rounded-3xl border border-[#f5c26b]/40 bg-[#120904]/90 p-8 text-center shadow-[0_0_40px_rgba(245,194,107,0.14)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f5c26b]">
            Your Participant ID
          </p>
          {participantId ? (
            <>
              <p className="mt-4 font-mono text-2xl font-bold text-white md:text-3xl">
                {participantId}
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Stored in your browser for this session. Write it down — you need it for every daily entry.
              </p>
            </>
          ) : (
            <p className="mt-4 text-[#f5d27a]">
              No Participant ID found. Please complete{" "}
              <a href="/participant-registration?flow=event" className="underline hover:text-white">
                registration
              </a>{" "}
              first.
            </p>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="Set Your Benchmark (Day 1)">
            <p>
              Before you change anything, document where you are right now. Take your baseline photos,
              note your energy, mood, sleep, digestion, skin clarity, and how your body feels in daily life.
            </p>
            <p className="mt-3">
              This is not about perfection or the scale. It is your honest starting chapter — the reference
              point you will compare against at the end of the 6-week event.
            </p>
          </Card>

          <Card title="What to Expect Emotionally">
            <p>
              The REJU Rejuvenation Event™ is a structured metabolic and lifestyle protocol. Many participants
              experience a rollercoaster of emotions — frustration, breakthroughs, doubt, clarity, fatigue,
              and renewed energy.
            </p>
            <p className="mt-3">
              This is normal. Transformation is not linear. Trust the structure, record what you notice,
              and let your daily log become evidence of progress even on difficult days.
            </p>
          </Card>
        </div>

        <Card title="Understanding Your Body's Language">
          <ul className="space-y-3">
            <Bullet>
              <strong>Energy shifts</strong> — notice when clarity improves or crashes; timing often relates to nourishment and rest.
            </Bullet>
            <Bullet>
              <strong>Digestion &amp; bloating</strong> — your body signals adaptation; record patterns honestly in your daily log.
            </Bullet>
            <Bullet>
              <strong>Skin &amp; inflammation</strong> — visible changes often lag behind internal shifts; daily photos reveal what memory forgets.
            </Bullet>
            <Bullet>
              <strong>Mood &amp; mental clarity</strong> — ketosis and autophagy-supportive states can sharpen thinking; note the contrast.
            </Bullet>
            <Bullet>
              <strong>Cravings &amp; compliance</strong> — non-compliance is data, not failure. Record why, adjust, and continue.
            </Bullet>
          </ul>
        </Card>

        <Card title="The REJU Protocol™ — How to Adhere">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-semibold text-[#f5c26b]">Core principles</p>
              <ul className="mt-3 space-y-2">
                <Bullet>Follow the program structure as closely as possible.</Bullet>
                <Bullet>Use daily journaling honestly — no performance, just truth.</Bullet>
                <Bullet>Record one Today&apos;s Victory every day.</Bullet>
                <Bullet>Avoid scale obsession; focus on visible and lived transformation.</Bullet>
                <Bullet>Respect the privacy and dignity of all participants.</Bullet>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#f5c26b]">6-week journey overview</p>
              <ul className="mt-3 space-y-2 text-sm">
                <Bullet><strong>Week 1</strong> — Establish your starting point through photos, journaling, and reflection.</Bullet>
                <Bullet><strong>Week 2</strong> — Metabolic transition via the REJU Protocol™ and Kat&apos;s JOL™.</Bullet>
                <Bullet><strong>Week 3</strong> — Enter a rejuvenation state; energy and clarity often shift noticeably.</Bullet>
                <Bullet><strong>Week 4</strong> — Reinforce cellular rejuvenation and deeper physical transformation.</Bullet>
                <Bullet><strong>Week 5</strong> — Build longevity habits for life beyond the event.</Bullet>
                <Bullet><strong>Week 6</strong> — Reclaim control with documented transformation history.</Bullet>
              </ul>
            </div>
          </div>
        </Card>

        <Card title="How to Operate the REJU System">
          <ol className="list-decimal space-y-4 pl-5">
            <li>
              <strong className="text-[#f5c26b]">Use your Participant ID on every entry.</strong>{" "}
              It links your daily logs, photos, and book chapters to your official registry record in Google Sheets.
            </li>
            <li>
              <strong className="text-[#f5c26b]">Author your daily transformation log.</strong>{" "}
              Each submission becomes a chapter in your Personalized REJU Transformation Book™.
            </li>
            <li>
              <strong className="text-[#f5c26b]">Upload daily photos consistently.</strong>{" "}
              Same angles, same lighting when possible — visual history is one of your most powerful tools.
            </li>
            <li>
              <strong className="text-[#f5c26b]">Unlock book authoring with your event password.</strong>{" "}
              The same cohort password family protects registration and daily journaling access.
            </li>
            <li>
              <strong className="text-[#f5c26b]">Join REJU Official on Telegram.</strong>{" "}
              Live sessions, accountability, and community support happen there.
            </li>
          </ol>
        </Card>

        <Card title="Building an Amazing Transformation Book">
          <p>
            You Are Authoring your Personalized REJU Transformation Book. REJU is editorial — your daily
            reflections, photos, scores, milestones, and Today&apos;s Victory entries are the chapters you write.
          </p>
          <ul className="mt-4 space-y-3">
            <Bullet>Be consistent: one entry per program day, even when motivation is low.</Bullet>
            <Bullet>Write in your own voice — authenticity reads better than polish.</Bullet>
            <Bullet>Include photos on as many days as possible; they anchor the narrative visually.</Bullet>
            <Bullet>Rate skin clarity, energy, mood, and compliance honestly — trends matter more than single scores.</Bullet>
            <Bullet>End each day with Today&apos;s Victory — one thing that went right, however small.</Bullet>
            <Bullet>At Day 42, contact REJU to generate your compiled final book.</Bullet>
          </ul>
        </Card>

        <Card title="Day 1 Starter Plan">
          <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/25 p-5">
            <p className="font-semibold text-[#f5c26b]">Today — Program Day 1</p>
            <ul className="mt-3 space-y-2">
              <Bullet>Read Kat&apos;s Legacy foundation material (included with your enrollment).</Bullet>
              <Bullet>Take baseline photos (front, side, and any areas you are tracking).</Bullet>
              <Bullet>Complete your first daily transformation log entry with Participant ID.</Bullet>
              <Bullet>Record physical condition, energy, mood, and skin observations.</Bullet>
              <Bullet>Set your benchmark scores and write your first Today&apos;s Victory.</Bullet>
              <Bullet>Join the REJU Telegram community for session schedules and support.</Bullet>
            </ul>
            <p className="mt-4 text-sm text-gray-400">
              Your cohort facilitator will lead 20 daily sessions (10 minutes each) — see the full schedule below.
            </p>
          </div>
        </Card>

        <Card title="20-Day Cohort Meeting Instructions">
          <p className="mb-2 text-gray-300">
            One live session per day, maximum 10 minutes. Content is translated from the Bolivia Health Course
            (*Curso de Salud*) and sequenced to match <em>Kat&apos;s Legacy</em>. Download the{" "}
            <a href="/materials/REJU-20-Day-Cohort-Instructions.pptx" className="text-[#f5c26b] underline hover:text-white">
              PowerPoint deck
            </a>{" "}
            for facilitator-led cohort meetings. Continue daily journaling through Day 42 for a fuller Transformation Book.
            Access the{" "}
            <a href="/course-event-info" className="text-[#f5c26b] underline hover:text-white">
              REJU Knowledge Library
            </a>{" "}
            with your cohort participant password.
          </p>
          <p className="mb-6 text-sm text-gray-400">
            Expand each day for teaching points and participant actions. Download the complete guide below.
          </p>
          <div className="space-y-2">
            {COHORT_DAILY_SESSIONS.map((session) => {
              const isOpen = expandedDay === session.day;
              return (
                <div
                  key={session.day}
                  className="rounded-2xl border border-[#f5c26b]/15 bg-black/25 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedDay(isOpen ? null : session.day)}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left hover:bg-black/20"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#f5c26b]">
                        Day {session.day} · {session.durationMinutes} min
                      </span>
                      <p className="mt-1 font-semibold text-gray-100">{session.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {session.bookChapter} · {session.courseSource.split(";")[0]}
                      </p>
                    </div>
                    <span className="shrink-0 text-[#f5c26b] text-xl leading-none">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#f5c26b]/10 px-5 py-4 text-sm space-y-4">
                      <p className="text-gray-300">{session.meetingFocus}</p>
                      <div>
                        <p className="font-semibold text-[#f5c26b] mb-2">Teaching points</p>
                        <ul className="space-y-2">
                          {session.teachingPoints.map((point) => (
                            <li key={point.slice(0, 40)} className="flex gap-2">
                              <span className="text-[#f5c26b]">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-[#f5c26b] mb-2">Your actions today</p>
                        <ul className="space-y-2">
                          {session.participantActions.map((action) => (
                            <li key={action.slice(0, 40)} className="flex gap-2">
                              <span className="text-[#f5c26b]">→</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {session.facilitatorNote && (
                        <p className="text-xs italic text-gray-500">{session.facilitatorNote}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Download Instructional Materials">
          <p className="mb-4">
            Download and save these documents before you begin. Source materials from the Bolivia course live in
            the REJU Google Drive folder — upload additional cohort files there as needed.
          </p>
          <a
            href={EVENT_MATERIALS_DRIVE_FOLDER}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonClass} mb-6 text-sm`}
          >
            Open Cohort Materials Folder (Google Drive)
          </a>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COHORT_DOWNLOADS.map((item) => (
              <DownloadCard
                key={item.id}
                title={item.title}
                description={item.description}
                href={resolveDownloadUrl(item)}
                external={!item.localPath}
              />
            ))}
          </div>
        </Card>

        <Card title="Legal Disclaimer">
          <p className="text-sm leading-relaxed text-gray-400">
            The REJU Rejuvenation Event™, REJU Protocol™, and related materials are for educational and
            participatory wellness purposes only. They do not constitute medical advice, diagnosis, or treatment.
            Consult a qualified healthcare professional before beginning any fasting, ketogenic, detoxification,
            or metabolic protocol — especially if you have pre-existing conditions, take medications, or are pregnant or nursing.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            REJU does not guarantee specific health outcomes. Individual results vary. Participation is voluntary.
            By continuing, you accept responsibility for your own health decisions and agree to the participant terms
            provided with your enrollment. REJU Token and program access do not replace professional medical care.
          </p>
        </Card>

        <div className="rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#f5c26b] md:text-3xl">Ready for Day 1?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed">
            Start authoring your first daily entry. Your Participant ID will be carried into the log
            so every chapter stays linked to your registry record.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href={authoringHref} className={buttonClass}>
              Start Day 1 — Author Your First Entry
            </a>
            <a
              href="https://t.me/rejuofficial"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass}
            >
              Join REJU Official
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#120904]/90 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-[#f5c26b] md:text-3xl">{title}</h2>
      <div className="mt-4 leading-relaxed">{children}</div>
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

function DownloadCard({
  title,
  description,
  href,
  external = false,
}: {
  title: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/25 p-5">
      <h3 className="font-semibold text-[#f5c26b]">{title}</h3>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
      <a
        href={href}
        className={`${buttonClass} mt-4 text-sm`}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
      >
        {external ? "Open in Drive" : "Download"}
      </a>
    </div>
  );
}

export default function RejuEventMaterialsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0b0b0c] text-gray-300" id="main-content">
          <Nav />
          <p className="py-20 text-center text-[#f5c26b]">Loading materials...</p>
        </main>
      }
    >
      <EventMaterialsContent />
    </Suspense>
  );
}