import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Terms of Service - Fair Use & Legal Guidelines",
  description: "Terms and conditions for utilizing the YTDL YouTube Video Downloader tool.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service - YTDL",
    description: "Terms and conditions for utilizing the YTDL YouTube Video Downloader tool.",
    url: `${siteConfig.url}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <StructuredData
        type="page"
        canonicalPath="/terms"
        toolName="Terms of Service"
        breadcrumbs={[
          { name: "Home", item: siteConfig.url },
          { name: "Terms of Service", item: `${siteConfig.url}/terms` },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Terms of Service", href: "/terms" },
          ]}
        />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4 mt-6">
          Terms of Service
        </h1>
        <p className="text-slate-600 leading-relaxed mb-6">
          Last updated: October 2026. By accessing and using YTDL, you agree to comply with the terms set forth below.
        </p>

        <section className="space-y-6 text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">1. Permitted Use</h2>
            <p className="text-slate-600 text-sm">
              YTDL is created for personal, non-commercial offline backup and educational purposes. You agree not to use the tool
              to violate copyright laws or infringe on intellectual property rights of creators without their express permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">2. Respect for Content Creators</h2>
            <p className="text-slate-600 text-sm">
              Users are solely responsible for ensuring that their downloading and use of third-party media complies with fair use doctrine
              and applicable regional copyright regulations.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">3. Disclaimer of Warranties</h2>
            <p className="text-slate-600 text-sm">
              The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. YTDL does
              not warrant uninterrupted operation or compatibility with every single YouTube video configuration.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">4. Questions & Feedback</h2>
            <p className="text-slate-600 text-sm">
              For legal or terms inquiries, contact us at{" "}
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
