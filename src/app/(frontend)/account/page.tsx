import type { Metadata } from 'next'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'
import { AccountShell } from '@/components/account-shell'
import { DataTable, EmptyState, Panel, Stat, StatusPill, rand, shortDate } from '@/components/dashboard/ui'
import { appAuth } from '@/lib/app-auth'
import { getMemberData } from '@/lib/member-data'
import type { Home, Media, TenantApplication, User } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Your account',
  description: 'Your Affordable Life home, payments, maintenance and applications.',
}

export default async function AccountPage() {
  const user = await appAuth.currentUser()
  if (user) return <MemberOverview user={user} />

  return (
    <section className="relative overflow-hidden bg-[#0E2A3B] py-14 text-white sm:py-24">
      <div className="pointer-events-none absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[#B8914A]/10 blur-3xl" />
      <div className="page-container relative grid items-center gap-12 lg:grid-cols-[1fr_500px]">
        <div>
          <p className="text-[15px] text-[#E4C27E]">Member account</p>
          <h1 className="mt-4 max-w-xl font-serif text-[clamp(2.6rem,5vw,4.2rem)] font-light leading-[1.02] tracking-[-0.035em]">
            Your home, your payments and every request in one place.
          </h1>
          <ul className="mt-9 space-y-3.5 text-[15px] text-white/80">
            {[
              'Pay deposits and monthly rent securely with PayFast',
              'Follow your application from submitted to approved',
              'Report maintenance and see when it is fixed',
            ].map((item) => (
              <li className="flex gap-3" key={item}>
                <Check className="mt-0.5 shrink-0 text-[#E4C27E]" size={18} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <Suspense fallback={<div className="min-h-[560px] rounded-3xl bg-white" />}>
          <AuthForm />
        </Suspense>
      </div>
    </section>
  )
}

const pipeline: { key: string; label: string; match: string[] }[] = [
  { key: 'draft', label: 'Draft', match: ['draft'] },
  { key: 'submitted', label: 'Submitted', match: ['submitted'] },
  { key: 'review', label: 'In review', match: ['documents-requested', 'verification-in-progress', 'affordability-review'] },
  { key: 'approved', label: 'Approved', match: ['approved', 'lease-sent', 'lease-signed', 'deposit-paid'] },
]

function ApplicationProgress({ application }: { application: TenantApplication }) {
  const status = application.status ?? 'draft'
  const current = Math.max(0, pipeline.findIndex((step) => step.match.includes(status)))
  const declined = status === 'declined' || status === 'waitlisted'
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="font-medium text-[#14202B]">
          {application.applicationKind === 'office'
            ? application.businessDetails?.companyName || 'Office application'
            : 'Room application'}
        </p>
        <StatusPill status={status} />
      </div>
      {!declined && (
        <ol className="mt-5 grid grid-cols-4 gap-2" aria-label="Application progress">
          {pipeline.map((step, index) => (
            <li key={step.key}>
              <span className={`block h-1.5 rounded-full ${index <= current ? 'bg-[#2E6F5E]' : 'bg-[#E3E8E6]'}`} />
              <span className={`mt-2 block text-[12px] ${index <= current ? 'text-[#22594B] font-medium' : 'text-[#8A9499]'}`}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      )}
      {status === 'draft' && (
        <Link className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C2502A]" href={`/account/applications/${application.id}`}>
          Continue your draft <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}

async function MemberOverview({ user }: { user: User }) {
  const data = await getMemberData(user)
  const next = data.outstanding[0]
  const tenancy = data.currentTenancy
  const home = tenancy && typeof tenancy.home === 'object' ? (tenancy.home as Home) : null
  const cover = home && typeof home.coverImage === 'object' ? (home.coverImage as Media) : null
  const openRequests = data.maintenance.filter((request) => !['resolved', 'closed'].includes(request.status))
  const latestApplication = data.applications[0]

  return (
    <AccountShell
      user={user}
      active="/account"
      title={`Welcome, ${user.name.split(' ')[0]}.`}
      subtitle={tenancy ? tenancy.label ?? undefined : 'Track your application and pay securely online.'}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          emphasis
          label="Next payment"
          value={next ? rand(next.amount) : 'All paid'}
          note={next ? `${next.status === 'overdue' ? 'Overdue since' : 'Due'} ${shortDate(next.dueDate)}` : 'Nothing outstanding'}
        />
        <Stat label="Tenancy" value={tenancy ? (tenancy.status === 'active' ? 'Active' : 'Starting') : '—'} note={tenancy ? `From ${shortDate(tenancy.startDate)}` : 'Not yet confirmed'} />
        <Stat label="Monthly rent" value={tenancy?.monthlyRent ? rand(tenancy.monthlyRent) : '—'} note="All-inclusive" />
        <Stat label="Open requests" value={openRequests.length} note={openRequests.length ? 'Maintenance in progress' : 'Nothing reported'} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Panel
          title="Payments due"
          action={
            <Link className="text-sm font-semibold text-[#C2502A]" href="/account/payments">
              All payments
            </Link>
          }
        >
          <DataTable
            head={['Invoice', 'For', 'Due', 'Amount', '']}
            rows={data.outstanding.slice(0, 5).map((invoice) => [
              <span className="font-medium" key="n">{invoice.number}</span>,
              <span className="block min-w-[220px] max-w-[340px] whitespace-normal text-[#4A5961]" key="d">{invoice.description}</span>,
              <span key="due" className={invoice.status === 'overdue' ? 'font-semibold text-[#9A3A1C]' : ''}>{shortDate(invoice.dueDate)}</span>,
              <span key="a" className="font-semibold">{rand(invoice.amount, true)}</span>,
              <Link key="p" className="primary-button !min-h-9 !px-4 !text-xs" href={`/pay/${invoice.id}`}>
                Pay
              </Link>,
            ])}
            empty={<EmptyState title="You're all paid up." text="New invoices appear here, and we email you when one is issued." />}
          />
        </Panel>

        <Panel title="Your home">
          {tenancy ? (
            <div>
              {cover?.url && (
                <div className="relative -mx-6 -mt-6 mb-5 h-44 overflow-hidden rounded-t-[22px]">
                  <Image src={cover.url.replace(/^https?:\/\/[^/]+/, '')} alt={cover.alt} fill sizes="480px" className="object-cover" />
                </div>
              )}
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-xl text-[#0E2A3B]">{home?.title ?? tenancy.officeDescription ?? 'Your space'}</p>
                <StatusPill status={tenancy.status} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-[#7A858A]">Room</dt>
                  <dd className="mt-0.5 font-medium">{tenancy.roomLabel || (tenancy.kind === 'office' ? 'Office' : 'To be assigned')}</dd>
                </div>
                <div>
                  <dt className="text-[#7A858A]">Move-in</dt>
                  <dd className="mt-0.5 font-medium">{shortDate(tenancy.startDate)}</dd>
                </div>
              </dl>
              {tenancy.status === 'pending-payment' && (
                <p className="mt-5 rounded-xl bg-[#F7EEDB] p-3 text-sm leading-6 text-[#7A5717]">
                  Pay your deposit and first month to confirm your place.
                </p>
              )}
            </div>
          ) : latestApplication ? (
            <ApplicationProgress application={latestApplication} />
          ) : (
            <EmptyState
              title="No home yet"
              text="Register interest in a verified home or office to start your application."
              action={<Link className="primary-button" href="/interest">Register interest</Link>}
            />
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Maintenance"
          action={<Link className="text-sm font-semibold text-[#C2502A]" href="/account/maintenance">{tenancy ? 'Report an issue' : 'View'}</Link>}
        >
          {data.maintenance.length ? (
            <ul className="divide-y divide-[#F1F3F2]">
              {data.maintenance.slice(0, 4).map((request) => (
                <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={request.id}>
                  <span>
                    <span className="block font-medium">{request.title}</span>
                    <span className="text-xs text-[#7A858A]">Reported {shortDate(request.createdAt)}</span>
                  </span>
                  <StatusPill status={request.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#68757A]">
              {tenancy ? 'Nothing reported. If something breaks, report it here and follow the fix.' : 'Available once your tenancy starts.'}
            </p>
          )}
        </Panel>
        <Panel
          title="Applications"
          action={<Link className="text-sm font-semibold text-[#C2502A]" href="/account/interests">All applications</Link>}
        >
          {latestApplication ? (
            <ApplicationProgress application={latestApplication} />
          ) : (
            <p className="text-sm text-[#68757A]">Applications started while signed in appear here.</p>
          )}
        </Panel>
      </div>
    </AccountShell>
  )
}
