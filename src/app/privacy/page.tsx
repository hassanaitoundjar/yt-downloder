import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Privacy Policy - Data & Security",
  description: "Review the YTDL privacy policy. We do not store your downloaded content, logs, or personal user data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy - YTDL",
    description: "Review how YTDL protects user privacy. Zero personal data logging.",
    url: `${siteConfig.url}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <StructuredData
        type="page"
        canonicalPath="/privacy"
        toolName="Privacy Policy"
        breadcrumbs={[
          { name: "Home", item: siteConfig.url },
          { name: "Privacy Policy", item: `${siteConfig.url}/privacy` },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy", href: "/privacy" },
          ]}
        />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4 mt-6">
          Privacy Policy
        </h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Last updated: October 2026. At YTDL, your privacy and digital security are our primary priorities.
          This privacy policy outlines how our service handles network requests and data.
        </p>

        <section className="space-y-6 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. No Personal Data Collection</h2>
            <p className="text-slate-600 text-sm">
              We do not require accounts, sign-ups, email addresses, payment methods, or tracking cookies to use our downloader.
              You can browse and convert videos completely anonymously.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Processing of Video URLs</h2>
            <p className="text-slate-600 text-sm">
              When you paste a YouTube link, our backend processes the request in real time using yt-dlp to extract available video
              resolutions and audio streams. Video files are streamed directly to your browser and are not permanently archived on our servers.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Third-Party Services & Links</h2>
            <p className="text-slate-600 text-sm">
              Our service interacts with public YouTube endpoints to retrieve public video streams. YouTube's terms and privacy policies
              govern the media hosted on their platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Contact Information</h2>
            <p className="text-slate-600 text-sm">
              If you have any questions regarding this Privacy Policy, please email us at{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-red-600 font-semibold hover:underline">
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
