import Link from "next/link";

const buttonClass =
  "rounded-full border border-[#f5d27a] bg-transparent px-6 py-3 text-sm font-semibold text-[#f5d27a] transition hover:bg-[#f5d27a] hover:text-black";

const buttonClassLarge =
  "inline-block rounded-full border border-[#f5d27a] bg-transparent px-8 py-4 text-sm font-bold text-[#f5d27a] transition hover:bg-[#f5d27a] hover:text-black";

export default function RejuAccessPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-[#f5d27a]/30 bg-gradient-to-br from-[#1a1410] to-[#0b0b0c] p-8 shadow-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#f5d27a]">
            REJU Access Portal
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight text-[#f5d27a] md:text-6xl">
            Buy. Lock. Submit Proof. Get Approved.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            This portal guides participants through the official REJU access
            process. You will buy REJU manually, lock your REJU through
            Streamflow, submit proof, accept the participation agreement, and
            wait for admin approval before receiving access to program
            materials.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#submit-proof" className={buttonClass}>
              Submit Proof
            </a>

            <a href="#process" className={buttonClass}>
              View Process
            </a>
          </div>
        </div>

        <section id="process" className="mt-16">
          <h2 className="text-3xl font-bold text-[#f5d27a]">
            Official REJU Enrollment Flow
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                text: "Use your Solana wallet, such as Phantom or Solflare, to prepare for buying and locking REJU.",
              },
              {
                step: "02",
                title: "Buy REJU",
                text: "Purchase the required REJU amount manually through the official buying method provided by REJU.",
              },
              {
                step: "03",
                title: "Lock in Streamflow",
                text: "Lock the required REJU amount through Streamflow. REJU does not custody your tokens.",
              },
              {
                step: "04",
                title: "Submit Proof",
                text: "Submit your name, email, wallet address, transaction signature, and Streamflow lock link.",
              },
              {
                step: "05",
                title: "Admin Approval",
                text: "The REJU team reviews your submission and confirms that your lock and information are valid.",
              },
              {
                step: "06",
                title: "Receive Access",
                text: "After approval, you receive course, certification, or participation materials as applicable.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="text-sm font-bold text-[#f5d27a]">
                  STEP {item.step}
                </p>

                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>

                <p className="mt-3 leading-7 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-[#f5d27a]/20 bg-[#121212] p-8">
          <h2 className="text-3xl font-bold text-[#f5d27a]">
            Before You Submit
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-zinc-300">
            Make sure you have completed the required steps before submitting
            proof. Submissions that are incomplete, incorrect, or missing a
            valid Streamflow lock link may be delayed.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-black/30 p-5">
              <h3 className="font-semibold text-[#f5d27a]">You will need:</h3>

              <ul className="mt-3 space-y-2 text-zinc-300">
                <li>• Full name</li>
                <li>• Email address</li>
                <li>• Solana wallet address</li>
                <li>• REJU purchase transaction signature</li>
                <li>• Streamflow lock link</li>
                <li>• Selected REJU program</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-black/30 p-5">
              <h3 className="font-semibold text-[#f5d27a]">Important:</h3>

              <ul className="mt-3 space-y-2 text-zinc-300">
                <li>• REJU never asks for your seed phrase.</li>
                <li>• REJU does not custody locked tokens.</li>
                <li>• All wallet approvals happen inside your wallet.</li>
                <li>• Crypto purchases and locks involve risk.</li>
                <li>• Program content is educational only.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="submit-proof" className="mt-16">
          <h2 className="text-3xl font-bold text-[#f5d27a]">
            Submit Proof for Approval
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-zinc-300">
            Complete the official REJU Access Submission form. Your submission
            will be reviewed by the REJU team before access to materials is
            released.
          </p>

          <div className="mt-10 rounded-3xl border border-[#f5d27a]/20 bg-[#121212] p-10 text-center">
            <h3 className="text-2xl font-semibold text-white">
              Official REJU Access Submission
            </h3>

            <p className="mx-auto mt-4 max-w-2xl leading-8 text-zinc-400">
              Submit your wallet address, Streamflow lock proof, transaction
              signature, and selected REJU program through the official REJU
              approval form.
            </p>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfvvLPXPEBuzDkh99vkjCD9iw-t_TOMUY6y_2qYt2CDhk_g0A/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 ${buttonClassLarge}`}
            >
              Open Official Submission Form
            </a>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-[#121212] p-8">
          <h2 className="text-3xl font-bold text-[#f5d27a]">
            What Happens After Approval?
          </h2>

          <p className="mt-4 max-w-4xl leading-8 text-zinc-300">
            After your submission is reviewed and approved, REJU will send or
            release the appropriate materials based on your selected program.
            This may include course access, cohort details, certification
            instructions, replay links, participant documents, or legal
            participation agreements.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-black/30 p-5">
              <h3 className="font-semibold text-[#f5d27a]">Program Access</h3>

              <p className="mt-3 text-zinc-400">
                Educational materials, videos, documents, and participant
                instructions.
              </p>
            </div>

            <div className="rounded-2xl bg-black/30 p-5">
              <h3 className="font-semibold text-[#f5d27a]">
                Live Participation
              </h3>

              <p className="mt-3 text-zinc-400">
                Schedule, Telegram access, live participation, and
                communication details.
              </p>
            </div>

            <div className="rounded-2xl bg-black/30 p-5">
              <h3 className="font-semibold text-[#f5d27a]">
                Certification Materials
              </h3>

              <p className="mt-3 text-zinc-400">
                Certification instructions, agreements, exam access, and
                completion review.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/" className={buttonClass}>
            Back to Home
          </Link>

          <a href="#submit-proof" className={buttonClass}>
            Start Submission
          </a>
        </div>
      </section>
    </main>
  );
}