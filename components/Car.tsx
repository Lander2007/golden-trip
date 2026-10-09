import BlackSUV from "./vehicles/BlackSUV"
import WhiteSedan from "./vehicles/WhiteSedan"
import WhiteVan from "./vehicles/WhiteVan"
import FleetLineup from "./vehicles/FleetLineup"

export type VehicleType = "suv" | "sedan" | "van" | "fleet"

export default function Car({
  className = "",
  vehicle = "suv",
  showBeam = true,
}: {
  className?: string
  vehicle?: VehicleType
  showBeam?: boolean
}) {
  if (vehicle === "fleet") {
    return <FleetLineup className={className} />
  }

  if (vehicle === "sedan") {
    return <WhiteSedan className={className} showBeam={showBeam} />
  }

  if (vehicle === "van") {
    return <WhiteVan className={className} showBeam={showBeam} />
  }

  return <BlackSUV className={className} showBeam={showBeam} />
}
