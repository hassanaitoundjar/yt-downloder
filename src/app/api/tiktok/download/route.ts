import { NextResponse } from "next/server";
import { spawn, type ChildProcess } from "node:child_process";
import { getVideoInfo, isTikTokUrl } from "@/lib/yt-dlp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const YTDLP = process.env.YTDLP_PATH || "yt-dlp";
const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const MAX_DOWNLOAD_MS = 30 * 60 * 1000;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const formatId = searchParams.get("f");

  if (!url || !formatId) {
    return NextResponse.json(
      { error: "Missing url or format parameter" },
      { status: 400 },
    );
  }
  if (!isTikTokUrl(url)) {
    return NextResponse.json({ error: "Invalid TikTok URL" }, { status: 400 });
  }

  let cached;
  try {
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

  const needsMerge =
    format.hasVideo && bestM4aAudioId !== null && !muxedFormatIds.has(format.format_id);
  const selector = needsMerge ? `${format.format_id}+${bestM4aAudioId}` : format.format_id;
  const ext = needsMerge ? "mp4" : format.ext;

  const safeTitle =
    (info.title || "tiktok-video").replace(/[^a-z0-9]+/gi, "-").replace(/-+/g, "-").slice(0, 80) ||
    "tiktok-video";

  const headers = new Headers({
    "Content-Disposition": `attachment; filename="${safeTitle}.${ext}"`,
    "Content-Type": ext === "mp4" ? "video/mp4" : "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
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
      killAll();
    },
  });

  return new Response(stream, { headers, status: 200 });
}
