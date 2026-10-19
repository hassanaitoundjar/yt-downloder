# SEO Action Plan: Prioritized Implementation

**Target Website**: `https://yt-downloader.com`  
**Current Health Score**: `91/100` (Grade: A-)

---

## Priority 1: Critical (Immediate - Next 24-48 Hours)
*No blocking critical penalties or indexing blockers were discovered.*

---

## Priority 2: High Impact (Week 1)

### 1. Deploy `/llms.txt` and `/llms-full.txt`
- **Why**: AI-driven engines (ChatGPT Search, Perplexity, Claude, Gemini) actively index `/llms.txt` to cite tool capabilities and link back to tools.
- **Action**: Add `public/llms.txt` with a concise markdown manifest of YTDL tools and capabilities.

### 2. Configure HTTP Security Headers
- **Why**: Search engines favor secure origin delivery and protection against clickjacking.
- **Action**: Add standard headers in `next.config.ts` (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).

### 3. Add CDN Preconnect for Dynamic Thumbnails
- **Why**: Improves Largest Contentful Paint (LCP) when user fetches video info.
- **Action**: Add `<link rel="preconnect" href="https://i.ytimg.com" />` in `src/app/layout.tsx`.

---

## Priority 3: Medium Impact (Weeks 2-3)

### 4. Implement HowTo Structured Data
- **Why**: Qualifies the site for Google HowTo rich snippets in search results.
- **Action**: Add `HowTo` schema to `src/components/StructuredData.tsx` outlining the 3-step download process.

### 5. Add Explicit AI User-Agents to `robots.txt`
- **Why**: Signals greenlight for LLM web search indexing without ambiguity.
- **Action**: Update `src/app/robots.ts` with explicit allow rules for `GPTBot`, `ClaudeBot`, `PerplexityBot`.

### 6. Deepen Homepage Content with Format Comparison Matrix
- **Why**: Targets high-volume queries like "MP4 vs WebM YouTube downloader" and "best YouTube audio bitrate".
- **Action**: Add an educational format breakdown table on the homepage.

---

## Priority 4: Low Impact / Ongoing Maintenance

### 7. Modern 1200x630 OpenGraph Banner
- **Why**: Enhances social CTR on Twitter, Telegram, WhatsApp, and Reddit shares.
- **Action**: Replace default `og-image.png` with a high-contrast 1200x630 graphics asset.

### 8. Setup IndexNow API Integration
- **Why**: Instant notifications to Bing and Yandex when new pages or tools are published.
- **Action**: Place IndexNow API key in `public/` and create submission ping.
