import { Metadata } from "next";
import Downloader from "@/components/Downloader";
import StructuredData from "@/components/StructuredData";
import RelatedTools from "@/components/RelatedTools";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "YouTube Shorts Downloader - Free HD MP4 Video Download",
  description:
    "Download YouTube Shorts videos in HD 1080p MP4 format with crystal-clear audio. Free, instant online Shorts downloader with no watermark or app required.",
  alternates: {
    canonical: "/youtube-shorts-downloader",
  },
  openGraph: {
    title: "YouTube Shorts Downloader - Free HD MP4 Video Download",
    description:
      "Download YouTube Shorts videos in HD 1080p MP4 format with crystal-clear audio. Free, instant online Shorts downloader.",
    url: `${siteConfig.url}/youtube-shorts-downloader`,
    type: "website",
  },
};

const shortsFaqs = [
  {
    question: "How do I download YouTube Shorts on mobile or PC?",
    answer:
      "Simply copy the YouTube Shorts link from your browser or the YouTube app (tap Share > Copy link), paste it into the input box above, and click Download Now to save the MP4 video directly.",
  },
  {
    question: "Do downloaded Shorts include audio?",
    answer:
      "Yes, all YouTube Shorts downloaded through YTDL retain high-quality original stereo audio synchronized with the video.",
  },
  {
    question: "Is there a watermark added to downloaded YouTube Shorts?",
    answer:
      "No. Videos downloaded through YTDL are saved in their pure, original quality without any added logos, watermarks, or overlays.",
  },
  {
    question: "Is this YouTube Shorts downloader free?",
    answer:
      "Yes, our Shorts downloader is 100% free with unlimited downloads and no registration or subscription required.",
  },
];

export default function YouTubeShortsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData
        type="tool"
        toolName="YouTube Shorts Downloader"
        toolDescription="Download YouTube Shorts videos in HD 1080p MP4 format with crystal-clear audio. Free and instant."
        canonicalPath="/youtube-shorts-downloader"
        breadcrumbs={[
          { name: "Home", item: siteConfig.url },
          { name: "YouTube Shorts Downloader", item: `${siteConfig.url}/youtube-shorts-downloader` },
        ]}
        faqs={shortsFaqs}
      />

      <Downloader
        initialKind="video"
        title="YouTube Shorts Downloader"
        badge="YouTube Shorts • HD MP4 • No Watermark"
        description="Download any YouTube Shorts video in 1080p or 720p HD MP4 format. Instant, free, and works on iPhone, Android, Mac & PC."
      />

      <section className="py-16 bg-white px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Fast, High-Definition YouTube Shorts Downloader
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed text-base">
              YouTube Shorts has become one of the most popular vertical video platforms in the world. YTDL gives you
              the easiest way to download YouTube Shorts directly to your camera roll, downloads folder, or cloud storage
              in full HD resolution without losing quality or introducing watermarks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">1</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Copy Shorts Link</h3>
              <p className="text-sm text-slate-500">
                Open YouTube, navigate to any Shorts video, tap Share, and copy the link.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">2</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Paste & Fetch</h3>
              <p className="text-sm text-slate-500">
                Paste the URL into our downloader search bar above and click Download Now.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">3</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Save MP4 Video</h3>
              <p className="text-sm text-slate-500">
                Choose your preferred resolution and download your MP4 video with full sound.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools />
    </div>
  );
}
