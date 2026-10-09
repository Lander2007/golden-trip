import GizaPyramids from "./landscape/GizaPyramids"
import DatePalm from "./landscape/DatePalm"

export default function Landscape({
  className = "",
  phase = 0,
  light = false,
}: {
  className?: string
  phase?: number
  light?: boolean
}) {
  // Decorative layer: sitting behind content at low contrast, NEVER behind body text
  // Positioned in the lower-middle zone, with pyramids offset to the right side (cols 8-12)
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[280px] sm:h-[340px] md:h-[400px] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background Horizon Line */}
      <div
        className={`absolute inset-x-0 bottom-[14vh] h-[1px] ${
          light ? "bg-[#2A2B2E]/20" : "bg-[#2A2B2E]/50"
        }`}
      />

      {/* Giza Pyramids Group: sitting to the right side at low contrast (cols 8-12) */}
      {phase !== 0 && (
        <div
          data-depth="far"
          className="absolute right-0 sm:right-[4%] md:right-[8%] bottom-[14vh] w-[320px] sm:w-[460px] md:w-[600px] opacity-25"
        >
          <GizaPyramids light={light} className="w-full h-auto" />
        </div>
      )}

      {/* Date Palms: natural silhouettes positioned along the desert horizon */}
      <div
        data-depth="near"
        className="absolute right-[28%] sm:right-[32%] bottom-[13.5vh] w-[45px] sm:w-[65px] opacity-20"
      >
        <DatePalm light={light} className="w-full h-auto" />
      </div>

      <div
        data-depth="near"
        className="absolute left-[3%] sm:left-[6%] bottom-[13.5vh] w-[40px] sm:w-[55px] opacity-15"
      >
        <DatePalm light={light} flipped className="w-full h-auto" />
      </div>
    </div>
  )
}
