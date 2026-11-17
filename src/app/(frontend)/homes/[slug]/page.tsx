import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Flag,
  MapPin,
  MessageCircleMore,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { JoinPanel, SaveButton } from '@/components/discovery-tools'
import { ProgressBar, formatRand } from '@/components/listing-card'
import { findBySlug } from '@/lib/payload'
import { toListing } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const home = await findBySlug('homes', slug)
  return home ? { title: home.title, description: home.description } : {}
}

export default async function HomeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const document = await findBySlug('homes', slug, { depth: 2 })
  if (!document || document.status !== 'verified') notFound()
  const home = toListing(document)
  if (!home) notFound()
  const total = home.roomPrice + home.includedCosts
  return (
    <>
      <section className="bg-[#F6F1E9] py-7">
        <div className="page-container">
          <Link className="text-xs font-bold text-[#5E6B72] hover:text-[#C2502A]" href="/homes">
            ← Back to homes
          </Link>
          <div className="relative mt-5 h-[clamp(320px,48vw,610px)] overflow-hidden rounded-[20px]">
            <Image
              src={home.image.url}
              alt={home.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-[#0E2A3B]/90 px-4 py-2 text-xs font-bold text-white">
              Stand-in property photo · verified before launch
            </span>
          </div>
        </div>
      </section>
      <section className="page-section !pt-14">
        <div className="page-container grid items-start gap-14 lg:grid-cols-[1fr_370px]">
          <article>
            <div className="flex flex-col justify-between gap-5 border-b pb-8 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Verified listing</p>
                <h1 className="display-title !text-[clamp(2.5rem,5vw,4rem)]">{home.title}</h1>
                <p className="mt-4 flex items-center gap-2 text-sm text-[#657179]">
                  <MapPin size={18} />
                  {home.suburb}, {home.city}
                </p>
              </div>
              <SaveButton homeSlug={home.slug} />
            </div>
            <div className="grid gap-3 border-b py-6 sm:grid-cols-3">
              {[
                ['Landlord checked', home.verified],
                ['Address checked', home.verified],
                ['Photos checked', home.verified],
              ].map(([label, verified]) => (
                <span
                  className="flex items-center gap-2 text-sm font-semibold text-[#2E6F5E]"
                  key={label as string}
                >
                  <BadgeCheck />
                  {label as string}
                </span>
              ))}
            </div>
            <section className="content-section">
              <h2>About this home</h2>
              <p>{home.description}</p>
            </section>
            <section className="content-section">
              <h2>Group status</h2>
              <div className="rounded-2xl bg-[#F6F1E9] p-5">
                <ProgressBar
                  filled={home.interested}
                  rooms={home.rooms}
                  status={home.groupStatus}
                />
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="text-[#C2502A]" />
                    Expires{' '}
                    {new Date(home.groupExpiry).toLocaleDateString('en-ZA', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <UsersRound className="text-[#2E6F5E]" />
                    Join alone or with friends
                  </p>
                </div>
              </div>
            </section>
            <section className="content-section">
              <h2>Plain monthly price</h2>
              <div className="cost-lines">
                <div>
                  <span>Room rent</span>
                  <strong>{formatRand(home.roomPrice)}</strong>
                </div>
                <div>
                  <span>Included costs</span>
                  <strong>{formatRand(home.includedCosts)}</strong>
                </div>
                <div>
                  <span>Total per month</span>
                  <strong>{formatRand(total)}</strong>
                </div>
              </div>
              <p className="mt-4 text-xs text-[#657179]">
                Deposit and first month are charged only after the group confirms. Payment options:
                card with 3-D Secure, instant EFT, debit order and supported PayShap.
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-[#A85A32]">
                Illustration only until replaced with signed supplier and finance quotes.
              </p>
            </section>
            <section className="content-section">
              <h2>What is included</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {home.included.map((item) => (
                  <p className="flex items-center gap-2 text-sm" key={item}>
                    <Check className="text-[#2E6F5E]" />
                    {item}
                  </p>
                ))}
              </div>
            </section>
            <section className="content-section">
              <h2>Housemate compatibility</h2>
              <p>
                Before confirmation, the group answers the same questions about sleep times, study
                or work habits, guests, smoking and shared chores. First names and broad profiles
                are shown; identity documents are never public.
              </p>
            </section>
            <section className="content-section">
              <div className="flex flex-wrap gap-3">
                <a className="secondary-button" href={`https://wa.me/27215550142?text=${encodeURIComponent(`Hi, I have a question about ${home.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <MessageCircleMore /> Ask on WhatsApp
                </a>
                <a
                  className="secondary-button"
                  href={`mailto:hello@affordablelife.co.za?subject=${encodeURIComponent(`Report listing: ${home.title}`)}`}
                >
                  <Flag /> Report listing
                </a>
              </div>
            </section>
          </article>
          <JoinPanel
            price={total}
            rooms={home.rooms}
            interested={home.interested}
            status={home.groupStatus}
            expiry={home.groupExpiry}
            homeSlug={home.slug}
            suburbSlug={home.suburbSlug}
          />
        </div>
      </section>
    </>
  )
}
