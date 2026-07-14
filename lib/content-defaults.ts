import type {
  HeroContent, AboutContent, SkillItem,
  ServiceItem, ProcessStep, FAQItem, ContactContent, TestimonialItem,
} from './content-types'

export const DEFAULT_HERO: HeroContent = {
  headline: ['Every plugin,', 'engineered.', 'Every system,', 'deliberate.'],
  subtitle: 'I build production-ready Minecraft plugins, backend systems, automation tools, and modern web experiences — engineered for real server loads, long-term maintainability, and clean delivery.',
  cta1Label: 'Start a Project',
  cta2Label: 'View Work',
  metaLine: 'APONDER  /  DEV BUILD 2026  /  ILLINOIS, USA',
  stats: [
    { value: '25+',              label: 'Projects Delivered' },
    { value: '1.18 → latest',   label: 'Version Support'    },
    { value: '17 / 21 / 25',    label: 'Java Versions'      },
    { value: 'Spigot/Paper/Folia', label: 'Platform Support' },
  ],
}

export const DEFAULT_ABOUT: AboutContent = {
  bio: [
    "I'm Anthony — a software developer specializing in Minecraft plugin development and backend systems engineering. Every project I build targets production environments, not just proofs of concept.",
    "My plugins handle real server loads, real player counts, and real edge cases. I architect for multi-version compatibility (1.18.2 → latest), async-safe database operations, clean config-driven designs, and long-term maintainability across Spigot, Paper, and Folia.",
    "Whether you need a custom economy system, a GUI marketplace, a complex gameplay mechanic, or a backend automation pipeline — I engineer it from specification to delivery with full source code, documentation, and post-delivery support.",
  ],
  profileStats: [
    { value: '25+',  label: 'Projects'    },
    { value: '5+',   label: 'Years Dev'   },
    { value: '100%', label: 'Custom Code' },
  ],
  openToWork: true,
  specs: [
    { label: 'Java Developer',    desc: 'Java 17, 21, 25 — Paper, Spigot, Folia'  },
    { label: 'Plugin Architect',  desc: 'Custom plugins from spec to production'    },
    { label: 'Backend Systems',   desc: 'SQL, async, config-driven architectures'  },
    { label: 'Web Development',   desc: 'Next.js, TypeScript, Tailwind, React'     },
    { label: 'Server Automation', desc: 'Scripts, tooling, monitoring, DevOps'     },
    { label: 'Database Design',   desc: 'SQLite, MySQL, HikariCP, async I/O'       },
  ],
}

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: 'java',
    name: 'Java',
    percentage: 95,
    status: 'Expert',
    tags: ['Java 17', 'Java 21', 'Java 25', 'OOP', 'Threading', 'Async'],
    description: 'Production-grade Java across 17, 21, and 25 runtimes. Deep expertise in async design, threading models, memory management, and large-scale plugin architecture.',
  },
  {
    id: 'mc-plugins',
    name: 'MC Plugins',
    percentage: 95,
    status: 'Expert',
    tags: ['Paper API', 'Spigot', 'Folia', '1.18–latest', 'Vault', 'PAPI'],
    description: 'Full Minecraft plugin ecosystem expertise — Paper API, multi-version compatibility from 1.18 through latest, Folia regional threading, and deep Vault/PAPI integrations.',
  },
  {
    id: 'backend-systems',
    name: 'Backend',
    percentage: 90,
    status: 'Expert',
    tags: ['SQL', 'SQLite', 'MySQL', 'HikariCP', 'Maven', 'Gradle'],
    description: 'End-to-end backend engineering — relational database design, async I/O with HikariCP connection pooling, Maven/Gradle build pipelines, and config-driven architectures.',
  },
  {
    id: 'web-development',
    name: 'Web Dev',
    percentage: 85,
    status: 'Advanced',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma', 'Node.js'],
    description: 'Full-stack web development with Next.js, React, TypeScript, and Tailwind. REST APIs, database-backed apps, and production-ready deployments on Vercel or VPS.',
  },
  {
    id: 'automation',
    name: 'Automation',
    percentage: 80,
    status: 'Advanced',
    tags: ['Python', 'Bash', 'Linux', 'Docker', 'Nginx', 'VPS'],
    description: 'Server automation, CLI tooling, monitoring scripts, and full infrastructure management across Linux/VPS environments with Docker, Nginx, and cloud deployments.',
  },
]

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'custom-plugins',
    title: 'Custom Minecraft Plugins',
    description: 'Fully bespoke plugins built from your specification. From small utility tools to full game-loop systems — GUI-driven, database-backed, and documented.',
    features: ['Requirements analysis & scope definition', 'Full source code delivery', 'Config-driven YAML architecture', 'Setup guide & admin documentation', '30-day post-delivery support'],
    icon: 'puzzle',
    accentColor: 'blue',
  },
  {
    id: 'fixes-rebuilds',
    title: 'Plugin Fixes & Rebuilds',
    description: 'Broken or severely outdated plugin? I diagnose root causes, patch bugs, refactor legacy code, and rebuild to modern Paper standards when needed.',
    features: ['Root cause bug diagnosis', 'Memory leak and thread-safety fixes', 'Performance optimization', 'Legacy API modernization', 'Version-specific patch delivery'],
    icon: 'wrench',
    accentColor: 'orange',
  },
  {
    id: 'modernization',
    title: 'Plugin Modernization',
    description: 'Upgrade old Spigot plugins to modern Paper API standards. Async-safe, thread-correct, and ready for Paper, Purpur, and Folia server environments.',
    features: ['Spigot → Paper API migration', 'Deprecated NMS removal & abstraction', 'Async I/O and scheduler rewrites', 'Modern event handling patterns', 'Folia regional threading support'],
    icon: 'refresh-cw',
    accentColor: 'cyan',
  },
  {
    id: 'multi-version',
    title: 'Multi-Version Support',
    description: 'Need your plugin running from 1.18.2 through the latest release? I build version-abstracted plugins with compatibility layers that work across your whole player base.',
    features: ['Runtime version detection & routing', 'NMS abstraction layer design', 'Reflection-based compatibility bridges', 'Validated across 4+ server versions', 'Single artifact, broad support'],
    icon: 'layers',
    accentColor: 'indigo',
  },
  {
    id: 'gui-systems',
    title: 'GUI Systems',
    description: 'Rich inventory GUI frameworks with animated menus, paginated views, real-time slot updates, and polished interactive elements for player-facing interfaces.',
    features: ['Animated inventory GUIs', 'Paginated browsing with dynamic filters', 'Real-time slot update cycles', 'Confirmation and cancel dialogs', 'Custom item lore and enchant rendering'],
    icon: 'layout',
    accentColor: 'purple',
  },
  {
    id: 'economy',
    title: 'Economy Integrations',
    description: 'Deep Vault, EssentialsX, and custom economy system integrations. Trade systems, coinflip, bounties, auction houses, and any economy-driven gameplay loop.',
    features: ['Vault API & EssentialsX compatibility', 'Custom currency system design', 'Full transaction history logging', 'Anti-exploit and anti-dupe protection', 'Economy balance and audit tools'],
    icon: 'trending-up',
    accentColor: 'emerald',
  },
  {
    id: 'server-tooling',
    title: 'Server Tooling & Automation',
    description: 'Backend server automation scripts, monitoring systems, scheduled tasks, and admin utilities to streamline your Minecraft server day-to-day operations.',
    features: ['Python/Bash automation scripts', 'Server health monitoring & alerting', 'Automated backup scheduling', 'Log parsing and alert pipelines', 'Admin CLI tooling'],
    icon: 'terminal',
    accentColor: 'teal',
  },
  {
    id: 'web-portfolio',
    title: 'Portfolio & Store Websites',
    description: 'Modern Next.js portfolio or plugin store websites for server owners and Minecraft developers who need a professional, fast, SEO-friendly web presence.',
    features: ['Next.js 14 + TypeScript', 'Responsive mobile-first layout', 'CMS or database-driven content', 'SEO + Open Graph metadata', 'VPS or Vercel deployment included'],
    icon: 'globe',
    accentColor: 'sky',
  },
]

