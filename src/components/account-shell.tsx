import type { ReactNode } from 'react'
import { Building, CreditCard, FileText, LayoutDashboard, LogOut, UserRound, Wrench } from 'lucide-react'
import { DashboardShell, type NavItem } from '@/components/dashboard/ui'
import { logoutUser } from '@/app/(frontend)/account/actions'
import type { User } from '@/payload-types'

export function AccountShell({
  user,
  active,
  title,
  subtitle,
  actions,
  children,
}: {
  user: User
  active: string
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}) {
  const nav: NavItem[] = [
    { href: '/account', label: 'Overview', icon: <LayoutDashboard /> },
    { href: '/account/payments', label: 'Payments', icon: <CreditCard /> },
    { href: '/account/maintenance', label: 'Maintenance', icon: <Wrench /> },
    { href: '/account/interests', label: 'Applications', icon: <FileText /> },
    { href: '/account/home', label: 'Profile', icon: <UserRound /> },
  ]
  if (user.role === 'partner') nav.push({ href: '/partner', label: 'Partner portal', icon: <Building /> })
  return (
    <DashboardShell
      area="Member account"
      title={title}
      subtitle={subtitle}
      nav={nav}
      active={active}
      actions={
        <>
          {actions}
          <form action={logoutUser}>
            <button className="secondary-button !min-h-11 !px-4" type="submit">
              <LogOut size={16} /> Log out
            </button>
          </form>
        </>
      }
    >
      {children}
    </DashboardShell>
  )
}
