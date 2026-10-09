"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { MapPin, Navigation, ArrowRight } from "lucide-react"
import type { CityData } from "./egyptMapData"

interface CityPanelProps {
  city: CityData
  cityIndex: number
  totalRouteCities: number
  onSelectCity?: (city: CityData) => void
  routeCities: CityData[]
}

const cityDescriptions: Record<string, { tagline: string; hubs: string }> = {
  alexandria: {
    tagline: "Headquarters & Mediterranean Coastal Hub",
    hubs: "Borg El Arab Airport (HBE) · Corniche · Alexandria Port · Direct Cairo Desert Highway Link",
  },
  cairo: {
    tagline: "National Capital & Central Interchange",
    hubs: "Cairo International (CAI) · New Administrative Capital · Giza Pyramids · Ring Road Fleet Depot",
  },
  sharm: {
    tagline: "South Sinai International Resort Terminus",
    hubs: "Sharm El-Sheikh Intl (SSH) · Naama Bay · Ras Mohammed · Sinai Highway Corridor",
  },
  hurghada: {
    tagline: "Red Sea Riviera Coastal Hub",
    hubs: "Hurghada Airport (HRG) · El Gouna · Makadi Bay · Sahl Hasheesh Highway Branch",
  },
  luxor: {
    tagline: "Upper Egypt Nile Valley Hub",
    hubs: "Luxor International (LXR) · East Bank Terminal · Valley of the Kings · Qena Highway Link",
  },
  aswan: {
    tagline: "Southern Border & High Dam Terminus",
    hubs: "Aswan Airport (ASW) · High Dam Marina · Philae Corridor · Nile Valley Highway Gateway",
  },
}

export default function CityPanel({
  city,
  cityIndex,
  totalRouteCities,
  onSelectCity,
  routeCities,
}: CityPanelProps) {
  const [flipped, setFlipped] = useState(false)
  const [displayedCity, setDisplayedCity] = useState<CityData>(city)
  const prevCityId = useRef(city.id)

  useEffect(() => {
    if (city.id !== prevCityId.current) {
      prevCityId.current = city.id
      setFlipped(true)
      const timeout = setTimeout(() => {
        setDisplayedCity(city)
        setFlipped(false)
      }, 160)
      return () => clearTimeout(timeout)
    }
  }, [city])

  const info = cityDescriptions[displayedCity.id] || {
    tagline: "Official Golden Trip Highway Branch",
    hubs: "Direct airport transfers and intercity private fleet service.",
  }

  return (
    <div className="relative flex h-full flex-col justify-between rounded-2xl border border-[#EADFC8]/15 bg-[#0C1A2B]/90 p-6 sm:p-8 lg:p-10 backdrop-blur-md shadow-2xl overflow-hidden select-none">
      {/* Background Highway Watermark */}
      <div
        className="pointer-events-none absolute right-[-20px] bottom-[-30px] font-display text-[120px] lg:text-[160px] font-black text-[#EADFC8]/[0.03] leading-none select-none"
        aria-hidden="true"
      >
        {String(cityIndex + 1).padStart(2, "0")}
      </div>

      {/* Top Header Row: Split-flap Stop Indicator */}
      <div>
        <div className="flex items-center justify-between border-b border-[#2A2B2E] pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#C9A227] animate-pulse" />
            <span className="font-mono text-xs font-semibold text-[#C9A227]">
              {displayedCity.isHq
                ? "Branch 01 · Fleet headquarters"
                : `Route stop ${String(cityIndex + 1).padStart(2, "0")} / ${String(totalRouteCities).padStart(2, "0")}`}
            </span>
          </div>

          <span className="rounded-xs border border-[#C9A227]/30 bg-[#C9A227]/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#E6CF85]">
            Highway exit
          </span>
        </div>

        {/* Split-Flap City Display Area */}
        <div
          className={`mt-6 transition-transform duration-200 ease-in-out ${
            flipped ? "scale-95 opacity-40 -translate-y-2" : "scale-100 opacity-100 translate-y-0"
          }`}
        >
          {/* Main City Title in Anybody font */}
          <div className="relative inline-block">
            <h3 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-[#F4F2EC]">
              {displayedCity.city}
            </h3>
            {displayedCity.isHq && (
              <span className="ml-3 inline-block align-middle rounded-full border border-[#C9A227] px-2.5 py-0.5 text-xs font-semibold text-[#C9A227]">
                HQ
              </span>
            )}
          </div>

          {/* Subtitle Tagline */}
          <p className="mt-2 text-sm sm:text-base font-medium text-[#C9A227]">
            {info.tagline}
          </p>

          {/* Road Distance from Alexandria in km */}
          <div className="mt-6 flex flex-col gap-1 rounded-sm border border-[#2A2B2E] bg-[#0B0A09]/70 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium text-[#B9B7B0]">
                Road distance from Alexandria:
              </span>
              <span className="font-display text-2xl sm:text-3xl font-extrabold tabular-nums text-[#F4F2EC]">
                {displayedCity.km}{" "}
                <span className="text-sm font-semibold text-[#C9A227]">km</span>
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#B9B7B0]/60 italic">
              * Road distance from Alexandria (to be confirmed by the client)
            </p>
          </div>

          {/* Key Departure Hubs */}
          <div className="mt-5 space-y-1">
            <span className="text-xs font-semibold text-[#B9B7B0]/80">
              Key departure hubs
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-[#B9B7B0]">
              {info.hubs}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action Area: Divider, CTA & Stop Switchers */}
      <div className="mt-8 pt-4 border-t border-[#2A2B2E]">
        {/* Short Highway Divider Line */}
        <div className="mb-6 h-[2px] w-16 bg-[#C9A227]" aria-hidden="true" />

        {/* Action Button: Book From Here */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={`/signup?branch=${encodeURIComponent(displayedCity.city)}`}
            className="flex-1 inline-flex items-center justify-center rounded-sm bg-[#C9A227] px-6 py-3.5 font-display text-sm sm:text-base font-bold text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] shadow-lg"
          >
            <span>Book from {displayedCity.city}</span>
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Quick Stop Switcher Pills */}
        <div className="mt-5 flex items-center justify-between gap-1 overflow-x-auto pt-2">
          {routeCities.map((rc, idx) => {
            const isCurrent = rc.id === displayedCity.id
            return (
              <button
                key={rc.id}
                type="button"
                onClick={() => onSelectCity?.(rc)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                  isCurrent
                    ? "bg-[#C9A227] text-[#0B0A09] font-bold shadow-xs"
                    : "bg-[#141518] text-[#B9B7B0] hover:text-[#F4F2EC] hover:bg-[#2A2B2E]"
                }`}
                aria-label={`View stop ${idx + 1}: ${rc.city}`}
              >
                <span>{idx + 1}</span>
                <span className="hidden sm:inline">{rc.city.split(" ")[0]}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
