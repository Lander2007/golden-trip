"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
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
    tagline: "Headquarters · Mediterranean hub",
    hubs: "Borg El Arab (HBE) · Corniche · Alexandria Port",
  },
  cairo: {
    tagline: "Capital · central interchange",
    hubs: "Cairo Intl (CAI) · Giza · Ring Road depot",
  },
  sharm: {
    tagline: "South Sinai resort terminus",
    hubs: "SSH · Naama Bay · Ras Mohammed",
  },
  hurghada: {
    tagline: "Red Sea Riviera hub",
    hubs: "HRG · El Gouna · Makadi Bay",
  },
  luxor: {
    tagline: "Nile Valley hub",
    hubs: "LXR · East Bank · Valley of the Kings",
  },
  aswan: {
    tagline: "Southern terminus",
    hubs: "ASW · High Dam · Philae",
  },
}

export default function CityPanel({
  city,
  cityIndex,
  totalRouteCities,
  onSelectCity,
  routeCities,
}: CityPanelProps) {
  const [displayedCity, setDisplayedCity] = useState<CityData>(city)
  const prevCityId = useRef(city.id)

  useEffect(() => {
    if (city.id !== prevCityId.current) {
      prevCityId.current = city.id
      setDisplayedCity(city)
    }
  }, [city])

  const info = cityDescriptions[displayedCity.id] || {
    tagline: "Golden Trip highway branch",
    hubs: "Airport and intercity transfers.",
  }

  const bookLabel =
    displayedCity.city.length > 14
      ? `Book from ${displayedCity.city.split(" ")[0]}`
      : `Book from ${displayedCity.city}`

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#EADFC8]/15 bg-[#0C1A2B] p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold text-[#C9A227]">
          {displayedCity.isHq
            ? "01 · Headquarters"
            : `${String(cityIndex + 1).padStart(2, "0")} / ${String(totalRouteCities).padStart(2, "0")}`}
        </span>
        {displayedCity.isHq ? (
          <span className="rounded-full border border-[#C9A227] px-2 py-0.5 text-[10px] font-semibold text-[#C9A227]">
            HQ
          </span>
        ) : (
          <span className="font-mono text-[10px] text-[#B9B7B0]">Highway branch</span>
        )}
      </div>

      <h3 className="mt-3 font-display text-[clamp(1.6rem,2.4vw,2.25rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#F4F2EC]">
        {displayedCity.city}
      </h3>
      <p className="mt-1 truncate text-sm text-[#C9A227]">{info.tagline}</p>

      <div className="mt-4 flex items-center justify-between rounded-sm border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5">
        <span className="text-xs text-[#B9B7B0]">From Alexandria</span>
        <span className="font-display text-xl font-extrabold tabular-nums text-[#F4F2EC]">
          {displayedCity.km}
          <span className="ml-1 text-xs font-semibold text-[#C9A227]">km</span>
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#B9B7B0]">{info.hubs}</p>

      <div className="mt-4 flex gap-1">
        {routeCities.map((rc, idx) => {
          const isCurrent = rc.id === displayedCity.id
          return (
            <button
              key={rc.id}
              type="button"
              onClick={() => onSelectCity?.(rc)}
              className={`h-7 min-w-7 rounded-full px-2 text-[11px] font-semibold ${
                isCurrent
                  ? "bg-[#C9A227] text-[#0B0A09]"
                  : "bg-[#141518] text-[#B9B7B0] hover:bg-[#2A2B2E] hover:text-[#F4F2EC]"
              }`}
              aria-label={rc.city}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      <Link
        href={`/signup?branch=${encodeURIComponent(displayedCity.city)}`}
        className="mt-auto inline-flex w-full shrink-0 items-center justify-center rounded-sm bg-[#C9A227] px-4 py-3 font-display text-sm font-bold text-[#0B0A09] hover:bg-[#E6CF85] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
      >
        {bookLabel}
        <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" />
      </Link>
    </div>
  )
}
