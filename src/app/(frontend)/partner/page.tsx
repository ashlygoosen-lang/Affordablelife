import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Building, LayoutDashboard, UserRound } from 'lucide-react'
import { DashboardShell, DataTable, EmptyState, Panel, Stat, StatusPill, rand, shortDate } from '@/components/dashboard/ui'
import { StatusUpdateForm } from '@/components/status-update-form'
import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'
import { periodOf } from '@/lib/billing'
import type { Suburb } from '@/payload-types'
import { updateMaintenanceAsPartner } from './actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Partner portal', robots: { index: false } }

export default async function PartnerPortalPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/account?next=/partner')
  if (user.role !== 'partner') {
    return (
      <section className="page-section">
        <div className="page-container max-w-xl text-center">
          <h1 className="font-serif text-4xl text-[#0E2A3B]">Partner portal</h1>
          <p className="mt-4 leading-7 text-[#5F6D74]">
            This area is for property partners. Submit your property and we will set up partner access once it is verified.
          </p>
          <Link className="primary-button mt-6" href="/partners#post-property">Submit a property</Link>
        </div>
      </section>
    )
  }

  const payload = await getPayloadClient()
  // Homes are filtered to this partner explicitly; tenancy, maintenance and payout reads go through access control.
  const [homes, tenancies, maintenance, payouts] = await Promise.all([
    payload.find({ collection: 'homes', overrideAccess: true, depth: 1, limit: 100, where: { partner: { equals: user.id } } }),
    payload.find({ collection: 'tenancies', overrideAccess: false, user, depth: 0, limit: 500 }),
    payload.find({ collection: 'maintenance-requests', overrideAccess: false, user, depth: 1, limit: 100, sort: '-createdAt' }),
    payload.find({ collection: 'payouts', overrideAccess: false, user, depth: 0, limit: 24, sort: '-period' }),
  ])
  const tenancyIDs = tenancies.docs.map((tenancy) => tenancy.id)
  const period = periodOf(new Date())
  const collected = tenancyIDs.length
    ? await payload.find({
        collection: 'invoices',
        overrideAccess: true,
        depth: 0,
        limit: 1000,
        select: { amount: true, paidAt: true },
        where: { and: [{ tenancy: { in: tenancyIDs } }, { status: { equals: 'paid' } }] },
      })
    : { docs: [] as { amount: number; paidAt?: string | null }[] }
  const collectedThisMonth = collected.docs
    .filter((invoice) => invoice.paidAt && periodOf(new Date(invoice.paidAt)) === period)
    .reduce((total, invoice) => total + Number(invoice.amount), 0)

  const occupiedByHome = new Map<string, number>()
  for (const tenancy of tenancies.docs) {
    if (!['active', 'notice', 'pending-payment'].includes(tenancy.status)) continue
    const homeID = String(typeof tenancy.home === 'object' ? tenancy.home?.id : tenancy.home)
    occupiedByHome.set(homeID, (occupiedByHome.get(homeID) ?? 0) + 1)
  }
  const totalRooms = homes.docs.reduce((total, home) => total + Number(home.rooms), 0)
  const occupied = Array.from(occupiedByHome.values()).reduce((a, b) => a + b, 0)
  const open = maintenance.docs.filter((request) => !['resolved', 'closed'].includes(request.status))

  return (
    <DashboardShell
      area="Partner portal"
      title={user.companyName || `${user.name.split(' ')[0]}'s properties`}
      subtitle="Occupancy, collections, maintenance and payouts for the homes you list with us."
      active="/partner"
      nav={[
        { href: '/partner', label: 'Overview', icon: <LayoutDashboard /> },
        { href: '/account/home', label: 'Profile', icon: <UserRound /> },
        { href: '/partners#post-property', label: 'Add a property', icon: <Building /> },
      ]}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat emphasis label="Collected this month" value={rand(collectedThisMonth)} note="Tenant payments received" />
        <Stat label="Occupancy" value={totalRooms ? `${Math.round((occupied / totalRooms) * 100)}%` : '—'} note={`${occupied} of ${totalRooms} rooms`} />
        <Stat label="Properties" value={homes.docs.length} note={`${homes.docs.filter((home) => home.status === 'verified').length} live`} />
        <Stat label="Open maintenance" value={open.length} note={open.some((request) => request.priority === 'urgent') ? 'Includes urgent' : 'None urgent'} />
      </div>

      <Panel title="Properties" className="mt-6">
        <DataTable
          head={['Home', 'Suburb', 'Rooms filled', 'Group', 'Listing']}
          rows={homes.docs.map((home) => {
            const filled = occupiedByHome.get(String(home.id)) ?? 0
            return [
              home.status === 'verified' ? (
                <Link className="font-medium underline-offset-4 hover:underline" key="t" href={`/homes/${home.slug}`}>{home.title}</Link>
              ) : (
                <span className="font-medium" key="t">{home.title}</span>
              ),
              typeof home.suburb === 'object' ? (home.suburb as Suburb).name : '—',
              <span key="f">
                <span className="font-medium">{filled}</span>
                <span className="text-[#7A858A]"> / {home.rooms}</span>
                <span className="ml-3 inline-block h-1.5 w-20 overflow-hidden rounded-full bg-[#E3E8E6] align-middle">
                  <span className="block h-full bg-[#2E6F5E]" style={{ width: `${Math.min(100, (filled / home.rooms) * 100)}%` }} />
                </span>
              </span>,
              <StatusPill key="g" status={home.groupStatus} />,
              <StatusPill key="s" status={home.status === 'verified' ? 'active' : home.status} />,
            ]
          })}
          empty={<EmptyState title="No properties linked yet" text="Our team links your verified homes to this portal." />}
        />
      </Panel>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Maintenance">
          {maintenance.docs.length ? (
            <ul className="space-y-4">
              {maintenance.docs.map((request) => (
                <li className="rounded-2xl border border-[#E8ECEA] p-4" key={request.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{request.title}</p>
                      <p className="text-xs text-[#7A858A]">
                        {typeof request.home === 'object' && request.home ? request.home.title : ''} · {shortDate(request.createdAt)}
                        {request.priority === 'urgent' ? ' · urgent' : ''}
                      </p>
                    </div>
                    <StatusPill status={request.status} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4A5961]">{request.description}</p>
                  <StatusUpdateForm id={String(request.id)} status={request.status} note={request.resolutionNote} action={updateMaintenanceAsPartner} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#68757A]">No maintenance requests for your homes.</p>
          )}
        </Panel>
        <Panel title="Payouts">
          <DataTable
            head={['Month', 'Collected', 'Fee', 'Payout', 'Status']}
            rows={payouts.docs.map((payout) => [
              payout.period,
              rand(payout.grossCollected),
              <span className="text-[#7A858A]" key="f">−{rand(payout.managementFee)}</span>,
              <span className="font-semibold" key="a">{rand(payout.amount)}</span>,
              <StatusPill key="s" status={payout.status} />,
            ])}
            empty={<p className="text-sm text-[#68757A]">Monthly payout statements appear here.</p>}
          />
        </Panel>
      </div>
    </DashboardShell>
  )
}
