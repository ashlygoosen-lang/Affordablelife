import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Building2, FileCheck2, LogOut, UserRound } from 'lucide-react'
import { AuthForm } from '@/components/auth-form'
import { appAuth } from '@/lib/app-auth'
import { logoutUser } from './actions'

export const metadata: Metadata = {
  title: 'Log in or create an account',
  description: 'Access your Affordable Life applications and account details.',
}

export default async function AccountPage() {
  const user = await appAuth.currentUser()
  if (user) {
    return (
      <>
        <section className="bg-[#0E2A3B] py-16 text-white">
          <div className="page-container">
            <p className="eyebrow-light">Member account</p>
            <h1 className="font-serif text-4xl font-semibold sm:text-6xl">
              Welcome, {user.name.split(' ')[0]}.
            </h1>
            <p className="mt-4 text-white/65">{user.email}</p>
          </div>
        </section>
        <section className="page-section">
          <div className="page-container">
            <div className="grid gap-5 md:grid-cols-3">
              <AccountLink
                icon={<FileCheck2 />}
                title="My applications"
                text="View drafts and submitted applications."
                href="/account/interests"
              />
              <AccountLink
                icon={<UserRound />}
                title="Profile"
                text="Review your account and contact details."
                href="/account/home"
              />
              <AccountLink
                icon={<Building2 />}
                title="Start another application"
                text="Register interest in a room or business office."
                href="/interest"
              />
            </div>
            <form action={logoutUser} className="mt-8">
              <button className="secondary-button" type="submit">
                <LogOut size={18} /> Log out
              </button>
            </form>
          </div>
        </section>
      </>
    )
  }

  return (
    <section className="min-h-[720px] bg-[#F5F1E9] py-14 sm:py-20">
      <div className="page-container grid items-center gap-12 lg:grid-cols-[1fr_520px]">
        <div>
          <p className="eyebrow">Your Affordable Life account</p>
          <h1 className="display-title">One account for every kind of space.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5F6D74]">
            Track personal applications, office requirements and corporate enquiries without mixing
            them with Payload Admin access.
          </p>
          <ul className="mt-8 space-y-3 text-sm font-semibold text-[#304149]">
            <li>View draft and submitted applications</li>
            <li>Keep business and corporate requirements together</li>
            <li>Private session, separate from staff administration</li>
          </ul>
        </div>
        <Suspense fallback={<div className="min-h-[560px] rounded-3xl bg-white" />}>
          <AuthForm />
        </Suspense>
      </div>
    </section>
  )
}

function AccountLink({
  icon,
  title,
  text,
  href,
}: {
  icon: React.ReactNode
  title: string
  text: string
  href: string
}) {
  return (
    <Link className="feature-card group" href={href}>
      <span className="text-[#2E6F5E]">{icon}</span>
      <h2 className="mt-6 font-serif text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#68757A]">{text}</p>
      <span className="mt-6 flex items-center gap-2 text-xs font-bold text-[#C2502A]">
        Open <ArrowRight size={15} />
      </span>
    </Link>
  )
}
