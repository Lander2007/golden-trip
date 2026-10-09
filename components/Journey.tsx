import Hero from "./Hero"
import GantryIntro from "./GantryIntro"
import Destinations from "./Destinations"
import HowItWorks from "./HowItWorks"
import WhyGoldenTrip from "./WhyGoldenTrip"
import FinalCta from "./FinalCta"
import Drive from "./Drive"
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
