"use client";

import { useState } from "react";

export default function GenerateBookAdmin() {
  const [participantId, setParticipantId] = useState("");
  const [status, setStatus] = useState("");
  const [bookUrl, setBookUrl] = useState("");

  const handleGenerate = async () => {
    if (!participantId.trim()) {
      setStatus("Please enter a Participant ID.");
      return;
    }
    setStatus("Generating full book... This may take a minute.");
    setBookUrl("");

    try {
      const res = await fetch("/api/generate-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: participantId.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("Book generated successfully!");
        setBookUrl(data.url || "");
      } else {
        setStatus(data.error || "Failed to generate book.");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error generating book. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 p-4 border border-[#f5c26b]/30 bg-[#120904] rounded">
          <p className="text-[#f5c26b] font-bold text-sm uppercase tracking-widest">REJU PERSONNEL ONLY</p>
          <p className="text-xs text-gray-400 mt-1">This page is not linked from the public site. Do not share the URL.</p>
        </div>

        <h1 className="text-4xl font-bold text-[#f5c26b] mb-2">Generate Client Book (REJU Personnel)</h1>
        <p className="text-gray-300 mb-8">Enter the Participant ID (used in all daily filenames) to compile the complete Personalized REJU Transformation Book.</p>

        <div className="space-y-4">
          <input
            type="text"
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            placeholder="Participant ID (e.g. REJU-202606171234-5678)"
            className="w-full p-4 bg-black/60 border border-[#f5c26b]/30 rounded text-white font-mono"
          />

          <button
            onClick={handleGenerate}
            disabled={!participantId.trim()}
            className="w-full py-4 border border-[#f5c26b] text-[#f5c26b] font-semibold text-lg rounded hover:bg-[#f5c26b] hover:text-black transition disabled:opacity-50"
          >
            Generate Full Book
          </button>
        </div>

        {status && (
          <div className="mt-6 p-4 bg-[#120904] border border-[#f5c26b]/20 rounded">
            <p className="text-lg">{status}</p>
            {bookUrl && (
              <a 
                href={bookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[#f5c26b] underline"
              >
                Open Generated Book in Google Drive →
              </a>
            )}
          </div>
        )}

        <div className="mt-12 text-xs text-gray-500">
          Use the exact Participant ID. All new daily uploads use the ID in the filename. This tool finds and merges the chapters into the final book.
        </div>
      </div>
    </div>
  );
}
