'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const menuGroups = [
  {
    title: 'News & Policy',
    links: [
      ['Home', '/'],
      ['World News', '/category/world'],
      ['Business & Economy', '/category/business'],
      ['Tech & Innovation', '/category/innovation'],
    ],
  },
  {
    title: 'Features',
    links: [
      ['Culture', '/category/culture'],
      ['Travel', '/category/travel'],
      ['Earth & Climate', '/category/earth'],
      ['Watch & Listen', '/category/video'],
    ],
  },
  {
    title: 'Coverage',
    links: [
      ['Live Updates', '/live'],
      ['Latest Video', '/category/video'],
      ['Sport', '/category/sport'],
    ],
  },
  {
    title: 'The National Feed',
    links: [
      ['About Us', '/about'],
      ['Contact', '/contact'],
      ['Editorial Policy', '/policy'],
      ['Privacy Policy', '/privacy'],
    ],
  },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen((open) => !open);
    setMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="bbc-container masthead">
        <div className="masthead-controls">
          <button
            type="button"
            className={`icon-button${menuOpen ? ' active' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen ? (
                <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z" />
              ) : (
                <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" />
              )}
            </svg>
            <span>Menu</span>
          </button>
          <button
            type="button"
            className={`icon-button${searchOpen ? ' active' : ''}`}
            aria-label={searchOpen ? 'Close search' : 'Open search'}
            aria-expanded={searchOpen}
            onClick={toggleSearch}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m20.7 19.3-4.2-4.2A7.5 7.5 0 1 0 15.1 16l4.2 4.2 1.4-1.4ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z" />
            </svg>
            <span>Search</span>
          </button>
        </div>

        <Link href="/" className="site-brand-logo" aria-label="The National Feed homepage">
          <span className="brand-blocks">
            <span>T</span>
            <span>N</span>
            <span>F</span>
          </span>
          <span className="brand-wordmark">The National Feed</span>
        </Link>

        <div className="masthead-right" aria-hidden="true" />
      </div>

      {searchOpen && (
        <div className="search-drawer animate-in fade-in duration-200">
          <form className="bbc-container search-form" role="search" onSubmit={handleSearchSubmit}>
            <label className="skip-link" htmlFor="site-search">
              Search The National Feed
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Search policy, news, legislation, audio and video..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit">Search</button>
            <button
              type="button"
              className="search-close-btn"
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              ✕
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="menu-drawer animate-in fade-in duration-200">
          <div className="bbc-container menu-grid">
            {menuGroups.map((group) => (
              <section className="menu-group" key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} onClick={() => setMenuOpen(false)}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
