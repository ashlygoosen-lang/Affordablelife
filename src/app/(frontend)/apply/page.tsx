import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ApplicationForm } from '@/components/application-form'
import { getAllSuburbs, getVerifiedHomes } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tenant application',
  description: 'Complete and securely save your Affordable Life tenant application.',
}

export default async function ApplyPage() {
  const [suburbs, homes] = await Promise.all([getAllSuburbs(), getVerifiedHomes()])
  const suburbOptions = suburbs.map((suburb) => ({
    id: String(suburb.id),
    name: suburb.name,
    city: suburb.city,
    slug: suburb.slug,
  }))
  const homeOptions = homes.map((home) => ({
    id: String(home.id),
    title: home.title,
    suburbSlug: home.suburbSlug,
  }))

  return (
    <div className="min-h-screen bg-[#F5F1E9] pb-20">
      <section className="border-b border-[#D9DED9] bg-[#0E2A3B] text-white">
        <div className="page-container py-12 sm:py-16">
          <p className="eyebrow !text-[#D8BB7A]">Stage 2 · 15–20 minutes</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-6xl">
            Apply for a room or business office.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Save as you go. We ask only the questions and documents relevant to your room or office
            application. No payment is taken during this process.
          </p>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="page-container py-12">
            <div className="min-h-[600px] animate-pulse rounded-3xl bg-white" />
          </div>
        }
      >
        <ApplicationForm suburbs={suburbOptions} homes={homeOptions} />
      </Suspense>
    </div>
  )
}
