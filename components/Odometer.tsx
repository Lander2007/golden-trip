"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import gsap from "gsap"

export interface OdometerHandle {
  updateKm: (km: number) => void
}

interface OdometerProps {
  km?: number
  light?: boolean
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
const WESTERN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

const Odometer = forwardRef<OdometerHandle, OdometerProps>(function Odometer(
  { km = 0, light = false },
  ref
) {
  const locale = useLocale()
  const isAr = locale === "ar"
  const tCommon = useTranslations("common")
  const tA11y = useTranslations("a11y")

  const rootRef = useRef<HTMLDivElement>(null)
  const wheel0Ref = useRef<HTMLDivElement>(null)
  const wheel1Ref = useRef<HTMLDivElement>(null)
  const wheel2Ref = useRef<HTMLDivElement>(null)

  const quickSet0 = useRef<((v: number) => void) | any>(null)
  const quickSet1 = useRef<((v: number) => void) | any>(null)
  const quickSet2 = useRef<((v: number) => void) | any>(null)
  const lastKmRef = useRef<number>(-1)

  useEffect(() => {
    if (wheel0Ref.current) quickSet0.current = gsap.quickSetter(wheel0Ref.current, "y", "px")
    if (wheel1Ref.current) quickSet1.current = gsap.quickSetter(wheel1Ref.current, "y", "px")
    if (wheel2Ref.current) quickSet2.current = gsap.quickSetter(wheel2Ref.current, "y", "px")

    // Set initial position
    const clamped = Math.max(0, Math.min(980, km))
    lastKmRef.current = clamped
    const d0 = Math.floor(clamped / 100)
    const d1 = Math.floor((clamped % 100) / 10)
    const d2 = clamped % 10

    quickSet0.current?.(-d0 * 26)
    quickSet1.current?.(-d1 * 26)
    quickSet2.current?.(-d2 * 26)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      updateKm: (nextKm: number) => {
        const clamped = Math.max(0, Math.min(980, Math.round(nextKm)))
        if (clamped === lastKmRef.current) return
        lastKmRef.current = clamped

        const d0 = Math.floor(clamped / 100)
        const d1 = Math.floor((clamped % 100) / 10)
        const d2 = clamped % 10

        quickSet0.current?.(-d0 * 26)
        quickSet1.current?.(-d1 * 26)
        quickSet2.current?.(-d2 * 26)

        if (rootRef.current) {
          rootRef.current.setAttribute(
            "aria-label",
            tA11y("odometerLabel", { count: clamped })
          )
        }
      },
    }),
    [tA11y]
  )

  const initialClamped = Math.max(0, Math.min(980, km))
  const initialFormatted = String(initialClamped).padStart(3, "0")
  const initialDigits = [
    parseInt(initialFormatted[0], 10),
    parseInt(initialFormatted[1], 10),
    parseInt(initialFormatted[2], 10),
  ]

  const wheelRefs = [wheel0Ref, wheel1Ref, wheel2Ref]
  const digitGlyphs = isAr ? ARABIC_DIGITS : WESTERN_DIGITS

  return (
    <div
      ref={rootRef}
      className={`inline-flex items-center gap-2.5 rounded-sm border px-2.5 py-1.5 shadow-md ${
        light
          ? "border-[#2A2B2E] bg-[#161719]"
          : "border-[#2A2B2E] bg-[#141518]"
      }`}
      role="status"
      aria-label={tA11y("odometerLabel", { count: initialClamped })}
    >
      {/* 3 Mechanical Digit Drums */}
      <div className="relative flex items-center gap-0.5 rounded-[2px] bg-[#0E0E10] p-[2px] border border-[#2A2B2E] dir-ltr" dir="ltr">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="relative h-[26px] w-[18px] overflow-hidden bg-[#0A0A0C] border-x border-[#2A2B2E]/60"
          >
            {/* Top and bottom shadow overlays */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-black/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* Sliding column (imperatively translated via quickSetter) */}
            <div
              ref={wheelRefs[i]}
              style={{
                transform: `translate3d(0, -${initialDigits[i] * 26}px, 0)`,
              }}
            >
              {digitGlyphs.map((glyph, d) => (
                <div
                  key={d}
                  className="flex h-[26px] w-[18px] items-center justify-center font-display text-[15px] font-bold tabular-nums text-[#F4F2EC]"
                >
                  {glyph}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tiny km label */}
      <div className="flex flex-col justify-center">
        <span className="font-mono text-[11px] font-bold text-[#C9A227]">
          {tCommon("kmUnit")}
        </span>
      </div>
    </div>
  )
})

export default Odometer
