import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountShell } from '@/components/account-shell'
import { EmptyState, Panel, StatusPill, shortDate } from '@/components/dashboard/ui'
import { MaintenanceForm } from '@/components/maintenance-form'
import { appAuth } from '@/lib/app-auth'
import { getMemberData } from '@/lib/member-data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Maintenance' }

const categoryLabel: Record<string, string> = {
  plumbing: 'Plumbing',
  electrical: 'Electrical',
  appliances: 'Appliances',
  internet: 'Wi-Fi & internet',
  security: 'Security & access',
  cleaning: 'Cleaning',
  furniture: 'Furniture',
  other: 'Other',
}

export default async function MaintenancePage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/account?next=/account/maintenance')
  const data = await getMemberData(user)
  const eligible = data.tenancies
    .filter((tenancy) => ['active', 'notice', 'pending-payment'].includes(tenancy.status))
    .map((tenancy) => ({ id: String(tenancy.id), label: tenancy.label ?? 'My tenancy' }))

  return (
    <AccountShell user={user} active="/account/maintenance" title="Maintenance" subtitle="Report a problem and follow it until it is fixed.">
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_1.1fr]">
        <Panel title="Report an issue">
          {eligible.length ? (
            <MaintenanceForm tenancies={eligible} />
          ) : (
            <EmptyState
              title="Available once you move in"
              text="Maintenance requests open when your tenancy is confirmed."
              action={<Link className="secondary-button" href="/account">Back to overview</Link>}
            />
          )}
          <p className="mt-6 border-t border-[#EDF0EE] pt-4 text-xs leading-5 text-[#7A858A]">
            For fire, gas leaks or break-ins, call emergency services first, then let us know on WhatsApp +27 21 555 0142.
          </p>
        </Panel>
        <Panel title="Your requests">
          {data.maintenance.length ? (
            <ul className="space-y-3">
              {data.maintenance.map((request) => (
                <li className="rounded-2xl border border-[#E8ECEA] p-4" key={request.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-[#14202B]">{request.title}</p>
                      <p className="mt-0.5 text-xs text-[#7A858A]">
                        {categoryLabel[request.category] ?? request.category} · reported {shortDate(request.createdAt)}
                        {request.priority === 'urgent' ? ' · urgent' : ''}
                      </p>
                    </div>
                    <StatusPill status={request.status} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#4A5961]">{request.description}</p>
                  {request.resolutionNote && (
                    <p className="mt-3 rounded-xl bg-[#E3F0EB] p-3 text-sm leading-6 text-[#22594B]">{request.resolutionNote}</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#68757A]">No requests yet.</p>
          )}
        </Panel>
      </div>
    </AccountShell>
  )
}
