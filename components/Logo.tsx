export default function Logo({
  showTagline = false,
  condensed = false,
}: {
  showTagline?: boolean
  condensed?: boolean
}) {
  return (
    <span className="flex items-center gap-2.5 text-[#C9A227]">
      <svg
        viewBox="0 0 64 60"
        className={`transition-all duration-300 ${
          condensed ? "h-9 w-9" : "h-11 w-11"
        }`}
        aria-hidden="true"
      >
        <path
          d="M24 53C2 44 5 17 17 8M40 53C62 44 59 17 47 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {[0, 1, 2, 3, 4].map((index) => (
          <g key={index} transform={`translate(0 ${index * 8})`}>
            <path
              d="M13 10l-7-5 1 9 8 3M51 10l7-5-1 9-8 3"
              fill="currentColor"
            />
          </g>
        ))}
        <text
          x="32"
          y="37"
          textAnchor="middle"
          fill="currentColor"
          fontFamily="var(--font-anybody)"
          fontSize="22"
          fontWeight="800"
        >
          GT
        </text>
        <path d="M25 53l7-4 7 4" fill="none" stroke="currentColor" />
      </svg>
      <span className="flex flex-col">
        <span
          className={`font-display font-bold leading-none tracking-tight transition-all duration-300 ${
            condensed ? "text-base lg:text-lg" : "text-lg lg:text-xl"
          }`}
        >
          Golden Trip
        </span>
        {showTagline && (
          <span className="mt-1 font-body text-[10px] font-normal tracking-[.18em] text-[#B9B7B0]">
            Every road. Your story.
          </span>
        )}
      </span>
    </span>
  )
}
