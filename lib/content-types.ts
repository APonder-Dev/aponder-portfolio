export interface HeroContent {
  headline: [string, string, string, string]
  subtitle: string
  cta1Label: string
  cta2Label: string
  metaLine: string
  stats: Array<{ value: string; label: string }>
}

export interface AboutContent {
  bio: [string, string, string]
  profileStats: Array<{ value: string; label: string }>
  openToWork: boolean
  specs: Array<{ label: string; desc: string }>
}

export type SkillStatus = 'Expert' | 'Advanced' | 'Proficient' | 'Learning'

export interface SkillItem {
  id: string
  name: string
  percentage: number
  status: SkillStatus
  description: string
  tags: string[]
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  features: string[]
  icon: string
  accentColor: string
}

export interface ProcessStep {
  n: string
  label: string
  color: string
  title: string
  desc: string
  detail: string[]
}

export interface FAQItem {
  q: string
  a: string
}

export interface ContactContent {
  email: string
  discordHandle: string
  discordUrl: string
  location: string
  responseTime: string
}

export interface FooterLink {
  id: string
  label: string
  url: string
  icon: string
}

export interface TestimonialItem {
  quote:    string
  author:   string
  server:   string
  discord:  string
  initials: string
  color:    string
}

export interface PricingCategoryData {
  id:          string
  label:       string
  description: string
  disclaimer:  string
  layout:      'cards' | 'horizontal'
}

export interface PricingPlanData {
  id:          string
  category:    string
  name:        string
  iconName:    string
  price:       string
  subtitle:    string
  color:       string
  featured:    boolean
  features:    string[]
  notIncluded: string[]
  cta:         string
}
