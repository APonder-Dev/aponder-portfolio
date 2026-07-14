'use client'

import Link from 'next/link'
import { ArrowRight, Eye, Calendar } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface RecentPost {
  id:          number
  title:       string
  slug:        string
  excerpt:     string
  tags:        string
  publishedAt: string | null
  views:       number
}

export default function RecentPosts({ posts }: { posts: RecentPost[] }) {
  const ref      = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  if (!posts.length) return null

  return (
    <section id="blog" className="relative py-20 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(59,130,246,0.05),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="section-label mb-4">Writing</div>
            <h2 className="text-4xl sm:text-5xl font-black text-white">
              From the <span className="gradient-text">blog.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
          >
            View all posts
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => {
            const tags = JSON.parse(post.tags || '[]') as string[]
            const date = post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : null

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.09 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-blue-500/25 hover:bg-blue-500/[0.03] p-6 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[11px] px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded font-mono border border-blue-500/15">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="text-[15px] font-bold text-white mb-2 leading-snug group-hover:text-blue-100 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.04]">
                    {date && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Calendar size={11} />
                        {date}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-slate-600 ml-auto">
                      <Eye size={11} />
                      {post.views.toLocaleString()}
                    </span>
                    <ArrowRight size={13} className="text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View all posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
