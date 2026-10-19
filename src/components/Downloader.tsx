"use client";

import { useState, useEffect } from "react";
import { isYouTubeUrl } from "@/lib/utils";
import { formatBytes, formatDuration } from "@/lib/utils";

type VideoFormat = {
  format_id: string;
  ext: string;
  resolution: string;
  height: number;
  fps: number;
  vcodec: string;
  acodec: string;
  filesize: number;
  tbr: number;
  hasAudio: boolean;
  hasVideo: boolean;
};

type VideoInfo = {
  id: string;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  view_count: number | null;
  formats: { video: VideoFormat[]; audio: VideoFormat[] };
};

type DownloadHistory = {
  id: number;
  title: string;
  url: string;
  format_id: string | null;
  resolution: string | null;
  ext: string | null;
  file_size: number | null;
  created_at: number;
};

export default function Downloader({
  initialKind = "video",
  title = "YouTube Video Downloader",
  badge = "Free Tool • No sign-up",
  description = "Download any YouTube video in HD, 4K, or SD. Free, instant, no software needed.",
}: {
  initialKind?: "video" | "audio";
  title?: string;
  badge?: string;
  description?: string;
} = {}) {
  const [url, setUrl] = useState("");
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [activeKind, setActiveKind] = useState<"video" | "audio">(initialKind);
  const [history, setHistory] = useState<DownloadHistory[]>([]);

  const escapeHtml = (str: string) =>
    String(str ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c)
    );

  const fetchInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const u = url.trim();
    if (!u) {
      showToast("Please paste a YouTube link", "error");
      return;
    }
    if (!isYouTubeUrl(u)) {
      showToast("Please enter a valid YouTube video URL", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/info?url=${encodeURIComponent(u)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch video info");
      setInfo(data);
      setActiveKind(initialKind);
    } catch (err: any) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch {
      // ignore
    }
  };

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePaste = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          showToast("Link pasted from clipboard", "success");
        }
      }
    } catch {
      const input = document.getElementById("urlInput") as HTMLInputElement | null;
      input?.focus();
    }
  };

  const handleDownload = async (btn: HTMLButtonElement, f: VideoFormat) => {
    const videoUrl = `https://youtu.be/${info?.id}`;
    if (!videoUrl) {
      showToast("No download URL available", "error");
      return;
    }
    setDownloading(f.format_id);
    setDownloadProgress(0);
    btn.disabled = true;
    btn.textContent = "Downloading...";

    try {
      const res = await fetch(
        `/api/download?url=${encodeURIComponent(videoUrl)}&f=${encodeURIComponent(f.format_id)}`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Download failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const chunks: Uint8Array[] = [];
      let received = 0;
      // The server remuxes on the fly, so it sends an estimate instead of Content-Length.
      const total =
        parseInt(res.headers.get("content-length") || "0", 10) ||
        parseInt(res.headers.get("x-expected-size") || "0", 10) ||
        f.filesize ||
        0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total > 0) {
            // Estimates can be slightly off; never claim 100% before the stream ends.
            setDownloadProgress(Math.min(99, Math.round((received / total) * 100)));
          }
        }
      }
      reader.releaseLock();
      setDownloadProgress(100);

      const blob = new Blob(chunks as BlobPart[]);
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${(info?.title || "video")
        .replace(/[^a-z0-9]+/gi, "-")
        .slice(0, 80)}.${f.ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: info?.title,
          url: videoUrl,
          format_id: f.format_id,
          resolution: f.resolution,
          ext: f.ext,
          file_size: f.filesize,
        }),
      });
      loadHistory();
      showToast("Download complete");
    } catch (err: any) {
      showToast(err.message || "Download failed", "error");
    } finally {
      setDownloading(null);
      setDownloadProgress(0);
      btn.disabled = false;
      btn.textContent = `Download ${f.resolution}`;
    }
  };

  const formats =
    activeKind === "video" ? info?.formats.video : info?.formats.audio;

  return (
    <div className="bg-white text-slate-900">
      <section
        aria-labelledby="hero-heading"
        className="bg-slate-50 border-b border-slate-200 py-10 sm:py-16 lg:py-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            {badge}
          </span>
          <h1
            id="hero-heading"
            className="mt-4 sm:mt-6 text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight"
          >
            {title}
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto px-2">
            {description}
          </p>

          <form
            onSubmit={fetchInfo}
            className="mt-6 sm:mt-8 max-w-2xl mx-auto"
            aria-label="YouTube video URL input"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white rounded-2xl border border-slate-300 shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500/20 transition-all">
              <div className="relative flex-1 flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none" aria-hidden="true">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </span>
                <label htmlFor="urlInput" className="sr-only">
                  YouTube video URL
                </label>
                <input
                  id="urlInput"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube video link..."
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full pl-11 pr-20 sm:pr-4 py-3 sm:py-3.5 text-base text-slate-900 rounded-xl outline-none bg-transparent placeholder:text-slate-400"
                  disabled={loading}
                  required
                />
                {!url ? (
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-2 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition sm:hidden"
                    title="Paste from clipboard"
                  >
                    📋 Paste
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setUrl("")}
                    className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg sm:hidden"
                    title="Clear input"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-7 py-3.5 text-base font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md sm:shadow-none flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px]"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Fetching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Now</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2.5 text-xs text-slate-400">Supports youtube.com, youtu.be, and YouTube Shorts</p>
          </form>

          <div className="mt-8 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>
              <strong className="text-slate-800">4K</strong> • <strong className="text-slate-800">1080p</strong> •{" "}
              <strong className="text-slate-800">720p</strong>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span>
              <strong className="text-slate-800">MP4</strong> • <strong className="text-slate-800">WebM</strong> •{" "}
              <strong className="text-slate-800">Audio (MP3)</strong>
            </span>
          </div>
        </div>
      </section>

      {info && (
        <section id="results" aria-labelledby="results-heading" className="py-8 sm:py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 id="results-heading" className="sr-only">
              Download results for {info.title}
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={info.thumbnail || ""}
                alt={info.title ? `Thumbnail for ${info.title}` : ""}
                className="w-full sm:w-48 md:w-56 aspect-video rounded-xl object-cover bg-slate-200 shadow-sm"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 line-clamp-2">
                  {info.title}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-2">
                  {[
                    info.duration ? formatDuration(info.duration) : null,
                    info.uploader,
                    info.view_count ? `${info.view_count.toLocaleString()} views` : null,
                  ]
                    .filter(Boolean)
                    .map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5">
                        {idx > 0 && <span className="text-slate-300">•</span>}
                        {item}
                      </span>
                    ))}
                </p>
              </div>
              <div className="w-full sm:w-auto flex sm:flex-col gap-2 pt-2 sm:pt-0">
                {info.thumbnail && (
                  <a
                    href={info.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`thumbnail-${info.id}.jpg`}
                    className="flex-1 sm:flex-initial text-center px-4 py-2.5 text-xs sm:text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                  >
                    Save Thumbnail
                  </a>
                )}
                <button
                  onClick={() => {
                    setInfo(null);
                    setUrl("");
                  }}
                  className="flex-1 sm:flex-initial text-center px-4 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition"
                >
                  Change URL
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveKind("video")}
                className={`px-4 sm:px-5 py-2.5 text-sm font-bold rounded-xl transition whitespace-nowrap ${
                  activeKind === "video"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-pressed={activeKind === "video"}
              >
                🎬 Video MP4
              </button>
              <button
                onClick={() => setActiveKind("audio")}
                className={`px-4 sm:px-5 py-2.5 text-sm font-bold rounded-xl transition whitespace-nowrap ${
                  activeKind === "audio"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-pressed={activeKind === "audio"}
              >
                🎵 Audio (MP3)
              </button>
            </div>

            {formats && formats.length === 0 && (
              <p className="text-center text-slate-500 py-12">No downloadable formats found for this video.</p>
            )}

            {formats && formats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
                {formats.map((f) => {
                  const isAudio = !f.hasVideo;
                  const recommended = f === formats[0];
                  return (
                    <article
                      key={f.format_id}
                      className={`border rounded-xl p-4 sm:p-5 bg-white transition hover:shadow-md ${
                        recommended ? "border-red-500 bg-red-50/40" : "border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            recommended ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isAudio ? "AUDIO" : f.resolution}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {f.ext.toUpperCase()}
                          {!isAudio && f.fps ? ` • ${f.fps}fps` : ""}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-slate-600 mb-3">
                        {formatBytes(f.filesize)}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          disabled={downloading === f.format_id}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(e.currentTarget, f);
                          }}
                          className={`w-full min-h-[46px] py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition active:scale-[0.99] ${
                            downloading === f.format_id
                              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {downloading === f.format_id
                            ? `Downloading ${downloadProgress}%`
                            : `Download ${isAudio ? "Audio" : f.resolution}`}
                        </button>
                        {downloading === f.format_id && (
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-600 transition-all duration-100"
                              style={{ width: `${downloadProgress}%` }}
                              aria-label="Download progress"
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="py-12 sm:py-16 border-b border-slate-200 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            From URL to download in seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10">Paste, fetch, pick your quality.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                num: "01",
                title: "Paste the URL",
                desc: "Copy the YouTube video link from your browser or app and paste it above.",
              },
              {
                num: "02",
                title: "Fetch download links",
                desc: "We instantly retrieve all available quality and format options.",
              },
              {
                num: "03",
                title: "Pick your quality & download",
                desc: "Choose 4K, 1080p, 720p, MP4, WebM — and hit Download.",
              },
            ].map((s) => (
              <div key={s.num} className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-white">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold mb-4">
                  {s.num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{s.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="py-12 sm:py-16 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 id="features-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">
            What you get
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-12 text-center">
            Everything you need, nothing you don't.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: "🎞️", title: "Multiple resolutions", desc: "4K, 1080p, 720p, 480p, 360p, and more." },
              { icon: "📼", title: "Multiple formats", desc: "Choose between MP4, WebM, and audio." },
              { icon: "🌐", title: "No software required", desc: "Works entirely in your browser." },
              { icon: "⚡", title: "Fast & reliable", desc: "Direct download links in seconds." },
            ].map((f) => (
              <div key={f.title} className="p-5 sm:p-6 rounded-xl border border-slate-200 bg-white">
                <span className="text-2xl mb-3 block" aria-hidden="true">
                  {f.icon}
                </span>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="formats" aria-labelledby="formats-heading" className="py-12 sm:py-16 border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 id="formats-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">
            Supported formats
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 text-center">
            Works with any public YouTube video.
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {["MP4", "WebM", "4K / 1080p / 720p", "480p / 360p / 240p", "144p", "AV1", "Audio-only"].map((chip) => (
              <span
                key={chip}
                className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-600 font-medium"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="history" aria-labelledby="history-heading" className="py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 id="history-heading" className="text-xl sm:text-2xl font-bold text-slate-900">
              Your downloads
            </h2>
            <button
              onClick={loadHistory}
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              Refresh
            </button>
          </div>
          {history.length === 0 ? (
            <p className="text-center text-slate-500 py-10 sm:py-12 text-sm sm:text-base">
              No downloads yet. Download your first video above!
            </p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4 rounded-xl border border-slate-200 bg-white"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                      {escapeHtml(item.title)}
                    </div>
                    <div className="text-xs text-slate-500 truncate mt-0.5">{item.url}</div>
                    <div className="mt-1.5 text-xs text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
                      {[
                        item.resolution,
                        item.ext ? item.ext.toUpperCase() : null,
                        item.file_size ? formatBytes(item.file_size) : null,
                        new Date(item.created_at * 1000).toLocaleDateString(),
                      ]
                        .filter(Boolean)
                        .map((detail, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5">
                            {idx > 0 && <span>•</span>}
                            {detail}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="py-12 sm:py-16 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 sm:mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {[
              {
                q: "Is it free to download YouTube videos?",
                a: "Yes, completely free. No account, no payment, no download limit.",
              },
              {
                q: "What quality options are available?",
                a: "All available resolutions, typically 144p up to 1080p or 4K depending on the upload.",
              },
              {
                q: "Can I download private or age-restricted videos?",
                a: "No. Only publicly accessible YouTube videos.",
              },
              {
                q: "Is it legal?",
                a: "For personal offline use generally accepted; redistribution or commercial use of copyrighted content may violate copyright law.",
              },
            ].map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-2xl transition z-50 max-w-[90vw] text-center ${
            toast.type === "error" ? "bg-red-600" : "bg-slate-900"
          }`}
          role="alert"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${q.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden transition-colors">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition min-h-[48px]"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="text-sm sm:text-base pr-3">{q}</span>
        <span className={`text-slate-400 transition-transform text-lg shrink-0 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 text-xs sm:text-sm text-slate-500 leading-relaxed" id={id}>
          {a}
        </div>
      )}
    </div>
  );
}
