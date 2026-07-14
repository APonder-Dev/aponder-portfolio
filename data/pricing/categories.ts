import type { PricingCategory } from './types'

export const CATEGORIES: Record<string, PricingCategory> = {
  'plugin-dev': {
    label:       'Plugin Developer',
    description: 'Custom Java plugins built from scratch for Paper, Spigot, Purpur, and Folia.',
    disclaimer:  'Prices are fixed starting rates. Complex scope, multi-version support, Folia compatibility, or tight deadlines may affect final pricing. All quotes are free.',
  },
  'server-config': {
    label:       'Server Configurist',
    description: 'Full server setups, plugin configuration, permission systems, and economy tuning.',
    disclaimer:  'Network Config covers up to 3 servers — each additional server is $74.99. Final pricing depends on plugin count and economy complexity.',
  },
  'sys-admin': {
    label:       'System Admin',
    description: 'VPS provisioning, Linux hardening, application deployment, and full infrastructure builds.',
    disclaimer:  'Prices are fixed per engagement. Multi-server scope, custom network topology, or ongoing management may affect final pricing. All quotes are free.',
  },
  'web-dev': {
    label:       'Web Development',
    description: 'Landing pages, portfolio sites, full-stack web apps, and custom platforms built with Next.js.',
    disclaimer:  'Prices are fixed starting rates. E-commerce, payment processing, custom third-party integrations, or complex business logic may affect final pricing. All quotes are free.',
  },
  'software-dev': {
    label:       'Software Development',
    description: 'Automation scripts, CLI tools, REST APIs, desktop apps, and complete multi-component systems.',
    disclaimer:  'Prices are fixed starting rates. Large feature scope, complex integrations, real-time systems, or strict performance requirements may affect final pricing. All quotes are free.',
  },
}
