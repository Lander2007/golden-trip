"use client"

interface CelestialProps {
  className?: string
  reducedMotion?: boolean
}

/**
 * HeroSun
 * Inline SVG rendering the warm Egyptian sun that sinks behind the horizon.
 * Diameter: clamp(68px, 9vw, 120px).
 */
export function HeroSun({ className = "" }: CelestialProps) {
  return (
    <div
      className={`hero-sun relative pointer-events-none select-none ${className}`}
      style={{
        width: "clamp(68px, 9vw, 120px)",
        height: "clamp(68px, 9vw, 120px)",
        isolation: "isolate",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E07A2F" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#E07A2F" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#E07A2F" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E07A2F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Radial Sun Glow */}
        <circle
          className="hero-sun-glow celestial-glow will-change-transform"
          cx="100"
          cy="100"
          r="95"
          fill="url(#sunGlowGrad)"
          style={{
            mixBlendMode: "screen",
            transformOrigin: "100px 100px",
          }}
        />

        {/* Sun Disc */}
        <circle
          className="hero-sun-disc celestial-disc"
          cx="100"
          cy="100"
          r="45"
          fill="#E07A2F"
          style={{
            transformOrigin: "100px 100px",
          }}
        />
      </svg>
    </div>
  )
}

/**
 * HeroMoon
 * Inline SVG rendering the crescent moon in the western night sky.
 * Diameter: 0.8 x SUN_DIAMETER = clamp(54px, 7.2vw, 96px).
 */
export function HeroMoon({ className = "" }: CelestialProps) {
  return (
    <div
      className={`hero-moon relative pointer-events-none select-none ${className}`}
      style={{
        width: "clamp(54px, 7.2vw, 96px)",
        height: "clamp(54px, 7.2vw, 96px)",
        isolation: "isolate",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pale Silver-Sand Halo Glow */}
          <radialGradient id="heroMoonGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EADFC8" stopOpacity="0.45" />
            <stop offset="40%" stopColor="#EADFC8" stopOpacity="0.22" />
            <stop offset="75%" stopColor="#EADFC8" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#EADFC8" stopOpacity="0" />
          </radialGradient>

          {/* Crescent Moon Mask: white base disc + black cutter circle */}
          <mask id="heroCrescentMoonMask">
            <rect x="0" y="0" width="200" height="200" fill="black" />
            {/* White base circle */}
            <circle cx="100" cy="100" r="45" fill="white" />
            {/* Cutter offset to carve a clean ~30% crescent moon */}
            <circle cx="124" cy="94" r="42" fill="black" />
          </mask>
        </defs>

        {/* Soft Pale Glow */}
        <circle
          className="hero-moon-glow"
          cx="100"
          cy="100"
          r="95"
          fill="url(#heroMoonGlowGrad)"
          style={{
            mixBlendMode: "screen",
            transformOrigin: "100px 100px",
          }}
        />

        {/* Crescent Moon Disc */}
        <circle
          className="hero-moon-disc"
          cx="100"
          cy="100"
          r="45"
          fill="#EADFC8"
          mask="url(#heroCrescentMoonMask)"
        />
      </svg>
    </div>
  )
}

export default function CelestialBody(props: CelestialProps) {
  return <HeroSun {...props} />
}
