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
    <div className="min-h-screen bg-white text-slate-900">
      <nav aria-label="Main navigation" className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2" aria-label="YTDL Home">
                <span className="font-extrabold text-xl tracking-tight">YTDL<span className="text-red-600">.</span></span>
              </a>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
              <a href="#how-it-works" className="hover:text-slate-900 transition">How it works</a>
              <a href="#features" className="hover:text-slate-900 transition">Features</a>
              <a href="#formats" className="hover:text-slate-900 transition">Supported formats</a>
              <a href="#faq" className="hover:text-slate-900 transition">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={loadHistory} className="text-sm font-medium text-slate-500 hover:text-slate-900" aria-label="View download history">
                History
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section aria-labelledby="hero-heading" className="bg-slate-50 border-b border-slate-200 py-16 lg:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1">
            {badge}
          </span>
          <h1 id="hero-heading" className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            {description}
          </p>

          <form onSubmit={fetchInfo} className="mt-8 max-w-2xl mx-auto" aria-label="YouTube video URL input">
            <div className="flex gap-3">
              <label htmlFor="urlInput" className="sr-only">YouTube video URL</label>
              <input
                id="urlInput"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste YouTube video link..."
                spellCheck={false}
                autoComplete="off"
                className="flex-1 px-5 py-3.5 text-base text-slate-900 border border-slate-300 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white placeholder:text-slate-400"
                disabled={loading}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 text-base font-semibold bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:translate-y-[-1px] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Fetching..." : "Download Now"}
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">Supports youtube.com, youtu.be, and YouTube Shorts</p>
          </form>

          <div className="mt-10 text-xs text-slate-400 flex gap-6 justify-center">
            <span><strong className="text-slate-700">4K</strong> &bull; <strong className="text-slate-700">1080p</strong> &bull; <strong className="text-slate-700">720p</strong></span>
            <span><strong className="text-slate-700">MP4</strong> &bull; <strong className="text-slate-700">WebM</strong> &bull; <strong className="text-slate-700">Audio</strong></span>
          </div>
        </div>
      </section>

      {info && (
        <section id="results" aria-labelledby="results-heading" className="py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 id="results-heading" className="sr-only">
              Download results for {info.title}
            </h2>
            <div className="flex items-start gap-6 md:gap-8 mb-8">
              <img
                src={info.thumbnail || ""}
                alt={info.title ? `Thumbnail for ${info.title}` : ""}
                className="w-40 h-24 md:w-64 md:h-36 rounded-xl object-cover bg-slate-100"
                loading="lazy"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-900">{info.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {[info.duration ? formatDuration(info.duration) : null, info.uploader, info.view_count ? `${info.view_count} views` : null]
                    .filter(Boolean)
                    .join("  •  ")}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                {info.thumbnail && (
                  <a
                    href={info.thumbnail}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`thumbnail-${info.id}.jpg`}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Save Thumbnail
                  </a>
                )}
                <button
                  onClick={() => {
                    setInfo(null);
                    setUrl("");
                  }}
                  className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
                >
                  Change URL
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2">
              <button
                onClick={() => setActiveKind("video")}
                className={activeKind === "video" ? "px-5 py-2 text-sm font-semibold border-b-2 border-red-600 text-red-600 transition" : "px-5 py-2 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition"}
                aria-pressed={activeKind === "video"}
              >
                Video
              </button>
              <button
                onClick={() => setActiveKind("audio")}
                className={activeKind === "audio" ? "px-5 py-2 text-sm font-semibold border-b-2 border-red-600 text-red-600 transition" : "px-5 py-2 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 transition"}
                aria-pressed={activeKind === "audio"}
              >
                Audio (MP3)
              </button>
            </div>

            {formats && formats.length === 0 && (
              <p className="text-center text-slate-500 py-12">No downloadable formats found for this video.</p>
            )}

            {formats && formats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {formats.map((f) => {
                  const isAudio = !f.hasVideo;
                  const recommended = f === formats[0];
                  return (
                    <article
                      key={f.format_id}
                      className={recommended ? "border rounded-xl p-5 bg-white transition hover:shadow-md hover:-translate-y-1 border-red-600 bg-red-50" : "border rounded-xl p-5 bg-white transition hover:shadow-md hover:-translate-y-1 border-slate-200"}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={recommended ? "text-xs font-bold px-2 py-1 rounded bg-red-600 text-white" : "text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600"}>
                          {isAudio ? "AUDIO" : f.resolution}
                        </span>
                        <span className="text-xs text-slate-500">
                          {f.ext.toUpperCase()}{!isAudio && f.fps ? ` • ${f.fps}fps` : ""}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500 mb-3">
                        {formatBytes(f.filesize)}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          disabled={downloading === f.format_id}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(e.currentTarget, f);
                          }}
                          className={downloading === f.format_id ? "w-full py-2.5 rounded-lg font-semibold bg-slate-300 text-slate-500 cursor-not-allowed" : "w-full py-2.5 rounded-lg font-semibold bg-slate-900 text-white hover:bg-slate-800 active:translate-y-[-1px] transition"}
                        >
                          {downloading === f.format_id ? `Downloading ${downloadProgress}%` : `Download ${isAudio ? "Audio" : f.resolution}`}
                        </button>
                        {downloading === f.format_id && (
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 transition-all duration-100" style={{ width: `${downloadProgress}%` }} aria-label="Download progress" />
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

      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-16 border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 id="how-it-works-heading" className="text-2xl font-bold text-slate-900 mb-2">
            From URL to download in seconds
          </h2>
          <p className="text-slate-500 mb-10">Paste, fetch, pick your quality.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Paste the URL", desc: "Copy the YouTube video link from your browser or app and paste it above." },
              { num: "02", title: "Fetch download links", desc: "We instantly retrieve all available quality and format options." },
              { num: "03", title: "Pick your quality & download", desc: "Choose 4K, 1080p, 720p, MP4, WebM — and hit Download." },
            ].map((s) => (
              <div key={s.num} className="p-6 rounded-xl border border-slate-200 bg-white">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold mb-4">
                  {s.num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="py-16 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 id="features-heading" className="text-2xl font-bold text-slate-900 mb-2 text-center">
            What you get
          </h2>
          <p className="text-slate-500 mb-12 text-center">Everything you need, nothing you don't.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "🎞️", title: "Multiple resolutions", desc: "4K, 1080p, 720p, 480p, 360p, and more." },
              { icon: "📼", title: "Multiple formats", desc: "Choose between MP4, WebM, and audio." },
              { icon: "🌐", title: "No software required", desc: "Works entirely in your browser." },
              { icon: "⚡", title: "Fast & reliable", desc: "Direct download links in seconds." },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-xl border border-slate-200 bg-white">
                <span className="text-2xl mb-3 block" aria-hidden="true">{f.icon}</span>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="formats" aria-labelledby="formats-heading" className="py-16 border-b border-slate-200 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 id="formats-heading" className="text-2xl font-bold text-slate-900 mb-2 text-center">
            Supported formats
          </h2>
          <p className="text-slate-500 mb-8 text-center">Works with any public YouTube video.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["MP4", "WebM", "4K / 1080p / 720p", "480p / 360p / 240p", "144p", "AV1", "Audio-only"].map((chip) => (
              <span key={chip} className="px-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm text-slate-500 font-medium">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="history" aria-labelledby="history-heading" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 id="history-heading" className="text-2xl font-bold text-slate-900">
              Your downloads
            </h2>
            <button onClick={loadHistory} className="text-sm font-medium text-slate-500 hover:text-slate-900">
              Refresh
            </button>
          </div>
          {history.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No downloads yet. Download your first video above!</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-900 truncate">{escapeHtml(item.title)}</div>
                    <div className="text-xs text-slate-500 truncate">{item.url}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      {[item.resolution, item.ext ? item.ext.toUpperCase() : null, item.file_size ? formatBytes(item.file_size) : null, new Date(item.created_at * 1000).toLocaleDateString()].filter(Boolean).join("  •  ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="py-16 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {[
              { q: "Is it free to download YouTube videos?", a: "Yes, completely free. No account, no payment, no download limit." },
              { q: "What quality options are available?", a: "All available resolutions, typically 144p up to 1080p or 4K depending on the upload." },
              { q: "Can I download private or age-restricted videos?", a: "No. Only publicly accessible YouTube videos." },
              { q: "Is it legal?", a: "For personal offline use generally accepted; redistribution or commercial use of copyrighted content may violate copyright law." },
            ].map(({ q, a }) => (
              <FAQItem key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-900 text-slate-400 py-10 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="font-bold text-white mb-2">YTDL<span className="text-red-600">.</span> YouTube Video Downloader</div>
          <p className="text-xs">© 2026 YTDL. All rights reserved.</p>
          <div className="mt-4 flex justify-center gap-6 text-xs">
            <a href="/privacy" className="hover:text-white transition">Privacy</a>
            <a href="/terms" className="hover:text-white transition">Terms</a>
            <a href="/contact" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>

      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg text-sm font-medium text-white shadow-xl transition ${toast.type === "error" ? "bg-red-600" : "bg-slate-900"}`}
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
    <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-slate-900 hover:bg-slate-50 transition"
        aria-expanded={open}
        aria-controls={id}
      >
        <span>{q}</span>
        <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-500" id={id}>
          {a}
        </div>
      )}
    </div>
  );
}
