"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Lenis from "lenis"
import ScrollCar, { type ScrollCarHandle } from "./ScrollCar"
import Odometer, { type OdometerHandle } from "./Odometer"
import CelestialBody, { type CelestialBodyHandle } from "./landscape/CelestialBody"
import SkySystem, { getSkyColor, type SkySystemHandle } from "./landscape/SkySystem"
import { scrollProgress, updateScrollProgress } from "@/lib/scrollEngine"
import DustTrail, { type DustTrailHandle } from "./vehicle/DustTrail"
import { LITE, off } from "@/lib/perf"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
  ;(window as any).ScrollTrigger = ScrollTrigger
}

export default function Drive({
  children,
  frames = false,
}: {
  children: ReactNode
  frames?: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const scrollCarRef = useRef<ScrollCarHandle>(null)
  const odometerRef = useRef<OdometerHandle>(null)
  const skyRef = useRef<SkySystemHandle>(null)
  const celestialRef = useRef<CelestialBodyHandle>(null)
  const dustRef = useRef<DustTrailHandle>(null)

  const [activeScene, setActiveScene] = useState(0)
  const [light, setLight] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // 1. Lenis & Master GSAP Ticker Integration (exactly once at app level)
  useEffect(() => {
    if (frames || typeof window === "undefined") return

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReducedMotion(isReduced)

    if (LITE) {
      document.documentElement.classList.add("lite")
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches
    let lenis: Lenis | null = null

    if (!isMobile) {
      lenis = new Lenis({
        autoRaf: false,
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
      })
      lenis.on("scroll", ScrollTrigger.update)
      if (typeof window !== "undefined") {
        ;(window as any).__lenis = lenis
      }
    }

    let lastWrittenP = -1
    let lastWrittenSky = ""

    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000)

      const p = scrollProgress.value
      const vel = lenis?.velocity || 0

      // Write CSS variables on root element at most once per frame
      if (Math.abs(p - lastWrittenP) > 0.0001) {
        lastWrittenP = p
        document.documentElement.style.setProperty("--p", p.toFixed(4))
        const skyColor = getSkyColor(p)
        if (skyColor !== lastWrittenSky) {
          lastWrittenSky = skyColor
          document.documentElement.style.setProperty("--sky", skyColor)
        }
      }

      // Imperative DOM updates via refs and quickSetters inside ticker
      odometerRef.current?.updateKm(scrollProgress.km)
      skyRef.current?.update(p)
      celestialRef.current?.update(p)
      scrollCarRef.current?.updatePhysics(vel, lenis?.scroll || 0)
      if (!LITE) dustRef.current?.tick(vel)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Debounced resize handler
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 150)
    }
    window.addEventListener("resize", handleResize, { passive: true })

    // Refresh after fonts load
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
      gsap.ticker.remove(tickerCallback)
      lenis?.destroy()
      if (typeof window !== "undefined") {
        delete (window as any).__lenis
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [frames])

  // 2. GSAP Scened Choreography with useGSAP
  useGSAP(
    () => {
      if (frames || !root.current) return

      // Master ScrollTrigger tracking overall page progress (writes to mutable scrollProgress)
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          updateScrollProgress(self.progress)
          const beamBrightness = 0.35 + Math.min(0.85, self.progress * 0.9)
          scrollCarRef.current?.setBeamBrightness(beamBrightness)
        },
      })

      // Active scene detection: update React state ONLY when index changes
      const sceneElements = root.current.querySelectorAll<HTMLElement>("[data-scene]")
      sceneElements.forEach((scene, index) => {
        ScrollTrigger.create({
          trigger: scene,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveScene((prev) => (prev !== index ? index : prev))
              setLight((prev) => {
                const nextLight = index === 3
                return prev !== nextLight ? nextLight : prev
              })
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
        }
      )

      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        // SCENE 0: HERO (Pin hero for 120% extra scroll)
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

        if (!LITE && !off("parallax")) {
          heroTimeline.to(".hero-parallax-far", { x: -60, ease: "none" }, 0)
          heroTimeline.to(".hero-parallax-mid", { x: -160, ease: "none" }, 0)
          heroTimeline.to(".hero-parallax-fg", { x: -520, ease: "none" }, 0)
        }
        heroTimeline.to(".travel-lane", { x: "-=480", ease: "none" }, 0)

        // ----------------------------------------------------------------------
        // PHASE 7c: SUNSET TO MOON CHOREOGRAPHY
        // Sun drifts right (west), sinks behind horizon at p=0.55,
        // dusk haze peaks at p=0.40, night overlay and stars appear,
        // crescent moon emerges in the western sky from p=0.55 to 0.90.
        // Reverses cleanly on scroll up.
        // ----------------------------------------------------------------------

        // 1. Sun Movement: drifts west (x: 0 -> 18cqw) & sinks (y: 0 -> 85cqh)
        // Clamped container height is 74%, so at 85cqh it is fully sunken below the horizon & dunes
        heroTimeline.to(
          ".hero-sun-wrapper",
          {
            x: "18cqw",
            y: "85cqh",
            opacity: 0,
            duration: 0.55,
            ease: "power1.in",
          },
          0
        )

        // 2. Sun Color: gold (#E07A2F) -> deep sunset orange (#E8742A) -> crimson red (#C93D1B)
        heroTimeline.to(
          ".hero-sun-disc",
          { fill: "#E8742A", duration: 0.30, ease: "none" },
          0
        )
        heroTimeline.to(
          ".hero-sun-disc",
          { fill: "#C93D1B", duration: 0.25, ease: "power1.in" },
          0.30
        )

        // 3. Sun Glow: shrinks and dims as it sets
        heroTimeline.to(
          ".hero-sun-glow",
          { scale: 0.52, opacity: 0.2, duration: 0.55, ease: "power1.in" },
          0
        )

        // 4. Dusk-red Horizon Haze: peaks at p=0.38 - 0.42, fades by p=0.65
        heroTimeline.to(
          ".hero-dusk-haze",
          { opacity: 0.95, duration: 0.36, ease: "power1.out" },
          0.05
        )
        heroTimeline.to(
          ".hero-dusk-haze",
          { opacity: 0, duration: 0.25, ease: "power1.in" },
          0.41
        )

        // 5. Sky Overlays: Dawn fades out, Night fades in
        heroTimeline.to(
          ".hero-dawn-overlay",
          { opacity: 0, duration: 0.45, ease: "none" },
          0
        )
        heroTimeline.to(
          ".hero-night-overlay",
          { opacity: 0.72, duration: 0.60, ease: "power1.inOut" },
          0.25
        )

        // 6. Stars fade in
        heroTimeline.to(
          ".hero-stars",
          { opacity: 1, duration: 0.40, ease: "power1.inOut" },
          0.45
        )

        // 7. Crescent Moon emerges in western night sky (p: 0.55 -> 0.90)
        heroTimeline.fromTo(
          ".hero-moon-wrapper",
          { opacity: 0, scale: 0.82 },
          { opacity: 1, scale: 1, duration: 0.38, ease: "power1.out" },
          0.55
        )

        // 8. Photo Darkening via opacity overlay
        heroTimeline.to(
          ".hero-bg-photo-overlay",
          { opacity: 0.45, duration: 1, ease: "none" },
          0
        )

        // 9. Headlight beam brightens across p: 0.40 -> 0.85
        heroTimeline.to(
          ".headlight-beam",
          { opacity: 1, duration: 0.45, ease: "none" },
          0.40
        )

        // SCENE 1: GANTRY INTRO (#welcome)
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
          onLeave: () => {
            scrollCarRef.current?.setVisible(false)
          },
          onLeaveBack: () => {
            scrollCarRef.current?.setVariant("suv")
            scrollCarRef.current?.setVisible(true)
          },
          onUpdate: (self) => {
            const p = self.progress
            scrollCarRef.current?.setVariant("sedan")
            scrollCarRef.current?.setVisible(p < 0.98)

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

        // Welcome Gantry: consolidated animation
        const welcomeGantryTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#welcome",
            start: "top 75%",
            end: "center center",
            scrub: true,
          },
        })
        welcomeGantryTl.fromTo(
          ".gantry",
          { y: 28, opacity: 0.35 },
          { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
        )

        // SCENE 2: MAP SECTION / DESTINATIONS (#destinations)
        ScrollTrigger.create({
          trigger: "#destinations",
          start: "top 95%",
          end: "bottom top",
          onEnter: () => {
            scrollCarRef.current?.setVisible(false)
          },
          onEnterBack: () => {
            scrollCarRef.current?.setVisible(false)
          },
          onLeave: () => {
            scrollCarRef.current?.setVisible(false)
          },
          onLeaveBack: () => {
            scrollCarRef.current?.setVariant("sedan")
            scrollCarRef.current?.setVisible(true)
          },
        })

        // SCENE 3: HOW IT WORKS (#how-it-works)
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
              }
            )
          })
        }

        // SCENE 4: WHY GOLDEN TRIP (#why-golden-trip)
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
              }
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
                "<0.1"
              )
            }
          })
        }

        // SCENE 5: FINAL CTA (#ready)
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

        // Final Gantry arrives from top
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

        // Continuous highway lane dashes travel with distance
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

        // Dim parked vehicle into footer cleanly
        ScrollTrigger.create({
          trigger: "#footer",
          start: "top 85%",
          end: "top 55%",
          scrub: true,
          onUpdate: (self) => {
            scrollCarRef.current?.setOpacity(1 - self.progress)
          },
        })

        // Sort and refresh triggers to reconcile any dynamically created pin-spacers across scenes
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      })
    },
    { scope: root, dependencies: [frames] }
  )

  return (
    <div ref={root} className="relative w-full">
      {/* Sky System */}
      {!frames && <SkySystem ref={skyRef} />}

      {/* Floating Celestial Body */}
      {!frames && <CelestialBody ref={celestialRef} />}

      {/* Main Scenes */}
      <main className="relative z-10">{children}</main>

      {/* Fixed Road Zone Strip */}
      {!frames && (
        <div
          className="road-zone fixed inset-x-0 bottom-0 z-30 h-[24vh] pointer-events-none overflow-hidden select-none hidden lg:block"
          aria-hidden="true"
        >
          <DustTrail ref={dustRef} reducedMotion={reducedMotion} />
          {/* Lane Line */}
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

          {/* Persistent Scroll-Driven Vehicle */}
          <ScrollCar
            ref={scrollCarRef}
            initialVariant="suv"
            reducedMotion={reducedMotion}
          />

          {/* Mechanical Odometer Plate */}
          <div className="absolute bottom-4 left-7 sm:left-12 z-40 pointer-events-auto">
            <Odometer ref={odometerRef} km={0} light={light} />
          </div>

          {/* Subtle journey direction mark */}
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
