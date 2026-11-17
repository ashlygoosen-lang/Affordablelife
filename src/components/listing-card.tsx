import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, CalendarClock, MapPin } from 'lucide-react'
import type { ListingCardData } from '@/lib/listings'

export const formatRand = (value: number) =>
  new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(value)

export function ProgressBar({
  filled,
  rooms,
  status,
}: {
  filled: number
  rooms: number
  status: string
}) {
  return (
    <div aria-label={`${filled} of ${rooms} rooms interested; group ${status.replace('-', ' ')}`}>
      <div className="mb-2 flex justify-between text-[11px]">
        <strong className="text-[#2E6F5E]">
          {filled} of {rooms} rooms
        </strong>
        <span className="capitalize text-[#66737A]">{status.replace('-', ' ')}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: rooms }).map((_, index) => (
          <span
            className={`h-2 flex-1 rounded-full ${index < filled ? 'bg-[#2E6F5E]' : 'bg-[#DFE7E5]'}`}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export function ListingCard({
  home,
  priority = false,
}: {
  home: ListingCardData
  priority?: boolean
}) {
  const total = home.roomPrice + home.includedCosts
  return (
    <article className="group overflow-hidden rounded-[20px] bg-white shadow-[0_8px_28px_rgba(14,42,59,.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(14,42,59,.13)]">
      <Link className="relative block h-64 overflow-hidden" href={`/homes/${home.slug}`}>
        <Image
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          src={home.image.url}
          alt={home.image.alt}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          priority={priority}
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#0E2A3B]/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
          {home.groupStatus.replace('-', ' ')}
        </span>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-[#6C777D]">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {home.city}
          </span>
          {home.verified && (
            <span className="flex items-center gap-1 text-[#2E6F5E]">
              <BadgeCheck size={16} /> Verified
            </span>
          )}
        </div>
        <Link href={`/homes/${home.slug}`}>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-[#0E2A3B]">{home.suburb}</h2>
        </Link>
        <p className="mt-1 text-xs capitalize text-[#707A80]">
          {home.rooms}-bedroom {home.propertyType}
        </p>
        <div className="my-5 rounded-xl bg-[#F6F1E9] p-3 text-xs">
          <div className="flex justify-between">
            <span>Room rent</span>
            <strong>{formatRand(home.roomPrice)}</strong>
          </div>
          <div className="mt-2 flex justify-between text-[#5E6B72]">
            <span>Included costs</span>
            <span>{formatRand(home.includedCosts)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[#D8D0C5] pt-2 text-sm">
            <strong>Total per month</strong>
            <strong>{formatRand(total)}</strong>
          </div>
          <div className="mt-3 flex justify-between border-t border-[#D8D0C5] pt-2 text-[11px] text-[#68747A]">
            <span>Separate-cost illustration</span>
            <strong>{formatRand(total + 2500)}</strong>
          </div>
        </div>
        <p className="-mt-3 mb-4 text-[9px] leading-4 text-[#7A858A]">
          Illustration only · meals and transport depend on tier.
        </p>
        <div className="mb-5 flex items-center gap-2 text-[11px] text-[#66737A]">
          <CalendarClock size={15} className="text-[#C2502A]" /> Group expires{' '}
          {new Date(home.groupExpiry).toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'short',
          })}
        </div>
        <ProgressBar filled={home.interested} rooms={home.rooms} status={home.groupStatus} />
      </div>
    </article>
  )
}
