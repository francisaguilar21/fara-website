export type SpringOptions = { stiffness?: number; damping?: number; mass?: number }

export type Spring2D = {
  /** Move the target. The value follows with a spring. */
  set: (x: number, y: number) => void
  /** Teleport to a position with no animation. */
  jump: (x: number, y: number) => void
  stop: () => void
}

const REST_DISTANCE = 0.05
const REST_SPEED = 0.05

/**
 * A small 2D spring driven by requestAnimationFrame, used where pulling in the whole animation
 * library (cursor, magnetic buttons) would cost more than the effect is worth. The loop sleeps once
 * the value settles.
 */
export function createSpring2D(
  onUpdate: (x: number, y: number) => void,
  { stiffness = 220, damping = 18, mass = 0.4 }: SpringOptions = {}
): Spring2D {
  let x = 0
  let y = 0
  let vx = 0
  let vy = 0
  let tx = 0
  let ty = 0
  let frame = 0
  let last = 0

  const tick = (now: number) => {
    // Cap the step so a background tab doesn't launch the value across the screen.
    const dt = Math.min((now - last) / 1000, 1 / 30)
    last = now

    vx += ((-stiffness * (x - tx) - damping * vx) / mass) * dt
    vy += ((-stiffness * (y - ty) - damping * vy) / mass) * dt
    x += vx * dt
    y += vy * dt
    onUpdate(x, y)

    const settled =
      Math.abs(x - tx) < REST_DISTANCE &&
      Math.abs(y - ty) < REST_DISTANCE &&
      Math.abs(vx) < REST_SPEED &&
      Math.abs(vy) < REST_SPEED
    if (settled) {
      x = tx
      y = ty
      vx = vy = 0
      onUpdate(x, y)
      frame = 0
    } else {
      frame = requestAnimationFrame(tick)
    }
  }

  const wake = () => {
    if (frame) return
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }

  return {
    set(nextX, nextY) {
      tx = nextX
      ty = nextY
      wake()
    },
    jump(nextX, nextY) {
      x = tx = nextX
      y = ty = nextY
      vx = vy = 0
      onUpdate(x, y)
    },
    stop() {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
