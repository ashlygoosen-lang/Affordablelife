'use server'

import config from '@payload-config'
import { getPayload } from 'payload'

export type PropertyFormState = {
  success: boolean
  message: string
  fieldErrors?: Record<string, string>
}

const allowedCities = new Set([
  'Cape Town',
  'Stellenbosch',
  'Johannesburg',
  'Pretoria',
  'Durban',
  'Gqeberha',
  'Bloemfontein',
  'East London',
])
const allowedPropertyTypes = new Set(['house', 'flat', 'townhouse', 'loft'])

const text = (formData: FormData, key: string, max = 500) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export async function submitProperty(
  _previousState: PropertyFormState,
  formData: FormData,
): Promise<PropertyFormState> {
  const contactName = text(formData, 'contactName', 120)
  const company = text(formData, 'company', 120)
  const email = text(formData, 'email', 200).toLowerCase()
  const phone = text(formData, 'phone', 40)
  const propertyAddress = text(formData, 'propertyAddress', 300)
  const city = text(formData, 'city', 80)
  const suburb = text(formData, 'suburb', 120)
  const propertyType = text(formData, 'propertyType', 30)
  const description = text(formData, 'description', 2000)
  const rooms = Number(formData.get('rooms'))
  const expectedMonthlyRent = Number(formData.get('expectedMonthlyRent'))

  const fieldErrors: Record<string, string> = {}
  if (contactName.length < 2) fieldErrors.contactName = 'Enter your full name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Enter a valid email address.'
  if (phone.length < 7) fieldErrors.phone = 'Enter a valid phone or WhatsApp number.'
  if (propertyAddress.length < 8) fieldErrors.propertyAddress = 'Enter the full property address.'
  if (!allowedCities.has(city)) fieldErrors.city = 'Choose a supported city.'
  if (suburb.length < 2) fieldErrors.suburb = 'Enter the suburb.'
  if (!allowedPropertyTypes.has(propertyType)) fieldErrors.propertyType = 'Choose a property type.'
  if (!Number.isInteger(rooms) || rooms < 2 || rooms > 30)
    fieldErrors.rooms = 'Enter between 2 and 30 rooms.'
  if (!Number.isFinite(expectedMonthlyRent) || expectedMonthlyRent < 1)
    fieldErrors.expectedMonthlyRent = 'Enter the expected whole-property rent.'
  if (description.length < 30)
    fieldErrors.description = 'Add at least 30 characters about the property.'

  if (Object.keys(fieldErrors).length) {
    return { success: false, message: 'Please correct the highlighted fields.', fieldErrors }
  }

  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'property-submissions',
      overrideAccess: false,
      data: {
        contactName,
        company: company || undefined,
        email,
        phone,
        propertyAddress,
        city: city as
          | 'Cape Town'
          | 'Stellenbosch'
          | 'Johannesburg'
          | 'Pretoria'
          | 'Durban'
          | 'Gqeberha'
          | 'Bloemfontein'
          | 'East London',
        suburb,
        propertyType: propertyType as 'house' | 'flat' | 'townhouse' | 'loft',
        rooms,
        expectedMonthlyRent,
        description,
      },
    })
    return {
      success: true,
      message:
        'Your property has been submitted for verification. We will reply within one working day.',
    }
  } catch (error) {
    console.error('[property]', error)
return {
      success: false,
      message:
        'We could not submit your property right now. Please try again or contact us on WhatsApp.',
    }
  }
}
