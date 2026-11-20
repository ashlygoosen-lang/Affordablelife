import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ExternalLink, FileText, Home as HomeIcon, LayoutDashboard, Receipt, Settings, Wrench } from 'lucide-react'
import { DashboardShell, DataTable, EmptyState, Panel, Stat, StatusPill, rand, shortDate } from '@/components/dashboard/ui'
import { RecordEftForm, RunBillingButton } from '@/components/ops-controls'
import { StatusUpdateForm } from '@/components/status-update-form'
import { periodOf } from '@/lib/billing'
import { getPayloadClient } from '@/lib/payload'
import { currentStaff } from '@/lib/staff-auth'
import { updateMaintenanceAsStaff } from './actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Operations', robots: { index: false } }

const DAY = 86_400_000

export default async function OperationsPage() {
  const staff = await currentStaff()
  if (!staff) redirect('/admin/login?redirect=%2Fops')
  const payload = await getPayloadClient()
  const all = { overrideAccess: true as const, depth: 0 }
  const since = new Date(Date.now() - 30 * DAY).toISOString()
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setUTCMonth(sixMonthsAgo.getUTCMonth() - 5, 1)

  const [paidInvoices, openInvoices, applications, interests, tenancies, homes, maintenance, payments] = await Promise.all([
    payload.find({ collection: 'invoices', ...all, limit: 2000, select: { amount: true, paidAt: true }, where: { and: [{ status: { equals: 'paid' } }, { paidAt: { greater_than_equal: sixMonthsAgo.toISOString() } }] } }),
    payload.find({ collection: 'invoices', ...all, limit: 500, sort: 'dueDate', where: { status: { in: ['issued', 'overdue'] } } }),
    payload.find({ collection: 'tenant-applications', ...all, limit: 500, sort: '-updatedAt', select: { applicantName: true, status: true, applicationKind: true, tier: true, submittedAt: true, updatedAt: true } }),
    payload.find({ collection: 'demand-interests', ...all, depth: 1, limit: 2000, select: { suburb: true, roomsRequested: true, status: true, createdAt: true } }),
    payload.find({ collection: 'tenancies', ...all, limit: 1000 }),
    payload.find({ collection: 'homes', ...all, limit: 200, select: { title: true, rooms: true, status: true } }),
    payload.find({ collection: 'maintenance-requests', overrideAccess: true, depth: 1, limit: 100, sort: '-createdAt', where: { status: { in: ['open', 'in-progress', 'scheduled'] } } }),
    payload.find({ collection: 'payments', overrideAccess: true, depth: 1, limit: 8, sort: '-receivedAt', where: { status: { equals: 'complete' } } }),
  ])

  const thisPeriod = periodOf(new Date())
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(sixMonthsAgo)
    date.setUTCMonth(sixMonthsAgo.getUTCMonth() + index)
    return periodOf(date)
  })
  const revenue = new Map(months.map((month) => [month, 0]))
  for (const invoice of paidInvoices.docs) {
    const month = invoice.paidAt ? periodOf(new Date(invoice.paidAt)) : ''
    if (revenue.has(month)) revenue.set(month, (revenue.get(month) ?? 0) + Number(invoice.amount))
  }
  const maxRevenue = Math.max(1, ...revenue.values())
  const outstanding = openInvoices.docs.reduce((total, invoice) => total + Number(invoice.amount), 0)
  const overdue = openInvoices.docs.filter((invoice) => invoice.status === 'overdue')
  const liveRooms = homes.docs.filter((home) => home.status === 'verified').reduce((total, home) => total + Number(home.rooms), 0)
  const occupiedRooms = tenancies.docs.filter((tenancy) => tenancy.kind === 'room' && ['active', 'notice'].includes(tenancy.status)).length
  const needsSetup = tenancies.docs.filter((tenancy) => tenancy.status === 'pending-payment' && (!tenancy.tenant || !Number(tenancy.monthlyRent)))

  const pipeline = [
    { label: 'Drafts', count: applications.docs.filter((a) => a.status === 'draft').length },
    { label: 'Submitted', count: applications.docs.filter((a) => a.status === 'submitted').length },
    { label: 'In review', count: applications.docs.filter((a) => ['documents-requested', 'verification-in-progress', 'affordability-review'].includes(a.status ?? '')).length },
    { label: 'Approved', count: applications.docs.filter((a) => ['approved', 'lease-sent', 'lease-signed', 'deposit-paid'].includes(a.status ?? '')).length },
  ]
  const demand = new Map<string, number>()
  for (const interest of interests.docs) {
    if (interest.status === 'withdrawn') continue
    const name = typeof interest.suburb === 'object' && interest.suburb ? interest.suburb.name : 'Unknown'
    demand.set(name, (demand.get(name) ?? 0) + Number(interest.roomsRequested))
  }
  const demandRows = Array.from(demand.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const newInterests = interests.docs.filter((interest) => interest.createdAt >= since).length

  return (
    <DashboardShell
      area="Operations"
      title="Operations"
      subtitle={`Signed in as ${staff.email}`}
      active="/ops"
      nav={[
        { href: '/ops', label: 'Dashboard', icon: <LayoutDashboard /> },
        { href: '/admin/collections/tenant-applications', label: 'Applications', icon: <FileText /> },
        { href: '/admin/collections/invoices', label: 'Invoices', icon: <Receipt /> },
        { href: '/admin/collections/tenancies', label: 'Tenancies', icon: <HomeIcon /> },
        { href: '/admin/collections/maintenance-requests', label: 'Maintenance', icon: <Wrench /> },
        { href: '/admin/globals/payment-settings', label: 'Payment settings', icon: <Settings /> },
        { href: '/admin', label: 'Admin panel', icon: <ExternalLink /> },
      ]}
      actions={<RunBillingButton />}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat emphasis label={`Collected in ${thisPeriod}`} value={rand(revenue.get(thisPeriod))} note="Paid invoices this month" />
        <Stat label="Outstanding" value={rand(outstanding)} note={`${overdue.length} overdue`} />
        <Stat label="Occupancy" value={liveRooms ? `${Math.round((occupiedRooms / liveRooms) * 100)}%` : '—'} note={`${occupiedRooms} of ${liveRooms} live rooms`} />
        <Stat label="New interest (30 days)" value={newInterests} note={`${interests.docs.length} registrations in total`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Panel title="Collections, last six months">
          <div className="flex h-48 items-end gap-3" role="img" aria-label="Monthly collections bar chart">
            {months.map((month) => {
              const value = revenue.get(month) ?? 0
              return (
                <div className="flex flex-1 flex-col items-center gap-2" key={month}>
                  <span className="text-[11px] tabular-nums text-[#5F6D74]">{value ? rand(value) : ''}</span>
                  <div
                    className={`w-full rounded-t-lg ${month === thisPeriod ? 'bg-[#0E2A3B]' : 'bg-[#C9D6D2]'}`}
                    style={{ height: `${Math.max(4, (value / maxRevenue) * 140)}px` }}
                  />
                  <span className="text-[11px] text-[#7A858A]">{new Date(`${month}-01`).toLocaleDateString('en-ZA', { month: 'short' })}</span>
                </div>
              )
            })}
          </div>
        </Panel>
        <Panel title="Application pipeline" action={<Link className="text-sm font-semibold text-[#C2502A]" href="/admin/collections/tenant-applications">Review</Link>}>
          <div className="grid grid-cols-4 gap-3">
            {pipeline.map((stage) => (
              <div className="rounded-2xl bg-[#F4F5F3] p-4" key={stage.label}>
                <p className="font-serif text-3xl tabular-nums text-[#0E2A3B]">{stage.count}</p>
                <p className="mt-1 text-xs text-[#5F6D74]">{stage.label}</p>
              </div>
            ))}
          </div>
          <ul className="mt-5 divide-y divide-[#F1F3F2] text-sm">
            {applications.docs.filter((a) => a.status === 'submitted').slice(0, 4).map((application) => (
              <li className="flex items-center justify-between py-2.5" key={application.id}>
                <Link className="font-medium hover:underline" href={`/admin/collections/tenant-applications/${application.id}`}>
                  {application.applicantName}
                </Link>
                <span className="text-xs text-[#7A858A]">{application.applicationKind === 'office' ? 'Office' : 'Room'} · {shortDate(application.submittedAt)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Awaiting payment" className="mt-6" action={<Link className="text-sm font-semibold text-[#C2502A]" href="/admin/collections/invoices">All invoices</Link>}>
        <DataTable
          head={['Invoice', 'Payer', 'For', 'Due', 'Status', 'Amount', '']}
          rows={openInvoices.docs.slice(0, 12).map((invoice) => [
            <Link className="font-medium hover:underline" key="n" href={`/admin/collections/invoices/${invoice.id}`}>{invoice.number}</Link>,
            invoice.payerName,
            <span className="block min-w-[220px] max-w-[340px] whitespace-normal text-[#4A5961]" key="d">{invoice.description}</span>,
            shortDate(invoice.dueDate),
            <StatusPill key="s" status={invoice.status} />,
            <span className="font-semibold" key="a">{rand(invoice.amount, true)}</span>,
            <RecordEftForm key="e" id={String(invoice.id)} />,
          ])}
          empty={<EmptyState title="Nothing outstanding." text="Issued and overdue invoices appear here." />}
        />
      </Panel>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-2">
        <Panel title="Open maintenance">
          {maintenance.docs.length ? (
            <ul className="space-y-4">
              {[...maintenance.docs]
                .sort((a, b) => Number(b.priority === 'urgent') - Number(a.priority === 'urgent'))
                .slice(0, 8)
                .map((request) => (
                  <li className="rounded-2xl border border-[#E8ECEA] p-4" key={request.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{request.title}</p>
                        <p className="text-xs text-[#7A858A]">
                          {typeof request.home === 'object' && request.home ? request.home.title : '—'} · {shortDate(request.createdAt)}
                        </p>
                      </div>
                      <StatusPill status={request.priority === 'urgent' ? 'urgent' : request.status} />
                    </div>
                    <StatusUpdateForm id={String(request.id)} status={request.status} note={request.resolutionNote} action={updateMaintenanceAsStaff} />
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-[#68757A]">No open requests.</p>
          )}
        </Panel>
        <div className="space-y-6">
          <Panel title="Tenancies needing setup">
            {needsSetup.length ? (
              <ul className="divide-y divide-[#F1F3F2] text-sm">
                {needsSetup.map((tenancy) => (
                  <li className="flex items-center justify-between gap-3 py-2.5" key={tenancy.id}>
                    <Link className="font-medium hover:underline" href={`/admin/collections/tenancies/${tenancy.id}`}>{tenancy.label}</Link>
                    <span className="text-xs text-[#9A3A1C]">{!tenancy.tenant ? 'Link member account' : 'Set monthly rent'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#68757A]">Every approved tenancy is invoiced.</p>
            )}
          </Panel>
          <Panel title="Demand by suburb">
            <ul className="space-y-3">
              {demandRows.map(([name, rooms]) => (
                <li key={name}>
                  <div className="flex justify-between text-sm">
                    <span>{name}</span>
                    <span className="tabular-nums text-[#5F6D74]">{rooms} rooms · target 24</span>
                  </div>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#E3E8E6]">
                    <span className="block h-full rounded-full bg-[#B8914A]" style={{ width: `${Math.min(100, (rooms / 24) * 100)}%` }} />
                  </span>
                </li>
              ))}
              {!demandRows.length && <li className="text-sm text-[#68757A]">No registrations yet.</li>}
            </ul>
          </Panel>
          <Panel title="Recent payments">
            <ul className="divide-y divide-[#F1F3F2] text-sm">
              {payments.docs.map((payment) => (
                <li className="flex items-center justify-between py-2.5" key={payment.id}>
                  <span>
                    {typeof payment.invoice === 'object' && payment.invoice ? payment.invoice.payerName : 'Invoice'}
                    <span className="ml-2 text-xs text-[#7A858A]">{payment.provider === 'payfast' ? 'PayFast' : 'EFT'}{payment.sandbox ? ' (test)' : ''}</span>
                  </span>
                  <span className="font-medium tabular-nums">{rand(payment.amountGross, true)}</span>
                </li>
              ))}
              {!payments.docs.length && <li className="text-sm text-[#68757A]">No payments yet.</li>}
            </ul>
          </Panel>
        </div>
      </div>
    </DashboardShell>
  )
}
