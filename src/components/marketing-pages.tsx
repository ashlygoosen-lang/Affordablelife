import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CircleHelp,
  FileCheck2,
  HeartHandshake,
  MessageCircleMore,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import { CostCalculator, SuburbQuiz } from './discovery-tools'
import { PropertyForm } from './property-form'
import { SplitText } from './split-text'

export function PageHero({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string
  title: string
  text: string
  action?: { label: string; href: string }
}) {
  return (
    <section className="page-hero bg-[#F6F1E9] py-24">
      <div className="page-container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display-title max-w-4xl">
          <SplitText text={title} />
        </h1>
        <p className="page-hero-text mt-6 max-w-2xl text-lg leading-8 text-[#5C696F]">{text}</p>
        {action && (
          <Link className="primary-button mt-8" href={action.href}>
            {action.label}
            <ArrowRight />
          </Link>
        )}
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    ['Find your home', 'Search by city, suburb, budget and commute.'],
    ['Show interest', 'Choose a room and verify your identity. No payment is taken.'],
    ['Watch the group fill', 'Follow room-by-room progress and the expiry date.'],
    ['Group confirmed', 'Everyone receives the price summary and agreement.'],
    ['Live month to month', 'Pay your share and give notice under your agreement.'],
  ]
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Fill a home together. Pay only when it is full."
        text="Renting a premium home alone costs too much. Renting it as a group does not."
        action={{ label: 'Browse Homes', href: '/homes' }}
      />
      <section className="page-section">
        <div className="page-container grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {steps.map(([title, text], i) => (
            <article className="feature-card !p-6" key={title}>
              <span className="grid size-10 place-items-center rounded-full bg-[#C6A15B] font-bold">
                {i + 1}
              </span>
              <h2 className="mt-8 font-serif text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#657179]">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#0E2A3B] py-20 text-white">
        <div className="page-container grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow-light">The most important answer</p>
            <h2 className="section-title !text-white">What if the group does not fill?</h2>
          </div>
          <div>
            <strong className="font-serif text-3xl text-[#E5C079]">Nothing is charged.</strong>
            <p className="mt-4 leading-7 text-white/65">
              Keep waiting, switch homes, or leave at any time before confirmation. Every listing
              also shows when the group expires.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

const audience = {
  students: [
    'Student Plus',
    'Campus living, fully sorted.',
    'An academic-year product with a room, Wi-Fi, cleaning, security, parking, three meals and campus transport planned together.',
    [
      'Shorter campus commute',
      'Rent that matches your allowance',
      'Housemates who are also studying',
    ],
  ],
  visitors: [
    'Visitor and Short Stay',
    'Use the holidays. Keep the homes working.',
    'Nightly or weekly furnished rooms for visitors, interns, exchange students and contractors, used mainly during university holidays.',
    ['Nightly or weekly terms', 'Furnished and connected', 'Cleaning and security included'],
  ],
  professionals: [
    'Young Professional',
    'The address you want. The bills you can predict.',
    'A 6 or 12-month product with room, Wi-Fi, cleaning, security and parking. Meals and transport remain honest optional extras.',
    ['6 or 12-month terms', 'Five core costs planned', 'Optional meals and transport'],
  ],
  businesses: [
    'Business Office',
    'A practical office for the team you are building.',
    'Private and flexible offices for small businesses, project teams and growing companies, with connectivity and core property services itemised in one monthly quote.',
    ['Private and flexible offices', 'Terms from 6 to 24 months', 'One guided application'],
  ],
} as const

export function AudiencePage({ kind }: { kind: keyof typeof audience }) {
  const [eyebrow, title, text, benefits] = audience[kind]
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        text={text}
        action={{
          label: kind === 'businesses' ? 'Request an office' : 'Register interest',
          href: kind === 'businesses' ? '/interest?tier=business-office' : '/interest',
        }}
      />
      <section className="page-section">
        <div className="page-container grid gap-6 md:grid-cols-3">
          {benefits.map((benefit, i) => (
            <article className="feature-card" key={benefit}>
              <span className="grid size-12 place-items-center rounded-xl bg-[#E5EFEA] text-[#2E6F5E]">
                {i === 0 ? <Check /> : i === 1 ? <UsersRound /> : <Building2 />}
              </span>
              <h2 className="mt-8 font-serif text-2xl font-semibold">{benefit}</h2>
              <p className="mt-3 leading-7 text-[#657179]">
                {kind === 'businesses'
                  ? 'A clear requirement, private document review and an itemised offer before any lease is signed.'
                  : 'Verified homes, clear total prices and a group status you can understand at a glance.'}
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="pb-16">
        <div className="page-container rounded-2xl border border-[#C6A15B]/35 bg-[#F6F1E9] p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2E6F5E]">Agreement</p>
          <p className="mt-2 font-serif text-2xl text-[#0E2A3B]">
            {kind === 'students'
              ? 'Academic year · 10 to 12 months'
              : kind === 'professionals'
                ? '6 or 12 months · month-to-month at a higher price'
                : kind === 'businesses'
                  ? '6, 12 or 24 months · subject to office availability'
                  : 'Nightly or weekly · holiday and short-stay availability'}
          </p>
        </div>
      </section>
      {kind === 'students' && (
        <section className="page-section bg-[#0E2A3B] text-white">
          <div className="page-container grid gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow-light">Parents and guardians</p>
              <h2 className="section-title !text-white">Confidence for the whole family.</h2>
              <p className="mt-5 leading-7 text-white/65">
                Landlord, address and photo checks are visible on every listing. Payments begin only
                after the group confirms.
              </p>
            </div>
            <SuburbQuiz />
          </div>
        </section>
      )}
    </>
  )
}

export function PricingPage() {
  const rows = [
    ['Showing interest', 'Never', 'Free to join and leave before confirmation'],
    ['First month’s rent', 'When the group confirms', 'Room price plus included costs'],
    ['Deposit', 'When the group confirms', 'Protected and returned under the agreement'],
    ['Monthly rent', 'Every month', 'Card, instant EFT, debit order or supported PayShap'],
    ['Service fee', 'Before joining', 'Shown as a rand amount on every home'],
  ]
  return (
    <>
      <PageHero
        eyebrow="Pricing and fees"
        title="Simple, honest pricing."
        text="You see room rent, included costs and the total before you join. No charge until your group is full."
      />
      <section className="page-section">
        <div className="page-container overflow-hidden rounded-2xl border border-black/10">
          <div className="hidden grid-cols-3 bg-[#0E2A3B] p-5 text-xs font-bold uppercase tracking-widest text-white sm:grid">
            <span>Charge</span>
            <span>When charged</span>
            <span>Notes</span>
          </div>
          {rows.map((row) => (
            <div className="grid gap-2 border-b p-5 text-sm sm:grid-cols-3" key={row[0]}>
              <strong className="font-serif text-lg">{row[0]}</strong>
              <span>{row[1]}</span>
              <span className="text-[#657179]">{row[2]}</span>
            </div>
          ))}
        </div>
      </section>
      <CostCalculator />
    </>
  )
}

export function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety and trust"
        title="A shared home should still feel secure."
        text="Verification is shown on every listing, and there is a clear way to report a concern."
      />
      <section className="page-section">
        <div className="page-container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[
            [ShieldCheck, 'Verified homes', 'We check the address, landlord and property photos.'],
            [UserCheck, 'Verified people', 'Every member confirms their identity before joining.'],
            [
              UsersRound,
              'Compatibility questions',
              'Sleep, work, guests and smoking are discussed before confirmation.',
            ],
            [
              FileCheck2,
              'Fair agreements',
              'Plain-language summary, electronic signing and a downloadable copy.',
            ],
            [
              HeartHandshake,
              'Two-way reviews',
              'Members and partners can review the experience after move-in.',
            ],
            [
              MessageCircleMore,
              'Report and support',
              'Report a listing or dispute and receive a reply within one working day.',
            ],
          ].map(([Icon, title, text]) => (
            <article className="feature-card" key={title as string}>
              <Icon className="text-[#2E6F5E]" />
              <h2 className="mt-8 font-serif text-2xl font-semibold">{title as string}</h2>
              <p className="mt-3 leading-7 text-[#657179]">{text as string}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Affordable Life"
        title="Everyone deserves a good address."
        text="We make well-located, safe housing more reachable through verified shared living."
      />
      <section className="page-section">
        <div className="page-container grid gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="section-title">Started in Cape Town. Built for South Africa.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[#5F6D74]">
            <p>
              In South Africa, the best locations are often the hardest to afford. Affordable Life
              was started to change that.
            </p>
            <p>
              By bringing people together to share the cost of a home, we make premium
              neighbourhoods reachable for students, working people and visitors who would otherwise
              be priced out.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

export function HelpPage() {
  const faqs = [
    [
      'Am I charged when I show interest?',
      'No. You are charged only when the group is full and confirmed.',
    ],
    [
      'What happens if the group does not fill?',
      'Nothing is charged. You can wait, switch homes or leave.',
    ],
    [
      'Can I join with friends?',
      'Yes. Choose “With friends” when you join and tell us how many rooms you need.',
    ],
    [
      'How are homes verified?',
      'We check the landlord, address and photos before a listing goes live.',
    ],
    [
      'Which cities do you cover?',
      'Cape Town launches first. Other city pages remain hidden until a verified home is ready.',
    ],
  ]
  return (
    <>
      <PageHero
        eyebrow="Help and contact"
        title="Answers when you need them."
        text="Talk to our Cape Town team by WhatsApp, email or phone. We reply within one working day."
      />
      <section className="page-section">
        <div className="page-container grid gap-14 lg:grid-cols-[1fr_380px]">
          <div>
            {faqs.map(([q, a]) => (
              <details className="faq" key={q}>
                <summary>
                  {q}
                  <CircleHelp />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <aside className="rounded-2xl bg-[#F6F1E9] p-7">
            <h2 className="font-serif text-3xl">Talk to a real person.</h2>
            <p className="mt-4 leading-7 text-[#657179]">Monday to Friday, 08:30–17:00.</p>
            <a className="primary-button mt-6 w-full" href="https://wa.me/27215550142">
              <MessageCircleMore /> WhatsApp us
            </a>
            <a className="secondary-button mt-3 w-full" href="mailto:hello@affordablelife.co.za">
              Email support
            </a>
            <p className="mt-6 text-xs leading-6 text-[#657179]">
              Disputes are acknowledged within one working day and assigned to a named support
              person.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

export function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="For property partners"
        title="Fill your property, faster."
        text="Post your house or flat for review. We verify the property before a group of tenants can join."
        action={{ label: 'Post your property', href: '#post-property' }}
      />
      <section className="page-section">
        <div className="page-container grid gap-6 md:grid-cols-3">
          {[
            ['Full occupancy', 'Group demand helps fill every room.'],
            ['Verified tenants', 'Identity checks happen before confirmation.'],
            ['One organised process', 'Clear status, one agreement flow and reliable payouts.'],
          ].map(([title, text]) => (
            <article className="feature-card" key={title}>
              <BadgeCheck className="text-[#2E6F5E]" />
              <h2 className="mt-8 font-serif text-2xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-[#657179]">{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="post-property" className="scroll-mt-24 bg-[#0E2A3B] py-20 text-white">
        <div className="page-container grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow-light">Post a house</p>
            <h2 className="section-title !text-white">Start with the property details.</h2>
            <p className="mt-5 leading-7 text-white/65">
              Your submission stays private while our team checks ownership, the address, photos,
              rent expectations and local sharing rules.
            </p>
          </div>
          <PropertyForm />
        </div>
      </section>
    </>
  )
}
