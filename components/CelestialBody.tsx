"use client"

interface CelestialBodyProps {
  className?: string
  reducedMotion?: boolean
}

/**
 * CelestialBody
 * Inline SVG rendering the Sun/Moon in the hero sky.
 * Diameter: clamp(68px, 9vw, 120px).
 *
 * Back layer: Soft glow (radial falloff with isolated mix-blend-mode: screen).
 * Disc: Starts in --ember (#E07A2F), transitioning to pale gold (#E3C46A) and --sand (#EADFC8).
 * Mask: SVG <mask id="crescentMask"> containing a base circle (r=45) and a cutter circle (r=45).
 * The cutter circle starts at x=120px (full sun) and slides in on scroll to x=26px, carving a crescent moon.
 */
export default function CelestialBody({
  className = "",
  reducedMotion = false,
}: CelestialBodyProps) {
  return (
    <div
      className={`celestial-body relative pointer-events-none select-none ${className}`}
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
          {/* Radial falloff glow */}
          <radialGradient id="celestialGlowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E07A2F" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#E07A2F" stopOpacity="0.38" />
            <stop offset="70%" stopColor="#E07A2F" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#E07A2F" stopOpacity="0" />
          </radialGradient>

          {/* Crescent Mask: white base disc + black sliding cutter circle */}
          <mask id="crescentMask">
            <rect x="0" y="0" width="200" height="200" fill="black" />
            {/* White base circle */}
            <circle cx="100" cy="100" r="45" fill="white" />
            {/* Black cutter circle of same size: transform-animated for GPU acceleration */}
            <circle
              id="crescentCutter"
              className="crescent-cutter will-change-transform"
              cx="100"
              cy="100"
              r="45"
              fill="black"
              style={{
                transform: reducedMotion ? "translate3d(120px, 0, 0)" : "translate3d(120px, 0, 0)",
              }}
            />
          </mask>
        </defs>

        {/* Soft Glow behind disc (isolated mix-blend-mode: screen) */}
        <circle
          className="celestial-glow"
          cx="100"
          cy="100"
          r="95"
          fill="url(#celestialGlowGrad)"
          style={{
            mixBlendMode: "screen",
            transformOrigin: "100px 100px",
          }}
        />

        {/* Celestial Disc with crescentMask */}
        <circle
          className="celestial-disc"
          cx="100"
          cy="100"
          r="45"
          fill="#E07A2F"
          mask="url(#crescentMask)"
          style={{
            transformOrigin: "100px 100px",
          }}
        />
      </svg>
    </div>
  )
}
