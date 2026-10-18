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
