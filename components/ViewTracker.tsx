'use client'

import { useEffect } from 'react'

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog/${slug}/view`, { method: 'POST' }).catch(() => {})
  // only fire once per mount — intentionally no dependency on slug changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
