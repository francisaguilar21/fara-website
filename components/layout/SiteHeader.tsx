'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/cn'
import { Container } from './Container'
import { NAV_LINKS } from './nav'
import { ThemeToggle } from './ThemeToggle'

const HIDE_AFTER_PX = 200

const navLinkClass =
  'text-muted hover:text-fg font-mono text-[0.8125rem] leading-none font-medium transition-colors before:text-accent before:mr-0.5 before:opacity-0 before:transition-opacity before:content-["/"] hover:before:opacity-100 focus-visible:before:opacity-100'

/** Hides on scroll down (after 200px) and shows again on scroll up. */
function useHideOnScroll(disabled: boolean) {
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > lastY.current && y > HIDE_AFTER_PX) setHidden(true)
      else if (y < lastY.current) setHidden(false)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return hidden && !disabled
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const hidden = useHideOnScroll(menuOpen)

  // Lock page scroll and close on Escape while the full-screen menu is open.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={cn(
          'sticky top-[env(safe-area-inset-top,0px)] z-40 border-b border-line bg-bg/[0.82] backdrop-blur-[10px] transition-transform duration-[400ms] ease-out-quint focus-within:translate-y-0',
          hidden && '-translate-y-full'
        )}
      >
        <Container className="flex h-16 items-center gap-6">
          <Link href="/" aria-label="Francis Aguilar, home" className="text-fg hover:text-accent">
            <Logo accent />
          </Link>

          <nav aria-label="Primary" className="ml-auto hidden gap-[22px] min-[760px]:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2.5 min-[760px]:ml-0">
            <ThemeToggle />
            <Button href="/contact" size="sm" className="hidden min-[760px]:inline-flex">
              Let&apos;s talk
            </Button>
            <button
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-[38px] cursor-pointer place-items-center rounded-full border border-line bg-transparent text-fg hover:border-accent hover:text-accent min-[760px]:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X className="size-4" aria-hidden="true" />
              ) : (
                <Menu className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* A sibling of <header>: its backdrop-filter would otherwise trap this fixed panel. */}
      {/* Static for now. The slash wipe opens and closes it from PR 3. */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 top-16 bottom-0 z-40 bg-bg min-[760px]:hidden"
      >
        <Container as="nav" aria-label="Mobile" className="flex flex-col gap-2 pt-10">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 h1 hover:text-accent"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-accent">/</span>
              {link.label}
            </Link>
          ))}
          <Button href="/contact" className="mt-8 self-start" onClick={() => setMenuOpen(false)}>
            Let&apos;s talk
          </Button>
        </Container>
      </div>
    </>
  )
}
