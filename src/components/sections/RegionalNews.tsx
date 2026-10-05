'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { getMediaUrl } from '@/lib/utils';

interface RegionalNewsProps { articles: Article[]; }
const regions = ['Europe', 'Asia', 'US & Canada', 'Middle East', 'Africa', 'Latin America'];

export default function RegionalNews({ articles }: RegionalNewsProps) {
  const [activeRegion, setActiveRegion] = useState('Europe');
  const exactMatches = articles.filter((article) => {
    const reg = article.region?.toLowerCase() || '';
    if (activeRegion === 'US & Canada') {
      return reg === 'us-canada' || reg.includes('us') || reg.includes('canada');
    }
    if (activeRegion === 'Middle East') {
      return reg === 'middle-east' || reg.includes('middle');
    }
    if (activeRegion === 'Latin America') {
      return reg === 'latin-america' || reg.includes('latin');
    }
    return reg === activeRegion.toLowerCase();
  });
  const stories = (exactMatches.length > 0 ? exactMatches : articles).slice(0, 3);

  return (
    <section className="editorial-section" aria-labelledby="regional-heading">
      <div className="region-header">
        <h2 id="regional-heading" className="section-heading">Around the world</h2>
        <div className="region-tabs" role="tablist" aria-label="Choose a region">
          {regions.map((region) => <button type="button" role="tab" aria-selected={activeRegion === region} className={`region-tab${activeRegion === region ? ' active' : ''}`} onClick={() => setActiveRegion(region)} key={region}>{region}</button>)}
        </div>
      </div>
      <div className="topic-grid">
        {stories.map((story) => {
          const imgUrl = getMediaUrl(story.coverImage);
          const kicker = story.region || story.category?.name || 'World';
          return (
            <article className="topic-card" key={story.id}>
              {imgUrl && (
                <Link href={`/article/${story.slug}`} className="media-frame media-3x2">
                  <Image src={imgUrl} alt={story.coverImage?.alt || story.title} fill sizes="(max-width: 700px) 100vw, 33vw" />
                </Link>
              )}
              <span className="story-kicker">{kicker}</span>
              <Link href={`/article/${story.slug}`}><h3 className="story-title">{story.title}</h3></Link>
              <div className="story-meta"><span>{story.readTime || 3} min read</span></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
