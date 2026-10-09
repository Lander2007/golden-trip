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
      {/* Title strictly following user copy: 'Why Golden Trip.' */}
      <div className="mb-12">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-[#F4F2EC]">
          Why Golden{" "}
          <span className="font-accent italic font-normal text-[#C9A227]">
            Trip
          </span>
          .
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#B9B7B0]">
          Built for reliability on every highway across Egypt.
        </p>
      </div>

      {/* 3 Benefit items with custom geometric pictograms */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-3 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 lg:gap-10 items-stretch no-scrollbar">
        {items.map((item) => {
          const Pictogram = item.component
          return (
            <div
              key={item.id}
              className="benefit group relative flex flex-col items-center text-center sm:items-start sm:text-left rounded-sm border border-[#2A2B2E] bg-[#141518]/90 p-6 sm:p-8 backdrop-blur-xs shadow-lg overflow-hidden transition-all duration-300 hover:border-[#C9A227]/40 w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none"
            >
              {/* 160px Square Pictogram Container */}
              <div className="relative mb-6 flex h-[160px] w-[160px] items-center justify-center shrink-0">
                <Pictogram />
              </div>

              {/* Title & Copy */}
              <div className="mt-auto w-full">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F4F2EC] group-hover:text-[#C9A227] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#B9B7B0]">
                  {item.copy}
                </p>
              </div>

              {/* Headlight beam illumination sweep */}
              <span className="benefit-shine pointer-events-none absolute inset-y-0 -left-28 w-24 -skew-x-[25deg] bg-gradient-to-r from-transparent via-[#E6CF85]/20 to-transparent" />
            </div>
          )
        })}
      </div>
    </Scene>
  )
}
