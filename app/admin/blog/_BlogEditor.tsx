'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Save, Eye, EyeOff, Upload, Loader2, ExternalLink, BarChart2, Search, Send } from 'lucide-react'
import SeoPreview from '@/components/SeoPreview'
import { useToast } from '../_AdminToastContext'

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

interface Post {
  id:          number
  title:       string
  slug:        string
  excerpt:     string
  content:     string
  coverImage:  string
  tags:        string
  published:   boolean
  publishedAt: string | null
  series:      string
  seriesOrder: number
  views?:      number
}

interface Props { post?: Post }

function toLocalDt(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function slugify(str: string) {
  return str.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const INPUT = 'w-full bg-dark-950 border border-white/[0.08] rounded-lg px-3.5 py-2.5 text-white placeholder-slate-700 focus:border-blue-500/40 focus:outline-none focus:ring-1 focus:ring-blue-500/20 text-sm transition-colors'

export default function BlogEditor({ post }: Props) {
  const router  = useRouter()
  const isEdit  = !!post
  const { toast } = useToast()

  const [title,       setTitle]       = useState(post?.title      ?? '')
  const [slug,        setSlug]        = useState(post?.slug       ?? '')
  const [excerpt,     setExcerpt]     = useState(post?.excerpt    ?? '')
  const [content,     setContent]     = useState(post?.content    ?? '')
  const [coverImage,  setCoverImage]  = useState(post?.coverImage ?? '')
  const [tags,        setTags]        = useState(
    post ? (JSON.parse(post.tags || '[]') as string[]).join(', ') : ''
  )
  const [series,       setSeries]      = useState(post?.series      ?? '')
  const [seriesOrder,  setSeriesOrder] = useState(post?.seriesOrder ?? 0)
  const [published,    setPublished]   = useState(post?.published ?? false)
  const [publishedAt,  setPublishedAt] = useState(() => {
    if (!post?.publishedAt) return ''
    return new Date(post.publishedAt).toISOString().slice(0, 16)
  })
  const [slugEdited,  setSlugEdited]  = useState(isEdit)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [view,        setView]        = useState<'edit' | 'preview'>('edit')
  const [uploading,   setUploading]   = useState(false)
  const [showSeo,     setShowSeo]     = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [broadcastState, setBroadcastState] = useState<'idle' | 'confirming' | 'sending' | 'done' | 'error'>('idle')
  const [broadcastResult, setBroadcastResult] = useState<{ sent: number; total: number } | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!slugEdited && title) setSlug(slugify(title))
  }, [title, slugEdited])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setCoverImage(data.url)
      else setError(data.error ?? 'Upload failed.')
    } catch {
      setError('Upload failed.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      setError('Title and slug are required.')
      return
    }
    setSaving(true)
    setError('')

    const res = await fetch(
      isEdit ? `/api/admin/blog/${post!.id}` : '/api/admin/blog',
      {
        method:  isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          title: title.trim(), slug: slug.trim(), excerpt, content, coverImage,
          tags, published, publishedAt: publishedAt || undefined,
          series: series.trim(), seriesOrder: Number(seriesOrder),
        }),
      }
    )

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Failed to save.')
      setSaving(false)
      return
    }

    toast(isEdit ? 'Post updated' : 'Post created')
    setTimeout(() => {
      router.push('/admin/blog')
      router.refresh()
    }, 400)
  }

  const handleBroadcast = async () => {
    if (broadcastState === 'confirming') {
      setBroadcastState('sending')
      try {
        const res  = await fetch(`/api/admin/blog/${post!.id}/broadcast`, { method: 'POST' })
        const data = await res.json()
        if (res.ok) {
          setBroadcastResult(data)
          setBroadcastState('done')
        } else {
          setBroadcastState('error')
          setError(data.error ?? 'Broadcast failed.')
          setTimeout(() => setBroadcastState('idle'), 4000)
        }
      } catch {
        setBroadcastState('error')
        setError('Broadcast failed.')
        setTimeout(() => setBroadcastState('idle'), 4000)
      }
    } else {
      setBroadcastState('confirming')
    }
  }

  const handlePreview = async () => {
    if (!isEdit) return
    setPreviewLoading(true)
    try {
      const res  = await fetch(`/api/admin/preview/${post!.id}`, { method: 'POST' })
      const data = await res.json()
      if (data.token) {
        window.open(`/blog/preview/${data.token}`, '_blank', 'noopener')
      }
    } catch { /* ignore */ }
    setPreviewLoading(false)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="text-slate-500 hover:text-white transition-colors p-1">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Post' : 'New Post'}</h1>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Post title"
            className={INPUT}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Slug</label>
          <div className="flex items-center bg-dark-950 border border-white/[0.08] rounded-lg focus-within:border-blue-500/40 focus-within:ring-1 focus-within:ring-blue-500/20 transition-colors">
            <span className="pl-3.5 text-slate-600 text-sm flex-shrink-0">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
              placeholder="post-slug"
              className="flex-1 bg-transparent px-1 py-2.5 text-white placeholder-slate-700 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Short description for post previews…"
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Cover Image <span className="text-slate-700 normal-case tracking-normal font-normal">(used as OG image)</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.png or upload →"
              className={`${INPUT} flex-1`}
            />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Upload image"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-dark-900 border border-white/[0.08] rounded-lg text-slate-400 hover:text-white hover:border-blue-500/40 transition-all text-sm disabled:opacity-50 flex-shrink-0"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="Cover preview" className="mt-2 rounded-lg max-h-40 object-cover border border-white/[0.06]" />
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Tags</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="java, minecraft, paper  (comma-separated)"
            className={INPUT}
          />
        </div>

        {/* Series */}
        <div className="grid grid-cols-[1fr_140px] gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Series <span className="text-slate-700 normal-case tracking-normal font-normal">(optional — groups posts into a series)</span>
            </label>
            <input
              type="text"
              value={series}
              onChange={e => setSeries(e.target.value)}
              placeholder="e.g. Building Minecraft Plugins"
              className={INPUT}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Order</label>
            <input
              type="number"
              value={seriesOrder}
              onChange={e => setSeriesOrder(Number(e.target.value))}
              min={0}
              className={INPUT}
            />
          </div>
        </div>

        {/* Content — edit / preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Content <span className="text-slate-700 normal-case tracking-normal font-normal">(Markdown)</span>
            </label>
            <div className="flex items-center gap-1 bg-dark-950 border border-white/[0.08] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setView('edit')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  view === 'edit'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <EyeOff size={11} /> Edit
              </button>
              <button
                type="button"
                onClick={() => setView('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  view === 'preview'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Eye size={11} /> Preview
              </button>
            </div>
          </div>

          {view === 'edit' ? (
            <>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={24}
                placeholder="Write your post in Markdown…"
                className={`${INPUT} resize-y font-mono text-sm leading-relaxed`}
              />
              <p className="text-xs text-slate-700 mt-1.5 font-mono">
                {content.length} chars · {content.split(/\s+/).filter(Boolean).length} words
              </p>
            </>
          ) : (
            <div className="min-h-[480px] bg-dark-950 border border-white/[0.08] rounded-lg px-5 py-4 prose-blog overflow-auto">
              {content.trim() ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-slate-600 text-sm italic">Nothing to preview yet — write some Markdown in Edit mode.</p>
              )}
            </div>
          )}
        </div>

        {/* SEO Preview */}
        <div>
          <button
            type="button"
            onClick={() => setShowSeo(s => !s)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3"
          >
            <Search size={12} />
            {showSeo ? 'Hide' : 'Show'} SEO preview
          </button>
          {showSeo && (
            <SeoPreview title={title} slug={slug || 'post-slug'} description={excerpt} />
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                const next = !published
                setPublished(next)
                if (next && !publishedAt) setPublishedAt(toLocalDt(new Date()))
              }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-11 h-6 rounded-full transition-colors relative ${published ? 'bg-emerald-500' : 'bg-dark-700 border border-white/[0.1]'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm text-slate-300">
                {published && publishedAt && new Date(publishedAt) > new Date() ? 'Scheduled' : published ? 'Published' : 'Draft'}
              </span>
            </button>

            {published && (
              <div>
                <label className="block text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">Publish date</label>
                <input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={e => setPublishedAt(e.target.value)}
                  className="bg-dark-950 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-white text-xs focus:border-blue-500/40 focus:outline-none transition-colors"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {error && <span className="text-sm text-red-400">{error}</span>}

            {/* Broadcast to subscribers — only for live published posts */}
            {isEdit && post!.published && post!.publishedAt && new Date(post!.publishedAt) <= new Date() && (
              broadcastState === 'done' ? (
                <span className="text-xs text-emerald-400 font-mono">
                  Sent to {broadcastResult?.sent}/{broadcastResult?.total}!
                </span>
              ) : broadcastState === 'confirming' ? (
                <span className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Email all subscribers?</span>
                  <button
                    onClick={handleBroadcast}
                    className="text-xs px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 transition-all"
                  >
                    Yes, send
                  </button>
                  <button
                    onClick={() => setBroadcastState('idle')}
                    className="text-xs px-2 py-1 text-slate-500 hover:text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleBroadcast}
                  disabled={broadcastState === 'sending'}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-white/[0.08] text-slate-300 rounded-lg text-sm hover:text-white hover:border-emerald-500/30 transition-all disabled:opacity-50"
                  title="Email this post to all subscribers"
                >
                  {broadcastState === 'sending' ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Broadcast
                </button>
              )
            )}

            {isEdit && (
              <button
                type="button"
                onClick={handlePreview}
                disabled={previewLoading}
                className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-white/[0.08] text-slate-300 rounded-lg text-sm hover:text-white hover:border-blue-500/30 transition-all disabled:opacity-50"
                title="Open draft preview in new tab (link expires in 72h)"
              >
                {previewLoading ? <Loader2 size={13} className="animate-spin" /> : <ExternalLink size={13} />}
                Preview
              </button>
            )}

            {isEdit && (
              <a
                href={`/blog/${post!.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-dark-900 border border-white/[0.08] text-slate-300 rounded-lg text-sm hover:text-white hover:border-blue-500/30 transition-all"
                title="View live post"
              >
                <BarChart2 size={13} />
                {post!.views ?? 0} views
              </a>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-semibold hover:from-blue-500 hover:to-cyan-500 transition-all disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
