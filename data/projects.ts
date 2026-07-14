export interface ProjectModal {
  highlights:   string[]
  architecture: string
}

export interface Project {
  id:          string
  name:        string
  type:        'minecraft' | 'web' | 'tool'
  typeLabel:   string
  description: string
  stack:       string[]
  status:      'production' | 'active' | 'private' | 'archived'
  statusLabel: string
  featured:    boolean
  accentColor: string
  githubUrl?:  string
  modal?:      ProjectModal
}

export const projects: Project[] = [
  {
    id: 'minedex',
    name: 'MineDex',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'All-in-one Paper/Purpur core plugin featuring collection progression, achievement tracking, GUI trading, economy integration, crates, kits, safe zones, automated world resets, and a live Discord bridge.',
    stack: ['Java 17', 'Paper/Purpur', 'Vault', 'SQLite', 'Discord API'],
    status: 'private',
    statusLabel: 'Private',
    featured: true,
    accentColor: 'emerald',
    modal: {
      highlights: [
        '15+ independent feature modules in a single JAR with per-module enable/disable',
        'Live Discord bridge via JDA — in-game chat, death messages, and join events relayed in real time',
        'Automated world reset scheduler with configurable cron-style timing and pre-reset countdowns',
        'Async-safe SQLite via HikariCP — all database ops off the main thread',
        'GUI crate and kit system with animated openings and per-player cooldown tracking',
        'Collection progression system — players track discovered items across categories',
        'Safe zone management with per-region PvP, build, and interaction flags',
      ],
      architecture: 'Modular command router with a shared ServiceLocator pattern. Each feature registers as an isolated module at startup, enabling per-server toggling without recompile. All cross-module state flows through a central EventBus, keeping modules decoupled.',
    },
  },
  {
    id: 'astracontrol',
    name: 'AstraControl',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Free, open-source server control center with real-time health monitoring, plugin and hook status tracking, error watching, maintenance mode, broadcast scheduling, and PlaceholderAPI integration.',
    stack: ['Java 17', 'Paper API', 'PAPI', 'MIT License'],
    status: 'production',
    statusLabel: 'Public',
    featured: true,
    accentColor: 'cyan',
    githubUrl: 'https://github.com/FadedCloud-LLC/AstraControl',
    modal: {
      highlights: [
        'Real-time TPS, memory, and player count monitoring via /astra status',
        'Plugin and hook dependency status dashboard — instantly see what\'s loaded vs missing',
        'Configurable error watcher with alert thresholds and console-level filtering',
        'Maintenance mode with automatic whitelist bypass and custom kick messages',
        'Broadcast scheduler with YAML-driven message rotation and per-message delays',
        'PlaceholderAPI integration exposes all health metrics to other plugins',
        'Zero external dependencies beyond the Paper API — lightweight and conflict-free',
      ],
      architecture: 'Event-driven health sampling every 5 ticks using a lightweight ring-buffer for historical TPS averaging. Plugin hook validation runs once on startup and re-checks on /astra reload. Fully async — no main-thread blocking for any monitoring operation.',
    },
  },
  {
    id: 'daylightcuy',
    name: 'DaylightCuy',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Private all-in-one Paper/Purpur plugin powering DaylightSMP — covering economy management, utility commands, player moderation, and SMP lifecycle features in a single unified system.',
    stack: ['Java 21', 'Paper/Purpur', 'Vault', 'SQLite'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'purple',
  },
  {
    id: 'daylightorders',
    name: 'DaylightOrders',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'GUI-driven buy-order marketplace for Paper servers. Players post item requests with a set price and others fulfill them for instant payment — supports Vault, PlayerPoints, and custom currencies.',
    stack: ['Java 17', 'Paper API', 'Vault', 'PlayerPoints', 'SQLite'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'yellow',
  },
  {
    id: 'daylightcoinflip',
    name: 'DaylightCoinFlip',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Premium coinflip wagering plugin with live lobby matchmaking, animated flip sequences, anti-exploit protection, and full transaction history logging.',
    stack: ['Java 21', 'Paper 1.21.x', 'Vault', 'SQLite'],
    status: 'private',
    statusLabel: 'Private',
    featured: true,
    accentColor: 'orange',
    modal: {
      highlights: [
        'Live lobby matchmaking GUI — see all open wagers, filter by currency amount',
        'Animated flip sequence with configurable suspense timing and sound effects',
        'Anti-exploit suite: rate limiting, concurrent bet detection, and balance overflow protection',
        'Full per-player transaction history with timestamps stored in SQLite',
        'Dual-currency support: Vault economy and PlayerPoints side-by-side',
        'Configurable minimum/maximum wager limits per currency',
        'Admin commands for inspecting active games, clearing queues, and auditing history',
      ],
      architecture: 'Each active coinflip is modelled as a state machine: PENDING → MATCHED → ANIMATING → RESOLVED. States are held in a ConcurrentHashMap keyed by game UUID. On resolution the outcome is persisted to SQLite asynchronously via HikariCP, and the in-memory entry is evicted.',
    },
  },
  {
    id: 'novarelics',
    name: 'NovaRelics',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Custom relic, charm, and artifact framework with 30 unique abilities, 28 trigger types, and 21 persistent aura effects. Full NBT-based item persistence.',
    stack: ['Java 17', 'Paper API', 'NBT API', 'SQLite'],
    status: 'production',
    statusLabel: 'Public',
    featured: true,
    accentColor: 'indigo',
    githubUrl: 'https://github.com/FadedCloud-LLC/NovaRelics',
    modal: {
      highlights: [
        '30 unique abilities across offensive, defensive, utility, and passive categories',
        '28 trigger types: on-kill, on-damage-dealt, on-damage-taken, on-sneak, on-sprint, timed aura, and more',
        '21 persistent aura effects that survive relog via SQLite — no reactivation needed',
        'NBT-based item identity — no external item library, fully vanilla-compatible',
        'Public developer API: other plugins can register custom relics and triggers at runtime',
        'Configurable rarity tiers with per-tier drop weights and loot table integration',
        'GUI relic browser for players to view discovered relics and active effects',
      ],
      architecture: 'Trigger → Ability → Effect pipeline with a priority-sorted execution queue for multi-relic interactions on the same event. Each player\'s active relics are loaded into an in-memory cache on join and synced to SQLite on logout, keeping tick-level checks off the database.',
    },
  },
  {
    id: 'prospertrade',
    name: 'ProsperTrade',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Secure GUI trade system with escrow protection, anti-scam validation, trade history logging, and full Vault + PlaceholderAPI integration for economy servers.',
    stack: ['Java 17', 'Paper API', 'Vault', 'SQLite', 'PAPI'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'blue',
  },
  {
    id: 'fallenbounty',
    name: 'FallenBounty',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Dual-currency stacking bounty system supporting both Vault economy and PlayerPoints. Full Folia compatibility, configurable stack limits, and persistent SQLite storage.',
    stack: ['Java 21', 'Paper', 'Folia', 'Vault', 'PlayerPoints', 'SQLite'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'orange',
    modal: {
      highlights: [
        'Dual-currency: bounties can be placed in Vault economy or PlayerPoints independently',
        'Stacking system — multiple players can add to the same target\'s bounty',
        'Configurable per-currency stack limits and minimum placement amounts',
        'Full Folia compatibility — all scheduling via RegionScheduler, zero main-thread assumptions',
        'Persistent SQLite storage with async reads/writes via HikariCP',
        'On-kill auto-payout: currency transferred atomically, history logged instantly',
        'Admin commands for auditing active bounties and clearing stale entries',
      ],
      architecture: 'Bounty state is stored in SQLite and loaded into a per-target cache on access. Folia compatibility required replacing all BukkitScheduler calls with RegionScheduler and GlobalRegionScheduler, with careful thread-safety guarantees on cache mutations.',
    },
  },
  {
    id: 'fallenstaff',
    name: 'FallenStaff',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Comprehensive staff moderation suite for Paper/Purpur/Spigot. Full admin toolset covering punishment management, moderation logs, staff oversight, and configurable permission tiers.',
    stack: ['Java 17', 'Paper/Purpur', 'Spigot', 'SQLite'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'slate',
  },
  {
    id: 'daylightrewards',
    name: 'DaylightRewards',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Seasonal rewards GUI with built-in referral system, configurable reward tiers, Vault + PAPI integration, and dual SQLite/MySQL backend.',
    stack: ['Java 17', 'Paper API', 'Vault', 'SQLite', 'MySQL', 'PAPI'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'slate',
  },
  {
    id: 'prosperraffle',
    name: 'ProsperRaffle',
    type: 'minecraft',
    typeLabel: 'Minecraft Plugin',
    description: 'Full-featured raffle, lottery, and jackpot plugin with Vault economy integration, animated GUI, configurable ticket pricing, and persistent winner history.',
    stack: ['Java 17', 'Paper API', 'Vault', 'SQLite', 'PAPI'],
    status: 'private',
    statusLabel: 'Private',
    featured: false,
    accentColor: 'orange',
  },
]
