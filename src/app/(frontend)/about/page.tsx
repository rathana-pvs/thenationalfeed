import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us — The National Feed',
  description: 'Authoritative, independent reporting on US policy, governance, legislation, defense, and global affairs. Learn about our mission and editorial standards.',
}

export default async function AboutPage() {
  const stats = [
    { number: '15+', label: 'Years of Reporting' },
    { number: '200K+', label: 'Daily Readers' },
    { number: '40+', label: 'Policy Beats' },
    { number: '100%', label: 'Editorial Independence' },
  ]

  const standards = [
    {
      num: '01',
      title: 'Uncompromising Accuracy',
      body: 'Every report undergoes multi-tier verification before publication. We prioritize rigorous factual validation over rapid sensationalism.',
    },
    {
      num: '02',
      title: 'Editorial Independence',
      body: 'We accept zero funding from political parties, PACs, or government agencies. Our coverage remains steadfastly independent and non-partisan.',
    },
    {
      num: '03',
      title: 'Authoritative Policy Analysis',
      body: 'We delve into complex legislative drafts, judicial opinions, and executive actions to explain the real-world implications for citizens.',
    },
    {
      num: '04',
      title: 'Transparent Sourcing & Corrections',
      body: 'We cite primary documents, disclose research methodologies, and publish clear, prominent correction notices whenever inaccuracies occur.',
    },
    {
      num: '05',
      title: 'Ironclad Source Protection',
      body: 'We maintain encrypted whistleblower infrastructure to protect whistleblowers, public servants, and confidential sources worldwide.',
    },
    {
      num: '06',
      title: 'Global Geopolitical Context',
      body: 'American policy does not occur in a vacuum. We connect domestic governance with worldwide alliances, markets, and defense developments.',
    },
  ]

  const leadership = [
    {
      role: 'Editor-in-Chief',
      name: 'Dr. Sarah Al-Mansoor',
      bio: 'Veteran foreign policy correspondent with 18 years covering international diplomacy, defense, and congressional affairs.',
    },
    {
      role: 'Managing Editor',
      name: 'Marcus Vance',
      bio: 'Award-winning investigative reporter specializing in campaign finance, legislative lobbying, and regulatory policy.',
    },
    {
      role: 'Head of Data & Analysis',
      name: 'Elena Rostova',
      bio: 'Data journalist specializing in macroeconomic forecasting, voting pattern aggregation, and legislative tracking desks.',
    },
    {
      role: 'Senior Congressional Analyst',
      name: 'David Chen',
      bio: 'Author and Capitol Hill reporter with deep sourcing across House and Senate committees and federal regulatory agencies.',
    },
  ]

  const timeline = [
    {
      year: '2010',
      title: 'Newsroom Founded',
      event: 'Established by a collective of investigative journalists committed to rigorous, non-partisan policy analysis.',
    },
    {
      year: '2014',
      title: 'Congressional Intelligence Desk',
      event: 'Expanded dedicated coverage to Capitol Hill committee hearings, federal agency rulemaking, and defense appropriations.',
    },
    {
      year: '2018',
      title: 'Global Policy Network',
      event: 'Launched regional bureaus connecting Washington policy decisions with international security and economic impacts.',
    },
    {
      year: '2022',
      title: 'Data & Forecasting Desk',
      event: 'Introduced live legislative trackers, election data analysis, and open-source intelligence reporting.',
    },
    {
      year: '2025',
      title: 'Digital Platform Relaunch',
      event: 'Upgraded digital infrastructure to deliver real-time breaking briefs, multi-format explainers, and live coverage to 200,000+ daily readers.',
    },
  ]

  return (
    <div className="bbc-container category-page">
      {/* ── HEADER BLOCK (Matching Category Title Block) ── */}
      <header className="category-title-block">
        <span className="story-kicker">The National Feed · Independent Journalism</span>
        <h1 className="category-title">About Us</h1>
        <p className="category-description">
          Authoritative reporting and non-partisan analysis on US policy, congress, governance, and global affairs.
        </p>
      </header>

      {/* ── STATS BAR ─────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-[var(--line)] mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-[var(--surface)] border-l-4 border-[var(--bbc-red)]">
            <div className="font-serif text-3xl md:text-4xl font-bold text-[var(--bbc-red)] leading-none mb-1">
              {stat.number}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── MISSION SECTION ──────────────────────────── */}
      <section className="editorial-section mt-0 mb-12">
        <div className="section-heading-row">
          <h2 className="section-heading">Our Mission</h2>
          <Link href="/policy" className="section-more">Read standards →</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <blockquote className="font-serif italic text-2xl md:text-3xl text-[var(--ink)] leading-snug pl-4 border-l-4 border-[var(--bbc-red)]">
              "We believe that accurate, data-driven, and unspun information is a fundamental right of every citizen in a free society."
            </blockquote>
          </div>
          <div className="lg:col-span-7 space-y-4 text-base text-[#1f1f1f] leading-relaxed">
            <p>
              The National Feed was founded on a simple conviction: in a healthy society, citizens need access to verifiable, unbiased facts to evaluate legislation and hold power accountable.
            </p>
            <p>
              In an era of algorithm-driven feeds and partisan amplification, we refuse to optimize for outrage. Every article, briefing, and analysis piece is authored and verified by journalists committed to truth, depth, and public interest.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/policy"
                className="inline-flex items-center px-4 py-2 bg-[var(--ink)] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                Editorial Policy & Standards →
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-4 py-2 bg-[var(--surface)] text-[var(--ink)] border border-[var(--line)] text-xs font-bold uppercase tracking-wider hover:border-[var(--ink)] transition-colors"
              >
                Contact Newsroom
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE STANDARDS ───────────────────────────── */}
      <section className="editorial-section mb-12" id="standards">
        <div className="section-heading-row">
          <h2 className="section-heading">Editorial Standards & Principles</h2>
          <Link href="/policy" className="section-more">Full policy →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standards.map((val, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-[var(--line)] hover:border-[var(--bbc-red)] transition-colors"
            >
              <span className="story-kicker block mb-1 font-mono font-bold text-[var(--bbc-red)]">
                {val.num}
              </span>
              <h3 className="story-title text-xl font-bold text-[var(--ink)] mb-2">
                {val.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {val.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDITORIAL LEADERSHIP ─────────────────────── */}
      <section className="editorial-section mb-12">
        <div className="section-heading-row">
          <h2 className="section-heading">Editorial Leadership</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leadership.map((person, idx) => (
            <div key={idx} className="p-5 bg-[var(--surface)] border border-[var(--soft-line)]">
              <span className="story-kicker block text-[var(--bbc-red)] mb-1">
                {person.role}
              </span>
              <h3 className="story-title text-lg font-bold text-[var(--ink)] mb-2">
                {person.name}
              </h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {person.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────── */}
      <section className="editorial-section mb-12">
        <div className="section-heading-row">
          <h2 className="section-heading">Newsroom Milestones</h2>
        </div>

        <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-baseline"
            >
              <div className="md:col-span-2 font-serif text-2xl font-bold text-[var(--bbc-red)]">
                {item.year}
              </div>
              <div className="md:col-span-4 font-serif text-base font-bold text-[var(--ink)]">
                {item.title}
              </div>
              <div className="md:col-span-6 text-sm text-[var(--muted)] leading-relaxed">
                {item.event}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────── */}
      <div className="mt-8 p-8 bg-[var(--surface)] border-t-2 border-[var(--ink)] text-center">
        <h3 className="story-title text-2xl font-bold mb-2">
          Have a tip or inquiry for our reporters?
        </h3>
        <p className="text-sm text-[var(--muted)] max-w-xl mx-auto mb-6">
          We welcome confidential whistleblower tips, press inquiries, corrections, and reader feedback.
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-[var(--bbc-red)] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#900] transition-colors"
        >
          Contact The National Feed
        </Link>
      </div>
    </div>
  )
}

