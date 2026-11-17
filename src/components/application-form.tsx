'use client'

import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  LoaderCircle,
  LockKeyhole,
  Save,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  saveApplication,
  uploadApplicationDocument,
  type ApplicationActionResult,
} from '@/app/(frontend)/apply/actions'

type SuburbOption = { id: string; name: string; city: string; slug: string }
type HomeOption = { id: string; title: string; suburbSlug: string }
type Reference = {
  name: string
  referenceType: string
  relationship: string
  phone: string
  email: string
  organisation: string
  consentConfirmed: boolean
}
type FormValue = string | number | boolean | Reference[]
type FormState = Record<string, FormValue>
type UploadState = Record<string, 'uploading' | 'uploaded' | 'error'>
export type InitialApplicationDraft = {
  id: string
  data: FormState
  step: number
  uploads: UploadState
}

const steps = [
  'Your details',
  'Profile',
  'Space',
  'Payment',
  'Payer details',
  'References',
  'Documents',
  'Consent',
  'Review',
]

const emptyReference: Reference = {
  name: '',
  referenceType: 'character',
  relationship: '',
  phone: '',
  email: '',
  organisation: '',
  consentConfirmed: false,
}

const initialData: FormState = {
  applicationKind: 'accommodation',
  applicantName: '',
  preferredName: '',
  applicantEmail: '',
  applicantPhone: '',
  idType: '',
  idNumber: '',
  dateOfBirth: '',
  nationality: 'South African',
  currentAddress: '',
  province: '',
  postalCode: '',
  homeProvince: '',
  applicantType: '',
  institutionOrEmployer: '',
  studentNumber: '',
  qualification: '',
  yearLevel: '',
  employmentPosition: '',
  workAddress: '',
  grossMonthlyIncome: '',
  netMonthlyIncome: '',
  companyName: '',
  companyRegistrationNumber: '',
  vatNumber: '',
  businessIndustry: '',
  businessWebsite: '',
  representativeRole: '',
  businessTeamSize: '',
  businessMonthlyRevenue: '',
  officeType: '',
  officeSeats: '',
  officeUse: '',
  tier: '',
  preferredSuburb: '',
  preferredHome: '',
  moveInDate: '',
  expectedMoveOutDate: '',
  agreementLength: '',
  roomType: 'private-room',
  parking: 'not-needed',
  optionalExtras: '',
  shuttleNeeds: '',
  housePreferences: '',
  holidayPlan: '',
  payerType: '',
  paymentMethod: '',
  paymentDay: '',
  invoiceEmail: '',
  payerNetMonthlyIncome: '',
  sponsorName: '',
  sponsorRelationship: '',
  sponsorIdNumber: '',
  sponsorEmail: '',
  sponsorPhone: '',
  sponsorAddress: '',
  sponsorEmploymentStatus: '',
  sponsorEmployer: '',
  sponsorRole: '',
  sponsorWorkAddress: '',
  sponsorYearsEmployed: '',
  sponsorGrossIncome: '',
  sponsorNetIncome: '',
  emergencyName: '',
  emergencyRelationship: '',
  emergencyPhone: '',
  references: [{ ...emptyReference }, { ...emptyReference }],
  personalInformation: false,
  contactReferences: false,
  houseRules: false,
  truthfulness: false,
  marketing: false,
  photosTestimonials: false,
  typedSignature: '',
}

const requiredByStep: Record<number, string[]> = {
  0: [
    'applicantName',
    'applicantEmail',
    'applicantPhone',
    'idType',
    'idNumber',
    'dateOfBirth',
    'nationality',
    'currentAddress',
  ],
  1: ['applicantType', 'institutionOrEmployer'],
  2: ['tier', 'preferredSuburb', 'moveInDate', 'agreementLength'],
  3: ['payerType', 'paymentMethod'],
}

const tierPrices: Record<string, { price: string; note: string }> = {
  'student-plus': { price: 'From R7,250 / month', note: 'Meals and campus transport included.' },
  'young-professional': {
    price: 'From R7,950 / month',
    note: 'Meals and transport available as extras.',
  },
  'visitor-short-stay': { price: 'From R950 / night', note: 'Nightly and weekly stays.' },
  'business-office': {
    price: 'Quoted per office / month',
    note: 'Private and flexible offices for small teams, with core services itemised.',
  },
}

const inputClass =
  'mt-2 min-h-12 w-full rounded-xl border border-[#CBD5D6] bg-white px-4 text-base text-[#14202B] outline-none transition focus:border-[#2E6F5E] focus:ring-2 focus:ring-[#2E6F5E]/15'

