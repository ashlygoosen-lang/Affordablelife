'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { createResumeToken, isResumeToken } from '@/lib/application-tokens'
import { appAuth } from '@/lib/app-auth'
import type { ApplicationDocument, TenantApplication } from '@/payload-types'

export type ApplicationActionResult = {
  success: boolean
  message: string
  applicationId?: string
  resumeToken?: string
  fieldErrors?: Record<string, string>
  submitted?: boolean
}

const stringFields = [
  'applicantName',
  'applicationKind',
  'preferredName',
  'applicantEmail',
  'applicantPhone',
  'idType',
  'idNumber',
  'dateOfBirth',
  'nationality',
  'currentAddress',
  'province',
  'postalCode',
  'homeProvince',
  'applicantType',
  'institutionOrEmployer',
  'studentNumber',
  'qualification',
  'yearLevel',
  'employmentPosition',
  'workAddress',
  'companyName',
  'companyRegistrationNumber',
  'vatNumber',
  'businessIndustry',
  'businessWebsite',
  'representativeRole',
  'officeType',
  'officeUse',
  'tier',
  'preferredSuburb',
  'preferredHome',
  'moveInDate',
  'expectedMoveOutDate',
  'agreementLength',
  'roomType',
  'parking',
  'optionalExtras',
  'shuttleNeeds',
  'housePreferences',
  'holidayPlan',
  'payerType',
  'paymentMethod',
  'paymentDay',
  'invoiceEmail',
  'sponsorName',
  'sponsorRelationship',
  'sponsorIdNumber',
  'sponsorEmail',
  'sponsorPhone',
  'sponsorAddress',
  'sponsorEmploymentStatus',
  'sponsorEmployer',
  'sponsorRole',
  'sponsorWorkAddress',
  'sponsorYearsEmployed',
  'emergencyName',
  'emergencyRelationship',
  'emergencyPhone',
  'typedSignature',
] as const

const numberFields = [
  'grossMonthlyIncome',
  'netMonthlyIncome',
  'payerNetMonthlyIncome',
  'sponsorGrossIncome',
  'sponsorNetIncome',
  'businessTeamSize',
  'businessMonthlyRevenue',
  'officeSeats',
] as const

const booleanFields = [
  'personalInformation',
  'contactReferences',
  'houseRules',
  'truthfulness',
  'marketing',
  'photosTestimonials',
] as const

type SafeData = Record<string, string | number | boolean | Reference[]>
type Reference = {
  name: string
  referenceType: 'landlord' | 'character' | 'employer-institution' | 'commercial-landlord' | 'trade'
  relationship: string
  phone: string
  email?: string
  organisation?: string
  consentConfirmed: boolean
}

const cleanString = (value: unknown, max = 500) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''

function parseData(value: FormDataEntryValue | null): SafeData | null {
  if (typeof value !== 'string' || value.length > 100_000) return null
  try {
    const input = JSON.parse(value) as Record<string, unknown>
    const output: SafeData = {}
    for (const field of stringFields) output[field] = cleanString(input[field])
    for (const field of numberFields) {
      const number = Number(input[field])
      output[field] = Number.isFinite(number) && number >= 0 ? number : 0
    }
    for (const field of booleanFields) output[field] = input[field] === true
    const references = Array.isArray(input.references) ? input.references.slice(0, 2) : []
    output.references = references.map((reference): Reference => {
      const item =
        reference && typeof reference === 'object' ? (reference as Record<string, unknown>) : {}
      const referenceType = [
        'landlord',
        'character',
        'employer-institution',
        'commercial-landlord',
        'trade',
      ].includes(String(item.referenceType))
        ? (item.referenceType as Reference['referenceType'])
        : 'character'
      return {
        name: cleanString(item.name, 120),
        referenceType,
        relationship: cleanString(item.relationship, 120),
        phone: cleanString(item.phone, 40),
        email: cleanString(item.email, 200).toLowerCase(),
        organisation: cleanString(item.organisation, 160),
        consentConfirmed: item.consentConfirmed === true,
      }
    })
    return output
  } catch (error) {
    console.error('[application]', error)
return null
  }
}

