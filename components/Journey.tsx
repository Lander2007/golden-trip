import dynamic from "next/dynamic"
import Hero from "./Hero"
import GantryIntro from "./GantryIntro"
import HowItWorks from "./HowItWorks"
import Drive from "./Drive"

// Code split heavy below-the-fold scenes with next/dynamic
const Destinations = dynamic(() => import("./Destinations"), { ssr: true })
const WhyGoldenTrip = dynamic(() => import("./WhyGoldenTrip"), { ssr: true })
const FinalCta = dynamic(() => import("./FinalCta"), { ssr: true })

export default function Journey({ frames = false }: { frames?: boolean }) {
  return (
    <Drive frames={frames}>
      <Hero frames={frames} />
      <GantryIntro frames={frames} />
      <Destinations frames={frames} />
      <HowItWorks frames={frames} />
      <WhyGoldenTrip frames={frames} />
      <FinalCta frames={frames} />
    </Drive>
  )
}
