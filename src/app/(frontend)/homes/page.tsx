import type { Metadata } from 'next'
import { Suspense } from 'react'
import { HomeExplorer } from '@/components/discovery-tools'
import { getVerifiedHomes } from '@/lib/listings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Browse verified shared homes' }

export default async function HomesPage() {
  const homes = await getVerifiedHomes()
  return (
    <Suspense fallback={<div className="min-h-[700px] bg-[#F5F1E9]" />}>
      <HomeExplorer homes={homes} />
    </Suspense>
  )
}
