import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  GraduationCap,
  Handshake,
  KeyRound,
  MapPinned,
  Search,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'
import { CostCalculator, SuburbQuiz } from '@/components/discovery-tools'
import { ListingCard } from '@/components/listing-card'
import { getVerifiedHomes } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const homes = await getVerifiedHomes()
  const hero = homes[0]
  return (
    <>
      <section className="relative min-h-[730px] overflow-hidden bg-[#0E2A3B] text-white">
        {hero && (
          <Image
            src={hero.image.url}
            alt={hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-55"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071F2C] via-[#071F2C]/85 to-transparent" />
        <div className="page-container relative flex min-h-[730px] flex-col justify-center pb-28">
          <p className="eyebrow-light">Personal · Business · Corporate</p>
          <h1 className="max-w-3xl font-serif text-[clamp(3.2rem,7vw,5.4rem)] font-medium leading-[.96] tracking-[-.04em]">
            The right space.
            <br />
            <em className="text-[#E4C27E]">The costs made clear.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
            Find a room, request a business office or coordinate a corporate requirement through one
            guided path from interest to review.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="primary-button" href="/interest">
              Find your space <ArrowRight />
            </Link>
            <Link
              className="secondary-button !border-white/30 !bg-white/10 !text-white"
              href="/homes"
            >
              Browse personal homes
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <span className="hero-badge">
              <ShieldCheck /> No deposit collected yet
            </span>
            <span className="hero-badge">
              <BadgeCheck /> Guided online application
            </span>
          </div>
        </div>
      </section>

      <section className="-mt-16 relative z-10">
        <form
          action="/homes"
          className="page-container grid gap-2 rounded-[20px] bg-white p-3 shadow-[0_24px_60px_rgba(14,42,59,.2)] md:grid-cols-[1.3fr_1fr_1fr_auto]"
        >
          <label className="search-field">
            Where
            <input name="q" defaultValue="Cape Town" aria-label="City or area" />
          </label>
          <label className="search-field">
            Move-in
            <input name="moveIn" type="month" aria-label="Move-in month" />
          </label>
          <label className="search-field">
            Monthly budget
            <input
              name="budget"
              type="number"
              min="1000"
              step="250"
              placeholder="Up to R8,000"
              aria-label="Monthly budget"
            />
          </label>
          <button className="primary-button" type="submit">
            <Search /> Search
          </button>
        </form>
      </section>

      <section className="page-section">
        <div className="page-container">
          <div className="section-heading">
            <p className="eyebrow">Simple by design</p>
            <h2 className="section-title">A better way to rent together.</h2>
            <p>
              No awkward group chats. No paying for empty rooms. Just a clear path from interest to
              move-in.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [Search, 'Pick a home', 'See the room price, included costs and total.'],
              [UsersRound, 'Show interest', 'Verify your identity. No payment is taken.'],
              [KeyRound, 'Move in together', 'When every room is taken, the group confirms.'],
            ].map(([Icon, title, text], i) => (
              <article className="feature-card" key={title as string}>
                <span className="text-5xl font-serif text-[#0E2A3B]/10">0{i + 1}</span>
                <Icon className="mt-6 text-[#C2502A]" />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section bg-[#F6F1E9]">
        <div className="page-container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="section-heading !mb-0">
              <p className="eyebrow">Featured homes</p>
              <h2 className="section-title">A good address is within reach.</h2>
              <p>Every card shows the full monthly cost and current group status.</p>
            </div>
            <Link className="secondary-button" href="/homes">
              View all homes <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {homes.slice(0, 6).map((home, index) => (
              <ListingCard home={home} key={home.slug} priority={index < 2} />
            ))}
          </div>
        </div>
      </section>

      <CostCalculator />
      <section className="page-section">
        <div className="page-container grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Find your fit</p>
            <h2 className="section-title">Where should you start?</h2>
            <p className="mt-5 max-w-xl leading-7 text-[#657179]">
              Answer two quick questions. We will suggest a suburb based on your main destination
              and budget, then you can check verified homes and real commute details.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                'Commute-aware suggestions',
                'No invented safety claims',
                'Price range shown clearly',
                'Only verified homes go live',
              ].map((item) => (
                <p className="flex items-center gap-2 text-sm font-semibold" key={item}>
                  <CheckCircle2 className="text-[#2E6F5E]" size={19} />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <SuburbQuiz />
        </div>
      </section>

      <section className="page-section bg-[#F6F1E9]">
        <div className="page-container">
          <div className="section-heading mx-auto text-center">
            <p className="eyebrow justify-center">Made for real life</p>
            <h2 className="section-title">Your group is already looking for you.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [GraduationCap, 'Students', 'Walk to campus. Share the rent.', '/students'],
              [MapPinned, 'Visitors', 'Flexible stays without hotel prices.', '/visitors'],
              [UsersRound, 'Professionals', 'Premium areas. Shared cost.', '/professionals'],
              [Building2, 'Businesses', 'Flexible offices for growing teams.', '/businesses'],
              [Handshake, 'Corporate', 'Organised space programmes for teams.', '/corporate'],
            ].map(([Icon, title, text, href]) => (
              <Link className="audience-tile" href={href as string} key={title as string}>
                <Icon />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
                <span>
                  Explore <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
