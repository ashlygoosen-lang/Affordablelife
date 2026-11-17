import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer, Header, MobileTabs } from '@/components/site-chrome'
import { fraunces, inter } from './(frontend)/fonts'
import './(frontend)/styles.css'

export const metadata: Metadata = {
  title: 'Page not found | Affordable Life',
  description: 'The page you are looking for is not available.',
}

/** Branded 404 for URLs that match no route (the site has two root layouts). */
export default function GlobalNotFound() {
  return (
    <html lang="en-ZA" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <Header />
        <main id="main-content" tabIndex={-1}>
          <section className="page-section">
            <div className="page-container flex min-h-[55vh] flex-col items-center justify-center text-center">
              <p className="eyebrow">404</p>
              <h1 className="display-title">This space is not available.</h1>
              <p className="mt-5 max-w-lg leading-7 text-[#657179]">
                The page may have moved, or this home, office or programme may not be visible yet.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link className="primary-button" href="/">
                  Return home
                </Link>
                <Link className="secondary-button" href="/homes">
                  Browse homes
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        <MobileTabs />
      </body>
    </html>
  )
}
