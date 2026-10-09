"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Scene from "./Scene"
import Fleet from "./Fleet"

export default function GantryIntro({ frames = false }: { frames?: boolean }) {
  const introRef = useRef<HTMLDivElement>(null)
  const destCountRef = useRef<HTMLDivElement>(null)
  const hoursCountRef = useRef<HTMLDivElement>(null)
  const classCountRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (frames || !introRef.current) return

      const el = introRef.current
      const words = el.querySelectorAll<HTMLElement>(".intro-word")

      // Word-by-word scrub timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#welcome",
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress
            // Imperatively tick up the three counters smoothly without React re-rendering
            const d = Math.min(14, Math.round(p * 14))
            const h = Math.min(24, Math.round(p * 24))
            const c = Math.min(3, Math.round(p * 3))

            if (destCountRef.current) destCountRef.current.textContent = String(d)
            if (hoursCountRef.current) {
              hoursCountRef.current.firstChild!.textContent = String(h)
            }
            if (classCountRef.current) classCountRef.current.textContent = String(c)
          },
        },
      })

      // Scrub word opacity and color
      words.forEach((word, idx) => {
        tl.fromTo(
          word,
          { opacity: 0.2, y: 4 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.out",
          },
          idx * 0.15
        )
      })
    },
    { scope: introRef, dependencies: [frames] }
  )

  return (
    <Scene index={1} id="welcome" frames={frames}>
      <div ref={introRef} className="gantry mx-auto w-full max-w-[960px] py-4">
        {/* Overhead highway gantry frame */}
        <div className="relative rounded-sm border border-[#2A2B2E] bg-[#141518] p-6 sm:p-10 md:p-12 text-center shadow-2xl">
          {/* Subtle Gantry Serial Identifier */}
          <div className="flex items-center justify-between border-b border-[#2A2B2E] pb-4 mb-8">
            <span className="font-mono text-xs text-[#B9B7B0]/60">
              Gantry 01 · Alexandria–Cairo Interchange
            </span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-[#C9A227]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              Live route open
            </span>
          </div>

          {/* Big Statement scrubbed word-by-word */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-[#F4F2EC] leading-[1.15] max-w-2xl mx-auto">
            <span className="intro-word inline-block mr-2.5 transition-colors">One</span>
            <span className="intro-word inline-block mr-3 transition-colors">account.</span>
            <span className="intro-word inline-block mr-2.5 transition-colors">Every</span>
            <span className="intro-word inline-block mr-3 transition-colors">destination.</span>
            <span className="intro-word inline-block mr-2.5 transition-colors">Any</span>
            <span className="intro-word inline-block transition-colors font-accent italic font-normal text-[#C9A227]">
              hour.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-[#B9B7B0]">
            Book a vehicle from any branch across Egypt, then follow and manage your booking from one unified profile.
          </p>

          {/* Three Counters ticking up on scroll */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#2A2B2E] pt-8">
            {/* Counter 1: 14 Destinations */}
            <div className="flex flex-col items-center justify-center rounded-sm bg-[#0B0A09]/60 p-4 border border-[#2A2B2E]/60">
              <div
                ref={destCountRef}
                className="font-display text-4xl sm:text-5xl font-extrabold tabular-nums text-[#F4F2EC]"
              >
                0
              </div>
              <div className="mt-1 text-sm font-semibold text-[#C9A227]">
                Destinations
              </div>
              <div className="text-xs text-[#B9B7B0]/60 mt-0.5">
                Alexandria to Aswan
              </div>
            </div>

            {/* Counter 2: 24/7 Availability */}
            <div className="flex flex-col items-center justify-center rounded-sm bg-[#0B0A09]/60 p-4 border border-[#2A2B2E]/60">
              <div
                ref={hoursCountRef}
                className="font-display text-4xl sm:text-5xl font-extrabold tabular-nums text-[#F4F2EC]"
              >
                <span>0</span>
                <span className="text-2xl text-[#C9A227]">/7</span>
              </div>
              <div className="mt-1 text-sm font-semibold text-[#C9A227]">
                Service
              </div>
              <div className="text-xs text-[#B9B7B0]/60 mt-0.5">
                Any hour, day or night
              </div>
            </div>

            {/* Counter 3: 3 Vehicle Classes */}
            <div className="flex flex-col items-center justify-center rounded-sm bg-[#0B0A09]/60 p-4 border border-[#2A2B2E]/60">
              <div
                ref={classCountRef}
                className="font-display text-4xl sm:text-5xl font-extrabold tabular-nums text-[#F4F2EC]"
              >
                0
              </div>
              <div className="mt-1 text-sm font-semibold text-[#C9A227]">
                Vehicle classes
              </div>
              <div className="text-xs text-[#B9B7B0]/60 mt-0.5">
                Sedan, SUV & VIP Van
              </div>
            </div>
          </div>

          {/* Fleet silhouettes */}
          <Fleet className="mt-8" />
        </div>

        {/* Gantry support structural pillars */}
        <div className="flex h-16 sm:h-20 justify-between px-10" aria-hidden="true">
          <span className="w-2.5 bg-[#2A2B2E]" />
          <span className="w-2.5 bg-[#2A2B2E]" />
        </div>
      </div>
    </Scene>
  )
}
