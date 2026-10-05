import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — The National Feed',
  description: 'Learn how The National Feed collects, protects, and manages reader data and analytics in accordance with global privacy standards.',
}

export default async function PrivacyPage() {
  return (
    <div className="bbc-container py-8 md:py-12 max-w-[860px]">
      {/* ── HEADER / BREADCRUMB ──────────────────────── */}
      <div className="border-b-2 border-[var(--ink)] pb-4 mb-8">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[var(--bbc-red)] mb-2">
          <span>The National Feed</span>
          <span>/</span>
          <span>Legal & Compliance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ink)] leading-tight">
          Privacy Policy
        </h1>
        <div className="mt-3 flex items-center gap-4 text-xs font-mono text-[var(--muted)]">
          <span>EFFECTIVE DATE: JANUARY 1, 2026</span>
          <span>·</span>
          <span>LAST REVIEWED: AUGUST 2026</span>
        </div>
      </div>

      {/* ── POLICY CONTENT PROSE ─────────────────────── */}
      <div className="space-y-8 text-base text-[#222222] leading-relaxed">
        
        {/* Section 1 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            1. Overview and Commitment to Reader Privacy
          </h2>
          <p className="mb-3">
            The National Feed (<em>thenationalfeed.com</em>) is committed to protecting the privacy and fundamental rights of our readers and sources. This Privacy Policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed and safeguarded.
          </p>
          <p>
            We adhere to the core principle of data minimization: we collect only the minimum amount of information necessary to deliver independent journalism, optimize performance, and maintain platform security.
          </p>
        </section>

        {/* Section 2 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            2. Information We Collect
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-[var(--ink)] uppercase tracking-wider mb-1">
                A. Voluntarily Provided Information
              </h3>
              <p className="text-sm text-[var(--muted)]">
                When you contact our newsroom, subscribe to editorial newsletters, submit comments, or report an error, you may provide your name, email address, and message contents. We use this information solely to respond to your specific request.
              </p>
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-[var(--ink)] uppercase tracking-wider mb-1">
                B. Automated Technical & Analytics Data
              </h3>
              <p className="text-sm text-[var(--muted)]">
                When you access our platform, our servers and analytics providers may collect anonymized telemetry data, including your IP address (anonymized/truncated), browser type, referring URLs, operating system, pages viewed, and access timestamps.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            3. Cookies and Tracking Technologies
          </h2>
          <p className="mb-3">
            We use essential and analytics cookies to enhance site navigation and understand readership patterns:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <strong>Essential Cookies:</strong> Required for the core technical operation of our content management systems and security mechanisms.
            </li>
            <li>
              <strong>Performance & Analytics Cookies:</strong> We utilize Google Analytics to analyze aggregated reader traffic, reading duration, and regional readership trends. All IP addresses are anonymized.
            </li>
            <li>
              <strong>Preference Cookies:</strong> Store user interface selections such as text size or display modes.
            </li>
          </ul>
          <p className="mt-3 text-sm text-[var(--muted)]">
            You can configure your browser to reject cookies or alert you when cookies are being sent. Note that some site features may not function properly without essential cookies.
          </p>
        </section>

        {/* Section 4 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            4. Third-Party Services and Advertising
          </h2>
          <p className="mb-3">
            To sustain our independent reporting operations, we may display programmatic news widgets and sponsor messages provided by third-party advertising partners (such as Adskeeper).
          </p>
          <p className="text-sm text-[var(--muted)]">
            These third-party vendors may use cookies or web beacons to serve advertisements based on your prior visits to this and other websites. We do not share personally identifiable information with third-party advertisers.
          </p>
        </section>

        {/* Section 5 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            5. Source Confidentiality and Whistleblower Data
          </h2>
          <p className="mb-3">
            The National Feed maintains dedicated encrypted channels (including PGP mail and Signal) for confidential tips and source communications. Information received via these channels is subject to strict journalistic privilege and rigorous newsroom source-protection protocols.
          </p>
          <p className="text-sm text-[var(--muted)]">
            We do not store source identification records on unencrypted internet-facing servers. For more details on secure communications, visit our{' '}
            <Link href="/contact" className="text-[var(--bbc-red)] underline font-bold">
              Secure Tip Desk
            </Link>
            .
          </p>
        </section>

        {/* Section 6 */}
        <section className="border-b border-[var(--soft-line)] pb-6">
          <h2 className="font-serif text-xl md:text-2xl font-bold text-[var(--ink)] mb-3">
            6. Your Rights (GDPR, CCPA & Global Regulations)
          </h2>
          <p className="mb-3">
            Depending on your jurisdiction, you have statutory rights concerning your personal data:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-[var(--muted)]">
            <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your personal data from our contact databases.</li>
            <li><strong>Right to Object / Opt-out:</strong> Object to processing or unsubscribe from newsletters at any time.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="p-6 bg-[var(--surface)] border border-[var(--line)]">
          <h2 className="font-serif text-xl font-bold text-[var(--ink)] mb-2">
            7. Contact Our Data Protection Officer
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
            If you have questions regarding this Privacy Policy, wish to exercise your privacy rights, or have inquiries regarding data protection practices:
          </p>
          <div className="text-xs font-mono space-y-1">
            <div><span className="font-bold text-[var(--ink)]">EMAIL:</span> privacy@thenationalfeed.com</div>
            <div><span className="font-bold text-[var(--ink)]">LEGAL DESK:</span> legal@thenationalfeed.com</div>
            <div><span className="font-bold text-[var(--ink)]">LOCATION:</span> Washington, D.C., United States</div>
          </div>
        </section>

      </div>
    </div>
  )
}
