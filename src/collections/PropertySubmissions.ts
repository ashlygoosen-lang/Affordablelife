import type { Access, CollectionConfig, FieldAccess } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'
const adminFieldAccess: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const PropertySubmissions: CollectionConfig = {
  slug: 'property-submissions',
  admin: {
    group: 'Partner enquiries',
    useAsTitle: 'propertyAddress',
    defaultColumns: ['propertyAddress', 'contactName', 'city', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    { name: 'contactName', type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'propertyAddress', type: 'text', required: true },
    {
      name: 'city',
      type: 'select',
      required: true,
      options: [
        'Cape Town',
        'Stellenbosch',
        'Johannesburg',
        'Pretoria',
        'Durban',
        'Gqeberha',
        'Bloemfontein',
        'East London',
      ],
    },
    { name: 'suburb', type: 'text', required: true },
    {
      name: 'propertyType',
      type: 'select',
      required: true,
      options: ['house', 'flat', 'townhouse', 'loft'],
    },
    { name: 'rooms', type: 'number', required: true, min: 2, max: 30 },
    { name: 'expectedMonthlyRent', type: 'number', required: true, min: 1 },
    { name: 'description', type: 'textarea', required: true, maxLength: 2000 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'reviewing', 'approved', 'declined'],
      access: {
        create: () => false,
        read: adminFieldAccess,
        update: adminFieldAccess,
      },
      admin: { position: 'sidebar' },
    },
  ],
}
