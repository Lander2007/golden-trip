export default function WhiteSedan({
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
      viewBox="0 0 560 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Golden Trip executive white sedan"
      className={className}
    >
      <defs>
        {/* Headlight beam */}
        <linearGradient id="sedanBeam" x1="0%" y1="0%" x2="100%" y2="0%">
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
        <linearGradient id="sedanGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E323B" />
          <stop offset="50%" stopColor="#22252C" />
          <stop offset="100%" stopColor="#181A1F" />
        </linearGradient>
      </defs>

      {/* Headlight projector beam */}
      {showBeam && (
        <polygon
          points="480,118 560,90 560,165 480,130"
          fill="url(#sedanBeam)"
          className="headlight-beam"
        />
      )}

      {/* Rear light glow in --ember */}
      <ellipse
        cx="56"
        cy="109"
        rx="38"
        ry="18"
        fill="#E07A2F"
        opacity={0.28 * brightness}
        className="rear-light-glow"
      />

      {/* Underbody shadow on road */}
      <ellipse
        cx="270"
        cy="164"
        rx="230"
        ry="5.5"
        fill="#0A0A0C"
        opacity="0.75"
      />

      {/* Tone 1: Vehicle Body (Off-White #F4F2EC) */}
      <path
        d="M 60 134 L 58 116 Q 60 102 74 98 L 124 96 L 175 58 Q 186 48 206 48 L 348 48 Q 366 48 382 62 L 424 96 L 468 100 Q 482 102 484 114 L 486 128 Q 486 142 476 145 L 435 145 A 36 36 0 0 0 363 145 L 187 145 A 36 36 0 0 0 115 145 L 60 145 Z"
        fill="#F4F2EC"
      />

      {/* Tone 2: Lower side shadow facet & rocker line (#D6D3C9) */}
      <path
        d="M 60 126 L 115 126 A 36 36 0 0 1 187 126 L 363 126 A 36 36 0 0 1 435 126 L 476 126 L 476 145 L 435 145 A 36 36 0 0 0 363 145 L 187 145 A 36 36 0 0 0 115 145 L 60 145 Z"
        fill="#D6D3C9"
      />

      {/* Tone 3: Tinted Glass Area */}
      <path
        d="M 184 56 L 248 56 L 248 94 L 142 94 Z"
        fill="url(#sedanGlass)"
      />
      <path
        d="M 254 56 L 330 56 L 330 94 L 254 94 Z"
        fill="url(#sedanGlass)"
      />
      <path
        d="M 336 56 L 368 56 L 412 94 L 336 94 Z"
        fill="url(#sedanGlass)"
      />

      {/* Chrome/Dark Window outline trim */}
      <path
        d="M 180 54 L 372 54 L 418 94 L 138 94 Z"
        stroke="#2A2B2E"
        strokeWidth="2"
        fill="none"
      />
      {/* Pillars */}
      <line
        x1="251"
        y1="54"
        x2="251"
        y2="94"
        stroke="#17181C"
        strokeWidth="5"
      />
      <line
        x1="333"
        y1="54"
        x2="333"
        y2="94"
        stroke="#17181C"
        strokeWidth="5"
      />

      {/* Side mirror */}
      <path
        d="M 406 92 L 422 92 Q 425 92 424 97 L 410 99 Z"
        fill="#F4F2EC"
        stroke="#2A2B2E"
        strokeWidth="1.2"
      />

      {/* Door cutlines & handles */}
      <line
        x1="251"
        y1="94"
        x2="251"
        y2="142"
        stroke="#B8B5AB"
        strokeWidth="1.5"
      />
      <line
        x1="333"
        y1="94"
        x2="333"
        y2="142"
        stroke="#B8B5AB"
        strokeWidth="1.5"
      />
      <path
        d="M 414 96 L 410 114 L 418 142"
        stroke="#B8B5AB"
        strokeWidth="1.5"
      />
      <rect x="264" y="102" width="16" height="3" rx="1.5" fill="#A8A59C" />
      <rect x="344" y="102" width="16" height="3" rx="1.5" fill="#A8A59C" />

      {/* Subtle GT mark */}
      <text
        x="292"
        y="120"
        fill="#C9A227"
        fontSize="8.5"
        fontWeight="800"
        letterSpacing="0.1em"
        fontFamily="sans-serif"
      >
        GT
      </text>

      {/* Headlight */}
      <path
        d="M 470 106 L 484 110 L 480 118 L 460 116 Z"
        fill="#E6CF85"
        stroke="#C9A227"
        strokeWidth="1"
      />
      {/* Amber blinker */}
      <rect x="478" y="111" width="4" height="5" rx="1" fill="#C9A227" />

      {/* Taillight (ember #E07A2F highlight) */}
      <path d="M 60 104 L 72 104 L 68 116 L 59 114 Z" fill="#E07A2F" />

      {/* Lower chassis / underbody line (#0E0E10) */}
      <path
        d="M 60 144 L 115 144 M 187 144 L 363 144 M 435 144 L 476 144"
        stroke="#0E0E10"
        strokeWidth="4"
      />

      {/* REAL WHEEL GEOMETRY - Rear Wheel (Center: 151, 146) */}
      <g transform={`rotate(${wheelRotation} 151 146)`}>
        <circle cx="151" cy="146" r="32" fill="#0A0A0C" />
        <circle
          cx="151"
          cy="146"
          r="30"
          stroke="#1A1B1E"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="151"
          cy="146"
          r="22"
          fill="#1F2126"
          stroke="#484C56"
          strokeWidth="1.5"
        />
        <circle cx="151" cy="146" r="15" fill="#141518" />
        {/* 10 Multi-spoke alloy */}
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
          <line
            key={`r-sedan-spoke-${deg}`}
            x1="151"
            y1="146"
            x2={151 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={146 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#9BA0AC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ))}
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
        <circle cx="399" cy="146" r="32" fill="#0A0A0C" />
        <circle
          cx="399"
          cy="146"
          r="30"
          stroke="#1A1B1E"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="399"
          cy="146"
          r="22"
          fill="#1F2126"
          stroke="#484C56"
          strokeWidth="1.5"
        />
        <circle cx="399" cy="146" r="15" fill="#141518" />
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
          <line
            key={`f-sedan-spoke-${deg}`}
            x1="399"
            y1="146"
            x2={399 + 20 * Math.cos((deg * Math.PI) / 180)}
            y2={146 + 20 * Math.sin((deg * Math.PI) / 180)}
            stroke="#9BA0AC"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ))}
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
