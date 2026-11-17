import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

/**
 * Railway health check. Initialising Payload here also applies pending
 * migrations and first-run seeding before the deploy is marked healthy.
 */
export async function GET() {
  try {
    const payload = await getPayloadClient()
    await payload.count({ collection: 'suburbs', overrideAccess: true })
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[health]', error)
    return Response.json({ status: 'error' }, { status: 503 })
  }
}
