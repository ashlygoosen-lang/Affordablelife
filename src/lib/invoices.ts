import 'server-only'

import type { Invoice } from '@/payload-types'
import { appAuth } from './app-auth'
import { hashResumeToken, isResumeToken } from './application-tokens'
import { getPayloadClient } from './payload'

/**
 * Loads an invoice for the person paying it: either the signed-in tenant it
 * belongs to, or someone holding the private pay link token.
 */
export async function loadPayableInvoice(id: string, token?: string | null) {
  const payload = await getPayloadClient()
  let invoice: Invoice
  try {
    invoice = await payload.findByID({
      collection: 'invoices',
      id,
      depth: 1,
      overrideAccess: true,
      showHiddenFields: true,
    })
  } catch {
    return null
  }
  const user = await appAuth.currentUser()
  const tenantID = typeof invoice.tenant === 'object' ? invoice.tenant?.id : invoice.tenant
  const byAccount = Boolean(user && tenantID && String(tenantID) === String(user.id))
  const byToken = Boolean(
    isResumeToken(token) && invoice.payTokenHash && invoice.payTokenHash === hashResumeToken(token),
  )
  if (!byAccount && !byToken) return null
  // Never hand hidden fields to rendering code.
  const { payTokenHash: _hash, uniqueKey: _key, ...safe } = invoice
  return { invoice: safe as Invoice, user, viaToken: byToken && !byAccount }
}

export const isPayable = (invoice: Pick<Invoice, 'status'>) =>
  invoice.status === 'issued' || invoice.status === 'overdue'
