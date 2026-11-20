import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const canReadHomes: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return { status: { equals: 'verified' } }
}

export const Homes: CollectionConfig = {
  slug: 'homes',
  admin: {
    group: 'Homes',
    useAsTitle: 'title',
    defaultColumns: ['title', 'suburb', 'roomPrice', 'groupStatus', 'status'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: canReadHomes,
    update: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    {
      name: 'suburb',
      type: 'relationship',
      relationTo: 'suburbs',
      required: true,
      index: true,
    },
    {
      name: 'propertyType',
      type: 'select',
      required: true,
      options: ['house', 'flat', 'townhouse', 'loft'],
    },
    { name: 'description', type: 'textarea', required: true },
    { name: 'roomPrice', type: 'number', required: true, min: 0, index: true },
    { name: 'includedCosts', type: 'number', required: true, min: 0, defaultValue: 0 },
    { name: 'rooms', type: 'number', required: true, min: 2, max: 12 },
    { name: 'interested', type: 'number', required: true, min: 0, defaultValue: 0 },
    {
      name: 'groupStatus',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Almost full', value: 'almost-full' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Expired', value: 'expired' },
      ],
    },
    { name: 'groupExpiry', type: 'date', required: true },
    { name: 'moveIn', type: 'date', required: true },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'features',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'included',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    { name: 'verifiedLandlord', type: 'checkbox', defaultValue: false },
    { name: 'verifiedAddress', type: 'checkbox', defaultValue: false },
    { name: 'photosChecked', type: 'checkbox', defaultValue: false },
    {
      name: 'partner',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      filterOptions: { role: { equals: 'partner' } },
      admin: {
        position: 'sidebar',
        description: 'Property partner (landlord) who sees this home in the partner portal.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      index: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending verification', value: 'pending' },
        { label: 'Verified and visible', value: 'verified' },
        { label: 'Hidden', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
