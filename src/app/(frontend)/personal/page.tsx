import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, GraduationCap, MapPinned, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Personal accommodation',
  description: 'Rooms and short stays for students, professionals and visitors.',
}

const paths = [
  {
    icon: GraduationCap,
    title: 'Students',
    text: 'Academic-year rooms with connectivity and student-focused services planned together.',
    href: '/students',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Professionals',
    text: 'Well-located shared homes with predictable core monthly costs.',
    href: '/professionals',
  },
  {
    icon: MapPinned,
    title: 'Visitors',
    text: 'Furnished nightly and weekly stays for exchange, project and holiday travel.',
    href: '/visitors',
  },
]

export default function PersonalPage() {
  return (
    <>
      <section className="bg-[#0E2A3B] py-20 text-white">
        <div className="page-container">
          <p className="eyebrow-light">Personal</p>
          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-tight sm:text-7xl">
            A better place to live, without carrying every cost alone.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Browse verified homes, register interest and complete your application online from
            identity details through document upload.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="primary-button" href="/homes">
              Browse homes <ArrowRight size={18} />
            </Link>
            <Link
              className="secondary-button !border-white/25 !bg-white/10 !text-white"
              href="/interest"
            >
              Register interest
            </Link>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="page-container">
          <div className="section-heading">
            <p className="eyebrow">Choose your path</p>
            <h2 className="section-title">Built around how you actually need to live.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {paths.map(({ icon: Icon, title, text, href }) => (
              <Link className="audience-tile" href={href} key={title}>
                <Icon />
                <h2 className="mt-auto font-serif text-3xl font-semibold">{title}</h2>
                <p>{text}</p>
                <span>
                  Explore <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#F5F1E9] py-20">
        <div className="page-container grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Self-service application</p>
            <h2 className="section-title">From interest to review, step by step.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              'Register interest in about one minute',
              'Save and resume your private draft',
              'Upload documents from your phone or camera',
              'Review everything before submitting',
            ].map((item) => (
              <p className="flex gap-3 rounded-2xl bg-white p-5 text-sm font-semibold" key={item}>
                <ShieldCheck className="shrink-0 text-[#2E6F5E]" size={20} /> {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
