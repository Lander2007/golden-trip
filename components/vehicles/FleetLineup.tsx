import WhiteSedan from "./WhiteSedan"
import BlackSUV from "./BlackSUV"
import WhiteVan from "./WhiteVan"

export default function FleetLineup({
  className = "",
}: {
  className?: string
}) {
  return (
    <div
      className={`fleet-lineup relative flex flex-col items-center md:flex-row md:items-end justify-center gap-4 sm:gap-6 md:gap-8 ${className}`}
      role="img"
      aria-label="Golden Trip complete fleet: executive sedan, SUV, and passenger van"
    >
      {/* Sedan */}
      <div className="w-[80%] md:w-[30%] max-w-[280px] shrink-0">
        <WhiteSedan showBeam={true} beamBrightness={1.2} className="w-full h-auto" />
        <p className="mt-1 text-center font-display text-[11px] text-[#B9B7B0]">
          Sedan
        </p>
      </div>

      {/* SUV (center) */}
      <div className="w-[90%] md:w-[35%] max-w-[320px] shrink-0">
        <BlackSUV showBeam={true} beamBrightness={1.2} className="w-full h-auto" />
        <p className="mt-1 text-center font-display text-[11px] text-[#C9A227] font-semibold">
          Executive SUV
        </p>
      </div>

      {/* Van */}
      <div className="w-[90%] md:w-[35%] max-w-[320px] shrink-0">
        <WhiteVan showBeam={true} beamBrightness={1.2} className="w-full h-auto" />
        <p className="mt-1 text-center font-display text-[11px] text-[#B9B7B0]">
          Passenger Van
        </p>
      </div>
    </div>
  )
}
