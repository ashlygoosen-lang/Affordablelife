import type { GlobalConfig } from 'payload'
import { adminOnly } from '../lib/access'

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: 'Payment settings',
  admin: { group: 'Tenancies & billing' },
  access: { read: () => true, update: adminOnly },
  fields: [
    {
      name: 'reservationDepositsEnabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Offer a refundable reservation deposit after someone registers interest. Switch on only once refund and trust-account terms have been confirmed.',
      },
    },
    { name: 'reservationDepositAmount', type: 'number', min: 50, defaultValue: 500 },
    {
      name: 'reservationTerms',
      type: 'textarea',
      defaultValue:
        'Your reservation deposit holds your place in the group. It is credited against your first month, and refunded in full if the group does not confirm.',
    },
    { name: 'invoiceDueDays', type: 'number', min: 1, max: 30, defaultValue: 7 },
    {
      name: 'managementFeePercent',
      type: 'number',
      min: 0,
      max: 50,
      defaultValue: 12,
      admin: { description: 'Used for partner payout estimates.' },
    },
    {
      name: 'eftDetails',
      type: 'textarea',
      defaultValue:
        'Affordable Life (Pty) Ltd\nBank: — add your bank —\nAccount number: —\nBranch code: —\nReference: your invoice number',
      admin: { description: 'Shown on invoices for tenants who prefer EFT.' },
    },
  ],
}
