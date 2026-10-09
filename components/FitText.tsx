"use client"

import { useEffect, useRef, useState } from "react"

interface FitTextProps {
  className?: string
}

/**
 * FitText
 * Measures "GOLDEN TRIP" rendered at 100px font-size and dynamically computes
 * the exact font-size so the wordmark fills the available width without clipping:
 * font-size = (containerWidth - 2 * 24px) / measuredWidth * 100
 *
 * Re-runs on ResizeObserver and after document.fonts.ready (ensuring Anybody font is loaded).
 * Mobile (< 640px): splits into stacked "GOLDEN" and "TRIP", each fitted to width.
 */
export default function FitText({ className = "" }: FitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureSingleRef = useRef<HTMLSpanElement>(null)
  const measureGoldenRef = useRef<HTMLSpanElement>(null)
  const measureTripRef = useRef<HTMLSpanElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [fontSizeSingle, setFontSizeSingle] = useState<number | null>(null)
  const [fontSizeGolden, setFontSizeGolden] = useState<number | null>(null)
  const [fontSizeTrip, setFontSizeTrip] = useState<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const computeSizes = () => {
      const containerWidth = container.clientWidth || container.getBoundingClientRect().width
      if (containerWidth <= 0) return

      const mobile = containerWidth < 640
      setIsMobile(mobile)

      const availableWidth = Math.max(100, containerWidth - 48) // containerWidth - 2 * 24px

      if (!mobile) {
        // Desktop / Tablet single line
        const measured = measureSingleRef.current?.getBoundingClientRect().width || 0
        if (measured > 0) {
          const calculated = (availableWidth / measured) * 100
          setFontSizeSingle(calculated)
        }
      } else {
        // Mobile stacked lines: "GOLDEN" and "TRIP"
        const measuredGolden = measureGoldenRef.current?.getBoundingClientRect().width || 0
        const measuredTrip = measureTripRef.current?.getBoundingClientRect().width || 0

        if (measuredGolden > 0) {
          setFontSizeGolden((availableWidth / measuredGolden) * 100)
        }
        if (measuredTrip > 0) {
          setFontSizeTrip((availableWidth / measuredTrip) * 100)
        }
      }
    }

    // Run initial compute
    computeSizes()

    // Re-run after web fonts (Anybody) have fully loaded
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        computeSizes()
      })
    }

    // Observe container resize
    const ro = new ResizeObserver(() => {
      computeSizes()
    })
    ro.observe(container)

    return () => {
      ro.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`hero-wordmark relative w-full select-none pointer-events-none flex justify-center ${className}`}
      aria-hidden="true"
    >
      {/* Hidden 100px measurement elements */}
      <div
        className="pointer-events-none absolute -top-[9999px] -left-[9999px] invisible opacity-0 select-none"
        aria-hidden="true"
      >
        <span
          ref={measureSingleRef}
          className="font-display font-[800] whitespace-nowrap"
          style={{
            fontSize: "100px",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariationSettings: '"wdth" 70, "wght" 800',
          }}
        >
          GOLDEN TRIP
        </span>
        <span
          ref={measureGoldenRef}
          className="font-display font-[800] whitespace-nowrap"
          style={{
            fontSize: "100px",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariationSettings: '"wdth" 70, "wght" 800',
          }}
        >
          GOLDEN
        </span>
        <span
          ref={measureTripRef}
          className="font-display font-[800] whitespace-nowrap"
          style={{
            fontSize: "100px",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            fontVariationSettings: '"wdth" 70, "wght" 800',
          }}
        >
          TRIP
        </span>
      </div>

      {/* Rendered Visible Wordmark */}
      {!isMobile ? (
        <span
          className="font-display font-[800] text-[#EADFC8]/[0.14] whitespace-nowrap tracking-[-0.04em] block"
          style={{
            fontSize: fontSizeSingle ? `${fontSizeSingle}px` : "18vw",
            lineHeight: 0.85,
            fontVariationSettings: '"wdth" 70, "wght" 800',
          }}
        >
          GOLDEN TRIP
        </span>
      ) : (
        <div className="flex flex-col items-center justify-center leading-[0.82] w-full">
          <span
            className="font-display font-[800] text-[#EADFC8]/[0.14] whitespace-nowrap tracking-[-0.04em] block"
            style={{
              fontSize: fontSizeGolden ? `${fontSizeGolden}px` : "24vw",
              lineHeight: 0.85,
              fontVariationSettings: '"wdth" 70, "wght" 800',
            }}
          >
            GOLDEN
          </span>
          <span
            className="font-display font-[800] text-[#EADFC8]/[0.14] whitespace-nowrap tracking-[-0.04em] block mt-1"
            style={{
              fontSize: fontSizeTrip ? `${fontSizeTrip}px` : "24vw",
              lineHeight: 0.85,
              fontVariationSettings: '"wdth" 70, "wght" 800',
            }}
          >
            TRIP
          </span>
        </div>
      )}

      {/* Headlight beam sweep across the wordmark */}
      <div
        className="hero-headlight-sweep pointer-events-none absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-[#E6CF85]/30 to-transparent -skew-x-[25deg] will-change-transform"
        aria-hidden="true"
      />
    </div>
  )
}
