'use client'

import { useId, useState } from 'react'
import { Magnetic } from '@/components/motion/Magnetic'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import {
  CONTACT_TOPICS,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from '@/lib/home/contact'

const fieldClass =
  'w-full min-w-0 rounded-md border border-line bg-surface px-3.5 py-3 font-sans text-base leading-snug text-fg placeholder:text-muted focus:border-accent aria-[invalid=true]:border-error'

type Status = { kind: 'idle' } | { kind: 'invalid' } | { kind: 'stub' }

/**
 * The contact form. Client-side validation with an inline error under each bad field. Sending is a
 * stub until Phase 7 connects it to Resend: a valid form says nothing was sent. `noValidate` turns
 * off the browser's own bubbles so the messages are ours and stay in the page.
 */
export function ContactForm() {
  const id = useId()
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const values: ContactValues = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      topic: String(data.get('topic') ?? ''),
      message: String(data.get('message') ?? ''),
    }
    const found = validateContact(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setStatus({ kind: 'invalid' })
      // Put the visitor on the first field to fix.
      const first = (['name', 'email', 'topic', 'message'] as const).find((key) => found[key])
      const control = first ? event.currentTarget.elements.namedItem(first) : null
      if (control instanceof HTMLElement) control.focus()
      return
    }
    setStatus({ kind: 'stub' })
  }

  /** Props shared by the inputs: the id, the error link and the invalid state. */
  const field = (name: keyof ContactValues) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': errors[name] ? (true as const) : undefined,
    'aria-describedby': errors[name] ? `${id}-${name}-error` : undefined,
    onChange: () => {
      if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }))
    },
  })

  const error = (name: keyof ContactValues) =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className="font-mono text-[0.8125rem] leading-snug text-error">
        {errors[name]}
      </p>
    ) : null

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="grid content-start gap-3.5"
      aria-label="Contact form"
    >
      <div className="grid gap-3.5 min-[481px]:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor={`${id}-name`} className="label">
            Name
          </label>
          <input {...field('name')} autoComplete="name" required className={fieldClass} />
          {error('name')}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor={`${id}-email`} className="label">
            Email
          </label>
          <input
            {...field('email')}
            type="email"
            autoComplete="email"
            required
            className={fieldClass}
          />
          {error('email')}
        </div>
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={`${id}-topic`} className="label">
          Topic
        </label>
        <select {...field('topic')} defaultValue={CONTACT_TOPICS[0]} className={fieldClass}>
          {CONTACT_TOPICS.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
        {error('topic')}
      </div>

      <div className="grid gap-1.5">
        <label htmlFor={`${id}-message`} className="label">
          Message
        </label>
        <textarea
          {...field('message')}
          required
          placeholder="What are you working on?"
          className={cn(fieldClass, 'min-h-[120px] resize-y')}
        />
        {error('message')}
      </div>

      <div className="flex flex-wrap items-center gap-3.5">
        <Magnetic>
          <Button type="submit">
            Send message <span aria-hidden="true">→</span>
          </Button>
        </Magnetic>
        <p
          role="status"
          className={cn(
            'font-mono text-[0.8125rem] leading-snug',
            status.kind === 'invalid' ? 'text-error' : 'text-muted'
          )}
        >
          {status.kind === 'invalid' ? 'Fix the highlighted fields and try again.' : null}
          {status.kind === 'stub'
            ? "Nothing was sent: the form isn't connected yet. Book a call instead."
            : null}
        </p>
      </div>
    </form>
  )
}
