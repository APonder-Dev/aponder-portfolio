'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

export interface PostSummary {
  slug:        string
  title:       string
  excerpt:     string
  tags:        string[]
  publishedAt: string | null
  mins:        number
}

interface Props {
  posts:     PostSummary[]
  allTags:   string[]
  activeTag?: string
}

const POSTS_PER_PAGE = 10

export default function BlogList({ posts, allTags, activeTag: initialTag }: Props) {
  const [search,       setSearch]       = useState('')
  const [activeTag,    setActiveTag]    = useState(initialTag ?? '')
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE)
  }, [search, activeTag])

  const filtered = posts.filter(p => {
    const matchesTag    = !activeTag || p.tags.includes(activeTag)
    const q             = search.trim().toLowerCase()
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    return matchesTag && matchesSearch
  })

  const paged   = filtered.slice(0, visibleCount)
  const hasMore = filtered.length > visibleCount

  return (
    <>
      {/* Search + tag bar */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 bg-dark-900/60 border border-white/[0.07] rounded-lg text-sm text-white placeholder-slate-600 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-colors"
          />
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTag('')}
              className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-all ${
                !activeTag
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  : 'text-slate-500 border-white/[0.07] hover:text-slate-300 hover:border-white/[0.15]'
              }`}
            >
              all
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
                className={`text-xs px-3 py-1.5 rounded-lg font-mono border transition-all ${
                  activeTag === tag
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                    : 'text-slate-500 border-white/[0.07] hover:text-slate-300 hover:border-white/[0.15]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          {search ? `No posts matching "${search}".` : activeTag ? `No posts tagged "${activeTag}".` : 'No posts yet — check back soon.'}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paged.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-dark-900/60 rounded-xl border border-white/[0.06] p-6 hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-slate-400 mt-1.5 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className={`text-xs px-2 py-0.5 rounded font-mono border transition-colors ${
                            activeTag === tag
                              ? 'bg-blue-500/15 text-blue-400 border-blue-500/25'
                              : 'bg-white/[0.04] text-slate-500 border-white/[0.05]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="text-xs text-slate-600 font-mono">{post.mins} min read</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 whitespace-nowrap flex-shrink-0 pt-0.5">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <button
              onClick={() => setVisibleCount(c => c + POSTS_PER_PAGE)}
              className="mt-5 w-full py-3 text-sm text-slate-400 border border-white/[0.07] rounded-xl hover:text-white hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all font-medium"
            >
              Load more
              <span className="text-xs text-slate-600 ml-2 font-mono">({filtered.length - visibleCount} remaining)</span>
            </button>
          )}
        </>
      )}
    </>
  )
}
