'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LoaderCircle, TrendingUp } from 'lucide-react'

type Summary = {
  roomsInterested: number
  target: number
  threshold: number
  reachedPurchaseReview: boolean
}

export function DemandProgress({
  suburbSlug,
  suburbName,
}: {
  suburbSlug: string
  suburbName: string
}) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/demand-summary?suburb=${encodeURIComponent(suburbSlug)}`, {
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Demand summary unavailable')
        return response.json() as Promise<Summary>
      })
      .then(setSummary)
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true)
      })
    return () => controller.abort()
  }, [suburbSlug])

  return (
    <section className="rounded-[20px] bg-[#0E2A3B] p-6 text-white shadow-xl" aria-live="polite">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#2E6F5E]">
          <TrendingUp />
        </span>
        <div className="flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#E5C079]">
            Public demand signal
          </p>
          {!summary && !failed && (
            <p className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <LoaderCircle className="animate-spin" size={17} /> Loading live demand…
            </p>
          )}
          {failed && (
            <p className="mt-3 text-sm text-white/70">Live demand is temporarily unavailable.</p>
          )}
          {summary && (
            <>
              <h2 className="mt-2 font-serif text-3xl">
                {summary.roomsInterested} of {summary.target} rooms interested
              </h2>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#56A88F] transition-all"
                  style={{
                    width: `${Math.min(100, (summary.roomsInterested / summary.target) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-white/65">
                <span>Purchase review threshold: {summary.threshold} rooms</span>
                <span>
                  {summary.reachedPurchaseReview
                    ? 'Threshold reached'
                    : `${Math.max(0, summary.threshold - summary.roomsInterested)} more to review`}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <Link className="primary-button mt-6 w-full" href={`/interest?suburb=${suburbSlug}`}>
        Register interest in {suburbName} <ArrowRight />
      </Link>
      <p className="mt-3 text-center text-[11px] leading-5 text-white/55">
        Interest is free. No reservation deposit is collected.
      </p>
    </section>
  )
}
