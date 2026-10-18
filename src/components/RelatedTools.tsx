"use client";

import Link from "next/link";

export default function RelatedTools() {
  const tools = [
    {
      title: "YouTube Shorts Downloader",
      description: "Download YouTube Shorts in high-definition MP4 format with audio instantly.",
      href: "/youtube-shorts-downloader",
      icon: "🎬",
    },
    {
      title: "YouTube MP3 Downloader",
      description: "Extract clean audio from any YouTube video as high-quality MP3 or audio stream.",
      href: "/youtube-to-mp3",
      icon: "🎵",
    },
    {
      title: "YouTube Thumbnail Downloader",
      description: "Download the thumbnail of any YouTube video in full HD (1080p) or max resolution.",
      href: "/youtube-thumbnail-downloader",
      icon: "🖼️",
    },
  ];

  return (
    <section aria-labelledby="related-tools-heading" className="py-16 bg-slate-50 border-t border-slate-200 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 id="related-tools-heading" className="text-2xl font-bold text-slate-900 mb-8 text-center">
          Related Free YouTube Tools
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block p-6 rounded-xl border border-slate-200 bg-white hover:border-red-500 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors mb-4">
                <span className="text-xl" role="img" aria-hidden="true">{tool.icon}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                {tool.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
