import { NextResponse } from 'next/server'
import { getMaintenanceSettings, getRedirects } from '@/lib/site-settings'

// Consumed by proxy.ts (which cannot use Prisma directly) to apply
// maintenance mode and custom redirects. Intentionally public — it exposes
// nothing sensitive.
export const dynamic = 'force-dynamic'

export async function GET() {
  const [maintenance, redirects] = await Promise.all([
    getMaintenanceSettings(),
    getRedirects(),
  ])
  return NextResponse.json({
    maintenance: { enabled: maintenance.enabled },
    redirects,
  })
}
