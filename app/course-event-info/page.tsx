"use client";

import { useState } from "react";
import Nav from "../components/Nav";
import {
  COURSE_EVENT_LIBRARY,
  LIBRARY_CATEGORIES,
  type LibraryCategory,
  type LibraryItem,
} from "../../lib/courseEventLibrary";
import { EVENT_MATERIALS_DRIVE_FOLDER } from "../../lib/rejuMaterials";

const buttonClass =
  "inline-block rounded-full border border-[#f5c26b] px-6 py-2.5 text-center text-sm font-semibold text-[#f5c26b] transition duration-300 hover:bg-[#f5c26b] hover:text-black";

const categories = Object.keys(LIBRARY_CATEGORIES) as LibraryCategory[];

export default function CourseEventInfoPage() {
  const [accessUnlocked, setAccessUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleUnlock(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setStatus("Enter your current cohort participant password.");
      return;
    }
    setStatus("Verifying...");
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "registration", password: password.trim() }),
      });
      const data = await res.json();
      if (data?.ok) {
        setAccessUnlocked(true);
        setStatus("");
      } else {
        setStatus("Incorrect password or access is closed. Use the password provided for your current cohort.");
      }
    } catch {
      setStatus("Verification failed. Please try again.");
    }
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300"
      id="main-content"
    >
      <Nav />

      <section className="px-6 py-12 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#f5c26b]">
          course_event_info
        </p>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold text-[#f5c26b] md:text-5xl">
          REJU Knowledge Library
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
          Past and new research on rejuvenation, health science, and the Bolivia Health Course —
          curated for REJU participants. Access is granted with your current cohort participant password.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        {!accessUnlocked ? (
          <div className="mx-auto max-w-md rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-8">
            <h2 className="text-xl font-bold text-[#f5c26b]">Participant Access</h2>
            <p className="mt-3 text-sm text-gray-400">
              Enter the registration password for your current cohort. This password changes when each new
              event begins.
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Cohort participant password"
              className="mt-5 w-full rounded-2xl border border-[#f5c26b]/35 bg-[#120700] px-5 py-4 text-gray-200 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleUnlock();
                }
              }}
            />
            <button
              type="button"
              onClick={() => handleUnlock()}
              className="mt-4 w-full rounded-2xl bg-[#f5c26b] py-4 font-bold text-black"
            >
              Unlock Knowledge Library
            </button>
            {status && <p className="mt-4 text-center text-sm text-[#f5d27a]">{status}</p>}
          </div>
        ) : (
          <div className="space-y-10">
            <div className="rounded-3xl border border-[#f5c26b]/30 bg-[#120904]/90 p-6 text-center">
              <p className="text-green-300 text-sm">✓ Library access unlocked for this session.</p>
              <a
                href={EVENT_MATERIALS_DRIVE_FOLDER}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonClass} mt-4`}
              >
                Open Event Materials on Google Drive
              </a>
            </div>

            {categories.map((category) => {
              const meta = LIBRARY_CATEGORIES[category];
              const items = COURSE_EVENT_LIBRARY.filter((i) => i.category === category);
              if (!items.length) return null;
              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-[#f5c26b]">{meta.label}</h2>
                  <p className="mt-1 text-sm text-gray-400">{meta.description}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {items.map((item) => (
                      <LibraryCard key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <div className="rounded-2xl border border-[#f5c26b]/20 bg-black/25 p-5">
      <h3 className="font-semibold text-[#f5c26b]">{item.title}</h3>
      <p className="mt-2 text-sm text-gray-400">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.pdfPath && (
          <a href={item.pdfPath} className={buttonClass} download>
            PDF
          </a>
        )}
        {item.mdPath && (
          <a href={item.mdPath} className={buttonClass} download>
            Markdown
          </a>
        )}
        {item.pptxPath && (
          <a href={item.pptxPath} className={buttonClass} download>
            PowerPoint
          </a>
        )}
        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            Google Drive
          </a>
        )}
      </div>
    </div>
  );
}