export function ApplicationForm({
  suburbs,
  homes,
  initialApplication,
}: {
  suburbs: SuburbOption[]
  homes: HomeOption[]
  initialApplication?: InitialApplicationDraft
}) {
  const searchParams = useSearchParams()
  const interestId = searchParams.get('interest') ?? ''
  const [data, setData] = useState<FormState>(initialData)
  const [step, setStep] = useState(0)
  const [applicationId, setApplicationId] = useState('')
  const [resumeToken, setResumeToken] = useState('')
  const [notice, setNotice] = useState<ApplicationActionResult | null>(null)
  const [uploads, setUploads] = useState<UploadState>({})
  const [submitted, setSubmitted] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (initialApplication) {
      setData({ ...initialData, ...initialApplication.data })
      setApplicationId(initialApplication.id)
      setStep(Math.min(initialApplication.step, steps.length - 1))
      setUploads(initialApplication.uploads)
      return
    }
    const stageOne = sessionStorage.getItem('affordable-life-stage-one')
    const draft = localStorage.getItem('affordable-life-application')
    try {
      if (draft) {
        const saved = JSON.parse(draft) as {
          data?: FormState
          applicationId?: string
          resumeToken?: string
          step?: number
          uploads?: UploadState
        }
        const savedData = saved.data
        if (savedData) setData({ ...initialData, ...savedData })
        if (saved.applicationId) setApplicationId(saved.applicationId)
        if (saved.resumeToken) setResumeToken(saved.resumeToken)
        if (typeof saved.step === 'number') setStep(Math.min(saved.step, steps.length - 1))
        if (saved.uploads) setUploads(saved.uploads)
      } else if (stageOne) {
        setData(
          (current) =>
            ({ ...current, ...(JSON.parse(stageOne) as Partial<FormState>) }) as FormState,
        )
      }
    } catch {
      localStorage.removeItem('affordable-life-application')
    }
  }, [initialApplication])

  useEffect(() => {
    // Member drafts are saved to the signed-in account; keep the anonymous
    // browser draft (and its resume token) untouched.
    if (initialApplication) return
    localStorage.setItem(
      'affordable-life-application',
      JSON.stringify({ data, applicationId, resumeToken, step, uploads }),
    )
  }, [applicationId, data, initialApplication, resumeToken, step, uploads])

  const selectedSuburb = suburbs.find((suburb) => suburb.id === String(data.preferredSuburb))
  const availableHomes = homes.filter((home) => home.suburbSlug === selectedSuburb?.slug)
  const price = tierPrices[String(data.tier)]
  const isOffice = data.applicationKind === 'office' || data.tier === 'business-office'
  const sponsorRequired = !['', 'self', 'business-company'].includes(String(data.payerType))
  const references = data.references as Reference[]

  const documentSlots = useMemo(() => {
    if (isOffice) {
      return [
        {
          type: 'applicant-id',
          label: 'Authorised representative identity document',
          required: true,
        },
        { type: 'company-registration', label: 'Company registration document', required: true },
        {
          type: 'business-bank-statements',
          label: 'Recent business bank statements',
          required: true,
        },
        {
          type: 'proof-business-address',
          label: 'Proof of registered business address',
          required: true,
        },
        { type: 'director-id', label: 'Director identity document', required: false },
      ]
    }
    const slots = [
      { type: 'applicant-id', label: 'Identity document or passport', required: true },
      {
        type: data.applicantType === 'student' ? 'proof-registration' : 'employment-letter',
        label:
          data.applicantType === 'student'
            ? 'Proof of registration or acceptance'
            : 'Employment, internship or contract letter',
        required: true,
      },
      { type: 'applicant-residence', label: 'Proof of current address', required: false },
      { type: 'passport-photo', label: 'Recent profile photo', required: false },
    ]
    if (sponsorRequired) {
      slots.push(
        { type: 'sponsor-id', label: 'Sponsor identity document', required: true },
        { type: 'proof-income', label: 'Sponsor proof of income', required: true },
      )
    } else {
      slots.push(
        { type: 'payslips', label: 'Latest payslips', required: true },
        { type: 'bank-statements', label: 'Recent bank statements', required: true },
      )
    }
    if (['bursary-funder', 'university-institution'].includes(String(data.payerType))) {
      slots.push({ type: 'funding-letter', label: 'Funding confirmation letter', required: true })
    }
    return slots
  }, [data.applicantType, data.payerType, isOffice, sponsorRequired])

  const update = (name: string, value: FormValue) => {
    setData((current) => {
      if (name === 'applicationKind' && value === 'office') {
        return {
          ...current,
          applicationKind: 'office',
          applicantType: 'business',
          tier: 'business-office',
          payerType: 'business-company',
          roomType: 'private-office',
          preferredHome: '',
        }
      }
      if (name === 'applicationKind' && value === 'accommodation') {
        return {
          ...current,
          applicationKind: 'accommodation',
          applicantType: current.applicantType === 'business' ? '' : current.applicantType,
          tier: current.tier === 'business-office' ? '' : current.tier,
          payerType: current.payerType === 'business-company' ? '' : current.payerType,
        }
      }
      return { ...current, [name]: value }
    })
    setNotice(null)
  }

  const validateStep = (targetStep: number) => {
    const requiredFields = (requiredByStep[targetStep] ?? []).filter(
      // Office applications capture the company instead and are always "business".
      (field) => !(isOffice && (field === 'institutionOrEmployer' || field === 'applicantType')),
    )
    const missing = requiredFields.find((field) => String(data[field] ?? '').trim().length === 0)
    if (missing) {
      setNotice({ success: false, message: 'Complete all required fields before continuing.' })
      return false
    }
    if (targetStep === 4 && sponsorRequired) {
      if (
        !data.sponsorName ||
        !data.sponsorEmail ||
        !data.sponsorPhone ||
        !data.sponsorEmploymentStatus
      ) {
        setNotice({ success: false, message: 'Complete the required sponsor details.' })
        return false
      }
    }
    if (targetStep === 1 && isOffice) {
      const missingBusiness = [
        'companyName',
        'companyRegistrationNumber',
        'businessIndustry',
        'businessTeamSize',
      ].find((field) => !String(data[field] ?? '').trim())
      if (missingBusiness) {
        setNotice({ success: false, message: 'Complete the required business details.' })
        return false
      }
    }
    if (targetStep === 2 && isOffice && (!data.officeType || Number(data.officeSeats) < 1)) {
      setNotice({ success: false, message: 'Choose an office type and enter the seats needed.' })
      return false
    }
    if (
      targetStep === 5 &&
      references.some(
        (reference) =>
          !reference.name ||
          !reference.relationship ||
          reference.phone.length < 7 ||
          !reference.consentConfirmed,
      )
    ) {
      setNotice({
        success: false,
        message: 'Complete both references and confirm that they may be contacted.',
      })
      return false
    }
    if (
      targetStep === 6 &&
      documentSlots.some((slot) => slot.required && uploads[slot.type] !== 'uploaded')
    ) {
      setNotice({ success: false, message: 'Upload each document marked Required.' })
      return false
    }
    if (targetStep === 7) {
      const requiredConsents = [
        data.personalInformation,
        data.contactReferences,
        data.houseRules,
        data.truthfulness,
      ]
      if (
        requiredConsents.some((value) => value !== true) ||
        String(data.typedSignature).trim().toLowerCase() !==
          String(data.applicantName).trim().toLowerCase()
      ) {
        setNotice({
          success: false,
          message: 'Accept the required declarations and type your legal name exactly.',
        })
        return false
      }
    }
    return true
  }

  const persist = (submit: boolean, advance = false) => {
    if ((submit || advance) && !validateStep(step)) return
    const body = new FormData()
    body.set(
      'data',
      JSON.stringify(
        isOffice
          ? {
              ...data,
              applicationKind: 'office',
              applicantType: 'business',
              tier: 'business-office',
              payerType: data.payerType || 'business-company',
            }
          : data,
      ),
    )
    body.set('applicationId', applicationId)
    body.set('resumeToken', resumeToken)
    body.set('interestId', interestId)
    body.set('lastCompletedStep', String(step + 1))
    body.set('submit', String(submit))
    body.set('advance', String(advance))
    setNotice(null)
    startTransition(async () => {
      const result = await saveApplication(body)
      setNotice(result)
      if (result.success) {
        if (result.applicationId) setApplicationId(result.applicationId)
        if (result.resumeToken) setResumeToken(result.resumeToken)
        if (result.submitted) {
          setSubmitted(true)
          if (!initialApplication) localStorage.removeItem('affordable-life-application')
          sessionStorage.removeItem('affordable-life-stage-one')
        } else if (advance) {
          setStep((current) => Math.min(current + 1, steps.length - 1))
          window.scrollTo({ top: 300, behavior: 'smooth' })
        }
      }
    })
  }

  const uploadDocument = (documentType: string, file: File | undefined) => {
    // Members continuing a saved draft are authorised by their session instead of a token.
    if (!file || !applicationId || (!resumeToken && !initialApplication)) {
      setNotice({ success: false, message: 'Save your draft before uploading documents.' })
      return
    }
    const body = new FormData()
    body.set('applicationId', applicationId)
    body.set('resumeToken', resumeToken)
    body.set('documentType', documentType)
    body.set('file', file)
    setUploads((current) => ({ ...current, [documentType]: 'uploading' }))
    startTransition(async () => {
      const result = await uploadApplicationDocument(body)
      setNotice(result)
      setUploads((current) => ({
        ...current,
        [documentType]: result.success ? 'uploaded' : 'error',
      }))
    })
  }

  if (submitted) {
    return (
      <section className="page-container py-12">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[0_18px_50px_rgba(14,42,59,.12)] sm:p-12">
          <CheckCircle2 className="mx-auto text-[#2E6F5E]" size={64} />
          <p className="eyebrow mt-6">Application received</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#0E2A3B]">
            Thank you, {String(data.preferredName || data.applicantName).split(' ')[0]}.
          </h2>
          <p className="mt-5 leading-7 text-[#5F6D74]">
            Your application is now awaiting human review. We may ask for replacement documents or
            more information. Submission does not guarantee approval or reserve a{' '}
            {isOffice ? 'business office' : 'room'}.
          </p>
          <a className="primary-button mt-8" href={isOffice ? '/businesses' : '/homes'}>
            {isOffice ? 'Back to office rentals' : 'Browse verified homes'}
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="page-container py-8 sm:py-12">
      <div className="mb-8 overflow-x-auto pb-2">
        <ol className="flex min-w-[920px] items-center gap-2" aria-label="Application progress">
          {steps.map((label, index) => (
            <li className="flex flex-1 items-center gap-2" key={label}>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${
                  index < step
                    ? 'bg-[#2E6F5E] text-white'
                    : index === step
                      ? 'bg-[#C6A15B] text-[#0E2A3B]'
                      : 'bg-white text-[#6F797D]'
                }`}
              >
                {index < step ? <Check size={15} /> : index + 1}
              </span>
              <span
                className={`text-xs font-semibold ${index === step ? 'text-[#0E2A3B]' : 'text-[#738087]'}`}
              >
                {label}
              </span>
              {index < steps.length - 1 && <span className="h-px flex-1 bg-[#D5DDDB]" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl bg-white p-5 shadow-[0_18px_50px_rgba(14,42,59,.1)] sm:p-9">
          <div className="mb-8 flex items-start justify-between gap-5 border-b border-[#E1E6E4] pb-6">
            <div>
              <p className="eyebrow">
                Step {step + 1} of {steps.length}
              </p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#0E2A3B]">
                {steps[step]}
              </h2>
            </div>
            <button
              className="flex items-center gap-2 text-sm font-semibold text-[#2E6F5E] disabled:opacity-50"
              type="button"
              onClick={() => persist(false)}
              disabled={pending}
            >
              {pending ? <LoaderCircle className="animate-spin" size={17} /> : <Save size={17} />}
              Save draft
            </button>
          </div>

          {step === 0 && <ApplicantStep data={data} update={update} isOffice={isOffice} />}
          {step === 1 && <StudyWorkStep data={data} update={update} isOffice={isOffice} />}
          {step === 2 && (
            <RoomStep
              data={data}
              update={update}
              suburbs={suburbs}
              homes={availableHomes}
              isOffice={isOffice}
            />
          )}
          {step === 3 && <PayerStep data={data} update={update} isOffice={isOffice} />}
          {step === 4 && <SponsorStep data={data} update={update} required={sponsorRequired} />}
          {step === 5 && (
            <ReferencesStep
              references={references}
              update={(updated) => update('references', updated)}
              isOffice={isOffice}
            />
          )}
          {step === 6 && (
            <DocumentsStep
              slots={documentSlots}
              uploads={uploads}
              upload={uploadDocument}
              canUpload={Boolean(applicationId && (resumeToken || initialApplication))}
            />
          )}
          {step === 7 && <ConsentStep data={data} update={update} isOffice={isOffice} />}
          {step === 8 && (
            <ReviewStep
              data={data}
              uploads={uploads}
              documentSlots={documentSlots}
              isOffice={isOffice}
              goToStep={setStep}
            />
          )}

          {notice && (
            <div
              className={`mt-7 rounded-xl border p-4 text-sm leading-6 ${
                notice.success
                  ? 'border-[#2E6F5E]/30 bg-[#EAF4F0] text-[#245849]'
                  : 'border-[#B34B32]/30 bg-[#FFF1ED] text-[#943A26]'
              }`}
              role={notice.success ? 'status' : 'alert'}
            >
              {notice.message}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#E1E6E4] pt-6 sm:flex-row sm:justify-between">
            <button
              className="secondary-button"
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0 || pending}
            >
              <ArrowLeft size={18} /> Back
            </button>
            {step < steps.length - 1 ? (
              <button
                className="primary-button"
                type="button"
                onClick={() => persist(false, true)}
                disabled={pending}
              >
                {pending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    Save and continue <ArrowRight size={18} />
                  </>
                )}
              </button>
            ) : (
              <button
                className="primary-button"
                type="button"
                onClick={() => persist(true)}
                disabled={pending}
              >
                {pending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={18} /> Submit application
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6">
          <div className="rounded-3xl bg-[#0E2A3B] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[#D8BB7A]">
              Your price guide
            </p>
            <p className="mt-4 font-serif text-3xl font-semibold">
              {price?.price ?? 'Choose a tier'}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              {price?.note ?? 'Select your space type in Step 3 to see an illustration.'}
            </p>
            <div className="mt-5 border-t border-white/15 pt-5 text-xs leading-5 text-white/60">
              Illustrative pricing only. Final property, dates, occupancy and optional extras affect
              the offer.
            </div>
          </div>
          <div className="rounded-3xl border border-[#D6DEDB] bg-white p-6">
            <div className="flex items-center gap-3 font-semibold text-[#0E2A3B]">
              <LockKeyhole className="text-[#2E6F5E]" size={20} /> Private application
            </div>
            <p className="mt-3 text-sm leading-6 text-[#68757A]">
              Applications and files are not publicly readable. Your resume key stays on this
              device, so use the same browser until the application is submitted.
            </p>
          </div>
          <div className="rounded-3xl border border-[#C6A15B]/40 bg-[#FBF6EA] p-6 text-sm leading-6 text-[#685A3C]">
            <strong className="block text-[#44371F]">Legal review required before launch</strong>
            Consent, privacy, suretyship and electronic-signature wording is provisional. No deposit
            is collected here.
          </div>
        </aside>
      </div>
    </section>
  )
}

function ApplicantStep({ data, update, isOffice }: StepProps & { isOffice: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold text-[#24343B]">What do you need?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            ['accommodation', 'A room or short stay', 'For students, professionals and visitors.'],
            [
              'office',
              'An office for my business',
              'For companies and small teams needing workspace.',
            ],
          ].map(([value, title, description]) => (
            <label
              className={`cursor-pointer rounded-2xl border p-5 transition ${
                data.applicationKind === value
                  ? 'border-[#2E6F5E] bg-[#EDF5F1] ring-2 ring-[#2E6F5E]/10'
                  : 'border-[#D8E0DE] bg-white hover:border-[#2E6F5E]/50'
              }`}
              key={value}
            >
              <input
                className="sr-only"
                type="radio"
                name="application-kind"
                value={value}
                checked={data.applicationKind === value}
                onChange={() => update('applicationKind', value)}
              />
              <span className="block font-serif text-xl font-semibold text-[#0E2A3B]">{title}</span>
              <span className="mt-2 block text-sm leading-6 text-[#68757A]">{description}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Field
        label={isOffice ? 'Authorised representative’s legal name' : 'Legal names and surname'}
        required
      >
        <Input name="applicantName" data={data} update={update} autoComplete="name" />
      </Field>
      <Field label="Preferred name">
        <Input name="preferredName" data={data} update={update} />
      </Field>
      <Field label="Email address" required>
        <Input
          name="applicantEmail"
          data={data}
          update={update}
          type="email"
          autoComplete="email"
        />
      </Field>
      <Field label="Mobile / WhatsApp" required>
        <Input name="applicantPhone" data={data} update={update} type="tel" autoComplete="tel" />
      </Field>
      <Field label="Identity document type" required>
        <Select name="idType" data={data} update={update}>
          <option value="">Choose document type</option>
          <option value="south-african-id">South African ID</option>
          <option value="passport">Passport</option>
          <option value="asylum-permit">Asylum permit</option>
          <option value="refugee-permit">Refugee permit</option>
        </Select>
      </Field>
      <Field
        label="ID / passport number"
        required
        help="Used to verify that the applicant and uploaded identity document match."
      >
        <Input name="idNumber" data={data} update={update} autoComplete="off" />
      </Field>
      <Field label="Date of birth" required>
        <Input name="dateOfBirth" data={data} update={update} type="date" />
      </Field>
      <Field label="Nationality" required>
        <Input name="nationality" data={data} update={update} autoComplete="country-name" />
      </Field>
      <Field label="Current residential address" required wide>
        <Textarea name="currentAddress" data={data} update={update} autoComplete="street-address" />
      </Field>
      <Field label="Province">
        <Input name="province" data={data} update={update} />
      </Field>
      <Field label="Postal code">
        <Input name="postalCode" data={data} update={update} inputMode="numeric" />
      </Field>
    </div>
  )
}

function StudyWorkStep({ data, update, isOffice }: StepProps & { isOffice: boolean }) {
  const type = String(data.applicantType)
  if (isOffice) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-[#EEF5F3] p-5 text-sm leading-6 text-[#365E53] sm:col-span-2">
          Tell us about the business that will occupy and pay for the office. Final pricing depends
          on location, seats, term and included services.
        </div>
        <Field label="Registered company name" required wide>
          <Input name="companyName" data={data} update={update} autoComplete="organization" />
        </Field>
        <Field label="Company registration number" required>
          <Input name="companyRegistrationNumber" data={data} update={update} />
        </Field>
        <Field label="VAT number">
          <Input name="vatNumber" data={data} update={update} />
        </Field>
        <Field label="Industry" required>
          <Input name="businessIndustry" data={data} update={update} />
        </Field>
        <Field label="Company website">
          <Input
            name="businessWebsite"
            data={data}
            update={update}
            type="url"
            placeholder="https://"
          />
        </Field>
        <Field label="Your role in the business" required>
          <Input name="representativeRole" data={data} update={update} />
        </Field>
        <Field label="Current team size" required>
          <Input
            name="businessTeamSize"
            data={data}
            update={update}
            type="number"
            min="1"
            inputMode="numeric"
          />
        </Field>
      </div>
    )
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="I am applying as" required wide>
        <Select name="applicantType" data={data} update={update}>
          <option value="">Choose one</option>
          <option value="student">Student</option>
          <option value="employed">Employed</option>
          <option value="intern-graduate">Intern / graduate programme</option>
          <option value="other">Other</option>
        </Select>
      </Field>
      <Field label={type === 'student' ? 'Institution' : 'Employer / organisation'} required wide>
        <Input name="institutionOrEmployer" data={data} update={update} />
      </Field>
      {type === 'student' ? (
        <>
          <Field label="Student number">
            <Input name="studentNumber" data={data} update={update} />
          </Field>
          <Field label="Qualification">
            <Input name="qualification" data={data} update={update} />
          </Field>
          <Field label="Year of study">
            <Input name="yearLevel" data={data} update={update} />
          </Field>
          <Field label="Home province">
            <Input name="homeProvince" data={data} update={update} />
          </Field>
        </>
      ) : (
        <>
          <Field label="Position / role">
            <Input name="employmentPosition" data={data} update={update} />
          </Field>
          <Field label="Work address">
            <Input name="workAddress" data={data} update={update} />
          </Field>
          <Field label="Gross monthly income">
            <Input
              name="grossMonthlyIncome"
              data={data}
              update={update}
              type="number"
              inputMode="decimal"
            />
          </Field>
          <Field label="Net monthly income">
            <Input
              name="netMonthlyIncome"
              data={data}
              update={update}
              type="number"
              inputMode="decimal"
            />
          </Field>
        </>
      )}
    </div>
  )
}

function RoomStep({
  data,
  update,
  suburbs,
  homes,
  isOffice,
}: StepProps & { suburbs: SuburbOption[]; homes: HomeOption[]; isOffice: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {isOffice ? (
        <div className="rounded-2xl bg-[#0E2A3B] p-5 text-white sm:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#E1C17F]">
            Business Office
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Choose the workspace and location your team needs. We will confirm availability and an
            itemised monthly quote after review.
          </p>
        </div>
      ) : (
        <Field label="Customer tier" required wide>
          <Select name="tier" data={data} update={update}>
            <option value="">Choose your tier</option>
            <option value="student-plus">Student Plus</option>
            <option value="young-professional">Young Professional</option>
            <option value="visitor-short-stay">Visitor / Short Stay</option>
          </Select>
        </Field>
      )}
      <Field label="Preferred suburb" required>
        <Select name="preferredSuburb" data={data} update={update}>
          <option value="">Choose a suburb</option>
          {suburbs.map((suburb) => (
            <option value={suburb.id} key={suburb.id}>
              {suburb.name}
            </option>
          ))}
        </Select>
      </Field>
      {!isOffice && (
        <Field label="Preferred verified home">
          <Select name="preferredHome" data={data} update={update}>
            <option value="">Any suitable home</option>
            {homes.map((home) => (
              <option value={home.id} key={home.id}>
                {home.title}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field label="Move-in date" required>
        <Input name="moveInDate" data={data} update={update} type="date" />
      </Field>
      <Field label="Expected move-out">
        <Input name="expectedMoveOutDate" data={data} update={update} type="date" />
      </Field>
      <Field label="Agreement length" required>
        <Select name="agreementLength" data={data} update={update}>
          <option value="">Choose a term</option>
          <option value="academic-year">Academic year</option>
          <option value="6-months">6 months</option>
          <option value="12-months">12 months</option>
          <option value="24-months">24 months</option>
          <option value="month-to-month">Month to month</option>
          {!isOffice && <option value="nightly-weekly">Nightly / weekly</option>}
        </Select>
      </Field>
      {isOffice ? (
        <>
          <Field label="Office type" required>
            <Select name="officeType" data={data} update={update}>
              <option value="">Choose office type</option>
              <option value="private-office">Private office</option>
              <option value="shared-office">Shared office</option>
              <option value="entire-floor">Entire floor</option>
              <option value="flexible-workspace">Flexible workspace</option>
            </Select>
          </Field>
          <Field label="Seats needed" required>
            <Input
              name="officeSeats"
              data={data}
              update={update}
              type="number"
              min="1"
              inputMode="numeric"
            />
          </Field>
          <Field label="How will the office be used?" wide>
            <Textarea
              name="officeUse"
              data={data}
              update={update}
              placeholder="Daily team workspace, client meetings, hybrid hub or other use"
            />
          </Field>
        </>
      ) : (
        <Field label="Room type">
          <Select name="roomType" data={data} update={update}>
            <option value="private-room">Private room</option>
            <option value="shared-room">Shared room</option>
            <option value="either">Either</option>
          </Select>
        </Field>
      )}
      <Field label="Parking">
        <Select name="parking" data={data} update={update}>
          <option value="not-needed">Not needed</option>
          <option value="car">Car</option>
          <option value="motorbike">Motorbike</option>
          <option value="bicycle">Bicycle</option>
        </Select>
      </Field>
      {!isOffice && (
        <>
          <Field label="Shuttle or transport needs" wide>
            <Textarea name="shuttleNeeds" data={data} update={update} />
          </Field>
          <Field label="House preferences" wide>
            <Textarea
              name="housePreferences"
              data={data}
              update={update}
              placeholder="Quiet hours, accessibility, location or other practical needs"
            />
          </Field>
          <Field label="Holiday / recess plan" wide>
            <Textarea name="holidayPlan" data={data} update={update} />
          </Field>
        </>
      )}
    </div>
  )
}

function PayerStep({ data, update, isOffice }: StepProps & { isOffice: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        label="Who will pay?"
        required
        wide
        help="This determines which supporting documents we request."
      >
        <Select name="payerType" data={data} update={update}>
          <option value="">Choose payer</option>
          <option value="self">Applicant / self</option>
          <option value="parent">Parent</option>
          <option value="guardian-family">Guardian / family member</option>
          <option value="employer-company">Employer / company</option>
          <option value="bursary-funder">Bursary / funder</option>
          <option value="university-institution">University / institution</option>
          <option value="split-payment">Split payment</option>
          <option value="business-company">The applying business</option>
        </Select>
      </Field>
      <Field label="Preferred payment method" required>
        <Select name="paymentMethod" data={data} update={update}>
          <option value="">Choose method</option>
          <option value="debit-order">Debit order</option>
          <option value="eft">EFT</option>
          <option value="direct-funder">Direct from funder</option>
          <option value="invoice-eft">Invoice and EFT</option>
        </Select>
      </Field>
      <Field label="Preferred monthly payment day">
        <Input name="paymentDay" data={data} update={update} type="number" min="1" max="28" />
      </Field>
      <Field label="Invoice email">
        <Input name="invoiceEmail" data={data} update={update} type="email" />
      </Field>
      <Field
        label={isOffice ? 'Average monthly business revenue' : 'Payer net monthly income'}
        help="Used only as one input in a human affordability review."
      >
        <Input
          name={isOffice ? 'businessMonthlyRevenue' : 'payerNetMonthlyIncome'}
          data={data}
          update={update}
          type="number"
          min="0"
          inputMode="decimal"
        />
      </Field>
    </div>
  )
}

function SponsorStep({ data, update, required }: StepProps & { required: boolean }) {
  if (!required) {
    return (
      <div className="rounded-2xl bg-[#EDF5F1] p-6 text-sm leading-7 text-[#315E51]">
        <CheckCircle2 className="mb-3" />
        You selected self-payment, so a sponsor block is not required. Continue if this is correct,
        or return to the previous step to change the payer.
      </div>
    )
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Sponsor / payer legal name" required>
        <Input name="sponsorName" data={data} update={update} />
      </Field>
      <Field label="Relationship to applicant" required>
        <Input name="sponsorRelationship" data={data} update={update} />
      </Field>
      <Field label="Sponsor ID / registration number">
        <Input name="sponsorIdNumber" data={data} update={update} />
      </Field>
      <Field label="Sponsor email" required>
        <Input name="sponsorEmail" data={data} update={update} type="email" />
      </Field>
      <Field label="Sponsor mobile" required>
        <Input name="sponsorPhone" data={data} update={update} type="tel" />
      </Field>
      <Field label="Residential / registered address" wide>
        <Textarea name="sponsorAddress" data={data} update={update} />
      </Field>
      <Field label="Employment status" required>
        <Select name="sponsorEmploymentStatus" data={data} update={update}>
          <option value="">Choose status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-employed</option>
          <option value="retired">Retired</option>
          <option value="unemployed">Unemployed</option>
          <option value="company-funder">Company / funder</option>
        </Select>
      </Field>
      <Field label="Employer / business">
        <Input name="sponsorEmployer" data={data} update={update} />
      </Field>
      <Field label="Role / occupation">
        <Input name="sponsorRole" data={data} update={update} />
      </Field>
      <Field label="Years employed / trading">
        <Input name="sponsorYearsEmployed" data={data} update={update} />
      </Field>
      <Field label="Gross monthly income">
        <Input name="sponsorGrossIncome" data={data} update={update} type="number" min="0" />
      </Field>
      <Field label="Net monthly income">
        <Input name="sponsorNetIncome" data={data} update={update} type="number" min="0" />
      </Field>
      <Field label="Employer / business address" wide>
        <Textarea name="sponsorWorkAddress" data={data} update={update} />
      </Field>
    </div>
  )
}

function ReferencesStep({
  references,
  update,
  isOffice,
}: {
  references: Reference[]
  update: (references: Reference[]) => void
  isOffice: boolean
}) {
  const change = (index: number, field: keyof Reference, value: string | boolean) => {
    update(
      references.map((reference, itemIndex) =>
        itemIndex === index ? { ...reference, [field]: value } : reference,
      ),
    )
  }
  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-[#657278]">
        {isOffice
          ? 'Add two commercial, trade or professional references. Ask their permission before sharing their details.'
          : 'Add two people who can comment on tenancy, work, study or character. Ask their permission before sharing their details.'}
      </p>
      {references.map((reference, index) => (
        <fieldset
          className="grid gap-5 rounded-2xl border border-[#DCE3E1] p-5 sm:grid-cols-2"
          key={index}
        >
          <legend className="px-2 font-serif text-xl font-semibold text-[#0E2A3B]">
            Reference {index + 1}
          </legend>
          <Field label="Full name" required>
            <input
              className={inputClass}
              value={reference.name}
              onChange={(event) => change(index, 'name', event.target.value)}
            />
          </Field>
          <Field label="Reference type" required>
            <select
              className={inputClass}
              value={reference.referenceType}
              onChange={(event) => change(index, 'referenceType', event.target.value)}
            >
              <option value="character">Character</option>
              <option value="landlord">Current / former landlord</option>
              <option value="employer-institution">Employer / institution</option>
              {isOffice && <option value="commercial-landlord">Commercial landlord</option>}
              {isOffice && <option value="trade">Trade / supplier reference</option>}
            </select>
          </Field>
          <Field label="Relationship" required>
            <input
              className={inputClass}
              value={reference.relationship}
              onChange={(event) => change(index, 'relationship', event.target.value)}
            />
          </Field>
          <Field label="Phone" required>
            <input
              className={inputClass}
              type="tel"
              value={reference.phone}
              onChange={(event) => change(index, 'phone', event.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              value={reference.email}
              onChange={(event) => change(index, 'email', event.target.value)}
            />
          </Field>
          <Field label="Organisation">
            <input
              className={inputClass}
              value={reference.organisation}
              onChange={(event) => change(index, 'organisation', event.target.value)}
            />
          </Field>
          <label className="flex items-start gap-3 rounded-xl bg-[#F5F2EA] p-4 text-sm leading-6 sm:col-span-2">
            <input
              className="mt-1 size-5 accent-[#2E6F5E]"
              type="checkbox"
              checked={reference.consentConfirmed}
              onChange={(event) => change(index, 'consentConfirmed', event.target.checked)}
            />
            I have this person’s permission to share their details and for Affordable Life to
            contact them.
          </label>
        </fieldset>
      ))}
    </div>
  )
}

function DocumentsStep({
  slots,
  uploads,
  upload,
  canUpload,
}: {
  slots: { type: string; label: string; required: boolean }[]
  uploads: UploadState
  upload: (type: string, file: File | undefined) => void
  canUpload: boolean
}) {
  return (
    <div>
      <div className="mb-6 rounded-2xl bg-[#EEF5F3] p-5 text-sm leading-6 text-[#3C5E55]">
        <div className="flex items-center gap-2 font-semibold text-[#244E43]">
          <Camera size={18} /> Mobile and camera ready
        </div>
        Photograph a clear, complete document or choose a PDF, JPG, PNG, HEIC or HEIF file. Maximum
        10 MB each.
      </div>
      <div className="space-y-3">
        {slots.map((slot) => (
          <label
            className="flex cursor-pointer flex-col gap-4 rounded-2xl border border-[#D8E0DE] p-5 transition hover:border-[#2E6F5E] sm:flex-row sm:items-center"
            key={slot.type}
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#F2EEE5] text-[#766238]">
              <FileText size={21} />
            </span>
            <span className="flex-1">
              <span className="block font-semibold text-[#17262E]">{slot.label}</span>
              <span className="mt-1 block text-xs text-[#778287]">
                {slot.required ? 'Required' : 'Optional'} · Replacement uploads keep the earlier
                audit record
              </span>
            </span>
            <span
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold ${uploads[slot.type] === 'uploaded' ? 'bg-[#E5F2EC] text-[#2E6F5E]' : 'bg-[#0E2A3B] text-white'}`}
            >
              {uploads[slot.type] === 'uploading' ? (
                <LoaderCircle className="animate-spin" size={17} />
              ) : uploads[slot.type] === 'uploaded' ? (
                <>
                  <Check size={17} /> Uploaded
                </>
              ) : (
                <>
                  <Upload size={17} /> Choose file
                </>
              )}
            </span>
            <input
              className="sr-only"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,application/pdf,image/jpeg,image/png,image/heic,image/heif"
              disabled={!canUpload || uploads[slot.type] === 'uploading'}
              onChange={(event) => upload(slot.type, event.target.files?.[0])}
            />
          </label>
        ))}
      </div>
      {!canUpload && (
        <p className="mt-4 text-sm font-semibold text-[#A3452E]">
          Use “Save draft” first to create your protected upload file.
        </p>
      )}
      <p className="mt-5 text-xs leading-5 text-[#768187]">
        Files are reviewed by authorised staff. Automated virus scanning, extraction and fraud
        scoring are not represented as active features.
      </p>
    </div>
  )
}

