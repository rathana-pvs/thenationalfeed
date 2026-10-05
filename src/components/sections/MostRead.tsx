import React from 'react';
import Link from 'next/link';
import { Article } from '@/types';

interface MostReadProps {
  articles: Article[];
  limit?: number;
}

export default function MostRead({ articles, limit = 6 }: MostReadProps) {
  const ranked = [...articles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, limit);

  return (
    <aside className="most-read" aria-labelledby="most-read-title">
      <div className="most-read-header">
        <h2 id="most-read-title">Most read</h2>
        <span>TOP {limit}</span>
      </div>
      <ol className="ranked-list">
        {ranked.map((article, index) => (
          <li className="ranked-item" key={article.id}>
            <Link href={`/article/${article.slug}`} className="ranked-link" title={article.title}>
              <span className="rank-number">{index + 1}</span>
              <h3 className="story-title">{article.title}</h3>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
