import 'server-only'

import { headers } from 'next/headers'
import type { Admin } from '@/payload-types'
import { getPayloadClient } from './payload'

/** Staff are recognised by their Payload admin session (payload-token cookie). */
export async function currentStaff(): Promise<Admin | null> {
  const payload = await getPayloadClient()
  try {
    const { user } = await payload.auth({ headers: await headers() })
    return user && user.collection === 'admins' ? (user as Admin) : null
  } catch {
    return null
  }
}
