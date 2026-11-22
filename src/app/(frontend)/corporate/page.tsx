import type { Metadata } from 'next'
import { SplitText } from '@/components/split-text'
import Link from 'next/link'
import { ArrowRight, Building2, GraduationCap, Handshake, Hotel, UsersRound } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Corporate accommodation and workspace',
  description:
    'Managed accommodation and workspace requirements for employers, institutions and funders.',
}

export default function CorporatePage() {
  return (
    <>
      <section className="bg-[#0E2A3B] py-20 text-white">
        <div className="page-container">
          <p className="eyebrow-light">Corporate</p>
          <h1 className="max-w-4xl font-serif text-5xl font-semibold leading-tight sm:text-7xl">
            <SplitText text="One organised route for teams, talent and institutions." />
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Coordinate employee accommodation, graduate placements, funded students and project
            workspaces through a single requirements file and named review process.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="primary-button" href="/account?mode=register&type=corporate">
              Create corporate account <ArrowRight size={18} />
            </Link>
            <a
              className="secondary-button !border-white/25 !bg-white/10 !text-white"
              href="mailto:hello@affordablelife.co.za?subject=Corporate space requirement"
            >
              Talk to the corporate desk
            </a>
          </div>
        </div>
      </section>
      <section className="page-section">
        <div className="page-container">
          <div className="section-heading">
            <p className="eyebrow">Use cases</p>
            <h2 className="section-title">Space programmes that stay understandable.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                UsersRound,
                'Employee housing',
                'Relocation and fixed-term accommodation requirements.',
              ],
              [
                GraduationCap,
                'Graduate programmes',
                'Housing for interns, trainees and graduate cohorts.',
              ],
              [
                Building2,
                'Project offices',
                'Flexible office requirements for temporary and growing teams.',
              ],
              [
                Hotel,
                'Short assignments',
                'Furnished stays for consultants, contractors and visiting teams.',
              ],
            ].map(([Icon, title, text]) => (
              <article className="feature-card" key={title as string}>
                <Icon className="text-[#2E6F5E]" />
                <h2 className="mt-7 font-serif text-2xl font-semibold">{title as string}</h2>
                <p className="mt-3 text-sm leading-6 text-[#68757A]">{text as string}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#F5F1E9] py-20">
        <div className="page-container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Handshake className="text-[#C2502A]" size={34} />
            <h2 className="section-title mt-5">Human review, not automatic rejection.</h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-[#5F6D74]">
            <p>
              Corporate requirements are reviewed against location, term, team size, payer structure
              and document readiness.
            </p>
            <p>
              Final pricing, service levels and legal agreements are confirmed in a separate written
              offer. No deposit is collected through an enquiry.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
