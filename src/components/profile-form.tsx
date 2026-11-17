'use client'

import { CheckCircle2, LoaderCircle, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { updateProfile, type AuthFormState } from '@/app/(frontend)/account/actions'
import { submitWithoutReset } from '@/lib/submit-without-reset'

const initialAuthState: AuthFormState = { success: false, message: '' }

export function ProfileForm({
  name,
  email,
  phone,
  accountType,
}: {
  name: string
  email: string
  phone?: string | null
  accountType?: string | null
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(updateProfile, initialAuthState)
  useEffect(() => {
    if (state.success) router.refresh()
  }, [router, state.success])
  return (
    <form onSubmit={submitWithoutReset(action)} className="rounded-3xl border border-[#DCE3E1] bg-white p-7" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="form-label">
          Full name
          <input name="name" defaultValue={name} aria-invalid={Boolean(state.fieldErrors?.name)} />
          {state.fieldErrors?.name && <span className="field-error">{state.fieldErrors.name}</span>}
        </label>
        <label className="form-label">
          Email address
          <input value={email} disabled />
          <span className="text-[11px] font-normal text-[#748086]">
            Contact support to change the login email.
          </span>
        </label>
        <label className="form-label">
          Mobile number
          <input name="phone" type="tel" defaultValue={phone ?? ''} />
        </label>
        <label className="form-label">
          Account type
          <select name="accountType" defaultValue={accountType ?? 'personal'}>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="corporate">Corporate</option>
          </select>
        </label>
      </div>
      {state.message && (
        <p
          className={`mt-5 flex items-center gap-2 rounded-xl p-3 text-sm ${
            state.success ? 'bg-[#E8F3EE] text-[#285C4E]' : 'bg-[#FFF0EB] text-[#963E28]'
          }`}
          role={state.success ? 'status' : 'alert'}
        >
          {state.success && <CheckCircle2 size={17} />} {state.message}
        </p>
      )}
      <button className="primary-button mt-6" disabled={pending} type="submit">
        {pending ? <LoaderCircle className="animate-spin" /> : <Save size={18} />} Save profile
      </button>
    </form>
  )
}
