import Header      from '@/components/Header'
import Hero         from '@/components/Hero'
import About        from '@/components/About'
import Skills       from '@/components/Skills'
import Projects     from '@/components/Projects'
import Services     from '@/components/Services'
import Process      from '@/components/Process'
import RecentPosts  from '@/components/RecentPosts'
import Testimonials from '@/components/Testimonials'
import Pricing      from '@/components/Pricing'
import FAQ          from '@/components/FAQ'
import Contact      from '@/components/Contact'
import Footer       from '@/components/Footer'
import ScrollToTop  from '@/components/ScrollToTop'
import { db }       from '@/lib/db'
import type {
  HeroContent, AboutContent, SkillItem,
  ServiceItem, ProcessStep, FAQItem, ContactContent, TestimonialItem,
  PricingCategoryData, PricingPlanData,
} from '@/lib/content-types'
import type { Project } from '@/data/projects'

export const dynamic = 'force-dynamic'

async function getContent<T>(key: string): Promise<T | undefined> {
  try {
    const row = await db.siteContent.findUnique({ where: { key } })
    return row ? JSON.parse(row.value) as T : undefined
  } catch { return undefined }
}

export default async function Home() {
  let priceOverrides:   Record<string, string> = {}
  let hiddenProjectIds: string[]               = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let customProjects:   any[]                  = []

  let heroContent:       HeroContent                      | undefined
  let aboutContent:      AboutContent                     | undefined
  let skills:            SkillItem[]                      | undefined
  let services:          ServiceItem[]                    | undefined
  let processSteps:      ProcessStep[]                    | undefined
  let faqs:              FAQItem[]                        | undefined
  let contactContent:    ContactContent                   | undefined
  let projectOverrides:  Record<string, Partial<Project>> = {}
  let siteAvailable      = true
  let siteAvailableMsg   = 'Available for Projects'
  let resumeUrl          = ''
  let calUrl             = ''
  let testimonials:      TestimonialItem[]     | undefined
  let projectOrder:      string[]              = []
  let recentPosts:       { id: number; title: string; slug: string; excerpt: string; tags: string; publishedAt: string | null; views: number }[] = []
  let pricingCategories: PricingCategoryData[] = []
  let pricingPlans:      PricingPlanData[]     = []

  try {
    const [
      overrides, hides, customs,
      hero, about, skillsRow, servicesRow, processRow, faqRow, contactRow,
      projectOverridesRow, siteSettings, testimonialsRow, projectOrderRow,
      recentPostsRaw, pricingCatsRow, pricingPlansRow,
    ] = await Promise.all([
      db.priceOverride.findMany(),
      db.projectHide.findMany(),
      db.customProject.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
      getContent<HeroContent>('hero'),
      getContent<AboutContent>('about'),
      getContent<SkillItem[]>('skills'),
      getContent<ServiceItem[]>('services'),
      getContent<ProcessStep[]>('process'),
      getContent<FAQItem[]>('faq'),
      getContent<ContactContent>('contact'),
      getContent<Record<string, Partial<Project>>>('project_overrides'),
      getContent<{ available: boolean; availableMsg: string; resumeUrl: string; calUrl?: string }>('site_settings'),
      getContent<TestimonialItem[]>('testimonials'),
      getContent<string[]>('project_order'),
      db.post.findMany({
        where:   { published: true },
        orderBy: { publishedAt: 'desc' },
        take:    3,
        select:  { id: true, title: true, slug: true, excerpt: true, tags: true, publishedAt: true, views: true },
      }),
      getContent<PricingCategoryData[]>('pricing_categories'),
      getContent<PricingPlanData[]>('pricing_plans'),
    ])
    priceOverrides   = Object.fromEntries(overrides.map(o => [o.planId, o.price]))
    hiddenProjectIds = hides.map(h => h.projectId)
    customProjects   = customs
    heroContent      = hero
    aboutContent     = about
    skills           = skillsRow
    services         = servicesRow
    processSteps     = processRow
    faqs             = faqRow
    contactContent   = contactRow
    projectOverrides = projectOverridesRow ?? {}
    if (siteSettings) {
      siteAvailable    = siteSettings.available
      siteAvailableMsg = siteSettings.availableMsg ?? 'Available for Projects'
      resumeUrl        = siteSettings.resumeUrl    ?? ''
      calUrl           = siteSettings.calUrl       ?? ''
    }
    testimonials      = testimonialsRow
    projectOrder      = projectOrderRow ?? []
    recentPosts       = recentPostsRaw.map(p => ({ ...p, publishedAt: p.publishedAt?.toISOString() ?? null }))
    pricingCategories = pricingCatsRow  ?? []
    pricingPlans      = pricingPlansRow ?? []
  } catch {
    // DB not initialised yet — fall back to static defaults
  }

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':       'Person',
        '@id':         'https://aponder.dev/#person',
        name:          'Anthony Ponder',
        url:           'https://aponder.dev',
        jobTitle:      'Minecraft Plugin Developer & Software Engineer',
        description:   'Building production-ready Minecraft plugins, backend systems, server tools, and modern web experiences.',
        email:         'Anthony@aponder.dev',
        sameAs: [
          'https://github.com/APonder-Dev',
          'https://github.com/FadedCloud-LLC',
        ],
      },
      {
        '@type':       'WebSite',
        '@id':         'https://aponder.dev/#website',
        url:           'https://aponder.dev',
        name:          'APonder.dev',
        description:   'Portfolio of Anthony Ponder — Minecraft Plugin Developer & Software Engineer',
        author:        { '@id': 'https://aponder.dev/#person' },
      },
    ],
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
    <main className="relative bg-dark-950 min-h-screen">
      <Header />
      <Hero content={heroContent} available={siteAvailable} availableMsg={siteAvailableMsg} resumeUrl={resumeUrl || undefined} calUrl={calUrl || undefined} />
      <About content={aboutContent} />
      <Projects hiddenProjectIds={hiddenProjectIds} customProjects={customProjects} projectOverrides={projectOverrides} projectOrder={projectOrder} />
      <Skills skills={skills} />
      <Services services={services} />
      <Process steps={processSteps} />
      <RecentPosts posts={recentPosts} />
      <Testimonials testimonials={testimonials} />
      <Pricing priceOverrides={priceOverrides} dbCategories={pricingCategories} dbPlans={pricingPlans} />
      <FAQ faqs={faqs} />
      <Contact contact={contactContent} />
      <Footer contact={contactContent} />
      <ScrollToTop />
    </main>
    </>
  )
}
