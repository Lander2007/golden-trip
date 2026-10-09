"use client"
// progress: 0.0 -> 1.0
// Arc calculation:
// X travels from 15% to 85% across viewport
// Y follows an inverted parabolic arc: starts at 40vh (dawn), reaches peak at 14vh (midday, ~0.5), sets to 38vh at ~0.78, then moon at ~18vh at 1.0.

// Arc positioning
// 15% to 85%
// Dawn rising to Midday
// 40vh -> 14vh
// Midday descending to Dusk
// 14vh -> 38vh
// Night: Moon rises into high night sky
// 38vh -> 20vh

// Phase transition:
// Dawn: Ember #E07A2F
// Day: Gold #C9A227 / Sand #EADFC8
// Moon: Pale #E2DFD2

// Moon opacity (fades in past 0.80)

// Fade in celestial body as user scrolls out of hero into the drive (0.04 -> 0.12)
/* Photographic Sun Glow Falloff (only allowed for sky lighting) */ /* Sun Disc: Ember #E07A2F at dawn, transitioning to Gold/Sand */ /* Pale Moon Disc: flat bone-white with crater shapes */ /* Subtle flat craters */

export default function CelestialBody({ progress = 0 }: { progress: number }) {
  const p = Math.max(0, Math.min(1, progress))
  const xPercent = 15 + p * 70
  let yVh = 40

  if (
    p <
    0.55
  ) {
    const norm =
      p /
      0.55
    yVh = 40 - Math.sin(norm * (Math.PI / 2)) * 26
  } else if (
    p <
    0.82
  ) {
    const norm = (p - 0.55) / 0.27
    yVh = 14 + norm * 24
  } else {
    const norm = (p - 0.82) / 0.18
    yVh = 38 - norm * 18
  }
  const isDawn =
    p <
    0.25
  const sunColor = isDawn
    ? "#E07A2F"
    : p >
          0.35 &&
        p <
          0.65
      ? "#EADFC8"
      : "#C9A227"
  const moonOpacity = Math.max(0, Math.min(1, (p - 0.8) / 0.1))
  const journeyOpacity = p < 0.12 ? Math.max(0, (p - 0.04) / 0.08) : 1

  return (
    <div
      className="pointer-events-none fixed z-[8] transition-transform duration-100 ease-out"
      style={{
        left: `${xPercent}%`,
        top: `${yVh}vh`,
        transform: "translate(-50%, -50%)",
        opacity: journeyOpacity,
      }}
      aria-hidden="true"
    >
      <div className="relative h-14 w-14 sm:h-18 sm:w-18">
        {}
        <div
          className="absolute -inset-4 sm:-inset-6 rounded-full transition-opacity duration-300"
          style={{
            opacity: (1 - moonOpacity) * (isDawn ? 0.6 : 0.25),
            background: `radial-gradient(circle, ${
              isDawn ? "rgba(224, 122, 47, 0.4)" : "rgba(201, 162, 39, 0.25)"
            } 0%, transparent 70%)`,
          }}
        />

        {}
        <div
          className="absolute inset-0 rounded-full transition-colors duration-300"
          style={{
            opacity: 1 - moonOpacity,
            backgroundColor: sunColor,
          }}
        />

        {}
        <div
          className="absolute inset-0 rounded-full bg-[#E2DFD2] transition-opacity duration-300"
          style={{ opacity: moonOpacity }}
        >
          {}
          <div className="absolute top-2.5 left-3.5 h-3 w-3 rounded-full bg-[#C8C4B5] opacity-60" />
          <div className="absolute top-7 left-7 h-2.5 w-2.5 rounded-full bg-[#C8C4B5] opacity-50" />
          <div className="absolute top-9 left-2.5 h-2 w-2 rounded-full bg-[#C8C4B5] opacity-40" />
        </div>
      </div>
    </div>
  )
}
