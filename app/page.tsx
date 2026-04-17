export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b0b0c] to-[#1a1410] px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/logo.png"
          alt="REJU Logo"
          className="w-48 md:w-64"
	  style={{ borderRadius: "8px" }}
        />

<h1 className="text-3xl font-semibold tracking-wide text-[#f5d27a] md:text-5xl">
  REJU is coming
</h1>

<p className="max-w-xl text-lg text-[#e6c36a] md:text-xl">
  A token-driven ecosystem for cellular rejuvenation and health optimization.
</p>

<p className="max-w-lg text-sm text-gray-400 md:text-base">
  Built around science-based protocols, education, and real-world application.
</p>

<p className="mt-4 text-sm text-gray-500">
  Early access phase. Full protocol and platform rollout in progress.
</p>
<div className="mt-6 flex gap-4">
  <a
    href="https://x.com/rejutoken"
    target="_blank"
	rel="noopener noreferrer"
    className="rounded-lg bg-[#f5d27a] px-6 py-2 text-black font-semibold hover:opacity-90"
  >
    Follow on X
  </a>

  <a
    href="https://t.me/rejutokenofficial"
    target="_blank"
	rel="noopener noreferrer"
    className="rounded-lg border border-[#f5d27a] px-6 py-2 text-[#f5d27a] hover:bg-[#f5d27a] hover:text-black"
  >
    Join Telegram
  </a>
</div>
      </div>
    </main>
  );
}