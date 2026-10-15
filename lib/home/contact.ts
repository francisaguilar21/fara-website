export const CONTACT_TOPICS = [
  'Hiring',
  'A project',
  'Speaking',
  'Running',
  'Just saying hi',
] as const

export type ContactTopic = (typeof CONTACT_TOPICS)[number]

export type ContactValues = { name: string; email: string; topic: string; message: string }
export type ContactErrors = Partial<Record<keyof ContactValues, string>>

const MIN_MESSAGE = 10

/**
 * Checks the contact form on the client. Phase 7 validates again on the server with Zod; this only
 * saves a round trip and tells the visitor what to fix. Returns one message per bad field, and
 * an empty object when everything is fine.
 */
export function validateContact({ name, email, topic, message }: ContactValues): ContactErrors {
  const errors: ContactErrors = {}
  if (!name.trim()) errors.name = 'Add your name.'
  if (!email.trim()) errors.email = 'Add your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Check your email: it should look like name@example.com.'
  }
  if (!(CONTACT_TOPICS as readonly string[]).includes(topic)) errors.topic = 'Pick a topic.'
  if (!message.trim()) errors.message = 'Write a short message.'
  else if (message.trim().length < MIN_MESSAGE) {
    errors.message = `Say a little more (at least ${MIN_MESSAGE} characters).`
  }
  return errors
}