function ConsentStep({ data, update, isOffice }: StepProps & { isOffice: boolean }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#C6A15B]/40 bg-[#FBF6EA] p-5 text-sm leading-6 text-[#685A3C]">
        <strong className="block text-[#44371F]">Provisional legal wording</strong>
        An attorney must approve privacy, consent, suretyship and electronic-signature wording
        before launch. Submitting now records your application for review; it does not create a
        lease or guarantee approval.
      </div>
      <Consent
        name="personalInformation"
        checked={Boolean(data.personalInformation)}
        update={update}
        required
      >
        Affordable Life may collect, store and use my personal and business information to assess
        and administer this {isOffice ? 'office rental' : 'accommodation'} application.
      </Consent>
      <Consent
        name="contactReferences"
        checked={Boolean(data.contactReferences)}
        update={update}
        required
      >
        Affordable Life may contact the two references I supplied for application verification.
      </Consent>
      <Consent name="houseRules" checked={Boolean(data.houseRules)} update={update} required>
        I understand that any offer will be subject to property-specific{' '}
        {isOffice ? 'building rules' : 'house rules'} and a separate lease.
      </Consent>
      <Consent name="truthfulness" checked={Boolean(data.truthfulness)} update={update} required>
        I declare that the information and documents I supplied are complete and truthful.
      </Consent>
      <Consent name="marketing" checked={Boolean(data.marketing)} update={update}>
        I would like occasional availability and product updates. Optional.
      </Consent>
      <Consent name="photosTestimonials" checked={Boolean(data.photosTestimonials)} update={update}>
        I may be contacted separately about photos or testimonials. Optional and revocable.
      </Consent>
      <Field
        label="Type your legal name as an electronic signature"
        required
        help="This records your typed name and submission date. Attorney review is required before relying on this as a binding signature."
      >
        <Input name="typedSignature" data={data} update={update} autoComplete="name" />
      </Field>
    </div>
  )
}

