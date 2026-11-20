import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { redirect } from 'next/navigation'
import { appAuth } from '@/lib/app-auth'
import { ProfileForm } from '@/components/profile-form'
import { AccountShell } from '@/components/account-shell'

export const metadata: Metadata = { title: 'My profile' }

export default async function ProfilePage() {
  const user = await appAuth.currentUser()
  if (!user) redirect('/account?next=/account/home')
  return (
    <AccountShell user={user} active="/account/home" title="Profile" subtitle="Your contact details and account security.">
        <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
          <ProfileForm
            name={user.name}
            email={user.email}
            phone={user.phone}
            accountType={user.accountType}
          />
          <aside className="rounded-[22px] border border-[#E2E6E4] bg-white p-7">
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
    </AccountShell>
  )
}
