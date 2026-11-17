import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { appAuth } from '@/lib/app-auth'
import { ProfileForm } from '@/components/profile-form'

export const metadata: Metadata = { title: 'My profile' }

export default async function ProfilePage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/account?next=/account/home')
  return (
    <>
      <section className="bg-[#0E2A3B] py-14 text-white">
        <div className="page-container">
          <p className="eyebrow-light">Member account</p>
          <h1 className="font-serif text-4xl font-semibold sm:text-6xl">My profile</h1>
        </div>
      </section>
      <section className="page-section">
        <div className="page-container grid gap-8 lg:grid-cols-[1fr_340px]">
          <ProfileForm
            name={user.name}
            email={user.email}
            phone={user.phone}
            accountType={user.accountType}
          />
          <aside className="rounded-3xl bg-[#F5F1E9] p-7">
            <ShieldCheck className="text-[#2E6F5E]" />
            <h2 className="mt-4 font-serif text-2xl font-semibold text-[#0E2A3B]">
              Account security
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#68757A]">
              Your public member session is separate from staff and Payload Admin access. Passwords
              are handled by Payload authentication and are never stored in application fields.
            </p>
            <a className="primary-button mt-6 w-full" href="mailto:hello@affordablelife.co.za">
              Email support
            </a>
            <Link className="secondary-button mt-3 w-full" href="/account">
              Back to account
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
