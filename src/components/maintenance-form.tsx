'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { reportMaintenance, type MaintenanceFormState } from '@/app/(frontend)/account/maintenance/actions'
import { submitWithoutReset } from '@/lib/submit-without-reset'

const initial: MaintenanceFormState = { success: false, message: '' }

export function MaintenanceForm({ tenancies }: { tenancies: { id: string; label: string }[] }) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, pending] = useActionState(reportMaintenance, initial)
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset()
      router.refresh()
    }
  }, [router, state])
  const error = (name: string) => state.fieldErrors?.[name]
  return (
    <form ref={formRef} onSubmit={submitWithoutReset(action)} className="grid gap-4 sm:grid-cols-2" noValidate>
      {tenancies.length > 1 ? (
        <label className="form-label sm:col-span-2">
          Tenancy
          <select name="tenancy" defaultValue={tenancies[0]?.id}>
            {tenancies.map((tenancy) => (
              <option key={tenancy.id} value={tenancy.id}>{tenancy.label}</option>
            ))}
          </select>
        </label>
      ) : (
        <input type="hidden" name="tenancy" value={tenancies[0]?.id ?? ''} />
      )}
      <label className="form-label sm:col-span-2">
        What needs fixing?
        <input name="title" placeholder="e.g. Kitchen tap is leaking" aria-invalid={Boolean(error('title'))} />
        {error('title') && <span className="field-error">{error('title')}</span>}
      </label>
      <label className="form-label">
        Category
        <select name="category" defaultValue="" aria-invalid={Boolean(error('category'))}>
          <option value="" disabled>Choose a category</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
          <option value="appliances">Appliances</option>
          <option value="internet">Wi-Fi & internet</option>
          <option value="security">Security & access</option>
          <option value="cleaning">Cleaning</option>
          <option value="furniture">Furniture</option>
          <option value="other">Other</option>
        </select>
        {error('category') && <span className="field-error">{error('category')}</span>}
      </label>
      <label className="form-label">
        How urgent is it?
        <select name="priority" defaultValue="normal">
          <option value="low">Can wait</option>
          <option value="normal">Normal</option>
          <option value="urgent">Urgent — safety, water or power</option>
        </select>
      </label>
      <label className="form-label sm:col-span-2">
        Details
        <textarea name="description" rows={4} placeholder="Where is it, when did it start, and is anything damaged?" aria-invalid={Boolean(error('description'))} />
        {error('description') && <span className="field-error">{error('description')}</span>}
      </label>
      {state.message && (
        <p
          className={`flex items-center gap-2 text-sm font-medium sm:col-span-2 ${state.success ? 'text-[#22594B]' : 'text-[#A83E1F]'}`}
          role={state.success ? 'status' : 'alert'}
        >
          {state.success && <CheckCircle2 size={17} />} {state.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button className="primary-button" type="submit" disabled={pending}>
          {pending && <LoaderCircle className="animate-spin" size={17} />} Report issue
        </button>
      </div>
    </form>
  )
}
