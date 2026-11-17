import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Suburbs: CollectionConfig = {
  slug: 'suburbs',
  admin: {
    group: 'Homes',
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'launchStatus'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'name' },
    {
      name: 'city',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Cape Town', value: 'cape-town' },
        { label: 'Stellenbosch', value: 'stellenbosch' },
        { label: 'Johannesburg', value: 'johannesburg' },
        { label: 'Pretoria', value: 'pretoria' },
        { label: 'Durban', value: 'durban' },
        { label: 'Gqeberha', value: 'gqeberha' },
        { label: 'Bloemfontein', value: 'bloemfontein' },
        { label: 'East London', value: 'east-london' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'priceRange', type: 'text', required: true },
    { name: 'transport', type: 'textarea', required: true },
    { name: 'safetyNote', type: 'textarea', required: true },
    {
      name: 'nearbyHubs',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    {
      name: 'launchStatus',
      type: 'select',
      defaultValue: 'hidden',
      options: [
        { label: 'Visible', value: 'visible' },
        { label: 'Hidden until a home is verified', value: 'hidden' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
