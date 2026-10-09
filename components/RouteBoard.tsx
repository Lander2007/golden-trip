"use client"
export const route = [
  "Alexandria",
  "Cairo",
  "Sharm El-Sheikh",
  "Hurghada",
  "Luxor",
  "Aswan",
]
export default function RouteBoard({ active = 0 }: { active?: number }) {
  return (
    <aside
      aria-label="Journey route"
      className="w-[180px] border border-gold/40 bg-asphalt px-4 py-3 text-xs"
    >
      <p className="mb-3 hidden border-b border-road-grey pb-2 text-lane-white/60 md:block">
        Your route through Egypt{" "}
        <span className="float-right text-gold">↘</span>
      </p>
      <ol className="space-y-2">
        {route.map((city, index) => (
          <li
            key={city}
            aria-current={active === index ? "location" : undefined}
            className={`${
              active === index
                ? "route-current text-gold"
                : "hidden text-lane-white/60 md:block"
            }`}
          >
            <span className="mr-3 text-[10px]">
              {active === index ? "→" : "·"}
            </span>
            <span className="route-flap inline-block">{city}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}
