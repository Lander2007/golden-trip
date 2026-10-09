export default function DatePalm({
  className = "",
  light = false,
  flipped = false,
}: {
  className?: string
  light?: boolean
  flipped?: boolean
}) {
  const palmColor = light ? "#B3AFA2" : "#1B1C1F"
  const ribColor = light ? "#C8C4B8" : "#2A2B2E"

  return (
    <svg
      viewBox="0 0 240 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Egyptian Date Palm flat silhouette"
      className={className}
      style={flipped ? { transform: "scaleX(-1)" } : undefined}
    >
      {/* Ribbed segmented trunk: tapering upwards with distinct bark rings */}
      <g id="ribbed-trunk">
        {/* Core tapered trunk */}
        <path
          d="M 112 380 
             L 114 170 
             L 126 170 
             L 128 380 
             Z"
          fill={palmColor}
        />
        {/* Trunk horizontal bark ribs (18 rings) */}
        {[
          180, 192, 204, 216, 228, 240, 252, 264, 276, 288, 300, 312, 324, 336,
          348, 360, 372,
        ].map((y, i) => {
          const width = 14 + i * 0.35
          return (
            <path
              key={`rib-${y}`}
              d={`M ${120 - width / 2} ${y} Q 120 ${y - 3} ${120 + width / 2} ${y}`}
              stroke={ribColor}
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          )
        })}
      </g>

      {/* 11 Separate distinct arched fronds radiating from crown (x: 120, y: 170) */}
      <g
        id="crown-fronds"
        stroke={palmColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Frond 1: Left low drooping */}
        <path
          d="M 120 170 Q 75 190 25 210 Q 55 198 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 2: Left lower arch */}
        <path
          d="M 120 170 Q 60 160 15 175 Q 55 155 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 3: Left mid arch */}
        <path
          d="M 120 170 Q 50 130 20 135 Q 60 120 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 4: Left high arch */}
        <path
          d="M 120 170 Q 65 95 45 80 Q 80 98 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 5: Left upright crown */}
        <path
          d="M 120 170 Q 90 70 85 45 Q 102 78 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />

        {/* Frond 6: Central top spire frond */}
        <path
          d="M 120 170 Q 120 50 120 30 Q 124 60 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />

        {/* Frond 7: Right upright crown */}
        <path
          d="M 120 170 Q 150 70 155 45 Q 138 78 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 8: Right high arch */}
        <path
          d="M 120 170 Q 175 95 195 80 Q 160 98 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 9: Right mid arch */}
        <path
          d="M 120 170 Q 190 130 220 135 Q 180 120 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 10: Right lower arch */}
        <path
          d="M 120 170 Q 180 160 225 175 Q 185 155 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
        {/* Frond 11: Right low drooping */}
        <path
          d="M 120 170 Q 165 190 215 210 Q 185 198 120 170"
          fill={palmColor}
          strokeWidth="1.5"
        />
      </g>
    </svg>
  )
}