function validate(data: SafeData, submit: boolean) {
  const errors: Record<string, string> = {}
  if (String(data.applicantName).length < 3)
    errors.applicantName = 'Enter your legal names and surname.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.applicantEmail)))
    errors.applicantEmail = 'Enter a valid email address.'
  if (String(data.applicantPhone).length < 7) errors.applicantPhone = 'Enter a valid mobile number.'
  if (!data.idType) errors.idType = 'Choose an identity document type.'
  if (String(data.idNumber).length < 5) errors.idNumber = 'Enter your identity or passport number.'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.dateOfBirth)))
    errors.dateOfBirth = 'Enter your date of birth.'
  if (!data.nationality) errors.nationality = 'Enter your nationality.'
  if (String(data.currentAddress).length < 8) errors.currentAddress = 'Enter your current address.'
  if (submit) {
    if (data.applicationKind === 'office') {
      if (String(data.companyName).length < 2)
        errors.companyName = 'Enter the registered business name.'
      if (String(data.companyRegistrationNumber).length < 3)
        errors.companyRegistrationNumber = 'Enter the company registration number.'
      if (!data.businessIndustry) errors.businessIndustry = 'Enter the business industry.'
      if (Number(data.businessTeamSize) < 1)
        errors.businessTeamSize = 'Enter the current team size.'
      if (Number(data.officeSeats) < 1)
        errors.officeSeats = 'Enter the number of office seats needed.'
      if (!data.officeType) errors.officeType = 'Choose an office type.'
    }
    for (const field of ['applicantType', 'tier', 'moveInDate', 'agreementLength', 'payerType']) {
      if (!data[field]) errors[field] = 'This field is required.'
    }
    if (data.applicationKind !== 'office' && !data.institutionOrEmployer) {
      errors.institutionOrEmployer = 'This field is required.'
    }
    const references = data.references as Reference[]
    if (
      references.length !== 2 ||
      references.some(
        (reference) =>
          reference.name.length < 2 ||
          reference.phone.length < 7 ||
          !reference.relationship ||
          !reference.consentConfirmed,
      )
    ) {
      errors.references = 'Add two complete references and confirm permission to contact them.'
    }
    for (const field of [
      'personalInformation',
      'contactReferences',
      'houseRules',
      'truthfulness',
    ]) {
      if (data[field] !== true) errors[field] = 'This consent is required.'
    }
    if (String(data.typedSignature).toLowerCase() !== String(data.applicantName).toLowerCase()) {
      errors.typedSignature = 'Type your legal name exactly as entered above.'
    }
  }
  return errors
}

