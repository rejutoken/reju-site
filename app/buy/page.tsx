"use client";

import { useState } from "react";
import Nav from "../components/Nav";

const links = {
  home: "/",
  onboarding: "/onboarding",
  buy: "/buy",
  program: "/program",
  rejunomics: "/rejunomics",
  blog: "/blog",
  participantRegistration: "/participant-registration",
  telegramOfficial: "https://t.me/rejuofficial",
  streamflowLock: "https://app.streamflow.finance/token-lock",
};

const buttonClass =
  "rounded-full border border-[#f5c26b] px-6 py-1 text-center font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";


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
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] px-6 text-white" id="main-content">
      <Nav />
      <div className="mx-auto max-w-7xl">
        <section className="text-center">
          <img src="/logo.png" alt="REJU Logo" className="mx-auto mb-6 w-28" />

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#f5c26b]">
            Buy REJU
          </p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#f5c26b]">
            Choose Your Exchange and Lock Your REJU
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed  text-left text-gray-300">
            Find REJU inyour prefered wallets, and market tools below. Lock you rreju by following the links provided to Streamflow our sinergy partner to help stablish execute the rejunomics methodology and keep REJU neutral from holding investors funds.
          </p>
        </section>

         <section className="mt-14 grid gap-6 md:grid-cols-3">


          <InfoCard
            title="Buy With Dollars?"
            items={[
              "There are some exchanges that accept Dollars",
              "Press the button buy with dollars bellow",
            ]}
          />

          <InfoCard
            title="Important"
            items={[
              "Buying REJU is separate from joining the program.",
              "Program access requires locking REJU via Streamflow.",
            ]}
          />

          <InfoCard
            title="Your Path to the Book"
            items={[
              "Lock REJU with Streamflow (neutral holder).",
              "Complete Participant Registration (get your ID).",
              "Join the Event and Author your Personalized REJU Transformation Book using your ID.",
            ]}
          />
          <div className="mt-4 text-center">
            <a href="/daily-transformation-log" className={buttonClass}>
              Go to Daily Journal
            </a>
          </div>
        </section>
		
		
		
		
		
		
		<section className="mt-14 rounded-xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#f5c26b]">
                REJU Exchange Directory
              </h2>
              <p className="mt-3 text-md text-gray-300">
                Filter by exchange type, wallet type, network, or fiat support.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
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
              className="rounded-xl border border-[#f5c26b] bg-black/30 p-3 text-center text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black"
            >
              <h3 className="text-xl font-bold">Buy REJU With Dollars</h3>
              <p className="mt-3 text-sm">
                Use supported wallets or exchanges to buy crypto with dollars, then swap into REJU.
              </p>
            </button>

            <a
              href={links.streamflowLock}
              className="rounded-xl border border-[#f5c26b] bg-black/30 p-3 text-center text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black"
            >
              <h3 className="text-xl font-bold">Lock REJU</h3>
              <p className="mt-3 text-sm">
                Lock REJU through Streamflow for program access, verification, or future ecosystem participation.
              </p>
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 md:grid-cols-2">
            {filtered.map((exchange) => (
              <ExchangeCard key={exchange.name} exchange={exchange} />
            ))}
          </div>
        </section>

       

        <section className="mt-6 text-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a href={links.onboarding} className={buttonClass}>
              Go to Onboarding
            </a>

            <a href={links.streamflowLock} className={buttonClass}>
              Lock Your REJU
            </a>
	
			  <a href={links.participantRegistration} className={buttonClass}>
              Complete Participant Registration
            </a>
            <p className="text-center text-[10px] text-gray-500 -mt-1">Password required (provided after payment)</p>
						
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
    <div className="rounded-xl border border-[#f5c26b]/20 bg-black/20 p-7 transition hover:border-[#f5c26b]/60">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-[#f5c26b]">{exchange.name}</h3>
        <span className="rounded-full border border-[#f5c26b]/30 px-3 py-1 text-sm text-gray-300">
          {exchange.status}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-md text-gray-300">
        <Row label="Type" value={exchange.type} />
        <Row label="Network" value={exchange.network} />
        <Row label="Pay Fiat or Dollars" value={exchange.fiat} />
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
    <div className="rounded-xl border border-[#f5c26b]/20 bg-[#160b05]/80 p-8 shadow-[0_0_25px_rgba(245,194,107,0.08)] backdrop-blur-md">
      <h2 className="text-xl font-bold text-[#f5c26b]">{title}</h2>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-[#f5c26b]/20 bg-black/20 p-2 text-md text-gray-300">
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
}