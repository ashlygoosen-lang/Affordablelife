'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  Home,
  Menu,
  Moon,
  Sun,
  UserRound,
  WifiOff,
  X,
} from 'lucide-react'

const primaryNav = [
  ['Personal', '/personal'],
  ['Business', '/businesses'],
  ['Corporate', '/corporate'],
]

const exploreNav = [
  ['Browse homes', '/homes'],
  ['How it works', '/how-it-works'],
  ['Pricing', '/pricing'],
  ['Students', '/students'],
  ['Professionals', '/professionals'],
  ['Visitors', '/visitors'],
  ['Trust & safety', '/trust'],
  ['Help centre', '/help'],
  ['Property partners', '/partners'],
]

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link className="flex min-h-11 items-center" href="/" aria-label="Affordable Life home">
      <Image
        src={light ? '/affordable-life-logo-footer.webp' : '/affordable-life-logo.webp'}
        alt="Affordable Life — Live Better Pay Less"
        width={1411}
        height={537}
        priority={!light}
        className={
          light
            ? 'h-auto w-[250px] drop-shadow-[0_3px_12px_rgba(0,0,0,.2)]'
            : 'h-auto w-[170px] sm:w-[200px]'
        }
      />
    </Link>
  )
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [tools, setTools] = useState(false)
  const [lowData, setLowData] = useState(false)
  const [dark, setDark] = useState(false)
  const signedIn = useSignedIn(pathname)

  useEffect(() => {
    setOpen(false)
    setTools(false)
  }, [pathname])

  useEffect(() => {
    document.documentElement.dataset.lowData = lowData ? 'true' : 'false'
  }, [lowData])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <header className="sticky top-0 z-50 border-b border-[#0E2A3B]/10 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-[min(1200px,calc(100%-32px))] items-center gap-6">
        <Logo />
        <nav className="ml-6 hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {primaryNav.map(([label, href]) => (
            <Link
              className={`flex min-h-11 items-center border-b-2 text-[13px] font-semibold transition-colors ${pathname.startsWith(href) ? 'border-[#C2502A] text-[#0E2A3B]' : 'border-transparent text-[#526069] hover:text-[#C2502A]'}`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          <div className="relative">
            <button
              aria-expanded={tools}
              className="flex min-h-11 items-center gap-1.5 border-b-2 border-transparent text-[13px] font-semibold text-[#526069] hover:text-[#C2502A]"
              onClick={() => setTools(!tools)}
              type="button"
            >
              Explore <ChevronDown aria-hidden="true" size={14} />
            </button>
            {tools && (
              <div className="absolute left-1/2 top-12 w-[420px] -translate-x-1/2 rounded-2xl border border-black/10 bg-white p-4 shadow-2xl">
                <div className="grid grid-cols-2 gap-1">
                  {exploreNav.map(([label, href]) => (
                    <Link
                      className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[#40505A] hover:bg-[#F6F1E9] hover:text-[#C2502A]"
                      href={href}
                      key={href}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[#E4E8E7] pt-3">
                  <button
                    className="preference-row !min-h-11"
                    onClick={() => setLowData(!lowData)}
                    aria-pressed={lowData}
                    type="button"
                  >
                    <WifiOff aria-hidden="true" />
                    <span>
                      <strong>Low-data mode</strong>
                      <small>{lowData ? 'On' : 'Off'}</small>
                    </span>
                  </button>
                  <button
                    className="preference-row !min-h-11"
                    onClick={() => setDark(!dark)}
                    aria-pressed={dark}
                    type="button"
                  >
                    {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                    <span>
                      <strong>Theme</strong>
                      <small>{dark ? 'Dark' : 'Light'}</small>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
        <div className="ml-auto hidden items-center gap-2 sm:flex">
          <Link className="flex min-h-11 items-center px-2 text-xs font-bold" href="/account">
            {signedIn ? 'My account' : 'Log in'}
          </Link>
          <Link className="primary-button !min-h-11 !px-5" href="/interest">
            Register Interest
          </Link>
        </div>
        <button
          className="ml-auto grid size-11 place-items-center rounded-full lg:hidden"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          type="button"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t bg-white px-5 py-4 lg:hidden" aria-label="Mobile navigation">
          {primaryNav.map(([label, href]) => (
            <Link
              className="flex min-h-12 items-center border-b border-black/5 text-lg font-semibold"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          <p className="mb-1 mt-5 text-[10px] font-bold uppercase tracking-[.16em] text-[#7A858A]">
            Explore
          </p>
          <div className="grid grid-cols-2 gap-x-4">
            {exploreNav.map(([label, href]) => (
              <Link
                className="flex min-h-11 items-center border-b border-black/5 text-sm text-[#526069]"
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              className="preference-row border border-[#E2E7E6]"
              onClick={() => setLowData(!lowData)}
              type="button"
            >
              <WifiOff />
              <span>
                <strong>Low data</strong>
                <small>{lowData ? 'On' : 'Off'}</small>
              </span>
            </button>
            <button
              className="preference-row border border-[#E2E7E6]"
              onClick={() => setDark(!dark)}
              type="button"
            >
              {dark ? <Sun /> : <Moon />}
              <span>
                <strong>Theme</strong>
                <small>{dark ? 'Dark' : 'Light'}</small>
              </span>
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <Link className="secondary-button flex-1" href="/account">
              {signedIn ? 'My account' : 'Log in'}
            </Link>
            <Link className="primary-button flex-1" href="/interest">
              Register Interest
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#0B2433] pb-20 pt-16 text-white md:pb-0">
      <div className="mx-auto grid w-[min(1200px,calc(100%-32px))] gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
            Personal accommodation, business offices and corporate space solutions.
          </p>
          <p className="mt-6 text-xs leading-6 text-white/50">
            Cape Town, Western Cape
            <br />
            hello@affordablelife.co.za
            <br />
            +27 21 555 0142
          </p>
        </div>
        <FooterColumn
          title="Explore"
          links={[
            ['Browse homes', '/homes'],
            ['Register interest', '/interest'],
            ['How it works', '/how-it-works'],
            ['Personal', '/personal'],
            ['Business', '/businesses'],
            ['Students', '/students'],
          ]}
        />
        <FooterColumn
          title="Company"
          links={[
            ['About', '/about'],
            ['Partners', '/partners'],
            ['Corporate', '/corporate'],
            ['Safety & Trust', '/trust'],
            ['Admin', '/admin'],
          ]}
        />
        <FooterColumn
          title="Support"
          links={[
            ['Help Centre', '/help'],
            ['Pricing', '/pricing'],
            ['WhatsApp', 'https://wa.me/27215550142'],
            ['Privacy', '/privacy'],
          ]}
        />
      </div>
      <div className="mx-auto mt-14 flex w-[min(1200px,calc(100%-32px))] flex-col justify-between gap-2 border-t border-white/10 py-5 text-[11px] text-white/40 sm:flex-row">
        <span>
          © 2026 Affordable Life. All rights reserved. Affordable Life is a division of VINK
          Group (Pty) Ltd, registration number 2018/079316/07.
        </span>
        <span className="shrink-0">Made in Cape Town for South Africa.</span>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[.14em] text-[#E4C27E]">
        {title}
      </h2>
      {links.map(([label, href]) => (
        <Link
          className="flex min-h-9 items-center text-sm text-white/65 hover:text-white"
          href={href}
          key={label}
        >
          {label}
        </Link>
      ))}
    </div>
  )
}

function useSignedIn(pathname: string) {
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/session', { cache: 'no-store', signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { signedIn: false }))
      .then((result: { signedIn?: boolean }) => setSignedIn(Boolean(result.signedIn)))
      .catch(() => undefined)
    return () => controller.abort()
  }, [pathname])
  return signedIn
}

export function MobileTabs() {
  const pathname = usePathname()
  const signedIn = useSignedIn(pathname)
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t bg-white md:hidden"
      aria-label="Mobile shortcuts"
    >
      <Link className="mobile-tab" href="/">
        <Home />
        <span>Home</span>
      </Link>
      <Link className="mobile-tab" href="/personal">
        <UserRound />
        <span>Personal</span>
      </Link>
      <Link className="mobile-tab" href="/businesses">
        <Building2 />
        <span>Business</span>
      </Link>
      <Link className="mobile-tab" href="/account">
        <BriefcaseBusiness />
        <span>{signedIn ? 'Account' : 'Log in'}</span>
      </Link>
    </nav>
  )
}
