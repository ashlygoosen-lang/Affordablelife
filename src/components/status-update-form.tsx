'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'

type Result = { ok: boolean; message: string }

/** Compact inline form used by partners and staff to move a request along. */
export function StatusUpdateForm({
  id,
  status,
  note,
  action,
}: {
  id: string
  status: string
  note?: string | null
  action: (formData: FormData) => Promise<Result>
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<Result | null>(null)
  return (
    <form
      className="mt-3 grid gap-2 sm:grid-cols-[170px_1fr_auto]"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(async () => {
          const next = await action(formData)
          setResult(next)
          if (next.ok) router.refresh()
        })
      }}
    >
      <input type="hidden" name="id" value={id} />
      <label className="sr-only" htmlFor={`status-${id}`}>Status</label>
      <select id={`status-${id}`} name="status" defaultValue={status} className="min-h-10 rounded-lg border border-[#D3DCE0] bg-white px-2 text-sm">
        <option value="open">Open</option>
        <option value="in-progress">In progress</option>
        <option value="scheduled">Scheduled</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
      <label className="sr-only" htmlFor={`note-${id}`}>Note for the tenant</label>
      <input id={`note-${id}`} name="resolutionNote" defaultValue={note ?? ''} placeholder="Note for the tenant (optional)" className="min-h-10 rounded-lg border border-[#D3DCE0] bg-white px-3 text-sm" />
      <button className="secondary-button !min-h-10 !px-4 !text-xs" disabled={pending} type="submit">
        {pending && <LoaderCircle className="animate-spin" size={14} />} Save
      </button>
      {result && (
        <p className={`text-xs sm:col-span-3 ${result.ok ? 'text-[#22594B]' : 'text-[#A83E1F]'}`} role="status">
          {result.message}
        </p>
      )}
    </form>
  )
}
