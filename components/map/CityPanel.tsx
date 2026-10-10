"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "@/i18n/routing"
import { useLocale, useTranslations } from "next-intl"
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
  const locale = useLocale()
  const isAr = locale === "ar"
  const tCities = useTranslations("cities")
  const tCommon = useTranslations("common")
  const numFormat = new Intl.NumberFormat(isAr ? "ar-EG" : "en", {
    numberingSystem: isAr ? "arab" : "latn",
  })

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

  const shortCode = displayedCity.code || CITY_SHORT_CODES[displayedCity.id] || "EGY"
  const cityName = displayedCity.nameKey
    ? tCities(displayedCity.nameKey.replace(/^cities\./, ""))
    : tCities(`${displayedCity.id}.name`)
  const bookLabel = tCities("bookFromCity", { city: cityName })

  const cityTagline = displayedCity.taglineKey
    ? tCities(displayedCity.taglineKey.replace(/^cities\./, ""))
    : tCities(`${displayedCity.id}.tagline`)
  const cityDriveTime = displayedCity.driveTimeKey
    ? tCities(displayedCity.driveTimeKey.replace(/^cities\./, ""))
    : tCities(`${displayedCity.id}.driveTime`)
  const cityCorridor = displayedCity.corridorKey
    ? tCities(displayedCity.corridorKey.replace(/^cities\./, ""))
    : tCities(`${displayedCity.id}.corridor`)
  const cityHubs = displayedCity.hubsKey
    ? tCities(displayedCity.hubsKey.replace(/^cities\./, ""))
    : tCities(`${displayedCity.id}.hubs`)

  const currentStepStr = isAr
    ? numFormat.format(cityIndex + 1).padStart(2, numFormat.format(0))
    : String(cityIndex + 1).padStart(2, "0")
  const totalStepStr = isAr
    ? numFormat.format(totalRouteCities).padStart(2, numFormat.format(0))
    : String(totalRouteCities).padStart(2, "0")

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[#C9A227]/25 bg-gradient-to-b from-[#0F1722] via-[#0A1018] to-[#070B10] p-3.5 shadow-2xl backdrop-blur-xl sm:p-5">
      {/* Top Gold Shimmer Edge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-80"
        aria-hidden="true"
      />

      {/* Background Watermark Short Code (6% opacity, clipped inside card, aria-hidden, no collision) */}
      <div
        className="pointer-events-none absolute end-2 top-2 select-none text-[68px] sm:text-[80px] font-black leading-none text-white/[0.06] overflow-hidden -z-0"
        aria-hidden="true"
      >
        <bdi dir="ltr">{shortCode}</bdi>
      </div>

      {/* Top Header & Status Telemetry */}
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 border-b border-[#2A2B2E]/60 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="panel-small-label text-xs rtl:text-[13px] font-medium text-[#FFD54F]">
              {displayedCity.isHq
                ? tCities("waypointHq")
                : tCities("waypointStep", {
                    current: currentStepStr,
                    total: totalStepStr,
                  })}
            </span>
            {displayedCity.isHq ? (
              <span className="rounded-full border border-[#C9A227] bg-[#C9A227]/15 px-2 py-0.5 text-xs rtl:text-[13px] font-medium text-[#FFD54F]">
                {tCities("hqOriginBadge")}
              </span>
            ) : (
              <span className="rounded-full border border-[#2A2B2E] bg-[#141518] px-2 py-0.5 text-xs rtl:text-[13px] font-medium text-[#E6CF85]">
                {tCities("highwayBranchBadge")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs rtl:text-[13px] font-medium text-[#B9B7B0]">
            <Compass className="h-3.5 w-3.5 text-[#C9A227]" aria-hidden="true" />
            <span className="hidden sm:inline">
              <bdi dir="ltr">{displayedCity.coordinatesText || "Egypt"}</bdi>
            </span>
          </div>
        </div>

        {/* Dynamic City Name & Tagline with Smooth Crossfade */}
        <div
          className={`mt-3.5 transition-all duration-200 ${
            isTransitioning ? "translate-y-1 opacity-40" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="city-panel-title font-display text-[clamp(1.75rem,2.5vw,2.35rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[#F4F2EC]">
              {cityName}
            </h3>
            <span className="text-xs rtl:text-[13px] font-semibold text-[#C9A227]/70">
              <bdi dir="ltr">{shortCode}</bdi>
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm font-medium text-[#C9A227]">
            {cityTagline}
          </p>

          {/* Highway Telemetry Metrics Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-2.5">
            {/* Metric 1: Distance from HQ */}
            <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09]/80 p-2.5 backdrop-blur-sm">
              <span className="panel-small-label block text-xs rtl:text-[13px] font-medium text-[#B9B7B0]/70">
                {tCities("fromAlexHq")}
              </span>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold tabular-nums text-[#F4F2EC]">
                  {numFormat.format(displayedCity.km)}
                </span>
                <span className="text-xs rtl:text-[13px] font-medium text-[#C9A227]">{tCommon("kmUnit")}</span>
              </div>
            </div>

            {/* Metric 2: Estimated time */}
            <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09]/80 p-2.5 backdrop-blur-sm">
              <span className="panel-small-label block text-xs rtl:text-[13px] font-medium text-[#B9B7B0]/70">
                {tCities("estimatedTransit")}
              </span>
              <div className="mt-0.5 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#C9A227]" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-medium text-[#F4F2EC]">
                  {cityDriveTime}
                </span>
              </div>
            </div>

            {/* Metric 3: Express route & Speed */}
            <div className="col-span-2 rounded-lg border border-[#2A2B2E] bg-[#0B0A09]/80 p-2.5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <span className="panel-small-label text-xs rtl:text-[13px] font-medium text-[#B9B7B0]/70">
                  {tCities("primaryCorridor")}
                </span>
                <span className="panel-small-label text-xs rtl:text-[13px] font-medium text-[#FFD54F]">
                  {tCities("speedLimit")}
                </span>
              </div>
              <p className="mt-0.5 text-xs rtl:text-[13px] font-medium text-[#F4F2EC] [overflow-wrap:anywhere] break-words">
                {cityCorridor}
              </p>
            </div>
          </div>

          {/* Connected destinations (Regional Hubs) */}
          <div className="mt-3 flex items-start gap-2 rounded-md border border-[#2A2B2E]/60 bg-[#141518]/60 p-2.5 text-xs rtl:text-[13px] text-[#B9B7B0]">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A227]" aria-hidden="true" />
            <p className="leading-relaxed [overflow-wrap:anywhere] break-words">
              <span className="panel-small-label font-medium text-[#F4F2EC]">{tCities("directConnections")} </span>
              {cityHubs}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Area: 6-Waypoint Interactive Stepper & Booking Action */}
      <div className="relative z-10 mt-4 pt-2">
        {/* Interactive 6-Waypoint Stepper Track */}
        <div className="mb-3.5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="panel-small-label text-xs rtl:text-[13px] font-medium text-[#B9B7B0]/70">
              {tCities("interactiveWaypoints")}
            </span>
            <span className="panel-small-label text-xs rtl:text-[13px] font-medium text-[#C9A227]">
              {tCities("clickToJump")}
            </span>
          </div>

          <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
            {routeCities.map((rc, idx) => {
              const isCurrent = rc.id === displayedCity.id
              const isPassed = cityIndex > idx
              const code = rc.code || CITY_SHORT_CODES[rc.id] || String(idx + 1)
              const rcName = rc.nameKey
                ? tCities(rc.nameKey.replace(/^cities\./, ""))
                : tCities(`${rc.id}.name`)

              return (
                <button
                  key={rc.id}
                  type="button"
                  onClick={() => onSelectCity?.(rc)}
                  className={`group relative flex min-h-[44px] flex-col items-center justify-center rounded-md border py-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] ${
                    isCurrent
                      ? "border-[#FFD54F] bg-[#C9A227] text-[#080D15] shadow-[0_0_12px_rgba(201,162,39,0.5)]"
                      : isPassed
                        ? "border-[#C9A227]/40 bg-[#161D27] text-[#FFD54F] hover:border-[#C9A227]"
                        : "border-[#2A2B2E] bg-[#0E141E] text-[#B9B7B0] hover:border-[#C9A227]/40 hover:text-[#F4F2EC]"
                  }`}
                  aria-label={tCities("selectWaypointAria", { city: rcName })}
                >
                  <span className="text-xs rtl:text-[13px] font-bold tabular-nums">
                    {numFormat.format(idx + 1)}
                  </span>
                  <span className="text-xs rtl:text-[13px] font-medium opacity-80">
                    <bdi dir="ltr">{code}</bdi>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Primary Booking CTA Button */}
        <Link
          href={`/signup?branch=${encodeURIComponent(cityName)}`}
          className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-md bg-[#C9A227] px-4 py-2.5 sm:py-3 text-sm font-bold text-[#080D15] shadow-lg transition-all duration-200 hover:bg-[#FFD54F] hover:shadow-[0_0_20px_rgba(201,162,39,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          <span>{bookLabel}</span>
          <ArrowRight
            className="ms-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
            aria-hidden="true"
          />
        </Link>

        {/* Trust & Guarantee Subtitle */}
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs rtl:text-[13px] font-medium text-[#B9B7B0]/60">
          <ShieldCheck className="h-3.5 w-3.5 text-[#C9A227]/80" aria-hidden="true" />
          <span>{tCities("chauffeurAssurance")}</span>
        </div>
      </div>
    </div>
  )
}
