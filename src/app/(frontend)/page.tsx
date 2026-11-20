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
import { ListingCard, ProgressBar, formatRand } from '@/components/listing-card'
import { getVerifiedHomes } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const homes = await getVerifiedHomes()
  // Feature the home closest to filling, so the receipt shows a live group.
  const joinable = homes.filter((home) => home.groupStatus === 'open' || home.groupStatus === 'almost-full')
  const hero = [...(joinable.length ? joinable : homes)].sort(
    (a, b) => b.interested / b.rooms - a.interested / a.rooms,
  )[0]
  return (
    <>
      <section className="relative overflow-hidden bg-[#0E2A3B] text-white">
        {hero && (
          <Image
            src={hero.image.url}
            alt={hero.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,#0A2230_0%,rgba(10,34,48,.92)_38%,rgba(10,34,48,.55)_70%,rgba(10,34,48,.35)_100%)]" />
        <div className="page-container relative grid min-h-[760px] items-center gap-12 pb-32 pt-16 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="text-[15px] text-[#E4C27E]">Shared homes and offices in South Africa</p>
            <h1 className="mt-5 max-w-[13ch] font-serif text-[clamp(3.1rem,6.6vw,5.6rem)] font-light leading-[0.98] tracking-[-0.045em]">
              The right space, with every cost on the table.
            </h1>
            <p className="mt-7 max-w-[46ch] text-lg leading-8 text-white/72">
              Rent a room in a verified home, take a private office, or place a whole team. You see
              the full monthly price before you commit, and nothing is charged until your group is
              confirmed.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="primary-button" href="/homes">
                Browse homes <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button !border-white/25 !bg-white/5 !text-white hover:!bg-white/10" href="/interest">
                Register interest
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#E4C27E]" /> Landlord, address and photos checked
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck size={17} className="text-[#E4C27E]" /> Secure payments with PayFast
              </span>
            </div>
          </div>

          {hero && (
            <aside
              aria-label={`Monthly cost for ${hero.title}`}
              className="relative justify-self-end rounded-[28px] bg-[#FAF9F6] p-7 text-[#14202B] shadow-[0_40px_90px_-30px_rgba(0,0,0,.6)] sm:w-[400px]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#5F6D74]">Monthly cost, per room</p>
                  <p className="mt-1 font-serif text-2xl font-normal tracking-[-0.02em] text-[#0E2A3B]">
                    {hero.suburb}
                  </p>
                  <p className="text-xs text-[#7A858A]">
                    {hero.rooms}-bedroom {hero.propertyType} · {hero.city}
                  </p>
                </div>
                {hero.verified && (
                  <span className="flex items-center gap-1 rounded-full bg-[#E3F0EB] px-2.5 py-1 text-[11px] font-semibold text-[#22594B]">
                    <BadgeCheck size={13} /> Verified
                  </span>
                )}
              </div>
              <dl className="mt-6 border-t border-dashed border-[#CFD6D3] pt-4 text-[15px]">
                <div className="receipt-line flex justify-between py-2" style={{ animationDelay: '150ms' }}>
                  <dt className="text-[#4A5961]">Room rent</dt>
                  <dd className="tabular-nums">{formatRand(hero.roomPrice)}</dd>
                </div>
                <div className="receipt-line flex justify-between py-2" style={{ animationDelay: '300ms' }}>
                  <dt className="text-[#4A5961]">
                    Included costs
                    <span className="mt-0.5 block max-w-[220px] text-xs text-[#8A9499]">
                      {hero.included.slice(0, 3).join(', ')}
                    </span>
                  </dt>
                  <dd className="tabular-nums">{formatRand(hero.includedCosts)}</dd>
                </div>
                <div
                  className="receipt-line mt-3 flex items-end justify-between border-t border-[#0E2A3B] pt-4"
                  style={{ animationDelay: '480ms' }}
                >
                  <dt className="text-sm text-[#5F6D74]">Total per month</dt>
                  <dd className="font-serif text-[2.6rem] font-normal leading-none tabular-nums tracking-[-0.035em] text-[#0E2A3B]">
                    {formatRand(hero.roomPrice + hero.includedCosts)}
                  </dd>
                </div>
              </dl>
              <div className="receipt-line mt-6 rounded-2xl bg-[#F1EEE7] p-4" style={{ animationDelay: '640ms' }}>
                <ProgressBar filled={hero.interested} rooms={hero.rooms} status={hero.groupStatus} />
              </div>
              <Link
                className="mt-5 flex items-center justify-between rounded-2xl border border-[#E2E6E4] px-4 py-3 text-sm font-semibold text-[#0E2A3B] transition-colors hover:border-[#0E2A3B]"
                href={`/homes/${hero.slug}`}
              >
                See this home <ArrowRight size={16} />
              </Link>
            </aside>
          )}
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
