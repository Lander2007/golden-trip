import WhiteSedan from "./vehicles/WhiteSedan"
import BlackSUV from "./vehicles/BlackSUV"
import WhiteVan from "./vehicles/WhiteVan"

export default function Fleet({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto mt-6 flex max-w-[480px] items-end justify-center gap-4 ${className}`}
      aria-label="Golden Trip fleet: white sedan, black SUV, and white van"
    >
      <div className="w-[30%]">
        <WhiteSedan showBeam={false} className="w-full h-auto drop-shadow-sm" />
      </div>
      <div className="w-[35%]">
        <BlackSUV showBeam={false} className="w-full h-auto drop-shadow-md" />
      </div>
      <div className="w-[35%]">
        <WhiteVan showBeam={false} className="w-full h-auto drop-shadow-sm" />
      </div>
    </div>
  )
}
