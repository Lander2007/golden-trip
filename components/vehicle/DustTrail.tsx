"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react"
import { LITE, off } from "@/lib/perf"

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

const POOL_SIZE = 30

interface DustTrailProps {
  reducedMotion?: boolean
}

const DustTrail = forwardRef<DustTrailHandle, DustTrailProps>(function DustTrail(
  { reducedMotion = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poolRef = useRef<DustParticle[]>([])
  const pausedRef = useRef(true)
  const skipRef = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (LITE || reducedMotion || off("dust") || off("canvas")) return
    setMounted(true)
  }, [reducedMotion])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const zone = canvas.closest(".road-zone") as HTMLElement | null
    const resize = () => {
      const w = zone?.clientWidth || window.innerWidth
      const h = zone?.clientHeight || Math.round(window.innerHeight * 0.24)
      canvas.width = w
      canvas.height = h
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

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

    const hero = document.getElementById("alexandria")
    let io: IntersectionObserver | null = null
    if (hero) {
      io = new IntersectionObserver(
        ([entry]) => {
          pausedRef.current = !entry.isIntersecting
          if (pausedRef.current && canvasRef.current) {
            const c = canvasRef.current.getContext("2d")
            if (c) c.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        },
        { threshold: 0 }
      )
      io.observe(hero)
      pausedRef.current = false
    } else {
      pausedRef.current = false
    }

    return () => {
      window.removeEventListener("resize", resize)
      io?.disconnect()
    }
  }, [mounted])

  useImperativeHandle(
    ref,
    () => ({
      tick: (velocity: number) => {
        if (LITE || reducedMotion || skipRef.current) return
        if (off("dust") || off("canvas")) return
        if (pausedRef.current) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const absVel = Math.abs(velocity)
        const pool = poolRef.current
        let anyActive = false
        for (let i = 0; i < pool.length; i++) {
          if (pool[i].active) {
            anyActive = true
            break
          }
        }
        if (absVel < 0.1 && !anyActive) return

        const w = canvas.width
        const h = canvas.height
        ctx.clearRect(0, 0, w, h)

        const car = document.querySelector(".road-zone-car") as HTMLElement | null
        const zone = canvas.closest(".road-zone") as HTMLElement | null
        let spawnX = w * 0.2
        let spawnY = h * 0.78
        if (car && zone) {
          const cr = car.getBoundingClientRect()
          const zr = zone.getBoundingClientRect()
          spawnX = cr.left - zr.left + cr.width * 0.12
          spawnY = cr.bottom - zr.top - 8
        }

        if (absVel >= 0.1) {
          const toSpawn = Math.min(2, Math.ceil(absVel * 0.2))
          let spawned = 0
          for (let i = 0; i < pool.length && spawned < toSpawn; i++) {
            const p = pool[i]
            if (!p.active) {
              p.active = true
              p.x = spawnX + (Math.random() * 8 - 4)
              p.y = spawnY + (Math.random() * 6 - 3)
              p.vx = -1.1 - Math.random() * (1.2 + Math.min(2, absVel * 0.12))
              p.vy = -0.25 - Math.random() * 0.5
              p.size = 2 + Math.random() * 3
              p.maxLife = 18 + Math.random() * 12
              p.life = 0
              p.opacity = 0.08 + Math.random() * 0.14
              spawned++
            }
          }
        }

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
          p.size += 0.06
          const currentOpacity = p.opacity * (1 - p.life / p.maxLife)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(234, 223, 200, ${currentOpacity})`
          ctx.fill()
        }
      },
    }),
    [reducedMotion]
  )

  if (!mounted) return null

  return (
    <canvas
      ref={canvasRef}
      className="dust-canvas pointer-events-none absolute inset-0 h-full w-full select-none"
      aria-hidden="true"
    />
  )
})

export default DustTrail
