"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle, useState, type CSSProperties } from "react"
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

interface CityPlacement {
  side: "start" | "end" | "top" | "bottom"
  dx: number
  dy: number
}

// Per-city placement config with logical sides
const CITY_PLACEMENTS: Record<string, CityPlacement> = {
  alexandria: { side: "start", dx: -14, dy: 14 },
  cairo: { side: "end", dx: 14, dy: 6 },
  sharm: { side: "start", dx: -14, dy: -6 },
  hurghada: { side: "start", dx: -14, dy: 6 },
  luxor: { side: "start", dx: -14, dy: 4 },
  aswan: { side: "end", dx: 14, dy: 4 },
}

function getEffectivePlacement(config: CityPlacement, isAr: boolean): { side: "start" | "end" | "top" | "bottom"; dx: number; dy: number } {
  if (!isAr) return config
  // Flip start/end automatically in Arabic so the label sits away from the route line
  const flippedSide = config.side === "start" ? "end" : config.side === "end" ? "start" : config.side
  return {
    side: flippedSide,
    dx: config.dx,
    dy: config.dy,
  }
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

  const mapFrameRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
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

  // Collision pass: run after first layout and on debounced resize only (never on scroll)
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout | null = null

    const runCollisionPass = () => {
      const frame = mapFrameRef.current
      if (!frame) return

      const frameRect = frame.getBoundingClientRect()
      const safeAreaTop = frameRect.top + 57 // Reserve 56px+ top safe area

      interface LabelItem {
        id: string
        el: HTMLButtonElement
        isActive: boolean
        rect: { left: number; right: number; top: number; bottom: number }
        shiftY: number
        hidden: boolean
      }

      // Reset transforms and opacities to measure true bounding boxes
      ROUTE_CITIES.forEach((city) => {
        const el = labelsRef.current.get(city.id)
        if (!el) return
        el.style.removeProperty("opacity")
        el.style.removeProperty("pointer-events")
        el.style.setProperty("--collision-x", "0px")
        el.style.setProperty("--collision-y", "0px")
      })

      const items: LabelItem[] = []
      ROUTE_CITIES.forEach((city) => {
        const el = labelsRef.current.get(city.id)
        if (!el) return
        const r = el.getBoundingClientRect()
        items.push({
          id: city.id,
          el,
          isActive: city.id === activeCity.id,
          rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom },
          shiftY: 0,
          hidden: false,
        })
      })

      // 1. Reserve 56px top safe area: no label can enter top < safeAreaTop
      for (const item of items) {
        if (item.rect.top < safeAreaTop) {
          const needed = safeAreaTop - item.rect.top
          item.shiftY += needed
          item.rect.top += needed
          item.rect.bottom += needed
        }
      }

      const intersects = (a: LabelItem, b: LabelItem) => {
        return !(
          a.rect.right <= b.rect.left ||
          a.rect.left >= b.rect.right ||
          a.rect.bottom <= b.rect.top ||
          a.rect.top >= b.rect.bottom
        )
      }

      // 2. Push overlapping labels apart vertically in 4px steps (max 4 passes)
      const maxPasses = 4
      const step = 4

      for (let pass = 0; pass < maxPasses; pass++) {
        let hadOverlap = false
        for (let i = 0; i < items.length; i++) {
          for (let j = i + 1; j < items.length; j++) {
            const a = items[i]
            const b = items[j]
            if (intersects(a, b)) {
              hadOverlap = true
              if (a.isActive) {
                // Active always wins; b moves away
                const moveDown = b.rect.top >= a.rect.top
                const dir = moveDown ? 1 : (b.rect.top - step < safeAreaTop ? 1 : -1)
                b.shiftY += dir * step
                b.rect.top += dir * step
                b.rect.bottom += dir * step
              } else if (b.isActive) {
                // a moves away
                const moveDown = a.rect.top >= b.rect.top
                const dir = moveDown ? 1 : (a.rect.top - step < safeAreaTop ? 1 : -1)
                a.shiftY += dir * step
                a.rect.top += dir * step
                a.rect.bottom += dir * step
              } else {
                // Neither active: push apart
                const higher = a.rect.top <= b.rect.top ? a : b
                const lower = higher === a ? b : a
                if (higher.rect.top - step >= safeAreaTop) {
                  higher.shiftY -= step
                  higher.rect.top -= step
                  higher.rect.bottom -= step
                } else {
                  lower.shiftY += step
                  lower.rect.top += step
                  lower.rect.bottom += step
                }
                lower.shiftY += step
                lower.rect.top += step
                lower.rect.bottom += step
              }
            }
          }
        }
        if (!hadOverlap) break
      }

      // 3. Hide (opacity 0) any inactive label that still collides with active or another label
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const a = items[i]
          const b = items[j]
          if (intersects(a, b)) {
            if (a.isActive) {
              b.hidden = true
            } else if (b.isActive) {
              a.hidden = true
            } else {
              b.hidden = true
            }
          }
        }
      }

      // 4. Boundary padding: ensure labels never clip outside left or right edges of map frame
      const padding = 12
      items.forEach((item) => {
        let shiftX = 0
        if (item.rect.right > frameRect.right - padding) {
          shiftX = (frameRect.right - padding) - item.rect.right
        } else if (item.rect.left < frameRect.left + padding) {
          shiftX = (frameRect.left + padding) - item.rect.left
        }
        item.el.style.setProperty("--collision-x", `${shiftX}px`)
      })

      // 5. Apply vertical shifts and hidden state directly to DOM
      items.forEach((item) => {
        item.el.style.setProperty("--collision-y", `${item.shiftY}px`)
        if (item.hidden && !item.isActive) {
          item.el.style.opacity = "0"
          item.el.style.pointerEvents = "none"
        } else {
          item.el.style.removeProperty("opacity")
          item.el.style.pointerEvents = "auto"
        }
      })
    }

    const rafId = requestAnimationFrame(() => {
      runCollisionPass()
    })

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        runCollisionPass()
      }, 120)
    }

    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(handleResize)
      : null

    if (ro && mapFrameRef.current) {
      ro.observe(mapFrameRef.current)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(rafId)
      if (resizeTimer) clearTimeout(resizeTimer)
      ro?.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [activeCity.id, locale])

  // Pre-sample 240 points along the path once on mount
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

    if (routePathRef.current) {
      routePathRef.current.style.strokeDashoffset = offsetVal
    }
    if (routeGlowPathRef.current) {
      routeGlowPathRef.current.style.strokeDashoffset = offsetVal
    }

    const samples = sampledPointsRef.current
    if (samples.length > 0 && carMarkerRef.current) {
      const idx = Math.min(samples.length - 1, Math.max(0, Math.round(clamped * (samples.length - 1))))
      const pt = samples[idx]
      carMarkerRef.current.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) rotate(${pt.angle}deg)`

      if (liveKmBadgeRef.current) {
        liveKmBadgeRef.current.textContent = tRoute("liveProgressStatus", {
          km: numFormat.format(pt.km),
          pct: numFormat.format(Math.round(clamped * 100)),
        })
      }
    }

    if (coordinatesBadgeRef.current) {
      const lat = (31.2 - clamped * (31.2 - 24.08)).toFixed(2)
      const lon = (29.9 + clamped * (32.9 - 29.9)).toFixed(2)
      coordinatesBadgeRef.current.innerHTML = `<bdi dir="ltr">${lat}°N ${lon}°E</bdi>`
    }

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
    <div
      ref={mapFrameRef}
      className="map-frame relative flex h-full w-full select-none items-center justify-center overflow-hidden rounded-2xl border border-[#C9A227]/25 bg-gradient-to-b from-[#0F1722] via-[#0A1018] to-[#070B10] p-3 shadow-2xl sm:p-5"
    >
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

      {/* Top Left: Compass Rose & Coordinates Caption */}
      <div
        className="pointer-events-none absolute start-4 top-4 z-20 flex items-center gap-2.5 text-xs rtl:text-[13px] text-[#EADFC8]/70"
        aria-hidden="true"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C9A227]/30 bg-[#0B0A09]/80 text-[#C9A227]">
          <span className="font-bold">N</span>
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-medium tracking-[0.01em] rtl:tracking-0 text-[#F4F2EC]">
            {tRoute("networkTitle")}
          </span>
          <span ref={coordinatesBadgeRef} className="text-[#C9A227]/80 tabular-nums">
            <bdi dir="ltr">{tRoute("coordinatesAlex")}</bdi>
          </span>
        </div>
      </div>

      {/* Top Right: Live Corridor Status Pill */}
      <div
        className="pointer-events-none absolute end-4 top-4 z-20 hidden items-center gap-2 rounded-full border border-[#C9A227]/25 bg-[#0B0A09]/80 px-3 py-1 text-xs rtl:text-[13px] backdrop-blur-md sm:flex"
        aria-hidden="true"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A227] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C9A227]" />
        </span>
        <span className="text-[#B9B7B0] font-medium">{tRoute("corridorTitle")}</span>
        <span className="font-semibold text-[#E6CF85]">{tRoute("corridorValue")}</span>
      </div>

      {/* Main Interactive Stage (SVG + HTML Labels Overlay aligned via 800:720 aspect) */}
      <div className="relative aspect-[800/720] w-full max-h-[680px] max-w-full my-auto mx-auto flex items-center justify-center">
        <svg
          viewBox={`0 0 ${EGYPT_MAP_WIDTH} ${EGYPT_MAP_HEIGHT}`}
          className="h-full w-full block object-contain"
          aria-label={tA11y("interactiveMapAriaLabel")}
          role="img"
        >
          <defs>
            <linearGradient id="headlight-beam-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FFF2B2" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#C9A227" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#C9A227" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
            </linearGradient>

            <radialGradient id="taillight-glow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E07A2F" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#E07A2F" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="gold-car-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6CF85" />
              <stop offset="45%" stopColor="#C9A227" />
              <stop offset="100%" stopColor="#967718" />
            </linearGradient>

            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="egypt-land-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1017" />
              <stop offset="50%" stopColor="#080C12" />
              <stop offset="100%" stopColor="#05080E" />
            </linearGradient>
          </defs>

          {/* Latitude Reference Parallels */}
          <g opacity="0.08" stroke="#EADFC8" strokeDasharray="4 6" strokeWidth="1">
            <line x1="50" y1="150" x2="750" y2="150" />
            <line x1="50" y1="300" x2="750" y2="300" />
            <line x1="50" y1="450" x2="750" y2="450" />
            <line x1="50" y1="550" x2="750" y2="550" />
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

          {/* Secondary Network Destination Dots (Dots remain SVG) */}
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
                <title>
                  {tA11y("routeMapPinCityTitle", {
                    city: city.nameKey
                      ? tCities(city.nameKey.replace(/^cities\./, ""))
                      : tCities(`${city.id}.name`),
                    km: numFormat.format(city.km),
                  })}
                </title>
              </g>
            ))}
          </g>

          {/* 6 Primary Highway Route Cities Pins (Pins remain SVG) */}
          {ROUTE_CITIES.map((city) => {
            const isActive = activeCity.id === city.id
            const cityProg = CITY_PROGRESS_MAP[city.id] ?? 0
            const isVisited = progress >= cityProg - 0.015

            return (
              <g
                key={city.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectCity?.(city)}
              >
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

                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? "7.5" : "5.5"}
                  fill={isActive ? "#FFD54F" : isVisited ? "#C9A227" : "#1A2433"}
                  stroke="#080D15"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? "3" : "2"}
                  fill={isActive ? "#080D15" : isVisited ? "#080D15" : "#EADFC8"}
                  className="transition-all duration-300"
                />
              </g>
            )
          })}

          {/* Top-down Golden Trip Vehicle Marker */}
          <g ref={carMarkerRef} id="map-car-marker" style={{ transformOrigin: "0px 0px" }}>
            <path
              d="M 14 -2 L 52 -18 L 52 18 L 14 2 Z"
              fill="url(#headlight-beam-grad)"
              opacity="0.8"
              pointerEvents="none"
            />
            <circle cx="-16" cy="0" r="10" fill="url(#taillight-glow-grad)" pointerEvents="none" />
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
            <rect
              x="-2"
              y="-4.5"
              width="7"
              height="9"
              rx="2"
              fill="#080D15"
            />
            <rect
              x="-10"
              y="-4"
              width="4.5"
              height="8"
              rx="1.5"
              fill="#080D15"
            />
            <circle cx="12" cy="-4.5" r="1.3" fill="#FFFFFF" />
            <circle cx="12" cy="4.5" r="1.3" fill="#FFFFFF" />
            <rect x="-12.8" y="-5.5" width="1.5" height="2.5" rx="0.5" fill="#E07A2F" />
            <rect x="-12.8" y="3" width="1.5" height="2.5" rx="0.5" fill="#E07A2F" />
          </g>
        </svg>

        {/* Absolutely Positioned HTML City Labels Overlay */}
        <div className="map-labels pointer-events-none" aria-hidden="false">
          {ROUTE_CITIES.map((city) => {
            const isActive = activeCity.id === city.id
            const rawPlacement = CITY_PLACEMENTS[city.id] || { side: "start", dx: -14, dy: 4 }
            const placement = getEffectivePlacement(rawPlacement, isAr)

            // Resolve physical direction from logical side (start/end flipped in Arabic)
            const physicalDir = isAr
              ? (placement.side === "start" ? "right" : placement.side === "end" ? "left" : placement.side)
              : (placement.side === "start" ? "left" : placement.side === "end" ? "right" : placement.side)

            const xPct = (city.x / EGYPT_MAP_WIDTH) * 100
            const yPct = (city.y / EGYPT_MAP_HEIGHT) * 100

            let transform = ""
            let textAlign: CSSProperties["textAlign"] = "left"

            if (physicalDir === "left") {
              transform = `translate(calc(-100% - 12px + ${placement.dx}px + var(--collision-x, 0px)), calc(-50% + ${placement.dy}px + var(--collision-y, 0px)))`
              textAlign = isAr ? "start" : "end"
            } else if (physicalDir === "right") {
              transform = `translate(calc(12px + ${placement.dx}px + var(--collision-x, 0px)), calc(-50% + ${placement.dy}px + var(--collision-y, 0px)))`
              textAlign = isAr ? "end" : "start"
            } else if (physicalDir === "top") {
              transform = `translate(calc(-50% + ${placement.dx}px + var(--collision-x, 0px)), calc(-100% - 12px + ${placement.dy}px + var(--collision-y, 0px)))`
              textAlign = "center"
            } else {
              transform = `translate(calc(-50% + ${placement.dx}px + var(--collision-x, 0px)), calc(12px + ${placement.dy}px + var(--collision-y, 0px)))`
              textAlign = "center"
            }

            const cityName = city.nameKey
              ? tCities(city.nameKey.replace(/^cities\./, ""))
              : tCities(`${city.id}.name`)

            return (
              <button
                key={city.id}
                ref={(el) => {
                  if (el) labelsRef.current.set(city.id, el)
                  else labelsRef.current.delete(city.id)
                }}
                type="button"
                data-city={city.id}
                onClick={() => onSelectCity?.(city)}
                className={`map-label ${isActive ? "is-active" : "is-inactive"}`}
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  transform,
                  textAlign,
                }}
                aria-label={cityName}
              >
                {cityName}
              </button>
            )
          })}
        </div>
      </div>

      {/* Floating Tooltip when hovering secondary cities */}
      {hoveredCity && (
        <div className="pointer-events-none absolute bottom-12 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rounded-md border border-[#C9A227]/40 bg-[#080D15]/95 px-3 py-1.5 text-xs rtl:text-[13px] font-medium text-[#F4F2EC] shadow-xl backdrop-blur-md">
          <span className="font-bold text-[#C9A227]">
            {hoveredCity.nameKey
              ? tCities(hoveredCity.nameKey.replace(/^cities\./, ""))
              : tCities(`${hoveredCity.id}.name`)}
          </span>
          <span className="ms-2 text-[#B9B7B0]">
            · {numFormat.format(hoveredCity.km)} {tCommon("kmUnit")} {tCities("fromAlexLabel")}
          </span>
        </div>
      )}

      {/* Bottom Automotive Highway Distance Progress Meter */}
      <div className="pointer-events-none absolute bottom-3.5 inset-x-5 flex items-center justify-between text-xs rtl:text-[13px] text-[#B9B7B0]/80">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[#C9A227]">
            {tCities("alexandria.name")} {tCities("hqLabel")}
          </span>
          <span className="hidden sm:inline text-[#B9B7B0]/60 tabular-nums">
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
            className="mt-1 text-xs rtl:text-[13px] font-medium text-[#E6CF85] tabular-nums"
          >
            {tRoute("liveProgressStatus", {
              km: numFormat.format(0),
              pct: numFormat.format(0),
            })}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-end">
          <span className="font-semibold text-[#C9A227]">{tCities("aswan.name")}</span>
          <span className="hidden sm:inline text-[#B9B7B0]/60 tabular-nums">
            ({numFormat.format(980)} {tCommon("kmUnit")})
          </span>
        </div>
      </div>
    </div>
  )
})

export default RouteMap
