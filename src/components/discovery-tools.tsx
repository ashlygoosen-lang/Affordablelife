'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Bell,
  Calculator,
  Check,
  Heart,
  Map,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import type { ListingCardData } from '@/lib/listings'
import { formatRand, ListingCard } from './listing-card'

const readSavedHomes = () => {
  try {
    const value = JSON.parse(localStorage.getItem('affordable-life-saved-homes') ?? '[]')
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

export function HomeExplorer({ homes }: { homes: ListingCardData[] }) {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [budget, setBudget] = useState(searchParams.get('budget') ?? '')
  const moveIn = searchParams.get('moveIn') ?? ''
  const [sort, setSort] = useState('almost')
  const [map, setMap] = useState(false)
  const [alert, setAlert] = useState(false)
  useEffect(() => {
    const saved = localStorage.getItem('affordable-life-saved-search')
    if (saved) setAlert(true)
  }, [])
  const results = useMemo(() => {
    const searched = homes.filter((home) => {
      const matchesQuery =
        `${home.suburb} ${home.city} ${home.propertyType} ${home.features.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase())
      const matchesBudget = !budget || home.roomPrice + home.includedCosts <= Number(budget)
      const matchesMoveIn = !moveIn || home.moveIn.slice(0, 7) <= moveIn
      return matchesQuery && matchesBudget && matchesMoveIn
    })
    return [...searched].sort((a, b) =>
      sort === 'price'
        ? a.roomPrice - b.roomPrice
        : b.interested / b.rooms - a.interested / a.rooms,
    )
  }, [budget, homes, moveIn, query, sort])
  const toggleSavedSearch = () => {
    if (alert) {
      localStorage.removeItem('affordable-life-saved-search')
      setAlert(false)
      return
    }
    localStorage.setItem('affordable-life-saved-search', JSON.stringify({ query, budget, moveIn }))
    setAlert(true)
  }
  return (
    <>
      <section className="bg-[#0E2A3B] py-16 text-white">
        <div className="page-container">
          <p className="eyebrow-light">Browse verified homes</p>
          <h1 className="display-title max-w-3xl !text-white">
            Find your home. <em className="text-[#E5C079]">Find your group.</em>
          </h1>
          <p className="mt-5 text-white/65">
            Every price is per room. Every status is live at the last Publish.
          </p>
          <div className="mt-8 grid gap-3 rounded-2xl bg-white p-3 text-[#14202B] shadow-2xl sm:grid-cols-[1fr_190px]">
            <label className="flex min-h-12 flex-1 items-center gap-3 px-3">
              <Search className="text-[#2E6F5E]" />
              <span className="sr-only">Search homes</span>
              <input
                className="w-full border-0 bg-transparent outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, suburb, home type or feature"
              />
            </label>
            <label className="flex min-h-12 items-center gap-2 rounded-xl bg-[#F5F1E9] px-4 text-sm font-semibold">
              Budget
              <input
                className="min-w-0 flex-1 bg-transparent text-right outline-none"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                type="number"
                min="1000"
                placeholder="Any"
              />
            </label>
          </div>
        </div>
      </section>
      <section className="page-section !pt-8">
        <div className="page-container">
          <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-black/10 bg-white p-3">
            <label className="filter-control">
              <SlidersHorizontal />
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="almost">Almost full first</option>
                <option value="price">Lowest total price</option>
              </select>
            </label>
            <button
              className="filter-control"
              aria-pressed={map}
              onClick={() => setMap(!map)}
              type="button"
            >
              <Map />
              <span>{map ? 'List view' : 'Map view'}</span>
            </button>
            <button
              type="button"
              className={`filter-control ml-auto ${alert ? '!bg-[#E6F0EC] !text-[#2E6F5E]' : ''}`}
              onClick={toggleSavedSearch}
            >
              <Bell />
              <span>{alert ? 'Alert saved' : 'Save this search'}</span>
            </button>
          </div>
          {map ? (
            <div className="map-surface" aria-label="Approximate area overview of listed homes">
              <p className="absolute left-4 top-4 z-10 rounded-lg bg-white/90 px-3 py-2 text-[11px] font-semibold text-[#526069]">
                Approximate area overview · confirm the listing address before applying
              </p>
              {results.map((home, index) => (
                <Link
                  className="map-pin"
                  href={`/homes/${home.slug}`}
                  key={home.slug}
                  style={{
                    left: `${18 + ((index * 13) % 68)}%`,
                    top: `${18 + ((index * 19) % 62)}%`,
                  }}
                >
                  <strong>{home.suburb}</strong>
                  <span>
                    {formatRand(home.roomPrice + home.includedCosts)} · {home.interested}/
                    {home.rooms}
                  </span>
                </Link>
              ))}
            </div>
          ) : results.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map((home) => (
                <ListingCard home={home} key={home.slug} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#F6F1E9] p-12 text-center">
              <Search className="mx-auto text-[#C2502A]" />
              <h2 className="mt-4 font-serif text-3xl">No homes match yet.</h2>
              <p className="mt-2 text-[#68747A]">
                Save this search and we will alert you when a verified home appears.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export function CostCalculator() {
  const [tier, setTier] = useState<'student' | 'professional' | 'visitor'>('student')
  const [occupancy, setOccupancy] = useState(80)
  const tiers = {
    student: {
      label: 'Student Plus',
      term: 'Academic year · 10 to 12 months',
      lines: [
        ['Room and property costs', 4167],
        ['Three meals a day', 2000],
        ['Campus transport', 600],
        ['Wi-Fi and data', 150],
        ['Security', 633],
        ['Cleaning and parking', 750],
      ] as [string, number][],
      separate: 11300,
    },
    professional: {
      label: 'Young Professional',
      term: '6 or 12 months · month-to-month costs more',
      lines: [
        ['Room and property costs', 4167],
        ['Wi-Fi and data', 200],
        ['Security', 633],
        ['Cleaning and parking', 1000],
      ] as [string, number][],
      separate: 9500,
    },
    visitor: {
      label: 'Visitor and Short Stay',
      term: 'Nightly or weekly · mainly university holidays',
      lines: [
        ['Furnished room', 4800],
        ['Wi-Fi and data', 200],
        ['Security', 700],
        ['Cleaning and linen', 1500],
      ] as [string, number][],
      separate: 12000,
    },
  }
  const selected = tiers[tier]
  const base = selected.lines.reduce((total, [, value]) => total + value, 0)
  const stressedPrice = Math.round(base / (occupancy / 100))
  const occupancyReserve = stressedPrice - base
  return (
    <section className="page-section bg-[#0E2A3B] text-white">
      <div className="page-container grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow-light">All-inclusive price calculator</p>
          <h2 className="section-title !text-white">One price. The important bills sorted.</h2>
          <p className="mt-5 max-w-xl leading-7 text-white/65">
            We use one cautious method throughout: total costs divided by occupied rooms. The
            default stress case is 80% occupancy, not a simple 10% add-on.
          </p>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#E5C079]">
              Why occupancy matters
            </p>
            <p className="mt-3 leading-7 text-white/70">
              Every ten percentage points of empty rooms can add roughly R1,000 to R1,500 to the
              break-even price paid by each occupied room.
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 text-[#14202B]">
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Customer tier">
            {Object.entries(tiers).map(([value, option]) => (
              <button
                className={`min-h-14 rounded-xl px-2 text-xs font-bold ${tier === value ? 'bg-[#0E2A3B] text-white' : 'bg-[#F1F3F3] text-[#526069]'}`}
                onClick={() => setTier(value as typeof tier)}
                aria-pressed={tier === value}
                key={value}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] font-semibold text-[#657179]">
            {selected.term}
          </p>
          <label className="form-label mt-6">
            Stress-test occupancy: {occupancy}%
            <input
              type="range"
              min="70"
              max="100"
              step="10"
              value={occupancy}
              onChange={(e) => setOccupancy(Number(e.target.value))}
            />
          </label>
          <div className="mt-5 overflow-hidden rounded-xl border border-[#DCE3E5]">
            {selected.lines.map(([label, value]) => (
              <div
                className="flex justify-between border-b border-[#DCE3E5] px-4 py-3 text-xs"
                key={label}
              >
                <span>{label}</span>
                <strong>{formatRand(value)}</strong>
              </div>
            ))}
            <div className="flex justify-between border-b border-[#DCE3E5] bg-[#F6F1E9] px-4 py-3 text-xs">
              <span>Occupancy stress reserve</span>
              <strong>{formatRand(occupancyReserve)}</strong>
            </div>
            <div className="flex justify-between bg-[#E3EFEA] px-4 py-4">
              <strong>Illustrated all-inclusive price</strong>
              <strong className="text-lg text-[#2E6F5E]">{formatRand(stressedPrice)}</strong>
            </div>
          </div>
          <div className="mt-4 rounded-xl bg-[#F4E4DD] p-4">
            <div className="flex items-center gap-2">
              <Calculator className="text-[#C2502A]" size={19} />
              <strong>What you might pay separately</strong>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span>Typical separate costs</span>
              <strong>{formatRand(selected.separate)}</strong>
            </div>
            <div className="mt-2 flex justify-between text-sm text-[#2E6F5E]">
              <span>Illustrated difference</span>
              <strong>{formatRand(selected.separate - stressedPrice)}</strong>
            </div>
          </div>
          <p className="mt-4 text-[10px] leading-5 text-[#6B777D]">
            Illustration only · Planning assumptions, November 2026. Replace with dated local quotes
            before publishing a real price. Meals and transport are optional extras for
            professionals.
          </p>
        </div>
      </div>
    </section>
  )
}

export function SuburbQuiz() {
  const [step, setStep] = useState(0)
  const [budget, setBudget] = useState('4500')
  const [hub, setHub] = useState('UCT')
  const recommendation =
    hub === 'UCT'
      ? Number(budget) < 4500
        ? 'Observatory'
        : 'Rondebosch'
      : hub === 'City centre'
        ? 'Gardens'
        : 'Claremont'
  if (step === 2)
    return (
      <div className="rounded-[20px] bg-[#F6F1E9] p-7">
        <Sparkles className="text-[#C2502A]" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#2E6F5E]">
          Your starting point
        </p>
        <h3 className="mt-2 font-serif text-3xl text-[#0E2A3B]">{recommendation}</h3>
        <p className="mt-3 leading-7 text-[#657179]">
          A strong match for your commute and budget. Confirm the exact route and current room price
          on each verified listing.
        </p>
        <Link className="primary-button mt-6" href={`/homes?q=${encodeURIComponent(recommendation)}`}>
          See matching homes
        </Link>
      </div>
    )
  return (
    <div className="rounded-[20px] border border-black/10 bg-white p-7 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-[#2E6F5E]">
        Is this right for me? · {step + 1} of 2
      </p>
      <h3 className="mt-3 font-serif text-3xl">
        {step === 0 ? 'Where do you need to be?' : 'What is your monthly budget?'}
      </h3>
      {step === 0 ? (
        <div className="mt-6 grid gap-2">
          {['UCT', 'City centre', 'Claremont business hub'].map((item) => (
            <button
              className={`quiz-choice ${hub === item ? 'selected' : ''}`}
              onClick={() => setHub(item)}
              key={item}
            >
              {hub === item && <Check />} {item}
            </button>
          ))}
        </div>
      ) : (
        <label className="form-label mt-6">
          Maximum monthly total
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="4000">Up to R4,000</option>
            <option value="4500">Up to R4,500</option>
            <option value="5500">Up to R5,500</option>
            <option value="7000">Up to R7,000</option>
          </select>
        </label>
      )}
      <button className="primary-button mt-6 w-full" onClick={() => setStep(step + 1)}>
        {step === 0 ? 'Next question' : 'Show my suburb'} <Sparkles />
      </button>
    </div>
  )
}

export function SaveButton({ homeSlug }: { homeSlug: string }) {
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    const savedHomes = readSavedHomes()
    setSaved(savedHomes.includes(homeSlug))
  }, [homeSlug])
  const toggleSaved = () => {
    const savedHomes = readSavedHomes()
    const next = savedHomes.includes(homeSlug)
      ? savedHomes.filter((slug) => slug !== homeSlug)
      : [...savedHomes, homeSlug]
    localStorage.setItem('affordable-life-saved-homes', JSON.stringify(next))
    setSaved(next.includes(homeSlug))
  }
  return (
    <button className="secondary-button" onClick={toggleSaved} aria-pressed={saved}>
      <Heart fill={saved ? 'currentColor' : 'none'} />
      {saved ? 'Saved' : 'Save home'}
    </button>
  )
}

export function JoinPanel({
  price,
  rooms,
  interested,
  status,
  expiry,
  homeSlug,
  suburbSlug,
}: {
  price: number
  rooms: number
  interested: number
  status: string
  expiry: string
  homeSlug: string
  suburbSlug: string
}) {
  const roomsLeft = Math.max(2, rooms - interested)
  const [withFriends, setWithFriends] = useState(false)
  const [groupRooms, setGroupRooms] = useState(2)
  return (
    <aside className="sticky top-28 rounded-[20px] bg-white p-6 shadow-[0_16px_50px_rgba(14,42,59,.16)]">
      <p className="text-xs text-[#6B777D]">Total monthly cost</p>
      <strong className="mt-1 block text-3xl">{formatRand(price)}</strong>
      <p className="mt-1 text-xs text-[#6B777D]">Room rent + included costs</p>
      <div className="my-5 rounded-xl bg-[#F6F1E9] p-4 text-sm">
        <div className="flex justify-between">
          <span>Group status</span>
          <strong className="capitalize">{status.replace('-', ' ')}</strong>
        </div>
        <div className="mt-2 flex justify-between">
          <span>Progress</span>
          <strong>
            {interested} of {rooms}
          </strong>
        </div>
        <div className="mt-2 flex justify-between">
          <span>Group expires</span>
          <strong>
            {new Date(expiry).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
          </strong>
        </div>
      </div>
      <fieldset className="mb-4">
        <legend className="mb-2 text-xs font-bold uppercase tracking-wider">
          How are you joining?
        </legend>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="radio"
            name="joining"
            checked={!withFriends}
            onChange={() => setWithFriends(false)}
          />{' '}
          Just me
        </label>
        <label className="flex min-h-11 items-center gap-2">
          <input
            type="radio"
            name="joining"
            checked={withFriends}
            onChange={() => setWithFriends(true)}
          />{' '}
          With friends
        </label>
        {withFriends && (
          <label className="form-label mt-2">
            Rooms for your group
            <select
              value={groupRooms}
              onChange={(event) => setGroupRooms(Number(event.target.value))}
            >
              {Array.from({ length: Math.max(1, roomsLeft - 1) }, (_, index) => index + 2).map(
                (count) => (
                  <option value={count} key={count}>
                    {count} rooms
                  </option>
                ),
              )}
            </select>
          </label>
        )}
      </fieldset>
      <Link
        className="primary-button w-full"
        href={`/interest?suburb=${encodeURIComponent(suburbSlug)}&home=${encodeURIComponent(homeSlug)}&rooms=${withFriends ? groupRooms : 1}`}
      >
        Register interest
      </Link>
      <p className="mt-3 text-center text-[11px] leading-5 text-[#5E6B72]">
        Nothing is charged until the group is full and confirmed.
      </p>
    </aside>
  )
}
