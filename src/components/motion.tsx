'use client'

/**
 * Affordable Life motion system. One small engine, no libraries.
 *
 *  - scroll reveals with stagger, applied automatically to content blocks on marketing pages
 *  - count-up rand figures (the receipt total, calculator results)
 *  - hero parallax and a soft pointer light (desktop only)
 *  - magnetic primary buttons and gentle card tilt (fine pointers only)
 *  - route progress line and page-enter on every client navigation
 *
 * Content is fully visible without JavaScript. Hidden start states only apply once <html>
 * carries the `motion` class, which is never added with reduced motion or in low-data mode.
 */

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const REVEAL = [
  '.section-heading',
  '.feature-card',
  '.audience-tile',
  '.listing-card',
  '.content-section',
  '.faq',
  '.cost-lines',
  '.page-section .grid > :not(.feature-card):not(.audience-tile):not(.listing-card)',
  '.reveal',
].join(',')

const COUNT = '[data-count]'
// Account, dashboards and payment flows are tools: keep them calm and instant.
const APP_ROUTES = /^\/(account|ops|pay|apply|partner\/|partners\/dashboard|admin)/

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches
const lowData = () => document.documentElement.dataset.lowData === 'true'

let started = false
let io: IntersectionObserver
let countIo: IntersectionObserver

function tag(root: ParentNode) {
  if (APP_ROUTES.test(location.pathname)) return
  root.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
    if (el.dataset.reveal || el.dataset.revealed) return
    if (el.closest('[data-reveal],[data-revealed]') && !el.matches('.listing-card,.feature-card,.audience-tile')) return
    el.dataset.reveal = 'up'
    const parent = el.parentElement
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => (c as HTMLElement).matches?.(REVEAL))
      const i = sibs.indexOf(el)
      if (sibs.length > 1 && i > 0) el.style.setProperty('--i', String(Math.min(i, 8)))
    }
    io.observe(el)
  })
  root.querySelectorAll<HTMLElement>(COUNT).forEach((el) => {
    if (el.dataset.counted) return
    el.dataset.counted = '1'
    countIo.observe(el)
  })
}

function countUp(el: HTMLElement) {
  const final = el.textContent || ''
  const m = final.match(/^(\D*)(\d(?:[\d\s\u00a0,]*\d)?)(.*)$/)
  if (!m) return
  const [, pre, digits, post] = m
  const target = Number(digits.replace(/[^\d]/g, ''))
  if (!target) return
  const sep = digits.match(/[\s\u00a0,]/)?.[0] ?? ''
  el.style.minWidth = `${el.getBoundingClientRect().width}px`
  el.style.display = el.style.display || 'inline-block'
  const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep)
  const dur = 1300
  const t0 = performance.now()
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / dur)
    el.textContent = pre + fmt(Math.round(target * (1 - Math.pow(1 - p, 4)))) + post
    if (p < 1) requestAnimationFrame(step)
    else {
      el.textContent = final
      el.style.minWidth = ''
    }
  }
  requestAnimationFrame(step)
}

let raf = 0
function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    const y = Math.min(scrollY, 1200)
    document.documentElement.style.setProperty('--scroll', String(y))
    document.documentElement.classList.toggle('is-scrolled', y > 24)
  })
}

const TILT = '.listing-card, .audience-tile, .feature-card'
const MAGNET = '.hero-actions .primary-button, .hero-actions .secondary-button, .magnetic'

function onPointerMove(e: PointerEvent) {
  const t = e.target as HTMLElement
  const hero = t.closest<HTMLElement>('.al-hero')
  if (hero) {
    const r = hero.getBoundingClientRect()
    hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
    hero.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const mag = t.closest<HTMLElement>(MAGNET)
  if (mag) {
    const r = mag.getBoundingClientRect()
    mag.style.setProperty('--tx', `${(((e.clientX - r.left) / r.width - 0.5) * 10).toFixed(2)}px`)
    mag.style.setProperty('--ty', `${(((e.clientY - r.top) / r.height - 0.5) * 8).toFixed(2)}px`)
    mag.classList.add('is-magnet')
  }
  const card = t.closest<HTMLElement>(TILT)
  if (card) {
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    card.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`)
    card.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`)
    card.style.setProperty('--gx', `${(px + 0.5) * 100}%`)
    card.style.setProperty('--gy', `${(py + 0.5) * 100}%`)
  }
}
function onPointerOut(e: PointerEvent) {
  const t = e.target as HTMLElement
  const rel = e.relatedTarget as Node | null
  const mag = t.closest<HTMLElement>('.is-magnet')
  if (mag && !mag.contains(rel)) {
    mag.style.removeProperty('--tx')
    mag.style.removeProperty('--ty')
    mag.classList.remove('is-magnet')
  }
  const card = t.closest<HTMLElement>(TILT)
  if (card && !card.contains(rel)) {
    card.style.removeProperty('--rx')
    card.style.removeProperty('--ry')
  }
}

function start() {
  if (started || reduced() || lowData()) return
  started = true
  const html = document.documentElement
  html.classList.add('motion')

  io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue
        const el = en.target as HTMLElement
        el.classList.add('is-in')
        io.unobserve(el)
        const delay = Number(el.style.getPropertyValue('--i') || 0) * 70
        // hand the element back to its own hover transitions once it has arrived
        setTimeout(() => {
          el.dataset.revealed = '1'
          delete el.dataset.reveal
          el.style.removeProperty('--i')
        }, 1600 + delay)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  countIo = new IntersectionObserver(
    (entries) => {
      for (const en of entries)
        if (en.isIntersecting) {
          const el = en.target as HTMLElement
          setTimeout(() => countUp(el), Number(el.dataset.countDelay || 0))
          countIo.unobserve(en.target)
        }
    },
    { threshold: 0.6 },
  )

  let queued = false
  new MutationObserver(() => {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      tag(document)
    })
  }).observe(document.getElementById('main-content') || document.body, { childList: true, subtree: true })
  tag(document)

  addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  if (finePointer()) {
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
  }
  // switching low-data mode on later stops everything immediately
  new MutationObserver(() => {
    if (lowData()) {
      html.classList.remove('motion')
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'))
    }
  }).observe(html, { attributes: true, attributeFilter: ['data-low-data'] })
}

export function Motion() {
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    start()
  }, [])

  useEffect(() => {
    // the first page has its own entrance; transitions are for navigation
    if (first.current) {
      first.current = false
      return
    }
    const html = document.documentElement
    if (!html.classList.contains('motion')) return
    const bar = document.querySelector<HTMLElement>('.route-progress')
    const main = document.getElementById('main-content')
    for (const el of [bar, main]) {
      if (!el) continue
      el.classList.remove('is-running')
      void el.offsetWidth
      el.classList.add('is-running')
    }
    requestAnimationFrame(() => tag(document))
  }, [pathname])

  return <div className="route-progress" aria-hidden="true" />
}
