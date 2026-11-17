import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Clock3, MapPin, ShieldCheck } from 'lucide-react'
import { ListingCard } from '@/components/listing-card'
import { findBySlug } from '@/lib/payload'
import { getVerifiedHomes, getVisibleSuburbs } from '@/lib/listings'
import { DemandProgress } from '@/components/demand-progress'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; suburb: string }>
}): Promise<Metadata> {
  const { city, suburb: slug } = await params
  const suburb = await findBySlug('suburbs', slug)
  return suburb && suburb.city === city
    ? { title: `Shared homes in ${suburb.name}`, description: suburb.summary }
    : {}
}

export default async function SuburbPage({
  params,
}: {
  params: Promise<{ city: string; suburb: string }>
}) {
  const { city, suburb: slug } = await params
  const suburb = await findBySlug('suburbs', slug)
  if (!suburb || suburb.city !== city || suburb.launchStatus !== 'visible') notFound()
  const homes = (await getVerifiedHomes()).filter((home) => home.suburbSlug === suburb.slug)
  return (
    <>
      <section className="bg-[#0E2A3B] py-24 text-white">
        <div className="page-container">
          <p className="eyebrow-light">{city.replace('-', ' ')}</p>
          <h1 className="display-title !text-white">Shared homes in {suburb.name}.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/65">{suburb.summary}</p>
          <p className="mt-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-[#E5C079]">
            Illustrated room range: {suburb.priceRange}
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-wider text-white/50">
            Illustration only · general planning knowledge · November 2026
          </p>
        </div>
      </section>
      <section className="-mt-10 relative z-10">
        <div className="page-container grid items-stretch gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <DemandProgress suburbSlug={suburb.slug} suburbName={suburb.name} />
          <div className="rounded-[20px] bg-white p-6 shadow-xl">
            <p className="eyebrow">Why demand comes first</p>
            <h2 className="font-serif text-3xl font-semibold text-[#0E2A3B]">
              We secure homes after demand is proven.
            </h2>
            <p className="mt-4 leading-7 text-[#5F6D74]">
              The public room count helps prevent buying ahead of demand. A suburb enters purchase
              review at 70% of a planned 24-room cluster.
            </p>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="page-container">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="feature-card">
              <Clock3 className="text-[#2E6F5E]" />
              <h2 className="mt-8 font-serif text-2xl">Transport</h2>
              <p className="mt-3 leading-7 text-[#657179]">{suburb.transport}</p>
              <p className="mt-4 text-[10px] uppercase tracking-wider text-[#8A9499]">
                Source: planning assumptions · November 2026
              </p>
            </div>
            <div className="feature-card">
              <ShieldCheck className="text-[#2E6F5E]" />
              <h2 className="mt-8 font-serif text-2xl">Safety note</h2>
              <p className="mt-3 leading-7 text-[#657179]">{suburb.safetyNote}</p>
              <p className="mt-4 text-[10px] uppercase tracking-wider text-[#8A9499]">
                Source: general knowledge · November 2026 · verify locally
              </p>
            </div>
            <div className="feature-card">
              <MapPin className="text-[#2E6F5E]" />
              <h2 className="mt-8 font-serif text-2xl">Nearby hubs</h2>
              <p className="mt-3 leading-7 text-[#657179]">
                {(suburb.nearbyHubs ?? []).map((hub) => hub.name).join(' · ')}
              </p>
            </div>
          </div>
          <div className="mt-16">
            <h2 className="section-title">Verified homes forming groups.</h2>
            {homes.length ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {homes.map((home) => (
                  <ListingCard home={home} key={home.slug} />
                ))}
              </div>
            ) : (
              <p className="mt-6 rounded-2xl bg-[#F6F1E9] p-8 text-[#657179]">
                No verified homes are visible in this suburb yet. We hide suburb inventory until
                verification is complete.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
