import { spawn } from "node:child_process";
import { mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { isYouTubeUrl, getYouTubeId } from "./utils";

export { isYouTubeUrl };

const YTDLP = process.env.YTDLP_PATH || "yt-dlp";

/** How long a fetched result is reused. YouTube's signed stream URLs stay valid for hours. */
const CACHE_TTL_MS = 20 * 60 * 1000;
/** Abort an extraction attempt that takes longer than this. */
const EXTRACT_TIMEOUT_MS = 30 * 1000;
const CACHE_DIR = path.join(os.tmpdir(), "ytdl-info-cache");

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  uploader: string | null;
  view_count: number | null;
  formats: {
    video: FormatEntry[];
    audio: FormatEntry[];
  };
}

export interface FormatEntry {
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
}

export interface CachedInfo {
  info: VideoInfo;
  /** Path to the raw yt-dlp JSON, reused via --load-info-json so downloads skip re-extraction. */
  infoJsonPath: string;
  /** Best M4A audio track, merged into video-only MP4 formats. */
  bestM4aAudioId: string | null;
  /** Formats that already contain both video and audio (no merge needed). */
  muxedFormatIds: Set<string>;
}

type CacheEntry = { expires: number; value: CachedInfo };

// Survive Next.js dev hot-reloads by parking the cache on globalThis.
const g = globalThis as unknown as {
  __ytInfoCache?: Map<string, CacheEntry>;
  __ytInflight?: Map<string, Promise<CachedInfo>>;
};
const cache = (g.__ytInfoCache ??= new Map());
const inflight = (g.__ytInflight ??= new Map());

/**
 * Returns video info, reusing a cached result when available and sharing one
 * extraction between concurrent requests for the same video.
 */
export async function getVideoInfo(url: string): Promise<CachedInfo> {
  const key = getYouTubeId(url) ?? url;

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  if (hit) {
    cache.delete(key);
    rm(hit.value.infoJsonPath, { force: true }).catch(() => { });
  }

  const pending = inflight.get(key);
  if (pending) return pending;

  const p = (async () => {
    const raw = await extractRaw(url);
    await mkdir(CACHE_DIR, { recursive: true });
    const infoJsonPath = path.join(CACHE_DIR, `${raw.id || key}.json`);
    await writeFile(infoJsonPath, JSON.stringify(raw));
    const value: CachedInfo = {
      info: normalize(raw),
      infoJsonPath,
      bestM4aAudioId: pickBestAudio(raw.formats || [], "m4a")?.format_id ?? null,
      muxedFormatIds: new Set(
        (raw.formats || [])
          .filter((f: any) => f.vcodec && f.vcodec !== "none" && f.acodec && f.acodec !== "none")
          .map((f: any) => String(f.format_id)),
      ),
    };
    cache.set(key, { expires: Date.now() + CACHE_TTL_MS, value });
    return value;
  })().finally(() => inflight.delete(key));

  inflight.set(key, p);
  return p;
}

/** Backwards-compatible helper used by /api/info. */
export async function extractInfo(url: string): Promise<VideoInfo> {
  return (await getVideoInfo(url)).info;
}

