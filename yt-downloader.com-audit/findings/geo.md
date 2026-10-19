# Generative Engine Optimization (GEO) & AI Search Audit

**Domain**: `https://yt-downloader.com`  
**Score**: `82/100`  
**Status**: Good / Ready for High-Impact Wins

---

## 1. Information Architecture & LLM Extraction Readiness
- **Dense, Extractable Answers**: FAQ sections and step-by-step instructions use direct, declarative language without fluff, making them ideal for citation by ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews.
- **HTML5 Semantic Hierarchy**: Clean semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) ensures LLM web parsers can cleanly isolate core tool content from navigation.

---

## 2. Priority Enhancements for AI Search Discovery
1. **Deploy `/llms.txt` and `/llms-full.txt`**:
   - Provide a standardized Markdown file in `public/llms.txt` explaining the service, supported resolutions (4K, 1080p, 720p, MP4, WebM, MP3), and direct links to each tool.
2. **Explicit AI Bot Directives in `robots.txt`**:
   - Explicitly permit `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Applebot-Extended` to crawl public pages.
3. **Factual Authority Quotations**:
   - Include specific format capabilities (e.g. `H.264`, `AV1`, `AAC 128kbps/320kbps`, `1080x1920 9:16 Shorts format`) to capture technical AI queries.
