You are a senior full-stack engineer. Build a complete political news website called "The Tribune" using Next.js 14 App Router + Payload CMS 2.x + PostgreSQL + Tailwind CSS.

═══════════════════════════════════════════
TECH STACK
═══════════════════════════════════════════

- Next.js 14 (App Router, TypeScript)
- Payload CMS 2.x (embedded admin at /admin)
- PostgreSQL via @payloadcms/db-postgres
- Tailwind CSS v3
- Framer Motion (page transitions, animations)
- next/font (Playfair Display, Source Serif 4, IBM Plex Mono)
- next/image (all images)
- Cloudinary via @payloadcms/plugin-cloud-storage
- @payloadcms/richtext-lexical (article editor)
- @payloadcms/plugin-seo
- date-fns (date formatting)
- slugify (auto slug generation)
- clsx + tailwind-merge

═══════════════════════════════════════════
DESIGN SYSTEM
═══════════════════════════════════════════

Define these CSS variables in globals.css:

--bg-primary: #0d1117
--bg-surface: #161b22
--bg-card: #1c2128
--bg-hover: #21262d
--text-primary: #f5f0e8
--text-secondary: #c9c3b8
--text-muted: #8b949e
--accent-gold: #c9a84c
--accent-gold-dim: #c9a84c20
--accent-red: #c0392b
--accent-red-bright: #e74c3c
--border: #30363d
--border-subtle: #21262d

Typography:
- Headlines/Display: Playfair Display (Bold, Italic for pull quotes)
- Body/Article: Source Serif 4 (18px, line-height 1.85)
- UI/Tags/Meta: IBM Plex Mono (uppercase, 11px, letter-spacing 0.08em)

Category colors:
- Elections: #e74c3c
- Parliament: #3498db
- International: #9b59b6
- Policy & Law: #e67e22
- Defense: #2ecc71
- Opinion: #c9a84c
- Data: #1abc9c
- Interviews: #e91e63

═══════════════════════════════════════════
PAYLOAD CMS — COLLECTIONS
═══════════════════════════════════════════

1. ARTICLES collection (slug: 'articles'):
Fields:
  - title: text, required
  - slug: text, unique, auto-generated from title using slugify, admin position: sidebar
  - excerpt: textarea, maxLength 160, required
  - content: richText (Lexical editor)
  - coverImage: upload, relationTo: 'media', required
  - category: relationship, relationTo: 'categories', admin position: sidebar
  - author: relationship, relationTo: 'authors', admin position: sidebar
  - tags: array of { tag: text }
  - status: select ['draft', 'published', 'archived'], default: 'draft', admin position: sidebar
  - isBreaking: checkbox, default false, admin position: sidebar
  - isFeatured: checkbox, default false, admin position: sidebar
  - publishedAt: date, admin position: sidebar
  - readTime: number (minutes), admin position: sidebar
  - seo: group { metaTitle: text, metaDescription: textarea, ogImage: upload }

Access control:
  - read: public if status === 'published'
  - create: authenticated users
  - update: admin or editor or (writer and own article)
  - delete: admin only

Hooks:
  - beforeChange: auto-generate slug from title if empty
  - beforeChange: auto-calculate readTime from content word count

2. CATEGORIES collection (slug: 'categories'):
Fields:
  - name: text, required
  - slug: text, unique
  - description: textarea
  - color: text (hex), default '#c9a84c'
  - icon: text (emoji)
  - articleCount: virtual field

Seed with:
  { name: 'Elections', slug: 'elections', color: '#e74c3c', icon: '🗳️' }
  { name: 'Parliament', slug: 'parliament', color: '#3498db', icon: '🏛️' }
  { name: 'International', slug: 'international', color: '#9b59b6', icon: '🌍' }
  { name: 'Policy & Law', slug: 'policy', color: '#e67e22', icon: '⚖️' }
  { name: 'Defense', slug: 'defense', color: '#2ecc71', icon: '🪖' }
  { name: 'Opinion', slug: 'opinion', color: '#c9a84c', icon: '💬' }
  { name: 'Data & Analysis', slug: 'data', color: '#1abc9c', icon: '📊' }
  { name: 'Interviews', slug: 'interviews', color: '#e91e63', icon: '🎙️' }

