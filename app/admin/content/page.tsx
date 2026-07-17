'use client'

import { useState } from 'react'
import HeroTab     from './_HeroTab'
import AboutTab    from './_AboutTab'
import SkillsTab   from './_SkillsTab'
import ServicesTab from './_ServicesTab'
import ProcessTab  from './_ProcessTab'
import FaqTab      from './_FaqTab'
import ContactTab  from './_ContactTab'
import SeoTab          from './_SeoTab'
import TestimonialsTab from './_TestimonialsTab'
import FooterTab       from './_FooterTab'

const TABS = [
  { key: 'hero',         label: 'Hero'         },
  { key: 'about',        label: 'About'        },
  { key: 'skills',       label: 'Skills'       },
  { key: 'services',     label: 'Services'     },
  { key: 'process',      label: 'Process'      },
  { key: 'faq',          label: 'FAQ'          },
  { key: 'contact',      label: 'Contact'      },
  { key: 'footer',       label: 'Footer'       },
  { key: 'seo',          label: 'SEO'          },
  { key: 'testimonials', label: 'Testimonials' },
] as const

type TabKey = typeof TABS[number]['key']

export default function ContentPage() {
  const [tab, setTab] = useState<TabKey>('hero')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Site Content</h1>
        <p className="text-sm text-slate-500 mt-1">Edit all public-facing content. Changes take effect immediately on save.</p>
      </div>

      {/* Tab bar */}
      <div className="relative mb-8 border-b border-white/[0.06]">
        <div
          className="flex items-center gap-1 overflow-x-auto pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px ${
                tab === t.key
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-[1px] w-12 bg-gradient-to-l from-dark-950 to-transparent" />
      </div>

      {/* Tab content */}
      {tab === 'hero'     && <HeroTab />}
      {tab === 'about'    && <AboutTab />}
      {tab === 'skills'   && <SkillsTab />}
      {tab === 'services' && <ServicesTab />}
      {tab === 'process'  && <ProcessTab />}
      {tab === 'faq'      && <FaqTab />}
      {tab === 'contact'  && <ContactTab />}
      {tab === 'footer'   && <FooterTab />}
      {tab === 'seo'          && <SeoTab />}
      {tab === 'testimonials' && <TestimonialsTab />}
    </div>
  )
}
