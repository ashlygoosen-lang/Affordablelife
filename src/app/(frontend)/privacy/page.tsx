import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy' }

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-[#F5F1E9] py-20">
        <div className="page-container">
          <p className="eyebrow">Privacy</p>
          <h1 className="display-title">
            Your information is part of the service, not the product.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F6D74]">
            This summary explains the current application design. Formal privacy wording must be
            approved by South African counsel before launch.
          </p>
        </div>
      </section>
      <section className="page-section">
        <div className="page-container grid gap-5 md:grid-cols-2">
          {[
            [
              'What we collect',
              'Contact, identity, application, payer, reference and supporting document information that you submit.',
            ],
            [
              'Why we use it',
              'To assess requirements, verify documents, communicate about availability and administer an eventual agreement.',
            ],
            [
              'Who can view it',
              'Application records and documents are private. Authorised staff review them; they are not publicly listed.',
            ],
            [
              'Your choices',
              'Optional marketing and testimonial consent is separate from required application declarations.',
            ],
            [
              'Security design',
              'Draft access uses a private resume token or a signed-in member account. Uploaded files use private, no-store delivery.',
            ],
            [
              'Contact',
              'Email hello@affordablelife.co.za for access, correction or privacy questions.',
            ],
          ].map(([title, text]) => (
            <article className="rounded-2xl border border-[#DCE3E1] bg-white p-7" key={title}>
              <h2 className="font-serif text-2xl font-semibold text-[#0E2A3B]">{title}</h2>
              <p className="mt-3 leading-7 text-[#68757A]">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
