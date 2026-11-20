import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig, Where } from 'payload'
import { adminField, adminOnly, isPartner, isStaff, userOf } from '../lib/access'
import { issueInitialInvoices } from '../lib/billing'

const setLabel: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const homeID = data.home ?? originalDoc?.home
  let place = data.kind === 'office' ? data.officeDescription || 'Business office' : 'Room'
  if (homeID) {
    try {
      const home = await req.payload.findByID({
        collection: 'homes',
        id: typeof homeID === 'object' ? homeID.id : homeID,
        depth: 0,
        overrideAccess: true,
        req,
      })
      place = `${home.title}${data.roomLabel ? ` · ${data.roomLabel}` : ''}`
    } catch {
      // keep fallback label
    }
  }
  data.label = `${data.tenantName || originalDoc?.tenantName || 'Tenant'} — ${place}`
  return data
}

const afterChange: CollectionAfterChangeHook = async ({ doc, req, context }) => {
  if (context?.skipBilling) return doc
  if (!doc.initialInvoicesIssued && Number(doc.monthlyRent) > 0 && doc.status === 'pending-payment') {
    await issueInitialInvoices(req.payload, doc, req)
  }
  return doc
}

export const Tenancies: CollectionConfig = {
  slug: 'tenancies',
  labels: { singular: 'Tenancy', plural: 'Tenancies' },
  admin: {
    group: 'Tenancies & billing',
    useAsTitle: 'label',
    defaultColumns: ['label', 'kind', 'monthlyRent', 'status', 'startDate'],
    description:
      'Created automatically when an application is approved. Setting a monthly rent issues the deposit and first-month invoices; monthly invoices then follow automatically.',
  },
  access: {
    create: adminOnly,
    delete: adminOnly,
    update: adminOnly,
    read: ({ req }): boolean | Where => {
      if (isStaff(req)) return true
      const user = userOf(req)
      if (!user || user.collection !== 'users') return false
      if (isPartner(req)) return { 'home.partner': { equals: user.id } }
      return { tenant: { equals: user.id } }
    },
  },
  hooks: { beforeChange: [setLabel], afterChange: [afterChange] },
  fields: [
    { name: 'label', type: 'text', admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'tenant',
          type: 'relationship',
          relationTo: 'users',
          index: true,
          admin: {
            description:
              'The member account that pays. Link it once the applicant has registered with the same email.',
          },
        },
        { name: 'tenantName', type: 'text', required: true },
        { name: 'tenantEmail', type: 'email', required: true, index: true },
      ],
    },
    { name: 'application', type: 'relationship', relationTo: 'tenant-applications' },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'room',
      options: [
        { label: 'Room in shared home', value: 'room' },
        { label: 'Business office', value: 'office' },
      ],
    },
    { name: 'home', type: 'relationship', relationTo: 'homes', index: true },
    { name: 'roomLabel', type: 'text', admin: { description: 'e.g. Room 3 (en-suite)' } },
    {
      name: 'officeDescription',
      type: 'text',
      admin: { condition: (_, sibling) => sibling?.kind === 'office' },
    },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true },
        { name: 'endDate', type: 'date' },
        { name: 'billingDay', type: 'number', min: 1, max: 28, defaultValue: 1 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'monthlyRent', type: 'number', min: 0, defaultValue: 0, admin: { description: 'Rand per month, all-inclusive' } },
        { name: 'depositAmount', type: 'number', min: 0, admin: { description: 'Leave empty to use one month' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending-payment',
      index: true,
      options: [
        { label: 'Awaiting deposit & first month', value: 'pending-payment' },
        { label: 'Active', value: 'active' },
        { label: 'Notice given', value: 'notice' },
        { label: 'Ended', value: 'ended' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'initialInvoicesIssued',
      type: 'checkbox',
      defaultValue: false,
      access: { update: adminField },
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'notes', type: 'textarea', access: { read: adminField }, admin: { position: 'sidebar' } },
  ],
}
