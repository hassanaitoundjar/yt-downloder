import { NextResponse } from "next/server";
import { extractInfo, isTikTokUrl } from "@/lib/yt-dlp";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }
  if (!isTikTokUrl(url)) {
    return NextResponse.json(
      { error: "Please enter a valid TikTok video URL" },
      { status: 400 },
    );
  }

  try {
    const info = await extractInfo(url);
    return NextResponse.json(info);
  } catch (err: any) {
    let message = "Failed to fetch TikTok video information.";
    const m = String(err?.message ?? "");
    if (m.includes("Video unavailable")) message = "This TikTok video is unavailable or private.";
    else if (m.includes("join this")) message = "This video is members-only.";
    else if (m.includes("age")) message = "This video is age-restricted.";
    else if (m.includes("blocked") || m.includes("empty media")) {
      message = "This TikTok video requires authentication or is region-blocked.";
    }
    return NextResponse.json({ error: message, detail: m }, { status: 422 });
  }
}
