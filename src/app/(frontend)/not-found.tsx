import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="page-container flex min-h-[55vh] flex-col items-center justify-center text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-title">This space is not available.</h1>
        <p className="mt-5 max-w-lg leading-7 text-[#657179]">
          The page may have moved, or this home, office or programme may not be visible yet.
        </p>
        <Link className="primary-button mt-7" href="/">
          Return home
        </Link>
      </div>
    </section>
  )
}
