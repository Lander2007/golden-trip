import Scene from "./Scene"

const steps = [
  {
    num: "01",
    title: "Create your account",
    copy: "Sign up with your email in a minute.",
  },
  {
    num: "02",
    title: "Choose a branch and a car",
    copy: "Pick where you start, the car, and the date.",
  },
  {
    num: "03",
    title: "Confirm and pay",
    copy: "Pay online or in cash.",
  },
]

export default function HowItWorks({ frames = false }: { frames?: boolean }) {
  return (
    <Scene index={3} id="how-it-works" light frames={frames}>
      {/* Title strictly following user copy: 'Three steps. Then you're off.' */}
      <div className="mb-12">
        <h2 className="font-display text-[clamp(1.75rem,4vw+0.5rem,3.5rem)] font-extrabold tracking-[-0.04em] text-[#0B0A09] text-balance">
          Three steps. Then you’re{" "}
          <span className="font-accent italic font-normal text-[#C9A227]">
            off
          </span>
          .
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#4A4B4E]">
          Simple, direct highway booking across Egypt.
        </p>
      </div>

      {/* 3 Steps with vertical mobile line or horizontal grid */}
      <div className="flex flex-col relative pl-6 gap-8 md:pl-0 md:grid md:grid-cols-3 md:gap-4 lg:gap-8 items-start">
        {/* Mobile Connecting Gold Line */}
        <div className="absolute left-[3px] top-[28px] bottom-[28px] w-px bg-[#C9A227] md:hidden" aria-hidden="true" />
        {steps.map((step) => (
          <div key={step.num} className="step-post relative flex flex-col w-full shrink-0 md:w-auto">
            {/* Horizontal connection line for mobile */}
            <div className="absolute -left-6 top-[28px] w-[21px] h-px bg-[#C9A227] md:hidden" aria-hidden="true" />
            
            {/* Physical Km Marker Signpost */}
            <div className="mb-5 inline-flex w-fit items-center border-2 border-[#2A2B2E] bg-white shadow-sm relative z-10">
              <span className="bg-[#2A2B2E] px-3.5 py-2 font-mono text-[10px] md:text-xs font-bold text-[#F4F2EC]">
                km
              </span>
              <span className="px-4 py-1.5 font-display text-2xl md:text-3xl font-extrabold tabular-nums text-[#0E0E10]">
                {step.num}
              </span>
            </div>

            {/* Step Panel that flips 180 degrees physically on scroll */}
            <div
              className="step-panel origin-center rounded-sm border border-[#2A2B2E]/20 bg-white p-5 md:p-6 shadow-sm"
              style={{ perspective: "1000px" }}
            >
              <h3 className="font-display text-[clamp(1.125rem,2vw+0.5rem,1.5rem)] font-bold text-[#0E0E10]">
                {step.title}
              </h3>
              <p className="mt-2 text-[clamp(0.875rem,1vw+0.5rem,1rem)] leading-relaxed text-[#4A4B4E]">
                {step.copy}
              </p>
            </div>

            {/* Mile marker ground post line */}
            <div
              aria-hidden="true"
              className="ml-6 hidden h-8 w-1 bg-[#2A2B2E]/40 md:block"
            />
          </div>
        ))}
      </div>
    </Scene>
  )
}
