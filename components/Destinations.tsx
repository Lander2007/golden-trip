"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Scene from "./Scene"
import RouteMap from "./map/RouteMap"
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapProgress, setMapProgress] = useState(0)
  const [activeCityIndex, setActiveCityIndex] = useState(0)
  const [manualCity, setManualCity] = useState<CityData | null>(null)

  // Determine active route city from scroll progress
  useEffect(() => {
    if (manualCity) return

    let nextIndex = 0
    if (mapProgress >= 0.92) {
      nextIndex = 5 // Aswan
    } else if (mapProgress >= 0.76) {
      nextIndex = 4 // Luxor
    } else if (mapProgress >= 0.58) {
      nextIndex = 3 // Hurghada
    } else if (mapProgress >= 0.36) {
      nextIndex = 2 // Sharm El-Sheikh
    } else if (mapProgress >= 0.12) {
      nextIndex = 1 // Cairo
    } else {
      nextIndex = 0 // Alexandria
    }

    if (nextIndex !== activeCityIndex) {
      setActiveCityIndex(nextIndex)
    }
  }, [mapProgress, manualCity, activeCityIndex])

  // GSAP ScrollTrigger pinning for the Destinations Map Scene
  useEffect(() => {
    if (frames || !containerRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=160%",
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          setMapProgress(self.progress)
          if (manualCity) {
            setManualCity(null) // Resume scroll-driven city following user scroll
          }
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [frames, manualCity])

  const currentCity = manualCity || ROUTE_CITIES[activeCityIndex] || ROUTE_CITIES[0]

  const handleSelectCity = (city: CityData) => {
    setManualCity(city)
    const idx = ROUTE_CITIES.findIndex((c) => c.id === city.id)
    if (idx !== -1) {
      setActiveCityIndex(idx)
    }
  }

  return (
    <Scene index={2} id="destinations" frames={frames}>
      <div ref={containerRef} className="w-full flex flex-col justify-center min-h-[90vh] py-6 sm:py-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" />
              <span className="font-mono text-xs font-semibold text-[#C9A227]">
                Highway network · 14 cities
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.04em] text-[#F4F2EC]">
              Branches across{" "}
              <span className="font-accent italic font-normal text-[#C9A227]">
                Egypt
              </span>
              .
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#B9B7B0] max-w-sm sm:text-right">
            Follow the highway route from Alexandria to Aswan. Select any city or scroll to travel.
          </p>
        </div>

        {/* 
          PINNED MAP SCENE:
          Desktop: Map 60% Left, City Panel 40% Right
          Mobile: Map on top, Panel below as a bottom sheet
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
          {/* Map Section: 60% Width on Desktop (cols 1 to 7) */}
          <div className="lg:col-span-7 h-[44vh] sm:h-[50vh] lg:h-[62vh] min-h-[380px] w-full">
            <RouteMap
              progress={mapProgress}
              activeCity={currentCity}
              onSelectCity={handleSelectCity}
              showOtherCities={mapProgress >= 0.45}
            />
          </div>

          {/* City Panel: 40% Width on Desktop (cols 8 to 12), Bottom sheet on Mobile */}
          <div className="lg:col-span-5 flex flex-col min-h-[320px] lg:h-[62vh]">
            <CityPanel
              city={currentCity}
              cityIndex={activeCityIndex}
              totalRouteCities={ROUTE_CITIES.length}
              onSelectCity={handleSelectCity}
              routeCities={ROUTE_CITIES}
            />
          </div>
        </div>

        {/* End of the Scene: Compact List of All 14 Destinations */}
        <DestinationsList />
      </div>
    </Scene>
  )
}
