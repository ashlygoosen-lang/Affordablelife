import type { Invoice } from '@/payload-types'
import { afterInvoicePaid } from '@/lib/billing'
import { notifyPaymentReceived } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { confirmWithPayfast, isPayfastIP, payfastConfig, verifyItnSignature } from '@/lib/payfast'

export const dynamic = 'force-dynamic'

const statusMap: Record<string, 'complete' | 'failed' | 'pending' | 'cancelled'> = {
  COMPLETE: 'complete',
  FAILED: 'failed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
}

/**
 * PayFast Instant Transaction Notification (ITN).
 * Checks, in order: signature, source address, merchant, amount, and PayFast's
 * own server confirmation — then records the payment exactly once.
 */
export async function POST(request: Request) {
  const body = await request.text()
  const pairs = Array.from(new URLSearchParams(body).entries()) as [string, string][]
  const data = Object.fromEntries(pairs)
  const payload = await getPayloadClient()
  const reject = (reason: string, status = 400) => {
    payload.logger.warn(`PayFast ITN rejected: ${reason} (invoice ${data.m_payment_id ?? '?'})`)
    return new Response(reason, { status })
  }

  if (!verifyItnSignature(pairs)) return reject('Invalid signature')
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip')
  if (!(await isPayfastIP(ip ?? null))) return reject('Unrecognised source address', 403)
  if (data.merchant_id !== payfastConfig().merchantId) return reject('Merchant mismatch')

  let invoice: Invoice
  try {
    invoice = await payload.findByID({ collection: 'invoices', id: data.m_payment_id, depth: 0, overrideAccess: true })
  } catch {
    return reject('Unknown invoice')
  }
  if (Math.abs(Number(data.amount_gross) - Number(invoice.amount)) > 0.01) return reject('Amount mismatch')

  try {
    if (!(await confirmWithPayfast(pairs))) return reject('PayFast did not confirm this notification')
  } catch {
    return reject('Could not reach PayFast to confirm', 502)
  }

  const status = statusMap[data.payment_status] ?? 'pending'
  const existing = await payload.find({
    collection: 'payments',
    overrideAccess: true,
    limit: 1,
    depth: 0,
    where: { providerPaymentId: { equals: data.pf_payment_id } },
  })
  if (existing.docs[0]) {
    await payload.update({
      collection: 'payments',
      id: existing.docs[0].id,
      overrideAccess: true,
      data: { status, raw: data },
    })
  } else {
    await payload.create({
      collection: 'payments',
      overrideAccess: true,
      data: {
        invoice: invoice.id,
        provider: 'payfast',
        providerPaymentId: data.pf_payment_id,
        amountGross: Number(data.amount_gross),
        amountFee: Number(data.amount_fee) || 0,
        amountNet: Number(data.amount_net) || 0,
        status,
        payerEmail: data.email_address || undefined,
        sandbox: !payfastConfig().live,
        receivedAt: new Date().toISOString(),
        raw: data,
      },
    })
  }

  if (status === 'complete' && invoice.status !== 'paid') {
    const paid = await payload.update({
      collection: 'invoices',
      id: invoice.id,
      overrideAccess: true,
      data: {
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: 'payfast',
        paymentReference: data.pf_payment_id,
      },
    })
    await afterInvoicePaid(payload, paid)
    await notifyPaymentReceived(payload, paid)
  }
  return new Response('OK', { status: 200 })
}
