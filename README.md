# YTDL - Modern YouTube Video & Audio Downloader

<p align="center">
  <img src="public/icon-192.png" alt="YTDL Logo" width="80" height="80" />
</p>

<p align="center">
  A fast, privacy-focused, and modern web application to download YouTube videos, Shorts, audio (MP3/M4A), and full-resolution thumbnails with on-the-fly streaming and smart caching.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

---

## ✨ Features

- 🎥 **High-Definition Video Downloads**: Supports resolutions from 144p up to 1080p, 2K, and 4K (60fps supported).
- 🎬 **Dedicated YouTube Shorts Downloader**: Clean vertical video extraction without watermarks or quality degradation.
- 🎵 **YouTube to MP3 / Audio Extractor**: Extract crisp audio tracks (up to 320kbps) in MP3 and M4A formats.
- 🖼️ **Full-Resolution Thumbnail Grabber**: One-click download of original `maxresdefault` (1080p) cover images.
- ⚡ **Ultra-Fast In-Memory & Disk Caching**: Eliminates redundant metadata extraction by reusing cache for repeat lookups and downloads.
- 🔄 **On-the-Fly Remuxing & Streaming**: Utilizes `yt-dlp` and `ffmpeg` pipelines to stream merged video + audio directly to the browser with accurate real-time progress indicators.
- 📜 **Download History**: Stores user download logs locally using high-performance SQLite (`better-sqlite3`).
- 🔍 **Production-Grade SEO & GEO**:
  - Full Schema.org JSON-LD structured data (`Organization`, `WebSite`, `WebApplication`, `BreadcrumbList`, `FAQPage`).
  - Dynamic XML Sitemaps (`/sitemap.xml`) and Crawler Controls (`/robots.txt`).
  - Server-rendered metadata with canonical URL management.
  - Semantic HTML5 layout and accessibility.
- 📱 **Mobile & Desktop Responsive**: Beautiful modern UI built with Tailwind CSS v4 and fluid interactions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Core Engine**: [`yt-dlp`](https://github.com/yt-dlp/yt-dlp) & [`FFmpeg`](https://ffmpeg.org/)
- **Database**: [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📋 Prerequisites

Make sure the following tools are installed on your server or development environment:

1. **Node.js**: v20+ recommended
2. **yt-dlp**: Latest version installed and available in system `PATH`
   ```bash
   # Linux / macOS
   sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
   sudo chmod a+rx /usr/local/bin/yt-dlp
   ```
3. **FFmpeg**: Required for audio/video stream muxing and fragmented MP4 delivery
   ```bash
   # Ubuntu / Debian
   sudo apt update && sudo apt install -y ffmpeg

   # Arch Linux
   sudo pacman -S ffmpeg

   # macOS
   brew install ffmpeg
   ```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hassanaitoundjar/yt-downloder.git
cd yt-downloder
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (optional)
Create a `.env.local` file in the root directory:
```env
# Optional custom paths if yt-dlp or ffmpeg are not in standard PATH
YTDLP_PATH=yt-dlp
FFMPEG_PATH=ffmpeg
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using the downloader.

### 5. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```text
yt-downloader-nextjs/
├── public/                 # Static assets, icons, manifest, favicon
├── src/
│   ├── app/                # Next.js 16 App Router pages and APIs
│   │   ├── api/
│   │   │   ├── download/   # Streaming remuxing download handler
│   │   │   ├── history/    # SQLite download history API
│   │   │   └── info/       # Video metadata extraction endpoint
│   │   ├── contact/        # Contact & support page
│   │   ├── privacy/        # Privacy policy page
│   │   ├── terms/          # Terms of service page
│   │   ├── youtube-shorts-downloader/     # Dedicated Shorts tool page
│   │   ├── youtube-thumbnail-downloader/  # Thumbnail extractor page
│   │   ├── youtube-to-mp3/                # YouTube to MP3 converter page
│   │   ├── globals.css     # Global styles & Tailwind CSS v4 imports
│   │   ├── layout.tsx      # Root layout with SEO metadata & fonts
│   │   ├── page.tsx        # Homepage
│   │   ├── robots.ts       # Dynamic robots.txt configuration
│   │   └── sitemap.ts      # Dynamic XML sitemap generator
│   ├── components/         # Reusable React components
│   │   ├── Breadcrumbs.tsx     # Semantic navigation breadcrumbs
│   │   ├── Downloader.tsx      # Core interactive downloader UI
│   │   ├── RelatedTools.tsx    # Internal navigation tool cards
│   │   └── StructuredData.tsx  # SSR Schema.org JSON-LD generator
│   └── lib/                # Utility modules
│       ├── db.ts           # SQLite database connection & schema
│       ├── seo-config.ts   # Centralized SEO constants & domain settings
│       ├── utils.ts        # Formatting & URL parsing helpers
│       └── yt-dlp.ts       # yt-dlp wrapper with caching & error handling
├── next.config.ts          # Next.js configuration
├── package.json            # Scripts & dependencies
└── tsconfig.json           # TypeScript configuration
```

---

## ⚡ Performance & Architecture Highlights

1. **Smart Cache System**:
   - First video inquiry fetches metadata and caches the raw yt-dlp JSON in `/tmp/ytdl-info-cache/` for 20 minutes.
   - Subsequent calls for the same URL execute in **< 15ms**, preventing redundant connections to YouTube.
2. **Direct Pipe Streaming**:
   - Downloads do not buffer large multi-gigabyte video files onto server disks.
   - Video and audio streams are piped through `ffmpeg` directly into an HTTP response stream, minimizing memory footprint and disk I/O.
3. **No Watermarks & Original Audio**:
   - High-resolution streams (720p, 1080p, 4K) are merged with the highest-fidelity M4A/AAC stereo track available.

---

## ⚖️ Legal Disclaimer

This project is intended for personal backup, research, and fair-use purposes. Please respect content creators' intellectual property rights and YouTube's Terms of Service. Do not distribute or monetize copyrighted content without explicit permission from the rights holder.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
