'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle, RefreshCcw } from 'lucide-react'
import { recordEftPayment, runBillingNow } from '@/app/(frontend)/ops/actions'

export function RunBillingButton() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  return (
    <div className="flex items-center gap-3">
      {message && <span className="text-xs text-[#5F6D74]" role="status">{message}</span>}
      <button
        type="button"
        className="secondary-button !min-h-11 !px-4"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await runBillingNow()
            setMessage(result.message)
            router.refresh()
          })
        }
      >
        {pending ? <LoaderCircle className="animate-spin" size={16} /> : <RefreshCcw size={16} />} Run billing now
      </button>
    </div>
  )
}

export function RecordEftForm({ id }: { id: string }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [open, setOpen] = useState(false)
  if (!open)
    return (
      <button type="button" className="text-xs font-semibold text-[#C2502A]" onClick={() => setOpen(true)}>
        Record EFT
      </button>
    )
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(async () => {
          const result = await recordEftPayment(formData)
          setMessage(result.message)
          if (result.ok) router.refresh()
        })
      }}
    >
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`ref-${id}`}>Bank reference</label>
      <input id={`ref-${id}`} name="reference" placeholder="Bank reference" className="min-h-9 w-36 rounded-lg border border-[#D3DCE0] px-2 text-xs" />
      <button className="primary-button !min-h-9 !px-3 !text-xs" disabled={pending} type="submit">
        {pending ? <LoaderCircle className="animate-spin" size={14} /> : 'Mark paid'}
      </button>
      {message && <span className="text-xs text-[#5F6D74]">{message}</span>}
    </form>
  )
}
