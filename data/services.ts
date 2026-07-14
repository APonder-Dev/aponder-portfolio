export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  icon: string
  accentColor: string
}

export const services: Service[] = [
  {
    id: 'custom-plugins',
    title: 'Custom Minecraft Plugins',
    description: 'Fully bespoke plugins built from your specification. From small utility tools to full game-loop systems — GUI-driven, database-backed, and documented.',
    features: [
      'Requirements analysis & scope definition',
      'Full source code delivery',
      'Config-driven YAML architecture',
      'Setup guide & admin documentation',
      '30-day post-delivery support',
    ],
    icon: 'puzzle',
    accentColor: 'blue',
  },
  {
    id: 'fixes-rebuilds',
    title: 'Plugin Fixes & Rebuilds',
    description: 'Broken or severely outdated plugin? I diagnose root causes, patch bugs, refactor legacy code, and rebuild to modern Paper standards when needed.',
    features: [
      'Root cause bug diagnosis',
      'Memory leak and thread-safety fixes',
      'Performance optimization',
      'Legacy API modernization',
      'Version-specific patch delivery',
    ],
    icon: 'wrench',
    accentColor: 'orange',
  },
  {
    id: 'modernization',
    title: 'Plugin Modernization',
    description: 'Upgrade old Spigot plugins to modern Paper API standards. Async-safe, thread-correct, and ready for Paper, Purpur, and Folia server environments.',
    features: [
      'Spigot → Paper API migration',
      'Deprecated NMS removal & abstraction',
      'Async I/O and scheduler rewrites',
      'Modern event handling patterns',
      'Folia regional threading support',
    ],
    icon: 'refresh-cw',
    accentColor: 'cyan',
  },
  {
    id: 'multi-version',
    title: 'Multi-Version Support',
    description: 'Need your plugin running from 1.18.2 through the latest release? I build version-abstracted plugins with compatibility layers that work across your whole player base.',
    features: [
      'Runtime version detection & routing',
      'NMS abstraction layer design',
      'Reflection-based compatibility bridges',
      'Validated across 4+ server versions',
      'Single artifact, broad support',
    ],
    icon: 'layers',
    accentColor: 'indigo',
  },
  {
    id: 'gui-systems',
    title: 'GUI Systems',
    description: 'Rich inventory GUI frameworks with animated menus, paginated views, real-time slot updates, and polished interactive elements for player-facing interfaces.',
    features: [
      'Animated inventory GUIs',
      'Paginated browsing with dynamic filters',
      'Real-time slot update cycles',
      'Confirmation and cancel dialogs',
      'Custom item lore and enchant rendering',
    ],
    icon: 'layout',
    accentColor: 'purple',
  },
  {
    id: 'economy',
    title: 'Economy Integrations',
    description: 'Deep Vault, EssentialsX, and custom economy system integrations. Trade systems, coinflip, bounties, auction houses, and any economy-driven gameplay loop.',
    features: [
      'Vault API & EssentialsX compatibility',
      'Custom currency system design',
      'Full transaction history logging',
      'Anti-exploit and anti-dupe protection',
      'Economy balance and audit tools',
    ],
    icon: 'trending-up',
    accentColor: 'emerald',
  },
  {
    id: 'server-tooling',
    title: 'Server Tooling & Automation',
    description: 'Backend server automation scripts, monitoring systems, scheduled tasks, and admin utilities to streamline your Minecraft server day-to-day operations.',
    features: [
      'Python/Bash automation scripts',
      'Server health monitoring & alerting',
      'Automated backup scheduling',
      'Log parsing and alert pipelines',
      'Admin CLI tooling',
    ],
    icon: 'terminal',
    accentColor: 'teal',
  },
  {
    id: 'web-portfolio',
    title: 'Portfolio & Store Websites',
    description: 'Modern Next.js portfolio or plugin store websites for server owners and Minecraft developers who need a professional, fast, SEO-friendly web presence.',
    features: [
      'Next.js 14 + TypeScript',
      'Responsive mobile-first layout',
      'CMS or database-driven content',
      'SEO + Open Graph metadata',
      'VPS or Vercel deployment included',
    ],
    icon: 'globe',
    accentColor: 'sky',
  },
]
