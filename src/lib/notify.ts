import type { Payload } from 'payload'
import type { Invoice, MaintenanceRequest } from '@/payload-types'
import { siteURL } from './site-url'

/** Outgoing email is only sent when SMTP is configured (SMTP_HOST etc.). */
export const emailEnabled = () => Boolean(process.env.SMTP_HOST)

const rand = (value: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value)

const layout = (title: string, body: string, cta?: { href: string; label: string }) => `
<div style="background:#f6f1e9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#14202b">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
    <div style="background:#0e2a3b;padding:24px 28px;color:#e4c27e;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:bold">Affordable Life</div>
    <div style="padding:28px">
      <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:26px;margin:0 0 16px;color:#0e2a3b">${title}</h1>
      ${body}
      ${cta ? `<p style="margin:28px 0 8px"><a href="${cta.href}" style="background:#c2502a;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:bold;font-size:14px">${cta.label}</a></p>` : ''}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #eee;font-size:12px;color:#7a858a">Affordable Life (Pty) Ltd · Cape Town · hello@affordablelife.co.za</div>
  </div>
</div>`

async function send(payload: Payload, to: string, subject: string, html: string) {
  if (!emailEnabled() || !to) return
  try {
    await payload.sendEmail({ to, subject, html })
  } catch (error) {
    payload.logger.error({ err: error, msg: `Email to ${to} failed` })
  }
}

export async function notifyInvoiceIssued(payload: Payload, invoice: Invoice, payToken?: string) {
  const href = payToken
    ? `${siteURL}/pay/${invoice.id}?t=${encodeURIComponent(payToken)}`
    : `${siteURL}/account/payments`
  await send(
    payload,
    invoice.payerEmail,
    `Invoice ${invoice.number} — ${rand(invoice.amount)}`,
    layout(
      `Your invoice is ready`,
      `<p style="line-height:1.6">Hi ${invoice.payerName.split(' ')[0]},</p>
       <p style="line-height:1.6">${invoice.description}</p>
       <p style="font-size:28px;margin:18px 0 4px;font-weight:bold">${rand(invoice.amount)}</p>
       <p style="color:#657179;font-size:13px">Invoice ${invoice.number} · due ${new Date(invoice.dueDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`,
      { href, label: 'Pay securely' },
    ),
  )
}

export async function notifyPaymentReceived(payload: Payload, invoice: Invoice) {
  await send(
    payload,
    invoice.payerEmail,
    `Payment received — ${invoice.number}`,
    layout(
      'Thank you — payment received',
      `<p style="line-height:1.6">We have received ${rand(invoice.amount)} for invoice ${invoice.number}.</p>
       <p style="line-height:1.6;color:#657179">${invoice.description}</p>`,
      { href: `${siteURL}/account/payments`, label: 'View receipts' },
    ),
  )
}

export async function notifyMaintenanceUpdate(payload: Payload, request: MaintenanceRequest) {
  const reporterID =
    request.reporter && typeof request.reporter === 'object' ? request.reporter.id : request.reporter
  if (!reporterID) return
  try {
    const reporter = await payload.findByID({ collection: 'users', id: reporterID, overrideAccess: true, depth: 0 })
    await send(
      payload,
      reporter.email,
      `Maintenance update: ${request.title}`,
      layout(
        'Your maintenance request was updated',
        `<p style="line-height:1.6"><strong>${request.title}</strong> is now <strong>${String(request.status).replace('-', ' ')}</strong>.</p>
         ${request.resolutionNote ? `<p style="line-height:1.6;color:#657179">${request.resolutionNote}</p>` : ''}`,
        { href: `${siteURL}/account/maintenance`, label: 'View request' },
      ),
    )
  } catch {
    // reporter may have been removed
  }
}