3. AUTHORS collection (slug: 'authors'):
Fields:
  - name: text, required
  - slug: text, unique
  - bio: textarea
  - avatar: upload, relationTo: 'media'
  - role: text (e.g. "Senior Political Correspondent")
  - twitter: text
  - email: email

4. MEDIA collection (slug: 'media'):
  - Built-in Payload upload collection
  - Store on Cloudinary via plugin
  - Alt text field required
  - Caption field optional

5. USERS collection (slug: 'users'):
Fields:
  - email, password (built-in)
  - name: text
  - role: select ['admin', 'editor', 'writer'], default: 'writer'
  - avatar: upload

Access control by role:
  - admin: full access to everything
  - editor: read/create/update all articles and media, cannot delete users
  - writer: create own articles, update own articles only, read all

═══════════════════════════════════════════
FILE STRUCTURE
═══════════════════════════════════════════

the-tribune/
├── payload.config.ts
├── next.config.js
├── tailwind.config.ts
├── .env.local.example
├── src/
│   ├── app/
│   │   ├── (frontend)/
│   │   │   ├── layout.tsx          ← public layout (Header + Footer)
│   │   │   ├── page.tsx            ← Homepage
│   │   │   ├── article/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    ← Article detail
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    ← Category page
│   │   │   ├── live/
│   │   │   │   └── page.tsx        ← Live updates
│   │   │   └── search/
│   │   │       └── page.tsx        ← Search results
│   │   ├── (payload)/
│   │   │   ├── admin/
│   │   │   │   └── [[...segments]]/
│   │   │   │       └── page.tsx    ← Payload admin UI
│   │   │   └── api/
│   │   │       └── [...slug]/
│   │   │           └── route.ts    ← Payload REST API
│   │   └── globals.css
│   ├── collections/
│   │   ├── Articles.ts
│   │   ├── Authors.ts
│   │   ├── Categories.ts
│   │   ├── Media.ts
│   │   └── Users.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx          ← Logo, nav, search, breaking ticker
│   │   │   ├── Footer.tsx
│   │   │   └── BreakingTicker.tsx  ← Scrolling red bar
│   │   ├── ui/
│   │   │   ├── ArticleCard.tsx     ← Reusable card (size variants: sm/md/lg)
│   │   │   ├── CategoryBadge.tsx   ← Colored pill badge
│   │   │   ├── AuthorChip.tsx      ← Avatar + name + date
│   │   │   ├── ReadingBar.tsx      ← Sticky reading progress
│   │   │   ├── LiveBadge.tsx       ← Pulsing red LIVE indicator
│   │   │   └── BreakingBadge.tsx   ← Red BREAKING badge
│   │   └── sections/
│   │       ├── HeroSection.tsx     ← 1 big + 2 secondary articles
│   │       ├── CategoryRow.tsx     ← Horizontal scroll row per category
│   │       ├── OpinionSection.tsx  ← 3 columnist cards
│   │       ├── MostRead.tsx        ← Numbered sidebar list
│   │       └── LiveTimeline.tsx    ← Live updates timeline
│   ├── lib/
│   │   ├── payload.ts              ← getPayloadClient helper
│   │   ├── api.ts                  ← fetch articles/categories helpers
│   │   └── utils.ts               ← cn(), formatDate(), calcReadTime()
│   └── types/
│       └── index.ts                ← Article, Author, Category types

═══════════════════════════════════════════
PAGE SPECIFICATIONS
═══════════════════════════════════════════

─── HOMEPAGE (/) ───────────────────────────

Layout (top to bottom):
1. BreakingTicker — full-width red bar, marquee scrolling, shows articles where isBreaking=true
2. Header — logo "THE TRIBUNE" (Playfair Display, italic), horizontal nav tabs for all 8 categories, search icon, hamburger mobile
3. HeroSection:
   - Left 60%: Featured article (isFeatured=true, most recent), full image, gradient overlay, large headline 48px, author chip, category badge
   - Right 40%: 2 secondary featured articles stacked, medium image, headline, excerpt truncated to 2 lines
