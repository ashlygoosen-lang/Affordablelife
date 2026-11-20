import { hashResumeToken, isResumeToken } from '@/lib/application-tokens'
import type {
  Access,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  FieldAccess,
  Where,
} from 'payload'
import type { ApplicationDocument } from '@/payload-types'
import type { CollectionAfterChangeHook } from 'payload'
import { APIError } from 'payload'

type ApplicationAccessData = {
  resumeTokenHash?: string
}

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'
const adminFieldAccess: FieldAccess = ({ req }) => req.user?.collection === 'admins'
const canReadApplication: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection === 'users') return { owner: { equals: req.user.id } }
  return false
}

const canUpdateOwnDraft: Access<ApplicationAccessData> = ({ data, req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection === 'users') {
    const ownerDraft: Where = {
      and: [
        { owner: { equals: req.user.id } },
        { status: { in: ['draft', 'documents-requested'] } },
      ],
    }
    if (!isResumeToken(data?.resumeTokenHash)) return ownerDraft
    return {
      or: [
        ownerDraft,
        {
          and: [
            { resumeTokenHash: { equals: hashResumeToken(data.resumeTokenHash) } },
            { status: { in: ['draft', 'documents-requested'] } },
          ],
        },
      ],
    } as Where
  }
  if (!isResumeToken(data?.resumeTokenHash)) return false
  return {
    and: [
      { resumeTokenHash: { equals: hashResumeToken(data.resumeTokenHash) } },
      { status: { in: ['draft', 'documents-requested'] } },
    ],
  } as Where
}

const protectWorkflow: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  const isPayloadAdmin = req.user?.collection === 'admins'
  if (req.user?.collection === 'users' && !originalDoc?.owner) {
    data.owner = req.user.id
  }
  if (!isPayloadAdmin) {
    if (operation === 'create') data.status = 'draft'
    if (operation === 'update') {
      data.status = data.status === 'submitted' ? 'submitted' : (originalDoc?.status ?? 'draft')
      if (data.status === 'submitted' && !originalDoc?.submittedAt) {
        data.submittedAt = new Date().toISOString()
      }
    }
    if (data.status === 'draft') {
      data.submittedAt = originalDoc?.submittedAt
      data.signatureDate = originalDoc?.signatureDate
    }
    if (data.status === 'submitted') {
      const candidate = {
        ...originalDoc,
        ...data,
        consents: { ...(originalDoc?.consents ?? {}), ...(data.consents ?? {}) },
      }
      const missingCore = [
        'applicationKind',
        'applicantName',
        'applicantEmail',
        'applicantPhone',
        'idType',
        'idNumber',
        'dateOfBirth',
        'nationality',
        'currentAddress',
        'applicantType',
        'institutionOrEmployer',
        'tier',
        'moveInDate',
        'agreementLength',
        'payerType',
        'typedSignature',
      ].some((field) => !candidate[field])
      const requiredConsents = [
        candidate.consents?.personalInformation,
        candidate.consents?.contactReferences,
        candidate.consents?.houseRules,
        candidate.consents?.truthfulness,
      ]
      if (
        missingCore ||
        !Array.isArray(candidate.references) ||
        candidate.references.length !== 2 ||
        requiredConsents.some((value) => value !== true)
      ) {
        throw new APIError('Complete all required application sections before submitting.', 400)
      }
      if (
        !['self', 'business-company'].includes(candidate.payerType) &&
        (!candidate.sponsorName ||
          !candidate.sponsorEmail ||
          !candidate.sponsorPhone ||
          !candidate.sponsorEmploymentStatus)
      ) {
        throw new APIError('Complete the required sponsor details before submitting.', 400)
      }
      if (
        candidate.applicationKind === 'office' &&
        (!candidate.businessDetails?.companyName ||
          !candidate.businessDetails?.registrationNumber ||
          !candidate.businessDetails?.industry ||
          !candidate.businessDetails?.teamSize ||
          !candidate.businessDetails?.officeType ||
          !candidate.businessDetails?.requiredSeats)
      ) {
        throw new APIError(
          'Complete the required business and office details before submitting.',
          400,
        )
      }
      data.signatureDate = new Date().toISOString()
      data.submittedAt = originalDoc?.submittedAt ?? new Date().toISOString()
      if (operation === 'update' && originalDoc?.id) {
        const documents = await req.payload.find({
          collection: 'application-documents',
          overrideAccess: true,
          req,
          depth: 0,
          limit: 100,
          where: { application: { equals: originalDoc.id } },
        })
        const uploadedTypes = new Set(documents.docs.map((document) => document.documentType))
        const requiredDocuments: ApplicationDocument['documentType'][] = ['applicant-id']
        if (candidate.applicationKind === 'office') {
          requiredDocuments.push(
            'company-registration',
            'business-bank-statements',
            'proof-business-address',
          )
        } else {
          requiredDocuments.push(
            candidate.applicantType === 'student' ? 'proof-registration' : 'employment-letter',
          )
        }
        if (candidate.payerType === 'self' && candidate.applicationKind !== 'office') {
          requiredDocuments.push('payslips', 'bank-statements')
        } else if (candidate.payerType !== 'business-company') {
          requiredDocuments.push('sponsor-id', 'proof-income')
        }
        if (['bursary-funder', 'university-institution'].includes(candidate.payerType)) {
          requiredDocuments.push('funding-letter')
        }
        if (requiredDocuments.some((documentType) => !uploadedTypes.has(documentType))) {
          throw new APIError('Upload all required documents before submitting.', 400)
        }
      }
    }
  }
  const preferredSuburb = data.preferredSuburb ?? originalDoc?.preferredSuburb
  const preferredHome = data.preferredHome ?? originalDoc?.preferredHome
  if (!isPayloadAdmin && preferredSuburb && preferredHome) {
    const home = await req.payload.findByID({
      collection: 'homes',
      id: typeof preferredHome === 'object' ? preferredHome.id : preferredHome,
      overrideAccess: true,
      req,
      depth: 0,
    })
    const homeSuburb = typeof home.suburb === 'object' && home.suburb ? home.suburb.id : home.suburb
    const suburbId = typeof preferredSuburb === 'object' ? preferredSuburb.id : preferredSuburb
    if (String(homeSuburb) !== String(suburbId) || home.status !== 'verified') {
      throw new APIError('Choose a verified home in the selected suburb.', 400)
    }
  }
  return data
}