function runExtract(url: string, extraArgs: string[]): Promise<any> {
  return new Promise((resolve, reject) => {
    const args = [
      "--dump-json",
      "--no-playlist",
      "--no-warnings",
      "--no-check-certificates",
      ...extraArgs,
      url,
    ];
    const proc = spawn(YTDLP, args);
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      proc.kill("SIGKILL");
      reject(new Error("Timed out while contacting YouTube. Please try again."));
    }, EXTRACT_TIMEOUT_MS);

    proc.stdout?.on("data", (d: Buffer) => (stdout += d.toString()));
    proc.stderr?.on("data", (d: Buffer) => (stderr += d.toString()));
    proc.on("close", (code: number | null) => {
      clearTimeout(timer);
      if (code !== 0 || !stdout.trim()) {
        reject(new Error(stderr.trim() || `yt-dlp exited with code ${code}`));
        return;
      }
      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error("Failed to parse yt-dlp output"));
      }
    });
    proc.on("error", (err: Error) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function extractRaw(url: string): Promise<any> {
  // `embedded` returns the full HD format list; `android` only returns a single 360p
  // stream, so it is kept purely as a fallback. Skipping HLS removes manifests we never use.
  const attempts = [
    ["--extractor-args", "youtube:player_client=embedded;skip=hls"],
    ["--extractor-args", "youtube:player_client=android"],
  ];
  let lastErr: Error | null = null;
  for (const extra of attempts) {
    try {
      return await runExtract(url, extra);
    } catch (err) {
      lastErr = err as Error;
      const msg = String((err as Error).message ?? "");
      if (!msg.includes("bot") && !msg.includes("Sign in") && !msg.includes("auth")) {
        throw err;
      }
    }
  }
  throw lastErr || new Error("Failed to extract video information");
}

const sizeOf = (f: any): number => f?.filesize || f?.filesize_approx || 0;

/**
 * Some videos expose several copies of each audio track (e.g. "140-0" … "140-7" for
 * dubbed languages). Prefer the original-language track, then the highest bitrate.
 * Falls back to any audio codec if the preferred ext is unavailable.
 */
function pickBestAudio(formats: any[], ext?: string): any | null {
  const prefer = formats.filter(
    (f) =>
      f.vcodec === "none" &&
      f.acodec &&
      f.acodec !== "none" &&
      (!ext || f.ext === ext),
  );
  const anyAudio = formats.filter(
    (f) => f.vcodec === "none" && f.acodec && f.acodec !== "none",
  );
  const pool = prefer.length ? prefer : anyAudio;
  pool.sort(
    (a, b) =>
      (b.language_preference ?? -1) - (a.language_preference ?? -1) ||
      (b.abr || b.tbr || 0) - (a.abr || a.tbr || 0),
  );
  return pool[0] ?? null;
}

/** Lower is better: H.264 MP4 plays everywhere, then other MP4 codecs, then WebM. */
function compatRank(f: any): number {
  if (f.ext === "mp4" && String(f.vcodec).startsWith("avc1")) return 0;
  if (f.ext === "mp4") return 1;
  return 2;
}

function normalize(raw: any): VideoInfo {
  const formats = (raw.formats || []).filter((f: any) => f.ext && f.format_id);
  const bestM4a = pickBestAudio(formats, "m4a");

  const byRes = new Map<number, any>();
  for (const f of formats) {
    if (!f.vcodec || f.vcodec === "none" || !f.height) continue;
    const cur = byRes.get(f.height);
    if (
      !cur ||
      compatRank(f) < compatRank(cur) ||
      (compatRank(f) === compatRank(cur) && (f.tbr || 0) > (cur.tbr || 0))
    ) {
      byRes.set(f.height, f);
    }
  }

  const video: FormatEntry[] = [...byRes.values()]
    .sort((a, b) => b.height - a.height)
    .map((f) => {
      const hasAudio = !!f.acodec && f.acodec !== "none";
      // Video-only streams are merged with audio on download, so show the combined size.
      const filesize = sizeOf(f) + (hasAudio ? 0 : sizeOf(bestM4a));
      return {
        format_id: f.format_id,
        ext: hasAudio ? f.ext : "mp4",
        resolution: `${f.height}p`,
        height: f.height,
        fps: f.fps || 0,
        vcodec: f.vcodec,
        acodec: hasAudio ? f.acodec : bestM4a?.acodec ?? "none",
        filesize: sizeOf(f) ? filesize : 0,
        tbr: f.tbr || 0,
        // Every listed video format ends up with sound (natively or merged).
        hasAudio: hasAudio || !!bestM4a,
        hasVideo: true,
      };
    });

  // One entry per audio stream family (drop the "-1"… language duplicates).
  const seen = new Set<string>();
  const audio: FormatEntry[] = formats
    .filter((f: any) => f.vcodec === "none" && f.acodec && f.acodec !== "none")
    .sort(
      (a: any, b: any) =>
        (b.language_preference ?? -1) - (a.language_preference ?? -1) ||
        (b.abr || b.tbr || 0) - (a.abr || a.tbr || 0),
    )
    .filter((f: any) => {
      const base = String(f.format_id).split("-")[0];
      if (seen.has(base)) return false;
      seen.add(base);
      return true;
    })
    .sort((a: any, b: any) => (b.abr || b.tbr || 0) - (a.abr || a.tbr || 0))
    .slice(0, 3)
    .map((f: any) => ({
      format_id: f.format_id,
      ext: f.ext,
      resolution: "Audio",
      height: 0,
      fps: 0,
      vcodec: "none",
      acodec: f.acodec,
      filesize: sizeOf(f),
      tbr: f.abr || f.tbr || 0,
      hasAudio: true,
      hasVideo: false,
    }));

  return {
    id: raw.id,
    title: raw.title || "YouTube Video",
    thumbnail: raw.thumbnail ?? null,
    duration: raw.duration ?? null,
    uploader: raw.uploader ?? null,
    view_count: raw.view_count ?? null,
    formats: { video, audio },
  };
}