export const DEFAULT_PROCESS: ProcessStep[] = [
  {
    n: '01', label: 'Discovery', color: 'blue',
    title: 'Requirements & Scope',
    desc: 'We align on exactly what you need. I gather requirements, ask the right questions, and define the full scope before a single line of code is written.',
    detail: ['Goals & non-goals defined', 'Version & platform requirements', 'Timeline expectations', 'Delivery format agreed upon'],
  },
  {
    n: '02', label: 'Specification', color: 'cyan',
    title: 'PRD & Architecture',
    desc: 'I produce a Product Requirements Document with system design, command structure, config layout, database schema, and dependency map.',
    detail: ['Written PRD delivered', 'API & event mapping', 'Config YAML structure', 'Milestone plan created'],
  },
  {
    n: '03', label: 'Development', color: 'indigo',
    title: 'Iterative Build',
    desc: 'Development happens in milestones with progress updates at each stage. You stay informed — no radio silence between kickoff and delivery.',
    detail: ['Milestone-based progress', 'Clean architecture', 'Async-safe design', 'Code review checkpoints'],
  },
  {
    n: '04', label: 'Testing', color: 'purple',
    title: 'QA & Validation',
    desc: 'Every plugin is tested on real Paper servers across targeted version ranges. Edge cases, concurrency issues, and config validation are all covered.',
    detail: ['Multi-version server testing', 'Load and concurrency checks', 'Config validation', 'Edge case coverage'],
  },
  {
    n: '05', label: 'Delivery', color: 'emerald',
    title: 'Delivery & Support',
    desc: 'You receive the compiled JAR, full source code, config files, and documentation. 30-day support window included for post-launch questions.',
    detail: ['Source + compiled JAR', 'Full documentation', 'Setup walkthrough', '30-day support window'],
  },
]

