import type { Payload, PayloadRequest } from 'payload'
import type { Invoice, Tenancy } from '@/payload-types'

const DAY = 86_400_000

export const roundRand = (value: number) => Math.round(value * 100) / 100
export const periodOf = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
const idOf = (value: unknown) =>
  value && typeof value === 'object' && 'id' in value ? String((value as { id: unknown }).id) : value ? String(value) : undefined

export async function getPaymentSettings(payload: Payload) {
  try {
    return await payload.findGlobal({ slug: 'payment-settings', overrideAccess: true })
  } catch {
    return null
  }
}

const isUniqueViolation = (error: unknown) =>
  /unique|duplicate/i.test(String((error as { message?: string })?.message ?? error))

/** Deposit + first month, issued once a tenancy has a monthly rent. */
export async function issueInitialInvoices(payload: Payload, tenancy: Tenancy, req?: PayloadRequest) {
  const settings = await getPaymentSettings(payload)
  const dueDays = settings?.invoiceDueDays ?? 7
  const due = new Date(Date.now() + dueDays * DAY).toISOString()
  const rent = roundRand(Number(tenancy.monthlyRent))
  const deposit = roundRand(Number(tenancy.depositAmount) || rent)
  const start = new Date(tenancy.startDate)
  const base = {
    tenant: idOf(tenancy.tenant),
    tenancy: String(tenancy.id),
    application: idOf(tenancy.application),
    payerName: tenancy.tenantName,
    payerEmail: tenancy.tenantEmail,
    dueDate: due,
    status: 'issued' as const,
  }

  // Credit a paid reservation deposit against the first month.
  let credit = 0
  const applicationID = idOf(tenancy.application)
  if (applicationID) {
    try {
      const application = await payload.findByID({
        collection: 'tenant-applications',
        id: applicationID,
        depth: 0,
        overrideAccess: true,
        req,
      })
      const interestID = idOf(application.interest)
      if (interestID) {
        const reservations = await payload.find({
          collection: 'invoices',
          overrideAccess: true,
          depth: 0,
          limit: 5,
          req,
          where: {
            and: [
              { interest: { equals: interestID } },
              { kind: { equals: 'reservation-deposit' } },
              { status: { equals: 'paid' } },
            ],
          },
        })
        credit = reservations.docs.reduce((total, invoice) => total + Number(invoice.amount), 0)
      }
    } catch {
      credit = 0
    }
  }

  const place = tenancy.kind === 'office' ? 'office' : 'room'
  const invoices: Partial<Invoice>[] = [
    {
      ...base,
      kind: 'deposit',
      amount: deposit,
      description: `Security deposit — ${tenancy.label ?? place}`,
      uniqueKey: `${tenancy.id}:deposit`,
    },
    {
      ...base,
      kind: 'first-month',
      amount: roundRand(Math.max(1, rent - credit)),
      period: periodOf(start),
      description: `First month (${periodOf(start)}) — ${tenancy.label ?? place}${credit ? ` · less reservation deposit R${credit}` : ''}`,
      uniqueKey: `${tenancy.id}:first`,
    },
  ]
  for (const data of invoices) {
    try {
      await payload.create({ collection: 'invoices', overrideAccess: true, req, data: data as Invoice })
    } catch (error) {
      if (!isUniqueViolation(error)) throw error
    }
  }
  await payload.update({
    collection: 'tenancies',
    id: tenancy.id,
    overrideAccess: true,
    req,
    context: { skipBilling: true },
    data: { initialInvoicesIssued: true },
  })
}

