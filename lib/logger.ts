import { db } from './db'

export async function logAction(action: string, detail = '') {
  try {
    await db.adminLog.create({ data: { action, detail } })
  } catch { /* never fail on logging */ }
}
