'use client'

import { startTransition, type FormEvent } from 'react'

/**
 * React 19 resets uncontrolled inputs after a `<form action={fn}>` submission,
 * which wipes what the visitor typed whenever the server returns validation
 * errors. Submitting through onSubmit keeps their input intact while still
 * driving the same useActionState action (pending state included).
 */
export function submitWithoutReset(
  action: (formData: FormData) => void,
  beforeSubmit?: (formData: FormData) => void,
) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    beforeSubmit?.(formData)
    startTransition(() => action(formData))
  }
}
