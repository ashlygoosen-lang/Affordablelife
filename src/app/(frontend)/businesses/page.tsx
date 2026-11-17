import type { Metadata } from 'next'
import { AudiencePage } from '@/components/marketing-pages'

export const metadata: Metadata = {
  title: 'Office rentals for businesses',
  description:
    'Request a private or flexible office for your business through one guided application.',
}

export default function BusinessesPage() {
  return <AudiencePage kind="businesses" />
}
