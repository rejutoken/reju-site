"use client";

import { useState } from "react";

interface AdminConfig {
  registrationPassword: string;
  bookPassword: string;
  adminPassword: string;
  currentCohort: string;
  active: boolean;
}

export default function AdminDashboard() {
  const [adminPw, setAdminPw] = useState("");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [unlockError, setUnlockError] = useState("");

  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const [newRegPass, setNewRegPass] = useState("");
  const [newBookPass, setNewBookPass] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [newCohort, setNewCohort] = useState("");
  const [newActive, setNewActive] = useState(true);

  const [status, setStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  async function unlockAdmin() {
    if (!adminPw.trim()) {
      setUnlockError("Enter the admin password.");
      return;
    }
    setUnlockError("");
    setStatus("Verifying admin access...");

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "admin", password: adminPw.trim() }),
      });
      const data = await res.json();

      if (data?.ok) {
        setAdminUnlocked(true);
        setStatus("");
        await loadConfig(adminPw.trim());
      } else {
        setUnlockError("Invalid admin password.");
        setStatus("");
      }
    } catch (e) {
      setUnlockError("Could not verify. Check connection.");
      setStatus("");
    }
  }

  async function loadConfig(pw?: string) {
    setLoadingConfig(true);
    try {
      const res = await fetch("/api/admin/config", { method: "GET" });
      const data = await res.json();
      if (data.success && data.config) {
        const c = data.config;
        setConfig({
          registrationPassword: c.registrationPassword,
          bookPassword: c.bookPassword,
          adminPassword: c.adminPassword,
          currentCohort: c.currentCohort,
          active: c.active,
        });
        setNewCohort(c.currentCohort || "");
        setNewActive(c.active);
      }
    } catch (e) {
      setStatus("Failed to load current settings.");
    } finally {
      setLoadingConfig(false);
    }
  }

  async function performUpdate(updates: any, successMessage?: string) {
    if (!adminPw.trim()) return;
    setActionLoading(true);
    setStatus("");

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword: adminPw.trim(),
          ...updates,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus(successMessage || "Settings updated successfully.");
        await loadConfig();
        // clear change fields (only relevant for password updates)
        setNewRegPass("");
        setNewBookPass("");
      } else {
        setStatus(data.error || "Update failed.");
        await loadConfig(); // refresh to correct state
      }
    } catch (e) {
      setStatus("Update request failed.");
      await loadConfig(); // refresh to correct state
    } finally {
      setActionLoading(false);
    }
  }

  async function updateRegistrationPassword() {
    if (!newRegPass.trim()) {
      setStatus("Enter a new registration password.");
      return;
    }
    await performUpdate({ registrationPassword: newRegPass.trim() }, "Registration password updated successfully.");
  }

  async function updateBookPassword() {
    if (!newBookPass.trim()) {
      setStatus("Enter a new book authoring password.");
      return;
    }
    await performUpdate({ bookPassword: newBookPass.trim() }, "Book authoring password updated successfully.");
  }

  async function updateAdminPassword() {
    if (!newAdminPass.trim()) {
      setStatus("Enter a new admin password.");
      return;
    }
    await performUpdate({ adminPassword: newAdminPass.trim() }, "Admin password updated successfully.");
  }

  async function updateCohort() {
    await performUpdate({ currentCohort: newCohort.trim() }, "Current cohort updated.");
  }

  async function toggleActive() {
    const current = config?.active ?? newActive;
    const target = !current;

    // Optimistic update for immediate visual feedback
    if (config) {
      setConfig({ ...config, active: target });
    }
    setNewActive(target);

    const message = target
      ? "Global access ENABLED. Registration and book authoring are now open."
      : "Global access DISABLED. Participant registration and daily journal submissions are now locked for everyone.";

    await performUpdate({ active: target }, message);
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Banner */}
        <div className="mb-8 p-5 border border-[#f5c26b]/40 bg-[#120904] rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#f5c26b] font-bold text-sm tracking-[3px] uppercase">REJU PERSONNEL ONLY</p>
              <p className="text-xs text-gray-400 mt-0.5">Hidden admin dashboard. Do not link publicly.</p>
            </div>
            <a
              href="/admin/generate-book"
              className="text-sm border border-[#f5c26b]/60 px-4 py-2 rounded hover:bg-[#f5c26b] hover:text-black transition"
            >
              Generate Books →
            </a>
            <a
              href="/admin/x-post"
              className="text-sm border border-[#f5c26b]/60 px-4 py-2 rounded hover:bg-[#f5c26b] hover:text-black transition"
            >
              X Post Studio →
            </a>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#f5c26b] mb-2">REJU Admin — Access Control</h1>
        <p className="text-gray-400 mb-8">
          Change event passwords, manage current cohort, and enable/disable participant registration &amp; book authoring.
          Passwords are stored in your Google Drive config file.
        </p>

        {!adminUnlocked ? (
          <div className="max-w-md bg-[#120904] border border-[#f5c26b]/30 p-8 rounded-3xl">
            <h2 className="font-semibold mb-3 text-lg">Unlock Admin Controls</h2>
            <p className="text-sm text-gray-400 mb-4">Enter the admin management password.</p>
            <p className="text-[11px] text-amber-400 mb-2">First time? Default admin password is <span className="font-mono">REJUAdmin2026</span>. Participant passwords are preset to REJU1stcohort2026.</p>

            <input
              type="password"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              placeholder="Admin password"
              className="w-full p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl mb-4 font-mono"
              onKeyDown={(e) => { if (e.key === "Enter") unlockAdmin(); }}
            />
            <button
              onClick={unlockAdmin}
              className="w-full py-4 bg-[#f5c26b] text-black font-bold rounded-2xl hover:opacity-90"
            >
              Unlock Dashboard
            </button>
            {unlockError && <p className="text-red-400 mt-3 text-sm">{unlockError}</p>}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Status bar */}
            <div className="flex items-center gap-3 flex-wrap bg-[#111] border border-[#f5c26b]/20 px-5 py-3 rounded-2xl text-sm">
              <div>
                <span className="text-gray-400">Current Cohort:</span>{" "}
                <span className="font-mono text-[#f5c26b]">{config?.currentCohort || "—"}</span>
              </div>
              <div className="text-gray-500">•</div>
              <div>
                Global Access: <span className={config?.active ? "text-emerald-400" : "text-red-400"}>
                  {config?.active ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              {loadingConfig && <div className="text-xs text-gray-500">refreshing…</div>}
            </div>

            {/* Registration Password */}
            <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="uppercase tracking-widest text-xs text-[#f5c26b]">Participant Registration</div>
                  <div className="text-2xl font-semibold mt-1">Registration Password</div>
                </div>
                <div className="text-right text-xs text-gray-500 font-mono pt-1">/participant-registration</div>
              </div>

              <div className="mb-4 text-sm">
                Current: <span className="font-mono bg-black/60 px-3 py-1 rounded border border-white/10">{config?.registrationPassword || "—"}</span>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={newRegPass}
                  onChange={(e) => setNewRegPass(e.target.value)}
                  placeholder="New registration password"
                  className="flex-1 p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl font-mono"
                />
                <button
                  onClick={updateRegistrationPassword}
                  disabled={actionLoading || !newRegPass.trim()}
                  className="px-8 border border-[#f5c26b] text-[#f5c26b] font-semibold rounded-2xl hover:bg-[#f5c26b] hover:text-black disabled:opacity-60"
                >
                  Update
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Give this password only to participants who have paid. Change after every event.</p>
            </div>

            {/* Book Authoring Password */}
            <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="uppercase tracking-widest text-xs text-[#f5c26b]">Book Authoring</div>
                  <div className="text-2xl font-semibold mt-1">Daily Journal / Book Password</div>
                </div>
                <div className="text-right text-xs text-gray-500 font-mono pt-1">/daily-transformation-log</div>
              </div>

              <div className="mb-4 text-sm">
                Current: <span className="font-mono bg-black/60 px-3 py-1 rounded border border-white/10">{config?.bookPassword || "—"}</span>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={newBookPass}
                  onChange={(e) => setNewBookPass(e.target.value)}
                  placeholder="New book authoring password"
                  className="flex-1 p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl font-mono"
                />
                <button
                  onClick={updateBookPassword}
                  disabled={actionLoading || !newBookPass.trim()}
                  className="px-8 border border-[#f5c26b] text-[#f5c26b] font-semibold rounded-2xl hover:bg-[#f5c26b] hover:text-black disabled:opacity-60"
                >
                  Update
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Used by participants to submit daily chapters that compile into their book.</p>
            </div>

            {/* Admin Password (for this dashboard) */}
            <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8">
              <div className="uppercase tracking-widest text-xs text-[#f5c26b] mb-1">Security</div>
              <div className="text-2xl font-semibold mb-4">Admin Password (this dashboard)</div>

              <div className="mb-4 text-sm">
                Current: <span className="font-mono bg-black/60 px-3 py-1 rounded border border-white/10">{config?.adminPassword || "—"}</span>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="New admin password"
                  className="flex-1 p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl font-mono"
                />
                <button
                  onClick={updateAdminPassword}
                  disabled={actionLoading || !newAdminPass.trim()}
                  className="px-8 border border-[#f5c26b] text-[#f5c26b] font-semibold rounded-2xl hover:bg-[#f5c26b] hover:text-black disabled:opacity-60"
                >
                  Update Admin PW
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-2">Change this to protect the admin controls themselves. Remember it!</p>
            </div>

            {/* Cohort + Global Toggle */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8">
                <div className="uppercase tracking-widest text-xs text-[#f5c26b] mb-1">Cohort</div>
                <div className="text-2xl font-semibold mb-4">Current Cohort Name</div>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCohort}
                    onChange={(e) => setNewCohort(e.target.value)}
                    placeholder="e.g. June 2026 Rejuvenation"
                    className="flex-1 p-4 bg-black/60 border border-[#f5c26b]/30 rounded-2xl"
                  />
                  <button
                    onClick={updateCohort}
                    disabled={actionLoading}
                    className="px-8 border border-[#f5c26b] text-[#f5c26b] font-semibold rounded-2xl hover:bg-[#f5c26b] hover:text-black disabled:opacity-60"
                  >
                    Set
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Displayed in participant records. Useful for filtering future events.</p>
              </div>

              <div className="bg-[#120904] border border-[#f5c26b]/20 rounded-3xl p-8 flex flex-col">
                <div className="uppercase tracking-widest text-xs text-[#f5c26b] mb-1">Global Kill Switch</div>
                <div className="text-2xl font-semibold mb-2">Access Active</div>
                <p className="text-sm text-gray-400 mb-6">Disable to instantly lock both registration and book authoring for everyone.</p>

                <button
                  onClick={toggleActive}
                  disabled={actionLoading}
                  className={`mt-auto w-full py-4 font-bold rounded-2xl border transition ${config?.active
                    ? "border-red-400/60 text-red-300 hover:bg-red-950/30"
                    : "border-emerald-400/70 text-emerald-300 hover:bg-emerald-950/30"
                  }`}
                >
                  {config?.active ? "DISABLE ALL ACCESS" : "ENABLE ACCESS"}
                </button>
                <div className="text-center text-xs mt-2 text-gray-500">
                  Currently: <span className={config?.active ? "text-emerald-400" : "text-red-400"}>{config?.active ? "ACTIVE" : "LOCKED"}</span>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-6 text-sm flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-semibold text-[#f5c26b]">Quick links:</span>
              <a href="/admin/generate-book" className="underline hover:text-[#f5c26b]">Generate full book for a participant</a>
              <span className="text-gray-600">•</span>
              <a href="/participant-registration" target="_blank" className="underline hover:text-[#f5c26b]">Open registration page</a>
              <span className="text-gray-600">•</span>
              <a href="/daily-transformation-log" target="_blank" className="underline hover:text-[#f5c26b]">Open daily journal</a>
              <button onClick={() => loadConfig()} className="ml-auto text-xs border px-3 py-1 rounded border-white/20 hover:bg-white/5">Refresh config</button>
            </div>

            {status && (
              <div className="p-4 bg-[#120904] border border-[#f5c26b]/30 text-[#f5c26b] rounded-2xl text-sm">
                {status}
              </div>
            )}

            <div className="text-[10px] text-gray-500 pt-2">
              Tip: After changing the password, share the new password only with paid/approved participants for the active cohort.
              The admin password itself is also stored in the same config file — keep it safe.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
