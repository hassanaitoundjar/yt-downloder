import { NextResponse } from "next/server";
import { spawn, type ChildProcess } from "node:child_process";
import { getVideoInfo, isYouTubeUrl } from "@/lib/yt-dlp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const YTDLP = process.env.YTDLP_PATH || "yt-dlp";
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
/** Hard cap so abandoned downloads never leave processes running. */
const MAX_DOWNLOAD_MS = 30 * 60 * 1000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const formatId = searchParams.get("f");

  if (!url || !formatId) {
    return NextResponse.json({ error: "Missing url or format parameter" }, { status: 400 });
  }
  if (!isYouTubeUrl(url)) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  let cached;
  try {
    // Usually a cache hit from the earlier /api/info call, so this returns instantly.
    cached = await getVideoInfo(url);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Download failed" }, { status: 422 });
  }

  const { info, infoJsonPath, bestM4aAudioId, muxedFormatIds } = cached;
  const format = [...info.formats.video, ...info.formats.audio].find(
    (f) => f.format_id === formatId,
  );
  if (!format) {
    return NextResponse.json({ error: "Unknown format for this video" }, { status: 400 });
  }

  // Video-only streams (most formats above 360p) need the audio track merged in.
  const needsMerge =
    format.hasVideo && bestM4aAudioId !== null && !muxedFormatIds.has(format.format_id);
  const selector = needsMerge ? `${format.format_id}+${bestM4aAudioId}` : format.format_id;
  const ext = needsMerge ? "mp4" : format.ext;

  const safeTitle =
    (info.title || "video").replace(/[^a-z0-9]+/gi, "-").replace(/-+/g, "-").slice(0, 80) ||
    "video";

  const headers = new Headers({
    "Content-Disposition": `attachment; filename="${safeTitle}.${ext}"`,
    "Content-Type": ext === "mp4" ? "video/mp4" : "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  // Exact length is unknown after remuxing; expose the estimate so the UI can show progress.
  if (format.filesize) headers.set("X-Expected-Size", String(format.filesize));

  const procs: ChildProcess[] = [];
  const killAll = () => procs.forEach((p) => p.kill("SIGKILL"));

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let started = false;
      let finished = false;
      let stderr = "";

      const finish = (err?: Error) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (err && !started) controller.error(err);
        else controller.close();
        killAll();
      };

      const ytdlp = spawn(YTDLP, [
        // Reuse the already-extracted info: no second round-trip to YouTube.
        "--load-info-json", infoJsonPath,
        "--no-warnings",
        "--quiet",
        "--no-part",
        "--concurrent-fragments", "4",
        "-f", selector,
        "-o", "-",
      ]);
      procs.push(ytdlp);
      ytdlp.stderr?.on("data", (d: Buffer) => (stderr += d.toString()));
      ytdlp.on("error", (e) => finish(e));

      let output = ytdlp.stdout!;

      if (needsMerge) {
        // yt-dlp pipes merged streams as MPEG-TS; remux (no re-encode) into
        // fragmented MP4 so the file can be streamed and opens as a normal .mp4.
        const ff = spawn(FFMPEG, [
          "-v", "error",
          "-i", "pipe:0",
          "-c", "copy",
          "-bsf:a", "aac_adtstoasc",
          "-movflags", "frag_keyframe+empty_moov+default_base_moof",
          "-f", "mp4",
          "pipe:1",
        ]);
        procs.push(ff);
        ytdlp.stdout!.pipe(ff.stdin!);
        ff.stdin!.on("error", () => {});
        ff.stderr?.on("data", (d: Buffer) => (stderr += d.toString()));
        ff.on("error", (e) => finish(e));
        output = ff.stdout!;
      }

      output.on("data", (chunk: Buffer) => {
        if (finished) return;
        started = true;
        try {
          controller.enqueue(new Uint8Array(chunk));
        } catch {
          finish();
        }
      });
      output.on("end", () =>
        finish(started ? undefined : new Error(stderr.trim() || "Download failed")),
      );

      const timer = setTimeout(() => finish(new Error("Download timed out")), MAX_DOWNLOAD_MS);
    },
    cancel() {
      // Browser aborted / tab closed: stop pulling from YouTube.
      killAll();
    },
  });

  return new Response(stream, { headers, status: 200 });
}
