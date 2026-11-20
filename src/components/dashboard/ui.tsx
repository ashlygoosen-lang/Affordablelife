import Link from 'next/link'
import type { ReactNode } from 'react'

export const rand = (value: number | null | undefined, cents = false) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(Number(value ?? 0))

export const shortDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

type Tone = 'neutral' | 'good' | 'warn' | 'bad' | 'info'
const toneClass: Record<Tone, string> = {
  neutral: 'bg-[#EEF1F2] text-[#4A5961]',
  good: 'bg-[#E3F0EB] text-[#22594B]',
  warn: 'bg-[#F7EEDB] text-[#7A5717]',
  bad: 'bg-[#F8E4DD] text-[#9A3A1C]',
  info: 'bg-[#E4ECF3] text-[#1F4A6B]',
}

const statusTone: Record<string, Tone> = {
  paid: 'good',
  active: 'good',
  resolved: 'good',
  approved: 'good',
  complete: 'good',
  closed: 'neutral',
  issued: 'info',
  submitted: 'info',
  scheduled: 'info',
  open: 'warn',
  'in-progress': 'info',
  'pending-payment': 'warn',
  draft: 'neutral',
  overdue: 'bad',
  urgent: 'bad',
  cancelled: 'neutral',
  declined: 'bad',
  notice: 'warn',
  ended: 'neutral',
}

const statusLabel: Record<string, string> = {
  'pending-payment': 'Awaiting first payment',
  'in-progress': 'In progress',
  'documents-requested': 'Documents requested',
  'verification-in-progress': 'Verifying',
  'affordability-review': 'Affordability review',
  'lease-sent': 'Lease sent',
  'lease-signed': 'Lease signed',
  'deposit-paid': 'Deposit paid',
}

export function StatusPill({ status, tone }: { status?: string | null; tone?: Tone }) {
  const value = status ?? 'draft'
  const label = statusLabel[value] ?? value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${toneClass[tone ?? statusTone[value] ?? 'neutral']}`}
    >
      {label}
    </span>
  )
}

export function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-[22px] border border-[#E2E6E4] bg-white ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-4 border-b border-[#EDF0EE] px-6 py-4">
          {title && <h2 className="font-serif text-xl font-medium text-[#0E2A3B]">{title}</h2>}
          {action}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  )
}

export function Stat({
  label,
  value,
  note,
  emphasis = false,
}: {
  label: string
  value: ReactNode
  note?: ReactNode
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-[20px] border p-5 ${emphasis ? 'border-[#0E2A3B] bg-[#0E2A3B] text-white' : 'border-[#E2E6E4] bg-white'}`}
    >
      <p className={`text-[13px] ${emphasis ? 'text-white/70' : 'text-[#5F6D74]'}`}>{label}</p>
      <p className="mt-2 font-serif text-[2rem] font-medium leading-none tabular-nums tracking-[-0.02em]">
        {value}
      </p>
      {note && <p className={`mt-2 text-xs ${emphasis ? 'text-[#E4C27E]' : 'text-[#7A858A]'}`}>{note}</p>}
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D5DCD9] px-6 py-10 text-center">
      <p className="font-serif text-xl text-[#0E2A3B]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#68757A]">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export type NavItem = { href: string; label: string; icon: ReactNode }

/** Dashboard frame: navy sidebar on desktop, scrollable tab row on mobile. */
export function DashboardShell({
  area,
  title,
  subtitle,
  nav,
  active,
  actions,
  children,
}: {
  area: string
  title: string
  subtitle?: string
  nav: NavItem[]
  active: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="bg-[#F4F5F3]">
      <div className="mx-auto grid w-[min(1320px,100%)] lg:grid-cols-[260px_1fr]">
        <aside className="bg-[#0E2A3B] text-white lg:min-h-[calc(100vh-76px)]">
          <div className="hidden px-6 pb-4 pt-8 lg:block">
            <p className="text-sm text-[#E4C27E]">{area}</p>
          </div>
          <nav
            aria-label={`${area} navigation`}
            className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible lg:px-3 lg:py-0"
          >
            {nav.map((item) => {
              const selected = item.href === active
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={selected ? 'page' : undefined}
                  className={`flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 text-sm transition-colors ${
                    selected ? 'bg-white text-[#0E2A3B] font-semibold' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="[&>svg]:size-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>
        <div className="min-w-0 px-4 pb-24 pt-8 sm:px-8 lg:px-10">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="font-serif text-[clamp(2rem,4vw,2.9rem)] font-medium leading-tight tracking-[-0.025em] text-[#0E2A3B]">
                {title}
              </h1>
              {subtitle && <p className="mt-2 text-[15px] text-[#5F6D74]">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </header>
          {children}
        </div>
      </div>
    </div>
  )
}

export function DataTable({
  head,
  rows,
  empty,
}: {
  head: string[]
  rows: ReactNode[][]
  empty?: ReactNode
}) {
  if (!rows.length) return <>{empty}</>
  return (
    <div className="-mx-6 overflow-x-auto">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead>
          <tr className="border-b border-[#EDF0EE] text-[12px] text-[#7A858A]">
            {head.map((cell) => (
              <th className="px-6 pb-3 font-medium" key={cell}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {rows.map((row, index) => (
            <tr className="border-b border-[#F1F3F2] last:border-0" key={index}>
              {row.map((cell, cellIndex) => (
                <td className="whitespace-nowrap px-6 py-3.5 align-middle" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
