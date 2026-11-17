import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [{ name: 'name', type: 'text' }],
  versions: false,
}
