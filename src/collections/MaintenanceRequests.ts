import { APIError, type Where, type CollectionBeforeChangeHook, type CollectionConfig, type FieldAccess } from 'payload'
import { adminField, isPartner, isStaff, userOf } from '../lib/access'
import { notifyMaintenanceUpdate } from '../lib/notify'

const staffOrPartner: FieldAccess = ({ req }) => isStaff(req) || isPartner(req)

const linkTenancy: CollectionBeforeChangeHook = async ({ data, operation, req, originalDoc }) => {
  const user = userOf(req)
  if (operation === 'create' && user?.collection === 'users') {
    const tenancyID = typeof data.tenancy === 'object' ? data.tenancy?.id : data.tenancy
    if (!tenancyID) throw new APIError('Choose the tenancy this request is about.', 400)
    const tenancy = await req.payload.findByID({
      collection: 'tenancies',
      id: tenancyID,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const owner = typeof tenancy.tenant === 'object' ? tenancy.tenant?.id : tenancy.tenant
    if (String(owner) !== String(user.id) || !['active', 'notice', 'pending-payment'].includes(tenancy.status)) {
      throw new APIError('You can only report issues for your own tenancy.', 403)
    }
    data.reporter = user.id
    data.status = 'open'
    data.home = typeof tenancy.home === 'object' ? tenancy.home?.id : tenancy.home
  }
  if (operation === 'update' && originalDoc?.status !== data.status && data.status) {
    data.statusChangedAt = new Date().toISOString()
  }
  return data
}

export const MaintenanceRequests: CollectionConfig = {
  slug: 'maintenance-requests',
  labels: { singular: 'Maintenance request', plural: 'Maintenance requests' },
  admin: {
    group: 'Tenancies & billing',
    useAsTitle: 'title',
    defaultColumns: ['title', 'home', 'category', 'priority', 'status', 'createdAt'],
  },
  access: {
    create: ({ req }) => isStaff(req) || userOf(req)?.collection === 'users',
    delete: ({ req }) => isStaff(req),
    read: ({ req }): boolean | Where => {
      if (isStaff(req)) return true
      const user = userOf(req)
      if (user?.collection !== 'users') return false
      if (isPartner(req)) return { 'home.partner': { equals: user.id } }
      return { reporter: { equals: user.id } }
    },
    update: ({ req }): boolean | Where => {
      if (isStaff(req)) return true
      const user = userOf(req)
      if (isPartner(req)) return { 'home.partner': { equals: user?.id } }
      return false
    },
  },
  hooks: {
    beforeChange: [linkTenancy],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update' && previousDoc?.status !== doc.status) {
          await notifyMaintenanceUpdate(req.payload, doc)
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 140, access: { update: adminField } },
    { name: 'tenancy', type: 'relationship', relationTo: 'tenancies', required: true, access: { update: adminField } },
    { name: 'home', type: 'relationship', relationTo: 'homes', index: true, access: { update: adminField } },
    { name: 'reporter', type: 'relationship', relationTo: 'users', access: { update: adminField } },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          access: { update: adminField },
          options: [
            { label: 'Plumbing', value: 'plumbing' },
            { label: 'Electrical', value: 'electrical' },
            { label: 'Appliances', value: 'appliances' },
            { label: 'Wi-Fi & internet', value: 'internet' },
            { label: 'Security & access', value: 'security' },
            { label: 'Cleaning', value: 'cleaning' },
            { label: 'Furniture', value: 'furniture' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'priority',
          type: 'select',
          required: true,
          defaultValue: 'normal',
          access: { update: staffOrPartner },
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Normal', value: 'normal' },
            { label: 'Urgent', value: 'urgent' },
          ],
        },
      ],
    },
    { name: 'description', type: 'textarea', required: true, maxLength: 2000, access: { update: adminField } },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      index: true,
      access: { update: staffOrPartner },
      options: [
        { label: 'Open', value: 'open' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'statusChangedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'resolutionNote',
      type: 'textarea',
      maxLength: 1000,
      access: { update: staffOrPartner },
      admin: { description: 'Visible to the tenant.' },
    },
    { name: 'staffNotes', type: 'textarea', access: { read: adminField, update: adminField } },
  ],
}
