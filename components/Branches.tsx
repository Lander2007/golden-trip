const branches = [
  {
    exit: "01",
    city: "Cairo",
    detail: "Nasr City",
    side: "left",
    width: "lg:w-[27rem]",
  },
  {
    exit: "02",
    city: "Alexandria",
    detail: "Smouha",
    side: "right",
    width: "lg:w-[23rem]",
  },
  {
    exit: "03",
    city: "Mansoura",
    detail: "El Gomhouria St.",
    side: "left",
    width: "lg:w-[21rem]",
  },
  {
    exit: "04",
    city: "Giza",
    detail: "Dokki",
    side: "right",
    width: "lg:w-[26rem]",
  },
  {
    exit: "05",
    city: "Hurghada",
    detail: "Airport Road",
    side: "left",
    width: "lg:w-[24rem]",
  },
]

export default function Branches() {
  return (
    <section id="branches" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-20 max-w-2xl bg-lane-white px-4 py-3 text-center">
          <h2 className="font-display text-4xl leading-none font-black tracking-[-0.045em] sm:text-6xl">
            Our branches,
            <br />
            along the road
          </h2>
          <p className="mt-5 text-lg text-road-grey">
            Start from the branch that is already on your route.
          </p>
        </div>

        <div className="space-y-10 sm:space-y-14">
          {branches.map((branch) => (
            <div
              key={branch.exit}
              className={`flex ${
                branch.side === "left"
                  ? "justify-start pr-[52%]"
                  : "justify-end pl-[52%]"
              }`}
            >
              <div
                className={`sign-inset relative min-w-[9.5rem] rounded-sm bg-highway-green px-5 py-5 text-lane-white sm:min-w-[15rem] sm:px-7 sm:py-6 ${branch.width}`}
              >
                <div className="relative z-10">
                  <p className="font-display text-xs font-bold text-lane-white/70 sm:text-sm">
                    Exit {branch.exit}
                  </p>
                  <p className="mt-1 font-display text-2xl leading-none font-black tracking-[-0.04em] sm:text-4xl">
                    {branch.city}
                  </p>
                  <p className="mt-2 text-sm text-lane-white/75">
                    {branch.detail}
                  </p>
                  <span
                    className={`absolute top-1/2 text-3xl font-light ${
                      branch.side === "left"
                        ? "-right-3 translate-x-full"
                        : "-left-3 -translate-x-full"
                    }`}
                    aria-hidden="true"
                  >
                    {branch.side === "left" ? "→" : "←"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
