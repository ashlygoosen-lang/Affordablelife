'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { createResumeToken, hashResumeToken } from '@/lib/application-tokens'
import { getPaymentSettings } from '@/lib/billing'
import { appAuth } from '@/lib/app-auth'

export type InterestFormState = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
  interestId?: string
  applicationId?: string
  resumeToken?: string
  reservation?: { url: string; amount: number; terms?: string | null }
}

const tiers = new Set([
  'student-plus',
  'young-professional',
  'visitor-short-stay',
  'business-office',
])

const text = (formData: FormData, key: string, max = 300) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function registerInterest(
  _previousState: InterestFormState,
  formData: FormData,
): Promise<InterestFormState> {
  const contactName = text(formData, 'contactName', 120)
  const email = text(formData, 'email', 200).toLowerCase()
  const phone = text(formData, 'phone', 40)
  const suburb = text(formData, 'suburb', 100)
  const home = text(formData, 'home', 100)
  const institutionOrEmployer = text(formData, 'institutionOrEmployer', 180)
  const moveInMonth = text(formData, 'moveInMonth', 20)
  const tier = text(formData, 'tier', 40)
  const monthlyBudget = Number(formData.get('monthlyBudget'))
  const roomsRequested = Number(formData.get('roomsRequested'))
  const sponsorPays = formData.get('sponsorPays') === 'on'
  const consentToContact = formData.get('consentToContact') === 'on'

  const fieldErrors: Record<string, string> = {}
  if (contactName.length < 2) fieldErrors.contactName = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Enter a valid email address.'
  if (phone.length < 7) fieldErrors.phone = 'Enter a valid phone or WhatsApp number.'
  if (!suburb) fieldErrors.suburb = 'Choose a suburb.'
  if (institutionOrEmployer.length < 2)
    fieldErrors.institutionOrEmployer = 'Enter your institution or employer.'
  if (!/^\d{4}-\d{2}$/.test(moveInMonth)) fieldErrors.moveInMonth = 'Choose a move-in month.'
  if (!tiers.has(tier)) fieldErrors.tier = 'Choose a customer tier.'
  if (!Number.isFinite(monthlyBudget) || monthlyBudget < 1000 || monthlyBudget > 100000)
    fieldErrors.monthlyBudget = 'Enter a realistic monthly budget.'
  const maximumSpaces = tier === 'business-office' ? 100 : 12
  if (!Number.isInteger(roomsRequested) || roomsRequested < 1 || roomsRequested > maximumSpaces)
    fieldErrors.roomsRequested =
      tier === 'business-office'
        ? 'Choose between 1 and 100 office seats.'
        : 'Choose between 1 and 12 rooms.'
  if (!consentToContact)
    fieldErrors.consentToContact = 'Consent is required so we can contact you about availability.'

  if (Object.keys(fieldErrors).length) {
    return { success: false, message: 'Please correct the highlighted fields.', fieldErrors }
  }

  try {
    const payload = await getPayload({ config })
    const user = await appAuth.currentUser()
    const interest = await payload.create({
      collection: 'demand-interests',
      overrideAccess: false,
      user: user ?? undefined,
      data: {
        contactName,
        email,
        phone,
        suburb,
        home: tier === 'business-office' ? undefined : home || undefined,
        institutionOrEmployer,
        moveInMonth: `${moveInMonth}-01T12:00:00.000Z`,
        monthlyBudget,
        tier: tier as
          | 'student-plus'
          | 'young-professional'
          | 'visitor-short-stay'
          | 'business-office',
        sponsorPays,
        roomsRequested,
        consentToContact,
      },
    })
    const resumeToken = createResumeToken()
    let applicationId: string | undefined
    try {
      const application = await payload.create({
        collection: 'tenant-applications',
        overrideAccess: false,
        user: user ?? undefined,
        data: {
          resumeTokenHash: resumeToken,
          interest: interest.id,
          applicantName: contactName,
          applicantEmail: email,
          applicantPhone: phone,
          applicationKind: tier === 'business-office' ? 'office' : 'accommodation',
          applicantType: tier === 'business-office' ? 'business' : undefined,
          institutionOrEmployer,
          tier: tier as
            | 'student-plus'
            | 'young-professional'
            | 'visitor-short-stay'
            | 'business-office',
          preferredSuburb: suburb,
          preferredHome: tier === 'business-office' ? undefined : home || undefined,
          moveInDate: `${moveInMonth}-01T12:00:00.000Z`,
          payerType:
            tier === 'business-office' ? 'business-company' : sponsorPays ? 'parent' : 'self',
          applicationData: {
            ...(tier === 'business-office' ? { companyName: institutionOrEmployer } : {}),
            monthlyBudget,
            roomsRequested,
            source: 'stage-one-interest',
          },
          lastCompletedStep: 0,
          status: 'draft',
        },
      })
      applicationId = String(application.id)
    } catch (error) {
      console.error('[interest] draft application could not be created', error)
      // Interest registration remains valid; Stage 2 can create the draft on its first save.
    }
    let reservation: InterestFormState['reservation']
    const settings = await getPaymentSettings(payload)
    if (settings?.reservationDepositsEnabled && Number(settings.reservationDepositAmount) > 0) {
      try {
        const payToken = createResumeToken()
        const amount = Number(settings.reservationDepositAmount)
        const invoice = await payload.create({
          collection: 'invoices',
          overrideAccess: true,
          context: { payToken },
          data: {
            kind: 'reservation-deposit',
            amount,
            description: `Refundable reservation deposit — ${tier === 'business-office' ? 'office request' : 'room'} interest`,
            dueDate: new Date(Date.now() + 7 * 86_400_000).toISOString(),
            payerName: contactName,
            payerEmail: email,
            tenant: user?.id,
            interest: interest.id,
            application: applicationId,
            payTokenHash: hashResumeToken(payToken),
            status: 'issued',
          },
        })
        await payload.update({
          collection: 'demand-interests',
          id: interest.id,
          overrideAccess: true,
          data: { reservationDepositStatus: 'invited' },
        })
        reservation = {
          url: `/pay/${invoice.id}?t=${encodeURIComponent(payToken)}`,
          amount,
          terms: settings.reservationTerms,
        }
      } catch (error) {
        console.error('[interest] reservation invoice could not be created', error)
      }
    }
    return {
      success: true,
      reservation,
      message: reservation
        ? 'Your interest is registered.'
        : 'Your interest is registered. No payment or reservation deposit has been taken.',
      interestId: String(interest.id),
      applicationId,
      resumeToken: applicationId ? resumeToken : undefined,
    }
  } catch (error) {
    console.error('[interest]', error)
return {
      success: false,
      message:
        'We could not register your interest right now. Please try again or contact us on WhatsApp.',
    }
  }
}
