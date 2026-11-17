import type { MetadataRoute } from 'next'
import { getVerifiedHomes, getVisibleSuburbs } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const fixed = [
    '',
    '/homes',
    '/personal',
    '/corporate',
    '/interest',
    '/how-it-works',
    '/students',
    '/visitors',
    '/professionals',
    '/businesses',
    '/pricing',
    '/trust',
    '/about',
    '/help',
    '/partners',
    '/privacy',
  ]
  const [homes, suburbs] = await Promise.all([getVerifiedHomes(), getVisibleSuburbs()])
  return [
    ...fixed.map((path) => ({
      url: `${base}${path}`,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),
    ...homes.map((home) => ({
      url: `${base}/homes/${home.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...suburbs.map((suburb) => ({
      url: `${base}/${suburb.city}/${suburb.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
