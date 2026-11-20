import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload'
import { adminField, adminOnly, isStaff, nobody, userOf } from '../lib/access'
import { notifyInvoiceIssued } from '../lib/notify'

export const invoiceKinds = [
  { label: 'Reservation deposit', value: 'reservation-deposit' },
  { label: 'Security deposit', value: 'deposit' },
  { label: 'First month', value: 'first-month' },
  { label: 'Monthly rent', value: 'monthly-rent' },
  { label: 'Office rent', value: 'office-rent' },
  { label: 'Other', value: 'other' },
] as const

const numberInvoice: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation === 'create' && !data.number) {
    const year = new Date().getFullYear()
    const { totalDocs } = await req.payload.count({ collection: 'invoices', overrideAccess: true, req })
    data.number = `AL-${year}-${String(totalDocs + 1).padStart(5, '0')}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
  }
  if (typeof data.amount === 'number') data.amount = Math.round(data.amount * 100) / 100
  return data
}

const afterChange: CollectionAfterChangeHook = async ({ doc, operation, context, req }) => {
  if (operation === 'create' && !context?.silent) {
    await notifyInvoiceIssued(req.payload, doc, context?.payToken as string | undefined)
  }
  return doc
}

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  admin: {
    group: 'Tenancies & billing',
    useAsTitle: 'number',
    defaultColumns: ['number', 'payerName', 'kind', 'amount', 'dueDate', 'status'],
    description: 'Invoices are paid online through PayFast or marked paid here after an EFT.',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    update: adminOnly,
    read: ({ req }) => {
      if (isStaff(req)) return true
      const user = userOf(req)
      if (user?.collection === 'users') return { tenant: { equals: user.id } }
      return false
    },
  },
  hooks: { beforeChange: [numberInvoice], afterChange: [afterChange] },
  fields: [
    { name: 'number', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        { name: 'kind', type: 'select', required: true, options: [...invoiceKinds] },
        { name: 'amount', type: 'number', required: true, min: 1, admin: { description: 'Rand, incl. VAT where applicable' } },
        { name: 'dueDate', type: 'date', required: true },
      ],
    },
    { name: 'description', type: 'text', required: true },
    { name: 'period', type: 'text', index: true, admin: { description: 'Billing month, YYYY-MM' } },
    {
      type: 'row',
      fields: [
        { name: 'payerName', type: 'text', required: true },
        { name: 'payerEmail', type: 'email', required: true, index: true },
      ],
    },
    { name: 'tenant', type: 'relationship', relationTo: 'users', index: true },
    { name: 'tenancy', type: 'relationship', relationTo: 'tenancies', index: true },
    { name: 'application', type: 'relationship', relationTo: 'tenant-applications' },
    { name: 'interest', type: 'relationship', relationTo: 'demand-interests' },
    {
      name: 'uniqueKey',
      type: 'text',
      unique: true,
      access: { read: adminField },
      admin: { hidden: true },
    },
    { name: 'payTokenHash', type: 'text', index: true, access: { read: nobody, update: nobody }, admin: { hidden: true } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'issued',
      index: true,
      options: [
        { label: 'Issued', value: 'issued' },
        { label: 'Paid', value: 'paid' },
        { label: 'Overdue', value: 'overdue' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'paidAt', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'paymentMethod',
      type: 'select',
      options: [
        { label: 'PayFast', value: 'payfast' },
        { label: 'EFT', value: 'eft' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'paymentReference', type: 'text', admin: { position: 'sidebar' } },
  ],
}
