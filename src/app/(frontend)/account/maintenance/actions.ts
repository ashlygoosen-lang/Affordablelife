'use server'

import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

export type MaintenanceFormState = { success: boolean; message: string; fieldErrors?: Record<string, string> }

const categories = new Set(['plumbing', 'electrical', 'appliances', 'internet', 'security', 'cleaning', 'furniture', 'other'])
const priorities = new Set(['low', 'normal', 'urgent'])
const text = (formData: FormData, key: string, max: number) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function reportMaintenance(_state: MaintenanceFormState, formData: FormData): Promise<MaintenanceFormState> {
  const user = await appAuth.currentUser()
  if (!user) return { success: false, message: 'Log in again to report an issue.' }
  const title = text(formData, 'title', 140)
  const description = text(formData, 'description', 2000)
  const category = text(formData, 'category', 30)
  const priority = text(formData, 'priority', 10) || 'normal'
  const tenancy = text(formData, 'tenancy', 100)
  const fieldErrors: Record<string, string> = {}
  if (title.length < 4) fieldErrors.title = 'Describe the issue in a few words.'
  if (description.length < 10) fieldErrors.description = 'Add a little more detail so we can send the right person.'
  if (!categories.has(category)) fieldErrors.category = 'Choose a category.'
  if (!priorities.has(priority)) fieldErrors.priority = 'Choose a priority.'
  if (!tenancy) fieldErrors.tenancy = 'Choose your tenancy.'
  if (Object.keys(fieldErrors).length) return { success: false, message: 'Check the highlighted fields.', fieldErrors }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'maintenance-requests',
      overrideAccess: false,
      user,
      data: {
        title,
        description,
        category: category as 'other',
        priority: priority as 'normal',
        tenancy,
        status: 'open',
      },
    })
    return { success: true, message: 'Reported. We will update you here and by email.' }
  } catch (error) {
    console.error('[maintenance]', error)
    return { success: false, message: 'We could not save that request. Please try again or WhatsApp us.' }
  }
}
