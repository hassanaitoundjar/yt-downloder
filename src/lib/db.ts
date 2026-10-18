import Database from "better-sqlite3";
import path from "node:path";

export const db = new Database(path.join(process.cwd(), "database", "downloads.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    url TEXT,
    format_id TEXT,
    resolution TEXT,
    ext TEXT,
    file_size INTEGER,
    created_at INTEGER
  )
`);

export type DownloadRow = {
  id: number;
  title: string;
  url: string;
  format_id: string | null;
  resolution: string | null;
  ext: string | null;
  file_size: number | null;
  created_at: number;
};
