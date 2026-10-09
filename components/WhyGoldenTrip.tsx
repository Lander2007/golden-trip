"use client"

import Scene from "./Scene"
import PaymentPictogram from "./pictograms/PaymentPictogram"
import BranchesPictogram from "./pictograms/BranchesPictogram"
import ReviewsPictogram from "./pictograms/ReviewsPictogram"

const items = [
  {
    id: "payment",
    component: PaymentPictogram,
    title: "Pay online or in cash",
    copy: "Whichever suits you.",
  },
  {
    id: "branches",
    component: BranchesPictogram,
    title: "Every branch, one account",
    copy: "From Alexandria to Aswan.",
  },
  {
    id: "reviews",
    component: ReviewsPictogram,
    title: "Real reviews",
    copy: "Ratings from people who actually rode with us.",
  },
]

export default function WhyGoldenTrip({
  frames = false,
}: {
  frames?: boolean
}) {
  return (
    <Scene index={4} id="why-golden-trip" frames={frames}>
      <div className="mb-10">
        <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#F4F2EC] sm:text-4xl md:text-5xl">
          Why Golden{" "}
          <span className="font-accent italic font-normal text-[#C9A227]">
            Trip
          </span>
          .
        </h2>
        <p className="mt-3 text-sm text-[#B9B7B0] sm:text-base">
          Built for reliability on every highway across Egypt.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {items.map((item) => {
          const Pictogram = item.component
          return (
            <div
              key={item.id}
              className="benefit flex flex-col rounded-sm border border-[#2A2B2E] bg-[#141518] p-6"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-sm border border-[#2A2B2E] bg-[#0B0A09]">
                <Pictogram />
              </div>
              <h3 className="font-display text-xl font-bold text-[#F4F2EC]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#B9B7B0]">
                {item.copy}
              </p>
            </div>
          )
        })}
      </div>
    </Scene>
  )
}
