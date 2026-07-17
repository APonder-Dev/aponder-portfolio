import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import MusicWidget from '@/components/MusicWidget'
import { Analytics } from '@vercel/analytics/next'
import { MotionConfig } from 'framer-motion'
import { db } from '@/lib/db'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const DEFAULT_TITLE       = 'APonder — Minecraft Plugin Developer & Software Developer'
const DEFAULT_DESCRIPTION = 'APonder builds production-ready Minecraft plugins, backend systems, server tools, and modern web experiences for server owners and developers.'

export async function generateMetadata(): Promise<Metadata> {
  let title       = DEFAULT_TITLE
  let description = DEFAULT_DESCRIPTION
  let ogImage: string | undefined

  try {
    const row = await db.siteContent.findUnique({ where: { key: 'seo' } })
    if (row) {
      const seo = JSON.parse(row.value) as { title?: string; description?: string; ogImage?: string }
      if (seo.title)       title       = seo.title
      if (seo.description) description = seo.description
      if (seo.ogImage)     ogImage     = seo.ogImage
    }
  } catch { /* DB not ready, use defaults */ }

  return {
    title,
    description,
    keywords: [
      'minecraft plugin developer',
      'paper plugin developer',
      'spigot developer',
      'java developer',
      'minecraft server plugins',
      'custom minecraft plugins',
      'backend developer',
      'APonder',
      'Folia plugin developer',
      'Purpur plugin developer',
    ],
    authors:     [{ name: 'Anthony Ponder', url: 'https://aponder.dev' }],
    creator:     'Anthony Ponder',
    metadataBase: new URL('https://aponder.dev'),
    openGraph: {
      type:        'website',
      locale:      'en_US',
      url:         'https://aponder.dev',
      title,
      description,
      siteName:    'APonder.dev',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet':       -1,
      },
    },
    alternates: {
      types: { 'application/rss+xml': 'https://aponder.dev/feed.xml' },
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#030712',
  width: 'device-width',
  initialScale: 1,
}

// Strict format check so a DB value can never inject arbitrary script.
const GA_ID_RE = /^G-[A-Z0-9]{4,20}$/

async function getGaId(): Promise<string | null> {
  try {
    const row = await db.siteContent.findUnique({ where: { key: 'analytics' } })
    if (!row) return null
    const { gaId } = JSON.parse(row.value) as { gaId?: string }
    return gaId && GA_ID_RE.test(gaId) ? gaId : null
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = await getGaId()

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            {children}
            <MusicWidget />
          </ThemeProvider>
        </MotionConfig>
        <Analytics />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