export const DEFAULT_FAQS: FAQItem[] = [
  { q: 'Do you work under NDA?', a: "Yes. Confidential builds are common — I offer a standard NDA on request at no extra cost. Your plugin's source, design, and features stay private. I will never publish, resell, or reference your project without written permission." },
  { q: 'What payment methods do you accept?', a: 'PayPal, Venmo, CashApp, and select crypto. New clients pay 50% upfront with the remainder on delivery. Projects under $30 are typically paid in full upfront. I do not begin work until the deposit is confirmed.' },
  { q: 'Do you offer revisions?', a: "Yes — bug fixes and minor adjustments are included within your plan's support window at no charge. Scope additions (new commands, new GUI screens, new database tables) are quoted separately before any work begins." },
  { q: 'Can I resell the plugin?', a: 'Full Resale Rights are included exclusively with the Production Grade plan. All other tiers license the plugin for personal server use only. If you want to sell on SpigotMC, Polymart, or BuiltByBit, the Production Grade tier is the right fit — it also includes marketplace-ready packaging and documentation.' },
  { q: 'How long does development take?', a: 'Simple utility plugins ship in 1–3 days. Advanced plugins with GUI systems and databases typically take 3–7 days. Complex multi-feature systems or full server tools take 1–3 weeks. A timeline estimate is always provided before work begins. Rush delivery is available for a surcharge.' },
  { q: 'What Minecraft platforms do you target?', a: 'Paper, Spigot, Purpur, and Folia. Multi-version builds from 1.18.2 through the latest release are available on Premium and above. Folia (regional multithreading) support can be added to any plan — just mention it in your inquiry.' },
  { q: 'Do I receive the source code?', a: "Advanced and lower tiers deliver a compiled JAR. Premium, Production Grade, and most higher-tier service plans include full source code. The feature list on each pricing card is explicit about what's included — no surprises." },
  { q: 'What if something breaks after delivery?', a: "Every plan includes a support window. Bugs and compatibility issues within that window are fixed at no charge. After the window closes, continued support can be arranged on a per-hour or retainer basis. Minecraft API breakage caused by a major version update is always covered regardless of window." },
]

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    quote:    "Anthony is, without a doubt, the most uniquely American developer I've ever worked with — and I mean that as a compliment. He was genuinely kind throughout the entire process and helped bring my server's vision to life in a way the community immediately noticed. The features he built were a hit from day one. If you want someone who'll take your ideas seriously and actually deliver, he's your guy. Highly recommend.",
    author:   'Owner',
    server:   'Fallen Halo',
    discord:  'https://discord.gg/pwNT3xf6NV',
    initials: 'FH',
    color:    'orange',
  },
  {
    quote:    "Honestly, I'm not sure what more to say — the work speaks for itself. Anthony understood exactly what our server needed and delivered without us having to micromanage a thing. Clean, polished, and exactly what the community was looking for.",
    author:   'Owner',
    server:   'DaylightSMP',
    discord:  'https://discord.gg/zM8DQycD74',
    initials: 'DS',
    color:    'blue',
  },
]

export const DEFAULT_CONTACT: ContactContent = {
  email: 'Anthony@aponder.dev',
  discordHandle: 'aponder',
  discordUrl: 'https://discord.com',
  location: 'Illinois, USA',
  responseTime: '24h',
}
