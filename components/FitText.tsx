"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale } from "next-intl"

interface FitTextProps {
  className?: string
}

/**
 * FitText
 * Measures "GOLDEN TRIP" (or "جولدن تريب" in Arabic) rendered at 100px font-size
 * and dynamically computes the exact font-size so the wordmark fills the available width.
 * Re-runs on ResizeObserver and after document.fonts.ready.
 * Mobile (< 640px): splits into stacked lines ("GOLDEN" / "TRIP" or "جولدن" / "تريب").
 */
export default function FitText({ className = "" }: FitTextProps) {
  const locale = useLocale()
  const isAr = locale === "ar"
  const containerRef = useRef<HTMLDivElement>(null)
  const measureSingleRef = useRef<HTMLSpanElement>(null)
  const measureGoldenRef = useRef<HTMLSpanElement>(null)
  const measureTripRef = useRef<HTMLSpanElement>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [fontSizeSingle, setFontSizeSingle] = useState<number | null>(null)
  const [fontSizeGolden, setFontSizeGolden] = useState<number | null>(null)
  const [fontSizeTrip, setFontSizeTrip] = useState<number | null>(null)

  const singleText = isAr ? "جولدن تريب" : "GOLDEN TRIP"
  const firstWord = isAr ? "جولدن" : "GOLDEN"
  const secondWord = isAr ? "تريب" : "TRIP"

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const computeSizes = () => {
      const containerWidth = container.clientWidth || container.getBoundingClientRect().width
      if (containerWidth <= 0) return

      const mobile = containerWidth < 640
      setIsMobile(mobile)

      const availableWidth = Math.max(100, containerWidth - 48)

      if (!mobile) {
        const measured = measureSingleRef.current?.getBoundingClientRect().width || 0
        if (measured > 0) {
          const calculated = (availableWidth / measured) * 100
          setFontSizeSingle(calculated)
        }
      } else {
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

    computeSizes()

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        computeSizes()
      })
    }

    let roTimer: NodeJS.Timeout
    const ro = new ResizeObserver(() => {
      clearTimeout(roTimer)
      roTimer = setTimeout(computeSizes, 100)
    })
    ro.observe(container)

    return () => {
      clearTimeout(roTimer)
      ro.disconnect()
    }
  }, [locale])

  const fontStyle = isAr
    ? {
        fontFamily: "var(--font-reem-kufi), sans-serif",
        letterSpacing: "0px",
      }
    : {
        fontFamily: "var(--font-anybody), sans-serif",
        letterSpacing: "-0.04em",
        fontVariationSettings: '"wdth" 70, "wght" 800',
      }

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
            ...fontStyle,
            fontSize: "100px",
            lineHeight: 1,
          }}
        >
          {singleText}
        </span>
        <span
          ref={measureGoldenRef}
          className="font-display font-[800] whitespace-nowrap"
          style={{
            ...fontStyle,
            fontSize: "100px",
            lineHeight: 1,
          }}
        >
          {firstWord}
        </span>
        <span
          ref={measureTripRef}
          className="font-display font-[800] whitespace-nowrap"
          style={{
            ...fontStyle,
            fontSize: "100px",
            lineHeight: 1,
          }}
        >
          {secondWord}
        </span>
      </div>

      {/* Rendered Visible Wordmark */}
      {!isMobile ? (
        <span
          className="font-display font-[800] text-[#EADFC8]/[0.14] whitespace-nowrap block"
          style={{
            ...fontStyle,
            fontSize: fontSizeSingle ? `${fontSizeSingle}px` : "18vw",
            lineHeight: 0.85,
          }}
        >
          {singleText}
        </span>
      ) : (
        <div className="flex flex-col items-center justify-center leading-[0.82] w-full">
          <span
            className="font-display font-[800] text-[#EADFC8]/[0.14] whitespace-nowrap block"
            style={{
              ...fontStyle,
              fontSize: fontSizeGolden ? `${fontSizeGolden}px` : "24vw",
              lineHeight: 0.85,
            }}
          >
            {firstWord}
          </span>
          <span
            className="font-display font-[800] text-[#EADFC8]/[0.14] whitespace-nowrap block mt-1"
            style={{
              ...fontStyle,
              fontSize: fontSizeTrip ? `${fontSizeTrip}px` : "24vw",
              lineHeight: 0.85,
            }}
          >
            {secondWord}
          </span>
        </div>
      )}

      {/* Headlight beam sweep across the wordmark */}
      <div
        className="hero-headlight-sweep pointer-events-none absolute inset-y-0 w-[45%] bg-gradient-to-r from-transparent via-[#E6CF85]/30 to-transparent -skew-x-[25deg] rtl:skew-x-[25deg]"
        aria-hidden="true"
      />
    </div>
  )
}
