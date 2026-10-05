'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const channels = [
  ['Home', '/'],
  ['News', '/category/world'],
  ['Sport', '/category/sport'],
  ['Business', '/category/business'],
  ['Technology', '/category/innovation'],
  ['Culture', '/category/culture'],
  ['Travel', '/category/travel'],
  ['Earth', '/category/earth'],
  ['Audio', '/category/video'],
  ['Video', '/category/video'],
] as const;

export default function Navigation() {
  const pathname = usePathname();

  // Hide category navigation on individual article/news pages for a clean, minimal reading header
  if (pathname.startsWith('/article')) {
    return null;
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);


  return (
    <nav className="primary-nav" aria-label="Main channels">
      <div className="bbc-container nav-scroll">
        <ul className="channel-list">
          {channels.map(([label, href]) => (
            <li key={label}>
              <Link
                href={href}
                className={`channel-link${isActive(href) ? ' active' : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/live"
              className={`channel-link live${pathname === '/live' || pathname.includes('global-clean-energy') ? ' active' : ''}`}
            >
              <span className="live-dot" aria-hidden="true" />
              Live
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

