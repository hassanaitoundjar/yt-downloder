import { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import StructuredData from "@/components/StructuredData";
import { siteConfig } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Contact Us - Support & Feedback",
  description: "Contact the YTDL support team for assistance, inquiries, bug reports, or feature requests regarding our YouTube Video Downloader.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us - YTDL YouTube Video Downloader",
    description: "Contact the YTDL support team for assistance, inquiries, or feedback.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <StructuredData
        type="page"
        canonicalPath="/contact"
        toolName="Contact Us"
        breadcrumbs={[
          { name: "Home", item: siteConfig.url },
          { name: "Contact Us", item: `${siteConfig.url}/contact` },
        ]}
      />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Contact Us", href: "/contact" },
          ]}
        />
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4 mt-6">
          Contact Us
        </h1>
        <p className="text-slate-600 leading-relaxed mb-8">
          Have questions, suggestions, or experiencing an issue with a download? We are here to help.
        </p>

        <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Email Support</h2>
            <p className="text-slate-600 text-sm">
              You can reach our team directly at{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-red-600 font-semibold hover:underline"
              >
                {siteConfig.contactEmail}
              </a>
              .
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-1">Download Troubleshooting</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              When reporting a download issue, please include:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600">
              <li>The YouTube URL that encountered an error</li>
              <li>Your device and browser version (e.g. Chrome on Windows, Safari on iOS)</li>
              <li>The selected video format or resolution</li>
              <li>Any error message shown in the notification toast</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
