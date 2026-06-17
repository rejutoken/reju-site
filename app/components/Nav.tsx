"use client";

import React, { useState, useEffect } from "react";

interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/buy", label: "Buy REJU" },
  { href: "/#tokenomics", label: "Tokenomics" },
  { href: "/program", label: "Program" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/rejunomics", label: "Rejunomics" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close menu when clicking a link (mobile)
  const handleLinkClick = () => {
    setOpen(false);
  };

  const linkClass =
    "hover:text-[#f5c26b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c26b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c] rounded";

  const desktopLinkClass = `${linkClass} text-base text-gray-300`;
  const mobileLinkClass = `${linkClass} text-xl text-gray-100 py-3 border-b border-[#f5c26b]/20 last:border-b-0`;

  return (
    <nav
      className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
      aria-label="Primary navigation"
    >
      {/* REJU + socials (X above TG). REJU aligned with menu links height */}
      <div className="relative">
        <a
          href="/"
          className="font-bold text-[#f5c26b] text-lg tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c26b] rounded"
          onClick={handleLinkClick}
        >
          REJU
        </a>
        <div className="absolute left-0 top-[48px] flex flex-col gap-1">
          {/* X */}
          <a
            href="https://x.com/rejutoken"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f5c26b] hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c26b] rounded"
            aria-label="REJU on X"
            onClick={handleLinkClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 1200 1227"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.943L514.473 750.613L841.037 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z" />
            </svg>
          </a>
          {/* Telegram */}
          <a
            href="https://t.me/rejuofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f5c26b] hover:text-white transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f5c26b] rounded"
            aria-label="REJU on Telegram"
            onClick={handleLinkClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.6.05-1.02-.35-1.58-.7l-2.3-1.5c-1.1-.72-1.9-1.18-3-1.3-.3-.03-.5-.1-.7-.3-.3-.3-.2-.7-.1-.9l.1-.2 5.8-5.2c.3-.3.7-.3 1 0 .3.2.3.7 0 1l-4.8 4.3z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={desktopLinkClass}
            {...(link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Mobile Hamburger */}
      <button
        type="button"
        className="md:hidden flex items-center justify-center w-11 h-11 text-[#f5c26b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c26b] rounded-lg"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        {open ? (
          // Close icon (X)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Hamburger icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[100] md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-[82%] max-w-xs bg-[#120904] border-l border-[#f5c26b]/30 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-8 border-b border-[#f5c26b]/20">
              <div className="relative">
                <a
                  href="/"
                  className="font-bold text-[#f5c26b] text-lg"
                  onClick={handleLinkClick}
                >
                  REJU
                </a>
                <div className="absolute left-0 top-[42px] flex flex-col gap-1">
                  {/* X */}
                  <a
                    href="https://x.com/rejutoken"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5c26b] hover:text-white transition-colors"
                    aria-label="REJU on X"
                    onClick={handleLinkClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 1200 1227"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.943L514.473 750.613L841.037 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z" />
                    </svg>
                  </a>
                  {/* Telegram */}
                  <a
                    href="https://t.me/rejuofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5c26b] hover:text-white transition-colors"
                    aria-label="REJU on Telegram"
                    onClick={handleLinkClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.6.05-1.02-.35-1.58-.7l-2.3-1.5c-1.1-.72-1.9-1.18-3-1.3-.3-.03-.5-.1-.7-.3-.3-.3-.2-.7-.1-.9l.1-.2 5.8-5.2c.3-.3.7-.3 1 0 .3.2.3.7 0 1l-4.8 4.3z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#f5c26b] p-2 -mr-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5c26b] rounded"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col px-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={mobileLinkClass}
                  onClick={handleLinkClick}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-auto px-6 py-6 text-xs text-gray-500 border-t border-[#f5c26b]/10">
              Participation-Driven Ecosystem™
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
