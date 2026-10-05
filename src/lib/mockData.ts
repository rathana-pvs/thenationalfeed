import { Article, Author, Category } from '@/types'

export const mockCategories: Record<string, Category> = {
  politics: { id: 'cat-1', name: 'Politics', slug: 'politics' },
  global: { id: 'cat-2', name: 'Global Affairs', slug: 'global' },
  defense: { id: 'cat-3', name: 'Defense & Security', slug: 'defense' },
  economy: { id: 'cat-4', name: 'Economy', slug: 'economy' },
  tech: { id: 'cat-5', name: 'Tech Policy', slug: 'tech' },
  opinion: { id: 'cat-6', name: 'Opinion', slug: 'opinion' },
}

export const mockAuthors: Author[] = [
  {
    "id": "author-1",
    "name": "The National Feed Newsroom",
    "slug": "thenationalfeed-newsroom",
    "role": "International News Network",
    "bio": "Latest news, analysis and features from Al Jazeera's global network.",
    "avatar": {
      "id": "media-a1",
      "filename": "avatar.jpg",
      "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      "alt": "The National Feed Newsroom"
    },
    "twitter": "thenationalfeed",
    "email": "news@aljazeera.net"
  },
  {
    "id": "author-2",
    "name": "The National Feed Editorial Desk",
    "slug": "thenationalfeed-editorial",
    "role": "Senior Newsroom Desk",
    "bio": "Latest breaking political and international reporting from The National Feed news team.",
    "avatar": {
      "id": "media-a2",
      "filename": "avatar.jpg",
      "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      "alt": "The National Feed Editorial Desk"
    },
    "twitter": "thenationalfeed",
    "email": "news@thenationalfeed.com"
  }
]

