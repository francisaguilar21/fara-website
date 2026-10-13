import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CertList } from '@/components/home/CertList'
import { ContactForm } from '@/components/home/ContactForm'
import { QuoteCarousel, type Quote } from '@/components/home/QuoteCarousel'
import { CONTACT_TOPICS, validateContact } from '@/lib/home/contact'

const quotes: Quote[] = [1, 2, 3].map((n) => ({
  quote: `Quote number ${n}.`,
  name: `Person ${n}`,
  role: 'Role',
  company: 'Company',
  relationship: 'Worked together',
  draft: n === 1,
}))

const dots = () => screen.getAllByRole('tab')
const selected = () => dots().findIndex((dot) => dot.getAttribute('aria-selected') === 'true')
const shown = () =>
  screen
    .getAllByRole('tabpanel', { hidden: true })
    .filter((panel) => panel.getAttribute('aria-hidden') !== 'true')

describe('QuoteCarousel', () => {
  it('shows one quote at a time, with one labelled dot per quote', () => {
    render(<QuoteCarousel quotes={quotes} />)
    expect(screen.getByRole('tablist', { name: 'Recommendations' })).toBeInTheDocument()
    expect(dots()).toHaveLength(3)
    expect(dots()[1]).toHaveAccessibleName('Recommendation 2 of 3, from Person 2')
    expect(selected()).toBe(0)
    expect(shown()).toHaveLength(1)
    expect(shown()[0]).toHaveTextContent('Quote number 1.')
    expect(within(shown()[0]!).getByText('draft')).toBeInTheDocument()
  })

  it('switches quote when a dot is clicked, and links each dot to its quote', async () => {
    render(<QuoteCarousel quotes={quotes} />)
    await userEvent.click(dots()[2]!)
    expect(selected()).toBe(2)
    expect(shown()[0]).toHaveTextContent('Quote number 3.')
    expect(dots()[2]).toHaveAttribute('aria-controls', shown()[0]!.id)
    expect(shown()[0]).toHaveAttribute('aria-labelledby', dots()[2]!.id)
  })

  it('moves with the arrow keys, wraps round, and jumps with Home and End', async () => {
    render(<QuoteCarousel quotes={quotes} />)
    dots()[0]!.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(selected()).toBe(1)
    expect(dots()[1]).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(selected()).toBe(2) // wrapped from the first to the last
    expect(dots()[2]).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(selected()).toBe(0)
    await userEvent.keyboard('{End}')
    expect(selected()).toBe(2)
    // Only the selected dot is in the tab order.
    expect(dots().map((dot) => dot.tabIndex)).toEqual([-1, -1, 0])
  })

  it('swipes: left for the next quote, right for the previous, and ignores a short drag', () => {
    const { container } = render(<QuoteCarousel quotes={quotes} />)
    const area = container.firstElementChild!.firstElementChild!
    const swipe = (from: number, to: number) => {
      fireEvent.pointerDown(area, { clientX: from })
      fireEvent.pointerUp(area, { clientX: to })
    }
    swipe(300, 200)
    expect(selected()).toBe(1)
    swipe(200, 205)
    expect(selected()).toBe(1)
    swipe(100, 220)
    expect(selected()).toBe(0)
  })

  it('has no dots for a single quote', () => {
    render(<QuoteCarousel quotes={quotes.slice(0, 1)} />)
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.getByText('Quote number 1.')).toBeInTheDocument()
  })

  it('renders every quote as a plain list in the server HTML, for JavaScript off', () => {
    const html = renderToString(<QuoteCarousel quotes={quotes} />)
    for (const n of [1, 2, 3]) expect(html).toContain(`Quote number ${n}.`)
    expect(html).not.toContain('role="tablist"')
    expect(html).not.toContain('opacity-0')
  })
})

