import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, CircleAlert, Landmark, ShieldCheck } from 'lucide-react'
import { PayButton, PaymentPoller } from '@/components/pay-button'
import { StatusPill, rand, shortDate } from '@/components/dashboard/ui'
import { getPaymentSettings } from '@/lib/billing'
import { isPayable, loadPayableInvoice } from '@/lib/invoices'
import { getPayloadClient } from '@/lib/payload'
import { payfastConfig } from '@/lib/payfast'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pay invoice', robots: { index: false } }

const kindLabel: Record<string, string> = {
  'reservation-deposit': 'Reservation deposit',
  deposit: 'Security deposit',
  'first-month': 'First month',
  'monthly-rent': 'Monthly rent',
  'office-rent': 'Office rent',
  other: 'Invoice',
}

export default async function PayInvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ t?: string; result?: string }>
}) {
  const { id } = await params
  const { t: token, result } = await searchParams
  const loaded = await loadPayableInvoice(id, token)
  if (!loaded) notFound()
  const { invoice, viaToken } = loaded
  const payload = await getPayloadClient()
  const settings = await getPaymentSettings(payload)
  const payable = isPayable(invoice)
  const sandbox = !payfastConfig().live
  const returning = result === 'return' && payable

  return (
    <section className="min-h-[80vh] bg-[#F4F5F3] py-12 sm:py-20">
      <PaymentPoller active={returning} />
      <div className="page-container grid max-w-[1040px] items-start gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <article className="overflow-hidden rounded-[26px] bg-white shadow-[0_30px_80px_-40px_rgba(14,42,59,.35)]">
          <div className="bg-[#0E2A3B] px-8 py-7 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-[#E4C27E]">{kindLabel[invoice.kind] ?? 'Invoice'}</p>
                <h1 className="mt-1 font-serif text-3xl font-medium tracking-[-0.02em]">Invoice {invoice.number}</h1>
              </div>
              <StatusPill status={invoice.status} />
            </div>
          </div>
          <div className="px-8 py-7">
            <dl className="grid gap-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[#7A858A]">Billed to</dt>
                <dd className="mt-1 font-medium text-[#14202B]">{invoice.payerName}</dd>
                <dd className="text-[#5F6D74]">{invoice.payerEmail}</dd>
              </div>
              <div>
                <dt className="text-[#7A858A]">Due</dt>
                <dd className="mt-1 font-medium text-[#14202B]">{shortDate(invoice.dueDate)}</dd>
              </div>
            </dl>
            <div className="mt-8 border-t border-dashed border-[#D9DEDB] pt-6">
              <div className="flex items-start justify-between gap-6 text-[15px]">
                <span className="text-[#36454D]">{invoice.description}</span>
                <span className="font-medium tabular-nums">{rand(invoice.amount, true)}</span>
              </div>
              <div className="mt-6 flex items-end justify-between border-t border-[#0E2A3B] pt-5">
                <span className="text-sm text-[#5F6D74]">Total due</span>
                <span className="font-serif text-[2.6rem] font-medium leading-none tabular-nums tracking-[-0.03em] text-[#0E2A3B]">
                  {rand(invoice.amount, true)}
                </span>
              </div>
            </div>
            {invoice.kind === 'reservation-deposit' && settings?.reservationTerms && (
              <p className="mt-6 rounded-2xl bg-[#F6F1E9] p-4 text-sm leading-6 text-[#5D5241]">
                {settings.reservationTerms}
              </p>
            )}
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-28">
          {invoice.status === 'paid' ? (
            <div className="rounded-[22px] border border-[#CFE3DB] bg-white p-7" role="status">
              <CheckCircle2 className="text-[#2E6F5E]" size={34} />
              <h2 className="mt-4 font-serif text-2xl text-[#0E2A3B]">Paid — thank you.</h2>
              <p className="mt-2 text-sm leading-6 text-[#5F6D74]">
                Received {shortDate(invoice.paidAt)}
                {invoice.paymentReference ? ` · reference ${invoice.paymentReference}` : ''}.
              </p>
              <Link className="secondary-button mt-5 w-full" href={viaToken ? '/' : '/account/payments'}>
                {viaToken ? 'Back to Affordable Life' : 'View all payments'}
              </Link>
            </div>
          ) : payable ? (
            <div className="rounded-[22px] border border-[#E2E6E4] bg-white p-7">
              {returning ? (
                <div className="mb-5 rounded-2xl bg-[#E4ECF3] p-4 text-sm leading-6 text-[#1F4A6B]" role="status">
                  Confirming your payment with PayFast. This page updates automatically.
                </div>
              ) : result === 'cancel' ? (
                <div className="mb-5 flex gap-2 rounded-2xl bg-[#F7EEDB] p-4 text-sm leading-6 text-[#7A5717]" role="status">
                  <CircleAlert size={18} className="mt-0.5 shrink-0" /> Payment was cancelled. Nothing was charged.
                </div>
              ) : null}
              <h2 className="font-serif text-2xl text-[#0E2A3B]">Pay online</h2>
              <p className="mt-2 text-sm leading-6 text-[#5F6D74]">
                Card, instant EFT and other methods through PayFast. You return here when done.
              </p>
              <div className="mt-6">
                <PayButton invoiceId={String(invoice.id)} token={viaToken ? token : undefined} label={`Pay ${rand(invoice.amount, true)}`} />
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-[#68757A]">
                <ShieldCheck size={15} className="text-[#2E6F5E]" /> Secured by PayFast. We never see your card details.
              </p>
              {sandbox && (
                <p className="mt-3 rounded-xl bg-[#FFF6E5] px-3 py-2 text-xs text-[#7A5717]">
                  Test mode: payments go to the PayFast sandbox and no real money moves.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-[22px] border border-[#E2E6E4] bg-white p-7">
              <h2 className="font-serif text-2xl text-[#0E2A3B]">Not awaiting payment</h2>
              <p className="mt-2 text-sm text-[#5F6D74]">This invoice is {invoice.status}. Contact us if that looks wrong.</p>
            </div>
          )}
          {payable && settings?.eftDetails && (
            <div className="rounded-[22px] border border-[#E2E6E4] bg-white p-7">
              <h2 className="flex items-center gap-2 font-serif text-xl text-[#0E2A3B]">
                <Landmark size={19} className="text-[#B8914A]" /> Prefer EFT?
              </h2>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6 text-[#4A5961]">{settings.eftDetails}</pre>
              <p className="mt-3 text-xs text-[#7A858A]">Use {invoice.number} as your reference. EFTs are matched within one working day.</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
