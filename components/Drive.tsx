"use client"
// High-performance physics tick for persistent ScrollCar
// 1. Overall trip odometer tracker: 000 to 980 km & --sky interpolation

// Headlight beam grows brighter as the sky darkens towards dusk/night

// 2. Active scene detection and light mode toggle
// Scene 3 is How it works (light section)

// 3. Motion animations (skipped if prefers-reduced-motion)
// Hero headline mask sweep

// CHOREOGRAPHY — SCENE 0: HERO (Pin hero for 100% extra scroll)
// The SUV drives from 6vw to 78vw across the wordmark.
// Parallax layers move at: far 0.15x, mid 0.4x, road surface/lane 1.0x, foreground 1.3x.
// SUV drives smoothly across wordmark: 6vw to 78vw
// Scene boundary exit right at high speed: x to 120vw

// Parallax speeds during Hero pinned scroll

// CHOREOGRAPHY — SCENE 1: GANTRY INTRO (#welcome)
// Sedan enters from left (-35vw), drives across, exits right (120vw)
// -35vw -> 18vw
// 18vw -> 75vw
// 75vw -> 120vw

// Welcome Gantry: slides in from top, then exits upward

// CHOREOGRAPHY — SCENE 2: MAP SECTION / DESTINATIONS (#destinations)
// Map section uses small route marker so the car hides

// CHOREOGRAPHY — SCENE 3: HOW IT WORKS (#how-it-works)
// Sedan enters from left (-35vw), drives across past milestone steps, exits right
// -35vw -> 16vw
// 16vw -> 74vw
// 74vw -> 120vw

// Step panels flip when car passes

// CHOREOGRAPHY — SCENE 4: WHY GOLDEN TRIP (#why-golden-trip)
// Van enters from left (-35vw), drives across, exits right (120vw)
// -35vw -> 16vw
// 16vw -> 74vw
// 74vw -> 120vw

// Benefit cards lit by headlights sequentially

// CHOREOGRAPHY — SCENE 5: FINAL CTA (#ready)
// All three vehicles parked side by side
// slides to 8vw
// parked cleanly side by side

// Final Gantry: arrives from top

// Continuous highway lane dashes travel with distance (1.0x road speed)

// Dim parked vehicle into footer

// 4. Desktop horizontal scroll pinning for Destinations scene

// Exit signs retroreflective shine sweep on crossing

// 5. Mobile vertical sequence shine for exit signs

// Recompute scroll dimensions on font loading and resize
/* Sky system: photographic sky grading, dusk, gold stars, 4% film grain, soft vignette */ /* Signature Celestial Sun/Moon disc traveling on an arc across the page */ /* Main content scenes */ /* 
        ROAD ZONE:
        Fixed bottom 24vh strip across the entire page.
        Houses ONLY the persistent ScrollCar, the lane line, and the mechanical odometer plate.
        Nothing from the Content Zone ever enters this area.
      */ /* Lane Line: dashed highway dividing line */ /* 
            PERSISTENT SCROLL-DRIVEN VEHICLE:
            Travels continuously with ScrollTrigger scrub: 0.6.
            Real-time wheel rotation, body bob, pitch lean, dust trail, and variant swaps.
          */ /* Mechanical Odometer Plate: bottom left, safe distance from lane and car */ /* Subtle journey direction mark */

