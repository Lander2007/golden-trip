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
  km = 0,
  condensed = false,
}: {
  km?: number
  condensed?: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(() => scrollProgress.activeCityIndex)

  // Subscribe to city changes from the scroll engine: only fires when active city index CHANGES
  useEffect(() => {
    return subscribeCityChange((newIndex) => {
      setActiveIndex(newIndex)
    })
  }, [])

  return (
    <div
      className={`fixed inset-x-0 z-40 pointer-events-none transition-all duration-300 ${
        condensed ? "top-[56px]" : "top-[72px]"
      }`}
      aria-label="Route progress through Egypt"
    >
      {/* 2px Track across full width */}
      <div className="relative h-[2px] w-full bg-[#2A2B2E] overflow-visible">
        {/* Filled gold progress bar driven by CSS variable --p */}
        <div
          className="h-full bg-[#C9A227] will-change-[width]"
          style={{ width: "calc(var(--p, 0) * 100%)" }}
        />

        {/* 6 City Ticks & Active Labels */}
        <div className="absolute inset-0 max-w-[1200px] mx-auto px-4 sm:px-8 overflow-visible">
          <div className="relative h-full w-full overflow-visible">
            {ROUTE_CITIES.map((city, index) => {
              const isPassed = activeIndex >= index
              const isActive = activeIndex === index
              let labelTransform = "-translate-x-1/2"
              if (index === 0) labelTransform = "translate-x-0"
              if (index === ROUTE_CITIES.length - 1)
                labelTransform = "-translate-x-full"

              return (
                <div
                  key={city.name}
                  className="absolute top-1/2 -translate-y-1/2 overflow-visible"
                  style={{ left: `${city.pct}%` }}
                >
                  {/* Tick marker */}
                  <div
                    className={`h-2.5 w-1 rounded-[1px] transition-colors duration-200 ${
                      isActive
                        ? "bg-[#C9A227] ring-2 ring-[#C9A227]/40 ring-offset-1 ring-offset-[#0E0E10]"
                        : isPassed
                          ? "bg-[#C9A227]"
                          : "bg-[#2A2B2E]"
                    }`}
                  />

                  {/* Active City Label - positioned BELOW the line (top-2.5) */}
                  {isActive && (
                    <div
                      className={`absolute top-2.5 ${labelTransform} whitespace-nowrap pointer-events-auto`}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-[#C9A227]/60 bg-[#0E0E10]/95 px-2 py-0.5 font-display text-[10px] font-bold text-[#C9A227] shadow-lg backdrop-blur-sm animate-in fade-in duration-150">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                        {city.name}
                        <span className="text-[#B9B7B0] font-normal">
                          · {city.km} km
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
