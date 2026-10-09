"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Compass, ShieldCheck, MapPin } from "lucide-react"
import type { CityData } from "./egyptMapData"

interface CityPanelProps {
  city: CityData
  cityIndex: number
  totalRouteCities: number
  onSelectCity?: (city: CityData) => void
  routeCities: CityData[]
}

const CITY_SHORT_CODES: Record<string, string> = {
  alexandria: "ALX",
  cairo: "CAI",
  sharm: "SSH",
  hurghada: "HRG",
  luxor: "LXR",
  aswan: "ASW",
}

export default function CityPanel({
  city,
  cityIndex,
  totalRouteCities,
  onSelectCity,
  routeCities,
}: CityPanelProps) {
  const [displayedCity, setDisplayedCity] = useState<CityData>(city)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const prevCityId = useRef(city.id)

  useEffect(() => {
    if (city.id !== prevCityId.current) {
      prevCityId.current = city.id
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setDisplayedCity(city)
        setIsTransitioning(false)
      }, 120)
      return () => clearTimeout(timer)
    }
  }, [city])

  const shortCode = CITY_SHORT_CODES[displayedCity.id] || "EGY"
  const bookLabel =
    displayedCity.city.length > 14
      ? `Book from ${displayedCity.city.split(" ")[0]}`
      : `Book from ${displayedCity.city}`

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#C9A227]/25 bg-gradient-to-b from-[#0F1722] via-[#0A1018] to-[#070B10] p-4 shadow-2xl backdrop-blur-xl sm:p-6">
      {/* Top Gold Shimmer Edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-80"
        aria-hidden="true"
      />

      {/* Background Watermark Short Code */}
      <div
        className="pointer-events-none absolute right-4 top-8 select-none font-mono text-[72px] font-black tracking-tighter text-white/[0.03]"
        aria-hidden="true"
      >
        {shortCode}
      </div>

      {/* Top Header & Status Telemetry */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-[#2A2B2E]/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#FFD54F]">
              {displayedCity.isHq
                ? "WAYPOINT 01"
                : `WAYPOINT ${String(cityIndex + 1).padStart(2, "0")} / ${String(totalRouteCities).padStart(2, "0")}`}
            </span>
            {displayedCity.isHq ? (
              <span className="rounded-full border border-[#C9A227] bg-[#C9A227]/15 px-2 py-0.5 font-mono text-[10px] font-bold text-[#FFD54F]">
                HQ · ORIGIN
              </span>
            ) : (
              <span className="rounded-full border border-[#2A2B2E] bg-[#141518] px-2 py-0.5 font-mono text-[10px] text-[#E6CF85]">
                HIGHWAY BRANCH
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#B9B7B0]">
            <Compass className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
            <span className="hidden sm:inline">{displayedCity.coordinatesText || "Egypt"}</span>
          </div>
        </div>

        {/* Dynamic City Name & Tagline with Smooth Crossfade */}
        <div
          className={`mt-3.5 transition-all duration-200 ${
            isTransitioning ? "translate-y-1 opacity-40" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-[clamp(1.75rem,2.5vw,2.35rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#F4F2EC]">
              {displayedCity.city}
            </h3>
            <span className="font-mono text-xs font-bold text-[#C9A227]/70">
              {shortCode}
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm font-medium text-[#C9A227]">
            {displayedCity.tagline || "Golden Trip intercity highway terminus"}
          </p>

          {/* Highway Telemetry Metrics Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Metric 1: Distance from HQ */}
            <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09]/80 p-2.5 backdrop-blur-sm">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#B9B7B0]/70">
                From Alexandria HQ
              </span>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="font-display text-2xl font-extrabold tabular-nums text-[#F4F2EC]">
                  {displayedCity.km}
                </span>
                <span className="font-mono text-xs font-bold text-[#C9A227]">km</span>
              </div>
            </div>

            {/* Metric 2: Drive Time */}
            <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09]/80 p-2.5 backdrop-blur-sm">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-[#B9B7B0]/70">
                Estimated Transit
              </span>
              <div className="mt-0.5 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
                <span className="font-display text-sm sm:text-base font-bold text-[#F4F2EC]">
                  {displayedCity.driveTime || "Direct Highway"}
                </span>
              </div>
            </div>

            {/* Metric 3: Corridor */}
            <div className="col-span-2 rounded-lg border border-[#2A2B2E] bg-[#0B0A09]/80 p-2.5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#B9B7B0]/70">
                  Primary Arterial Corridor
                </span>
                <span className="font-mono text-[10px] font-semibold text-[#FFD54F]">
                  110 km/h speed
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs font-medium text-[#F4F2EC]">
                {displayedCity.corridor || "Trans-Egypt National Highway"}
              </p>
            </div>
          </div>

          {/* Regional Hubs & Transfer Terminals */}
          <div className="mt-3 flex items-start gap-2 rounded-md border border-[#2A2B2E]/60 bg-[#141518]/60 p-2.5 text-xs text-[#B9B7B0]">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A227]" aria-hidden="true" />
            <p className="line-clamp-2 leading-relaxed">
              <span className="font-semibold text-[#F4F2EC]">Direct connections: </span>
              {displayedCity.hubs || "Airport, resort transfers and city depots."}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Area: 6-Waypoint Interactive Stepper & Booking Action */}
      <div className="mt-4 pt-2">
        {/* Interactive 6-Waypoint Stepper Track */}
        <div className="mb-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#B9B7B0]/70">
              Interactive Route Waypoints
            </span>
            <span className="font-mono text-[10px] text-[#C9A227]">
              Click to jump
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
            {routeCities.map((rc, idx) => {
              const isCurrent = rc.id === displayedCity.id
              const isPassed = cityIndex > idx
              const code = CITY_SHORT_CODES[rc.id] || String(idx + 1)

              return (
                <button
                  key={rc.id}
                  type="button"
                  onClick={() => onSelectCity?.(rc)}
                  className={`group relative flex flex-col items-center justify-center rounded-md border py-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
                    isCurrent
                      ? "border-[#FFD54F] bg-[#C9A227] text-[#080D15] shadow-[0_0_12px_rgba(201,162,39,0.5)]"
                      : isPassed
                        ? "border-[#C9A227]/40 bg-[#161D27] text-[#FFD54F] hover:border-[#C9A227]"
                        : "border-[#2A2B2E] bg-[#0E141E] text-[#B9B7B0] hover:border-[#C9A227]/40 hover:text-[#F4F2EC]"
                  }`}
                  aria-label={`Select ${rc.city}`}
                >
                  <span className="font-mono text-[11px] font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-[9px] font-mono tracking-tight opacity-80">
                    {code}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Primary Booking CTA Button */}
        <Link
          href={`/signup?branch=${encodeURIComponent(displayedCity.city)}`}
          className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-[#C9A227] px-4 py-3 font-display text-sm font-bold text-[#080D15] shadow-lg transition-all duration-200 hover:bg-[#FFD54F] hover:shadow-[0_0_20px_rgba(201,162,39,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          <span>{bookLabel}</span>
          <ArrowRight
            className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>

        {/* Trust & Guarantee Subtitle */}
        <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[10px] text-[#B9B7B0]/60">
          <ShieldCheck className="h-3 w-3 text-[#C9A227]/80" aria-hidden="true" />
          <span>24/7 private chauffeur · Fixed highway pricing</span>
        </div>
      </div>
    </div>
  )
}
