"use client"

// If the webp cutout file failed to load, fall back to handcrafted vector component

// Default: Render transparent cutout webp with optical overlays
/* Headlight beam overlay for cutout */ /* Ember rear taillight glow */

import { useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import BlackSUV from "./vehicles/BlackSUV"
import WhiteSedan from "./vehicles/WhiteSedan"
import WhiteVan from "./vehicles/WhiteVan"
import FleetLineup from "./vehicles/FleetLineup"

const BLUR_PLACEHOLDERS: Record<string, string> = {
  suv: "data:image/webp;base64,UklGRqgAAABXRUJQVlA4WAoAAAAQAAAADwAABQAAQUxQSF4AAAABcFrbtuK8GcusZk0BLKkBbCGOQacCUowtxKYYZhtHjjk9RMQEwDcmf4rwP7477d+PbfTLSg+ef4cxDpDzdbT6cRltnwWAauO57H/2Os9pzwVasYt5P4zCwKvETQkAVlA4ICQAAAAwAQCdASoQAAYABUB8JaQAA3AA/vACykOoglCcWeBxX8gAAAA=",
  sedan: "data:image/webp;base64,UklGRsYAAABXRUJQVlA4WAoAAAAQAAAADwAABQAAQUxQSFcAAAABcFtr25p8ZbzSARKg9DZSoyukYwp3+FiA82+UFp/B3V1HiIgJgL9G2oQQ0hQ/RNe3t2OHAhBHC7fzZu/2LhngsXYbIrYQm7cepkDQ/MW0adm2aZQdnwoAVlA4IEgAAAAQAgCdASoQAAYABUB8JZwAD4lu4ZBwIzmUAP3jf18wSQImuWvr4bWBBwVnPdQuvGrMS7fayK/zRzAPlQTk4oFyytnsE24hQAA=",
  van: "data:image/webp;base64,UklGRs4AAABXRUJQVlA4WAoAAAAQAAAADwAABQAAQUxQSFkAAAANcFpt27I8v7s0wX0HtwnIdJdGpbMMnUnI0NzdHVaIiAnA/0adIRmSJmlq0dwACGfwVY/mzsBeWMy9b6deuZE9ot8NxdsiADHfifB3TFoO4b4j73eenQ2kKwBWUDggTgAAAPABAJ0BKhAABgAFQHwlnAAC6NGO76hjIAD+mAwLwXSHniXkqexXeIHPWH5/6rnfBlVeMSpTmytf6mDMdN/4vgFBRFw4CG6EbFoXm1gAAA==",
}

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
  const tA11y = useTranslations("a11y")
  const [imgFailed, setImgFailed] = useState<Record<string, boolean>>({})

  const altMap: Record<VehicleVariant, string> = {
    sedan: tA11y("sedanAriaLabel"),
    suv: tA11y("suvAriaLabel"),
    van: tA11y("vanAriaLabel"),
    fleet: tA11y("completeFleetAriaLabel"),
  }

  if (variant === "fleet") {
    return <FleetLineup className={className} />
  }
  if (imgFailed[variant]) {
    if (variant === "sedan") {
      return (
        <WhiteSedan
          className={className}
          showBeam={showBeam}
          beamBrightness={beamBrightness}
          wheelRotation={wheelRotation}
        />
      )
    }
    if (variant === "van") {
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
      <Image
        src={`/vehicles/${variant}.webp`}
        alt={altMap[variant] || tA11y("suvAriaLabel")}
        width={560}
        height={190}
        sizes="(max-width: 768px) 340px, 560px"
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDERS[variant] || BLUR_PLACEHOLDERS.suv}
        onError={() => setImgFailed((prev) => ({ ...prev, [variant]: true }))}
        className="w-full h-auto object-contain select-none pointer-events-none"
        draggable={false}
      />
      {}
      {showBeam && (
        <div
          className="pointer-events-none absolute right-[-24%] top-[42%] w-[55%] h-[40%]"
          style={{
            opacity: "var(--beam-opacity, 0.5)",
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
            "radial-gradient(circle, rgba(224,122,47,0.55) 0%, rgba(224,122,47,0.18) 45%, transparent 100%)",
        }}
      />
    </div>
  )
}
