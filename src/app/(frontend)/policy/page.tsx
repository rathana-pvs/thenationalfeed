import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Editorial Policy & Standards — The National Feed',
  description: 'Editorial guidelines, verification processes, corrections policies, and journalistic standards at The National Feed.',
}

export default async function PolicyPage() {
  return (
    <div className="bbc-container py-8 md:py-12 max-w-[860px]">
      {/* ── HEADER / BREADCRUMB ──────────────────────── */}
      <div className="border-b-2 border-[var(--ink)] pb-4 mb-8">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--bbc-red)] mb-2">
          <span>The National Feed</span>
          <span>/</span>
          <span>Editorial Standards & Governance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight">
          Editorial Policy & Publishing Standards
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">
          The National Feed adheres to rigorous journalistic integrity, factual accuracy, transparent sourcing, and non-partisan analysis.
        </p>
      </div>

      {/* ── POLICY CONTENT SECTIONS ──────────────────── */}
      <div className="space-y-8 text-base text-[#222222] leading-relaxed">
        
        {/* Section 1 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            1. Fact-Checking and Verification Process
          </h2>
          <p className="mb-3">
            Every article, analysis piece, and breaking news report published on The National Feed undergoes multi-tier editorial review. Our reporters verify claims against primary documentation, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)] mb-3">
            <li>Official congressional records, bill texts, committee transcripts, and Roll Call voting databases.</li>
            <li>Judicial opinions, supreme court dockets, and official legal filings.</li>
            <li>Federal agency registers, executive orders, and government inspector general audits.</li>
            <li>Verified statements from named spokespersons, diplomats, and official agencies.</li>
          </ul>
          <p className="text-sm text-[var(--muted)]">
            We require at least two independent corroborating sources for unrecorded factual claims before publication.
          </p>
        </section>

        {/* Section 2 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            2. Corrections, Updates, and Transparency
          </h2>
          <p className="mb-3">
            When factual errors occur, we correct them swiftly and transparently:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)] mb-3">
            <li>
              <strong>Correction Notices:</strong> A prominent note will be appended to the top or bottom of the article specifying what was incorrect, the verified fact, and the exact timestamp when the correction was applied.
            </li>
            <li>
              <strong>Developing Stories:</strong> When reporting on live or fast-breaking events, developing updates are marked clearly with timestamps to document how facts evolved.
            </li>
          </ul>
          <p className="text-sm text-[var(--muted)]">
            Readers wishing to flag an inaccuracy are encouraged to contact our fact-checking desk at{' '}
            <a href="mailto:corrections@thenationalfeed.com" className="text-[var(--bbc-red)] font-bold underline">
              corrections@thenationalfeed.com
            </a>
            .
          </p>
        </section>

        {/* Section 3 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            3. Anonymous Sourcing and Whistleblower Protection
          </h2>
          <p className="mb-3">
            We grant anonymity to sources only when:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)] mb-3">
            <li>The information is of vital public policy interest.</li>
            <li>The source faces genuine risk of personal retaliation, legal peril, or professional sanction.</li>
            <li>The source's credibility and access to information have been verified directly by senior newsroom editors.</li>
          </ul>
          <p className="text-sm text-[var(--muted)]">
            We never use anonymous quotes to launch personal attacks or circulate unsubstantiated speculation.
          </p>
        </section>

        {/* Section 4 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            4. Editorial Independence and Conflicts of Interest
          </h2>
          <p className="mb-3">
            Our newsroom operates independently from outside financial, political, and corporate influence:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)]">
            <li>Zero funding is accepted from political parties, PACs, candidates, or state agencies.</li>
            <li>Advertisers have no foreknowledge of, influence over, or input on editorial assignments, reporting, or published conclusions.</li>
            <li>Journalists and contributors must recuse themselves from stories involving any financial or personal conflict of interest.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            5. Use of Technology & Artificial Intelligence
          </h2>
          <p className="mb-3">
            Where computational tools, natural language processing, or statistical aggregation models are employed to assist with document indexing or data analysis:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)]">
            <li>All reporting, writing, and editorial synthesis are directed and reviewed by human journalists.</li>
            <li>Algorithmic outputs are subjected to the same rigorous fact-checking standards as human-reported leads.</li>
            <li>We do not generate synthetic, deceptive, or deepfake audio/visual media.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="p-6 bg-[var(--surface)] border border-[var(--line)]">
          <h2 className="font-serif text-xl font-bold text-[var(--ink)] mb-2">
            6. Related Policies & Contact
          </h2>
          <p className="text-sm text-[var(--muted)] mb-4">
            For additional details on how we handle user data and general newsroom operations:
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-wider">
            <Link href="/privacy" className="text-[var(--bbc-red)] hover:underline">
              Read Privacy Policy →
            </Link>
            <Link href="/about" className="text-[var(--ink)] hover:underline">
              About The National Feed →
            </Link>
            <Link href="/contact" className="text-[var(--ink)] hover:underline">
              Contact the Newsroom →
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
