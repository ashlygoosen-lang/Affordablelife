'use client'

import { useActionState } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import { submitProperty, type PropertyFormState } from '@/app/(frontend)/partners/actions'
import { submitWithoutReset } from '@/lib/submit-without-reset'

const initialState: PropertyFormState = { success: false, message: '' }

export function PropertyForm() {
  const [state, action, pending] = useActionState(submitProperty, initialState)
  if (state.success) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center text-[#14202B]" role="status">
        <CheckCircle2 className="mx-auto text-[#2E6F5E]" size={48} />
        <h2 className="mt-4 font-serif text-3xl font-semibold">Property received.</h2>
        <p className="mt-3 leading-7 text-[#5E6B72]">{state.message}</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#E6F0EC] px-4 py-2 text-xs font-semibold text-[#2E6F5E]">
          <ShieldCheck size={16} /> It will not go live until verified.
        </p>
      </div>
    )
  }
  const error = (name: string) => state.fieldErrors?.[name]
  return (
    <form
      onSubmit={submitWithoutReset(action)}
      className="grid gap-4 rounded-2xl bg-white p-6 text-[#14202B] shadow-2xl sm:grid-cols-2"
      noValidate
    >
      <FormField label="Your name" name="contactName" error={error('contactName')} required />
      <FormField label="Company (optional)" name="company" />
      <FormField label="Email" name="email" error={error('email')} type="email" required />
      <FormField
        label="Phone or WhatsApp"
        name="phone"
        error={error('phone')}
        type="tel"
        required
      />
      <FormField
        label="Full property address"
        name="propertyAddress"
        error={error('propertyAddress')}
        required
        wide
      />
      <label className="form-label">
        City
        <select name="city" required aria-invalid={Boolean(error('city'))}>
          <option value="">Choose a city</option>
          {[
            'Cape Town',
            'Stellenbosch',
            'Johannesburg',
            'Pretoria',
            'Durban',
            'Gqeberha',
            'Bloemfontein',
            'East London',
          ].map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>
        {error('city') && <span className="field-error">{error('city')}</span>}
      </label>
      <FormField label="Suburb" name="suburb" error={error('suburb')} required />
      <label className="form-label">
        Property type
        <select name="propertyType" required aria-invalid={Boolean(error('propertyType'))}>
          <option value="">Choose a type</option>
          <option value="house">House</option>
          <option value="flat">Flat</option>
          <option value="townhouse">Townhouse</option>
          <option value="loft">Loft</option>
        </select>
        {error('propertyType') && <span className="field-error">{error('propertyType')}</span>}
      </label>
      <FormField
        label="Number of rooms"
        name="rooms"
        error={error('rooms')}
        type="number"
        min="2"
        max="30"
        required
      />
      <FormField
        label="Expected whole-property rent"
        name="expectedMonthlyRent"
        error={error('expectedMonthlyRent')}
        type="number"
        min="1"
        required
      />
      <label className="form-label sm:col-span-2">
        Tell us about the property
        <textarea
          name="description"
          rows={5}
          required
          aria-invalid={Boolean(error('description'))}
          placeholder="Condition, furnishings, security, transport and when it is available."
        />
        {error('description') && <span className="field-error">{error('description')}</span>}
      </label>
      {state.message && (
        <p className="sm:col-span-2 text-sm font-semibold text-[#A83E1F]" role="alert">
          {state.message}
        </p>
      )}
      <button className="primary-button sm:col-span-2" disabled={pending} type="submit">
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" /> Submitting securely…
          </>
        ) : (
          <>
            Submit property for verification <ArrowRight />
          </>
        )}
      </button>
      <p className="sm:col-span-2 text-center text-[11px] leading-5 text-[#69757B]">
        By submitting, you confirm that you may list this property. Our team checks the landlord,
        address and photos before publication.
      </p>
    </form>
  )
}

function FormField({
  label,
  name,
  error,
  wide,
  ...props
}: {
  label: string
  name: string
  error?: string
  wide?: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`form-label ${wide ? 'sm:col-span-2' : ''}`}>
      {label}
      <input name={name} aria-invalid={Boolean(error)} {...props} />
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
