import WhiteSedan from "./vehicles/WhiteSedan"
import BlackSUV from "./vehicles/BlackSUV"
import WhiteVan from "./vehicles/WhiteVan"

export default function Fleet({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto mt-6 flex flex-col md:flex-row md:items-end justify-center gap-4 max-w-[480px] md:w-auto w-full ${className}`}
      aria-label="Golden Trip fleet: white sedan, black SUV, and white van"
    >
      <div className="w-full md:w-[30%] bg-[#141518] border border-[#2A2B2E] p-4 rounded-sm flex items-center justify-center md:bg-transparent md:border-none md:p-0">
        <WhiteSedan showBeam={false} className="w-[60%] md:w-full h-auto" />
      </div>
      <div className="w-full md:w-[35%] bg-[#141518] border border-[#2A2B2E] p-4 rounded-sm flex items-center justify-center md:bg-transparent md:border-none md:p-0">
        <BlackSUV showBeam={false} className="w-[60%] md:w-full h-auto" />
      </div>
      <div className="w-full md:w-[35%] bg-[#141518] border border-[#2A2B2E] p-4 rounded-sm flex items-center justify-center md:bg-transparent md:border-none md:p-0">
        <WhiteVan showBeam={false} className="w-[60%] md:w-full h-auto" />
      </div>
    </div>
  )
}
