import type { Metadata } from 'next'
import { LiveBadge } from '@/components/ui/LiveBadge'
import { LiveTimeline } from '@/components/sections/LiveTimeline'
import { LiveUpdate } from '@/types'
import { getArticles } from '@/lib/api-server'
import { Article } from '@/types'

export const metadata: Metadata = {
  title: 'Live Coverage — The National Feed',
  description: 'Follow breaking news and live coverage in real time from The National Feed.',
}

export const revalidate = 60

export default async function LivePage() {
  const { docs: articles } = await getArticles({ limit: 5 })

  // Currently live updates are not in the DB, so we return an empty array
  // to avoid build errors while removing mock data.
  const updates: LiveUpdate[] = [] 
  const latestUpdate = updates[0]

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        <div className="shimmer-bg absolute inset-0" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-3">
            <LiveBadge />
            <span
              className="label-caps text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Auto-refreshes every 30 seconds
            </span>
          </div>
          <h1
            className="font-display font-bold text-3xl sm:text-4xl mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Live Coverage
          </h1>
          <p
            className="text-base mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Stay tuned for live parliamentary sessions and breaking political developments.
          </p>
          <div className="flex items-center gap-4">
            <span className="label-caps text-sm" style={{ color: 'var(--text-muted)' }}>
              Standby for next broadcast
            </span>
            {latestUpdate && (
              <span className="label-caps text-sm" style={{ color: 'var(--accent-gold)' }}>
                Last update: {new Date(latestUpdate.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline - 65% */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              Live Timeline
            </h2>
            <span className="label-caps text-sm" style={{ color: 'var(--text-muted)' }}>
              0 updates
            </span>
          </div>
          {updates.length > 0 ? (
            <LiveTimeline updates={updates} />
          ) : (
            <div className="p-12 text-center rounded-xl bg-white/5 border border-dashed border-[var(--border)]">
              <p className="text-[var(--text-muted)] italic">No live updates at this time. Check back during scheduled sessions.</p>
            </div>
          )}
        </div>

        {/* Sticky Stats Panel - 35% */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 flex flex-col gap-5">
            {/* Related Articles */}
            <div
              className="p-5 rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h3 className="label-caps text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                Related Coverage
              </h3>
              <div className="flex flex-col gap-3">
                {(articles as Article[]).length > 0 ? (
                    (articles as Article[]).slice(0, 4).map((article) => (
                    <a
                        key={article.id}
                        href={`/article/${article.slug}`}
                        className="group flex flex-col gap-1 py-2 border-b last:border-0 hover:opacity-80 transition-opacity"
                        style={{ borderColor: 'var(--border-subtle)' }}
                    >

                        <span
                        className="font-display font-semibold text-sm leading-snug group-hover:text-[var(--accent-gold)] transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                        >
                        {article.title}
                        </span>
                    </a>
                    ))
                ) : (
                    <p className="text-xs text-[var(--text-muted)]">No related articles found.</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
