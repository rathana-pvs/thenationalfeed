# Workspace Editorial & Summarization Rules

## 1. Project-Specific Editorial Summarization Rules (`src/app/api/ai/assist/route.ts`)

For the news application, content summarization and AI formatting follow strict editorial rules:

- **Lead Excerpt / Summary**:
  Create a punchy, high-engagement lead summary **strictly under 160 characters**.
- **Title Handling**:
  Do NOT duplicate the article title inside the main body content.
- **Subheadings**:
  Do NOT include any H2 or H3 subheadings in short summary articles—use clean, readable paragraphs.
- **Total Word Count**:
  The entire summary body content **MUST be strictly between 120 and 140 words**.
- **Paragraph Constraints**:
  Write **EXACTLY 4 paragraphs** (no more, no less).
  Each paragraph **MUST be at most 35 words long**.
- **SEO Metadata Limits**:
  - Meta Title: **50–60 characters** (including `- The National Feed` suffix).
  - Meta Description: **100–150 characters**.

---

## 2. General Principles of Effective Content Summarization

1. **Capture Core Takeaways First (Lead-In)**: Put the main conclusion, event, or answer in the very first sentence (the "5 Ws": Who, What, When, Where, Why).
2. **Eliminate Fluff & Redundancies**: Strip away unnecessary background details, conversational filler, repetitive examples, and minor anecdotes.
3. **Maintain Factual Accuracy**: Preserve the original meaning and context without altering facts or adding unverified information.
4. **Keep Paragraphs Short & Scannable**: Format output into short paragraphs for quick mobile scanning.
5. **Respect Length & Constraints**: Adhere strictly to character or word limits required by the platform.

---

## 3. Deployment Confirmation Rule

- **Explicit User Confirmation Required**: Do NOT automatically run deployment commands (`deploy.sh`, docker build/up on server, or git push) after making code changes. ALWAYS present proposed changes/fixes to the user first and wait for explicit confirmation before deploying to the remote server.
