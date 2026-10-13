import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSpring2D } from '@/lib/spring'

describe('createSpring2D', () => {
  let now = 0
  beforeEach(() => {
    now = 0
    vi.spyOn(performance, 'now').mockImplementation(() => now)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) =>
      setTimeout(() => cb((now += 16)), 0)
    )
    vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('moves toward the target and settles exactly on it', () => {
    const updates: [number, number][] = []
    const spring = createSpring2D((x, y) => updates.push([x, y]))
    spring.set(12, -6)
    vi.advanceTimersByTime(3000)

    expect(updates.at(-1)).toEqual([12, -6])
    expect(updates.length).toBeGreaterThan(5)
    // It started moving before it arrived.
    expect(updates[0]?.[0]).toBeGreaterThan(0)
    expect(updates[0]?.[0]).toBeLessThan(12)
  })

  it('springs back to zero', () => {
    let last: [number, number] = [0, 0]
    const spring = createSpring2D((x, y) => (last = [x, y]))
    spring.set(10, 10)
    vi.advanceTimersByTime(3000)
    spring.set(0, 0)
    vi.advanceTimersByTime(3000)
    expect(last).toEqual([0, 0])
  })

  it('jump moves instantly and stop cancels the loop', () => {
    const onUpdate = vi.fn()
    const spring = createSpring2D(onUpdate)
    spring.jump(5, 5)
    expect(onUpdate).toHaveBeenLastCalledWith(5, 5)

    spring.set(20, 20)
    spring.stop()
    onUpdate.mockClear()
    vi.advanceTimersByTime(1000)
    expect(onUpdate).not.toHaveBeenCalled()
  })
})
