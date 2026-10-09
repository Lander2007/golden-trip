"use client"

import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { subscribeCityChange, scrollProgress } from "@/lib/scrollEngine"

export interface CityMarker {
  id: string
  nameKey: string
  name: string
  km: number
  pct: number
}

export const ROUTE_CITIES: CityMarker[] = [
  { id: "alexandria", nameKey: "cities.alexandria.name", name: "cities.alexandria.name", km: 0, pct: 0 },
  { id: "cairo", nameKey: "cities.cairo.name", name: "cities.cairo.name", km: 220, pct: 22.4 },
  { id: "sharm", nameKey: "cities.sharm.name", name: "cities.sharm.name", km: 500, pct: 51.0 },
  { id: "hurghada", nameKey: "cities.hurghada.name", name: "cities.hurghada.name", km: 650, pct: 66.3 },
  { id: "luxor", nameKey: "cities.luxor.name", name: "cities.luxor.name", km: 840, pct: 85.7 },
  { id: "aswan", nameKey: "cities.aswan.name", name: "cities.aswan.name", km: 980, pct: 100 },
]

export default function RouteProgressLine({
  condensed = false,
}: {
  km?: number
  condensed?: boolean
}) {
  const tRoute = useTranslations("route")
  const tCities = useTranslations()
  const locale = useLocale()
  const isRtl = locale === "ar"
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
      aria-label={tRoute("routeProgressAria")}
    >
      <div className="relative h-[2px] w-full bg-[#2A2B2E]">
        <div
          className={`h-full bg-[#C9A227] ${isRtl ? "ms-auto" : ""}`}
          style={{ width: "calc(var(--p, 0) * 100%)" }}
        />
        <div className="absolute inset-0 mx-auto max-w-[1200px] px-4 sm:px-8">
          <div className="relative h-full w-full">
            {ROUTE_CITIES.map((city, index) => {
              const isPassed = activeIndex >= index
              const isActive = activeIndex === index
              const localizedName = tCities(city.nameKey)
              const positionStyle = isRtl
                ? { right: `${city.pct}%`, transform: "translate(50%, -50%)" }
                : { left: `${city.pct}%`, transform: "translate(-50%, -50%)" }

              return (
                <div
                  key={city.id}
                  className="absolute top-1/2"
                  style={positionStyle}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      isActive || isPassed ? "bg-[#C9A227]" : "bg-[#2A2B2E]"
                    }`}
                    title={`${localizedName} · ${city.km} ${isRtl ? "كم" : "km"}`}
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
