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
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.04em] text-[#0B0A09]">
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

      {/* 3 Steps with 180-degree flip km markers */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-3 -mx-2 px-2 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 lg:gap-12 items-start no-scrollbar">
        {steps.map((step) => (
          <div key={step.num} className="step-post relative flex flex-col w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none">
            {/* Physical Km Marker Signpost */}
            <div className="mb-5 inline-flex w-fit items-center border-2 border-[#2A2B2E] bg-white shadow-sm">
              <span className="bg-[#2A2B2E] px-3.5 py-2 font-mono text-xs font-bold text-[#F4F2EC]">
                km
              </span>
              <span className="px-4 py-1.5 font-display text-3xl font-extrabold tabular-nums text-[#0E0E10]">
                {step.num}
              </span>
            </div>

            {/* Step Panel that flips 180 degrees physically on scroll */}
            <div
              className="step-panel origin-center rounded-sm border border-[#2A2B2E]/20 bg-white/70 p-6 backdrop-blur-xs shadow-xs"
              style={{ perspective: "1000px" }}
            >
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E0E10]">
                {step.title}
              </h3>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#4A4B4E]">
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
