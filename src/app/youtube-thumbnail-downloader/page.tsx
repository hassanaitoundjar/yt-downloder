import { Metadata } from "next";
import Downloader from "@/components/Downloader";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import RelatedTools from "@/components/RelatedTools";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "YouTube Thumbnail Downloader - Free HD & 4K Cover Image Grabber",
  description:
    "Download full-resolution YouTube video thumbnails in HD 1080p, 720p, and 4K. Free, instant YouTube thumbnail image grabber with no registration needed.",
  alternates: {
    canonical: "/youtube-thumbnail-downloader",
  },
  openGraph: {
    title: "YouTube Thumbnail Downloader - Free HD & 4K Cover Image Grabber",
    description:
      "Download full-resolution YouTube video thumbnails in HD 1080p, 720p, and 4K. Free and instant.",
    url: `${siteConfig.url}/youtube-thumbnail-downloader`,
    type: "website",
  },
};

const thumbnailFaqs = [
  {
    question: "How do I download a thumbnail from a YouTube video?",
    answer:
      "Enter any YouTube video URL into the search bar above and click Download Now. When the video card displays, click Save Thumbnail to save the highest available full-resolution image.",
  },
  {
    question: "What resolutions are YouTube thumbnails available in?",
    answer:
      "YouTube generates thumbnails in multiple sizes: Maximum Resolution (1920x1080 or 1280x720 maxresdefault), High Quality (hqdefault 480x360), Medium Quality (mqdefault 320x180), and Standard Quality (sddefault 640x480). YTDL automatically serves the highest resolution uploaded.",
  },
  {
    question: "Is it legal to download and use YouTube thumbnails?",
    answer:
      "Thumbnails are copyrighted by the content creator. You may download thumbnails for personal reference, fair use (such as commentary or analysis), or inspiration, but you should not republish another creator's thumbnail as your own without permission.",
  },
  {
    question: "Can I download thumbnails from YouTube Shorts?",
    answer:
      "Yes, our thumbnail grabber extracts cover images from both traditional YouTube videos and YouTube Shorts.",
  },
];

export default function YouTubeThumbnailPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <StructuredData
        type="tool"
        toolName="YouTube Thumbnail Downloader"
        toolDescription="Download full-resolution YouTube video thumbnails in HD 1080p and 4K for free."
        canonicalPath="/youtube-thumbnail-downloader"
        breadcrumbs={[
          { name: "Home", item: siteConfig.url },
          { name: "YouTube Thumbnail Downloader", item: `${siteConfig.url}/youtube-thumbnail-downloader` },
        ]}
        faqs={thumbnailFaqs}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "YouTube Thumbnail Downloader", href: "/youtube-thumbnail-downloader" },
        ]}
      />
      <Downloader
        initialKind="video"
        title="YouTube Thumbnail Downloader"
        badge="Full HD 1080p • 4K Cover Art • Instant"
        description="Grab the highest quality thumbnail image from any YouTube video or Short. Instant preview and one-click download."
      />

      <section className="py-16 bg-white px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              High Resolution YouTube Cover & Thumbnail Grabber
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed text-base">
              Need the original cover image of a YouTube video for reference, moodboards, educational presentations, or
              content creation? YTDL lets you fetch and save the original maxresdefault JPEG thumbnail uploaded by the
              channel creator in crisp 1080p or 720p HD resolution.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">1</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Enter Video Link</h3>
              <p className="text-sm text-slate-500">
                Copy and paste the URL of any public YouTube video or Shorts link above.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">2</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Inspect Artwork</h3>
              <p className="text-sm text-slate-500">
                Preview the thumbnail image alongside video duration, channel title, and formats.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xl font-bold text-red-600">3</span>
              <h3 className="font-bold text-slate-900 mt-2 mb-1">Save Image</h3>
              <p className="text-sm text-slate-500">
                Click Save Thumbnail to store the original full-res cover file instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools />
    </div>
  );
}
