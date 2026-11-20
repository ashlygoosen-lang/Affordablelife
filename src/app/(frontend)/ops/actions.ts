'use server'

import { afterInvoicePaid, generateMonthlyInvoices, markOverdueInvoices } from '@/lib/billing'
import { notifyPaymentReceived } from '@/lib/notify'
import { getPayloadClient } from '@/lib/payload'
import { currentStaff } from '@/lib/staff-auth'

type Result = { ok: boolean; message: string }

export async function runBillingNow(): Promise<Result> {
  if (!(await currentStaff())) return { ok: false, message: 'Staff access required.' }
  const payload = await getPayloadClient()
  const created = await generateMonthlyInvoices(payload)
  const overdue = await markOverdueInvoices(payload)
  return { ok: true, message: `${created} invoice${created === 1 ? '' : 's'} issued, ${overdue} marked overdue.` }
}

export async function recordEftPayment(formData: FormData): Promise<Result> {
  const staff = await currentStaff()
  if (!staff) return { ok: false, message: 'Staff access required.' }
  const id = String(formData.get('id') ?? '').slice(0, 100)
  const reference = String(formData.get('reference') ?? '').trim().slice(0, 120)
  if (!id) return { ok: false, message: 'Choose an invoice.' }
  const payload = await getPayloadClient()
  try {
    const invoice = await payload.findByID({ collection: 'invoices', id, depth: 0, overrideAccess: true })
    if (invoice.status === 'paid') return { ok: false, message: 'Already paid.' }
    const paid = await payload.update({
      collection: 'invoices',
      id,
      overrideAccess: false,
      user: staff,
      data: { status: 'paid', paidAt: new Date().toISOString(), paymentMethod: 'eft', paymentReference: reference || `EFT-${invoice.number}` },
    })
    await payload.create({
      collection: 'payments',
      overrideAccess: false,
      user: staff,
      data: {
        invoice: id,
        provider: 'manual',
        providerPaymentId: `manual-${id}`,
        amountGross: Number(invoice.amount),
        amountNet: Number(invoice.amount),
        status: 'complete',
        receivedAt: new Date().toISOString(),
        raw: { recordedBy: staff.email, reference },
      },
    })
    await afterInvoicePaid(payload, paid)
    await notifyPaymentReceived(payload, paid)
    return { ok: true, message: `${invoice.number} marked paid.` }
  } catch (error) {
    console.error('[ops]', error)
    return { ok: false, message: 'Could not record that payment.' }
  }
}

export async function updateMaintenanceAsStaff(formData: FormData): Promise<Result> {
  const staff = await currentStaff()
  if (!staff) return { ok: false, message: 'Staff access required.' }
  const status = String(formData.get('status') ?? '')
  if (!['open', 'in-progress', 'scheduled', 'resolved', 'closed'].includes(status)) {
    return { ok: false, message: 'Choose a valid status.' }
  }
  const payload = await getPayloadClient()
  try {
    await payload.update({
      collection: 'maintenance-requests',
      id: String(formData.get('id') ?? '').slice(0, 100),
      overrideAccess: false,
      user: staff,
      data: {
        status: status as 'open',
        resolutionNote: String(formData.get('resolutionNote') ?? '').trim().slice(0, 1000) || undefined,
      },
    })
    return { ok: true, message: 'Updated.' }
  } catch (error) {
    console.error('[ops]', error)
    return { ok: false, message: 'Could not update that request.' }
  }
}
