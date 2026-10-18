import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = db
    .prepare(
      "SELECT * FROM downloads ORDER BY created_at DESC LIMIT 50",
    )
    .all() as Array<{
      id: number;
      title: string;
      url: string;
      format_id: string | null;
      resolution: string | null;
      ext: string | null;
      file_size: number | null;
      created_at: number;
    }>;
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, url, format_id, resolution, ext, file_size } = body;

  if (!title || !url) {
    return NextResponse.json({ error: "title and url are required" }, { status: 400 });
  }

  try {
    const now = Math.floor(Date.now() / 1000);
    const info = db
      .prepare(
        "INSERT INTO downloads (title, url, format_id, resolution, ext, file_size, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      )
      .run(title, url, format_id ?? null, resolution ?? null, ext ?? null, file_size ?? null, now);
    return NextResponse.json({ id: info.lastInsertRowid as number });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
