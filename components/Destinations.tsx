"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Scene from "./Scene"
import RouteMap, { type RouteMapHandle } from "./map/RouteMap"
import CityPanel from "./map/CityPanel"
import DestinationsList from "./map/DestinationsList"
import { ROUTE_CITIES, ALL_CITIES, type CityData } from "./map/egyptMapData"
import { Compass } from "lucide-react"

export interface DestinationExit {
  exit: string
  city: string
  km: number
  isHq?: boolean
}

export const destinationsList: DestinationExit[] = ALL_CITIES.map((c, idx) => ({
  exit: String(idx + 1).padStart(2, "0"),
  city: c.city,
  km: c.km,
  isHq: c.isHq,
}))

const CITY_TARGET_PROGRESS: Record<string, number> = {
  alexandria: 0.0,
  cairo: 0.1728,
  sharm: 0.5346,
  hurghada: 0.6398,
  luxor: 0.835,
  aswan: 1.0,
}

export default function Destinations({ frames = false }: { frames?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const routeMapRef = useRef<RouteMapHandle>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const [activeCityIndex, setActiveCityIndex] = useState(0)
  const [manualCity, setManualCity] = useState<CityData | null>(null)
  const [scrollProgressVal, setScrollProgressVal] = useState(0)
  const cityIndexRef = useRef(0)
  const manualCityRef = useRef<CityData | null>(null)
  manualCityRef.current = manualCity

  useGSAP(
    () => {
      if (frames) return

      const mm = gsap.matchMedia()

      // Desktop & Tablet: Pinned scroll-driven journey
      mm.add("(min-width: 768px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: "#destinations",
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            setScrollProgressVal(p)
            routeMapRef.current?.setProgress(p)

            if (manualCityRef.current) {
              setManualCity(null)
            }

            // Precise threshold boundaries based on SVG path distance
            let nextIndex = 0
            if (p >= 0.917) nextIndex = 5
            else if (p >= 0.737) nextIndex = 4
            else if (p >= 0.587) nextIndex = 3
            else if (p >= 0.354) nextIndex = 2
            else if (p >= 0.086) nextIndex = 1

            if (nextIndex !== cityIndexRef.current) {
              cityIndexRef.current = nextIndex
              setActiveCityIndex(nextIndex)
            }
          },
        })
        stRef.current = trigger
        return () => trigger.kill()
      })

      // Mobile: Responsive pinned sequence with adjusted scroll distance
      mm.add("(max-width: 767px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: "#destinations",
          start: "top top",
          end: "+=190%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            setScrollProgressVal(p)
            routeMapRef.current?.setProgress(p)

            if (manualCityRef.current) {
              setManualCity(null)
            }

            let nextIndex = 0
            if (p >= 0.917) nextIndex = 5
            else if (p >= 0.737) nextIndex = 4
            else if (p >= 0.587) nextIndex = 3
            else if (p >= 0.354) nextIndex = 2
            else if (p >= 0.086) nextIndex = 1

            if (nextIndex !== cityIndexRef.current) {
              cityIndexRef.current = nextIndex
              setActiveCityIndex(nextIndex)
            }
          },
        })
        stRef.current = trigger
        return () => trigger.kill()
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [frames] }
  )

  const currentCity = manualCity || ROUTE_CITIES[activeCityIndex] || ROUTE_CITIES[0]

  const handleSelectCity = (city: CityData) => {
    const idx = ROUTE_CITIES.findIndex((c) => c.id === city.id)
    if (idx !== -1) {
      cityIndexRef.current = idx
      setActiveCityIndex(idx)
      setManualCity(null)

      // Smoothly animate the scroll to the target city position
      if (stRef.current) {
        const targetProgress = CITY_TARGET_PROGRESS[city.id] ?? 0
        const targetScroll =
          stRef.current.start + targetProgress * (stRef.current.end - stRef.current.start)

        const lenis = typeof window !== "undefined" ? (window as unknown as { __lenis?: { scrollTo: (y: number, opts?: { duration?: number }) => void } }).__lenis : undefined
        if (lenis) {
          lenis.scrollTo(targetScroll, { duration: 1.2 })
        } else if (typeof window !== "undefined") {
          window.scrollTo({ top: targetScroll, behavior: "smooth" })
        }
      }
    } else {
      setManualCity(city)
    }
  }

  return (
    <>
      <Scene index={2} id="destinations" frames={frames}>
        <div ref={sectionRef} className="flex w-full flex-col">
          {/* Section Header with Live Scroll Driver Telemetry */}
          <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#FFD54F]">
                  Highway network · 14 cities
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-[#C9A227]" />
                <span className="font-mono text-[11px] text-[#B9B7B0]/80">
                  Scroll-Driven Navigation
                </span>
              </div>
              <h2 className="mt-0.5 font-display text-2xl font-extrabold tracking-[-0.04em] text-[#F4F2EC] sm:text-4xl md:text-5xl">
                Branches across{" "}
                <span className="font-accent italic font-normal text-[#C9A227]">Egypt</span>.
              </h2>
            </div>

            {/* Dynamic Driver Guidance Prompt */}
            <div className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-[#C9A227]/25 bg-[#0B0A09]/80 px-3 py-1 font-mono text-[11px] backdrop-blur-md">
              <Compass
                className="h-3.5 w-3.5 text-[#C9A227] animate-spin"
                style={{ animationDuration: "10s" }}
                aria-hidden="true"
              />
              <span className="text-[#B9B7B0]">
                {scrollProgressVal < 0.05 ? "Scroll wheel to drive highway ↓" : `Traversing Leg 0${activeCityIndex + 1} / 06`}
              </span>
              <span className="hidden sm:inline text-white/30">|</span>
              <span className="hidden sm:inline text-[#E6CF85] font-semibold">
                {currentCity.city}
              </span>
            </div>
          </div>

          {/* Interactive Grid: Map & Luxury Telemetry Panel */}
          <div className="grid grid-cols-1 items-stretch gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
            {/* Left: Cartographic Route Map (Expanded height) */}
            <div className="h-[360px] sm:h-[440px] lg:h-[min(56vh,540px)] w-full lg:col-span-7">
              <RouteMap
                ref={routeMapRef}
                activeCity={currentCity}
                onSelectCity={handleSelectCity}
              />
            </div>

            {/* Right: City Panel with Interactive Waypoint Stepper */}
            <div className="h-[400px] sm:h-[460px] lg:h-[min(56vh,540px)] w-full lg:col-span-5">
              <CityPanel
                city={currentCity}
                cityIndex={activeCityIndex}
                totalRouteCities={ROUTE_CITIES.length}
                onSelectCity={handleSelectCity}
                routeCities={ROUTE_CITIES}
              />
            </div>
          </div>
        </div>
      </Scene>

      {/* Full 14 Destinations Directory Grid below Pinned Section */}
      <section className="relative z-10 bg-[#0B0A09] px-6 pb-[22vh] pt-4 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <DestinationsList />
        </div>
      </section>
    </>
  )
}
