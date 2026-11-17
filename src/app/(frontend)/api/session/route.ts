import { appAuth } from '@/lib/app-auth'

export const dynamic = 'force-dynamic'

/** Lightweight signed-in check for the (static) site header. Exposes no personal data. */
export async function GET() {
  const user = await appAuth.currentUser().catch(() => null)
  return Response.json(
    { signedIn: Boolean(user) },
    { headers: { 'Cache-Control': 'private, no-store' } },
  )
}
