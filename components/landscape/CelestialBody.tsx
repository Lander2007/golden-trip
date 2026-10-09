"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import gsap from "gsap"

export interface CelestialBodyHandle {
  update: (progress: number) => void
}

interface CelestialBodyProps {
  progress?: number
}

const CelestialBody = forwardRef<CelestialBodyHandle, CelestialBodyProps>(
  function CelestialBody({ progress = 0 }, ref) {
    const rootRef = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)
    const sunRef = useRef<HTMLDivElement>(null)
    const moonRef = useRef<HTMLDivElement>(null)

    const applyProgress = (progressValue: number) => {
      const p = Math.max(0, Math.min(1, progressValue))
      const xVw = 15 + p * 70
      let yVh = 40

      if (p < 0.55) {
        const norm = p / 0.55
        yVh = 40 - Math.sin(norm * (Math.PI / 2)) * 26
      } else if (p < 0.82) {
        const norm = (p - 0.55) / 0.27
        yVh = 14 + norm * 24
      } else {
        const norm = (p - 0.82) / 0.18
        yVh = 38 - norm * 18
      }

      const isDawn = p < 0.25
      const sunColor = isDawn
        ? "#E07A2F"
        : p > 0.35 && p < 0.65
          ? "#EADFC8"
          : "#C9A227"

      const moonOpacity = Math.max(0, Math.min(1, (p - 0.8) / 0.1))
      const journeyOpacity = p < 0.12 ? Math.max(0, (p - 0.04) / 0.08) : 1

      if (rootRef.current) {
        rootRef.current.style.transform = `translate3d(${xVw}vw, ${yVh}vh, 0) translate(-50%, -50%)`
        rootRef.current.style.opacity = String(journeyOpacity)
      }
      if (glowRef.current) {
        glowRef.current.style.opacity = String((1 - moonOpacity) * (isDawn ? 0.6 : 0.25))
        glowRef.current.style.background = `radial-gradient(circle, ${
          isDawn ? "rgba(224, 122, 47, 0.4)" : "rgba(201, 162, 39, 0.25)"
        } 0%, transparent 70%)`
      }
      if (sunRef.current) {
        sunRef.current.style.opacity = String(1 - moonOpacity)
        sunRef.current.style.backgroundColor = sunColor
      }
      if (moonRef.current) {
        moonRef.current.style.opacity = String(moonOpacity)
      }
    }

    useEffect(() => {
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

    return (
      <div
        ref={rootRef}
        className="pointer-events-none fixed top-0 left-0 z-[8] will-change-transform"
        style={{
          transform: "translate3d(15vw, 40vh, 0) translate(-50%, -50%)",
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <div className="relative h-14 w-14 sm:h-18 sm:w-18">
          {/* Photographic Sun Glow Falloff */}
          <div
            ref={glowRef}
            className="absolute -inset-4 sm:-inset-6 rounded-full will-change-[opacity]"
            style={{
              opacity: 0.6,
              background:
                "radial-gradient(circle, rgba(224, 122, 47, 0.4) 0%, transparent 70%)",
            }}
          />

          {/* Sun Disc */}
          <div
            ref={sunRef}
            className="absolute inset-0 rounded-full will-change-[opacity]"
            style={{
              opacity: 1,
              backgroundColor: "#E07A2F",
            }}
          />

          {/* Pale Moon Disc */}
          <div
            ref={moonRef}
            className="absolute inset-0 rounded-full bg-[#E2DFD2] will-change-[opacity]"
            style={{ opacity: 0 }}
          >
            <div className="absolute top-2.5 left-3.5 h-3 w-3 rounded-full bg-[#C8C4B5] opacity-60" />
            <div className="absolute top-7 left-7 h-2.5 w-2.5 rounded-full bg-[#C8C4B5] opacity-50" />
            <div className="absolute top-9 left-2.5 h-2 w-2 rounded-full bg-[#C8C4B5] opacity-40" />
          </div>
        </div>
      </div>
    )
  }
)

export default CelestialBody
