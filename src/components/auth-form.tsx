'use client'

import { ArrowRight, Building2, LoaderCircle, LockKeyhole, UserRound } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActionState, useEffect, useState } from 'react'
import { loginUser, registerUser, type AuthFormState } from '@/app/(frontend)/account/actions'
import { submitWithoutReset } from '@/lib/submit-without-reset'

const initialAuthState: AuthFormState = { success: false, message: '' }

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'register'>(
    searchParams.get('mode') === 'register' ? 'register' : 'login',
  )
  const [loginState, loginAction, loginPending] = useActionState(loginUser, initialAuthState)
  const [registerState, registerAction, registerPending] = useActionState(
    registerUser,
    initialAuthState,
  )
  const state = mode === 'login' ? loginState : registerState

  useEffect(() => {
    if (!state.success) return
    const destination = searchParams.get('next')
    router.push(destination?.startsWith('/account') ? destination : '/account/interests')
    router.refresh()
  }, [router, searchParams, state.success])

  const error = (name: string) => state.fieldErrors?.[name]
  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_20px_70px_rgba(14,42,59,.13)]">
      <div className="grid grid-cols-2 border-b border-[#E0E6E5] bg-[#F5F2EA] p-2">
        <button
          className={`rounded-xl px-4 py-3 text-sm font-bold ${
            mode === 'login' ? 'bg-white text-[#0E2A3B] shadow-sm' : 'text-[#68757A]'
          }`}
          type="button"
          onClick={() => setMode('login')}
        >
          Log in
        </button>
        <button
          className={`rounded-xl px-4 py-3 text-sm font-bold ${
            mode === 'register' ? 'bg-white text-[#0E2A3B] shadow-sm' : 'text-[#68757A]'
          }`}
          type="button"
          onClick={() => setMode('register')}
        >
          Create account
        </button>
      </div>

      {mode === 'login' ? (
        <form onSubmit={submitWithoutReset(loginAction)} className="space-y-5 p-6 sm:p-8" noValidate>
          <input type="hidden" name="next" value={searchParams.get('next') ?? ''} />
          <AuthHeading
            icon={<LockKeyhole />}
            title="Welcome back"
            text="Access your applications and account details."
          />
          <AuthField label="Email address" name="email" type="email" error={error('email')} />
          <AuthField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            error={error('password')}
          />
          {state.message && (
            <p
              className={`rounded-xl p-3 text-sm ${
                state.success ? 'bg-[#E8F3EE] text-[#285C4E]' : 'bg-[#FFF0EB] text-[#963E28]'
              }`}
              role={state.success ? 'status' : 'alert'}
            >
              {state.message}
            </p>
          )}
          <button className="primary-button w-full" disabled={loginPending} type="submit">
            {loginPending ? <LoaderCircle className="animate-spin" /> : <LockKeyhole size={18} />}
            Log in
          </button>
          <a
            className="block text-center text-xs font-semibold text-[#2E6F5E] underline underline-offset-4"
            href="mailto:hello@affordablelife.co.za?subject=Account access help"
          >
            Need help accessing your account?
          </a>
        </form>
      ) : (
        <form onSubmit={submitWithoutReset(registerAction)} className="space-y-5 p-6 sm:p-8" noValidate>
          <input type="hidden" name="next" value={searchParams.get('next') ?? ''} />
          <AuthHeading
            icon={<UserRound />}
            title="Create your account"
            text="Use one account for personal, business or corporate applications."
          />
          <AuthField label="Full name" name="name" error={error('name')} />
          <AuthField label="Email address" name="email" type="email" error={error('email')} />
          <AuthField label="Mobile number" name="phone" type="tel" />
          <label className="form-label">
            Account type
            <select
              name="accountType"
              defaultValue={
                ['personal', 'business', 'corporate'].includes(searchParams.get('type') ?? '')
                  ? (searchParams.get('type') ?? 'personal')
                  : 'personal'
              }
            >
              <option value="personal">Personal</option>
              <option value="business">Business</option>
              <option value="corporate">Corporate</option>
            </select>
          </label>
          <AuthField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            error={error('password')}
            hint="At least 12 characters."
          />
          <AuthField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            error={error('confirmPassword')}
          />
          {state.message && (
            <p
              className={`rounded-xl p-3 text-sm ${
                state.success ? 'bg-[#E8F3EE] text-[#285C4E]' : 'bg-[#FFF0EB] text-[#963E28]'
              }`}
              role={state.success ? 'status' : 'alert'}
            >
              {state.message}
            </p>
          )}
          <button className="primary-button w-full" disabled={registerPending} type="submit">
            {registerPending ? <LoaderCircle className="animate-spin" /> : <Building2 size={18} />}
            Create account <ArrowRight size={18} />
          </button>
          <p className="text-center text-[11px] leading-5 text-[#748086]">
            Creating an account does not submit an application or trigger a payment.
          </p>
        </form>
      )}
    </div>
  )
}

function AuthHeading({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="pb-2 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#E7F1ED] text-[#2E6F5E]">
        {icon}
      </span>
      <h2 className="mt-4 font-serif text-3xl font-semibold text-[#0E2A3B]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#68757A]">{text}</p>
    </div>
  )
}

function AuthField({
  label,
  name,
  error,
  hint,
  ...props
}: {
  label: string
  name: string
  error?: string
  hint?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="form-label">
      {label}
      <input
        name={name}
        aria-invalid={Boolean(error)}
        autoComplete={props.type === 'email' ? 'email' : undefined}
        {...props}
      />
      {hint && <span className="text-[11px] font-normal text-[#748086]">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}
