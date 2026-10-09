"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import {
  EGYPT_PATH_DATA,
  ROUTE_PATH_DATA,
  EGYPT_MAP_WIDTH,
  EGYPT_MAP_HEIGHT,
  ALL_CITIES,
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

const RouteMap = forwardRef<RouteMapHandle, RouteMapProps>(function RouteMap(
  {
    progress = 0,
    activeCity,
    onSelectCity,
    showOtherCities = false,
  },
  ref
) {
  const routePathRef = useRef<SVGPathElement>(null)
  const carMarkerRef = useRef<SVGGElement>(null)
  const otherCitiesRef = useRef<SVGGElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  const sampledPointsRef = useRef<{ x: number; y: number; angle: number }[]>([])
  const totalLengthRef = useRef<number>(1200)

  // Pre-sample 200 points along the path once on mount to eliminate getPointAtLength calls during scroll
  useEffect(() => {
    if (!routePathRef.current) return
    const path = routePathRef.current
    const len = path.getTotalLength()
    totalLengthRef.current = len

    const samples: { x: number; y: number; angle: number }[] = []
    const sampleCount = 200
    for (let i = 0; i <= sampleCount; i++) {
      const d = (i / sampleCount) * len
      const pt = path.getPointAtLength(d)

      const nextD = Math.min(len, d + 1.5)
      const prevD = Math.max(0, d - 1.5)
      const pNext = path.getPointAtLength(nextD)
      const pPrev = path.getPointAtLength(prevD)
      const angleRad = Math.atan2(pNext.y - pPrev.y, pNext.x - pPrev.x)
      const angleDeg = (angleRad * 180) / Math.PI

      samples.push({ x: pt.x, y: pt.y, angle: angleDeg })
    }
    sampledPointsRef.current = samples

    // Initial position
    updateProgress(progress)
  }, [])

  const updateProgress = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p))
    const len = totalLengthRef.current

    // Dash offset update
    if (routePathRef.current) {
      routePathRef.current.style.strokeDashoffset = String(len * (1 - clamped))
    }

    // Car marker position update
    const samples = sampledPointsRef.current
    if (samples.length > 0 && carMarkerRef.current) {
      const idx = Math.min(samples.length - 1, Math.max(0, Math.round(clamped * (samples.length - 1))))
      const pt = samples[idx]
      carMarkerRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${pt.angle}deg)`
    }

    // Other cities group visibility
    if (otherCitiesRef.current && !showOtherCities) {
      otherCitiesRef.current.style.opacity = clamped >= 0.45 ? "1" : "0"
    }

    // Bottom progress meter
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

  // Split cities into 6 route cities and 8 other cities
  const routeCities = ALL_CITIES.filter((c) => c.isRouteCity)
  const otherCities = ALL_CITIES.filter((c) => !c.isRouteCity)

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] flex items-center justify-center rounded-2xl border border-[#EADFC8]/15 bg-[#0C1A2B] p-2 sm:p-4 overflow-hidden shadow-2xl select-none">
      {/* Subtle Coordinate Grid Lines for Cartographic Aesthetics */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[radial-gradient(#EADFC8_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Cartographic Compass Rose Top Left */}
      <div
        className="pointer-events-none absolute top-4 left-4 flex items-center gap-1.5 text-[#B9B7B0]/50 font-mono text-[10px] select-none"
        aria-hidden="true"
      >
        <span className="font-bold text-[#C9A227]/80">N</span>
        <span>Egypt</span>
      </div>

      {/* Main SVG Map */}
      <svg
        viewBox={`0 0 ${EGYPT_MAP_WIDTH} ${EGYPT_MAP_HEIGHT}`}
        className="w-full h-full max-h-[720px] object-contain drop-shadow-lg"
        aria-label="Route map across Egypt"
        role="img"
      >
        {/* Base Egypt Landmass Outline: Filled --ink (#0B0A09), 1px --sand outline at 20% opacity */}
        <path
          d={EGYPT_PATH_DATA}
          fill="#0B0A09"
          stroke="#EADFC8"
          strokeOpacity="0.2"
          strokeWidth="1"
          className="transition-colors duration-300"
        />

        {/* 
          Route Path:
          Stylized path through Alexandria, Cairo, Sharm, Hurghada, Luxor, Aswan
          2px --gold dashed, drawn progressively with stroke-dashoffset
        */}
        {/* Shadow layer for route */}
        <path
          d={ROUTE_PATH_DATA}
          fill="none"
          stroke="#000000"
          strokeWidth="4"
          strokeOpacity="0.5"
        />

        {/* Dynamic dashed gold route line */}
        <path
          ref={routePathRef}
          d={ROUTE_PATH_DATA}
          fill="none"
          stroke="#C9A227"
          strokeWidth="2.5"
          strokeDasharray="8 5"
          strokeDashoffset={1200}
          strokeLinecap="round"
          className="will-change-[stroke-dashoffset]"
        />

        {/* 
          8 OTHER CITIES:
          Small --sand dots that appear when marker passes section midpoint (or showOtherCities)
        */}
        <g
          ref={otherCitiesRef}
          className="transition-opacity duration-300"
          style={{ opacity: showOtherCities ? 1 : 0 }}
        >
          {otherCities.map((city) => (
            <g
              key={city.id}
              className="cursor-pointer group"
              onClick={() => onSelectCity?.(city)}
            >
              <circle
                cx={city.x}
                cy={city.y}
                r="3.5"
                fill="#EADFC8"
                stroke="#0B0A09"
                strokeWidth="1"
                className="transition-transform group-hover:scale-150"
              />
              <text
                x={city.x + 6}
                y={city.y + 3}
                fill="#B9B7B0"
                fontSize="10"
                fontFamily="var(--font-anybody), sans-serif"
                fontWeight="500"
                className="select-none pointer-events-none group-hover:fill-[#F4F2EC] group-hover:font-bold transition-colors"
              >
                {city.city}
              </text>
            </g>
          ))}
        </g>

        {/* 
          6 ROUTE CITIES:
          Large pins (gold dot with an active radiating pulse)
        */}
        {routeCities.map((city) => {
          const isActive = activeCity.id === city.id
          return (
            <g
              key={city.id}
              className="cursor-pointer group"
              onClick={() => onSelectCity?.(city)}
            >
              {/* Radiating pulse ring */}
              <circle
                cx={city.x}
                cy={city.y}
                r="11"
                fill="none"
                stroke="#C9A227"
                strokeWidth="1.5"
                opacity={isActive ? "0.85" : "0.35"}
                className={isActive ? "animate-ping" : ""}
              />

              {/* Large Gold Dot */}
              <circle
                cx={city.x}
                cy={city.y}
                r={isActive ? "6.5" : "5.5"}
                fill="#C9A227"
                stroke="#0B0A09"
                strokeWidth="2"
                className="transition-all duration-200 group-hover:scale-125"
              />

              {/* Center Core */}
              <circle
                cx={city.x}
                cy={city.y}
                r="2"
                fill={isActive ? "#0B0A09" : "#F4F2EC"}
              />

              {/* City Label Badge */}
              <g transform={`translate(${city.x}, ${city.y})`}>
                <text
                  x={city.x > 500 ? -12 : 12}
                  y={city.y > 450 ? -10 : 4}
                  textAnchor={city.x > 500 ? "end" : "start"}
                  fill={isActive ? "#C9A227" : "#F4F2EC"}
                  fontSize="12"
                  fontFamily="var(--font-anybody), sans-serif"
                  fontWeight={isActive ? "800" : "600"}
                  className="select-none pointer-events-none drop-shadow-md transition-colors"
                >
                  {city.city}
                  {city.isHq && " (HQ)"}
                </text>
              </g>
            </g>
          )
        })}

        {/* 
          SMALL TOP-DOWN GOLD CAR MARKER:
          Pre-sampled tangent & coordinates, hardware-accelerated transform
        */}
        <g ref={carMarkerRef} id="map-car-marker" className="will-change-transform" style={{ transformOrigin: "0px 0px" }}>
          {/* Headlight beams radiating forward */}
          <path
            d="M 12 0 L 32 -10 L 32 10 Z"
            fill="url(#headlight-beam-grad)"
            opacity="0.65"
            pointerEvents="none"
          />

          {/* Aerodynamic top-down gold car body */}
          <rect
            x="-11"
            y="-5.5"
            width="22"
            height="11"
            rx="3"
            fill="#C9A227"
            stroke="#0B0A09"
            strokeWidth="1.2"
            className="drop-shadow-lg"
          />

          {/* Windshield */}
          <rect
            x="0"
            y="-4"
            width="5"
            height="8"
            rx="1.5"
            fill="#0B0A09"
          />

          {/* Rear window */}
          <rect
            x="-8"
            y="-3.5"
            width="3.5"
            height="7"
            rx="1"
            fill="#0B0A09"
          />

          {/* Front headlights */}
          <circle cx="10" cy="-4" r="1.2" fill="#FFFFFF" />
          <circle cx="10" cy="4" r="1.2" fill="#FFFFFF" />

          {/* Rear taillights in --ember */}
          <circle cx="-10.5" cy="-4" r="1" fill="#E07A2F" />
          <circle cx="-10.5" cy="4" r="1" fill="#E07A2F" />
        </g>

        {/* Headlight Gradient Definition */}
        <defs>
          <linearGradient id="headlight-beam-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#E6CF85" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#E6CF85" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom Route Progress Meter inside Map Frame */}
      <div className="absolute bottom-3 inset-x-6 sm:inset-x-8 flex items-center justify-between text-[11px] font-mono text-[#B9B7B0]/60 pointer-events-none">
        <span>Alexandria (0 km)</span>
        <div className="mx-4 flex-1 h-1 bg-[#2A2B2E] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-[#C9A227]"
            style={{ width: "0%" }}
          />
        </div>
        <span>Aswan (980 km)</span>
      </div>
    </div>
  )
})

export default RouteMap
