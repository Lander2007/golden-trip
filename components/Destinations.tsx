"use client"

import { useRef, useState } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import Scene from "./Scene"
import RouteMap, { type RouteMapHandle } from "./map/RouteMap"
import CityPanel from "./map/CityPanel"
import DestinationsList from "./map/DestinationsList"
import { ROUTE_CITIES, ALL_CITIES, type CityData } from "./map/egyptMapData"

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

export default function Destinations({ frames = false }: { frames?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const routeMapRef = useRef<RouteMapHandle>(null)
  const [activeCityIndex, setActiveCityIndex] = useState(0)
  const [manualCity, setManualCity] = useState<CityData | null>(null)
  const cityIndexRef = useRef(0)
  const manualCityRef = useRef<CityData | null>(null)
  manualCityRef.current = manualCity

  useGSAP(
    () => {
      if (frames) return

      ScrollTrigger.create({
        trigger: "#destinations",
        start: "top 20%",
        end: "bottom 35%",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress
          routeMapRef.current?.setProgress(p)

          if (manualCityRef.current) {
            setManualCity(null)
          }

          let nextIndex = 0
          if (p >= 0.92) nextIndex = 5
          else if (p >= 0.76) nextIndex = 4
          else if (p >= 0.58) nextIndex = 3
          else if (p >= 0.36) nextIndex = 2
          else if (p >= 0.12) nextIndex = 1

          if (nextIndex !== cityIndexRef.current) {
            cityIndexRef.current = nextIndex
            setActiveCityIndex(nextIndex)
          }
        },
      })
    },
    { scope: sectionRef, dependencies: [frames] }
  )

  const currentCity = manualCity || ROUTE_CITIES[activeCityIndex] || ROUTE_CITIES[0]

  const handleSelectCity = (city: CityData) => {
    setManualCity(city)
    const idx = ROUTE_CITIES.findIndex((c) => c.id === city.id)
    if (idx !== -1) {
      cityIndexRef.current = idx
      setActiveCityIndex(idx)
    }
  }

  return (
    <>
      <Scene index={2} id="destinations" frames={frames}>
        <div ref={sectionRef} className="flex w-full flex-col">
          <div className="mb-4 flex flex-col gap-1 sm:mb-5">
            <span className="font-mono text-xs font-semibold text-[#C9A227]">
              Highway network · 14 cities
            </span>
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#F4F2EC] sm:text-4xl md:text-5xl">
              Branches across{" "}
              <span className="font-accent italic font-normal text-[#C9A227]">Egypt</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-5">
            <div className="h-[38vh] min-h-[240px] max-h-[420px] w-full lg:col-span-7 lg:h-[min(48vh,440px)]">
              <RouteMap
                ref={routeMapRef}
                activeCity={currentCity}
                onSelectCity={handleSelectCity}
              />
            </div>
            <div className="lg:col-span-5 lg:h-[min(48vh,440px)]">
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
      <section className="relative z-10 bg-[#0B0A09] px-6 pb-[22vh] pt-2 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-[1200px]">
          <DestinationsList />
        </div>
      </section>
    </>
  )
}
