export interface Skill {
  id: string
  name: string
  category: 'backend' | 'web'
  percentage: number
  status: 'Expert' | 'Advanced' | 'Proficient' | 'Learning'
  tags: string[]
  description: string
}

export const skills: Skill[] = [
  {
    id: 'java',
    name: 'Java',
    category: 'backend',
    percentage: 95,
    status: 'Expert',
    tags: ['Java 17', 'Java 21', 'Java 25', 'OOP', 'Threading', 'Async'],
    description: 'Production-grade Java across 17, 21, and 25 runtimes. Deep expertise in async design, threading models, memory management, and large-scale plugin architecture.',
  },
  {
    id: 'mc-plugins',
    name: 'MC Plugins',
    category: 'backend',
    percentage: 95,
    status: 'Expert',
    tags: ['Paper API', 'Spigot', 'Folia', '1.18–latest', 'Vault', 'PAPI'],
    description: 'Full Minecraft plugin ecosystem expertise — Paper API, multi-version compatibility from 1.18 through latest, Folia regional threading, and deep Vault/PAPI integrations.',
  },
  {
    id: 'backend-systems',
    name: 'Backend',
    category: 'backend',
    percentage: 90,
    status: 'Expert',
    tags: ['SQL', 'SQLite', 'MySQL', 'HikariCP', 'Maven', 'Gradle'],
    description: 'End-to-end backend engineering — relational database design, async I/O with HikariCP connection pooling, Maven/Gradle build pipelines, and config-driven architectures.',
  },
  {
    id: 'web-development',
    name: 'Web Dev',
    category: 'web',
    percentage: 85,
    status: 'Advanced',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Prisma', 'Node.js'],
    description: 'Full-stack web development with Next.js, React, TypeScript, and Tailwind. REST APIs, database-backed apps, and production-ready deployments on Vercel or VPS.',
  },
  {
    id: 'automation',
    name: 'Automation',
    category: 'web',
    percentage: 80,
    status: 'Advanced',
    tags: ['Python', 'Bash', 'Linux', 'Docker', 'Nginx', 'VPS'],
    description: 'Server automation, CLI tooling, monitoring scripts, and full infrastructure management across Linux/VPS environments with Docker, Nginx, and cloud deployments.',
  },
]