describe('CertList', () => {
  it('lists name, issuer and year, and a verify link when there is one', () => {
    render(
      <CertList
        certifications={[
          { name: 'Cert A', issuer: 'Issuer', year: 2025, credentialUrl: 'https://example.com/a' },
          { name: 'Cert B', issuer: 'Other', year: 2024, draft: true },
        ]}
      />
    )
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Issuer · 2025')
    expect(within(items[0]!).getByRole('link', { name: 'Verify Cert A' })).toHaveAttribute(
      'href',
      'https://example.com/a'
    )
    expect(within(items[1]!).queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(/Certifications/)
    expect(screen.getByText('draft')).toBeInTheDocument()
  })

  it('renders nothing without certifications', () => {
    const { container } = render(<CertList certifications={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('validateContact', () => {
  const valid = {
    name: 'Ada',
    email: 'ada@example.com',
    topic: 'Hiring',
    message: 'Hello, I would like to talk.',
  }

  it('accepts a complete form', () => {
    expect(validateContact(valid)).toEqual({})
  })

  it('asks for each empty field', () => {
    const errors = validateContact({ name: ' ', email: '', topic: 'Hiring', message: '' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('rejects an email that is not one, and a message that is too short', () => {
    for (const email of ['ada', 'ada@', 'ada@example', 'a da@example.com', '@example.com']) {
      expect(validateContact({ ...valid, email }).email).toBeTruthy()
    }
    expect(validateContact({ ...valid, message: 'Hi' }).message).toMatch(/at least 10/)
  })

  it('only takes the five topics', () => {
    for (const topic of CONTACT_TOPICS) expect(validateContact({ ...valid, topic })).toEqual({})
    expect(validateContact({ ...valid, topic: 'Spam' }).topic).toBeTruthy()
  })
})

describe('ContactForm', () => {
  const fill = async (values: { name?: string; email?: string; message?: string }) => {
    if (values.name) await userEvent.type(screen.getByLabelText('Name'), values.name)
    if (values.email) await userEvent.type(screen.getByLabelText('Email'), values.email)
    if (values.message) await userEvent.type(screen.getByLabelText('Message'), values.message)
  }

  it('has the four fields, with the five topics', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText('Name')).toBeRequired()
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    const topics = within(screen.getByLabelText('Topic')).getAllByRole('option')
    expect(topics.map((option) => option.textContent)).toEqual([...CONTACT_TOPICS])
    expect(screen.getByLabelText('Message')).toBeRequired()
  })

  it('shows an inline error under each bad field, linked to it, and focuses the first', async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole('button', { name: /Send message/ }))
    const name = screen.getByLabelText('Name')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAccessibleDescription('Add your name.')
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('Add your email.')
    expect(screen.getByLabelText('Message')).toHaveAccessibleDescription('Write a short message.')
    expect(name).toHaveFocus()
    expect(screen.getByRole('status')).toHaveTextContent('Fix the highlighted fields')
    expect(screen.queryByText(/Nothing was sent/)).not.toBeInTheDocument()
  })

  it('clears a field’s error as soon as it is edited', async () => {
    render(<ContactForm />)
    await userEvent.click(screen.getByRole('button', { name: /Send message/ }))
    await userEvent.type(screen.getByLabelText('Name'), 'A')
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
    expect(screen.queryByText('Add your name.')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('says nothing was sent when the form is valid (the submit is a stub)', async () => {
    render(<ContactForm />)
    await fill({ name: 'Ada', email: 'ada@example.com', message: 'Hello, let us talk.' })
    await userEvent.click(screen.getByRole('button', { name: /Send message/ }))
    expect(screen.getByRole('status')).toHaveTextContent('Nothing was sent')
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
  })

  it('flags a bad email on its own', async () => {
    render(<ContactForm />)
    await fill({ name: 'Ada', email: 'ada@', message: 'Hello, let us talk.' })
    await userEvent.click(screen.getByRole('button', { name: /Send message/ }))
    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription(/should look like/)
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')
  })
})
