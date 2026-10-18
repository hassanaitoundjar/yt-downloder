import { Metadata } from "next";
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
      <RelatedTools />
    </div>
  );
}
