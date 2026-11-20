'use server'

import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { appAuth } from '@/lib/app-auth'

export type AuthFormState = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
}

const value = (formData: FormData, key: string, max = 200) => {
  const field = formData.get(key)
  return typeof field === 'string' ? field.trim().slice(0, max) : ''
}
const secret = (formData: FormData, key: string, max = 200) => {
  const field = formData.get(key)
  return typeof field === 'string' ? field.slice(0, max) : ''
}

// Only same-site member/application paths are allowed as post-login destinations.
const safeDestination = (formData: FormData) => {
  const next = value(formData, 'next', 300)
  return /^\/(account|apply|interest)(\/|\?|$)/.test(next) ? next : '/account/interests'
}

const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export async function loginUser(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = value(formData, 'email').toLowerCase()
  const password = secret(formData, 'password')
  const fieldErrors: Record<string, string> = {}
  if (!validEmail(email)) fieldErrors.email = 'Enter a valid email address.'
  if (!password) fieldErrors.password = 'Enter your password.'
  if (Object.keys(fieldErrors).length) {
    return { success: false, message: 'Check the highlighted fields.', fieldErrors }
  }

  try {
    await appAuth.login(email, password)
  } catch {
    return {
      success: false,
      message: 'The email or password is incorrect.',
    }
  }
  // Redirect on the server: the session cookie re-renders /account, which would
  // otherwise unmount the form before a client-side redirect could run.
  redirect(safeDestination(formData))
}

export async function registerUser(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const name = value(formData, 'name', 120)
  const email = value(formData, 'email').toLowerCase()
  const phone = value(formData, 'phone', 40)
  const password = secret(formData, 'password')
  const confirmPassword = secret(formData, 'confirmPassword')
  const requestedType = value(formData, 'accountType', 20)
  const accountType = ['personal', 'business', 'corporate'].includes(requestedType)
    ? requestedType
    : 'personal'
  const fieldErrors: Record<string, string> = {}
  if (name.length < 2) fieldErrors.name = 'Enter your name.'
  if (!validEmail(email)) fieldErrors.email = 'Enter a valid email address.'
  if (password.length < 12) fieldErrors.password = 'Use at least 12 characters for your password.'
  if (password !== confirmPassword) fieldErrors.confirmPassword = 'The passwords do not match.'
  if (Object.keys(fieldErrors).length) {
    return { success: false, message: 'Check the highlighted fields.', fieldErrors }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'users',
      overrideAccess: false,
      data: {
        name,
        email,
        phone: phone || undefined,
        password,
        role: 'tenant',
        accountType: accountType as 'personal' | 'business' | 'corporate',
      },
    })
    await appAuth.login(email, password)
  } catch (error) {
    console.error('[account]', error)
    return {
      success: false,
      message: 'We could not create that account. The email may already be registered.',
    }
  }
  redirect(safeDestination(formData))
}

export async function logoutUser() {
  await appAuth.logout()
  redirect('/account')
}

export async function updateProfile(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await appAuth.currentUser()
  if (!user) return { success: false, message: 'Log in again to update your profile.' }
  const name = value(formData, 'name', 120)
  const phone = value(formData, 'phone', 40)
  const requestedType = value(formData, 'accountType', 20)
  const accountType = ['personal', 'business', 'corporate'].includes(requestedType)
    ? requestedType
    : 'personal'
  if (name.length < 2) {
    return {
      success: false,
      message: 'Check the highlighted fields.',
      fieldErrors: { name: 'Enter your name.' },
    }
  }
  try {
    const payload = await getPayload({ config })
    await payload.update({
      collection: 'users',
      id: user.id,
      overrideAccess: false,
      user,
      data: {
        name,
        phone: phone || undefined,
        accountType: accountType as 'personal' | 'business' | 'corporate',
      },
    })
    return { success: true, message: 'Profile updated.' }
  } catch (error) {
    console.error('[account]', error)
return { success: false, message: 'We could not update your profile right now.' }
  }
}
