import type { CollectionConfig } from 'payload'
import { adminOnly, isStaff, userOf } from '../lib/access'

export const Payouts: CollectionConfig = {
  slug: 'payouts',
  admin: {
    group: 'Tenancies & billing',
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'partner', 'period', 'amount', 'status'],
    description: 'Monthly payouts to property partners after the management fee.',
  },
  access: {
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
    read: ({ req }) => {
      if (isStaff(req)) return true
      const user = userOf(req)
      if (user?.collection === 'users' && user.role === 'partner') return { partner: { equals: user.id } }
      return false
    },
  },
  fields: [
    { name: 'reference', type: 'text', required: true },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      filterOptions: { role: { equals: 'partner' } },
    },
    { name: 'period', type: 'text', required: true, admin: { description: 'YYYY-MM' } },
    {
      type: 'row',
      fields: [
        { name: 'grossCollected', type: 'number', min: 0, required: true },
        { name: 'managementFee', type: 'number', min: 0, required: true },
        { name: 'amount', type: 'number', min: 0, required: true, admin: { description: 'Net paid to partner' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Paid', value: 'paid' },
        { label: 'On hold', value: 'on-hold' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'paidAt', type: 'date', admin: { position: 'sidebar' } },
    { name: 'note', type: 'textarea' },
  ],
}
