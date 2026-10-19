import { siteConfig } from "@/lib/seo-config";

export interface BreadcrumbEntry {
  name: string;
  item: string;
}

export interface FAQEntry {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  type?: "homepage" | "tool" | "page";
  toolName?: string;
  toolDescription?: string;
  canonicalPath?: string;
  breadcrumbs?: BreadcrumbEntry[];
  faqs?: FAQEntry[];
}

function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function StructuredData({
  type = "homepage",
  toolName = "YouTube Video Downloader",
  toolDescription = "Download any YouTube video in HD, 4K, or SD. Free, instant, no software needed.",
  canonicalPath = "/",
  breadcrumbs,
  faqs,
}: StructuredDataProps) {
  const currentUrl = `${siteConfig.url}${canonicalPath === "/" ? "" : canonicalPath}`;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon-512.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contactEmail,
      availableLanguage: ["English"],
    },
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolName,
    applicationCategory: "MultimediaApplication",
    applicationSubCategory: "Video Downloader",
    url: currentUrl,
    description: toolDescription,
    operatingSystem: "All",
    browserRequirements: "Requires modern JavaScript-enabled web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1480",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "High Definition (HD) and 4K downloads",
      "MP4 video extraction",
      "Audio and MP3 extraction",
      "YouTube Shorts support",
      "No account or registration required",
      "Completely free with no limits",
    ],
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Download YouTube Videos & Audio with ${siteConfig.name}`,
    description: "Step-by-step guide on how to download any YouTube video in HD, MP4, or MP3 without software.",
    totalTime: "PT1M",
    tool: [
      {
        "@type": "HowToTool",
        name: "Web Browser (Chrome, Safari, Firefox, Edge)",
      },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the YouTube Video Link",
        text: "Open YouTube in your browser or mobile app, find the video or Short, and copy its URL link.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste URL into YTDL",
        text: "Paste the copied YouTube video link into the search bar on YTDL and click Download Now.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Choose Quality and Download",
        text: "Select your desired video resolution (such as 4K, 1080p, 720p) or audio format and click Download to save the file to your device.",
      },
    ],
  };

  const defaultBreadcrumbs: BreadcrumbEntry[] =
    canonicalPath === "/"
      ? [{ name: "Home", item: siteConfig.url }]
      : [
          { name: "Home", item: siteConfig.url },
          { name: toolName, item: currentUrl },
        ];

  const activeBreadcrumbs = breadcrumbs && breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: activeBreadcrumbs.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.name,
      item: b.item.startsWith("http") ? b.item : `${siteConfig.url}${b.item === "/" ? "" : b.item}`,
    })),
  };

  const defaultFaqs: FAQEntry[] = [
    {
      question: "Is it free to download YouTube videos with YTDL?",
      answer: "Yes, completely free. No subscription, no account registration, and no download limits.",
    },
    {
      question: "What quality and formats are available?",
      answer: "We support resolutions from 144p up to 1080p, 2K, and 4K in MP4 and WebM formats, as well as MP3/audio streams.",
    },
    {
      question: "Do I need to install any software or extensions?",
      answer: "No software or browser extensions are required. YTDL runs directly in any modern desktop or mobile browser.",
    },
    {
      question: "Can I download YouTube Shorts?",
      answer: "Yes, YTDL supports standard YouTube videos, YouTube Shorts, and youtu.be links seamlessly.",
    },
  ];

  const activeFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: activeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLdScript data={organization} />
      <JsonLdScript data={webSite} />
      {(type === "homepage" || type === "tool") && (
        <>
          <JsonLdScript data={webApplication} />
          <JsonLdScript data={howTo} />
        </>
      )}
      <JsonLdScript data={breadcrumbList} />
      {activeFaqs.length > 0 && <JsonLdScript data={faqPage} />}
    </>
  );
}
