"use client"

// Color keyframes:
// 0.00 dawn: ember into ink (#0B0A09 with ember #E07A2F gradient)
// 0.35 day: sand (#EADFC8)
// 0.70 dusk: night (#0C1A2B, deep lapis navy)
// 1.00 night: ink (#0B0A09 with gold stars)
// #0B0A09
// #EADFC8
// #0C1A2B
// 0.00 -> 0.35 (Dawn ink into Day sand)
// 0.35 -> 0.70 (Day sand into Dusk night lapis navy)
// 0.70 -> 1.00 (Dusk night lapis navy into Night ink)

// Dawn photographic gradient overlay: 0.00 to 0.25 (ember #E07A2F into ink #0B0A09)

// Dusk photographic gradient overlay: 0.55 to 0.82

// Night stars overlay: fades in from 0.78 to 1.00

// Generate 42 static gold star dots with realistic Egyptian desert sky coordinates
// Deterministic positions based on index
// Keep stars in top 50vh sky
/* 
        1. Dawn Photographic Sky Grading:
        Warm ember #E07A2F light bleeding up from the horizon into ink #0B0A09
      */ /* 
        2. Dusk Photographic Sky Grading:
        Deep lapis navy #0C1A2B grading
      */ /* 
        3. Night Sky:
        Tiny gold stars as crisp dots in the Egyptian night sky
      */ /* Soft Vignette across viewport */ /* 4% Opacity Film Grain */

import { useMemo } from "react"

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

  if (
    p <=
    0.35
  ) {
    const t =
      p /
      0.35
    return interpolateRgb(INK, SAND, t)
  } else if (
    p <=
    0.7
  ) {
    const t = (p - 0.35) / 0.35
    return interpolateRgb(SAND, NIGHT, t)
  } else {
    const t = (p - 0.7) / 0.3
    return interpolateRgb(NIGHT, INK, t)
  }
}

export default function SkySystem({ progress = 0 }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress))
  const dawnOpacity =
    p <
    0.25
      ? Math.max(0, 1 - p / 0.22)
      : 0
  const duskOpacity =
    p >=
      0.55 &&
    p <=
      0.82
      ? p <
        0.7
        ? (p - 0.55) / 0.15
        : 1 - (p - 0.7) / 0.12
      : 0
  const starsOpacity =
    p >=
    0.78
      ? Math.min(1, (p - 0.78) / 0.18)
      : 0
  const stars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280
      const x = (
        seed %
        100
      ).toFixed(1)
      const y = (((seed * 13) % 45) + 5).toFixed(1)
      const size = (i % 3 === 0 ? 2 : 1.2).toFixed(1)
      const opacity = (((i % 5) + 4) / 10).toFixed(2)
      return { id: i, x, y, size, opacity }
    })
  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {}
      <div
        className="absolute inset-0 transition-opacity duration-150 ease-out"
        style={{
          opacity: dawnOpacity,
          background:
            "linear-gradient(to top, rgba(224, 122, 47, 0.42) 0%, rgba(224, 122, 47, 0.15) 35%, rgba(11, 10, 9, 0) 70%)",
        }}
      />

      {}
      <div
        className="absolute inset-0 transition-opacity duration-150 ease-out"
        style={{
          opacity: duskOpacity,
          background:
            "linear-gradient(to top, rgba(12, 26, 43, 0.85) 0%, rgba(12, 26, 43, 0.3) 60%, transparent 100%)",
        }}
      />

      {}
      <div
        className="absolute inset-0 transition-opacity duration-200 ease-out"
        style={{ opacity: starsOpacity }}
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

      {/* Shared Moon: stays on right at 24% height after hero, drifting to 70% by final CTA */}
      {(() => {
        const moonOpacity =
          p < 0.18
            ? 0
            : p < 0.35
              ? ((p - 0.18) / 0.17) * 0.4
              : p < 0.65
                ? 0.25
                : 0.25 + ((p - 0.65) / 0.35) * 0.75
        const moonLeft = Math.max(70, Math.min(90, 90 - ((p - 0.2) / 0.8) * 20))

        return (
          <div
            className="shared-moon pointer-events-none absolute z-[2] transition-opacity duration-300"
            style={{
              top: "24%",
              left: `${moonLeft}%`,
              transform: "translate(-50%, -50%)",
              opacity: moonOpacity,
              width: "clamp(56px, 7vw, 96px)",
              height: "clamp(56px, 7vw, 96px)",
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
        )
      })()}

      {}
      <div className="vignette absolute inset-0" />

      {}
      <div className="film-grain" />
    </div>
  )
}
