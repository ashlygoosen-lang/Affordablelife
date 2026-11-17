import 'server-only'

import type { Home, Media, Suburb } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

export type ListingCardData = {
  id: string
  slug: string
  title: string
  suburb: string
  suburbSlug: string
  city: string
  propertyType: string
  roomPrice: number
  includedCosts: number
  rooms: number
  interested: number
  groupStatus: string
  groupExpiry: string
  moveIn: string
  features: string[]
  included: string[]
  image: { url: string; alt: string; width: number; height: number }
  verified: boolean
  description: string
}

const cityNames: Record<string, string> = {
  'cape-town': 'Cape Town',
  stellenbosch: 'Stellenbosch',
  johannesburg: 'Johannesburg',
  pretoria: 'Pretoria',
  durban: 'Durban',
  gqeberha: 'Gqeberha',
  bloemfontein: 'Bloemfontein',
  'east-london': 'East London',
}

export function toListing(home: Home): ListingCardData | null {
  const suburb = typeof home.suburb === 'object' ? (home.suburb as Suburb) : null
  const image = typeof home.coverImage === 'object' ? (home.coverImage as Media) : null
  if (!suburb || !image?.url || !home.slug) return null

  return {
    id: String(home.id),
    slug: home.slug,
    title: home.title,
    suburb: suburb.name,
    suburbSlug: suburb.slug,
    city: cityNames[suburb.city] ?? suburb.city,
    propertyType: home.propertyType,
    roomPrice: home.roomPrice,
    includedCosts: home.includedCosts ?? 0,
    rooms: home.rooms,
    interested: home.interested ?? 0,
    groupStatus: home.groupStatus,
    groupExpiry: home.groupExpiry,
    moveIn: home.moveIn,
    features: (home.features ?? []).map((item) => item.label),
    included: (home.included ?? []).map((item) => item.label),
    image: {
      // Keep image URLs same-origin relative so next/image can optimise them.
      url: image.url.replace(/^https?:\/\/[^/]+/, ''),
      alt: image.alt,
      width: image.width ?? 1600,
      height: image.height ?? 1067,
    },
    verified: Boolean(home.verifiedAddress && home.verifiedLandlord && home.photosChecked),
    description: home.description,
  }
}

export async function getVerifiedHomes() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'homes',
    overrideAccess: false,
    depth: 2,
    limit: 100,
    sort: 'roomPrice',
  })
  return result.docs.map(toListing).filter((item): item is ListingCardData => Boolean(item))
}

export async function getVisibleSuburbs() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'suburbs',
    overrideAccess: false,
    depth: 0,
    limit: 100,
    sort: 'name',
    where: { launchStatus: { equals: 'visible' } },
  })
  return result.docs
}

export async function getAllSuburbs() {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'suburbs',
    overrideAccess: false,
    depth: 0,
    limit: 100,
    sort: ['city', 'name'],
  })
  return result.docs
}
