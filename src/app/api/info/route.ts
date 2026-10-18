import { NextResponse } from "next/server";
import { extractInfo, isYouTubeUrl } from "@/lib/yt-dlp";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }
  if (!isYouTubeUrl(url)) {
    return NextResponse.json(
      { error: "Please enter a valid YouTube video URL" },
      { status: 400 },
    );
  }

  try {
    const info = await extractInfo(url);
    return NextResponse.json(info);
  } catch (err: any) {
    let message = "Failed to fetch video information.";
    const m = String(err?.message ?? "");
    if (m.includes("Video unavailable")) message = "This video is unavailable or private.";
    else if (m.includes("join this")) message = "This video is members-only.";
    else if (m.includes("age")) message = "This video is age-restricted.";
    return NextResponse.json({ error: message, detail: m }, { status: 422 });
  }
}
