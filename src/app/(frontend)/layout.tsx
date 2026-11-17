import type { Metadata } from 'next'
import React from 'react'
import { Footer, Header, MobileTabs } from '@/components/site-chrome'
import { fraunces, inter } from './fonts'
import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Affordable Life — Premium places. Shared costs.',
    template: '%s | Affordable Life',
  },
  description:
    'Personal accommodation, business offices and corporate space solutions in South Africa.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/affordable-life-mark.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Affordable Life — Premium places. Shared costs.',
    description: 'Personal accommodation, business offices and corporate space solutions.',
    images: [
      {
        url: '/affordable-life-logo.webp',
        width: 1411,
        height: 537,
        alt: 'Affordable Life — Live Better Pay Less',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/affordable-life-logo.webp'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileTabs />
      </body>
    </html>
  )
}
