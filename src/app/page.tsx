import { Metadata } from "next";
import Link from "next/link";
import Downloader from "@/components/Downloader";
import StructuredData from "@/components/StructuredData";
import RelatedTools from "@/components/RelatedTools";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteConfig.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData type="homepage" canonicalPath="/" />
      <Downloader />

      {/* Comprehensive SEO Content & Format Comparison Section */}
      <section className="py-16 bg-white px-4 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section 1: Format Matrix */}
          <div>
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
                Format Guide & Compatibility
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                MP4 vs WebM: Which Format Should You Choose?
              </h2>
              <p className="mt-3 text-slate-500 text-sm sm:text-base">
                YTDL extracts and remuxes streams in original source codecs so you get perfect playback across every device.
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">Format</th>
                    <th scope="col" className="px-6 py-4">Video / Audio Codec</th>
                    <th scope="col" className="px-6 py-4">Max Resolution</th>
                    <th scope="col" className="px-6 py-4">Best For</th>
                    <th scope="col" className="px-6 py-4">Device Compatibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">MP4 (Recommended)</td>
                    <td className="px-6 py-4">H.264 (AVC) + AAC</td>
                    <td className="px-6 py-4">4K / 1080p / 720p</td>
                    <td className="px-6 py-4">iPhone, iPad, Mac, Windows, Smart TVs</td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold">Universal (99.9%)</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">WebM</td>
                    <td className="px-6 py-4">VP9 / AV1 + Opus</td>
                    <td className="px-6 py-4">8K / 4K / 1440p</td>
                    <td className="px-6 py-4">Android, Chrome, Firefox, Linux</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">Modern Browsers</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">MP3 (Audio Only)</td>
                    <td className="px-6 py-4">MPEG Audio Layer III</td>
                    <td className="px-6 py-4">Up to 320 kbps</td>
                    <td className="px-6 py-4">Podcasts, Car Audio, Music Mixes</td>
                    <td className="px-6 py-4 text-emerald-600 font-semibold">Universal (100%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Why Choose YTDL (E-E-A-T & Trust) */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold mb-4">
                ⚡
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Lossless Remuxing</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                We merge video and audio streams into standard MP4 containers on the fly without lossy re-encoding, preserving 100% of the original video quality.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold mb-4">
                🔒
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Zero Tracking & Privacy</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                No user accounts, tracking cookies, or history databases. Videos are streamed directly to your browser and never permanently stored on our disks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-bold mb-4">
                📱
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Cross-Platform Support</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Works seamlessly in mobile browsers on iOS (Safari) and Android (Chrome), as well as on desktop computers without installing any software.
              </p>
            </div>
          </div>

          {/* Section 3: Educational Guide */}
          <div className="border border-slate-200 rounded-2xl p-8 sm:p-10 bg-slate-50/50">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Educational Guide: How to Safely Download YouTube Content
            </h3>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Many online video converters subject visitors to deceptive popups, bundled adware, or intrusive notifications.
                YTDL was engineered with modern web standards to provide a safe, lightweight, and clean environment for offline personal viewing.
              </p>
              <p>
                <strong>Fair Use and Copyright Notice:</strong> Downloading videos is permitted for personal offline backups, research, fair use commentary, and non-commercial educational purposes. Content creators retain all copyright over their media. Please respect creator intellectual property and review our{" "}
                <Link href="/terms" className="text-red-600 underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-red-600 underline font-medium">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools />
    </div>
  );
}
