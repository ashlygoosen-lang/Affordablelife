import { hashResumeToken, isResumeToken } from '@/lib/application-tokens'
import { randomUUID } from 'node:crypto'
import { uploadsDir } from '../lib/uploads-dir'
import {
  APIError,
  type Access,
  type CollectionBeforeValidateHook,
  type CollectionConfig,
  type FieldAccess,
} from 'payload'

type DocumentAccessData = {
  application?: string | number
  applicationToken?: string
}

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'
const adminFieldAccess: FieldAccess = ({ req }) => req.user?.collection === 'admins'

const canCreateDocument: Access<DocumentAccessData> = async ({ data, req }) => {
  if (req.user?.collection === 'admins') return true
  if (!data?.application) return false
  const applicationToken = data.applicationToken
  try {
    const application = await req.payload.findByID({
      collection: 'tenant-applications',
      id: data.application,
      overrideAccess: true,
      req,
      showHiddenFields: true,
    })
    const canEditStatus = Boolean(
      application.status && ['draft', 'documents-requested'].includes(application.status),
    )
    if (!canEditStatus) return false
    const owner = typeof application.owner === 'object' ? application.owner?.id : application.owner
    if (req.user?.collection === 'users' && String(owner) === String(req.user.id)) return true
    return (
      isResumeToken(applicationToken) &&
      application.resumeTokenHash === hashResumeToken(applicationToken)
    )
  } catch {
    return false
  }
}

const allowedFileTypes = new Map([
  ['application/pdf', 'pdf'],
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/heic', 'heic'],
  ['image/heif', 'heif'],
])

const validateUpload: CollectionBeforeValidateHook = ({ data, req }) => {
  if (data && isResumeToken(data.applicationToken)) {
    data.applicationToken = hashResumeToken(data.applicationToken)
  }
  if (req.file) {
    if (req.file.size > 10 * 1024 * 1024) {
      throw new APIError('Each application document must be 10 MB or smaller.', 400)
    }
    const extension = allowedFileTypes.get(req.file.mimetype)
    if (!extension) {
      throw new APIError('Upload a PDF, JPG, PNG, HEIC or HEIF file.', 400)
    }
    const documentType = typeof data?.documentType === 'string' ? data.documentType : 'document'
    req.file.name = `${documentType}-${randomUUID()}.${extension}`
  }
  return data
}

export const ApplicationDocuments: CollectionConfig = {
  slug: 'application-documents',
  admin: {
    group: 'Applications',
    useAsTitle: 'documentType',
    defaultColumns: ['documentType', 'application', 'status', 'updatedAt'],
  },
  access: {
    create: canCreateDocument,
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  hooks: { beforeValidate: [validateUpload] },
  versions: { maxPerDoc: 10 },
  fields: [
    {
      name: 'application',
      type: 'relationship',
      relationTo: 'tenant-applications',
      required: true,
      index: true,
    },
    {
      name: 'applicationToken',
      type: 'text',
      hidden: true,
      access: { read: () => false },
    },
    {
      name: 'documentType',
      type: 'select',
      required: true,
      options: [
        'applicant-id',
        'passport-visa',
        'proof-registration',
        'funding-letter',
        'payslips',
        'bank-statements',
        'employment-letter',
        'sponsor-id',
        'sponsor-address',
        'sponsor-employment',
        'company-registration',
        'business-bank-statements',
        'proof-business-address',
        'director-id',
        'proof-income',
        'applicant-residence',
        'passport-photo',
        'suretyship',
        'other',
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'uploaded',
      options: ['uploaded', 'under-review', 'accepted', 'needs-replacement'],
      access: { create: () => false, read: adminFieldAccess, update: adminFieldAccess },
      admin: { position: 'sidebar' },
    },
    { name: 'applicantNote', type: 'textarea', maxLength: 500 },
    {
      name: 'reviewNote',
      type: 'textarea',
      access: { create: () => false, read: adminFieldAccess, update: adminFieldAccess },
    },
  ],
  upload: {
    staticDir: uploadsDir('application-documents'),
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'],
    pasteURL: false,
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'private, no-store')
      return headers
    },
  },
}
