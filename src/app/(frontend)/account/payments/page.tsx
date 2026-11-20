import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountShell } from '@/components/account-shell'
import { DataTable, EmptyState, Panel, Stat, StatusPill, rand, shortDate } from '@/components/dashboard/ui'
import { appAuth } from '@/lib/app-auth'
import { getMemberData } from '@/lib/member-data'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Payments' }

const methodLabel: Record<string, string> = { payfast: 'PayFast', eft: 'EFT', cash: 'Cash', other: 'Other' }

export default async function PaymentsPage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/account?next=/account/payments')
  const data = await getMemberData(user)
  const outstandingTotal = data.outstanding.reduce((total, invoice) => total + Number(invoice.amount), 0)
  const year = new Date().getFullYear()
  const paidThisYear = data.paid
    .filter((invoice) => invoice.paidAt && new Date(invoice.paidAt).getFullYear() === year)
    .reduce((total, invoice) => total + Number(invoice.amount), 0)

  return (
    <AccountShell user={user} active="/account/payments" title="Payments" subtitle="Invoices, online payments and receipts.">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat emphasis label="Outstanding" value={rand(outstandingTotal)} note={`${data.outstanding.length} invoice${data.outstanding.length === 1 ? '' : 's'}`} />
        <Stat label={`Paid in ${year}`} value={rand(paidThisYear)} note={`${data.paid.length} payments in total`} />
        <Stat label="Monthly rent" value={data.currentTenancy?.monthlyRent ? rand(data.currentTenancy.monthlyRent) : '—'} note={data.currentTenancy ? `Due on day ${data.currentTenancy.billingDay ?? 1}` : 'No active tenancy'} />
      </div>

      <Panel title="To pay" className="mt-6">
        <DataTable
          head={['Invoice', 'Description', 'Due', 'Status', 'Amount', '']}
          rows={data.outstanding.map((invoice) => [
            <span className="font-medium" key="n">{invoice.number}</span>,
            <span className="block min-w-[220px] max-w-[340px] whitespace-normal text-[#4A5961]" key="d">{invoice.description}</span>,
            shortDate(invoice.dueDate),
            <StatusPill key="s" status={invoice.status} />,
            <span className="font-semibold" key="a">{rand(invoice.amount, true)}</span>,
            <Link key="p" className="primary-button !min-h-9 !px-4 !text-xs" href={`/pay/${invoice.id}`}>
              Pay now
            </Link>,
          ])}
          empty={<EmptyState title="Nothing to pay." text="When an invoice is issued it appears here and we email you a copy." />}
        />
      </Panel>

      <Panel title="Payment history" className="mt-6">
        <DataTable
          head={['Invoice', 'Description', 'Paid', 'Method', 'Reference', 'Amount']}
          rows={data.paid.map((invoice) => [
            <Link className="font-medium underline-offset-4 hover:underline" key="n" href={`/pay/${invoice.id}`}>
              {invoice.number}
            </Link>,
            <span className="block min-w-[220px] max-w-[340px] whitespace-normal text-[#4A5961]" key="d">{invoice.description}</span>,
            shortDate(invoice.paidAt),
            methodLabel[invoice.paymentMethod ?? ''] ?? '—',
            <span className="text-[#5F6D74]" key="r">{invoice.paymentReference || '—'}</span>,
            <span className="font-semibold" key="a">{rand(invoice.amount, true)}</span>,
          ])}
          empty={<p className="text-sm text-[#68757A]">Your receipts will be listed here.</p>}
        />
      </Panel>
    </AccountShell>
  )
}