/** Creates this month's rent invoice for every active tenancy (idempotent). */
export async function generateMonthlyInvoices(payload: Payload, now = new Date()) {
  const period = periodOf(now)
  const monthStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
  const monthEnd = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59)
  const tenancies = await payload.find({
    collection: 'tenancies',
    overrideAccess: true,
    depth: 0,
    limit: 1000,
    where: {
      and: [{ status: { in: ['active', 'notice'] } }, { monthlyRent: { greater_than: 0 } }],
    },
  })
  const settings = await getPaymentSettings(payload)
  const dueDays = settings?.invoiceDueDays ?? 7
  let created = 0
  for (const tenancy of tenancies.docs) {
    const start = new Date(tenancy.startDate)
    if (periodOf(start) === period || start.getTime() > monthEnd) continue
    if (tenancy.endDate && new Date(tenancy.endDate).getTime() < monthStart) continue
    const billingDay = Math.min(28, Math.max(1, Number(tenancy.billingDay) || 1))
    let due = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), billingDay, 12))
    // An invoice issued after its billing day gets the normal payment window instead of being overdue at once.
    if (due.getTime() < now.getTime()) due = new Date(now.getTime() + dueDays * DAY)
    try {
      await payload.create({
        collection: 'invoices',
        overrideAccess: true,
        data: {
          kind: tenancy.kind === 'office' ? 'office-rent' : 'monthly-rent',
          amount: roundRand(Number(tenancy.monthlyRent)),
          description: `${tenancy.kind === 'office' ? 'Office rent' : 'Rent'} ${period} — ${tenancy.label ?? ''}`.trim(),
          period,
          dueDate: due.toISOString(),
          payerName: tenancy.tenantName,
          payerEmail: tenancy.tenantEmail,
          tenant: idOf(tenancy.tenant),
          tenancy: String(tenancy.id),
          uniqueKey: `${tenancy.id}:${period}`,
          status: 'issued',
        },
      })
      created += 1
    } catch (error) {
      if (!isUniqueViolation(error)) payload.logger.error({ err: error, msg: 'Monthly invoice failed' })
    }
  }
  return created
}

export async function markOverdueInvoices(payload: Payload, now = new Date()) {
  const result = await payload.update({
    collection: 'invoices',
    overrideAccess: true,
    where: {
      and: [{ status: { equals: 'issued' } }, { dueDate: { less_than: new Date(now.getTime() - DAY).toISOString() } }],
    },
    data: { status: 'overdue' },
  })
  return result.docs.length
}

/** Side effects once an invoice is settled (online or by staff). */
export async function afterInvoicePaid(payload: Payload, invoice: Invoice, req?: PayloadRequest) {
  if (invoice.kind === 'reservation-deposit') {
    const interestID = idOf(invoice.interest)
    if (interestID) {
      await payload.update({
        collection: 'demand-interests',
        id: interestID,
        overrideAccess: true,
        req,
        data: { reservationDepositStatus: 'paid', status: 'reserved' },
      })
    }
  }
  const tenancyID = idOf(invoice.tenancy)
  if (tenancyID && (invoice.kind === 'deposit' || invoice.kind === 'first-month')) {
    const initial = await payload.find({
      collection: 'invoices',
      overrideAccess: true,
      depth: 0,
      req,
      where: {
        and: [{ tenancy: { equals: tenancyID } }, { kind: { in: ['deposit', 'first-month'] } }],
      },
    })
    const allPaid = initial.docs.length >= 2 && initial.docs.every((doc) => doc.status === 'paid')
    if (allPaid) {
      await payload.update({
        collection: 'tenancies',
        id: tenancyID,
        overrideAccess: true,
        req,
        context: { skipBilling: true },
        data: { status: 'active' },
      })
    }
  }
}

let schedulerStarted = false
/** Runs billing every six hours inside the server process. */
export function startBillingScheduler(payload: Payload) {
  if (schedulerStarted || process.env.BILLING_SCHEDULER === 'off') return
  schedulerStarted = true
  const run = async () => {
    try {
      const created = await generateMonthlyInvoices(payload)
      const overdue = await markOverdueInvoices(payload)
      if (created || overdue) payload.logger.info(`Billing: ${created} invoices issued, ${overdue} marked overdue`)
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Billing cycle failed' })
    }
  }
  setTimeout(run, 30_000).unref()
  setInterval(run, 6 * 60 * 60 * 1000).unref()
}
