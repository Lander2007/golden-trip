export default function GizaPyramids({
  className = "",
  light = false,
}: {
  className?: string
  light?: boolean
}) {
  // Slope of 52 degrees: tan(52) = 1.28
  // Lit face and shadow face only, flat 2-tone vector shapes
  const litColor = light ? "#DDD9CE" : "#28292D"
  const shadowColor = light ? "#C8C4B8" : "#141517"
  const casingLit = light ? "#ECE8DD" : "#36383E"
  const casingShadow = light ? "#BBB6AA" : "#1D1E21"

  return (
    <svg
      viewBox="0 0 800 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Giza Pyramids flat two-tone silhouette"
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* 1. Menkaure (Smallest - back right, apex at 620, 150; base width 190, height 120 -> slope ~51.6°) */}
      <g id="menkaure">
        {/* Lit Face */}
        <polygon
          points="620,150 525,304 620,304"
          fill={litColor}
          opacity="0.8"
        />
        {/* Shadow Face */}
        <polygon
          points="620,150 620,304 715,304"
          fill={shadowColor}
          opacity="0.8"
        />
      </g>

      {/* 2. Khafre (Second largest - center, apex at 380, 50; base width 380, height 254 -> slope ~53°) */}
      <g id="khafre">
        {/* Lit Face */}
        <polygon points="380,50 190,304 380,304" fill={litColor} />
        {/* Shadow Face */}
        <polygon points="380,50 380,304 570,304" fill={shadowColor} />
        {/* Casing stones preserved at the peak */}
        <polygon points="380,50 340,105 380,105" fill={casingLit} />
        <polygon points="380,50 380,105 420,105" fill={casingShadow} />
      </g>

      {/* 3. Khufu (Great Pyramid - front left, apex at 170, 75; base width 360, height 229 -> slope ~51.9°) */}
      <g id="khufu">
        {/* Lit Face */}
        <polygon points="170,75 -10,304 170,304" fill={litColor} />
        {/* Shadow Face */}
        <polygon points="170,75 170,304 350,304" fill={shadowColor} />
      </g>
    </svg>
  )
}
