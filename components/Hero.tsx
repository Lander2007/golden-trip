"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import BookingBar from "./BookingBar"
import FitText from "./FitText"
import CelestialBody, { HeroSun, HeroMoon } from "./CelestialBody"
import GizaPyramids from "./landscape/GizaPyramids"

// 28 deterministic stars generated with fixed seed, placed strictly in top 40% (at most 12 animated per budget)
const HERO_STARS = Array.from({ length: 28 }).map((_, i) => {
  const seed = (i * 9301 + 49297) % 233280
  const x = ((seed % 92) + 4).toFixed(1) // 4% to 96% of frame width
  const y = (((seed * 7) % 32) + 4).toFixed(1) // 4% to 36% of frame height (top 40%)
  const size = i % 3 === 0 ? 1.8 : 1.1
  const color = i % 2 === 0 ? "#C9A227" : "#EADFC8"
  const duration = (3.2 + (i % 5) * 0.7).toFixed(1) // 3.2s to 6.0s loops
  const delay = ((i % 7) * 0.5).toFixed(1)
  const isTwinkling = i < 12
  return { id: i, x, y, size, color, duration, delay, isTwinkling }
})

export default function Hero({ frames = false }: { frames?: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const [imgFailed, setImgFailed] = useState(false)

  useGSAP(
    () => {
      if (frames || typeof window === "undefined") return
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

      // Initial Load Entrance Animation (1.6s total)
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } })

      // 1. Sun rises smoothly into start dawn position
      tl.fromTo(
        ".hero-sun-wrapper",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: "power2.out" },
        0
      )

      // 2. Photo scales down smoothly
      tl.fromTo(
        ".hero-bg-photo",
        { scale: 1.06 },
        { scale: 1.0, duration: 1.6, ease: "power2.out" },
        0
      )

      // 3. Headline lines mask-reveal upward
      tl.fromTo(
        ".hero-headline-line",
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.18,
          ease: "power3.out",
        },
        0.2
      )

      // 4. Booking bar fades in
      tl.fromTo(
        ".hero-booking-bar",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        0.5
      )

      // 5. SUV headlights switch on
      const headlights = document.querySelectorAll(".headlight-beam, .headlight-lamp")
      if (headlights.length > 0) {
        tl.fromTo(
          headlights,
          { opacity: 0, scale: 0.4 },
          { opacity: 0.4, scale: 1, duration: 0.5, ease: "power2.out" },
          0.6
        )
      }

      // 6. Headlight beam sweep across the wordmark
      tl.fromTo(
        ".hero-headlight-sweep",
        { xPercent: -150, opacity: 0 },
        { xPercent: 250, opacity: 0.5, duration: 0.9, ease: "power2.inOut" },
        0.7
      )
    },
    { scope: heroRef, dependencies: [frames] }
  )

  useEffect(() => {
    if (!heroRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (heroRef.current) {
          if (entry.isIntersecting) {
            heroRef.current.classList.remove("hero-offscreen")
          } else {
            heroRef.current.classList.add("hero-offscreen")
          }
        }
      },
      { threshold: 0 }
    )
    io.observe(heroRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="alexandria"
      data-scene={0}
      ref={heroRef}
      className="scene relative min-h-[620px] h-[100svh] w-full p-2.5 sm:p-4 flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: "var(--sky, #0B0A09)" }}
    >
      {/* ============================================================== */}
      {/* INSET FRAME: 16px margin, 28px radius, min-height 600px        */}
      {/* ============================================================== */}
      <div className="relative h-full min-h-[600px] w-full rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#EADFC8]/12 bg-[#0B0A09] flex flex-col justify-between">
        {/* ------------------------------------------------------------ */}
        {/* Z-1: PHOTO BACKDROP (/images/hero-giza-dawn.jpg)             */}
        {/* ------------------------------------------------------------ */}
        {!imgFailed ? (
          <Image
            src="/images/hero-giza-dawn.webp"
            alt="Giza pyramids at dawn"
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRkYAAABXRUJQVlA4IDoAAADQAQCdASoQAAkABUB8JaACdAEOun1YAAD+qhDOSCNS68/8eSnk6UbMlVOBsLCSzgGkK/8L/ZISgAAA"
            onError={() => setImgFailed(true)}
            className="hero-bg-photo hero-parallax-far absolute inset-0 h-full w-full object-cover object-center pointer-events-none z-[1]"
          />
        ) : (
          <div className="absolute inset-0 pointer-events-none z-[1]">
            <GizaPyramids className="hero-parallax-far absolute right-0 bottom-16 w-[640px] opacity-40" />
          </div>
        )}

        {/* Photo darkening overlay div (replaces runtime CSS filter) */}
        <div
          className="hero-bg-photo-overlay pointer-events-none absolute inset-0 bg-[#0B0A09] opacity-0 z-[1]"
          aria-hidden="true"
        />

        {/* Base dark grading for consistent text contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/75 to-[#0B0A09]/40 pointer-events-none z-[1]"
          aria-hidden="true"
        />

        {/* ------------------------------------------------------------ */}
        {/* Z-2: DAWN WARM OVERLAY (Opacity 1 -> 0 on scroll)            */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-dawn-overlay pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to top, rgba(224, 122, 47, 0.42) 0%, rgba(224, 122, 47, 0.16) 40%, rgba(11, 10, 9, 0) 75%)",
            opacity: 1,
          }}
          aria-hidden="true"
        />

        {/* ------------------------------------------------------------ */}
        {/* Z-2b: DUSK HORIZON HAZE (peaks at p=0.40, then fades)        */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-dusk-haze pointer-events-none absolute inset-x-0 bottom-[22%] z-[2] h-[38%] opacity-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 65% at 88% 90%, rgba(201, 61, 27, 0.72) 0%, rgba(232, 116, 42, 0.38) 45%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        {/* ------------------------------------------------------------ */}
        {/* Z-3: NIGHT OVERLAY (--night #0C1A2B, Opacity 0 -> 0.72)      */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-night-overlay pointer-events-none absolute inset-0 z-[3]"
          style={{
            background:
              "linear-gradient(to top, rgba(12, 26, 43, 0.95) 0%, rgba(12, 26, 43, 0.7) 60%, rgba(12, 26, 43, 0.4) 100%)",
            opacity: 0,
          }}
          aria-hidden="true"
        />

        {/* ------------------------------------------------------------ */}
        {/* Z-4: STARS (28 tiny dots in top 40% of frame, at most 12 twinkle) */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-stars pointer-events-none absolute inset-0 z-[4] opacity-0"
          aria-hidden="true"
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {HERO_STARS.map((star) => (
              <circle
                key={star.id}
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size}
                fill={star.color}
                className={star.isTwinkling ? "hero-star-dot" : undefined}
                style={
                  star.isTwinkling
                    ? {
                        animation: `heroTwinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
                      }
                    : { opacity: 0.7 }
                }
              />
            ))}
          </svg>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Z-5: SUN CONTAINER (Clipped at Horizon Y = 74%)              */}
        {/* Container has height = 74% and overflow: hidden.             */}
        {/* As sun moves to y: 81%, it is cleanly clipped at horizon!    */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-sun-sky-track absolute inset-x-0 top-0 z-[5] pointer-events-none overflow-hidden"
          style={{
            height: "74%",
            containerType: "size",
          }}
          aria-hidden="true"
        >
          {/* Sun starts at SUN_START: x=72%, y=30% */}
          <div
            className="hero-sun-wrapper absolute"
            style={{
              left: "72%",
              top: "30%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <HeroSun />
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Z-5b: CRESCENT MOON (Upper western sky, outside sun clip)    */}
        {/* Positioned at MOON_POS: x=84%, y=24% (mobile: x=80%, y=14%)  */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-moon-track absolute inset-0 z-[5] pointer-events-none overflow-hidden"
          style={{ containerType: "size" }}
          aria-hidden="true"
        >
          <div
            className="hero-moon-wrapper absolute opacity-0"
            style={{
              left: "84%",
              top: "24%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <HeroMoon />
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Z-5c: DUNE RIDGE SILHOUETTE (Masks horizon line along 74%)   */}
        {/* ------------------------------------------------------------ */}
        <div
          className="hero-dune-ridge pointer-events-none absolute inset-x-0 top-[73.6%] z-[5] h-[7%] overflow-hidden"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0 55 Q 240 28 480 50 T 960 32 T 1440 48 L 1440 100 L 0 100 Z"
              fill="#0B0A09"
            />
          </svg>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Z-6: MID DUNES & PALMS (Parallax 0.4x)                       */}
        {/* ------------------------------------------------------------ */}
        <div
          data-parallax="mid"
          className="hero-parallax-mid pointer-events-none absolute inset-x-0 bottom-[14vh] z-[6] h-28 overflow-hidden opacity-30"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            className="w-[130%] h-full"
          >
            <path
              d="M0 65 Q 360 25 720 55 T 1440 35 L 1440 100 L 0 100 Z"
              fill="#EADFC8"
              fillOpacity="0.10"
            />
            {/* Distant palm frond silhouettes */}
            <path
              d="M520 48 l-5 -15 m5 15 l0 -18 m0 18 l5 -15 M520 32 q-6 -5 -12 -3 m12 3 q6 -5 12 -3 M960 42 l-4 -14 m4 14 l0 -16 m0 16 l4 -14 M960 28 q-5 -4 -11 -3 m11 3 q5 -4 11 -3"
              stroke="#EADFC8"
              strokeWidth="1.6"
              strokeOpacity="0.22"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Foreground roadside marker (1.3x parallax) */}
        <div
          data-parallax="fg"
          className="hero-parallax-fg pointer-events-none absolute right-[-2%] bottom-[7vh] z-[6] opacity-20"
          aria-hidden="true"
        >
          <div className="w-1.5 h-14 rounded-sm bg-[#EADFC8]/35 -skew-x-[15deg]" />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Z-7: WORDMARK FIT (GOLDEN TRIP fitted, baseline above road)   */}
        {/* ------------------------------------------------------------ */}
        <div className="absolute inset-x-0 bottom-[14.5vh] sm:bottom-[16vh] z-[7] pointer-events-none">
          <FitText />
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Z-8: CONTENT BLOCK (Top padding = navbar height + 24px)       */}
        {/* ------------------------------------------------------------ */}
        <div className="relative z-[8] w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 pt-[clamp(76px,10vh,92px)] flex-1 flex flex-col justify-start">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
            <div className="lg:col-span-7">
              {/* Headline: clamp(40px, min(6.4vw, 10.5vh), 104px) */}
              <h1 className="font-display text-[clamp(40px,min(6.4vw,10.5vh),104px)] font-bold tracking-[-0.04em] text-[#EADFC8] leading-[1.02]">
                <span className="block overflow-hidden">
                  <span className="hero-headline-line block">
                    Your trip starts
                  </span>
                </span>
                <span className="block overflow-hidden mt-1">
                  <span className="hero-headline-line block">
                    at your{" "}
                    <span className="font-accent italic font-normal text-[#C9A227]">
                      door.
                    </span>
                  </span>
                </span>
              </h1>

              {/* Subline: vh-aware scaling */}
              <p className="mt-[clamp(10px,1.8vh,22px)] text-[clamp(14px,min(1.2vw,1.9vh),17px)] leading-relaxed text-[#EADFC8]/85 max-w-[46ch]">
                Airport transfers, resort runs, and city-to-city trips across Egypt.
              </p>

              {/* Booking Bar: vh-aware spacing */}
              <div className="hero-booking-bar mt-[clamp(14px,2.2vh,28px)]">
                <BookingBar />
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* BOTTOM ROW INSIDE FRAME: Scroll cue & Route chip             */}
        {/* ------------------------------------------------------------ */}
        <div className="relative z-[8] w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-14 pb-4 sm:pb-5 flex items-center justify-end pointer-events-none">
          <div className="hidden sm:flex items-center gap-3 text-xs text-[#EADFC8]/70 pointer-events-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" />
            <span className="font-medium">Alexandria to Anywhere</span>
          </div>
        </div>
      </div>
    </section>
  )
}
