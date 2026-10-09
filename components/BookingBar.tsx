"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { destinationsList } from "./Destinations"

export default function BookingBar({ className = "" }: { className?: string }) {
  const router = useRouter()
  const tBooking = useTranslations("booking")
  const tCities = useTranslations("cities")
  const [cityId, setCityId] = useState("alexandria")
  const [date, setDate] = useState("2026-10-10")

  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDate(tomorrow.toISOString().split("T")[0])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dest = destinationsList.find((d) => d.id === cityId)
    const cityName = dest?.nameKey
      ? tCities(dest.nameKey.replace(/^cities\./, ""))
      : tCities(`${cityId}.name`)
    router.push(
      `/signup?branch=${encodeURIComponent(cityName)}&date=${encodeURIComponent(date)}`,
    )
  }

  return (
    <div className={`hero-booking-bar w-full max-w-[620px] ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center gap-2 rounded-[20px] lg:rounded-full border border-[#EADFC8]/20 bg-[#0B0A09]/90 p-2 lg:p-1.5 transition-all hover:border-[#EADFC8]/35 landscape-phone:grid-cols-[1fr_1fr_auto]"
      >
        <div className="relative flex-1 flex items-center gap-2.5 px-3.5 py-2.5 lg:py-1 rounded-[12px] lg:rounded-full bg-white/[0.04] lg:bg-transparent border border-white/5 lg:border-transparent">
          <MapPin className="h-4 w-4 text-[#C9A227] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] text-[#EADFC8]/70 font-medium">
              {tBooking("fromLabel")}
            </span>
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              aria-label={tBooking("departureCityAria")}
              className="bg-transparent text-sm font-semibold text-[#F4F2EC] focus:outline-none cursor-pointer truncate pe-4"
            >
              {destinationsList.map((d) => (
                <option
                  key={d.id}
                  value={d.id}
                  className="bg-[#0B0A09] text-[#F4F2EC]"
                >
                  {d.nameKey ? tCities(d.nameKey.replace(/^cities\./, "")) : tCities(`${d.id}.name`)}{" "}
                  {d.isHq ? tBooking("hqBadge") : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative flex-1 flex items-center gap-2.5 px-3.5 py-2.5 lg:py-1 rounded-[12px] lg:rounded-full bg-white/[0.04] lg:bg-transparent border border-white/5 lg:border-transparent">
          <Calendar className="h-4 w-4 text-[#C9A227] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] text-[#EADFC8]/70 font-medium">
              {tBooking("dateLabel")}
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label={tBooking("tripDateAria")}
              suppressHydrationWarning
              className="bg-transparent text-sm font-semibold text-[#F4F2EC] focus:outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="md:col-span-2 lg:col-span-1 landscape-phone:col-span-1 inline-flex items-center justify-center gap-2 rounded-[12px] lg:rounded-full bg-[#C9A227] px-6 py-3.5 lg:py-3 font-display text-sm font-bold text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.98] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          <span>{tBooking("startBooking")}</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5] rtl:-scale-x-100" />
        </button>
      </form>

      <p className="mt-3 text-xs tracking-normal text-[#B9B7B0]/80 ps-2">
        {tBooking("barCaption")}
      </p>
    </div>
  )
}

