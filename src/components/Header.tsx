"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/seo-config";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Video Downloader", href: "/" },
    { label: "Shorts Downloader", href: "/youtube-shorts-downloader" },
    { label: "YouTube to MP3", href: "/youtube-to-mp3" },
    { label: "Thumbnail Grabber", href: "/youtube-thumbnail-downloader" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-lg focus:shadow-xl focus:ring-2 focus:ring-red-500"
      >
        Skip to main content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg py-1"
                aria-label={`${siteConfig.name} Home`}
              >
                <span className="font-black text-2xl tracking-tight text-slate-900">
                  YTDL<span className="text-red-600">.</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2 py-0.5 ml-1">
                  FREE
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-1"
            >
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "text-red-600 bg-red-50/80 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/#faq"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                FAQ
              </Link>
              <Link
                href="/#history"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
              >
                <svg
                  className="w-3.5 h-3.5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                History
              </Link>
            </div>

            {/* Mobile Menu Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open main menu"}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Download Tools
            </div>
            <div className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                      active
                        ? "text-red-600 bg-red-50 font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1">
              <Link
                href="/#history"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Download History
              </Link>
              <Link
                href="/contact"
                className="block px-3.5 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Contact Support
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
