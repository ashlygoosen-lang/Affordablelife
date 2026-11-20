import type { Access, CollectionConfig, FieldAccess } from 'payload'

const ownProfile: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  return { id: { equals: req.user.id } }
}

const adminFieldAccess: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
  },
  admin: {
    group: 'Accounts',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'accountType', 'createdAt'],
  },
  access: {
    create: () => true,
    delete: ({ req }) => req.user?.collection === 'admins',
    read: ownProfile,
    update: ownProfile,
  },
  fields: [
    { name: 'name', type: 'text', required: true, maxLength: 120 },
    { name: 'phone', type: 'text', maxLength: 40 },
    {
      name: 'accountType',
      type: 'select',
      required: true,
      defaultValue: 'personal',
      options: [
        { label: 'Personal', value: 'personal' },
        { label: 'Business', value: 'business' },
        { label: 'Corporate', value: 'corporate' },
      ],
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenant',
      index: true,
      options: [
        { label: 'Tenant / applicant', value: 'tenant' },
        { label: 'Property partner', value: 'partner' },
      ],
      access: { create: adminFieldAccess, update: adminFieldAccess },
      admin: {
        position: 'sidebar',
        description: 'Property partners get the partner portal for homes linked to them.',
      },
    },
    { name: 'companyName', type: 'text', maxLength: 160 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
      access: {
        create: () => false,
        read: adminFieldAccess,
        update: adminFieldAccess,
      },
    },
  ],
}
