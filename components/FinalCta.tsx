"use client"

import Link from "next/link"
import Scene from "./Scene"
import BookingBar from "./BookingBar"

export default function FinalCta({ frames = false }: { frames?: boolean }) {
  return (
    <Scene index={5} id="ready" frames={frames}>
      <div className="relative mx-auto w-full max-w-[960px] py-6 sm:py-10 flex flex-col items-center">
        {/* 
          Giant "Ready?" in Anybody behind the three parked vehicles at night:
          Positioned in the lower third behind the road zone vehicle dock.
        */}
        <div
          className="pointer-events-none select-none absolute bottom-[-4vh] sm:bottom-[-2vh] left-1/2 -translate-x-1/2 font-display text-[22vw] sm:text-[20vw] font-black tracking-[-0.05em] text-[#EADFC8]/[0.08] leading-none whitespace-nowrap z-0"
          aria-hidden="true"
        >
          Ready?
        </div>

        {/* Headlight illumination beam spread across the bottom of the scene */}
        <div
          className="pointer-events-none absolute bottom-0 left-[-10%] right-[-10%] h-48 bg-gradient-to-t from-[#C9A227]/[0.06] via-[#E6CF85]/[0.03] to-transparent blur-2xl z-0"
          aria-hidden="true"
        />

        {/* Final Gantry Highway Sign Box */}
        <div className="final-gantry relative z-10 w-full rounded-sm border-2 border-[#C9A227] bg-[#141518] p-6 sm:p-10 md:p-12 text-center shadow-2xl">
          {/* Status Subtitle */}
          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-mono text-[#C9A227]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] animate-pulse" />
            <span>Night fleet ready · Alexandria headquarters</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-[-0.04em] text-[#F4F2EC]">
            Ready to hit the{" "}
            <span className="font-accent italic font-normal text-[#C9A227]">
              road
            </span>
            ?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-[#B9B7B0]">
            Reserve an executive sedan, luxury SUV, or VIP van from any branch across Egypt. Direct airport transfers and resort runs available round the clock.
          </p>

          {/* Booking Bar (Identical to Hero) */}
          <div className="mt-8 flex justify-center w-full">
            <BookingBar className="max-w-[620px]" />
          </div>

          {/* Quick Sign up / Login Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-full bg-[#C9A227] px-8 py-3.5 font-display text-sm font-bold text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] shadow-lg"
            >
              Sign up
            </Link>

            <p className="text-sm text-[#B9B7B0]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#C9A227] underline underline-offset-4 hover:text-[#E6CF85] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                Log in
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