4. Divider with "LATEST NEWS" label + gold underline
5. CategoryRows: for each of 8 categories, show label + "View All" link + horizontal scroll of 4 ArticleCards (sm size)
6. Opinion Section: dark surface bg, "OPINION" heading, 3 columnist cards side by side — author large avatar, name, role, article headline, 1-sentence excerpt
7. Most Read sidebar layout: left 70% = "EDITOR'S PICKS" 3 article cards (md size), right 30% = "MOST READ" numbered list 1-5
8. Footer: 3 columns — logo+tagline, category links, social links (Twitter/X, Facebook, YouTube, Telegram)

Data fetching:
- All fetched server-side via Payload local API
- revalidate: 60 seconds
- Show skeleton loaders as fallback

─── ARTICLE PAGE (/article/[slug]) ─────────

Layout:
1. Full-bleed hero image (100vw, 60vh) with dark gradient overlay bottom
2. Category badge + "BREAKING" badge if isBreaking=true overlaid on image
3. Headline (Playfair Display, 52px, white) overlaid on image
4. Author chip (avatar, name, role, date, readTime) below image
5. Reading progress bar — sticky top, gold color, tracks scroll %
6. Article body — max-width 680px centered:
   - First paragraph: drop cap (large decorative first letter, gold color)
   - Body font: Source Serif 4, 18px, line-height 1.85
   - Pull quotes: italic, left gold border 4px, indented
   - Images: full-width with caption below in IBM Plex Mono
   - Subheadings: Playfair Display, 28px
7. Sticky sidebar (desktop only, right side):
   - Table of Contents: auto-generated from h2/h3 headings, active highlighted gold
   - Share buttons: Twitter, Facebook, copy link, Telegram
   - Tags: pill list
8. After article: Author bio card (avatar, name, role, bio, follow link)
9. Related articles: 3 cards grid, same category

generateStaticParams: generate for all published articles
revalidate: 300 seconds

─── CATEGORY PAGE (/category/[slug]) ────────

Layout:
1. Category hero banner: category color gradient bg, icon (large emoji), name (Playfair Display 64px), description, article count badge
2. Filter bar: pill toggles [Latest | Most Read | Opinion Only | Breaking Only]
3. Article grid:
   - First article: full-width featured card (large image left, headline + excerpt right)
   - Remaining: 3-column responsive grid of ArticleCard (md size)
4. Load More button (pagination, 12 per page)

─── LIVE UPDATES PAGE (/live) ───────────────

Layout:
1. Header banner: pulsing red "● LIVE" badge, event title, start time, last updated timestamp (auto-refreshes every 30s)
2. Two-column layout:
   - Left 65%: Scrollable timeline of updates
     - Each update: timestamp (IBM Plex Mono), category tag, bold headline, body text, optional image
     - Newest update at top, highlighted with gold left border
     - "BREAKING" updates: red left border, red badge
   - Right 35%: Sticky stats panel
     - Key numbers (e.g. "Seats Won: 47", "Turnout: 62%") in large display font
     - Last 5 updates mini list
     - Related articles list
3. Auto-refresh: poll for new updates every 30 seconds, show "X new updates" banner when available

─── SEARCH PAGE (/search) ───────────────────

Layout:
1. Search bar (large, full-width, autofocus)
2. Filter chips: category filter, date range (Today / This Week / This Month)
3. Results: article cards in list format (image left, content right)
4. "No results" state with suggested categories

═══════════════════════════════════════════
COMPONENT DETAILS
═══════════════════════════════════════════

ArticleCard — 3 size variants:
  sm: thumbnail 120x80, headline 2 lines, author+date, category badge
  md: image 16/9 ratio, headline 3 lines, excerpt 2 lines, author chip, read time
  lg: image 16/9 ratio tall, headline large 4 lines, full excerpt, author chip, category badge, breaking badge if applicable

All cards:
  - Hover: subtle gold border (1px), image scale 1.03 (300ms ease)
  - Transition: opacity 0 → 1 with slight translateY on mount (Framer Motion)
  - Skeleton: pulse animation placeholder while loading

Header:
  - Background: #0d1117 with bottom border #30363d
  - Mobile: hamburger → full-screen overlay nav with category list
  - Sticky on scroll, slight blur backdrop on scroll
  - Active nav item: gold underline 2px

BreakingTicker:
  - Background: #c0392b
  - "BREAKING" label in IBM Plex Mono bold left side
  - Smooth CSS marquee animation (linear, 30s, infinite)
  - Pause on hover
  - Only shows if there are breaking articles

