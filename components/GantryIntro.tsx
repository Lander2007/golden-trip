"use client"

import { useRef } from "react"
import { useLocale, useTranslations } from "next-intl"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Scene from "./Scene"
import Fleet from "./Fleet"

export default function GantryIntro({ frames = false }: { frames?: boolean }) {
  const locale = useLocale()
  const tIntro = useTranslations("intro")
  const introRef = useRef<HTMLDivElement>(null)
  const destCountRef = useRef<HTMLDivElement>(null)
  const hoursCountRef = useRef<HTMLDivElement>(null)
  const classCountRef = useRef<HTMLDivElement>(null)

  const numFormat = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en", {
    numberingSystem: locale === "ar" ? "arab" : "latn",
  })

  useGSAP(
    () => {
      if (frames || !introRef.current) return

      const el = introRef.current
      const words = el.querySelectorAll<HTMLElement>(".intro-word")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el.closest("#welcome") || el,
          start: "top 80%",
          end: "center center",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress
            const d = Math.min(14, Math.round(p * 14))
            const h = Math.min(24, Math.round(p * 24))
            const c = Math.min(3, Math.round(p * 3))

            if (destCountRef.current) destCountRef.current.textContent = numFormat.format(d)
            if (hoursCountRef.current && hoursCountRef.current.firstChild) {
              hoursCountRef.current.firstChild.textContent = numFormat.format(h)
            }
            if (classCountRef.current) classCountRef.current.textContent = numFormat.format(c)
          },
        },
      })

      words.forEach((word, idx) => {
        tl.fromTo(
          word,
          { opacity: 0.25 },
          { opacity: 1, duration: 0.2, ease: "none" },
          idx * 0.12
        )
      })
    },
    { scope: introRef, dependencies: [frames, locale] }
  )

  return (
    <Scene index={1} id="welcome" frames={frames}>
      <div ref={introRef} className="gantry mx-auto w-full max-w-[920px]">
        <div className="rounded-sm border border-[#2A2B2E] bg-[#141518] px-5 py-6 text-center sm:px-10 sm:py-10">
          <p className="font-mono text-[11px] text-[#B9B7B0]">
            {tIntro("interchange")}
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-[#F4F2EC] text-balance">
            <span className="intro-word inline-block">{tIntro("word1")}</span>{" "}
            <span className="intro-word inline-block">{tIntro("word2")}</span>{" "}
            <span className="intro-word inline-block">{tIntro("word3")}</span>{" "}
            <span className="intro-word inline-block">{tIntro("word4")}</span>{" "}
            <span className="intro-word inline-block font-accent italic font-normal text-[#C9A227] rtl:not-italic">
              {tIntro("word5Accent")}
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#B9B7B0]">
            {tIntro("description")}
          </p>

          <div className="mt-8 flex flex-col md:grid md:grid-cols-3 gap-0 md:gap-4 border-t border-[#2A2B2E] pt-6 md:pt-6 divide-y divide-[#2A2B2E] md:divide-y-0">
            <div className="md:rounded-sm md:border border-[#2A2B2E] md:bg-[#0B0A09] py-4 md:px-2 md:py-3 md:sm:p-4">
              <div
                ref={destCountRef}
                className="font-display text-3xl font-extrabold tabular-nums text-[#F4F2EC] sm:text-4xl"
              >
                {numFormat.format(0)}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[#C9A227] sm:text-sm">
                {tIntro("citiesLabel")}
              </div>
            </div>
            <div className="md:rounded-sm md:border border-[#2A2B2E] md:bg-[#0B0A09] py-4 md:px-2 md:py-3 md:sm:p-4">
              <div
                ref={hoursCountRef}
                className="font-display text-3xl font-extrabold tabular-nums text-[#F4F2EC] sm:text-4xl"
              >
                <span>{numFormat.format(0)}</span>
                <span className="text-lg text-[#C9A227] sm:text-2xl">/{numFormat.format(7)}</span>
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[#C9A227] sm:text-sm">
                {tIntro("serviceLabel")}
              </div>
            </div>
            <div className="md:rounded-sm md:border border-[#2A2B2E] md:bg-[#0B0A09] py-4 md:px-2 md:py-3 md:sm:p-4">
              <div
                ref={classCountRef}
                className="font-display text-3xl font-extrabold tabular-nums text-[#F4F2EC] sm:text-4xl"
              >
                {numFormat.format(0)}
              </div>
              <div className="mt-1 text-[11px] font-semibold text-[#C9A227] sm:text-sm">
                {tIntro("classesLabel")}
              </div>
            </div>
          </div>

          <Fleet className="mt-6" />
        </div>
      </div>
    </Scene>
  )
}
