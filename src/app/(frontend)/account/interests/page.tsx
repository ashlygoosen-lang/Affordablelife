import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, FileClock, FilePlus2 } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { appAuth } from '@/lib/app-auth'
import { AccountShell } from '@/components/account-shell'

export const metadata: Metadata = { title: 'My applications' }

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'documents-requested': 'Documents requested',
  'verification-in-progress': 'Verification in progress',
  'affordability-review': 'Affordability review',
  approved: 'Approved',
  waitlisted: 'Waitlisted',
  declined: 'Declined',
  'lease-sent': 'Lease sent',
  'lease-signed': 'Lease signed',
  'deposit-paid': 'Deposit paid',
}

export default async function ApplicationsPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/account?next=/account/interests')
  const payload = await getPayload({ config })
  const applications = await payload.find({
    collection: 'tenant-applications',
    overrideAccess: false,
    user,
    depth: 1,
    limit: 50,
    sort: '-updatedAt',
  })

  return (
    <AccountShell
      user={user}
      active="/account/interests"
      title="Applications"
      subtitle={`Drafts and submitted applications linked to ${user.email}.`}
      actions={
        <Link className="primary-button !min-h-11" href="/interest">
          <FilePlus2 size={17} /> New application
        </Link>
      }
    >
      <div>
          {applications.docs.length ? (
            <div className="grid gap-4">
              {applications.docs.map((application) => (
                <article
                  className="grid gap-5 rounded-2xl border border-[#DCE3E1] bg-white p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-center"
                  key={application.id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#E8F2EE] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#2E6F5E]">
                        {application.applicationKind === 'office' ? 'Business office' : 'Personal'}
                      </span>
                      <span className="text-xs font-semibold text-[#748086]">
                        {statusLabels[application.status ?? 'draft']}
                      </span>
                    </div>
                    <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0E2A3B]">
                      {application.applicationKind === 'office'
                        ? application.businessDetails?.companyName || 'Office application'
                        : application.applicantName}
                    </h2>
                    <p className="mt-2 text-sm text-[#68757A]">
                      Updated {new Date(application.updatedAt).toLocaleDateString('en-ZA')}
                    </p>
                  </div>
                  {application.status === 'draft' ? (
                    <Link
                      className="primary-button"
                      href={`/account/applications/${encodeURIComponent(String(application.id))}`}
                    >
                      Continue draft <ArrowRight size={17} />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 text-sm font-semibold text-[#2E6F5E]">
                      <FileClock size={18} /> Under staff review
                    </span>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#DCE3E1] bg-white p-10 text-center">
              <Building2 className="mx-auto text-[#2E6F5E]" size={42} />
              <h2 className="mt-5 font-serif text-3xl font-semibold">
                No linked applications yet.
              </h2>
              <p className="mx-auto mt-3 max-w-lg leading-7 text-[#68757A]">
                Start by registering interest. Applications created while you are logged in appear
                here automatically.
              </p>
              <Link className="primary-button mt-7" href="/interest">
                <FilePlus2 size={18} /> Start an application
              </Link>
            </div>
          )}
      </div>
    </AccountShell>
  )
}
