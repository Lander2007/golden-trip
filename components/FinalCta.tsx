"use client"

import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import Scene from "./Scene"
import BookingBar from "./BookingBar"

export default function FinalCta({ frames = false }: { frames?: boolean }) {
  const tCta = useTranslations("cta")

  return (
    <Scene index={5} id="ready" frames={frames}>
      <div className="relative mx-auto w-full max-w-[960px] py-6 sm:py-10 flex flex-col items-center">
        {/* Giant Watermark behind the three parked vehicles at night */}
        <div
          className="pointer-events-none select-none absolute bottom-[-4vh] sm:bottom-[-2vh] start-1/2 -translate-x-1/2 rtl:translate-x-1/2 font-display text-[22vw] sm:text-[20vw] font-black tracking-[-0.05em] text-[#EADFC8]/[0.08] leading-none whitespace-nowrap z-0"
          aria-hidden="true"
        >
          {tCta("backgroundWatermark")}
        </div>

        {/* Headlight illumination beam spread across the bottom of the scene */}
        <div
          className="pointer-events-none absolute bottom-0 -start-[10%] -end-[10%] h-48 bg-gradient-to-t from-[#C9A227]/[0.06] via-[#E6CF85]/[0.03] to-transparent z-0"
          aria-hidden="true"
        />

        {/* Final Gantry Highway Sign Box */}
        <div className="final-gantry relative z-10 w-full rounded-sm border-2 border-[#C9A227] bg-[#141518] p-6 sm:p-10 md:p-12 text-center">
          {/* Status Subtitle */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-mono text-[#C9A227]">
            <span data-loop="" className="loop-anim h-1.5 w-1.5 rounded-full bg-[#C9A227] animate-pulse" />
            <span>{tCta("statusSubtitle")}</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.04em] text-[#F4F2EC]">
            {tCta("headingPart1")}
            <span className="font-accent italic font-normal text-[#C9A227] rtl:not-italic">
              {tCta("headingAccent")}
            </span>
            {tCta("headingQuestion")}
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#B9B7B0]">
            {tCta("description")}
          </p>

          {/* Booking Bar (Identical to Hero) */}
          <div className="mt-8 flex justify-center w-full">
            <BookingBar className="max-w-[620px]" />
          </div>

          {/* Quick Sign up / Login Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-[#C9A227] px-8 py-3.5 font-display text-sm font-bold text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              {tCta("signUpButton")}
            </Link>

            <p className="text-sm text-[#B9B7B0]">
              {tCta("alreadyHaveAccount")}
              <Link
                href="/login"
                className="font-medium text-[#C9A227] underline underline-offset-4 hover:text-[#E6CF85] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                {tCta("logInLink")}
              </Link>
            </p>
          </div>
        </div>

        {/* Structural Gantry Leg Pillars */}
        <div className="relative z-10 flex h-14 sm:h-16 w-full max-w-[860px] justify-between px-10" aria-hidden="true">
          <span className="w-2.5 bg-[#2A2B2E]" />
          <span className="w-2.5 bg-[#2A2B2E]" />
        </div>
      </div>
    </Scene>
  )
}

