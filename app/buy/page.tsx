"use client";

import { useState } from "react";

const links = {
  home: "/",
  onboarding: "/onboarding",
  streamflowLock: "#",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-8 py-3 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

const exchanges = [
  { name: "Jupiter", type: "DEX Aggregator", network: "Solana", fiat: "No", status: "Primary Solana Route", link: "https://jup.ag" },
  { name: "Raydium", type: "DEX", network: "Solana", fiat: "No", status: "Primary DEX", link: "https://raydium.io/swap/" },
  { name: "Phantom", type: "Wallet", network: "Solana", fiat: "Yes", status: "Fiat Friendly", link: "https://phantom.app" },
  { name: "Birdeye", type: "Market Tracker", network: "Solana", fiat: "No", status: "Tracker", link: "https://birdeye.so" },
  { name: "DexScreener", type: "Market Tracker", network: "Multi-chain", fiat: "No", status: "Tracker", link: "https://dexscreener.com" },
  { name: "DexTools", type: "Market Tracker", network: "Multi-chain", fiat: "No", status: "Tracker", link: "https://www.dextools.io" },
  { name: "Uniswap", type: "DEX", network: "Ethereum / Base", fiat: "No", status: "Future EVM Route", link: "https://app.uniswap.org" },
  { name: "Coinbase Wallet", type: "Wallet", network: "Multi-chain", fiat: "Yes", status: "Accessible Wallet", link: "https://www.coinbase.com/wallet" },
  { name: "Trust Wallet", type: "Wallet", network: "Multi-chain", fiat: "Yes", status: "Accessible Wallet", link: "https://trustwallet.com" },
  { name: "MetaMask", type: "Wallet", network: "EVM", fiat: "Yes", status: "Future EVM Route", link: "https://metamask.io" },
];

export default function BuyPage() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? exchanges
      : exchanges.filter(
          (e) => e.type.includes(filter) || e.network.includes(filter) || e.fiat === filter
        );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="text-center">
          <img src="/logo.png" alt="REJU Logo" className="mx-auto mb-6 w-28" />

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
            Buy REJU
          </p>

          <h1 className="text-5xl font-bold text-[#f5c26b] md:text-7xl">
            Choose Your Exchange
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-gray-300">
            Find REJU through supported exchanges, wallets, and market tools. Listings will be updated as REJU expands.
          </p>
        </section>

        <section className="mt-14 rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-[#f5c26b]">
                REJU Exchange Directory
              </h2>
              <p className="mt-3 text-lg text-gray-300">
                Filter by exchange type, wallet type, network, or fiat support.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {["All", "DEX", "Wallet", "Market Tracker", "Solana", "Multi-chain"].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilter(option)}
                  className={buttonClass}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setFilter("Yes")}
              className="rounded-3xl border border-[#f5c26b] bg-black/30 p-6 text-center text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black"
            >
              <h3 className="text-2xl font-bold">Buy REJU With Dollars</h3>
              <p className="mt-3 text-sm">
                Use supported wallets or exchanges to buy crypto with dollars, then swap into REJU.
              </p>
            </button>

            <a
              href={links.streamflowLock}
              className="rounded-3xl border border-[#f5c26b] bg-black/30 p-6 text-center text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black"
            >
              <h3 className="text-2xl font-bold">Lock REJU</h3>
              <p className="mt-3 text-sm">
                Lock REJU through Streamflow for program access, verification, or future ecosystem participation.
              </p>
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((exchange) => (
              <ExchangeCard key={exchange.name} exchange={exchange} />
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <InfoCard
            title="Before You Buy"
            items={[
              "Confirm the official REJU contract address before trading.",
              "Check network compatibility before sending funds.",
              "Use only official links published by REJU.",
              "Be cautious of fake tokens and impersonator contracts.",
            ]}
          />

          <InfoCard
            title="Can I Buy With Dollars?"
            items={[
              "Yes, depending on the wallet or exchange you use.",
              "Some wallets allow debit card, credit card, bank transfer, Apple Pay, or Google Pay purchases.",
              "Usually, you buy SOL or another supported asset first, then swap it for REJU.",
              "Availability depends on your country, exchange, wallet, and network.",
            ]}
          />

          <InfoCard
            title="Important"
            items={[
              "Buying REJU is separate from joining the program.",
              "Program access requires onboarding or a qualifying REJU lock.",
              "Solana routes are the primary launch focus.",
              "EVM routes like Uniswap may apply only if REJU expands cross-chain.",
            ]}
          />

          <InfoCard
            title="Participation & Growth"
            items={[
              "REJU is designed around recurring participation, not passive speculation.",
              "Cohorts, certifications, and long-term engagement expand ecosystem demand.",
              "CRP participants help grow the REJU network through education and community support.",
              "The REJU Longevity Group™ supports long-term ecosystem value.",
            ]}
          />
        </section>

        <section className="mt-16 text-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href={links.onboarding} className={buttonClass}>
              Go to Onboarding
            </a>

            <a href={links.home} className={buttonClass}>
              Back to Home
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function ExchangeCard({
  exchange,
}: {
  exchange: {
    name: string;
    type: string;
    network: string;
    fiat: string;
    status: string;
    link: string;
  };
}) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-black/20 p-7 transition hover:border-[#f5c26b]/60">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-3xl font-bold text-[#f5c26b]">{exchange.name}</h3>
        <span className="rounded-full border border-[#f5c26b]/30 px-3 py-1 text-sm text-gray-300">
          {exchange.status}
        </span>
      </div>

      <div className="mt-6 space-y-4 text-base text-gray-300">
        <Row label="Type" value={exchange.type} />
        <Row label="Network" value={exchange.network} />
        <Row label="Fiat" value={exchange.fiat} />
      </div>

      <a
        href={exchange.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-7 block ${buttonClass}`}
      >
        Open
      </a>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
      <span className="text-gray-400">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
      <h2 className="text-3xl font-bold text-[#f5c26b]">{title}</h2>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-[#f5c26b]/20 bg-black/20 p-4 text-lg text-gray-300">
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
}