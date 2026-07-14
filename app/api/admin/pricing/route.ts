import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { logAction } from '@/lib/logger'
import type { PricingCategoryData, PricingPlanData } from '@/lib/content-types'

export async function GET() {
  const [catsRow, plansRow] = await Promise.all([
    db.siteContent.findUnique({ where: { key: 'pricing_categories' } }),
    db.siteContent.findUnique({ where: { key: 'pricing_plans' } }),
  ])

  return NextResponse.json({
    categories: catsRow  ? JSON.parse(catsRow.value)  as PricingCategoryData[] : [],
    plans:      plansRow ? JSON.parse(plansRow.value) as PricingPlanData[]      : [],
  })
}

export async function PUT(req: NextRequest) {
  const { categories, plans } = (await req.json()) as {
    categories: PricingCategoryData[]
    plans:      PricingPlanData[]
  }

  await Promise.all([
    db.siteContent.upsert({
      where:  { key: 'pricing_categories' },
      create: { key: 'pricing_categories', value: JSON.stringify(categories) },
      update: { value: JSON.stringify(categories) },
    }),
    db.siteContent.upsert({
      where:  { key: 'pricing_plans' },
      create: { key: 'pricing_plans', value: JSON.stringify(plans) },
      update: { value: JSON.stringify(plans) },
    }),
  ])

  await logAction('pricing_updated', `${categories.length} categories · ${plans.length} plans`)
  return NextResponse.json({ ok: true })
}
