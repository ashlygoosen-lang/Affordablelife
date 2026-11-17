import config from '@payload-config'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { ApplicationForm, type InitialApplicationDraft } from '@/components/application-form'
import { appAuth } from '@/lib/app-auth'
import { getAllSuburbs, getVerifiedHomes } from '@/lib/listings'

export const metadata: Metadata = { title: 'Continue application' }

export default async function ContinueApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await appAuth.currentUser()
  if (!user) redirect(`/account?next=${encodeURIComponent(`/account/applications/${id}`)}`)
  const payload = await getPayload({ config })
  let application
  try {
    application = await payload.findByID({
      collection: 'tenant-applications',
      id,
      overrideAccess: false,
      user,
      depth: 0,
    })
  } catch {
    notFound()
  }
  if (!['draft', 'documents-requested'].includes(application.status ?? '')) {
    redirect('/account/interests')
  }

  const [suburbs, homes, documents] = await Promise.all([
    getAllSuburbs(),
    getVerifiedHomes(),
    payload.find({
      collection: 'application-documents',
      overrideAccess: true,
      depth: 0,
      limit: 100,
      where: { application: { equals: application.id } },
    }),
  ])
  const details =
    application.applicationData &&
    typeof application.applicationData === 'object' &&
    !Array.isArray(application.applicationData)
      ? application.applicationData
      : {}
  const business = application.businessDetails ?? {}
  const consents = application.consents ?? {}
  type DraftReference = {
    name: string
    referenceType: string
    relationship: string
    phone: string
    email: string
    organisation: string
    consentConfirmed: boolean
  }
  // Prefer the raw draft rows (they include partially completed references).
  const draftReferences = Array.isArray((details as Record<string, unknown>).referencesDraft)
    ? ((details as Record<string, unknown>).referencesDraft as DraftReference[])
    : null
  const references: DraftReference[] = (
    draftReferences ??
    (application.references ?? []).map((reference) => ({
      name: reference.name,
      referenceType: reference.referenceType,
      relationship: reference.relationship,
      phone: reference.phone,
      email: reference.email ?? '',
      organisation: reference.organisation ?? '',
      consentConfirmed: reference.consentConfirmed ?? false,
    }))
  ).slice(0, 2)
  while (references.length < 2) {
    references.push({
      name: '',
      referenceType: 'character',
      relationship: '',
      phone: '',
      email: '',
      organisation: '',
      consentConfirmed: false,
    })
  }
  const initialApplication: InitialApplicationDraft = {
    id: String(application.id),
    step: Math.max(0, Number(application.lastCompletedStep ?? 1) - 1),
    uploads: Object.fromEntries(
      documents.docs.map((document) => [document.documentType, 'uploaded' as const]),
    ),
    data: {
      ...details,
      applicationKind: application.applicationKind ?? 'accommodation',
      applicantName: application.applicantName,
      preferredName: application.preferredName ?? '',
      applicantEmail: application.applicantEmail,
      applicantPhone: application.applicantPhone,
      idType: application.idType ?? '',
      idNumber: application.idNumber ?? '',
      dateOfBirth: application.dateOfBirth?.slice(0, 10) ?? '',
      nationality: application.nationality ?? '',
      currentAddress: application.currentAddress ?? '',
      applicantType: application.applicantType ?? '',
      institutionOrEmployer: application.institutionOrEmployer ?? '',
      tier: application.tier ?? '',
      preferredSuburb:
        typeof application.preferredSuburb === 'object'
          ? String(application.preferredSuburb?.id ?? '')
          : String(application.preferredSuburb ?? ''),
      preferredHome:
        typeof application.preferredHome === 'object'
          ? String(application.preferredHome?.id ?? '')
          : String(application.preferredHome ?? ''),
      moveInDate: application.moveInDate?.slice(0, 10) ?? '',
      expectedMoveOutDate: application.expectedMoveOutDate?.slice(0, 10) ?? '',
      agreementLength: application.agreementLength ?? '',
      payerType: application.payerType ?? '',
      paymentMethod: application.paymentMethod ?? '',
      payerNetMonthlyIncome: application.payerNetMonthlyIncome ?? '',
      sponsorName: application.sponsorName ?? '',
      sponsorEmail: application.sponsorEmail ?? '',
      sponsorPhone: application.sponsorPhone ?? '',
      sponsorEmploymentStatus: application.sponsorEmploymentStatus ?? '',
      companyName: business.companyName || String((details as Record<string, unknown>).companyName ?? ''),
      companyRegistrationNumber: business.registrationNumber ?? '',
      vatNumber: business.vatNumber ?? '',
      businessIndustry: business.industry ?? '',
      businessWebsite: business.website ?? '',
      representativeRole: business.representativeRole ?? '',
      businessTeamSize: business.teamSize ?? '',
      businessMonthlyRevenue: business.monthlyRevenue ?? '',
      officeType: business.officeType ?? '',
      officeSeats: business.requiredSeats ?? '',
      officeUse: business.intendedUse ?? '',
      references,
      personalInformation: consents.personalInformation ?? false,
      contactReferences: consents.contactReferences ?? false,
      houseRules: consents.houseRules ?? false,
      truthfulness: consents.truthfulness ?? false,
      marketing: consents.marketing ?? false,
      photosTestimonials: consents.photosTestimonials ?? false,
      typedSignature: application.typedSignature ?? '',
    },
  }
  const suburbOptions = suburbs.map((suburb) => ({
    id: String(suburb.id),
    name: suburb.name,
    city: suburb.city,
    slug: suburb.slug,
  }))
  const homeOptions = homes.map((home) => ({
    id: String(home.id),
    title: home.title,
    suburbSlug: home.suburbSlug,
  }))

  return (
    <div className="min-h-screen bg-[#F5F1E9] pb-20">
      <section className="border-b border-[#D9DED9] bg-[#0E2A3B] text-white">
        <div className="page-container py-12">
          <p className="eyebrow-light">Secure member draft</p>
          <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
            Continue your application.
          </h1>
          <p className="mt-4 text-white/65">Changes save to your signed-in account.</p>
        </div>
      </section>
      <ApplicationForm
        suburbs={suburbOptions}
        homes={homeOptions}
        initialApplication={initialApplication}
      />
    </div>
  )
}
