export default function GizaPyramids({
  className = "",
  light = false,
}: {
  className?: string
  light?: boolean
}) {
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
      <path d="M620 150L525 304H620ZM380 50L190 304H380ZM170 75L-10 304H170Z" fill={litColor} />
      <path d="M620 150V304H715ZM380 50V304H570ZM170 75V304H350Z" fill={shadowColor} />
      <path d="M380 50L340 105H380Z" fill={casingLit} />
      <path d="M380 50V105H420Z" fill={casingShadow} />
    </svg>
  )
}
