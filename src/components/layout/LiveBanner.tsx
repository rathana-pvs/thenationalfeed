'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LiveBannerProps {
  headline?: string;
  slug?: string;
}

export default function LiveBanner({
  headline = 'Geneva summit: 30 nations agree new clean-energy grid protocol',
  slug = 'global-clean-energy-grid-accord-summit',
}: LiveBannerProps) {
  const pathname = usePathname();

  // Hide live banner on individual article/news pages
  if (pathname.startsWith('/article')) {
    return null;
  }

  return (
    <aside className="live-strip" aria-label="Live coverage">
      <div className="bbc-container live-strip-inner">
        <span className="live-label">
          <span className="live-pulse-dot" aria-hidden="true" />
          LIVE
        </span>
        <Link href={`/article/${slug}`} className="live-headline">
          {headline}
        </Link>
        <Link href={`/article/${slug}`} className="live-cta">
          Follow live →
        </Link>
      </div>
    </aside>
  );
}

