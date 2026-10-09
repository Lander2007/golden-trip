"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  EGYPT_PATH_DATA,
  ROUTE_PATH_DATA,
  EGYPT_MAP_WIDTH,
  EGYPT_MAP_HEIGHT,
  ALL_CITIES,
  ROUTE_CITIES,
  type CityData,
} from "./egyptMapData"

export interface RouteMapHandle {
  setProgress: (progress: number) => void
}

interface RouteMapProps {
  progress?: number
  activeCity: CityData
  onSelectCity?: (city: CityData) => void
  showOtherCities?: boolean
}

const LABEL_LAYOUT: Record<string, { dx: number; dy: number; anchor: "start" | "end" | "middle" }> = {
  alexandria: { dx: -12, dy: 4, anchor: "end" },
  cairo: { dx: 14, dy: 16, anchor: "start" },
  sharm: { dx: 14, dy: -6, anchor: "start" },
  hurghada: { dx: -14, dy: 14, anchor: "end" },
  luxor: { dx: -14, dy: 4, anchor: "end" },
  aswan: { dx: 14, dy: 4, anchor: "start" },
}

// Milestone progress points for the 6 route cities
const CITY_PROGRESS_MAP: Record<string, number> = {
  alexandria: 0.0,
  cairo: 0.1728,
  sharm: 0.5346,
  hurghada: 0.6398,
  luxor: 0.835,
  aswan: 1.0,
}

