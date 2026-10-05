# The National Feed (TNF)

An authoritative, high-performance digital news and policy platform engineered for real-time reporting on US governance, congressional legislation, White House policy, defense, and global affairs.

Built with **Next.js 15 (App Router)**, **Payload CMS v3**, **PostgreSQL**, and styled with a modern, high-contrast **BBC-inspired editorial aesthetic**.

---

## 🌟 Key Features

- **Editorial Layout & Design**:
  - Distinctive 3-Block **`USP`** brand identity with clean, modern typography.
  - BBC-inspired masthead, breaking news ticker banner, and multi-channel navigation.
  - Compact, ranked **Most Read** sidebar and curated section blocks.
  - Full-width hero coverage, regional beat explorer, and video hub.

- **Article & Reading Experience**:
  - **Monochrome Executive Summary**: High-impact editorial summary box with bulleted key points.
  - **Continue Reading Gate**: Smooth, viewability-optimized article truncation with non-intrusive expansion.
  - **Adskeeper Native Monetization**: Optimized placements for In-Article, Sidebar, Under-Article grid, and Bottom Feed widgets.

- **AI-Powered Editorial Suite**:
  - Integrated **Gemini AI** assistant (`/api/ai/assist`) enforcing strict editorial constraints (4-paragraph summaries, character-capped lead excerpts, SEO meta generation).

- **Enterprise CMS & Architecture**:
  - Headless **Payload CMS v3** admin panel (`/admin`) for articles, authors, categories, media, and trackable share links.
  - PostgreSQL database with automated migrations.
  - Full static generation (SSG) with Incremental Static Regeneration (ISR).
  - Schema.org `NewsArticle` structured data and dynamic OpenGraph social share cards.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **CMS**: [Payload CMS v3](https://payloadcms.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via `@payloadcms/db-postgres`)
- **AI & Processing**: [Google Gemini AI SDK](https://ai.google.dev/) + [Sharp](https://sharp.pixelplumbing.com/)
- **Styling**: Vanilla CSS Variables + Modern CSS Grid / Flexbox
- **Monetization**: Adskeeper Native Ad Network
- **Deployment**: Docker & Docker Compose / Standalone Node.js

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm`
- **Database**: PostgreSQL `v15+` (or Docker)

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
POSTGRES_USER=thenationalfeed
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=thenationalfeed
DATABASE_URI=postgresql://thenationalfeed:your_secure_password@localhost:5432/thenationalfeed

# Payload CMS
PAYLOAD_SECRET=your_secure_32_byte_secret

# Site Config
NEXT_PUBLIC_SITE_URL=https://thenationalfeed.com
NEXT_PUBLIC_SITE_NAME=The National Feed
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Gemini AI API
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Adskeeper Widgets
NEXT_PUBLIC_ADS_KEEPER_SITE_ID=
NEXT_PUBLIC_ADS_KEEPER_WIDGET_SIDEBAR=
NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_1=
NEXT_PUBLIC_ADS_KEEPER_WIDGET_IN_ARTICLE_2=
NEXT_PUBLIC_ADS_KEEPER_WIDGET_UNDER_ARTICLE=
NEXT_PUBLIC_ADS_KEEPER_WIDGET_FEED=
```

### 3. Installation

```bash
# Install dependencies
npm install
```

### 4. Database Setup & Seeding

```bash
# Seed initial demo articles and categories
npm run seed
```

### 5. Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).
The Payload Admin Panel is accessible at `/admin`.

---

## 📦 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start Next.js development server |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with initial articles and categories |
| `npm run clean` | Clean test or duplicate database entries |
| `npm run lint` | Run ESLint check |

---

## 🔒 License & Copyright

© 2026 **The National Feed**. All rights reserved.
