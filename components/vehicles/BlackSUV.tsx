import { useTranslations } from "next-intl"

export default function BlackSUV({
  className = "",
  showBeam = true,
  beamBrightness = 1,
  wheelRotation = 0,
  ariaLabel,
}: {
  className?: string
  showBeam?: boolean
  beamBrightness?: number
  wheelRotation?: number
  ariaLabel?: string
}) {
  const tA11y = useTranslations("a11y")
  const brightness = Math.max(0.2, Math.min(1.5, beamBrightness))

  return (
    <svg
      viewBox="0 0 560 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel || tA11y("suvAriaLabel")}
      className={className}
    >
      <defs>
        {/* Headlight beam */}
        <linearGradient id="suvBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            stopColor="#C9A227"
            stopOpacity={0.45 * brightness}
          />
          <stop
            offset="25%"
            stopColor="#E6CF85"
            stopOpacity={0.24 * brightness}
          />
          <stop
            offset="70%"
            stopColor="#E6CF85"
            stopOpacity={0.08 * brightness}
          />
          <stop offset="100%" stopColor="#E6CF85" stopOpacity="0" />
        </linearGradient>
        {/* Glass reflection */}
        <linearGradient id="suvGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#323640" />
          <stop offset="50%" stopColor="#252830" />
          <stop offset="100%" stopColor="#1B1D22" />
        </linearGradient>
      </defs>

      {/* Headlight projector beam */}
      {showBeam && (
        <polygon
          points="472,112 560,78 560,165 472,126"
          fill="url(#suvBeam)"
          className="headlight-beam"
        />
      )}

      {/* Rear light glow in --ember */}
      <ellipse
        cx="58"
        cy="104"
        rx="38"
        ry="18"
        fill="#E07A2F"
        opacity={0.28 * brightness}
        className="rear-light-glow"
      />

      {/* Underbody shadow on road */}
      <ellipse cx="270" cy="164" rx="230" ry="6" fill="#0A0A0C" opacity="0.8" />

      {/* Vehicle body main silhouette (Tone 1: Deep Black #17181C) */}
      <path
        d="M 64 135 L 62 108 Q 63 94 72 88 L 138 78 L 185 40 Q 192 34 204 34 L 366 34 Q 378 34 386 42 L 426 80 L 466 86 Q 478 88 480 100 L 482 122 Q 482 136 476 142 L 472 145 L 435 145 A 36 36 0 0 0 363 145 L 187 145 A 36 36 0 0 0 115 145 L 64 145 Z"
        fill="#17181C"
      />

      {/* Tone 2: Upper shoulder highlight / facet (#26282E) */}
      <path
        d="M 72 88 L 138 78 L 185 40 Q 192 34 204 34 L 366 34 Q 378 34 386 42 L 426 80 L 466 86 Q 474 88 478 94 L 430 92 L 384 84 L 182 84 L 128 86 Z"
        fill="#26282E"
      />

      {/* Roof rails */}
      <rect x="206" y="28" width="160" height="4" rx="2" fill="#3D4049" />
      <rect x="220" y="32" width="6" height="3" fill="#17181C" />
      <rect x="348" y="32" width="6" height="3" fill="#17181C" />

      {/* Tone 3: Tinted Glass Area */}
      {/* Front windshield & side window group */}
      <path
        d="M 194 42 L 248 42 L 248 80 L 156 80 Z"
        fill="url(#suvGlass)"
      />
      <path
        d="M 254 42 L 326 42 L 326 80 L 254 80 Z"
        fill="url(#suvGlass)"
      />
      <path
        d="M 332 42 L 374 42 L 412 80 L 332 80 Z"
        fill="url(#suvGlass)"
      />

      {/* Window trim frame */}
      <path
        d="M 190 40 L 378 40 L 418 80 L 150 80 Z"
        stroke="#111215"
        strokeWidth="2.5"
        fill="none"
      />
      {/* B & C Pillars */}
      <line
        x1="251"
        y1="40"
        x2="251"
        y2="80"
        stroke="#17181C"
        strokeWidth="5"
      />
      <line
        x1="329"
        y1="40"
        x2="329"
        y2="80"
        stroke="#17181C"
        strokeWidth="5"
      />

      {/* Side mirror */}
      <path
        d="M 408 78 L 424 78 Q 428 78 427 84 L 412 86 Z"
        fill="#26282E"
        stroke="#17181C"
        strokeWidth="1.5"
      />

      {/* Door cutlines & handle recesses */}
      <line
        x1="251"
        y1="80"
        x2="251"
        y2="142"
        stroke="#0E0E10"
        strokeWidth="1.5"
      />
      <line
        x1="332"
        y1="80"
        x2="332"
        y2="142"
        stroke="#0E0E10"
        strokeWidth="1.5"
      />
      {/* Front door cut */}
      <path
        d="M 416 82 L 410 105 L 420 142"
        stroke="#0E0E10"
        strokeWidth="1.5"
      />
      {/* Door handles (flush gold signal / dark grey) */}
      <rect x="264" y="90" width="18" height="3" rx="1.5" fill="#3D4049" />
      <rect x="344" y="90" width="18" height="3" rx="1.5" fill="#3D4049" />

      {/* Subtle GT emblem */}
      <text
        x="292"
        y="114"
        fill="#C9A227"
        fontSize="9"
        fontWeight="800"
        letterSpacing="0.1em"
        fontFamily="sans-serif"
      >
        GT
      </text>

      {/* Lower rocker panel cladding (Tone: Deep dark grey #0E0E10) */}
      <path
        d="M 64 136 L 115 136 M 187 136 L 363 136 M 435 136 L 474 136"
        stroke="#0E0E10"
        strokeWidth="5"
      />

      {/* Headlight assembly */}
      <path
        d="M 466 94 L 479 98 L 476 108 L 458 106 Z"
        fill="#E6CF85"
        stroke="#C9A227"
        strokeWidth="1"
        className="headlight-lamp"
      />
      {/* Amber/Gold turn indicator */}
      <rect x="473" y="100" width="4" height="6" rx="1" fill="#C9A227" />

      {/* Taillight (ember #E07A2F highlight) */}
      <path d="M 64 96 L 70 96 L 68 112 L 62 110 Z" fill="#E07A2F" />

      {/* Wheel Arch Moldings */}
      <path
        d="M 112 146 A 38 38 0 0 1 190 146"
        fill="none"
        stroke="#0E0E10"
        strokeWidth="4"
      />
      <path
        d="M 360 146 A 38 38 0 0 1 438 146"
        fill="none"
        stroke="#0E0E10"
        strokeWidth="4"
      />

      {/* REAL WHEEL GEOMETRY - Rear Wheel (Center: 151, 146) */}
      <g transform={`rotate(${wheelRotation} 151 146)`}>
        {/* Tire */}
        <circle cx="151" cy="146" r="32" fill="#0A0A0C" />
        <circle
          cx="151"
          cy="146"
          r="30"
          stroke="#1A1B1E"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Rim outer lip */}
        <circle
          cx="151"
          cy="146"
          r="22"
          fill="#1F2126"
          stroke="#484C56"
          strokeWidth="1.5"
        />
        {/* Disc Brake rotor */}
        <circle cx="151" cy="146" r="16" fill="#141518" />
        {/* 6 Alloy Spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={`r-spoke-${deg}`}
            x1="151"
            y1="146"
            x2={151 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={146 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#4A4E5A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
        {/* Center hub & Gold GT cap */}
        <circle
          cx="151"
          cy="146"
          r="6"
          fill="#141518"
          stroke="#3D4049"
          strokeWidth="1"
        />
        <circle cx="151" cy="146" r="3" fill="#C9A227" />
      </g>

      {/* REAL WHEEL GEOMETRY - Front Wheel (Center: 399, 146) */}
      <g transform={`rotate(${wheelRotation} 399 146)`}>
        {/* Tire */}
        <circle cx="399" cy="146" r="32" fill="#0A0A0C" />
        <circle
          cx="399"
          cy="146"
          r="30"
          stroke="#1A1B1E"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Rim outer lip */}
        <circle
          cx="399"
          cy="146"
          r="22"
          fill="#1F2126"
          stroke="#484C56"
          strokeWidth="1.5"
        />
        {/* Disc Brake rotor */}
        <circle cx="399" cy="146" r="16" fill="#141518" />
        {/* 6 Alloy Spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={`f-spoke-${deg}`}
            x1="399"
            y1="146"
            x2={399 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={146 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#4A4E5A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        ))}
        {/* Center hub & Gold GT cap */}
        <circle
          cx="399"
          cy="146"
          r="6"
          fill="#141518"
          stroke="#3D4049"
          strokeWidth="1"
        />
        <circle cx="399" cy="146" r="3" fill="#C9A227" />
      </g>
    </svg>
  )
}