const hashDraftToken: CollectionBeforeValidateHook = ({ data, operation, req }) => {
  if (
    req.user?.collection !== 'admins' &&
    operation === 'create' &&
    !isResumeToken(data?.resumeTokenHash)
  ) {
    throw new APIError('A valid application resume token is required.', 400)
  }
  if (data && isResumeToken(data.resumeTokenHash)) {
    data.resumeTokenHash = hashResumeToken(data.resumeTokenHash)
  }
  return data
}

/** Approving an application opens a tenancy; a room's rent comes from the chosen home. */
const openTenancyOnApproval: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  if (doc.status !== 'approved' || previousDoc?.status === 'approved') return doc
  const existing = await req.payload.count({
    collection: 'tenancies',
    overrideAccess: true,
    req,
    where: { application: { equals: doc.id } },
  })
  if (existing.totalDocs > 0) return doc
  const homeID = typeof doc.preferredHome === 'object' ? doc.preferredHome?.id : doc.preferredHome
  let monthlyRent = 0
  if (homeID && doc.applicationKind !== 'office') {
    try {
      const home = await req.payload.findByID({ collection: 'homes', id: homeID, depth: 0, overrideAccess: true, req })
      monthlyRent = Number(home.roomPrice) + Number(home.includedCosts ?? 0)
    } catch {
      monthlyRent = 0
    }
  }
  const owner = typeof doc.owner === 'object' ? doc.owner?.id : doc.owner
  await req.payload.create({
    collection: 'tenancies',
    overrideAccess: true,
    req,
    data: {
      tenant: owner || undefined,
      tenantName: doc.applicantName,
      tenantEmail: doc.applicantEmail,
      application: doc.id,
      kind: doc.applicationKind === 'office' ? 'office' : 'room',
      home: homeID || undefined,
      officeDescription:
        doc.applicationKind === 'office'
          ? `${doc.businessDetails?.companyName ?? 'Business'} · ${doc.businessDetails?.requiredSeats ?? 1} seats`
          : undefined,
      startDate: doc.moveInDate || new Date().toISOString(),
      monthlyRent,
      status: 'pending-payment',
    },
  })
  return doc
}