const legacyMockArticles: Article[] = [
  {
    "id": "art-1",
    "title": "House Passes Bipartisan Housing Bill Targeting Corporate Homebuyers",
    "slug": "house-passes-bipartisan-housing-bill-targeting-corporate",
    "excerpt": "The House delivered a massive bipartisan victory this week, passing a housing bill designed to expand homeownership, lower costs, and limit institutional...",
    "coverImage": {
      "id": "img-1",
      "filename": "pulefeed-scraped-1-1787561447527.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787535279202.jpeg",
      "alt": "House Passes Bipartisan Housing Bill Targeting Corporate Homebuyers"
    },
    "category": {
      "id": "cat-1",
      "name": "house",
      "slug": "house"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": true,
    "isVideo": true,
    "videoDuration": "03:45",
    "viewCount": 15420,
    "region": "us-canada",
    "dateline": "WASHINGTON",
    "keyPoints": [
      "House approves landmark legislation targeting institutional home purchases.",
      "Bipartisan measure expands tax incentives for first-time buyers.",
      "Senate committee prepares companion bill for floor vote next week."
    ],
    "language": "en",
    "publishedAt": "2026-08-24T01:34:36.010Z",
    "readTime": 6,
    "tags": [
      {
        "tag": "house"
      },
      {
        "tag": "passes"
      },
      {
        "tag": "bipartisan"
      },
      {
        "tag": "housing"
      }
    ],
    "createdAt": "2026-08-24T01:34:36.010Z",
    "updatedAt": "2026-08-24T01:34:36.010Z"
  },
  {
    "id": "art-2",
    "title": "Trump FALLS AGAIN! — White House Doctor Breaks Silence",
    "slug": "trump-falls-again-white-house-doctor-breaks-silence-5",
    "excerpt": "Recent online reports have circulated claims that Donald Trump stumbled while boarding Air Force One en route to Florida.",
    "coverImage": {
      "id": "img-2",
      "filename": "pulefeed-scraped-2-1787561447753.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787535210193.jpeg",
      "alt": "Trump FALLS AGAIN! — White House Doctor Breaks Silence"
    },
    "category": {
      "id": "cat-1",
      "name": "trump",
      "slug": "trump"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": true,
    "language": "en",
    "publishedAt": "2026-08-24T01:33:26.991Z",
    "readTime": 3,
    "tags": [
      {
        "tag": "trump"
      },
      {
        "tag": "falls"
      },
      {
        "tag": "again"
      },
      {
        "tag": "white"
      }
    ],
    "createdAt": "2026-08-24T01:33:26.991Z",
    "updatedAt": "2026-08-24T01:33:26.991Z"
  },
  {
    "id": "art-3",
    "title": "🚨🐂🚀BREAKING NEWS : TRUMP just confirmed the passing of…",
    "slug": "breaking-news-trump-just-confirmed-the-passing-1",
    "excerpt": "A devastating rocket attack struck Los Angeles, causing multiple explosions, fires, widespread structural damage, and ongoing rescue efforts.",
    "coverImage": {
      "id": "img-3",
      "filename": "pulefeed-scraped-3-1787561447847.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787535063249.jpeg",
      "alt": "🚨🐂🚀BREAKING NEWS : TRUMP just confirmed the passing of…"
    },
    "category": {
      "id": "cat-1",
      "name": "los angeles",
      "slug": "los angeles"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": true,
    "language": "en",
    "publishedAt": "2026-08-24T01:30:59.787Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "los angeles"
      },
      {
        "tag": "rocket attack"
      },
      {
        "tag": "breaking news"
      },
      {
        "tag": "emergency response"
      }
    ],
    "createdAt": "2026-08-24T01:30:59.787Z",
    "updatedAt": "2026-08-24T01:30:59.787Z"
  },
  {
    "id": "art-4",
    "title": "🚨Donald Trump Jr. Draws Fresh Attention as His Influence Within GOP Continues to Grow",
    "slug": "donald-trump-jr-draws-fresh-attention-as-his-influence-within-gop",
    "excerpt": "Donald Trump Jr. expands his powerful influence across the GOP, cementing his status as a leading voice for the modern conservative movement.",
    "coverImage": {
      "id": "img-4",
      "filename": "pulefeed-scraped-4-1787561448099.png",
      "url": "https://pulefeed.tech/media/scraped-1787531402429.png",
      "alt": "🚨Donald Trump Jr. Draws Fresh Attention as His Influence Within GOP Continues to Grow"
    },
    "category": {
      "id": "cat-1",
      "name": "politics",
      "slug": "politics"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-24T00:29:58.643Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "politics"
      },
      {
        "tag": "gop"
      },
      {
        "tag": "donald trump jr"
      },
      {
        "tag": "conservative"
      }
    ],
    "createdAt": "2026-08-24T00:29:58.643Z",
    "updatedAt": "2026-08-24T00:29:58.643Z"
  },
  {
    "id": "art-5",
    "title": "SAD NEWS 20 Minutes ago in California, Kamala Harris was confirmed as…",
    "slug": "sad-news-20-minutes-ago-in-california-kamala-harris-was-confirmed-as",
    "excerpt": "Kamala Harris officially secured the Democratic presidential nomination following Joe Biden's withdrawal, uniting the party for the general election.",
    "coverImage": {
      "id": "img-5",
      "filename": "pulefeed-scraped-5-1787561448216.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787531282144.jpeg",
      "alt": "SAD NEWS 20 Minutes ago in California, Kamala Harris was confirmed as…"
    },
    "category": {
      "id": "cat-1",
      "name": "kamala harris",
      "slug": "kamala harris"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-24T00:27:54.948Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "kamala harris"
      },
      {
        "tag": "election"
      },
      {
        "tag": "politics"
      },
      {
        "tag": "democrats"
      }
    ],
    "createdAt": "2026-08-24T00:27:54.948Z",
    "updatedAt": "2026-08-24T00:27:54.948Z"
  },
  {
    "id": "art-6",
    "title": "BARRON TRUMP ADMITS THAT HE TESTED POSITIVE FOR…",
    "slug": "barron-trump-admits-that-he-tested-positive-for",
    "excerpt": "Barron Trump sparked widespread online speculation after a vague headline about him circulated rapidly across social media platforms.",
    "coverImage": {
      "id": "img-6",
      "filename": "pulefeed-scraped-6-1787561448294.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787530767388.jpeg",
      "alt": "BARRON TRUMP ADMITS THAT HE TESTED POSITIVE FOR…"
    },
    "category": {
      "id": "cat-1",
      "name": "barron trump",
      "slug": "barron trump"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-24T00:19:06.684Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "barron trump"
      },
      {
        "tag": "social media"
      },
      {
        "tag": "politics"
      },
      {
        "tag": "breaking news"
      }
    ],
    "createdAt": "2026-08-24T00:19:06.684Z",
    "updatedAt": "2026-08-24T00:19:06.684Z"
  },
  {
    "id": "art-7",
    "title": "Biggest Tragedy JUST Happened in the USA! The Whole World is Shocked and Scared.",
    "slug": "biggest-tragedy-just-happened-in-the-usa-the-whole-world",
    "excerpt": "A devastating tragedy in the United States has left the global community in profound shock, raising urgent questions about societal safety and future stability.",
    "coverImage": {
      "id": "img-7",
      "filename": "pulefeed-scraped-7-1787561448411.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787513802762.jpeg",
      "alt": "Biggest Tragedy JUST Happened in the USA! The Whole World is Shocked and Scared."
    },
    "category": {
      "id": "cat-1",
      "name": "tragedy",
      "slug": "tragedy"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T19:36:39.461Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "tragedy"
      },
      {
        "tag": "breaking news"
      },
      {
        "tag": "united states"
      },
      {
        "tag": "global news"
      }
    ],
    "createdAt": "2026-08-23T19:36:39.461Z",
    "updatedAt": "2026-08-23T19:36:39.461Z"
  },
  {
    "id": "art-8",
    "title": "Teen Sentenced to 452 Years in Prison After He Ra..",
    "slug": "teen-sentenced-to-452-years-in-prison-after-he-ra-2",
    "excerpt": "nt in a world where the line between a child and a monster is blurred by the blood of the innocent. The courtroom became a stage where two versions of …",
    "coverImage": {
      "id": "img-8",
      "filename": "pulefeed-scraped-8-1787561448582.png",
      "url": "https://pulefeed.tech/media/Screenshot%202026-08-23%20123327.png",
      "alt": "Teen Sentenced to 452 Years in Prison After He Ra.."
    },
    "category": {
      "id": "cat-1",
      "name": "sentenced",
      "slug": "sentenced"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T19:31:26.560Z",
    "readTime": 2,
    "tags": [
      {
        "tag": "sentenced"
      },
      {
        "tag": "years"
      },
      {
        "tag": "prison"
      },
      {
        "tag": "phdailynewsorg"
      }
    ],
    "createdAt": "2026-08-23T19:31:26.560Z",
    "updatedAt": "2026-08-23T19:31:26.560Z"
  },
  {
    "id": "art-9",
    "title": "🛑 🔥 😱Powerful 7.7 Earthquake Shakes Parts of Asia",
    "slug": "powerful-7-7-earthquake-shakes-parts-of-asia",
    "excerpt": "A massive 7.7-magnitude earthquake struck parts of Asia early Monday, heavily impacting Myanmar, northern Thailand, and southern China with severe shaking.",
    "coverImage": {
      "id": "img-9",
      "filename": "pulefeed-scraped-9-1787561448674.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787511608181.jpeg",
      "alt": "🛑 🔥 😱Powerful 7.7 Earthquake Shakes Parts of Asia"
    },
    "category": {
      "id": "cat-1",
      "name": "earthquake",
      "slug": "earthquake"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T19:00:05.143Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "earthquake"
      },
      {
        "tag": "asia"
      },
      {
        "tag": "myanmar"
      },
      {
        "tag": "china"
      },
      {
        "tag": "disaster"
      }
    ],
    "createdAt": "2026-08-23T19:00:05.143Z",
    "updatedAt": "2026-08-23T19:00:05.143Z"
  },
  {
    "id": "art-10",
    "title": "“Kate Middleton: William’s announcement has just been revealed",
    "slug": "kate-middleton-williams-announcement-has-just-been-revealed",
    "excerpt": "Kate Middleton publicly praised Prince William at a recent royal charity event, showcasing their stronger-than-ever bond after navigating recent health...",
    "coverImage": {
      "id": "img-10",
      "filename": "pulefeed-scraped-10-1787561448747.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787511521448.jpeg",
      "alt": "“Kate Middleton: William’s announcement has just been revealed"
    },
    "category": {
      "id": "cat-1",
      "name": "kate middleton",
      "slug": "kate middleton"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T18:58:38.074Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "kate middleton"
      },
      {
        "tag": "prince william"
      },
      {
        "tag": "royal family"
      },
      {
        "tag": "uk news"
      }
    ],
    "createdAt": "2026-08-23T18:58:38.074Z",
    "updatedAt": "2026-08-23T18:58:38.074Z"
  },
  {
    "id": "art-11",
    "title": "Unbelievable: Woman caught having s…",
    "slug": "unbelievable-woman-caught-having",
    "excerpt": "Viral footage of a woman's unexpected public encounter sparked intense online outrage and rapid social media sharing across multiple platforms yesterday.",
    "coverImage": {
      "id": "img-11",
      "filename": "pulefeed-scraped-11-1787561448932.png",
      "url": "https://pulefeed.tech/media/scraped-1787509458268.png",
      "alt": "Unbelievable: Woman caught having s…"
    },
    "category": {
      "id": "cat-1",
      "name": "viral news",
      "slug": "viral news"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T18:24:05.615Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "viral news"
      },
      {
        "tag": "social media"
      },
      {
        "tag": "privacy"
      },
      {
        "tag": "controversy"
      }
    ],
    "createdAt": "2026-08-23T18:24:05.615Z",
    "updatedAt": "2026-08-23T18:24:05.615Z"
  },
  {
    "id": "art-12",
    "title": "Dozens Of Republicans Back Bill To Legalize Non-Citizen Farm Workers",
    "slug": "dozens-of-republicans-back-bill-to-legalize-non-citizen-farm-workers",
    "excerpt": "President Donald Trump handily defeated Vice President Kamala Harris in 2024, running on a core set of objectives that included stringent border security and...",
    "coverImage": {
      "id": "img-12",
      "filename": "pulefeed-scraped-12-1787561449011.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787508625842.jpeg",
      "alt": "Dozens Of Republicans Back Bill To Legalize Non-Citizen Farm Workers"
    },
    "category": {
      "id": "cat-1",
      "name": "dozens",
      "slug": "dozens"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T18:10:22.084Z",
    "readTime": 4,
    "tags": [
      {
        "tag": "dozens"
      },
      {
        "tag": "republicans"
      },
      {
        "tag": "legalize"
      },
      {
        "tag": "noncitizen"
      }
    ],
    "createdAt": "2026-08-23T18:10:22.084Z",
    "updatedAt": "2026-08-23T18:10:22.084Z"
  },
  {
    "id": "art-13",
    "title": "(-) ABC Anchor Admits Truth As Trump’s DC Crackdown Yields Big Results..",
    "slug": "-abc-anchor-admits-truth-as-trumps-dc-crackdown-yields-big-results",
    "excerpt": "Trump's federal DC crackdown sparks intense debate, offering residents improved safety while simultaneously inducing fear among immigrant communities.",
    "coverImage": {
      "id": "img-13",
      "filename": "pulefeed-scraped-13-1787561450091.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787508471693.jpeg",
      "alt": "(-) ABC Anchor Admits Truth As Trump’s DC Crackdown Yields Big Results.."
    },
    "category": {
      "id": "cat-1",
      "name": "washington dc",
      "slug": "washington dc"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T18:07:48.280Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "washington dc"
      },
      {
        "tag": "crime crackdown"
      },
      {
        "tag": "national security"
      },
      {
        "tag": "civil liberties"
      }
    ],
    "createdAt": "2026-08-23T18:07:48.280Z",
    "updatedAt": "2026-08-23T18:07:48.280Z"
  },
  {
    "id": "art-14",
    "title": "BREAKING: Shocking reports are circulating that a Russian Su-57 stealth fighter pilot has allegedly carried out a devastating strike on a…",
    "slug": "breaking-shocking-reports-are-circulating-that-a-russian-su-57-stealth",
    "excerpt": "A Russian Su-57 pilot allegedly executed a devastating strike on a fortified target, baffling defense systems and shocking global analysts.",
    "coverImage": {
      "id": "img-14",
      "filename": "pulefeed-scraped-14-1787561450166.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787508415645.jpeg",
      "alt": "BREAKING: Shocking reports are circulating that a Russian Su-57 stealth fighter pilot has allegedly carried out a devastating strike on a…"
    },
    "category": {
      "id": "cat-1",
      "name": "military",
      "slug": "military"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T18:06:52.164Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "military"
      },
      {
        "tag": "russia"
      },
      {
        "tag": "geopolitics"
      },
      {
        "tag": "defense"
      },
      {
        "tag": "aviation"
      }
    ],
    "createdAt": "2026-08-23T18:06:52.164Z",
    "updatedAt": "2026-08-23T18:06:52.164Z"
  },
  {
    "id": "art-15",
    "title": "Trump Calls Karoline Leavitt “Irreplaceable” in Emotional Interview, Praising Her Loyalty, Service and Lasting Impact on His Administration",
    "slug": "trump-calls-karoline-leavitt-irreplaceable-in-emotional-interview",
    "excerpt": "President Trump praised outgoing White House Press Secretary Karoline Leavitt as irreplaceable during a recent emotional interview with Fox News.",
    "coverImage": {
      "id": "img-15",
      "filename": "pulefeed-scraped-15-1787561451404.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787496108374.jpeg",
      "alt": "Trump Calls Karoline Leavitt “Irreplaceable” in Emotional Interview, Praising Her Loyalty, Service and Lasting Impact on His Administration"
    },
    "category": {
      "id": "cat-1",
      "name": "trump",
      "slug": "trump"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T14:41:45.397Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "trump"
      },
      {
        "tag": "karoline leavitt"
      },
      {
        "tag": "white house"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-23T14:41:45.397Z",
    "updatedAt": "2026-08-23T14:41:45.397Z"
  },
  {
    "id": "art-16",
    "title": "‘The Five’ Co-Host Takes Break After Trump Attacks Her",
    "slug": "the-five-co-host-takes-break-after-trump-attacks-her",
    "excerpt": "Fox News co-host Jessica Tarlov took a Hawaii vacation after Donald Trump insulted her online following a heated debate on gun control laws.",
    "coverImage": {
      "id": "img-16",
      "filename": "pulefeed-scraped-16-1787561453075.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787496021176.jpeg",
      "alt": "‘The Five’ Co-Host Takes Break After Trump Attacks Her"
    },
    "category": {
      "id": "cat-1",
      "name": "jessica tarlov",
      "slug": "jessica tarlov"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T14:40:18.237Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "jessica tarlov"
      },
      {
        "tag": "fox news"
      },
      {
        "tag": "donald trump"
      },
      {
        "tag": "the five"
      },
      {
        "tag": "media"
      }
    ],
    "createdAt": "2026-08-23T14:40:18.237Z",
    "updatedAt": "2026-08-23T14:40:18.237Z"
  },
  {
    "id": "art-17",
    "title": "Rising Tensions Between the United States and Iran: Strategic Options, Military Planning, and Global Implications",
    "slug": "rising-tensions-between-the-united-states-and-iran-strategic",
    "excerpt": "US-Iran tensions escalate over nuclear programs and regional influence, prompting global strategic evaluations and military planning concerns.",
    "coverImage": {
      "id": "img-17",
      "filename": "pulefeed-scraped-17-1787561453178.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787495903914.jpeg",
      "alt": "Rising Tensions Between the United States and Iran: Strategic Options, Military Planning, and Global Implications"
    },
    "category": {
      "id": "cat-1",
      "name": "us-iran tensions",
      "slug": "us-iran tensions"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T14:38:17.689Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "us-iran tensions"
      },
      {
        "tag": "nuclear program"
      },
      {
        "tag": "global politics"
      },
      {
        "tag": "military strategy"
      }
    ],
    "createdAt": "2026-08-23T14:38:17.689Z",
    "updatedAt": "2026-08-23T14:38:17.689Z"
  },
  {
    "id": "art-18",
    "title": "🚨👏🏾Melania Trump Has the Perfect Comeback to the Media’s Latest Goofball Obsession",
    "slug": "melania-trump-has-the-perfect-comeback-to-the-medias",
    "excerpt": "I’ve said it before and I’m saying it again – you can’t hate our media enough. The press corps spent weeks generating breathless coverage about where first...",
    "coverImage": {
      "id": "img-18",
      "filename": "pulefeed-scraped-18-1787561454222.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787491277459.jpeg",
      "alt": "🚨👏🏾Melania Trump Has the Perfect Comeback to the Media’s Latest Goofball Obsession"
    },
    "category": {
      "id": "cat-1",
      "name": "melania",
      "slug": "melania"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T13:20:47.845Z",
    "readTime": 3,
    "tags": [
      {
        "tag": "melania"
      },
      {
        "tag": "trump"
      },
      {
        "tag": "perfect"
      },
      {
        "tag": "comeback"
      }
    ],
    "createdAt": "2026-08-23T13:20:47.845Z",
    "updatedAt": "2026-08-23T13:20:47.845Z"
  },
  {
    "id": "art-19",
    "title": "Musk Expected To Spend Up To $200M To Boost GOP In Midterms.",
    "slug": "musk-expected-to-spend-up-to-200m-to-boost-gop-in-midterms",
    "excerpt": "Tech billionaire Elon Musk plans to spend up to $200 million relaunching America PAC to boost Republican candidates in the upcoming midterm elections.",
    "coverImage": {
      "id": "img-19",
      "filename": "pulefeed-scraped-19-1787561455759.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787491180174.jpeg",
      "alt": "Musk Expected To Spend Up To $200M To Boost GOP In Midterms."
    },
    "category": {
      "id": "cat-1",
      "name": "elon musk",
      "slug": "elon musk"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T13:19:31.977Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "elon musk"
      },
      {
        "tag": "gop"
      },
      {
        "tag": "midterms"
      },
      {
        "tag": "america pac"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-23T13:19:31.977Z",
    "updatedAt": "2026-08-23T13:19:31.977Z"
  },
  {
    "id": "art-20",
    "title": "Police find girl missing since 2022 She was n, See more! Read full story",
    "slug": "police-find-girl-missing-since-2022-she-was-n-see-more-read-full-story",
    "excerpt": "Police successfully recovered a young girl missing since 2022 after years of continuous investigation and persistent investigative work by law enforcement.",
    "coverImage": {
      "id": "img-20",
      "filename": "pulefeed-scraped-20-1787561457024.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787491025139.jpeg",
      "alt": "Police find girl missing since 2022 She was n, See more! Read full story"
    },
    "category": {
      "id": "cat-1",
      "name": "police",
      "slug": "police"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T13:17:00.636Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "police"
      },
      {
        "tag": "missing person"
      },
      {
        "tag": "investigation"
      },
      {
        "tag": "news"
      }
    ],
    "createdAt": "2026-08-23T13:17:00.636Z",
    "updatedAt": "2026-08-23T13:17:00.636Z"
  },
  {
    "id": "art-21",
    "title": "Blockbuster New Poll Reveals Who GOP Voters Prefer For 2028",
    "slug": "blockbuster-new-poll-reveals-who-gop-voters-prefer-for-2028",
    "excerpt": "A new straw poll reveals Marco Rubio and JD Vance emerging as early Republican frontrunners for the 2028 presidential nomination ticket.",
    "coverImage": {
      "id": "img-21",
      "filename": "pulefeed-scraped-21-1787561457119.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787490578298.jpeg",
      "alt": "Blockbuster New Poll Reveals Who GOP Voters Prefer For 2028"
    },
    "category": {
      "id": "cat-1",
      "name": "gop 2028",
      "slug": "gop 2028"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T13:09:22.261Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "gop 2028"
      },
      {
        "tag": "marco rubio"
      },
      {
        "tag": "jd vance"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-23T13:09:22.261Z",
    "updatedAt": "2026-08-23T13:09:22.261Z"
  },
  {
    "id": "art-22",
    "title": "Mexican president states that Trump is not.",
    "slug": "mexican-president-states-that-trump-is",
    "excerpt": "US strikes on Iranian nuclear facilities spark fears of retaliation as Tehran warns it reserves all options in response to the aggressive military action.",
    "coverImage": {
      "id": "img-22",
      "filename": "pulefeed-scraped-22-1787561457235.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787490151904.jpeg",
      "alt": "Mexican president states that Trump is not."
    },
    "category": {
      "id": "cat-1",
      "name": "iran",
      "slug": "iran"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T13:02:13.277Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "iran"
      },
      {
        "tag": "middle east"
      },
      {
        "tag": "donald trump"
      },
      {
        "tag": "geopolitics"
      }
    ],
    "createdAt": "2026-08-23T13:02:13.277Z",
    "updatedAt": "2026-08-23T13:02:13.277Z"
  },
  {
    "id": "art-23",
    "title": "Veteran Owner of Iconic ‘Trump House’ Dies After Vicious Alleged Beating",
    "slug": "veteran-owner-of-iconic-trump-house-dies-after-vicious-alleged-beating",
    "excerpt": "Kerry Sheron, 69-year-old veteran and owner of a famous California Trump-themed house, died Sunday following a brutal alleged beating outside his residence.",
    "coverImage": {
      "id": "img-23",
      "filename": "pulefeed-scraped-23-1787561458623.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787455276151.jpeg",
      "alt": "Veteran Owner of Iconic ‘Trump House’ Dies After Vicious Alleged Beating"
    },
    "category": {
      "id": "cat-1",
      "name": "news",
      "slug": "news"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T03:21:11.370Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "news"
      },
      {
        "tag": "crime"
      },
      {
        "tag": "california"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-23T03:21:11.370Z",
    "updatedAt": "2026-08-23T03:21:11.370Z"
  },
  {
    "id": "art-24",
    "title": "TWO HOURS AGO! US MILITARY AMMUNITION SHIP SINKS WITH 10 TONS OF WEAPONS — WHAT REALLY HAPPENED IN THE DARK WATERS…",
    "slug": "two-hours-ago-us-military-ammunition-ship-sinks",
    "excerpt": "A US military cargo ship carrying ten tons of classified ammunition abruptly sank in dark waters, triggering intense speculation and unanswered questions.",
    "coverImage": {
      "id": "img-24",
      "filename": "pulefeed-scraped-24-1787561460150.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787452056915.jpeg",
      "alt": "TWO HOURS AGO! US MILITARY AMMUNITION SHIP SINKS WITH 10 TONS OF WEAPONS — WHAT REALLY HAPPENED IN THE DARK WATERS…"
    },
    "category": {
      "id": "cat-1",
      "name": "military",
      "slug": "military"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T02:27:31.045Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "military"
      },
      {
        "tag": "navy"
      },
      {
        "tag": "accident"
      },
      {
        "tag": "shipping"
      }
    ],
    "createdAt": "2026-08-23T02:27:31.045Z",
    "updatedAt": "2026-08-23T02:27:31.045Z"
  },
  {
    "id": "art-25",
    "title": "30 Minutes ago in Florida, Pam Bondi was confirmed as…",
    "slug": "30-minutes-ago-in-florida-pam-bondi-was-confirmed",
    "excerpt": "Pam Bondi was confirmed in Florida today, stepping into a powerful role that promises to reshape American justice amidst intense political scrutiny.",
    "coverImage": {
      "id": "img-25",
      "filename": "pulefeed-scraped-25-1787561461285.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787451929237.jpeg",
      "alt": "30 Minutes ago in Florida, Pam Bondi was confirmed as…"
    },
    "category": {
      "id": "cat-1",
      "name": "florida",
      "slug": "florida"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T02:25:22.906Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "florida"
      },
      {
        "tag": "pam bondi"
      },
      {
        "tag": "politics"
      },
      {
        "tag": "justice"
      }
    ],
    "createdAt": "2026-08-23T02:25:22.906Z",
    "updatedAt": "2026-08-23T02:25:22.906Z"
  },
  {
    "id": "art-26",
    "title": "White House Physician Releases Trump Health Update",
    "slug": "white-house-physician-releases-trump-health",
    "excerpt": "President Trump is in excellent health and fully fit for office, according to a comprehensive medical report released Friday by Walter Reed.",
    "coverImage": {
      "id": "img-26",
      "filename": "pulefeed-scraped-26-1787561461365.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787451692320.jpeg",
      "alt": "White House Physician Releases Trump Health Update"
    },
    "category": {
      "id": "cat-1",
      "name": "donald trump",
      "slug": "donald trump"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T02:21:18.843Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "donald trump"
      },
      {
        "tag": "white house"
      },
      {
        "tag": "health update"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-23T02:21:18.843Z",
    "updatedAt": "2026-08-23T02:21:18.843Z"
  },
  {
    "id": "art-27",
    "title": "Schiff Says ‘Very Likely’ Dems Will Subpoena Trump Family Members",
    "slug": "schiff-says-very-likely-dems-will-subpoena-trump-family-members",
    "excerpt": "Democrat Adam Schiff stated that Congress will likely subpoena Donald Trump's family members over foreign business and crypto corruption if they retake power.",
    "coverImage": {
      "id": "img-27",
      "filename": "pulefeed-scraped-27-1787561462395.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787448270157.jpeg",
      "alt": "Schiff Says ‘Very Likely’ Dems Will Subpoena Trump Family Members"
    },
    "category": {
      "id": "cat-1",
      "name": "politics",
      "slug": "politics"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T01:24:24.018Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "politics"
      },
      {
        "tag": "congress"
      },
      {
        "tag": "investigations"
      },
      {
        "tag": "democrats"
      }
    ],
    "createdAt": "2026-08-23T01:24:24.018Z",
    "updatedAt": "2026-08-23T01:24:24.018Z"
  },
  {
    "id": "art-28",
    "title": "Trump Issues Statement Regarding Health of Mitch McConnell",
    "slug": "trump-makes-new-claim-about-irans-supreme-leader-after",
    "excerpt": "President Trump stated he has no updates on hospitalized GOP Senator Mitch McConnell, as Kentucky Governor Andy Beshear formally demands health transparency.",
    "coverImage": {
      "id": "img-28",
      "filename": "pulefeed-scraped-28-1787561463910.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787448045867.jpeg",
      "alt": "Trump Issues Statement Regarding Health of Mitch McConnell"
    },
    "category": {
      "id": "cat-1",
      "name": "politics",
      "slug": "politics"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T01:20:42.226Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "politics"
      },
      {
        "tag": "senate"
      },
      {
        "tag": "mitch mcconnell"
      },
      {
        "tag": "trump"
      }
    ],
    "createdAt": "2026-08-23T01:20:42.226Z",
    "updatedAt": "2026-08-23T01:20:42.226Z"
  },
  {
    "id": "art-29",
    "title": "Hillary Clinton Warns Trump Officials That Accountability Is Coming",
    "slug": "hillary-clinton-warns-trump-officials-that-accountability-is",
    "excerpt": "Former Secretary of State Hillary Clinton is calling for greater accountability from U.S. leadership while warning that the country is now in a weakened...",
    "coverImage": {
      "id": "img-29",
      "filename": "pulefeed-scraped-29-1787561465258.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787447835948.jpeg",
      "alt": "Hillary Clinton Warns Trump Officials That Accountability Is Coming"
    },
    "category": {
      "id": "cat-1",
      "name": "hillary",
      "slug": "hillary"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-23T01:17:12.484Z",
    "readTime": 3,
    "tags": [
      {
        "tag": "hillary"
      },
      {
        "tag": "clinton"
      },
      {
        "tag": "warns"
      },
      {
        "tag": "trump"
      }
    ],
    "createdAt": "2026-08-23T01:17:12.484Z",
    "updatedAt": "2026-08-23T01:17:12.484Z"
  },
  {
    "id": "art-30",
    "title": "Breaking New: 13 Countries Join",
    "slug": "breaking-new-13-countries-join",
    "excerpt": "Thirteen nations join forces as the European Union urgently races to upgrade its military defenses amid rising geopolitical threats.",
    "coverImage": {
      "id": "img-30",
      "filename": "pulefeed-scraped-30-1787561465385.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787438888305.jpeg",
      "alt": "Breaking New: 13 Countries Join"
    },
    "category": {
      "id": "cat-1",
      "name": "europe",
      "slug": "europe"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T22:48:04.446Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "europe"
      },
      {
        "tag": "defense"
      },
      {
        "tag": "nato"
      },
      {
        "tag": "ukraine"
      }
    ],
    "createdAt": "2026-08-22T22:48:04.446Z",
    "updatedAt": "2026-08-22T22:48:04.446Z"
  },
  {
    "id": "art-31",
    "title": "Trump Just Got Real Inventive With Iran Over Strait of Hormuz – Sounds Like We’ve Annexed It",
    "slug": "trump-just-got-real-inventive-with-iran-over-strait-of-hormuz-sounds-like-weve-annexed-it",
    "excerpt": "President Trump confirmed a strict U.S. naval blockade enforcing total control over the vital Strait of Hormuz amid escalating tensions.",
    "coverImage": {
      "id": "img-31",
      "filename": "pulefeed-scraped-31-1787561465490.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787438824134.jpeg",
      "alt": "Trump Just Got Real Inventive With Iran Over Strait of Hormuz – Sounds Like We’ve Annexed It"
    },
    "category": {
      "id": "cat-1",
      "name": "trump",
      "slug": "trump"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T22:47:00.567Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "trump"
      },
      {
        "tag": "iran"
      },
      {
        "tag": "strait of hormuz"
      },
      {
        "tag": "military"
      }
    ],
    "createdAt": "2026-08-22T22:47:00.567Z",
    "updatedAt": "2026-08-22T22:47:00.567Z"
  },
  {
    "id": "art-32",
    "title": "Fort Bend County Judge Found Guilty On Money Laundering Charges.",
    "slug": "fort-bend-county-judge-found-guilty-on-money-laundering-charges",
    "excerpt": "A Fort Bend County jury found County Judge KP George guilty on two counts of money laundering, for which he is facing two to ten years behind bars. KP George …",
    "coverImage": {
      "id": "img-32",
      "filename": "pulefeed-scraped-32-1787561466735.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787438666618.jpeg",
      "alt": "Fort Bend County Judge Found Guilty On Money Laundering Charges."
    },
    "category": {
      "id": "cat-1",
      "name": "county",
      "slug": "county"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T22:44:22.897Z",
    "readTime": 4,
    "tags": [
      {
        "tag": "county"
      },
      {
        "tag": "judge"
      },
      {
        "tag": "found"
      },
      {
        "tag": "guilty"
      }
    ],
    "createdAt": "2026-08-22T22:44:22.897Z",
    "updatedAt": "2026-08-22T22:44:22.897Z"
  },
  {
    "id": "art-33",
    "title": "BREAKING: Hegseth’s Wife Reportedly Travels With Him Amid Claims She Helps Keep Him From Drinking",
    "slug": "breaking-hegseths-wife-reportedly-travels-with-him-amid-claims",
    "excerpt": "Defense Secretary Pete Hegseth travels constantly with his wife, who aids official duties and reportedly helps him manage his alcohol abuse.",
    "coverImage": {
      "id": "img-33",
      "filename": "pulefeed-scraped-33-1787561466832.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787437234849.jpeg",
      "alt": "BREAKING: Hegseth’s Wife Reportedly Travels With Him Amid Claims She Helps Keep Him From Drinking"
    },
    "category": {
      "id": "cat-1",
      "name": "defense department",
      "slug": "defense department"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T22:20:31.451Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "defense department"
      },
      {
        "tag": "politics"
      },
      {
        "tag": "national security"
      },
      {
        "tag": "government"
      }
    ],
    "createdAt": "2026-08-22T22:20:31.451Z",
    "updatedAt": "2026-08-22T22:20:31.451Z"
  },
  {
    "id": "art-34",
    "title": "👉🏾💥BREAKING: Shocking reports are circulating that a Russian Su-57 stealth fighter pilot has allegedly carried out a devastating strike on a….",
    "slug": "breaking-shocking-reports-are-circulating-that-a-russian",
    "excerpt": "Unconfirmed reports claim a Russian Su-57 pilot launched a devastating strike on a fortified vessel, sparking global defense concerns.",
    "coverImage": {
      "id": "img-34",
      "filename": "pulefeed-scraped-34-1787561466911.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787437101575.jpeg",
      "alt": "👉🏾💥BREAKING: Shocking reports are circulating that a Russian Su-57 stealth fighter pilot has allegedly carried out a devastating strike on a…."
    },
    "category": {
      "id": "cat-1",
      "name": "defense",
      "slug": "defense"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T22:17:40.631Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "defense"
      },
      {
        "tag": "military"
      },
      {
        "tag": "geopolitics"
      },
      {
        "tag": "russia"
      },
      {
        "tag": "conflict"
      }
    ],
    "createdAt": "2026-08-22T22:17:40.631Z",
    "updatedAt": "2026-08-22T22:17:40.631Z"
  },
  {
    "id": "art-35",
    "title": "JD Vance was confirmed as…",
    "slug": "jd-vance-was-confirmed-as-8",
    "excerpt": "Armed intruder Cole Tomas Allen was arrested after storming the Washington Hilton during the White House Correspondents’ Dinner on April 25, 2026.",
    "coverImage": {
      "id": "img-35",
      "filename": "pulefeed-scraped-35-1787561467034.png",
      "url": "https://pulefeed.tech/media/scraped-1787411086510.png",
      "alt": "JD Vance was confirmed as…"
    },
    "category": {
      "id": "cat-1",
      "name": "security",
      "slug": "security"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T15:04:41.250Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "security"
      },
      {
        "tag": "white house"
      },
      {
        "tag": "crime"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-22T15:04:41.250Z",
    "updatedAt": "2026-08-22T15:04:41.250Z"
  },
  {
    "id": "art-36",
    "title": "Judge Assigned to Fired FBI Director James Comey’s Case",
    "slug": "judge-assigned-to-fired-fbi-director-james-comey",
    "excerpt": "U.S. District Judge Louise W. Flanagan has been assigned to oversee the new criminal case involving fired FBI Director James Comey.",
    "coverImage": {
      "id": "img-36",
      "filename": "pulefeed-scraped-36-1787561467116.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787410898733.jpeg",
      "alt": "Judge Assigned to Fired FBI Director James Comey’s Case"
    },
    "category": {
      "id": "cat-1",
      "name": "james comey",
      "slug": "james comey"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Editorial Desk",
      "slug": "instantlyfeed-editorial",
      "role": "Senior Newsroom Desk",
      "bio": "Latest breaking political and international reporting from the InstantlyFeed news team.",
      "email": "news@instantlyfeed.com"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T15:00:30.886Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "james comey"
      },
      {
        "tag": "fbi"
      },
      {
        "tag": "justice department"
      },
      {
        "tag": "politics"
      },
      {
        "tag": "legal news"
      }
    ],
    "createdAt": "2026-08-22T15:00:30.886Z",
    "updatedAt": "2026-08-22T15:00:30.886Z"
  },
  {
    "id": "art-37",
    "title": "Trump Makes New Claim About Iran’s Supreme Leader After U.S. Strikes",
    "slug": "trump-makes-new-claim-about-irans-supreme-leader-after-us",
    "excerpt": "President Donald Trump delivered a stunning update on the situation in Iran, claiming that Supreme Leader Mojtaba Khamenei is “90% gone” following intense...",
    "coverImage": {
      "id": "img-37",
      "filename": "pulefeed-scraped-37-1787561467204.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787410628807.jpeg",
      "alt": "Trump Makes New Claim About Iran’s Supreme Leader After U.S. Strikes"
    },
    "category": {
      "id": "cat-1",
      "name": "trump",
      "slug": "trump"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T14:56:03.644Z",
    "readTime": 2,
    "tags": [
      {
        "tag": "trump"
      },
      {
        "tag": "makes"
      },
      {
        "tag": "claim"
      },
      {
        "tag": "irans"
      }
    ],
    "createdAt": "2026-08-22T14:56:03.644Z",
    "updatedAt": "2026-08-22T14:56:03.644Z"
  },
  {
    "id": "art-38",
    "title": "Chilling Update Released By Police...See more",
    "slug": "chilling-update-released-by-polices",
    "excerpt": "Long-serving GOP Sen. Lindsey Graham, 71, of South Carolina passed away early Sunday, stunning President Donald Trump and the political establishment from...",
    "coverImage": {
      "id": "img-38",
      "filename": "pulefeed-scraped-38-1787561467990.png",
      "url": "https://pulefeed.tech/media/scraped-1787406649159.png",
      "alt": "Chilling Update Released By Police...See more"
    },
    "category": {
      "id": "cat-1",
      "name": "chilling",
      "slug": "chilling"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T13:50:45.791Z",
    "readTime": 4,
    "tags": [
      {
        "tag": "chilling"
      },
      {
        "tag": "update"
      },
      {
        "tag": "released"
      },
      {
        "tag": "policesee"
      }
    ],
    "createdAt": "2026-08-22T13:50:45.791Z",
    "updatedAt": "2026-08-22T13:50:45.791Z"
  },
  {
    "id": "art-39",
    "title": "Ashley Biden Files For Divorce From Husband After 13 Years",
    "slug": "ashley-biden-files-for-divorce-from-husband-after-13",
    "excerpt": "Ashley Biden has filed for divorce from her plastic surgeon husband, Dr. Howard Krein, after thirteen years of marriage in Philadelphia.",
    "coverImage": {
      "id": "img-39",
      "filename": "pulefeed-scraped-39-1787561469202.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787406523020.jpeg",
      "alt": "Ashley Biden Files For Divorce From Husband After 13 Years"
    },
    "category": {
      "id": "cat-1",
      "name": "ashley biden",
      "slug": "ashley biden"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T13:48:40.255Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "ashley biden"
      },
      {
        "tag": "divorce"
      },
      {
        "tag": "celebrity news"
      },
      {
        "tag": "politics"
      }
    ],
    "createdAt": "2026-08-22T13:48:40.255Z",
    "updatedAt": "2026-08-22T13:48:40.255Z"
  },
  {
    "id": "art-40",
    "title": "Trump Calls Karoline Leavitt “Irreplaceable” in Emotional Interview, Praising Her Loyalty, Service and Lasting Impact on His Administration",
    "slug": "trump-calls-karoline-leavitt-irreplaceable-in-emotional",
    "excerpt": "President Trump called outgoing press secretary Karoline Leavitt irreplaceable during an emotional and humorous interview on Monday.",
    "coverImage": {
      "id": "img-40",
      "filename": "pulefeed-scraped-40-1787561470491.jpg",
      "url": "https://pulefeed.tech/media/scraped-1787406355008.jpeg",
      "alt": "Trump Calls Karoline Leavitt “Irreplaceable” in Emotional Interview, Praising Her Loyalty, Service and Lasting Impact on His Administration"
    },
    "category": {
      "id": "cat-1",
      "name": "politics",
      "slug": "politics"
    },
    "author": {
      "id": "author-1",
      "name": "InstantlyFeed Newsroom",
      "slug": "pulefeed-stuff",
      "role": "International News Network",
      "bio": "Latest news, analysis and features from Al Jazeera's global network.",
      "email": "news@aljazeera.net"
    },
    "status": "published",
    "isBreaking": true,
    "isFeatured": false,
    "language": "en",
    "publishedAt": "2026-08-22T13:45:48.613Z",
    "readTime": 1,
    "tags": [
      {
        "tag": "politics"
      },
      {
        "tag": "donald trump"
      },
      {
        "tag": "karoline leavitt"
      },
      {
        "tag": "white house"
      }
    ],
    "createdAt": "2026-08-22T13:45:48.613Z",
    "updatedAt": "2026-08-22T13:45:48.613Z"
  }
]

export const mockArticles: Article[] = legacyMockArticles.map((article) => ({
  ...article,
  author: article.author && typeof article.author === 'object'
    ? {
        ...article.author,
        name: article.author.name.replace(/InstantlyFeed/gi, 'The National Feed'),
        slug: article.author.slug.replace(/(?:pulefeed-stuff|instantlyfeed-editorial)/gi, 'thenationalfeed-newsroom'),
        bio: article.author.bio?.replace(/InstantlyFeed/gi, 'The National Feed'),
        email: article.author.email?.replace(/(?:instantlyfeed|uspolicybrief)\.com$/i, 'thenationalfeed.com'),
      }
    : article.author,
}))

export const mockLiveUpdates = [
  {
    id: 'live-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    headline: 'House Passes Landmark Bipartisan Housing Legislation',
    body: 'Lawmakers vote overwhelmingly in favor of expanding affordable housing credits and restricting institutional bulk acquisitions.',
    isBreaking: true,
  },
  {
    id: 'live-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    headline: 'Congressional briefing on border trade infrastructure scheduled',
    body: 'A joint committee will convene to discuss supply chain modernization and agricultural labor protections.',
    isBreaking: false,
  },
]
