import type { Access, CollectionBeforeValidateHook, CollectionConfig, FieldAccess } from 'payload'
import { ValidationError } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'
const adminFieldAccess: FieldAccess = ({ req }) => req.user?.collection === 'admins'

const relationshipID = (value: unknown) => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    if (typeof id === 'string' || typeof id === 'number') return id
  }
  return null
}

const enforceEligibleRelationships: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data) return data
  const suburbID = relationshipID(data.suburb)
  if (!suburbID) {
    throw new ValidationError({ errors: [{ message: 'Choose a valid suburb.', path: 'suburb' }] })
  }

  await req.payload.findByID({
    collection: 'suburbs',
    id: suburbID,
    overrideAccess: true,
    req,
  })

  const homeID = relationshipID(data.home)
  if (homeID) {
    const home = await req.payload.findByID({
      collection: 'homes',
      id: homeID,
      overrideAccess: true,
      req,
    })
    const homeSuburbID = relationshipID(home.suburb)
    if (home.status !== 'verified' || String(homeSuburbID) !== String(suburbID)) {
      throw new ValidationError({
        errors: [{ message: 'This home is not eligible for interest registration.', path: 'home' }],
      })
    }
  }

  return data
}

export const DemandInterests: CollectionConfig = {
  slug: 'demand-interests',
  admin: {
    group: 'Demand engine',
    useAsTitle: 'contactName',
    defaultColumns: ['contactName', 'suburb', 'tier', 'moveInMonth', 'roomsRequested', 'status'],
    description:
      'Private demand records. Use filters to review demand by suburb, tier, institution and move-in month.',
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  hooks: {
    beforeValidate: [enforceEligibleRelationships],
  },
  fields: [
    { name: 'contactName', type: 'text', required: true, maxLength: 120 },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'phone', type: 'text', required: true, maxLength: 40 },
    {
      name: 'suburb',
      type: 'relationship',
      relationTo: 'suburbs',
      required: true,
      index: true,
    },
    {
      name: 'home',
      type: 'relationship',
      relationTo: 'homes',
      filterOptions: { status: { equals: 'verified' } },
    },
    { name: 'institutionOrEmployer', type: 'text', required: true, index: true, maxLength: 180 },
    { name: 'moveInMonth', type: 'date', required: true, index: true },
    { name: 'monthlyBudget', type: 'number', required: true, min: 1000, max: 100000 },
    {
      name: 'tier',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Student Plus', value: 'student-plus' },
        { label: 'Young Professional', value: 'young-professional' },
        { label: 'Visitor and Short Stay', value: 'visitor-short-stay' },
        { label: 'Business Office Rental', value: 'business-office' },
      ],
    },
    { name: 'sponsorPays', type: 'checkbox', defaultValue: false, index: true },
    {
      name: 'roomsRequested',
      label: 'Rooms or office seats requested',
      type: 'number',
      required: true,
      min: 1,
      max: 100,
      defaultValue: 1,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'registered',
      options: [
        { label: 'Registered', value: 'registered' },
        { label: 'Reservation invited', value: 'reservation-invited' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Lease signed', value: 'lease-signed' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
      access: {
        create: () => false,
        read: adminFieldAccess,
        update: adminFieldAccess,
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'reservationDepositStatus',
      type: 'select',
      defaultValue: 'not-enabled',
      options: [
        { label: 'Not enabled — legal review pending', value: 'not-enabled' },
        { label: 'Invited', value: 'invited' },
        { label: 'Paid', value: 'paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
      access: {
        create: () => false,
        read: adminFieldAccess,
        update: adminFieldAccess,
      },
      admin: { position: 'sidebar' },
    },
    { name: 'consentToContact', type: 'checkbox', required: true },
  ],
}
