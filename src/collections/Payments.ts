import type { CollectionConfig } from 'payload'
import { adminOnly } from '../lib/access'

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    group: 'Tenancies & billing',
    useAsTitle: 'providerPaymentId',
    defaultColumns: ['providerPaymentId', 'invoice', 'amountGross', 'status', 'receivedAt'],
    description: 'Recorded automatically from verified PayFast notifications (ITN).',
  },
  access: { create: adminOnly, read: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'invoice', type: 'relationship', relationTo: 'invoices', required: true, index: true },
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'payfast',
      options: ['payfast', 'manual'],
    },
    { name: 'providerPaymentId', type: 'text', index: true, unique: true },
    {
      type: 'row',
      fields: [
        { name: 'amountGross', type: 'number' },
        { name: 'amountFee', type: 'number' },
        { name: 'amountNet', type: 'number' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['complete', 'failed', 'pending', 'cancelled'],
    },
    { name: 'payerEmail', type: 'email' },
    { name: 'sandbox', type: 'checkbox', defaultValue: false },
    { name: 'receivedAt', type: 'date', required: true },
    { name: 'raw', type: 'json', admin: { description: 'Notification fields received from PayFast' } },
  ],
}
