"use client"

import { useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import gsap from "gsap"
import { HeroMoon } from "@/components/CelestialBody"

interface RGB {
  r: number
  g: number
  b: number
}

const INK: RGB = { r: 11, g: 10, b: 9 }
const SAND: RGB = { r: 234, g: 223, b: 200 }
const NIGHT: RGB = { r: 12, g: 26, b: 43 }

function interpolateRgb(from: RGB, to: RGB, t: number): string {
  const r = Math.round(from.r + (to.r - from.r) * t)
  const g = Math.round(from.g + (to.g - from.g) * t)
  const b = Math.round(from.b + (to.b - from.b) * t)
  return `rgb(${r}, ${g}, ${b})`
}

export function getSkyColor(progress: number): string {
  const p = Math.max(0, Math.min(1, progress))

  if (p <= 0.35) {
    const t = p / 0.35
    return interpolateRgb(INK, SAND, t)
  } else if (p <= 0.7) {
    const t = (p - 0.35) / 0.35
    return interpolateRgb(SAND, NIGHT, t)
  } else {
    const t = (p - 0.7) / 0.3
    return interpolateRgb(NIGHT, INK, t)
  }
}

export interface SkySystemHandle {
  update: (progress: number) => void
}

interface SkySystemProps {
  progress?: number
}

const SkySystem = forwardRef<SkySystemHandle, SkySystemProps>(function SkySystem(
  { progress = 0 },
  ref
) {
  const dawnRef = useRef<HTMLDivElement>(null)
  const duskRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)
  const moonRef = useRef<HTMLDivElement>(null)

  const quickDawn = useRef<((v: number) => void) | any>(null)
  const quickDusk = useRef<((v: number) => void) | any>(null)
  const quickStars = useRef<((v: number) => void) | any>(null)
  const quickMoonOpacity = useRef<((v: number) => void) | any>(null)

  const stars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280
      const x = (seed % 100).toFixed(1)
      const y = (((seed * 13) % 45) + 5).toFixed(1)
      const size = (i % 3 === 0 ? 2 : 1.2).toFixed(1)
      const opacity = (((i % 5) + 4) / 10).toFixed(2)
      const duration = (3.2 + (i % 5) * 0.7).toFixed(1)
      const delay = ((i % 7) * 0.5).toFixed(1)
      return { id: i, x, y, size, opacity, duration, delay, isTwinkling: i < 12 }
    })
  }, [])

  const applyProgress = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p))

    // Dawn opacity: 0.00 to 0.25
    const dawnOp = clamped < 0.25 ? Math.max(0, 1 - clamped / 0.22) : 0
    quickDawn.current?.(dawnOp)

    // Dusk opacity: 0.55 to 0.82
    let duskOp = 0
    if (clamped >= 0.55 && clamped <= 0.82) {
      duskOp = clamped < 0.7 ? (clamped - 0.55) / 0.15 : 1 - (clamped - 0.7) / 0.12
    }
    quickDusk.current?.(duskOp)

    // Stars opacity: fades in 0.78 to 1.00
    const starsOp = clamped >= 0.78 ? Math.min(1, (clamped - 0.78) / 0.18) : 0
    quickStars.current?.(starsOp)

    // Moon opacity & position
    let moonOp = 0
    if (clamped >= 0.18) {
      if (clamped < 0.35) {
        moonOp = ((clamped - 0.18) / 0.17) * 0.4
      } else if (clamped < 0.65) {
        moonOp = 0.25
      } else {
        moonOp = 0.25 + ((clamped - 0.65) / 0.35) * 0.75
      }
    }
    quickMoonOpacity.current?.(moonOp)
  }

  useEffect(() => {
    if (dawnRef.current) quickDawn.current = gsap.quickSetter(dawnRef.current, "opacity")
    if (duskRef.current) quickDusk.current = gsap.quickSetter(duskRef.current, "opacity")
    if (starsRef.current) quickStars.current = gsap.quickSetter(starsRef.current, "opacity")
    if (moonRef.current) quickMoonOpacity.current = gsap.quickSetter(moonRef.current, "opacity")

    applyProgress(progress)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      update: (p: number) => {
        applyProgress(p)
      },
    }),
    []
  )

  const initialP = Math.max(0, Math.min(1, progress))
  const initialDawnOpacity = initialP < 0.25 ? Math.max(0, 1 - initialP / 0.22) : 0
  const initialDuskOpacity =
    initialP >= 0.55 && initialP <= 0.82
      ? initialP < 0.7
        ? (initialP - 0.55) / 0.15
        : 1 - (initialP - 0.7) / 0.12
      : 0
  const initialStarsOpacity = initialP >= 0.78 ? Math.min(1, (initialP - 0.78) / 0.18) : 0

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    >
      {/* 1. Dawn Photographic Sky Grading */}
      <div
        ref={dawnRef}
        className="absolute inset-0"
        style={{
          opacity: initialDawnOpacity,
          background:
            "linear-gradient(to top, rgba(224, 122, 47, 0.42) 0%, rgba(224, 122, 47, 0.15) 35%, rgba(11, 10, 9, 0) 70%)",
        }}
      />

      {/* 2. Dusk Photographic Sky Grading */}
      <div
        ref={duskRef}
        className="absolute inset-0"
        style={{
          opacity: initialDuskOpacity,
          background:
            "linear-gradient(to top, rgba(12, 26, 43, 0.85) 0%, rgba(12, 26, 43, 0.3) 60%, transparent 100%)",
        }}
      />

      {/* 3. Night Sky Stars */}
      <div
        ref={starsRef}
        className="sky-stars absolute inset-0"
        style={{ opacity: initialStarsOpacity }}
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          {stars.map((star) => (
            <circle
              key={star.id}
              cx={`${star.x}%`}
              cy={`${star.y}%`}
              r={star.size}
              fill="#C9A227"
              opacity={star.opacity}
              className={star.isTwinkling ? "hero-star-dot" : undefined}
              style={
                star.isTwinkling
                  ? {
                      animation: `heroTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                    }
                  : undefined
              }
            />
          ))}
        </svg>
      </div>

      {/* Shared Moon: positioned via CSS logical properties, visual right side in both /en and /ar */}
      <div
        ref={moonRef}
        dir="ltr"
        className="shared-moon pointer-events-none absolute z-[2]"
        style={{
          top: "24%",
          insetInlineEnd: "16%",
          transform: "translate(50%, -50%)",
          opacity: 0,
          isolation: "isolate",
        }}
      >
        <HeroMoon />
      </div>
    </div>
  )
})

export default SkySystem