function ReviewStep({
  data,
  uploads,
  documentSlots,
  isOffice,
  goToStep,
}: {
  data: FormState
  uploads: UploadState
  documentSlots: { type: string; label: string; required: boolean }[]
  isOffice: boolean
  goToStep: (step: number) => void
}) {
  const sections = [
    {
      title: isOffice ? 'Representative' : 'Applicant',
      step: 0,
      rows: [
        ['Name', String(data.applicantName)],
        ['Email', String(data.applicantEmail)],
        ['Mobile', String(data.applicantPhone)],
      ],
    },
    {
      title: isOffice ? 'Business' : 'Profile',
      step: 1,
      rows: isOffice
        ? [
            ['Company', String(data.companyName)],
            ['Registration', String(data.companyRegistrationNumber)],
            ['Industry', String(data.businessIndustry)],
          ]
        : [
            ['Applicant type', String(data.applicantType).replaceAll('-', ' ')],
            ['Institution / employer', String(data.institutionOrEmployer)],
          ],
    },
    {
      title: isOffice ? 'Office requirement' : 'Room preference',
      step: 2,
      rows: [
        ['Tier', isOffice ? 'Business Office' : String(data.tier).replaceAll('-', ' ')],
        ['Move-in', String(data.moveInDate)],
        [
          isOffice ? 'Office' : 'Room',
          isOffice
            ? `${String(data.officeType).replaceAll('-', ' ')} · ${String(data.officeSeats)} seats`
            : String(data.roomType).replaceAll('-', ' '),
        ],
      ],
    },
    {
      title: 'Payment',
      step: 3,
      rows: [
        ['Payer', String(data.payerType).replaceAll('-', ' ')],
        ['Method', String(data.paymentMethod).replaceAll('-', ' ')],
      ],
    },
  ]
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#EEF5F3] p-5 text-sm leading-6 text-[#315E51]">
        <strong className="block text-[#21483D]">Review before submitting</strong>
        Check every section and confirm that each required document is uploaded. You can go back
        without losing your saved draft.
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <section className="rounded-2xl border border-[#D9E1DF] p-5" key={section.title}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-serif text-xl font-semibold text-[#0E2A3B]">{section.title}</h3>
              <button
                className="text-xs font-bold text-[#2E6F5E] underline underline-offset-4"
                type="button"
                onClick={() => goToStep(section.step)}
              >
                Edit
              </button>
            </div>
            <dl className="mt-4 space-y-3">
              {section.rows.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-[#7A858A]">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm capitalize text-[#26363D]">
                    {value || 'Not provided'}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <section className="rounded-2xl border border-[#D9E1DF] p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold text-[#0E2A3B]">Documents</h3>
          <button
            className="text-xs font-bold text-[#2E6F5E] underline underline-offset-4"
            type="button"
            onClick={() => goToStep(6)}
          >
            Edit
          </button>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {documentSlots.map((slot) => (
            <li className="flex items-center gap-2 text-sm text-[#43545B]" key={slot.type}>
              <span
                className={`grid size-5 place-items-center rounded-full ${
                  uploads[slot.type] === 'uploaded'
                    ? 'bg-[#2E6F5E] text-white'
                    : 'bg-[#F3E4DF] text-[#A4442C]'
                }`}
              >
                {uploads[slot.type] === 'uploaded' ? <Check size={12} /> : '–'}
              </span>
              {slot.label}
            </li>
          ))}
        </ul>
      </section>
      <div className="rounded-2xl border border-[#C6A15B]/40 bg-[#FBF6EA] p-5 text-sm leading-6 text-[#685A3C]">
        By selecting “Submit application”, you send this file for human review. It does not reserve
        a room or office, create a lease, or trigger a payment.
      </div>
    </div>
  )
}

type StepProps = { data: FormState; update: (name: string, value: FormValue) => void }

function Field({
  label,
  children,
  required,
  help,
  wide,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
  help?: string
  wide?: boolean
}) {
  return (
    <label className={`block text-sm font-semibold text-[#24343B] ${wide ? 'sm:col-span-2' : ''}`}>
      <span>
        {label}
        {required && <span className="ml-1 text-[#B2472E]">*</span>}
      </span>
      {children}
      {help && (
        <span className="mt-2 flex items-start gap-1.5 text-xs font-normal leading-5 text-[#758086]">
          <HelpCircle className="mt-0.5 shrink-0" size={13} /> {help}
        </span>
      )}
    </label>
  )
}

function Input({
  name,
  data,
  update,
  ...props
}: {
  name: string
  data: FormState
  update: StepProps['update']
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      name={name}
      className={inputClass}
      value={String(data[name] ?? '')}
      onChange={(event) => update(name, event.target.value)}
      {...props}
    />
  )
}

function Textarea({
  name,
  data,
  update,
  ...props
}: {
  name: string
  data: FormState
  update: StepProps['update']
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      name={name}
      className={`${inputClass} min-h-24 py-3`}
      value={String(data[name] ?? '')}
      onChange={(event) => update(name, event.target.value)}
      {...props}
    />
  )
}

function Select({
  name,
  data,
  update,
  children,
}: {
  name: string
  data: FormState
  update: StepProps['update']
  children: React.ReactNode
}) {
  return (
    <select
      name={name}
      className={inputClass}
      value={String(data[name] ?? '')}
      onChange={(event) => update(name, event.target.value)}
    >
      {children}
    </select>
  )
}

function Consent({
  name,
  checked,
  update,
  children,
  required,
}: {
  name: string
  checked: boolean
  update: StepProps['update']
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-[#D9E0DE] p-5 text-sm leading-6 text-[#46565D]">
      <input
        className="mt-1 size-5 shrink-0 accent-[#2E6F5E]"
        type="checkbox"
        name={name}
        required={required}
        checked={checked}
        onChange={(event) => update(name, event.target.checked)}
      />
      <span>
        {children}
        {required && <strong className="ml-1 text-[#9C402A]">Required.</strong>}
      </span>
    </label>
  )
}