═══════════════════════════════════════════
MOCK DATA (use for development)
═══════════════════════════════════════════

Create src/lib/mockData.ts with:

10 articles across all categories with realistic political headlines:
  - "Parliament Votes to Extend Emergency Powers for Third Consecutive Year"
  - "Opposition Leader Calls for Snap Election Amid Economic Crisis"
  - "Foreign Minister Signs Historic Trade Deal with Regional Bloc"
  - "Supreme Court Rules Against Government in Landmark Privacy Case"
  - "Defense Budget Increases 12% as Regional Tensions Escalate"
  - "Exclusive: Inside the Coalition Negotiations That Lasted 72 Hours"
  - "Data Analysis: How Voter Turnout Has Shifted in the Last Decade"
  - "Prime Minister Reshuffles Cabinet in Surprise Midnight Announcement"
  - "Opposition Party Splits Over Constitutional Reform Proposal"
  - "International Observers Raise Concerns Over Election Transparency"

3 authors:
  - Sophea Chan, Senior Political Correspondent
  - Dara Pich, International Affairs Editor  
  - Maly Ros, Data & Investigations Reporter

Use placeholder images from https://picsum.photos (seeded for consistency)

═══════════════════════════════════════════
ANIMATIONS & INTERACTIONS
═══════════════════════════════════════════

Page transitions: Framer Motion AnimatePresence, fade + slight Y translate
Hero section: staggered reveal on load (headline → author → image, 100ms delays)
Cards: stagger children with 50ms delay each when section enters viewport
Reading bar: smooth width transition via CSS (not JS)
Ticker: pure CSS marquee, pause on hover
Live page: new update slides in from top with spring animation
Category banner: gradient shimmer animation on load
Mobile nav: slide in from right, backdrop blur overlay

═══════════════════════════════════════════
RESPONSIVE BREAKPOINTS
═══════════════════════════════════════════

Mobile (< 768px):
  - Single column layout everywhere
  - Hero: stacked (image top, content below)
  - Category rows: horizontal scroll with snap
  - Hide sidebar on article page (TOC moves to top as collapsible accordion)
  - Hamburger nav

Tablet (768px – 1024px):
  - 2-column grids
  - Hero: 60/40 split preserved
  - Sidebar visible but narrower

Desktop (> 1024px):
  - Full layout as specified above
  - Max content width: 1280px, centered

═══════════════════════════════════════════
ENVIRONMENT VARIABLES (.env.local)
═══════════════════════════════════════════

DATABASE_URI=postgresql://tribune:tribune123@localhost:5432/tribune
PAYLOAD_SECRET=change-this-to-random-32-char-string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=The Tribune

═══════════════════════════════════════════
BUILD ORDER (follow this sequence)
═══════════════════════════════════════════

1. payload.config.ts — all 5 collections with full fields and access control
2. src/app/globals.css — CSS variables, base typography, utility classes
3. tailwind.config.ts — extend colors with CSS variables, add custom fonts
4. src/lib/utils.ts — cn(), formatDate(), calcReadTime(), truncate()
5. src/lib/payload.ts — getPayloadClient() singleton
6. src/lib/api.ts — getArticles(), getArticle(), getCategories(), getFeatured()
7. src/types/index.ts — TypeScript interfaces for all collections
8. src/lib/mockData.ts — 10 articles, 3 authors, 8 categories mock data
9. Layout components: BreakingTicker → Header → Footer
10. UI components: CategoryBadge → AuthorChip → LiveBadge → ArticleCard (all 3 sizes)
11. Section components: HeroSection → CategoryRow → OpinionSection → MostRead
12. src/app/(frontend)/layout.tsx — wrap with Header + Footer + fonts
13. src/app/(frontend)/page.tsx — Homepage assembling all sections
14. src/app/(frontend)/article/[slug]/page.tsx — Article page
15. src/app/(frontend)/category/[slug]/page.tsx — Category page
16. src/app/(frontend)/live/page.tsx — Live updates page
17. src/app/(frontend)/search/page.tsx — Search page
18. src/app/(payload)/admin — Payload admin route handler
19. src/app/(payload)/api — Payload REST API route handler
20. next.config.js — configure image domains, payload integration

After generating all files, provide:
- npm install command with all required packages
- Database setup instructions
- How to seed initial categories and admin user
- How to run dev server