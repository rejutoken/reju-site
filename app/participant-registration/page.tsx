"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Nav from "../components/Nav";
import {
  PARTICIPANT_ID_STORAGE_KEY,
  materialsUrl,
  parseParticipantFlow,
} from "../../lib/participantFlows";

function ParticipantRegistrationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const flow = parseParticipantFlow(searchParams.get("flow"));

  const [status, setStatus] = useState("");
  const [accessUnlocked, setAccessUnlocked] = useState(false);
  const [accessPassword, setAccessPassword] = useState("");
  const [unlockStatus, setUnlockStatus] = useState("");
  const [unlockedPw, setUnlockedPw] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleUnlock(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!accessPassword.trim()) {
      setUnlockStatus("Please enter the access password.");
      return;
    }
    setUnlockStatus("Verifying...");
    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "registration", password: accessPassword.trim() }),
      });
      const data = await res.json();
      if (data?.ok) {
        setAccessUnlocked(true);
        setUnlockedPw(accessPassword.trim());
        setUnlockStatus("");
      } else {
        setUnlockStatus("Incorrect password or access is currently closed. Contact REJU for the current event password.");
      }
    } catch {
      setUnlockStatus("Verification failed. Please try again.");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setStatus("Submitting registration...");

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (unlockedPw) {
      formData.set("accessPassword", unlockedPw);
    }

    try {
      const res = await fetch("/api/register-participant", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        setStatus(data?.error || "Registration failed.");
        setSubmitting(false);
        return;
      }

      const participantId = data.participantId as string;
      sessionStorage.setItem(PARTICIPANT_ID_STORAGE_KEY, participantId);
      setStatus("Registration received. Redirecting to your event materials...");

      router.push(materialsUrl(flow, participantId));
    } catch (error) {
      console.error("CLIENT REGISTRATION ERROR:", error);
      setStatus("Registration failed. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_center,_#2b1a12_0%,_#0b0b0c_70%)] text-gray-300"
      id="main-content"
    >
      <Nav />

      <section className="flex justify-center px-6 py-10">
        <div className="w-full max-w-[760px] rounded-[20px] border border-[#6f5320] bg-[#120d08] p-7 shadow-[0_0_30px_rgba(245,194,107,0.08)]">
          <div className="mb-8 text-center">
            <img src="/logo.png" alt="REJU" className="mx-auto mb-4 w-[180px] max-w-full" />

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#f5d27a]">
              REJU Participant Registry
            </p>

            <h1 className="mb-3 text-4xl font-bold text-[#f5d27a]">Participant Registration</h1>

            <p className="text-lg leading-relaxed text-gray-300">
              Please complete this registration once. This creates your REJU participant record
              for program access, verification, and transformation tracking throughout the site.
            </p>
            <p className="mt-2 text-[15px] text-[#f5d27a]">
              Access is password-protected. Only paid participants receive the current registration password.
            </p>
          </div>

          {!accessUnlocked ? (
            <div className="mb-3">
              <label className="mb-1.5 ml-1 block text-sm font-semibold text-[#f5d27a]">
                Event / Cohort Access Password
              </label>
              <input
                type="password"
                value={accessPassword}
                onChange={(e) => setAccessPassword(e.target.value)}
                placeholder="Enter registration password"
                className={inputClass}
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
                className="mt-2 w-full rounded-[14px] border border-[#f5d27a] bg-[#3a2a18] px-[18px] py-[18px] text-center text-lg font-bold text-[#f5d27a]"
              >
                Unlock Registration Form
              </button>
              {unlockStatus && (
                <p className="mt-3 text-center text-[15px] text-[#f5d27a]">{unlockStatus}</p>
              )}
              <p className="mt-2.5 text-center text-xs text-gray-400">
                Password changes after each event. Obtain from REJU team after payment confirmation.
              </p>
            </div>
          ) : (
            <div className="mb-2.5 text-center text-[13px] text-green-300">
              ✓ Access unlocked for this session. You may submit registration.
            </div>
          )}

          {accessUnlocked && (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                <Field label="First Name" id="firstName" name="firstName" required />
                <Field label="Last Name" id="lastName" name="lastName" required />
              </div>

              <Field label="Email" id="email" name="email" type="email" required />
              <Field label="Phone (optional)" id="phone" name="phone" />
              <Field label="Telegram username (optional)" id="telegram" name="telegram" />
              <Field label="Address 1 (optional)" id="address1" name="address1" />
              <Field label="Address 2 (optional)" id="address2" name="address2" />

              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                <Field label="City" id="city" name="city" required />
                <Field label="State / Province" id="stateProvince" name="stateProvince" required />
              </div>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                <Field label="Zip / Postal Code (optional)" id="zipPostalCode" name="zipPostalCode" />
                <Field label="Country" id="country" name="country" required />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-[14px] border-none bg-[#f5d27a] px-[18px] py-[18px] text-center text-lg font-bold text-black disabled:opacity-60"
                aria-describedby={status ? "form-status" : undefined}
              >
                {submitting ? "Submitting..." : "Submit Registration"}
              </button>
            </form>
          )}

          {status && (
            <p
              id="form-status"
              role="status"
              aria-live="polite"
              className={`mt-5 text-center text-lg font-semibold ${
                status.toLowerCase().includes("received") ? "text-green-300" : "text-[#f5d27a]"
              }`}
            >
              {status}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  id,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 ml-1 block text-sm font-semibold text-[#f5d27a]">
        {label} {required && <span className="text-[#f5d27a]">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={label}
        required={required}
        aria-required={required}
        className={inputClass}
      />
    </div>
  );
}

const inputClass =
  "mb-[18px] w-full rounded-[18px] border border-[rgba(245,194,107,0.35)] bg-[#120700] px-5 py-4 text-base text-gray-300 shadow-[0_0_15px_rgba(245,194,107,0.08)] outline-none box-border";

export default function ParticipantRegistrationPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050505] text-gray-300" id="main-content">
          <Nav />
          <p className="py-20 text-center text-[#f5d27a]">Loading registration...</p>
        </main>
      }
    >
      <ParticipantRegistrationForm />
    </Suspense>
  );
}