"use client"

import { useEffect, useState } from "react"
import { subscribeCityChange, scrollProgress } from "@/lib/scrollEngine"

export interface CityMarker {
  name: string
  km: number
  pct: number
}

export const ROUTE_CITIES: CityMarker[] = [
  { name: "Alexandria", km: 0, pct: 0 },
  { name: "Cairo", km: 220, pct: 22.4 },
  { name: "Sharm El-Sheikh", km: 500, pct: 51.0 },
  { name: "Hurghada", km: 650, pct: 66.3 },
  { name: "Luxor", km: 840, pct: 85.7 },
  { name: "Aswan", km: 980, pct: 100 },
]

export default function RouteProgressLine({
  condensed = false,
}: {
  km?: number
  condensed?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(() => scrollProgress.activeCityIndex)

  useEffect(() => {
    return subscribeCityChange((newIndex) => {
      setActiveIndex(newIndex)
    })
  }, [])

  return (
    <div
      className={`fixed inset-x-0 z-40 pointer-events-none ${
        condensed ? "top-[56px]" : "top-[72px]"
      }`}
      aria-label="Route progress through Egypt"
    >
      <div className="relative h-[2px] w-full bg-[#2A2B2E]">
        <div
          className="h-full bg-[#C9A227]"
          style={{ width: "calc(var(--p, 0) * 100%)" }}
        />
        <div className="absolute inset-0 mx-auto max-w-[1200px] px-4 sm:px-8">
          <div className="relative h-full w-full">
            {ROUTE_CITIES.map((city, index) => {
              const isPassed = activeIndex >= index
              const isActive = activeIndex === index
              return (
                <div
                  key={city.name}
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${city.pct}%` }}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isActive || isPassed ? "bg-[#C9A227]" : "bg-[#2A2B2E]"
                    }`}
                    title={`${city.name} · ${city.km} km`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
