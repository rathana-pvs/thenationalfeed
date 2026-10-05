import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { getMediaUrl, extractKeyPoints } from '@/lib/utils';

interface HeroSectionProps { leadStory: Article; secondaryStories: Article[]; }

function StoryMeta({ story }: { story: Article }) {
  const catName = story.category?.name || 'News';
  return <div className="story-meta"><span>{story.readTime || 3} min read</span><span>{catName}</span></div>;
}

function SideStory({ story, image = false }: { story: Article; image?: boolean }) {
  const catName = story.category?.name || 'News';
  const imgUrl = getMediaUrl(story.coverImage);

  return (
    <article className={`hero-side-story${image && imgUrl ? '' : ' text-only'}`}>
      {image && imgUrl && (
        <Link href={`/article/${story.slug}`} className="media-frame media-3x2">
          <Image src={imgUrl} alt={story.coverImage?.alt || story.title} fill sizes="(max-width: 700px) 128px, 25vw" />
          {story.isVideo && <span className="media-badge"><span className="play-mark">▶</span>{story.videoDuration || '03:00'}</span>}
        </Link>
      )}
      <div>
        <span className="story-kicker">{catName}</span>
        <Link href={`/article/${story.slug}`}><h2 className="story-title">{story.title}</h2></Link>
        <p className="story-summary">{story.excerpt}</p>
        <StoryMeta story={story} />
      </div>
    </article>
  );
}

export default function HeroSection({ leadStory, secondaryStories }: HeroSectionProps) {
  const leftStories = secondaryStories.slice(0, 2);
  const rightStories = secondaryStories.slice(2, 5);
  const leadImage = getMediaUrl(leadStory?.coverImage);
  const keyPoints = extractKeyPoints(leadStory);

  return (
    <section className="hero-package" aria-labelledby="top-story-heading">
      <div className="hero-grid">
        <article className="hero-lead">
          <Link href={`/article/${leadStory.slug}`} className="media-frame media-16x9">
            {leadImage ? (
              <Image src={leadImage} alt={leadStory.coverImage?.alt || leadStory.title} fill priority sizes="(max-width: 700px) 100vw, (max-width: 900px) 67vw, 50vw" />
            ) : <span aria-hidden="true" />}
            {leadStory.isVideo && <span className="media-badge"><span className="play-mark">▶</span>{leadStory.videoDuration || '03:45'}</span>}
          </Link>
          <Link href={`/article/${leadStory.slug}`}>
            <h1 id="top-story-heading" className="story-title">{leadStory.title}</h1>
          </Link>
          <p className="story-summary">{leadStory.excerpt}</p>
          <StoryMeta story={leadStory} />
          {keyPoints.length > 0 && (
            <div className="key-developments">
              <strong>KEY DEVELOPMENTS</strong>
              <ul>{keyPoints.slice(0, 3).map((point, idx) => <li key={idx}>{point}</li>)}</ul>
            </div>
          )}
        </article>

        <div className="hero-left hero-side-stack">{leftStories.map((story) => <SideStory story={story} image key={story.id} />)}</div>
        <div className="hero-right hero-side-stack">{rightStories.map((story) => <SideStory story={story} key={story.id} />)}</div>
      </div>
    </section>
  );
}
