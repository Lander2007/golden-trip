"use client" /* 
          CONTENT ZONE:
          Starts below the 72px navbar and finishes strictly above the 24vh road zone.
          Nothing in this container can ever touch or sit beneath the road zone.
        */ /* Decorative landscape layer (Pyramids, Palms) behind content at low contrast */

import type { ReactNode } from "react"
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

export function MotionNote({ index }: { index: number }) {
  return (
    <p className="frame-note border-y border-[#2A2B2E] bg-[#141518] px-7 py-5 text-sm leading-relaxed text-[#F4F2EC]">
      <span className="font-semibold text-[#C9A227]">
        Motion note · {index + 1} / 7 —{" "}
      </span>
      {motionNotes[index]}
      <a
        className="frame-download-desktop ml-3 inline-block text-[#C9A227] underline underline-offset-4"
        href={`/storyboards/desktop-${String(index + 1).padStart(2, "0")}.png`}
        download
      >
        Download frame ↗
      </a>
      <a
        className="frame-download-mobile ml-3 text-[#C9A227] underline underline-offset-4"
        href={`/storyboards/mobile-${String(index + 1).padStart(2, "0")}.png`}
        download
      >
        Download frame ↗
      </a>
    </p>
  )
}

export default function Scene({
  index,
  id,
  children,
  light = false,
  frames = false,
}: {
  index: number
  id: string
  children: ReactNode
  light?: boolean
  frames?: boolean
}) {
  return (
    <>
      <section
        id={id}
        data-scene={index}
        style={{
          backgroundColor: "var(--sky, #0B0A09)",
        }}
        className={`scene relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-between transition-colors duration-150 ${
          light ? "text-[#0B0A09]" : "text-[#F4F2EC]"
        }`}
      >
        {}
        <div className="content-zone relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-12 pt-[clamp(80px,11vh,100px)] pb-[26vh] flex-1 flex flex-col justify-center">
          {children}
        </div>

        {}
        <Landscape phase={index} light={light} className="z-[2]" />
      </section>
      {frames && <MotionNote index={index} />}
    </>
  )
}
