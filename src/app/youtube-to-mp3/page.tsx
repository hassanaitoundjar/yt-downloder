import { Metadata } from "next";
import Downloader from "@/components/Downloader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import RelatedTools from "@/components/RelatedTools";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "YouTube to MP3 Converter - Free High-Quality Audio Downloader",
  description:
    "Convert and download YouTube videos to high-quality MP3 audio files for free. Fast, unlimited YouTube to MP3 converter with no software or sign-up needed.",
  alternates: {
    canonical: "/youtube-to-mp3",
  },
  openGraph: {
    title: "YouTube to MP3 Converter - Free High-Quality Audio Downloader",
    description:
      "Convert and download YouTube videos to high-quality MP3 audio files for free. Fast and unlimited.",
    url: `${siteConfig.url}/youtube-to-mp3`,
    type: "website",
  },
};

const mp3Faqs = [
  {
    question: "How do I convert YouTube videos to MP3?",
    answer:
      "Paste any YouTube video URL into the box above, click Download Now, select the Audio tab, and choose your preferred bitrate (such as 320kbps or 128kbps) to save the audio file directly to your device.",
  },
  {
    question: "What audio bitrate and format will I get?",
    answer:
      "YTDL provides the highest possible audio stream uploaded by the creator, including crystal-clear 128kbps, 192kbps, and 320kbps audio qualities in MP3, M4A, and WebM audio formats.",
  },
  {
    question: "Can I convert long YouTube podcasts or music mixes?",
    answer:
      "Yes. Our converter handles short songs, multi-hour podcasts, interviews, and full music mixes effortlessly.",
  },
  {
    question: "Is there any limitation on the number of conversions?",
    answer:
      "No. YTDL is completely free with no daily limits, waiting queues, or mandatory sign-ups.",
  },
];

export default function YouTubeToMp3Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData
        type="tool"
        toolName="YouTube to MP3 Converter"
        toolDescription="Convert and download YouTube videos to high-quality MP3 audio files for free with no limits."
        canonicalPath="/youtube-to-mp3"
        breadcrumbs={[
          { name: "Home", item: siteConfig.url },
          { name: "YouTube to MP3", item: `${siteConfig.url}/youtube-to-mp3` },
        ]}
        faqs={mp3Faqs}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "YouTube to MP3", href: "/youtube-to-mp3" },
        ]}
      />
      <Downloader
        initialKind="audio"
        title="YouTube to MP3 Converter"
        badge="High Bitrate Audio • MP3 & M4A • Free"
        description="Convert any YouTube video, podcast, or music track to high-quality audio in seconds. Free, safe, and works on all devices."
      />

      <section className="py-16 bg-white px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Extract Crystal-Clear Audio from Any YouTube Video
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed text-base">
              Whether you need offline background listening for podcasts, audiobooks, lecture recordings, or royalty-free
              music tracks, our YouTube to MP3 tool rips high-fidelity audio streams directly from the source video
              without unnecessary re-encoding loss.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">1</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Paste Link</h3>
              <p className="text-sm text-slate-500">
                Paste the URL of any YouTube video or song into the input field above.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">2</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Select Audio</h3>
              <p className="text-sm text-slate-500">
                Choose the Audio tab to view all available bitrates and audio formats.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">3</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Instant Save</h3>
              <p className="text-sm text-slate-500">
                Click download to immediately save the clean sound file to your computer or phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools />
    </div>
  );
}
