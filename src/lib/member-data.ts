import 'server-only'

import type { User } from '@/payload-types'
import { getPayloadClient } from './payload'

/** Everything a signed-in member may see, read through their own access rights. */
export async function getMemberData(user: User) {
  const payload = await getPayloadClient()
  const asUser = { overrideAccess: false as const, user }
  const [tenancies, invoices, maintenance, applications] = await Promise.all([
    payload.find({ collection: 'tenancies', ...asUser, depth: 2, limit: 20, sort: '-startDate', where: { tenant: { equals: user.id } } }),
    payload.find({ collection: 'invoices', ...asUser, depth: 0, limit: 200, sort: '-dueDate', where: { tenant: { equals: user.id } } }),
    payload.find({ collection: 'maintenance-requests', ...asUser, depth: 1, limit: 50, sort: '-createdAt', where: { reporter: { equals: user.id } } }),
    payload.find({ collection: 'tenant-applications', ...asUser, depth: 1, limit: 50, sort: '-updatedAt' }),
  ])
  const outstanding = invoices.docs.filter((invoice) => invoice.status === 'issued' || invoice.status === 'overdue')
  outstanding.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  return {
    tenancies: tenancies.docs,
    currentTenancy: tenancies.docs.find((tenancy) => ['active', 'notice', 'pending-payment'].includes(tenancy.status)) ?? null,
    invoices: invoices.docs,
    outstanding,
    paid: invoices.docs.filter((invoice) => invoice.status === 'paid'),
    maintenance: maintenance.docs,
    applications: applications.docs,
  }
}
