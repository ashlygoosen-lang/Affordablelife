'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import { registerInterest, type InterestFormState } from '@/app/(frontend)/interest/actions'
import { submitWithoutReset } from '@/lib/submit-without-reset'

type SuburbOption = { id: string; slug: string; name: string; city: string; visible: boolean }
type HomeOption = { id: string; slug: string; title: string; suburbSlug: string }

const initialState: InterestFormState = { success: false, message: '' }

const cityLabels: Record<string, string> = {
  'cape-town': 'Cape Town',
  stellenbosch: 'Stellenbosch',
  johannesburg: 'Johannesburg',
  pretoria: 'Pretoria',
  durban: 'Durban',
  gqeberha: 'Gqeberha',
  bloemfontein: 'Bloemfontein',
  'east-london': 'East London',
}

export function InterestForm({ suburbs, homes }: { suburbs: SuburbOption[]; homes: HomeOption[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedSuburb = searchParams.get('suburb') ?? ''
  const requestedHome = searchParams.get('home') ?? ''
  const requestedTier = searchParams.get('tier') ?? ''
  const requestedRooms = /^\d{1,3}$/.test(searchParams.get('rooms') ?? '')
    ? (searchParams.get('rooms') as string)
    : '1'
  const defaultSuburb = suburbs.find((suburb) => suburb.slug === requestedSuburb)
  const defaultHome = homes.find((home) => home.slug === requestedHome)
  const [selectedSuburbID, setSelectedSuburbID] = useState(defaultSuburb?.id ?? '')
  const [selectedTier, setSelectedTier] = useState(requestedTier)
  const [state, action, pending] = useActionState(registerInterest, initialState)
  const grouped = useMemo(() => {
    return suburbs.reduce<Record<string, SuburbOption[]>>((result, suburb) => {
      result[suburb.city] = [...(result[suburb.city] ?? []), suburb]
      return result
    }, {})
  }, [suburbs])
  const selectedSuburb = suburbs.find((suburb) => suburb.id === selectedSuburbID)
  const availableHomes = homes.filter((home) => home.suburbSlug === selectedSuburb?.slug)

  useEffect(() => {
    if (state.success && state.interestId) {
      if (state.applicationId && state.resumeToken) {
        const prefill = sessionStorage.getItem('affordable-life-stage-one')
        localStorage.setItem(
          'affordable-life-application',
          JSON.stringify({
            data: prefill ? JSON.parse(prefill) : undefined,
            applicationId: state.applicationId,
            resumeToken: state.resumeToken,
            step: 0,
            uploads: {},
          }),
        )
      }
      router.push(`/apply?interest=${encodeURIComponent(state.interestId)}`)
    }
  }, [router, state.applicationId, state.interestId, state.resumeToken, state.success])

  if (state.success) {
    return (
      <div className="rounded-[20px] bg-white p-8 text-center shadow-xl" role="status">
        <CheckCircle2 className="mx-auto text-[#2E6F5E]" size={52} />
        <h2 className="mt-5 font-serif text-3xl font-semibold">Interest registered.</h2>
        <p className="mt-3 leading-7 text-[#5F6D74]">
          {state.message} Opening your full application…
        </p>
        <a
          className="primary-button mt-6"
          href={
            state.interestId ? `/apply?interest=${encodeURIComponent(state.interestId)}` : '/apply'
          }
        >
          Continue application
        </a>
      </div>
    )
  }

  const error = (name: string) => state.fieldErrors?.[name]
  return (
    <form
      onSubmit={submitWithoutReset(action, (data) => {
        sessionStorage.setItem(
          'affordable-life-stage-one',
          JSON.stringify({
            applicantName: data.get('contactName'),
            applicantEmail: data.get('email'),
            applicantPhone: data.get('phone'),
            institutionOrEmployer: data.get('institutionOrEmployer'),
            ...(data.get('tier') === 'business-office'
              ? { companyName: data.get('institutionOrEmployer') }
              : {}),
            preferredSuburb: data.get('suburb'),
            preferredHome: data.get('home'),
            tier: data.get('tier'),
            moveInDate: `${data.get('moveInMonth')}-01`,
            applicationKind: data.get('tier') === 'business-office' ? 'office' : 'accommodation',
            applicantType: data.get('tier') === 'business-office' ? 'business' : '',
            payerType:
              data.get('tier') === 'business-office'
                ? 'business-company'
                : data.get('sponsorPays') === 'on'
                  ? 'parent'
                  : 'self',
          }),
        )
      })}
      className="grid gap-4 rounded-[20px] bg-white p-6 shadow-[0_18px_50px_rgba(14,42,59,.12)] sm:grid-cols-2"
      noValidate
    >
      <FormField label="Full name" name="contactName" error={error('contactName')} required />
      <FormField label="Email address" name="email" type="email" error={error('email')} required />
      <FormField
        label="Phone or WhatsApp"
        name="phone"
        type="tel"
        error={error('phone')}
        required
      />
      <FormField
        label={
          selectedTier === 'business-office' ? 'Company or organisation' : 'Institution or employer'
        }
        name="institutionOrEmployer"
        error={error('institutionOrEmployer')}
        required
      />
      <label className="form-label sm:col-span-2">
        Preferred suburb
        <select
          name="suburb"
          value={selectedSuburbID}
          onChange={(event) => setSelectedSuburbID(event.target.value)}
          required
          aria-invalid={Boolean(error('suburb'))}
        >
          <option value="">Choose a suburb</option>
          {Object.entries(grouped).map(([city, options]) => (
            <optgroup label={cityLabels[city] ?? city} key={city}>
              {options.map((suburb) => (
                <option value={suburb.id} key={suburb.id}>
                  {suburb.name}
                  {suburb.visible ? '' : ' — gathering demand'}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {error('suburb') && <span className="field-error">{error('suburb')}</span>}
      </label>
      {selectedTier !== 'business-office' && (
        <label className="form-label sm:col-span-2">
          Specific verified home (optional)
          <select name="home" defaultValue={defaultHome?.id ?? ''}>
            <option value="">Any suitable home in the suburb</option>
            {availableHomes.map((home) => (
              <option value={home.id} key={home.slug}>
                {home.title}
              </option>
            ))}
          </select>
          <span className="text-[11px] font-normal text-[#68747A]">
            Choose a home only if you came from a verified listing.
          </span>
        </label>
      )}
      <label className="form-label">
        Customer tier
        <select
          name="tier"
          required
          value={selectedTier}
          onChange={(event) => setSelectedTier(event.target.value)}
          aria-invalid={Boolean(error('tier'))}
        >
          <option value="">Choose a tier</option>
          <option value="student-plus">Student Plus</option>
          <option value="young-professional">Young Professional</option>
          <option value="visitor-short-stay">Visitor and Short Stay</option>
          <option value="business-office">Business Office Rental</option>
        </select>
        {error('tier') && <span className="field-error">{error('tier')}</span>}
      </label>
      <FormField
        label="Move-in month"
        name="moveInMonth"
        type="month"
        error={error('moveInMonth')}
        required
      />
      <FormField
        label="Monthly budget"
        name="monthlyBudget"
        type="number"
        min="1000"
        max="100000"
        placeholder="R"
        error={error('monthlyBudget')}
        required
      />
      <FormField
        label={selectedTier === 'business-office' ? 'Office seats needed' : 'Rooms needed'}
        name="roomsRequested"
        type="number"
        min="1"
        max={selectedTier === 'business-office' ? '100' : '12'}
        defaultValue={requestedRooms}
        error={error('roomsRequested')}
        required
      />
      {selectedTier !== 'business-office' && (
        <label className="flex min-h-12 items-center gap-3 rounded-xl bg-[#F6F1E9] p-4 text-sm sm:col-span-2">
          <input type="checkbox" name="sponsorPays" className="size-5 accent-[#2E6F5E]" />
          A parent, employer, bursary or sponsor may pay.
        </label>
      )}
      <label className="flex min-h-12 items-start gap-3 rounded-xl border border-[#D8E0E2] p-4 text-sm leading-6 sm:col-span-2">
        <input
          type="checkbox"
          name="consentToContact"
          className="mt-1 size-5 accent-[#2E6F5E]"
          required
        />
        <span>
          I consent to Affordable Life storing these details and contacting me about this suburb,
          verified homes and availability.
        </span>
      </label>
      {error('consentToContact') && (
        <span className="field-error sm:col-span-2">{error('consentToContact')}</span>
      )}
      {state.message && (
        <p className="text-sm font-semibold text-[#A83E1F] sm:col-span-2" role="alert">
          {state.message}
        </p>
      )}
      <button className="primary-button sm:col-span-2" type="submit" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" /> Registering…
          </>
        ) : (
          'Register free interest'
        )}
      </button>
      <p className="flex items-center justify-center gap-2 text-center text-[11px] text-[#68747A] sm:col-span-2">
        <ShieldCheck size={15} /> No payment is taken. Personal details are not shown publicly.
      </p>
    </form>
  )
}

function FormField({
  label,
  name,
  error,
  ...props
}: { label: string; name: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="form-label">
      {label}
      <input name={name} aria-invalid={Boolean(error)} {...props} />
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
