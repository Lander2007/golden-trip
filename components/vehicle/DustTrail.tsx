"use client"

// Particle pool - pre-allocated to prevent GC stutter
// Cap at ~60fps

// Spawn new particles proportional to scroll speed
// Origin at right edge of canvas (rear tire ground contact)
// Low opacity sand dust

// Update and draw active particles
// Soft expansion as dust billows
// Warm sand color: #EADFC8 (rgba: 234, 223, 200)

import { useEffect, useRef } from "react"

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

const POOL_SIZE = 75

export default function DustTrail({
  velocity = 0,
  reducedMotion = false,
  className = "",
}: {
  velocity?: number
  reducedMotion?: boolean
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const velRef = useRef(velocity)
  velRef.current = velocity

  useEffect(() => {
    if (reducedMotion) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const pool: DustParticle[] = Array.from({ length: POOL_SIZE }, () => ({
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

    let animId: number
    let lastTime = performance.now()
    let isHidden = document.hidden

    const handleVisibility = () => {
      isHidden = document.hidden
      if (!isHidden) lastTime = performance.now()
    }
    document.addEventListener("visibilitychange", handleVisibility)

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop)
      if (isHidden) return

      const elapsed =
        now -
        lastTime
      if (
        elapsed <
        16
      )
        return
      lastTime = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const absVel = Math.abs(velRef.current)
      const moving =
        absVel >
        0.2
      if (moving) {
        const toSpawn = Math.min(
          5,
          Math.ceil(
            absVel *
              0.35,
          ),
        )
        let spawned = 0

        for (
          let i = 0;
          i <
            POOL_SIZE &&
          spawned <
            toSpawn;
          i++
        ) {
          const p = pool[i]
          if (!p.active) {
            p.active = true
            p.x = canvas.width - 24 + (Math.random() * 8 - 4)
            p.y = canvas.height - 14 + (Math.random() * 6 - 3)
            p.vx =
              -1.2 -
              Math.random() *
                (1.5 +
                  Math.min(
                    3,
                    absVel *
                      0.2,
                  ))
            p.vy = -0.3 - Math.random() * 0.8
            p.size = 2.5 + Math.random() * 4
            p.maxLife = 24 + Math.random() * 20
            p.life = 0
            p.opacity = 0.08 + Math.random() * 0.18
            spawned++
          }
        }
      }
      for (
        let i = 0;
        i <
        POOL_SIZE;
        i++
      ) {
        const p = pool[i]
        if (!p.active) continue

        p.life++
        if (
          p.life >=
          p.maxLife
        ) {
          p.active = false
          continue
        }

        p.x += p.vx
        p.y += p.vy
        p.vy *= 0.98
        p.size += 0.08

        const progress =
          p.life /
          p.maxLife
        const currentOpacity = p.opacity * (1 - progress)

        ctx.beginPath()
        ctx.arc(
          p.x,
          p.y,
          p.size,
          0,
          Math.PI *
            2,
        )
        ctx.fillStyle = `rgba(234, 223, 200, ${currentOpacity})`
        ctx.fill()
      }
    }

    animId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={80}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  )
}
