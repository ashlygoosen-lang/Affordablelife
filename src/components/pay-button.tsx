'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle, LockKeyhole } from 'lucide-react'
import { startCheckout } from '@/app/(frontend)/pay/actions'

/** Signs the checkout on the server, then posts the visitor to PayFast. */
export function PayButton({ invoiceId, token, label }: { invoiceId: string; token?: string; label: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [checkout, setCheckout] = useState<{ action: string; fields: [string, string][] } | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (checkout) formRef.current?.submit()
  }, [checkout])

  return (
    <div>
      <button
        type="button"
        className="primary-button w-full !min-h-14 !text-[15px]"
        disabled={pending || Boolean(checkout)}
        onClick={() => {
          setError('')
          startTransition(async () => {
            const result = await startCheckout(invoiceId, token)
            if (result.ok) setCheckout({ action: result.action, fields: result.fields })
            else setError(result.message)
          })
        }}
      >
        {pending || checkout ? <LoaderCircle className="animate-spin" size={18} /> : <LockKeyhole size={18} />}
        {checkout ? 'Opening PayFast…' : label}
      </button>
      {error && (
        <p className="mt-3 text-sm font-medium text-[#A83E1F]" role="alert">
          {error}
        </p>
      )}
      {checkout && (
        <form ref={formRef} action={checkout.action} method="post" className="hidden">
          {checkout.fields.map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        </form>
      )}
    </div>
  )
}

/** After returning from PayFast, refresh until the notification marks the invoice paid. */
export function PaymentPoller({ active }: { active: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (!active) return
    let count = 0
    const timer = window.setInterval(() => {
      count += 1
      router.refresh()
      if (count >= 20) window.clearInterval(timer)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [active, router])
  return null
}