import { useEffect, useRef, useState, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import ScrollCar, { type ScrollCarHandle } from "./ScrollCar"
import Odometer from "./Odometer"
import CelestialBody from "./landscape/CelestialBody"
import SkySystem, { getSkyColor } from "./landscape/SkySystem"

export default function Drive({
  children,
  frames = false,
}: {
  children: ReactNode
  frames?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const scrollCarRef = useRef<ScrollCarHandle>(null)
  const [km, setKm] = useState(0)
  const [progress, setProgress] = useState(0)
  const [activeScene, setActiveScene] = useState(0)
  const [light, setLight] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (frames || !root.current) return
    gsap.registerPlugin(ScrollTrigger)

    let lenis: Lenis | undefined
    let tickerCallback: ((time: number) => void) | undefined

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    setReducedMotion(isReduced)

    lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
    })
    lenis.on("scroll", ScrollTrigger.update)

    tickerCallback = (time: number) => {
      lenis?.raf(time * 1000)
      if (scrollCarRef.current) {
        const vel = lenis ? lenis.velocity : 0
        scrollCarRef.current.updatePhysics(vel, window.scrollY)
      }
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    const onNativeScroll = () => {
      if (!lenis) {
        ScrollTrigger.update()
        scrollCarRef.current?.updatePhysics(0, window.scrollY)
      }
    }
    window.addEventListener("scroll", onNativeScroll, { passive: true })

    const context = gsap.context(() => {
      // 1. Overall trip odometer tracker: 000 to 980 km & --sky interpolation
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const current = Math.round(self.progress * 980)
          setKm(current)
          setProgress(self.progress)
          const skyColor = getSkyColor(self.progress)
          document.documentElement.style.setProperty("--sky", skyColor)
          const beamBrightness =
            0.35 + Math.min(0.85, self.progress * 0.9)
          scrollCarRef.current?.setBeamBrightness(beamBrightness)
        },
      })

      // 2. Active scene detection and light mode toggle
      const sceneElements =
        root.current!.querySelectorAll<HTMLElement>("[data-scene]")
      sceneElements.forEach((scene, index) => {
        ScrollTrigger.create({
          trigger: scene,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveScene(index)
              setLight(index === 3)
            }
          },
        })
      })

      // Hero headline mask sweep
      gsap.fromTo(
        "[data-reveal]",
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 0.85,
          stagger: 0.35,
          ease: "power3.out",
          delay: 0.2,
        },
      )

      // CHOREOGRAPHY — SCENE 0: HERO (Pin hero for 120% extra scroll)
      // The SUV drives from 6vw to 78vw across the wordmark.
      // Parallax layers move at: far 0.15x, mid 0.4x, road surface/lane 1.0x, foreground 1.3x.
      // Celestial body transitions: sun in ember rises and transforms into crescent moon in sand, with sky grading and stars.
      const heroTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#alexandria",
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.5,
          onEnter: () => {
            scrollCarRef.current?.setVariant("suv")
            scrollCarRef.current?.setVisible(true)
            scrollCarRef.current?.setBeamBrightness(0.4)
          },
          onEnterBack: () => {
            scrollCarRef.current?.setVariant("suv")
            scrollCarRef.current?.setVisible(true)
          },
          onUpdate: (self) => {
            const p = self.progress
            scrollCarRef.current?.setVariant("suv")
            scrollCarRef.current?.setVisible(true)
            scrollCarRef.current?.setBeamBrightness(0.4 + p * 0.6)

            if (p <= 0.82) {
              const travelX = 6 + (p / 0.82) * 72
              scrollCarRef.current?.setX(travelX)
            } else {
              const exitP = (p - 0.82) / 0.18
              scrollCarRef.current?.setX(78 + exitP * 42)
            }
          },
        },
      })

      // Parallax layers
      heroTimeline.to(".hero-parallax-far", { x: -60, ease: "none" }, 0)
      heroTimeline.to(".hero-parallax-mid", { x: -160, ease: "none" }, 0)
      heroTimeline.to(".hero-parallax-fg", { x: -520, ease: "none" }, 0)
      heroTimeline.to(".travel-lane", { x: "-=480", ease: "none" }, 0)

      // Celestial position: x moves 68% -> 90%, y moves 40% -> 24% (22cqw, -16cqh)
      heroTimeline.to(
        ".celestial-wrapper",
        { x: "22cqw", y: "-16cqh", duration: 1, ease: "power1.out" },
        0
      )

      // Celestial color: p 0.00 to 0.35 --ember, p 0.35 to 0.65 pale gold (#E3C46A), p 0.65 to 1.00 --sand (#EADFC8)
      heroTimeline.to(
        ".celestial-disc",
        { fill: "#E3C46A", duration: 0.3, ease: "none" },
        0.35
      )
      heroTimeline.to(
        ".celestial-disc",
        { fill: "#EADFC8", duration: 0.35, ease: "none" },
        0.65
      )

      // Celestial glow: starts large & warm, shrinks to small cool halo (about 40% of starting size) by p 0.7
      heroTimeline.to(
        ".celestial-glow",
        { scale: 0.4, opacity: 0.5, duration: 0.7, ease: "power1.out" },
        0
      )

      // Crescent mask cutter circle: slides in from p 0.55 to 1.0 (cx 220 -> 126)
      heroTimeline.to(
        "#crescentCutter",
        { attr: { cx: 126 }, duration: 0.45, ease: "power1.inOut" },
        0.55
      )

      // Sky overlays: dawn opacity 1 -> 0 across p 0 to 0.6
      heroTimeline.to(
        ".hero-dawn-overlay",
        { opacity: 0, duration: 0.6, ease: "none" },
        0
      )

      // Night overlay: opacity 0 -> 0.65 across p 0.2 to 1.0
      heroTimeline.to(
        ".hero-night-overlay",
        { opacity: 0.65, duration: 0.8, ease: "none" },
        0.2
      )

      // Photo filter: brightness 1 -> 0.6 and saturate 1 -> 0.75
      heroTimeline.to(
        ".hero-bg-photo",
        { filter: "brightness(0.6) saturate(0.75)", duration: 1, ease: "none" },
        0
      )

      // Stars: fade in from p 0.5 to 1
      heroTimeline.to(
        ".hero-stars",
        { opacity: 1, duration: 0.5, ease: "none" },
        0.5
      )

      // Headlight beam brightness
      heroTimeline.to(
        ".headlight-beam",
        { opacity: 1, duration: 1, ease: "none" },
        0
      )

      // CHOREOGRAPHY — SCENE 1: GANTRY INTRO (#welcome)
      // Sedan enters from left (-35vw), drives across, exits right (120vw)
      ScrollTrigger.create({
        trigger: "#welcome",
        start: "top 95%",
        end: "bottom 15%",
        scrub: 0.6,
        onEnter: () => {
          scrollCarRef.current?.setVariant("sedan")
          scrollCarRef.current?.setVisible(true)
        },
        onEnterBack: () => {
          scrollCarRef.current?.setVariant("sedan")
          scrollCarRef.current?.setVisible(true)
        },
        onUpdate: (self) => {
          const p = self.progress
          scrollCarRef.current?.setVariant("sedan")
          scrollCarRef.current?.setVisible(true)

          if (p < 0.22) {
            const inP = p / 0.22
            scrollCarRef.current?.setX(-35 + inP * 53)
          } else if (p < 0.82) {
            const midP = (p - 0.22) / 0.6
            scrollCarRef.current?.setX(18 + midP * 57)
          } else {
            const outP = (p - 0.82) / 0.18
            scrollCarRef.current?.setX(75 + outP * 45)
          }
        },
      })

      // Welcome Gantry: slides in from top, then exits upward
      gsap.fromTo(
        ".gantry",
        { y: -150, opacity: 0.3 },
        {
          y: 0,
          opacity: 1,
          ease: "expo.out",
          duration: 0.75,
          scrollTrigger: {
            trigger: "#welcome",
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      )
      gsap.to(".gantry", {
        y: -240,
        ease: "none",
        scrollTrigger: {
          trigger: "#welcome",
          start: "bottom 85%",
          end: "bottom 20%",
          scrub: true,
        },
      })

      // CHOREOGRAPHY — SCENE 2: MAP SECTION / DESTINATIONS (#destinations)
      // Map section uses small route marker so the car hides
      ScrollTrigger.create({
        trigger: "#destinations",
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          scrollCarRef.current?.setVisible(false)
        },
        onEnterBack: () => {
          scrollCarRef.current?.setVisible(false)
        },
        onLeave: () => {
          scrollCarRef.current?.setVisible(true)
        },
        onLeaveBack: () => {
          scrollCarRef.current?.setVisible(true)
        },
      })

      // CHOREOGRAPHY — SCENE 3: HOW IT WORKS (#how-it-works)
      // Sedan enters from left (-35vw), drives across past milestone steps, exits right
      ScrollTrigger.create({
        trigger: "#how-it-works",
        start: "top 95%",
        end: "bottom 15%",
        scrub: 0.6,
        onEnter: () => {
          scrollCarRef.current?.setVariant("sedan")
          scrollCarRef.current?.setVisible(true)
        },
        onEnterBack: () => {
          scrollCarRef.current?.setVariant("sedan")
          scrollCarRef.current?.setVisible(true)
        },
        onUpdate: (self) => {
          const p = self.progress
          scrollCarRef.current?.setVariant("sedan")
          scrollCarRef.current?.setVisible(true)

          if (p < 0.22) {
            const inP = p / 0.22
            scrollCarRef.current?.setX(-35 + inP * 51)
          } else if (p < 0.82) {
            const midP = (p - 0.22) / 0.6
            scrollCarRef.current?.setX(16 + midP * 58)
          } else {
            const outP = (p - 0.82) / 0.18
            scrollCarRef.current?.setX(74 + outP * 46)
          }
        },
      })

      const stepPanels = gsap.utils.toArray<HTMLElement>(".step-panel")
      if (stepPanels.length > 0) {
        const flipTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#how-it-works",
            start: "top 45%",
            toggleActions: "play none none reverse",
          },
        })
        stepPanels.forEach((panel) => {
          flipTimeline.fromTo(
            panel,
            { rotationY: 180, opacity: 0 },
            {
              rotationY: 0,
              opacity: 1,
              duration: 0.65,
              ease: "power2.inOut",
            },
          )
        })
      }

      // CHOREOGRAPHY — SCENE 4: WHY GOLDEN TRIP (#why-golden-trip)
      // Van enters from left (-35vw), drives across, exits right (120vw)
      ScrollTrigger.create({
        trigger: "#why-golden-trip",
        start: "top 95%",
        end: "bottom 15%",
        scrub: 0.6,
        onEnter: () => {
          scrollCarRef.current?.setVariant("van")
          scrollCarRef.current?.setVisible(true)
        },
        onEnterBack: () => {
          scrollCarRef.current?.setVariant("van")
          scrollCarRef.current?.setVisible(true)
        },
        onUpdate: (self) => {
          const p = self.progress
          scrollCarRef.current?.setVariant("van")
          scrollCarRef.current?.setVisible(true)

          if (p < 0.22) {
            const inP = p / 0.22
            scrollCarRef.current?.setX(-35 + inP * 51)
          } else if (p < 0.82) {
            const midP = (p - 0.22) / 0.6
            scrollCarRef.current?.setX(16 + midP * 58)
          } else {
            const outP = (p - 0.82) / 0.18
            scrollCarRef.current?.setX(74 + outP * 46)
          }
        },
      })

      const benefitItems = gsap.utils.toArray<HTMLElement>(".benefit")
      if (benefitItems.length > 0) {
        const litTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: "#why-golden-trip",
            start: "top 45%",
            toggleActions: "play none none reverse",
          },
        })
        benefitItems.forEach((benefit) => {
          litTimeline.fromTo(
            benefit,
            { opacity: 0.2 },
            {
              opacity: 1,
              duration: 0.6,
              ease: "power3.out",
            },
          )
          const shine = benefit.querySelector(".benefit-shine")
          if (shine) {
            litTimeline.fromTo(
              shine,
              { x: 0 },
              {
                x: 350,
                duration: 0.45,
                ease: "power2.inOut",
              },
              "<0.1",
            )
          }
        })
      }

      // CHOREOGRAPHY — SCENE 5: FINAL CTA (#ready)
      // All three vehicles parked side by side
      ScrollTrigger.create({
        trigger: "#ready",
        start: "top 85%",
        end: "bottom bottom",
        scrub: 0.6,
        onEnter: () => {
          scrollCarRef.current?.setVariant("fleet")
          scrollCarRef.current?.setVisible(true)
        },
        onEnterBack: () => {
          scrollCarRef.current?.setVariant("fleet")
          scrollCarRef.current?.setVisible(true)
        },
        onUpdate: (self) => {
          const p = self.progress
          scrollCarRef.current?.setVariant("fleet")
          scrollCarRef.current?.setVisible(true)

          if (p < 0.3) {
            const inP = p / 0.3
            scrollCarRef.current?.setX(-25 + inP * 33)
          } else {
            scrollCarRef.current?.setX(8)
          }
        },
      })

      // Final Gantry: arrives from top
      gsap.from(".final-gantry", {
        y: -120,
        opacity: 0.4,
        ease: "expo.out",
        duration: 0.8,
        scrollTrigger: {
          trigger: "#ready",
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      })

      // Continuous highway lane dashes travel with distance (1.0x road speed)
      gsap.to(".travel-lane", {
        x: -3600,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      })

      // Dim parked vehicle into footer cleanly via setOpacity
      ScrollTrigger.create({
        trigger: "#footer",
        start: "top 85%",
        end: "top 55%",
        scrub: true,
        onUpdate: (self) => {
          scrollCarRef.current?.setOpacity(1 - self.progress)
        },
      })
    }, root)

    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener("resize", handleResize)
    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
    const timer = setTimeout(() => ScrollTrigger.refresh(), 350)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", onNativeScroll)
      context.revert()
      if (tickerCallback) gsap.ticker.remove(tickerCallback)
      lenis?.destroy()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [frames])

  return (
    <div ref={root} className="relative w-full">
      {}
      {!frames && <SkySystem progress={progress} />}

      {}
      {!frames && <CelestialBody progress={progress} />}

      {}
      <main className="relative z-10">{children}</main>

      {}
      {!frames && (
        <div
          className="road-zone fixed inset-x-0 bottom-0 z-30 h-[24vh] pointer-events-none overflow-hidden select-none"
          aria-hidden="true"
        >
          {}
          <div className="absolute inset-x-0 bottom-[8.5vh] h-2 overflow-hidden">
            <svg className="travel-lane h-2 w-[200%]" aria-hidden="true">
              <path
                d="M0 4h6000"
                stroke={light ? "#2A2B2E" : "#F4F2EC"}
                strokeWidth="2.5"
                strokeDasharray="90 70"
              />
            </svg>
          </div>

          {}
          <ScrollCar
            ref={scrollCarRef}
            initialVariant="suv"
            reducedMotion={reducedMotion}
          />

          {}
          <div className="absolute bottom-4 left-7 sm:left-12 z-40 pointer-events-auto">
            <Odometer km={km} light={light} />
          </div>

          {}
          <div
            className={`absolute bottom-5 right-6 z-40 hidden text-xs font-medium md:block ${
              light ? "text-[#0E0E10]/70" : "text-[#B9B7B0]/60"
            }`}
          >
            Alexandria <span className="mx-3 text-[#C9A227]">───────→</span>{" "}
            Anywhere
          </div>
        </div>
      )}
    </div>
  )
}
