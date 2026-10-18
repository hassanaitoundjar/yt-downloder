import Link from "next/link";
import { siteConfig } from "@/lib/seo-config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-slate-200 bg-slate-900 text-slate-400 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
              aria-label={`${siteConfig.name} Home`}
            >
              <span className="font-black text-2xl tracking-tight text-white">
                YTDL<span className="text-red-500">.</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Free, modern YouTube video and audio downloader. Save 4K videos, YouTube Shorts,
              high-bitrate MP3 tracks, and full-resolution thumbnails directly to your device without installing software.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All downloader systems operational</span>
            </div>
          </div>

          {/* Column 2: Free Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Free Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  YouTube Downloader
                </Link>
              </li>
              <li>
                <Link
                  href="/youtube-shorts-downloader"
                  className="hover:text-white transition-colors"
                >
                  Shorts Downloader
                </Link>
              </li>
              <li>
                <Link
                  href="/youtube-to-mp3"
                  className="hover:text-white transition-colors"
                >
                  YouTube to MP3
                </Link>
              </li>
              <li>
                <Link
                  href="/youtube-thumbnail-downloader"
                  className="hover:text-white transition-colors"
                >
                  Thumbnail Grabber
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="hover:text-white transition-colors"
                >
                  Features & Quality
                </Link>
              </li>
              <li>
                <Link
                  href="/#formats"
                  className="hover:text-white transition-colors"
                >
                  Supported Formats
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Legal & Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
          <p className="max-w-xl text-center md:text-right leading-relaxed text-slate-400">
            Disclaimer: {siteConfig.name} is an independent tool and is not affiliated, associated, authorized,
            endorsed by, or in any way officially connected with YouTube, Google LLC, or Alphabet Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
