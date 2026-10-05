import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us — The National Feed',
  description: 'Reach our newsroom, investigative reporters, editors, or secure tip desk. Contact The National Feed.',
}

export default async function ContactPage() {
  const departments = [
    {
      name: 'General Newsroom',
      email: 'hello@thenationalfeed.com',
      desc: 'General comments, story queries, and general correspondence.',
    },
    {
      name: 'Press & Media Relations',
      email: 'press@thenationalfeed.com',
      desc: 'Broadcast appearances, interview requests with our analysts, and syndication.',
    },
    {
      name: 'Corrections & Fact-Checking',
      email: 'corrections@thenationalfeed.com',
      desc: 'Notices of potential inaccuracies, factual corrections, and editor inquiries.',
    },
    {
      name: 'Legal & Rights',
      email: 'legal@thenationalfeed.com',
      desc: 'Copyright, syndication licensing, and privacy compliance.',
    },
  ]

  return (
    <div className="bbc-container py-8 md:py-12">
      {/* ── HEADER / BREADCRUMB ──────────────────────── */}
      <div className="border-b-2 border-[var(--ink)] pb-4 mb-8">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--bbc-red)] mb-2">
          <span>The National Feed</span>
          <span>/</span>
          <span>Contact Newsroom</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight">
          Get in Touch with Our Newsroom
        </h1>
        <p className="mt-4 text-lg md:text-xl text-[var(--muted)] max-w-3xl leading-relaxed">
          Whether you have a news tip, a press inquiry, or feedback on our reporting, our editorial and research desks are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Newsroom Contacts & Secure Tips (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Department Contact Grid */}
          <div>
            <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-4 border-b border-[var(--line)] pb-2">
              Editorial & Newsroom Desks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {departments.map((dept, i) => (
                <div key={i} className="p-4 bg-[var(--surface)] border border-[var(--soft-line)]">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--bbc-red)] mb-1">
                    {dept.name}
                  </div>
                  <a
                    href={`mailto:${dept.email}`}
                    className="font-serif text-base font-bold text-[var(--ink)] hover:text-[var(--bbc-red)] hover:underline block mb-1 break-all"
                  >
                    {dept.email}
                  </a>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">
                    {dept.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Tip & Whistleblower Box */}
          <div className="p-6 bg-white border-2 border-[var(--bbc-red)] relative">
            <div className="inline-block px-2.5 py-0.5 bg-[var(--bbc-red)] text-white text-[11px] font-mono font-bold uppercase tracking-widest mb-3">
              Secure Tip Line · Confidential
            </div>
            <h3 className="font-serif text-xl font-bold text-[var(--ink)] mb-2">
              Submit Sensitive Documents or Whistleblower Tips
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
              If you possess sensitive internal government documents, leaked regulatory briefs, or corporate lobbying records, you can reach our investigative unit through end-to-end encrypted channels.
            </p>
            <div className="space-y-2 text-xs font-mono bg-[var(--surface)] p-3 border border-[var(--line)]">
              <div><span className="font-bold text-[var(--ink)]">SIGNAL:</span> +1 (202) 555-0198 (Tips Only)</div>
              <div><span className="font-bold text-[var(--ink)]">PGP KEY:</span> 4A7B 9931 2C09 0E3F 2218 84E1 09B2 4D6F</div>
              <div><span className="font-bold text-[var(--ink)]">SECURE MAIL:</span> tips@thenationalfeed.com</div>
            </div>
          </div>

          {/* Editorial Standards Notice */}
          <div className="p-4 bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--muted)] leading-relaxed">
            <span className="font-bold text-[var(--ink)]">Editorial Note:</span> For correction requests, please include the specific article URL, the date of publication, and references to primary source records. Read our full{' '}
            <Link href="/policy" className="text-[var(--bbc-red)] underline font-bold">
              Editorial Standards & Corrections Policy
            </Link>
            .
          </div>

        </div>

        {/* Right Column: Interactive Contact Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[var(--line)] p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-[var(--ink)] mb-2">
            Send a Direct Message
          </h2>
          <p className="text-xs text-[var(--muted)] mb-6">
            Fill out the form below and your message will be routed to the appropriate editor or department.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
