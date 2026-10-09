"use client"

// If the webp cutout file failed to load, fall back to handcrafted vector component

// Default: Render transparent cutout webp with optical overlays
/* Headlight beam overlay for cutout */ /* Ember rear taillight glow */

import { useState } from "react"
import BlackSUV from "./vehicles/BlackSUV"
import WhiteSedan from "./vehicles/WhiteSedan"
import WhiteVan from "./vehicles/WhiteVan"
import FleetLineup from "./vehicles/FleetLineup"

export type VehicleVariant = "suv" | "sedan" | "van" | "fleet"

export interface VehicleProps {
  variant: VehicleVariant
  className?: string
  showBeam?: boolean
  beamBrightness?: number
  wheelRotation?: number
}

export default function Vehicle({
  variant = "suv",
  className = "",
  showBeam = true,
  beamBrightness = 1,
  wheelRotation = 0,
}: VehicleProps) {
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({})

  if (
    variant ===
    "fleet"
  ) {
    return <FleetLineup className={className} />
  }
  if (imgFailed[variant]) {
    if (
      variant ===
      "sedan"
    ) {
      return (
        <WhiteSedan
          className={className}
          showBeam={showBeam}
          beamBrightness={beamBrightness}
          wheelRotation={wheelRotation}
        />
      )
    }
    if (
      variant ===
      "van"
    ) {
      return (
        <WhiteVan
          className={className}
          showBeam={showBeam}
          beamBrightness={beamBrightness}
          wheelRotation={wheelRotation}
        />
      )
    }
    return (
      <BlackSUV
        className={className}
        showBeam={showBeam}
        beamBrightness={beamBrightness}
        wheelRotation={wheelRotation}
      />
    )
  }
  return (
    <div className={`relative ${className}`}>
      <img
        src={`/vehicles/${variant}.webp`}
        alt={`Golden Trip ${variant}`}
        onError={() => setImgFailed((prev) => ({ ...prev, [variant]: true }))}
        className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
        draggable={false}
      />
      {}
      {showBeam && (
        <div
          className="pointer-events-none absolute right-[-24%] top-[42%] w-[55%] h-[40%]"
          style={{
            opacity: Math.max(0.2, Math.min(1.2, beamBrightness)),
            background:
              "linear-gradient(90deg, rgba(201,162,39,0.5) 0%, rgba(230,207,133,0.22) 35%, transparent 100%)",
            clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)",
          }}
        />
      )}
      {}
      <div
        className="pointer-events-none absolute left-[-6%] top-[48%] h-6 w-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(224,122,47,0.7) 0%, rgba(224,122,47,0.2) 60%, transparent 100%)",
          filter: "blur(6px)",
        }}
      />
    </div>
  )
}