export const TenantApplications: CollectionConfig = {
  slug: 'tenant-applications',
  admin: {
    group: 'Applications',
    useAsTitle: 'applicantName',
    defaultColumns: [
      'applicantName',
      'applicationKind',
      'tier',
      'payerType',
      'status',
      'lastCompletedStep',
      'updatedAt',
    ],
    description:
      'Private room and office rental applications. Affordability indicators guide human review and must not be used as automatic decline rules.',
  },
  access: {
    create: () => true,
    delete: isAdmin,
    read: canReadApplication,
    update: canUpdateOwnDraft,
  },
  versions: { maxPerDoc: 30 },
  hooks: {
    beforeValidate: [hashDraftToken],
    beforeChange: [protectWorkflow],
    afterChange: [openTenancyOnApproval],
  },
  fields: [
    {
      name: 'resumeTokenHash',
      type: 'text',
      required: true,
      hidden: true,
      access: { read: () => false },
    },
    {
      name: 'interest',
      type: 'relationship',
      relationTo: 'demand-interests',
      admin: { position: 'sidebar' },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      access: {
        create: () => false,
        update: () => false,
      },
      admin: { position: 'sidebar' },
    },
    {
      name: 'applicationKind',
      type: 'select',
      defaultValue: 'accommodation',
      index: true,
      options: [
        { label: 'Residential accommodation', value: 'accommodation' },
        { label: 'Business office rental', value: 'office' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'applicantName', type: 'text', required: true },
    { name: 'preferredName', type: 'text' },
    { name: 'applicantEmail', type: 'email', required: true, index: true },
    { name: 'applicantPhone', type: 'text', required: true },
    {
      name: 'idType',
      type: 'select',
      options: ['south-african-id', 'passport', 'asylum-permit', 'refugee-permit'],
    },
    {
      name: 'idNumber',
      type: 'text',
      access: { read: adminFieldAccess },
    },
    { name: 'dateOfBirth', type: 'date' },
    { name: 'nationality', type: 'text' },
    { name: 'currentAddress', type: 'textarea' },
    {
      name: 'applicantType',
      type: 'select',
      options: ['student', 'employed', 'intern-graduate', 'business', 'other'],
    },
    { name: 'institutionOrEmployer', type: 'text', index: true },
    {
      name: 'tier',
      type: 'select',
      index: true,
      options: ['student-plus', 'young-professional', 'visitor-short-stay', 'business-office'],
    },
    { name: 'moveInDate', type: 'date' },
    { name: 'expectedMoveOutDate', type: 'date' },
    {
      name: 'agreementLength',
      type: 'select',
      options: [
        'academic-year',
        '6-months',
        '12-months',
        '24-months',
        'month-to-month',
        'nightly-weekly',
      ],
    },
    { name: 'preferredSuburb', type: 'relationship', relationTo: 'suburbs' },
    { name: 'preferredHome', type: 'relationship', relationTo: 'homes' },
    {
      name: 'payerType',
      type: 'select',
      index: true,
      options: [
        'self',
        'parent',
        'guardian-family',
        'employer-company',
        'bursary-funder',
        'university-institution',
        'split-payment',
        'business-company',
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      options: ['debit-order', 'eft', 'direct-funder', 'invoice-eft'],
    },
    { name: 'payerNetMonthlyIncome', type: 'number', min: 0 },
    { name: 'sponsorName', type: 'text' },
    { name: 'sponsorEmail', type: 'email' },
    { name: 'sponsorPhone', type: 'text' },
    { name: 'sponsorEmploymentStatus', type: 'text' },
    {
      name: 'businessDetails',
      type: 'group',
      fields: [
        { name: 'companyName', type: 'text' },
        { name: 'registrationNumber', type: 'text' },
        { name: 'vatNumber', type: 'text' },
        { name: 'industry', type: 'text' },
        { name: 'website', type: 'text' },
        { name: 'representativeRole', type: 'text' },
        { name: 'teamSize', type: 'number', min: 1 },
        {
          name: 'monthlyRevenue',
          type: 'number',
          min: 0,
          access: { read: adminFieldAccess },
        },
        {
          name: 'officeType',
          type: 'select',
          enumName: 'enum_app_office_type',
          options: ['private-office', 'shared-office', 'entire-floor', 'flexible-workspace'],
        },
        { name: 'requiredSeats', type: 'number', min: 1 },
        { name: 'intendedUse', type: 'textarea' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.applicationKind === 'office',
      },
    },
    {
      name: 'references',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'referenceType',
          type: 'select',
          required: true,
          options: [
            'landlord',
            'character',
            'employer-institution',
            'commercial-landlord',
            'trade',
          ],
        },
        { name: 'relationship', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email' },
        { name: 'organisation', type: 'text' },
        { name: 'consentConfirmed', type: 'checkbox', required: true },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'not-requested',
          options: ['not-requested', 'requested', 'received', 'overdue'],
          access: { create: () => false, update: adminFieldAccess },
        },
      ],
    },
    {
      name: 'applicationData',
      type: 'json',
      required: true,
      admin: {
        description:
          'Structured step data including study/work, room preferences, payer details, sponsor employer details and emergency preferences.',
      },
    },
    {
      name: 'documents',
      type: 'join',
      collection: 'application-documents',
      on: 'application',
    },
    {
      name: 'consents',
      type: 'group',
      fields: [
        { name: 'personalInformation', type: 'checkbox' },
        { name: 'contactReferences', type: 'checkbox' },
        { name: 'houseRules', type: 'checkbox' },
        { name: 'truthfulness', type: 'checkbox' },
        { name: 'marketing', type: 'checkbox', defaultValue: false },
        { name: 'photosTestimonials', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'typedSignature', type: 'text' },
    { name: 'signatureDate', type: 'date' },
    { name: 'lastCompletedStep', type: 'number', min: 0, max: 10, defaultValue: 0 },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      index: true,
      options: [
        'draft',
        'submitted',
        'documents-requested',
        'verification-in-progress',
        'affordability-review',
        'approved',
        'waitlisted',
        'declined',
        'lease-sent',
        'lease-signed',
        'deposit-paid',
      ],
      access: { create: () => true, update: () => true },
      admin: { position: 'sidebar' },
    },
    { name: 'submittedAt', type: 'date', admin: { position: 'sidebar' } },
    {
      name: 'assignedReviewer',
      type: 'relationship',
      relationTo: 'admins',
      access: { create: () => false, update: adminFieldAccess },
      admin: { position: 'sidebar' },
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      access: { create: () => false, read: adminFieldAccess, update: adminFieldAccess },
    },
  ],
}
