"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"

export interface DustTrailHandle {
  tick: (velocity: number) => void
}

interface DustParticle {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

// Capped at 40 particles desktop, 0 mobile per Step 2 budget
const POOL_SIZE = 40

interface DustTrailProps {
  velocity?: number
  reducedMotion?: boolean
  className?: string
}

const DustTrail = forwardRef<DustTrailHandle, DustTrailProps>(function DustTrail(
  { reducedMotion = false, className = "" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<DustParticle[]>([])
  const isMobileOrLowPowerRef = useRef(false)

  useEffect(() => {
    if (reducedMotion) return

    // Mobile & low-power check: disable dust below 768px or concurrency <= 4
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || Boolean(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4))
    isMobileOrLowPowerRef.current = isMobile

    if (isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Cap devicePixelRatio at 1.5 per Step 2 requirement
    const dpr = Math.min(1.5, window.devicePixelRatio || 1)
    canvas.width = Math.round(240 * dpr)
    canvas.height = Math.round(80 * dpr)
    ctx.scale(dpr, dpr)

    poolRef.current = Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      opacity: 0,
      life: 0,
      maxLife: 1,
    }))
  }, [reducedMotion])

  useImperativeHandle(
    ref,
    () => ({
      tick: (velocity: number) => {
        if (reducedMotion || isMobileOrLowPowerRef.current) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const absVel = Math.abs(velocity)
        const pool = poolRef.current

        // Skip drawing when velocity is near zero and no particles active
        let anyActive = false
        for (let i = 0; i < pool.length; i++) {
          if (pool[i].active) {
            anyActive = true
            break
          }
        }
        if (absVel < 0.2 && !anyActive) {
          return
        }

        ctx.clearRect(0, 0, 240, 80)

        // Spawn new particles proportional to scroll speed
        if (absVel > 0.2) {
          const toSpawn = Math.min(3, Math.ceil(absVel * 0.25))
          let spawned = 0

          for (let i = 0; i < pool.length && spawned < toSpawn; i++) {
            const p = pool[i]
            if (!p.active) {
              p.active = true
              p.x = 240 - 24 + (Math.random() * 8 - 4)
              p.y = 80 - 14 + (Math.random() * 6 - 3)
              p.vx = -1.2 - Math.random() * (1.5 + Math.min(2.5, absVel * 0.15))
              p.vy = -0.3 - Math.random() * 0.6
              p.size = 2.5 + Math.random() * 3.5
              p.maxLife = 20 + Math.random() * 16
              p.life = 0
              p.opacity = 0.08 + Math.random() * 0.16
              spawned++
            }
          }
        }

        // Update and draw active particles
        for (let i = 0; i < pool.length; i++) {
          const p = pool[i]
          if (!p.active) continue

          p.life++
          if (p.life >= p.maxLife) {
            p.active = false
            continue
          }

          p.x += p.vx
          p.y += p.vy
          p.vy *= 0.98
          p.size += 0.08

          const progress = p.life / p.maxLife
          const currentOpacity = p.opacity * (1 - progress)

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(234, 223, 200, ${currentOpacity})`
          ctx.fill()
        }
      },
    }),
    [reducedMotion]
  )

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "240px", height: "80px" }}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  )
})

export default DustTrail
