interface Props {
  title:       string
  slug:        string
  description: string
}

export default function SeoPreview({ title, slug, description }: Props) {
  const titleOver = title.length > 60
  const descOver  = description.length > 160

  return (
    <div>
      <div className="bg-white rounded-xl p-4 font-sans max-w-xl shadow-sm">
        {/* Breadcrumb */}
        <div className="text-xs text-[#0d652d] mb-1 truncate">
          aponder.dev › blog › {slug || 'post-slug'}
        </div>
        {/* Title */}
        <div className={`text-lg leading-snug mb-1 line-clamp-2 ${titleOver ? 'text-red-600' : 'text-[#1a0dab]'}`}>
          {title || 'Post title will appear here'}
        </div>
        {/* Date stamp Google adds */}
        <div className="text-xs text-[#70757a] mb-1">Jul 12, 2026 — </div>
        {/* Description */}
        <div className="text-sm text-[#4d5156] leading-relaxed line-clamp-2">
          {description || 'Your post excerpt or SEO description will appear here. Keep it under 160 characters for best results.'}
        </div>
      </div>

      {/* Character counters */}
      <div className="flex gap-4 mt-2 text-[11px] font-mono">
        <span className={titleOver ? 'text-red-400' : 'text-slate-600'}>
          Title {title.length}/60{titleOver && ' — too long'}
        </span>
        <span className={descOver ? 'text-red-400' : 'text-slate-600'}>
          Description {description.length}/160{descOver && ' — too long'}
        </span>
      </div>
    </div>
  )
}