export async function saveApplication(formData: FormData): Promise<ApplicationActionResult> {
  const data = parseData(formData.get('data'))
  if (!data) return { success: false, message: 'The application data could not be read.' }

  const submit = formData.get('submit') === 'true'
  const advance = formData.get('advance') === 'true'
  const applicationId = cleanString(formData.get('applicationId'), 100)
  const user = await appAuth.currentUser()
  const errors = submit || advance || !applicationId ? validate(data, submit) : {}
  if (Object.keys(errors).length) {
    return {
      success: false,
      message: submit
        ? 'Complete the highlighted application sections before submitting.'
        : 'Complete the required applicant details before saving.',
      fieldErrors: errors,
    }
  }

  const suppliedToken = cleanString(formData.get('resumeToken'), 128)
  const interest = cleanString(formData.get('interestId'), 100)
  const resumeToken = applicationId ? suppliedToken : createResumeToken()
  if (applicationId && !isResumeToken(resumeToken) && !user) {
    return { success: false, message: 'This draft link is invalid. Start a new application.' }
  }

  // Only complete reference rows go into the structured (validated) field; the
  // raw rows are kept in applicationData so partially typed references survive
  // draft saves made before the References step.
  const allReferences = data.references as Reference[]
  const references = allReferences.filter(
    (reference) =>
      reference.name.length >= 2 && reference.relationship.length > 0 && reference.phone.length >= 7,
  )
  const applicationData = Object.fromEntries(
    Object.entries(data).filter(
      ([key]) =>
        ![
          'applicantName',
          'applicationKind',
          'preferredName',
          'applicantEmail',
          'applicantPhone',
          'idType',
          'idNumber',
          'dateOfBirth',
          'nationality',
          'currentAddress',
          'applicantType',
          'institutionOrEmployer',
          'companyName',
          'companyRegistrationNumber',
          'vatNumber',
          'businessIndustry',
          'businessWebsite',
          'representativeRole',
          'businessTeamSize',
          'businessMonthlyRevenue',
          'officeType',
          'officeSeats',
          'officeUse',
          'tier',
          'preferredSuburb',
          'preferredHome',
          'moveInDate',
          'expectedMoveOutDate',
          'agreementLength',
          'payerType',
          'paymentMethod',
          'payerNetMonthlyIncome',
          'sponsorName',
          'sponsorEmail',
          'sponsorPhone',
          'sponsorEmploymentStatus',
          'references',
          ...booleanFields,
          'typedSignature',
        ].includes(key),
    ),
  ) as Record<string, unknown>
  applicationData.referencesDraft = allReferences

  const record = {
    ...(isResumeToken(resumeToken) ? { resumeTokenHash: resumeToken } : {}),
    interest: interest || undefined,
    applicationKind: (String(data.applicationKind) ||
      'accommodation') as TenantApplication['applicationKind'],
    applicantName: String(data.applicantName),
    preferredName: String(data.preferredName) || undefined,
    applicantEmail: String(data.applicantEmail).toLowerCase(),
    applicantPhone: String(data.applicantPhone),
    idType: (String(data.idType) || undefined) as TenantApplication['idType'],
    idNumber: String(data.idNumber) || undefined,
    dateOfBirth: String(data.dateOfBirth) || undefined,
    nationality: String(data.nationality) || undefined,
    currentAddress: String(data.currentAddress) || undefined,
    applicantType: (String(data.applicantType) || undefined) as TenantApplication['applicantType'],
    institutionOrEmployer: String(data.institutionOrEmployer || data.companyName) || undefined,
    tier: (String(data.tier) || undefined) as TenantApplication['tier'],
    preferredSuburb: String(data.preferredSuburb) || undefined,
    preferredHome: String(data.preferredHome) || undefined,
    moveInDate: String(data.moveInDate) || undefined,
    expectedMoveOutDate: String(data.expectedMoveOutDate) || undefined,
    agreementLength: (String(data.agreementLength) ||
      undefined) as TenantApplication['agreementLength'],
    payerType: (String(data.payerType) || undefined) as TenantApplication['payerType'],
    paymentMethod: (String(data.paymentMethod) || undefined) as TenantApplication['paymentMethod'],
    payerNetMonthlyIncome: Number(data.payerNetMonthlyIncome) || undefined,
    sponsorName: String(data.sponsorName) || undefined,
    sponsorEmail: String(data.sponsorEmail) || undefined,
    sponsorPhone: String(data.sponsorPhone) || undefined,
    sponsorEmploymentStatus: String(data.sponsorEmploymentStatus) || undefined,
    businessDetails:
      data.applicationKind === 'office'
        ? {
            companyName: String(data.companyName),
            registrationNumber: String(data.companyRegistrationNumber),
            vatNumber: String(data.vatNumber) || undefined,
            industry: String(data.businessIndustry),
            website: String(data.businessWebsite) || undefined,
            representativeRole: String(data.representativeRole) || undefined,
            teamSize: Number(data.businessTeamSize) || undefined,
            monthlyRevenue: Number(data.businessMonthlyRevenue) || undefined,
            officeType: (String(data.officeType) || undefined) as NonNullable<
              TenantApplication['businessDetails']
            >['officeType'],
            requiredSeats: Number(data.officeSeats) || undefined,
            intendedUse: String(data.officeUse) || undefined,
          }
        : undefined,
    references,
    applicationData,
    consents: {
      personalInformation: data.personalInformation === true,
      contactReferences: data.contactReferences === true,
      houseRules: data.houseRules === true,
      truthfulness: data.truthfulness === true,
      marketing: data.marketing === true,
      photosTestimonials: data.photosTestimonials === true,
    },
    typedSignature: String(data.typedSignature) || undefined,
    signatureDate: submit ? new Date().toISOString() : undefined,
    lastCompletedStep: Math.max(0, Math.min(10, Number(formData.get('lastCompletedStep')) || 0)),
    status: (submit ? 'submitted' : 'draft') as TenantApplication['status'],
  }

  try {
    const payload = await getPayload({ config })
    let saved: TenantApplication
    if (applicationId) {
      saved = await payload.update({
        collection: 'tenant-applications',
        id: applicationId,
        overrideAccess: false,
        user: user ?? undefined,
        data: record,
      })
    } else {
      saved = await payload.create({
        collection: 'tenant-applications',
        overrideAccess: false,
        user: user ?? undefined,
        data: { ...record, resumeTokenHash: resumeToken },
      })
    }
    return {
      success: true,
      message: submit
        ? 'Application submitted for human review.'
        : 'Draft saved. Keep using this browser to resume securely.',
      applicationId: String(saved.id),
      resumeToken,
      submitted: submit,
    }
  } catch (error) {
    console.error('[application]', error)
return {
      success: false,
      message:
        'We could not save this application. Check the required fields or try again in a moment.',
    }
  }
}

