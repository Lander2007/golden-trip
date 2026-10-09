"use client"

import { useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from "react"
import gsap from "gsap"

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
      return { id: i, x, y, size, opacity }
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

    if (moonRef.current) {
      const moonLeft = Math.max(70, Math.min(90, 90 - ((clamped - 0.2) / 0.8) * 20))
      moonRef.current.style.left = `${moonLeft}%`
    }
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Dawn Photographic Sky Grading */}
      <div
        ref={dawnRef}
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: initialDawnOpacity,
          background:
            "linear-gradient(to top, rgba(224, 122, 47, 0.42) 0%, rgba(224, 122, 47, 0.15) 35%, rgba(11, 10, 9, 0) 70%)",
        }}
      />

      {/* 2. Dusk Photographic Sky Grading */}
      <div
        ref={duskRef}
        className="absolute inset-0 will-change-[opacity]"
        style={{
          opacity: initialDuskOpacity,
          background:
            "linear-gradient(to top, rgba(12, 26, 43, 0.85) 0%, rgba(12, 26, 43, 0.3) 60%, transparent 100%)",
        }}
      />

      {/* 3. Night Sky Stars */}
      <div
        ref={starsRef}
        className="absolute inset-0 will-change-[opacity]"
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
            />
          ))}
        </svg>
      </div>

      {/* Shared Moon: isolated to prevent full-screen blend cost */}
      <div
        ref={moonRef}
        className="shared-moon pointer-events-none absolute z-[2] will-change-[opacity]"
        style={{
          top: "24%",
          left: "90%",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          width: "clamp(56px, 7vw, 96px)",
          height: "clamp(56px, 7vw, 96px)",
          isolation: "isolate",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id="sharedMoonMask">
              <rect x="0" y="0" width="200" height="200" fill="black" />
              <circle cx="100" cy="100" r="45" fill="white" />
              <circle cx="126" cy="100" r="45" fill="black" />
            </mask>
            <radialGradient id="sharedMoonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EADFC8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#EADFC8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#EADFC8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Cool subtle halo */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="url(#sharedMoonGlow)"
            style={{ mixBlendMode: "screen" }}
          />

          {/* Crescent Moon */}
          <circle
            cx="100"
            cy="100"
            r="45"
            fill="#EADFC8"
            mask="url(#sharedMoonMask)"
          />
        </svg>
      </div>

      {/* Soft Vignette */}
      <div className="vignette absolute inset-0" />

      {/* Film Grain */}
      <div className="film-grain" />
    </div>
  )
})

export default SkySystem
