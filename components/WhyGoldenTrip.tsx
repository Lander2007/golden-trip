"use client"

import { useTranslations } from "next-intl"
import Scene from "./Scene"
import PaymentPictogram from "./pictograms/PaymentPictogram"
import BranchesPictogram from "./pictograms/BranchesPictogram"
import ReviewsPictogram from "./pictograms/ReviewsPictogram"

export default function WhyGoldenTrip({
  frames = false,
}: {
  frames?: boolean
}) {
  const tWhy = useTranslations("why")

  const items = [
    {
      id: "payment",
      component: PaymentPictogram,
      title: tWhy("paymentTitle"),
      copy: tWhy("paymentCopy"),
    },
    {
      id: "branches",
      component: BranchesPictogram,
      title: tWhy("branchesTitle"),
      copy: tWhy("branchesCopy"),
    },
    {
      id: "reviews",
      component: ReviewsPictogram,
      title: tWhy("reviewsTitle"),
      copy: tWhy("reviewsCopy"),
    },
  ]

  return (
    <Scene index={4} id="why-golden-trip" frames={frames}>
      <div className="mb-10">
        <h2 className="font-display text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] font-extrabold tracking-[-0.04em] text-[#F4F2EC] text-balance">
          {tWhy("headingPart1")}
          <span className="font-accent italic font-normal text-[#C9A227] rtl:not-italic">
            {tWhy("headingAccent")}
          </span>
          {tWhy("headingPeriod")}
        </h2>
        <p className="mt-3 text-sm text-[#B9B7B0] sm:text-base">
          {tWhy("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-5">
        {items.map((item) => {
          const Pictogram = item.component
          return (
            <div
              key={item.id}
              className="benefit flex flex-row md:flex-col items-center md:items-start rounded-sm border border-[#2A2B2E] bg-[#141518] p-4 md:p-6 gap-4 md:gap-0"
            >
              <div className="mb-0 md:mb-5 shrink-0 flex h-[72px] w-[72px] md:h-14 md:w-14 items-center justify-center rounded-sm border border-[#2A2B2E] bg-[#0B0A09]">
                <Pictogram />
              </div>
              <div>
                <h3 className="font-display text-[clamp(1.125rem,2vw+0.5rem,1.5rem)] font-bold text-[#F4F2EC]">
                  {item.title}
                </h3>
                <p className="mt-1 md:mt-2 text-[clamp(0.875rem,1vw+0.5rem,1rem)] leading-relaxed text-[#B9B7B0]">
                  {item.copy}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Scene>
  )
}

