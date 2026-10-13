'use client'

import { useState } from 'react'
import { Magnetic } from '@/components/motion/Magnetic'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { useSlashWipe } from '@/components/motion/SlashWipe'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { SimulatedReducedMotion, useMotionEnabled } from '@/lib/motion'

export function MotionDemos() {
  const [simulate, setSimulate] = useState(false)

  return (
    <SimulatedReducedMotion.Provider value={simulate ? true : null}>
      <label className="mb-8 inline-flex cursor-pointer items-center gap-3 rounded-full border border-line px-4 py-2">
        <input
          type="checkbox"
          checked={simulate}
          onChange={(event) => setSimulate(event.target.checked)}
          className="size-4 accent-accent"
        />
        <span className="small">Simulate reduced motion (these demos only)</span>
      </label>

      <Status />

      <div className="grid gap-10 lg:grid-cols-2">
        <Demo name="<Reveal stagger /> (scroll it into view)">
          <Reveal stagger={0.06} className="grid gap-2">
            {['One', 'Two', 'Three', 'Four'].map((item) => (
              <p key={item} className="border border-line px-4 py-3">
                {item}
              </p>
            ))}
          </Reveal>
        </Demo>

        <Demo name="<Parallax offset={40} /> (scroll the page)">
          <div className="h-56 overflow-hidden border border-line">
            <Parallax offset={40}>
              <div className="h-[130%] bg-[linear-gradient(135deg,var(--accent)_0%,var(--surface)_60%)] pt-24 text-center">
                <span className="label">moves ±40px</span>
              </div>
            </Parallax>
          </div>
        </Demo>

        <Demo name="<Magnetic /> (hover with a mouse)">
          <div className="flex flex-wrap gap-6 py-4">
            <Magnetic>
              <Button>Pulls ≤ 12px</Button>
            </Magnetic>
            <Magnetic strength={24}>
              <Button variant="ghost">Pulls ≤ 24px</Button>
            </Magnetic>
          </div>
        </Demo>

        <Demo name='Cursor label: data-cursor="View"'>
          <div
            data-cursor="View"
            className="grid h-40 place-items-center border border-line text-muted"
          >
            Hover with a mouse
          </div>
        </Demo>

        <Demo name="<SlashWipe />">
          <WipeButton />
        </Demo>
      </div>
    </SimulatedReducedMotion.Provider>
  )
}

function Status() {
  const motion = useMotionEnabled()
  const mouse = useMotionEnabled({ pointer: 'fine' })
  return (
    <p className="mb-8 data text-sm text-muted">
      motion: {motion ? 'on' : 'off'} · magnetic and cursor: {mouse ? 'on' : 'off'}
    </p>
  )
}

function WipeButton() {
  const wipe = useSlashWipe()
  return (
    <Button variant="ghost" onClick={() => wipe(() => {})}>
      Play the wipe
    </Button>
  )
}

function Demo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div>
      <Label as="p" className="mb-3">
        {name}
      </Label>
      {children}
    </div>
  )
}
