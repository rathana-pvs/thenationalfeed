import React from 'react';
import Link from 'next/link';
interface FooterProps { settings?: { footerText?: string }; }
const channels = [['Home', '/'], ['News', '/category/world'], ['Sport', '/category/sport'], ['Business', '/category/business'], ['Technology', '/category/innovation'], ['Culture', '/category/culture'], ['Travel', '/category/travel'], ['Earth', '/category/earth'], ['Audio', '/category/video'], ['Video', '/category/video']] as const;

export default function Footer({ settings }: FooterProps) {
  const footerText = settings?.footerText || `© ${new Date().getFullYear()} The National Feed. All rights reserved. Providing authoritative reporting on US policy, governance, politics, and world affairs.`;

  return (
    <footer className="site-footer">
      <div className="bbc-container footer-inner">
        <Link href="/" className="site-brand-logo footer-brand-logo" aria-label="The National Feed homepage">
          <span className="brand-blocks">
            <span>T</span>
            <span>N</span>
            <span>F</span>
          </span>
          <span className="brand-wordmark">The National Feed</span>
        </Link>
        <nav className="footer-channel-list" aria-label="Footer channels">{channels.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</nav>
        <div className="footer-follow"><span>Follow The National Feed on:</span><div className="social-links" aria-label="Social media"><Link href="#" aria-label="X">X</Link><Link href="#" aria-label="Facebook">f</Link><Link href="#" aria-label="Instagram">◎</Link><Link href="#" aria-label="YouTube">▶</Link></div></div>
        <nav className="footer-legal-list" aria-label="Legal links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/policy">Editorial Policy</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-copy"><p>{footerText}</p><p>The National Feed provides independent journalism across digital and mobile platforms.</p></div>
      </div>
    </footer>
  );
}
