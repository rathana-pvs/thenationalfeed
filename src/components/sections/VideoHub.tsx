import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { getMediaUrl } from '@/lib/utils';

interface VideoHubProps { articles: Article[]; }

export default function VideoHub({ articles }: VideoHubProps) {
  const mediaArticles = articles.filter((article) => article.isVideo);
  if (mediaArticles.length === 0) return null;
  const [lead, ...rest] = mediaArticles;
  const leadImage = getMediaUrl(lead?.coverImage);

  return (
    <section className="video-section" aria-labelledby="watch-heading">
      <div className="bbc-container">
        <div className="section-heading-row"><h2 id="watch-heading" className="section-heading">Watch & listen</h2><Link href="/category/video" className="section-more">View all media →</Link></div>
        <div className="video-grid">
          <article className="video-lead">
            <Link href={`/article/${lead.slug}`} className="media-frame media-16x9">
              {leadImage && <Image src={leadImage} alt={lead.coverImage?.alt || lead.title} fill sizes="(max-width: 700px) 100vw, 65vw" />}
              <span className="media-badge"><span className="play-mark">▶</span>{lead.videoDuration || '03:45'}</span>
            </Link>
            <Link href={`/article/${lead.slug}`}><h3 className="story-title">{lead.title}</h3></Link>
            <p className="story-summary">{lead.excerpt}</p>
            <div className="story-meta"><span>{lead.category?.name || 'Video'}</span><span>{lead.readTime || 3} min</span></div>
          </article>
          <div className="video-list">
            {rest.slice(0, 4).map((story) => {
              const imgUrl = getMediaUrl(story.coverImage);
              return (
                <article className="video-list-item" key={story.id}>
                  <Link href={`/article/${story.slug}`} className="media-frame media-16x9">
                    {imgUrl && <Image src={imgUrl} alt={story.coverImage?.alt || story.title} fill sizes="130px" />}
                    <span className="media-badge"><span className="play-mark">▶</span>{story.videoDuration || '02:15'}</span>
                  </Link>
                  <div><span className="story-kicker">{story.category?.name || 'Video'}</span><Link href={`/article/${story.slug}`}><h3 className="story-title">{story.title}</h3></Link></div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
