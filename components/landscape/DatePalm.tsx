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
      aria-hidden="true"
      className={className}
      style={flipped ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M112 380L114 170H126L128 380Z" fill={palmColor} />
      <path
        d="M113 180Q120 177 127 180M112.4 192Q120 189 127.6 192M111.9 204Q120 201 128.1 204M111.5 216Q120 213 128.5 216M111.2 228Q120 225 128.8 228M110.8 240Q120 237 129.2 240M110.5 252Q120 249 129.5 252M110.1 264Q120 261 129.9 264M109.8 276Q120 273 130.2 276M109.4 288Q120 285 130.6 288M109.1 300Q120 297 130.9 300M108.7 312Q120 309 131.3 312M108.4 324Q120 321 131.6 324M108 336Q120 333 132 336M107.7 348Q120 345 132.3 348M107.3 360Q120 357 132.7 360M107 372Q120 369 133 372"
        stroke={ribColor}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M120 170Q75 190 25 210Q55 198 120 170Q60 160 15 175Q55 155 120 170Q50 130 20 135Q60 120 120 170Q65 95 45 80Q80 98 120 170Q90 70 85 45Q102 78 120 170Q120 50 120 30Q124 60 120 170Q150 70 155 45Q138 78 120 170Q175 95 195 80Q160 98 120 170Q190 130 220 135Q180 120 120 170Q180 160 225 175Q185 155 120 170Q165 190 215 210Q185 198 120 170"
        fill={palmColor}
      />
    </svg>
  )
}
