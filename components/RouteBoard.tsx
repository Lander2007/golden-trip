"use client"

import { useTranslations } from "next-intl"

export const route = [
  "cities.alexandria.name",
  "cities.cairo.name",
  "cities.sharm.name",
  "cities.hurghada.name",
  "cities.luxor.name",
  "cities.aswan.name",
]

export default function RouteBoard({ active = 0 }: { active?: number }) {
  const tRoute = useTranslations("route")
  const t = useTranslations()

  return (
    <aside
      aria-label={tRoute("journeyRouteAria")}
      className="w-[180px] border border-gold/40 bg-asphalt px-4 py-3 text-xs"
    >
      <p className="mb-3 hidden border-b border-road-grey pb-2 text-lane-white/60 md:block">
        {tRoute("routeThroughEgypt")}{" "}
        <span className="float-end text-gold">↘</span>
      </p>
      <ol className="space-y-2">
        {route.map((cityKey, index) => (
          <li
            key={cityKey}
            aria-current={active === index ? "location" : undefined}
            className={`${
              active === index
                ? "route-current text-gold"
                : "hidden text-lane-white/60 md:block"
            }`}
          >
            <span className="me-3 text-[10px]">
              {active === index ? "→" : "·"}
            </span>
            <span className="route-flap inline-block">{t(cityKey)}</span>
          </li>
        ))}
      </ol>
    </aside>
  )
}
