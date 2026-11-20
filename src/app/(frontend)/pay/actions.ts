'use server'

import { isPayable, loadPayableInvoice } from '@/lib/invoices'
import { buildCheckout, payfastReady } from '@/lib/payfast'
import { siteURL } from '@/lib/site-url'

export type CheckoutResult =
  | { ok: true; action: string; fields: [string, string][] }
  | { ok: false; message: string }

/** Signs a PayFast checkout for an invoice the visitor is allowed to pay. */
export async function startCheckout(invoiceId: string, token?: string): Promise<CheckoutResult> {
  if (!payfastReady()) {
    return { ok: false, message: 'Online payments are not configured yet. Please pay by EFT.' }
  }
  const loaded = await loadPayableInvoice(String(invoiceId).slice(0, 100), token?.slice(0, 128))
  if (!loaded) return { ok: false, message: 'This payment link is not valid.' }
  const { invoice, user } = loaded
  if (!isPayable(invoice)) return { ok: false, message: 'This invoice is not awaiting payment.' }

  const [firstName, ...rest] = (invoice.payerName || user?.name || 'Tenant').trim().split(/\s+/)
  const tokenQuery = token ? `?t=${encodeURIComponent(token)}` : ''
  const separator = tokenQuery ? '&' : '?'
  const checkout = buildCheckout({
    invoiceId: String(invoice.id),
    amount: Number(invoice.amount),
    itemName: `Affordable Life ${invoice.number}`,
    itemDescription: invoice.description,
    firstName,
    lastName: rest.join(' '),
    email: invoice.payerEmail || user?.email || '',
    returnURL: `${siteURL}/pay/${invoice.id}${tokenQuery}${separator}result=return`,
    cancelURL: `${siteURL}/pay/${invoice.id}${tokenQuery}${separator}result=cancel`,
    notifyURL: `${siteURL}/api/payfast/notify`,
  })
  return { ok: true, ...checkout }
}