const allowedDocumentTypes = new Set([
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
])

const allowedMimeTypes = new Map([
  ['application/pdf', 'pdf'],
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/heic', 'heic'],
  ['image/heif', 'heif'],
])

export async function uploadApplicationDocument(
  formData: FormData,
): Promise<ApplicationActionResult> {
  const applicationId = cleanString(formData.get('applicationId'), 100)
  const resumeToken = cleanString(formData.get('resumeToken'), 128)
  const documentType = cleanString(formData.get('documentType'), 50)
  const note = cleanString(formData.get('note'), 500)
  const file = formData.get('file')
  const user = await appAuth.currentUser()

  if (!applicationId || (!isResumeToken(resumeToken) && !user)) {
    return { success: false, message: 'Save the application before uploading documents.' }
  }
  if (!allowedDocumentTypes.has(documentType)) {
    return { success: false, message: 'Choose a valid document category.' }
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: 'Choose a file to upload.' }
  }
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, message: 'Each file must be 10 MB or smaller.' }
  }
  const extension = allowedMimeTypes.get(file.type)
  if (!extension) {
    return { success: false, message: 'Upload a PDF, JPG, PNG, HEIC or HEIF file.' }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'application-documents',
      overrideAccess: false,
      user: user ?? undefined,
      data: {
        application: applicationId,
        applicationToken: isResumeToken(resumeToken) ? resumeToken : undefined,
        documentType: documentType as ApplicationDocument['documentType'],
        applicantNote: note || undefined,
      },
      file: {
        data: Buffer.from(await file.arrayBuffer()),
        mimetype: file.type,
        name: `${documentType}-${Date.now()}.${extension}`,
        size: file.size,
      },
    })
    return { success: true, message: 'Document uploaded and queued for review.' }
  } catch (error) {
    console.error('[application]', error)
return {
      success: false,
      message: 'The document could not be uploaded. Check the format and try again.',
    }
  }
}
