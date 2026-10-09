"use client"

import type { ReactNode, Ref } from "react"
import Landscape from "./Landscape"

const motionNotes = [
  "Dawn → gantry: the headlight mask sweeps each headline line in 0.8s with power3.out. Scroll scrubs the landscape left at two depths; the SUV stays fixed in the road zone. The welcome sign approaches from above over 0.7s, expo.out.",
  "Gantry → destinations: travel scrubs the sign up and out as the car passes beneath it. The destination scene pins on desktop; vertical travel becomes horizontal movement at 1:1 scrub.",
  "Destinations → midday: 12 exit signs travel right to left. A diagonal soft-gold shine crosses each sign in 0.55s as it enters the headlight zone. Mobile uses individual vertical signs.",
  "Midday → dusk: each kilometer panel rotates 180° in 0.65s, power2.inOut, sequentially. White executive sedan drives in the road zone; light section daylight styling.",
  "Dusk → night: headlights light each benefit in sequence, 0.6s power3.out, followed by a 0.4s shine pass. White VIP passenger van in the road zone.",
  "Night → footer: all three vehicles (sedan, SUV, van) park together in the road zone as the final gantry arrives. The traveling sun disc transforms into a pale moon in the night sky.",
  "End of route: clean, accessible layout. Reduced motion displays the complete final static state of every scene.",
]

import { useTranslations } from "next-intl"

export function MotionNote({ index }: { index: number }) {
  const t = useTranslations("frames")
  return (
    <p className="frame-note border-y border-[#2A2B2E] bg-[#141518] px-7 py-5 text-sm leading-relaxed text-[#F4F2EC]">
      <span className="font-semibold text-[#C9A227]">
        {t("motionNotePrefix", { current: index + 1, total: 7 })}
      </span>
      {motionNotes[index]}
      <a
        className="frame-download-desktop ms-3 inline-block text-[#C9A227] underline underline-offset-4"
        href={`/storyboards/desktop-${String(index + 1).padStart(2, "0")}.png`}
        download
      >
        {t("downloadFrame")}
      </a>
      <a
        className="frame-download-mobile ms-3 text-[#C9A227] underline underline-offset-4"
        href={`/storyboards/mobile-${String(index + 1).padStart(2, "0")}.png`}
        download
      >
        {t("downloadFrame")}
      </a>
    </p>
  )
}

export interface SceneProps {
  index: number
  id: string
  children: ReactNode
  light?: boolean
  frames?: boolean
  className?: string
  ref?: Ref<HTMLElement>
  sceneRef?: Ref<HTMLElement>
}

export default function Scene({
  index,
  id,
  children,
  light = false,
  frames = false,
  className = "",
  ref,
  sceneRef,
}: SceneProps) {
  const targetRef = ref || sceneRef

  return (
    <>
      <section
        ref={targetRef}
        id={id}
        data-scene={index}
        style={{
          backgroundColor:
            index === 1 || index === 2 ? "#0B0A09" : "var(--sky, #0B0A09)",
        }}
        className={`scene relative z-10 min-h-[100svh] w-full overflow-hidden flex flex-col justify-between ${
          light ? "text-[#0B0A09]" : "text-[#F4F2EC]"
        } ${className}`.trim()}
      >
        <div
          className={`content-zone relative z-10 mx-auto w-full max-w-[1240px] flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 pt-[76px] sm:pt-[84px] ${
            index === 2 ? "pb-4 sm:pb-6 lg:pb-8" : "pb-[22vh]"
          }`}
        >
          {children}
        </div>

        <Landscape phase={index} light={light} className="z-[2]" />
      </section>
      {frames && <MotionNote index={index} />}
    </>
  )
}
