function PaymentIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
      <rect
        x="8"
        y="15"
        width="48"
        height="34"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M8 25h48M17 40h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  )
}

function BranchIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
      <path
        d="M32 54V13M32 25 18 39M32 35l15 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="m32 9-6 9h12l-6-9ZM14 38v12h12V38H14Zm30 10v8h8v-8h-8Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ReviewIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" aria-hidden="true">
      <path
        d="M32 8 39 23l17 2-12 12 3 17-15-8-15 8 3-17L8 25l17-2 7-15Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="m23 33 6 6 12-13"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const items = [
  {
    title: "Pay online or in cash",
    text: "Choose the payment route that suits you.",
    icon: PaymentIcon,
    shape: "rounded-full",
  },
  {
    title: "Every branch in one place",
    text: "One clear view across our whole network.",
    icon: BranchIcon,
    shape: "rotate-45 rounded-md",
    unrotate: true,
  },
  {
    title: "Reviews from real renters",
    text: "Useful feedback from verified bookings.",
    icon: ReviewIcon,
    shape: "rounded-full",
  },
]

export default function WhyUs() {
  return (
    <section id="why-us" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-lg bg-lane-white px-4 text-center">
          <h2 className="font-display text-4xl leading-none font-black tracking-[-0.045em] sm:text-6xl">
            Good reasons
            <br />
            to ride with us
          </h2>
        </div>

        <div className="mt-20 grid gap-16 py-8 md:grid-cols-3 md:gap-8">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="bg-lane-white py-8 text-center">
                <div
                  className={`mx-auto flex h-28 w-28 items-center justify-center border-4 border-highway-green bg-lane-white text-highway-green sm:h-32 sm:w-32 ${item.shape}`}
                >
                  <div className={item.unrotate ? "-rotate-45" : ""}>
                    <Icon />
                  </div>
                </div>
                <h3 className="mt-7 font-display text-2xl font-black tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-road-grey">
                  {item.text}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
