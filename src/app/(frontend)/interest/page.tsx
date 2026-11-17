import type { Metadata } from 'next'
import { Suspense } from 'react'
import { InterestForm } from '@/components/interest-form'
import { PageHero } from '@/components/marketing-pages'
import { getAllSuburbs, getVerifiedHomes } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Register interest',
  description: 'Tell Affordable Life where and when you need a room or business office.',
}

export default async function InterestPage() {
  const [suburbs, homes] = await Promise.all([getAllSuburbs(), getVerifiedHomes()])
  const suburbOptions = suburbs.map((suburb) => ({
    id: String(suburb.id),
    slug: suburb.slug,
    name: suburb.name,
    city: suburb.city,
    visible: suburb.launchStatus === 'visible',
  }))
  const homeOptions = homes.map((home) => ({
    id: home.id,
    slug: home.slug,
    title: home.title,
    suburbSlug: home.suburbSlug,
  }))
  return (
    <>
      <PageHero
        eyebrow="Demand comes first"
        title="Tell us what space you need."
        text="Register your interest in a room or business office, then complete the guided application and upload the relevant documents. It is free, private and does not reserve a space."
      />
      <section className="page-section">
        <div className="page-container grid items-start gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="eyebrow">One predictable price</p>
            <h2 className="section-title">
              Rent, connectivity and essential services planned together.
            </h2>
            <div className="mt-8 space-y-5 text-sm leading-7 text-[#5F6D74]">
              <p>
                <strong className="text-[#14202B]">Student Plus:</strong> room, Wi-Fi, cleaning,
                security, parking, meals and campus transport.
              </p>
              <p>
                <strong className="text-[#14202B]">Young Professional:</strong> room, Wi-Fi,
                cleaning, security and parking, with meals and transport as optional extras.
              </p>
              <p>
                <strong className="text-[#14202B]">Visitor and Short Stay:</strong> room, Wi-Fi,
                cleaning and security for nightly or weekly stays.
              </p>
              <p>
                <strong className="text-[#14202B]">Business Office:</strong> private or flexible
                workspace with connectivity and core property services quoted for the team.
              </p>
            </div>
            <div className="mt-8 rounded-2xl border border-[#C6A15B]/40 bg-[#F6F1E9] p-5 text-sm leading-6 text-[#5F6D74]">
              <strong className="block text-[#0E2A3B]">
                Reservation deposits are not enabled yet.
              </strong>
              Deposit, refund and trust-account terms require legal confirmation before any payment
              is collected.
            </div>
          </div>
          <Suspense
            fallback={
              <div className="min-h-[620px] rounded-[20px] bg-white p-8 shadow-xl">
                Loading interest form…
              </div>
            }
          >
            <div>
              <div className="mb-4 rounded-2xl border border-[#2E6F5E]/20 bg-[#EAF4F0] p-4 text-sm leading-6 text-[#315E51]">
                <strong className="block text-[#21483D]">Stage 1 of 2 · about one minute</strong>
                After you register interest, the full self-service application opens automatically.
                Complete each step, upload the requested documents, review, then submit.
              </div>
              <InterestForm suburbs={suburbOptions} homes={homeOptions} />
            </div>
          </Suspense>
        </div>
      </section>
    </>
  )
}
