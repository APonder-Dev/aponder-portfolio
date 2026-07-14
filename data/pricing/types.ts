import type { LucideIcon } from 'lucide-react'

export interface PricingCategory {
  label:       string
  description: string
  disclaimer:  string
}

export interface PricingPlan {
  id:          string
  category:    string
  name:        string
  Icon:        LucideIcon
  price:       string
  subtitle:    string
  color:       string
  featured:    boolean
  features:    string[]
  notIncluded: string[]
  cta:         string
}
