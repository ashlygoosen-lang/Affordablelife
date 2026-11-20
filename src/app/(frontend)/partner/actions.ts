'use server'

import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

const statuses = new Set(['open', 'in-progress', 'scheduled', 'resolved', 'closed'])

/** Partners may move a request along and leave a note the tenant can read. */
export async function updateMaintenanceAsPartner(formData: FormData) {
  const user = await appAuth.currentUser()
  if (!user || user.role !== 'partner') return { ok: false, message: 'Partner access required.' }
  const id = String(formData.get('id') ?? '').slice(0, 100)
  const status = String(formData.get('status') ?? '')
  const note = String(formData.get('resolutionNote') ?? '').trim().slice(0, 1000)
  if (!id || !statuses.has(status)) return { ok: false, message: 'Choose a valid status.' }
  try {
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'maintenance-requests',
      id,
      overrideAccess: false,
      user,
      data: { status: status as 'open', resolutionNote: note || undefined },
    })
    return { ok: true, message: 'Updated.' }
  } catch (error) {
    console.error('[partner]', error)
    return { ok: false, message: 'That request could not be updated.' }
  }
}
