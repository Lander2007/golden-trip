export default function WhiteVan({
  className = "",
  showBeam = true,
  beamBrightness = 1,
  wheelRotation = 0,
}: {
  className?: string
  showBeam?: boolean
  beamBrightness?: number
  wheelRotation?: number
}) {
  const brightness = Math.max(0.2, Math.min(1.5, beamBrightness))

  return (
    <svg
      viewBox="0 0 570 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Golden Trip executive white passenger van"
      className={className}
    >
      <defs>
        {/* Headlight beam */}
        <linearGradient id="vanBeam" x1="0%" y1="0%" x2="100%" y2="0%">
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
        <linearGradient id="vanGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E333D" />
          <stop offset="50%" stopColor="#22252C" />
          <stop offset="100%" stopColor="#181A1F" />
        </linearGradient>
      </defs>

      {/* Headlight projector beam */}
      {showBeam && (
        <polygon
          points="490,132 570,95 570,185 490,146"
          fill="url(#vanBeam)"
          className="headlight-beam"
        />
      )}

      {/* Rear light glow in --ember */}
      <ellipse
        cx="56"
        cy="99"
        rx="26"
        ry="22"
        fill="#E07A2F"
        opacity={0.55 * brightness}
        className="rear-light-glow"
        style={{ filter: "blur(7px)" }}
      />

      {/* Underbody shadow on road */}
      <ellipse cx="280" cy="184" rx="240" ry="6" fill="#0A0A0C" opacity="0.8" />

      {/* Tone 1: Van Body (Off-White #F4F2EC) */}
      <path
        d="M 64 156 
           L 60 76 
           Q 62 48 84 46 
           L 416 46 
           Q 432 46 442 62 
           L 476 112 
           L 488 120 
           Q 494 126 494 136 
           L 494 154 
           Q 494 164 484 166 
           L 445 166 
           A 36 36 0 0 0 373 166 
           L 187 166 
           A 36 36 0 0 0 115 166 
           L 64 166 
           Z"
        fill="#F4F2EC"
      />

      {/* Tone 2: Lower side shadow facet & body trim (#D2CEC4) */}
      <path
        d="M 64 146 
           L 115 146 
           A 36 36 0 0 1 187 146 
           L 373 146 
           A 36 36 0 0 1 445 146 
           L 488 146 
           L 488 166 
           L 445 166 
           A 36 36 0 0 0 373 166 
           L 187 166 
           A 36 36 0 0 0 115 166 
           L 64 166 
           Z"
        fill="#D2CEC4"
      />

      {/* Tone 3: Tinted Glass Ribbon (Panoramic passenger windows) */}
      <path
        d="M 76 56 
           L 174 56 
           L 174 106 
           L 76 106 
           Z"
        fill="url(#vanGlass)"
      />
      <path
        d="M 180 56 
           L 284 56 
           L 284 106 
           L 180 106 
           Z"
        fill="url(#vanGlass)"
      />
      <path
        d="M 290 56 
           L 396 56 
           L 396 106 
           L 290 106 
           Z"
        fill="url(#vanGlass)"
      />
      <path
        d="M 402 56 
           L 434 56 
           L 468 106 
           L 402 106 
           Z"
        fill="url(#vanGlass)"
      />

      {/* Window boundary frame */}
      <path
        d="M 74 54 
           L 436 54 
           L 472 106 
           L 74 106 
           Z"
        stroke="#2A2B2E"
        strokeWidth="2"
        fill="none"
      />
      {/* Pillars */}
      <line
        x1="177"
        y1="54"
        x2="177"
        y2="106"
        stroke="#17181C"
        strokeWidth="6"
      />
      <line
        x1="287"
        y1="54"
        x2="287"
        y2="106"
        stroke="#17181C"
        strokeWidth="6"
      />
      <line
        x1="399"
        y1="54"
        x2="399"
        y2="106"
        stroke="#17181C"
        strokeWidth="6"
      />

      {/* Sliding door cutlines */}
      <line
        x1="187"
        y1="106"
        x2="187"
        y2="164"
        stroke="#B8B5AB"
        strokeWidth="1.5"
      />
      <line
        x1="388"
        y1="106"
        x2="388"
        y2="164"
        stroke="#B8B5AB"
        strokeWidth="1.5"
      />
      <line
        x1="187"
        y1="118"
        x2="388"
        y2="118"
        stroke="#B8B5AB"
        strokeWidth="1"
        strokeDasharray="6 3"
      />
      {/* Front door cut */}
      <path
        d="M 426 106 L 416 128 L 424 164"
        stroke="#B8B5AB"
        strokeWidth="1.5"
      />

      {/* Door handles */}
      <rect x="200" y="122" width="16" height="3.5" rx="1.5" fill="#2A2B2E" />
      <rect x="404" y="122" width="16" height="3.5" rx="1.5" fill="#2A2B2E" />

      {/* Side mirror */}
      <path
        d="M 456 102 L 474 102 Q 477 102 476 109 L 460 112 Z"
        fill="#F4F2EC"
        stroke="#2A2B2E"
        strokeWidth="1.4"
      />

      {/* Subtle GT mark */}
      <text
        x="330"
        y="136"
        fill="#C9A227"
        fontSize="10"
        fontWeight="800"
        letterSpacing="0.1em"
        fontFamily="sans-serif"
      >
        GT VIP
      </text>

      {/* Headlight */}
      <path
        d="M 478 120 L 492 126 L 488 138 L 470 134 Z"
        fill="#E6CF85"
        stroke="#C9A227"
        strokeWidth="1"
      />
      <rect x="487" y="127" width="4" height="6" rx="1" fill="#C9A227" />

      {/* Vertical Taillight strip (ember #E07A2F highlight) */}
      <path d="M 60 78 L 65 78 L 65 120 L 60 120 Z" fill="#E07A2F" />

      {/* Protective lower bumper strip (#2A2B2E) */}
      <path
        d="M 64 165 L 115 165 M 187 165 L 373 165 M 445 165 L 488 165"
        stroke="#2A2B2E"
        strokeWidth="4"
      />

      {/* REAL WHEEL GEOMETRY - Rear Wheel (Center: 151, 166) */}
      <g transform={`rotate(${wheelRotation} 151 166)`}>
        <circle cx="151" cy="166" r="32" fill="#0A0A0C" />
        <circle
          cx="151"
          cy="166"
          r="30"
          stroke="#1A1B1E"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="151"
          cy="166"
          r="22"
          fill="#1F2126"
          stroke="#484C56"
          strokeWidth="1.5"
        />
        <circle cx="151" cy="166" r="16" fill="#141518" />
        {/* 6 Heavy-duty spokes */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={`r-van-spoke-${deg}`}
            x1="151"
            y1="166"
            x2={151 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={166 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#7C818E"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        ))}
        <circle
          cx="151"
          cy="166"
          r="7"
          fill="#141518"
          stroke="#3D4049"
          strokeWidth="1"
        />
        <circle cx="151" cy="166" r="3" fill="#C9A227" />
      </g>

      {/* REAL WHEEL GEOMETRY - Front Wheel (Center: 409, 166) */}
      <g transform={`rotate(${wheelRotation} 409 166)`}>
        <circle cx="409" cy="166" r="32" fill="#0A0A0C" />
        <circle
          cx="409"
          cy="166"
          r="30"
          stroke="#1A1B1E"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="409"
          cy="166"
          r="22"
          fill="#1F2126"
          stroke="#484C56"
          strokeWidth="1.5"
        />
        <circle cx="409" cy="166" r="16" fill="#141518" />
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={`f-van-spoke-${deg}`}
            x1="409"
            y1="166"
            x2={409 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={166 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#7C818E"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        ))}
        <circle
          cx="409"
          cy="166"
          r="7"
          fill="#141518"
          stroke="#3D4049"
          strokeWidth="1"
        />
        <circle cx="409" cy="166" r="3" fill="#C9A227" />
      </g>
    </svg>
  )
}