const RouteMap = forwardRef<RouteMapHandle, RouteMapProps>(function RouteMap(
  {
    progress = 0,
    activeCity,
    onSelectCity,
    showOtherCities = true,
  },
  ref
) {
  const locale = useLocale()
  const isAr = locale === "ar"
  const tRoute = useTranslations("route")
  const tCities = useTranslations("cities")
  const tCommon = useTranslations("common")
  const tA11y = useTranslations("a11y")
  const numFormat = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en", {
    numberingSystem: locale === "ar" ? "arab" : "latn",
  })

  const routePathRef = useRef<SVGPathElement>(null)
  const routeGlowPathRef = useRef<SVGPathElement>(null)
  const carMarkerRef = useRef<SVGGElement>(null)
  const otherCitiesRef = useRef<SVGGElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const liveKmBadgeRef = useRef<HTMLSpanElement>(null)
  const coordinatesBadgeRef = useRef<HTMLSpanElement>(null)

  const sampledPointsRef = useRef<{ x: number; y: number; angle: number; km: number }[]>([])
  const totalLengthRef = useRef<number>(651)
  const [hoveredCity, setHoveredCity] = useState<CityData | null>(null)

  // Pre-sample 240 points along the path once on mount for butter-smooth 60fps tracking
  useEffect(() => {
    if (!routePathRef.current) return
    const path = routePathRef.current
    const len = path.getTotalLength()
    totalLengthRef.current = len

    const samples: { x: number; y: number; angle: number; km: number }[] = []
    const sampleCount = 240
    for (let i = 0; i <= sampleCount; i++) {
      const d = (i / sampleCount) * len
      const pt = path.getPointAtLength(d)

      const nextD = Math.min(len, d + 1.5)
      const prevD = Math.max(0, d - 1.5)
      const pNext = path.getPointAtLength(nextD)
      const pPrev = path.getPointAtLength(prevD)
      const angleRad = Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x)
      const angleDeg = (angleRad * 180) / Math.PI

      // Piecewise odometer km interpolation across the 980 km route
      const t = i / sampleCount
      let estimatedKm = 0
      if (t <= 0.1728) {
        estimatedKm = Math.round((t / 0.1728) * 220)
      } else if (t <= 0.5346) {
        estimatedKm = Math.round(220 + ((t - 0.1728) / (0.5346 - 0.1728)) * 280)
      } else if (t <= 0.6398) {
        estimatedKm = Math.round(500 + ((t - 0.5346) / (0.6398 - 0.5346)) * 150)
      } else if (t <= 0.835) {
        estimatedKm = Math.round(650 + ((t - 0.6398) / (0.835 - 0.6398)) * 190)
      } else {
        estimatedKm = Math.round(840 + ((t - 0.835) / (1 - 0.835)) * 140)
      }

      samples.push({ x: pt.x, y: pt.y, angle: angleDeg, km: estimatedKm })
    }
    sampledPointsRef.current = samples

    // Initialize stroke dash properties
    if (routePathRef.current) {
      routePathRef.current.style.strokeDasharray = `${len} ${len}`
      routePathRef.current.style.strokeDashoffset = String(len)
    }
    if (routeGlowPathRef.current) {
      routeGlowPathRef.current.style.strokeDasharray = `${len} ${len}`
      routeGlowPathRef.current.style.strokeDashoffset = String(len)
    }

    updateProgress(progress)
  }, [])

  const updateProgress = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p))
    const len = totalLengthRef.current

    const offsetVal = String(len * (1 - clamped))

    // 1. Draw glowing traveled route line
    if (routePathRef.current) {
      routePathRef.current.style.strokeDashoffset = offsetVal
    }
    if (routeGlowPathRef.current) {
      routeGlowPathRef.current.style.strokeDashoffset = offsetVal
    }

    // 2. Hardware-accelerated car transform & heading
    const samples = sampledPointsRef.current
    if (samples.length > 0 && carMarkerRef.current) {
      const idx = Math.min(samples.length - 1, Math.max(0, Math.round(clamped * (samples.length - 1))))
      const pt = samples[idx]
      carMarkerRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${pt.angle}deg)`

      // 3. Update live kilometer readout directly on DOM for zero React re-render overhead
      if (liveKmBadgeRef.current) {
        liveKmBadgeRef.current.textContent = tRoute("liveProgressStatus", {
          km: numFormat.format(pt.km),
          pct: numFormat.format(Math.round(clamped * 100)),
        })
      }
    }

    // 4. Update coordinates telemetry
    if (coordinatesBadgeRef.current) {
      const lat = (31.2 - clamped * (31.2 - 24.08)).toFixed(2)
      const lon = (29.9 + clamped * (32.9 - 29.9)).toFixed(2)
      coordinatesBadgeRef.current.textContent = isAr
        ? `${lat}° شمالاً ${lon}° شرقاً`
        : `${lat}°N ${lon}°E`
    }

    // 5. Update bottom progress bar width
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${Math.round(clamped * 100)}%`
    }
  }

  useImperativeHandle(
    ref,
    () => ({
      setProgress: (p: number) => {
        updateProgress(p)
      },
    }),
    []
  )

  const otherCities = ALL_CITIES.filter((c) => !c.isRouteCity)

  return (
    <div className="relative flex h-full w-full select-none items-center justify-center overflow-hidden rounded-2xl border border-[#C9A227]/25 bg-gradient-to-b from-[#0F1722] via-[#0A1018] to-[#070B10] p-3 shadow-2xl sm:p-5">
      {/* High-tech Cartographic Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      {/* Ambient Gold Horizon Radial Glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-[#C9A227]/10 blur-3xl"
        aria-hidden="true"
      />

      {/* Top Left: Compass Rose & Coordinates */}
      <div
        className="pointer-events-none absolute start-4 top-4 z-10 flex items-center gap-2.5 font-mono text-[10px] text-[#EADFC8]/70"
        aria-hidden="true"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C9A227]/30 bg-[#0B0A09]/80 text-[#C9A227]">
          <span className="font-bold">N</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold tracking-wider text-[#F4F2EC]">
            {tRoute("networkTitle")}
          </span>
          <span ref={coordinatesBadgeRef} className="text-[#C9A227]/80 tabular-nums">
            {tRoute("coordinatesAlex")}
          </span>
        </div>
      </div>

      {/* Top Right: Live Corridor Status Pill */}
      <div
        className="pointer-events-none absolute end-4 top-4 z-10 hidden items-center gap-2 rounded-full border border-[#C9A227]/25 bg-[#0B0A09]/80 px-3 py-1 font-mono text-[10px] backdrop-blur-md sm:flex"
        aria-hidden="true"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A227] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A227]" />
        </span>
        <span className="text-[#B9B7B0]">{tRoute("corridorTitle")}</span>
        <span className="font-bold text-[#E6CF85]">{tRoute("corridorValue")}</span>
      </div>

      {/* Main Interactive SVG Map */}
      <svg
        viewBox={`0 0 ${EGYPT_MAP_WIDTH} ${EGYPT_MAP_HEIGHT}`}
        className="h-full max-h-[680px] w-full object-contain"
        aria-label={tA11y("interactiveMapAriaLabel")}
        role="img"
      >
        <defs>
          {/* Headlight beam gradient */}
          <linearGradient id="headlight-beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#C9A227" stopOpacity="0.5" />
            <stop offset="75%" stopColor="#C9A227" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
          </linearGradient>

          {/* Taillight glow gradient */}
          <radialGradient id="taillight-glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#E07A2F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E07A2F" stopOpacity="0" />
          </radialGradient>

          {/* Golden metallic car body gradient */}
          <linearGradient id="gold-car-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E6CF85" />
            <stop offset="45%" stopColor="#C9A227" />
            <stop offset="100%" stopColor="#967718" />
          </linearGradient>

          {/* Traveled route neon bloom filter */}
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Landmass subtle fill pattern */}
          <linearGradient id="egypt-land-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1017" />
            <stop offset="50%" stopColor="#080C12" />
            <stop offset="100%" stopColor="#05080E" />
          </linearGradient>
        </defs>

        {/* Latitude Reference Parallels */}
        <g opacity="0.08" stroke="#EADFC8" strokeDasharray="4 6" strokeWidth="1">
          <line x1="50" y1="150" x2="750" y2="150" /> {/* 30°N Cairo */}
          <line x1="50" y1="300" x2="750" y2="300" /> {/* 28°N Sinai */}
          <line x1="50" y1="450" x2="750" y2="450" /> {/* 26°N Upper Egypt */}
          <line x1="50" y1="550" x2="750" y2="550" /> {/* 24°N Tropic of Cancer / Aswan */}
        </g>

        {/* Base Egypt Landmass Outline */}
        <path
          d={EGYPT_PATH_DATA}
          fill="url(#egypt-land-grad)"
          stroke="#C9A227"
          strokeOpacity="0.25"
          strokeWidth="1.2"
          className="transition-colors duration-300"
        />

        {/* Projected highway path (untraveled dashed line) */}
        <path
          d={ROUTE_PATH_DATA}
          fill="none"
          stroke="#C9A227"
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeOpacity="0.22"
          strokeLinecap="round"
        />

        {/* Route Shadow Layer */}
        <path
          d={ROUTE_PATH_DATA}
          fill="none"
          stroke="#000000"
          strokeWidth="6"
          strokeOpacity="0.6"
        />

        {/* Glowing Traveled Neon Highway Layer */}
        <path
          ref={routeGlowPathRef}
          d={ROUTE_PATH_DATA}
          fill="none"
          stroke="#C9A227"
          strokeWidth="6"
          strokeOpacity="0.5"
          strokeLinecap="round"
          filter="url(#route-glow)"
        />

        {/* Crisp Golden Core Traveled Highway Line */}
        <path
          ref={routePathRef}
          d={ROUTE_PATH_DATA}
          fill="none"
          stroke="#FFD54F"
          strokeWidth="2.75"
          strokeLinecap="round"
        />

        {/* 8 Secondary Network Destination Dots */}
        <g
          ref={otherCitiesRef}
          className="transition-opacity duration-300"
          style={{ opacity: showOtherCities ? 1 : 0 }}
        >
          {otherCities.map((city) => (
            <g
              key={city.id}
              className="group cursor-pointer"
              onClick={() => onSelectCity?.(city)}
              onMouseEnter={() => setHoveredCity(city)}
              onMouseLeave={() => setHoveredCity(null)}
            >
              <circle
                cx={city.x}
                cy={city.y}
                r="3.5"
                fill="#EADFC8"
                fillOpacity="0.65"
                stroke="#080D15"
                strokeWidth="1.2"
                className="transition-all duration-200 group-hover:scale-150 group-hover:fill-[#C9A227]"
              />
              <title>{`${city.city} (${city.km} km from Alex)`}</title>
            </g>
          ))}
        </g>

        {/* 6 Primary Highway Route Cities */}
        {ROUTE_CITIES.map((city) => {
          const isActive = activeCity.id === city.id
          const label = LABEL_LAYOUT[city.id]
          const cityProg = CITY_PROGRESS_MAP[city.id] ?? 0
          const isVisited = progress >= cityProg - 0.015

          return (
            <g
              key={city.id}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => onSelectCity?.(city)}
            >
              {/* Radar sonar pulse wave on active city */}
              {isActive && (
                <>
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="18"
                    fill="none"
                    stroke="#C9A227"
                    strokeWidth="1"
                    opacity="0.3"
                    className="animate-ping"
                    style={{ transformOrigin: `${city.x}px ${city.y}px`, animationDuration: "2.2s" }}
                  />
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="12"
                    fill="#C9A227"
                    fillOpacity="0.15"
                    stroke="#C9A227"
                    strokeWidth="1.5"
                    opacity="0.7"
                  />
                </>
              )}

              {/* Visited / Active Outer Pin Rim */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isActive ? "7.5" : "5.5"}
                fill={isActive ? "#FFD54F" : isVisited ? "#C9A227" : "#1A2433"}
                stroke="#080D15"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Core Pin Center */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isActive ? "3" : "2"}
                fill={isActive ? "#080D15" : isVisited ? "#080D15" : "#EADFC8"}
                className="transition-all duration-300"
              />

              {/* City Name Label with Sleek Backplate */}
              {label && (
                <g className="pointer-events-none select-none">
                  <text
                    x={city.x + label.dx}
                    y={city.y + label.dy}
                    textAnchor={label.anchor}
                    fill={isActive ? "#FFD54F" : isVisited ? "#F4F2EC" : "#B9B7B0"}
                    fontSize={isActive ? "12" : "11"}
                    fontFamily={isAr ? "var(--font-ibm-plex-sans-arabic), sans-serif" : "var(--font-anybody), sans-serif"}
                    fontWeight={isActive ? "800" : "600"}
                    letterSpacing={isAr ? "0" : "0.02em"}
                    className="transition-colors duration-200"
                  >
                    {tCities(`${city.id}.name`)}
                    {city.isHq ? ` ${tCities("hqLabel")}` : ""}
                  </text>
                  {isActive && (
                    <text
                      x={city.x + label.dx}
                      y={city.y + label.dy + 12}
                      textAnchor={label.anchor}
                      fill="#C9A227"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="600"
                      opacity="0.85"
                    >
                      {numFormat.format(city.km)} {tCommon("kmUnit")}
                    </text>
                  )}
                </g>
              )}
            </g>
          )
        })}

        {/* 
          TOP-DOWN GOLDEN TRIP VEHICLE MARKER:
          Precisely aligned with sampled tangents along the highway curve
        */}
        <g ref={carMarkerRef} id="map-car-marker" style={{ transformOrigin: "0px 0px" }}>
          {/* Forward Headlight High-Beam Cones */}
          <path
            d="M 14 -2 L 52 -18 L 52 18 L 14 2 Z"
            fill="url(#headlight-beam-grad)"
            opacity="0.8"
            pointerEvents="none"
          />

          {/* Soft Taillight Glow behind vehicle */}
          <circle cx="-16" cy="0" r="10" fill="url(#taillight-glow-grad)" pointerEvents="none" />

          {/* Aerodynamic Luxury Vehicle Body */}
          <rect
            x="-13"
            y="-6.5"
            width="26"
            height="13"
            rx="4"
            fill="url(#gold-car-gradient)"
            stroke="#080D15"
            strokeWidth="1.5"
          />

          {/* Tinted Panoramic Windshield & Roof */}
          <rect
            x="-2"
            y="-4.5"
            width="7"
            height="9"
            rx="2"
            fill="#080D15"
          />

          {/* Rear Tinted Glass */}
          <rect
            x="-10"
            y="-4"
            width="4.5"
            height="8"
            rx="1.5"
            fill="#080D15"
          />

          {/* Front Dual LED Projector Headlights */}
          <circle cx="12" cy="-4.5" r="1.3" fill="#FFFFFF" />
          <circle cx="12" cy="4.5" r="1.3" fill="#FFFFFF" />

          {/* Rear Red/Amber LED Taillight Ribbons */}
          <rect x="-12.8" y="-5.5" width="1.5" height="2.5" rx="0.5" fill="#E07A2F" />
          <rect x="-12.8" y="3" width="1.5" height="2.5" rx="0.5" fill="#E07A2F" />
        </g>
      </svg>

      {/* Floating Tooltip when hovering secondary cities */}
      {hoveredCity && (
        <div className="pointer-events-none absolute bottom-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rounded-md border border-[#C9A227]/40 bg-[#080D15]/95 px-3 py-1.5 font-mono text-xs text-[#F4F2EC] shadow-xl backdrop-blur-md">
          <span className="font-bold text-[#C9A227]">
            {tCities(`${hoveredCity.id}.name`)}
          </span>
          <span className="ms-2 text-[#B9B7B0]">
            · {numFormat.format(hoveredCity.km)} {tCommon("kmUnit")} {tCities("fromAlexLabel")}
          </span>
        </div>
      )}

      {/* Bottom Automotive Highway Distance Progress Meter */}
      <div className="pointer-events-none absolute bottom-3.5 inset-x-5 flex items-center justify-between font-mono text-[11px] text-[#B9B7B0]/80">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#C9A227]">
            {tCities("alexandria.name")} {tCities("hqLabel")}
          </span>
          <span className="hidden sm:inline text-[#B9B7B0]/60">
            ({numFormat.format(0)} {tCommon("kmUnit")})
          </span>
        </div>

        {/* Central Track & Live Odometer Badge */}
        <div className="mx-3 sm:mx-6 flex flex-1 flex-col items-center">
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#1A2433]">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-[#967718] via-[#C9A227] to-[#FFD54F] shadow-[0_0_8px_#C9A227]"
              style={{ width: "0%" }}
            />
          </div>
          <span
            ref={liveKmBadgeRef}
            className="mt-1 font-mono text-[10px] font-semibold text-[#E6CF85] tabular-nums"
          >
            {tRoute("liveProgressStatus", {
              km: numFormat.format(0),
              pct: numFormat.format(0),
            })}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-end">
          <span className="font-bold text-[#C9A227]">{tCities("aswan.name")}</span>
          <span className="hidden sm:inline text-[#B9B7B0]/60">
            ({numFormat.format(980)} {tCommon("kmUnit")})
          </span>
        </div>
      </div>
    </div>
  )
})

export default RouteMap
