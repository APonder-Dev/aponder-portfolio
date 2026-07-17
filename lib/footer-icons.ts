import {
  Mail, Github, Building2, Coffee, MessageSquare, Globe,
  Twitter, Youtube, Twitch, Linkedin, Instagram, Rss,
  Heart, Gamepad2, Music, DollarSign, BookOpen, Code2,
  type LucideIcon,
} from 'lucide-react'

// Icons selectable for footer social links, keyed by the string stored in
// the DB. Adding here makes the icon available in the admin dropdown.
export const FOOTER_ICONS: Record<string, LucideIcon> = {
  mail:      Mail,
  github:    Github,
  building:  Building2,
  coffee:    Coffee,
  discord:   MessageSquare,
  globe:     Globe,
  twitter:   Twitter,
  youtube:   Youtube,
  twitch:    Twitch,
  linkedin:  Linkedin,
  instagram: Instagram,
  rss:       Rss,
  heart:     Heart,
  gamepad:   Gamepad2,
  music:     Music,
  dollar:    DollarSign,
  book:      BookOpen,
  code:      Code2,
}

export const FOOTER_ICON_LABELS: Record<string, string> = {
  mail:      'Email',
  github:    'GitHub',
  building:  'Organization',
  coffee:    'Buy Me a Coffee',
  discord:   'Discord / Chat',
  globe:     'Website',
  twitter:   'Twitter / X',
  youtube:   'YouTube',
  twitch:    'Twitch',
  linkedin:  'LinkedIn',
  instagram: 'Instagram',
  rss:       'RSS',
  heart:     'Sponsor',
  gamepad:   'Gaming',
  music:     'Music',
  dollar:    'Donate',
  book:      'Docs / Blog',
  code:      'Code',
}

export function footerIcon(name: string): LucideIcon {
  return FOOTER_ICONS[name] ?? Globe
}
