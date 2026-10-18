const YOUTUBE_REGEX =
  /^(https?\:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)[A-Za-z0-9_-]{11}(\S*)$/;

export function isYouTubeUrl(url: string): boolean {
  return YOUTUBE_REGEX.test(url);
}

/** Extracts the 11-character video ID from any supported YouTube URL form. */
export function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

const TIKTOK_REGEX =
  /^(https?\:\/\/)?(www\.)?(tiktok\.com\/(@[A-Za-z0-9_.-]+\/video\/[0-9]+|t\/[A-Za-z0-9_-]+|v\/[0-9]+|embed\/[0-9]+)|vm\.tiktok\.com\/[A-Za-z0-9_-]+|vt\.tiktok\.com\/[A-Za-z0-9_-]+)(\S*)$/;

export function isTikTokUrl(url: string): boolean {
  return TIKTOK_REGEX.test(url);
}

/** Extracts the TikTok video ID from any supported TikTok URL form. */
export function getTikTokId(url: string): string | null {
  const m = url.match(
    /tiktok\.com\/(?:@[A-Za-z0-9_.-]+\/video\/|t\/|v\/|embed\/)([0-9]+[A-Za-z0-9_-]*)|vm\.tiktok\.com\/([A-Za-z0-9_-]+)|vt\.tiktok\.com\/([A-Za-z0-9_-]+)/,
  );
  return m ? (m[1] ?? m[2] ?? m[3] ?? null) : null;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "Unknown size";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(sec: number | null): string {
  if (!sec) return "Unknown";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  return h
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}
