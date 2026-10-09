"use client"

// Sync client-side local date for tomorrow
/* Search pill container on desktop; stacked fields on mobile */ /* City Select */ /* Thin divider (desktop only) */ /* Date Picker */ /* Solid gold button with ArrowRight */ /* Caption line: strictly no uppercase */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import { destinationsList } from "./Destinations"

export default function BookingBar({ className = "" }: { className?: string }) {
  const router = useRouter()
  const [city, setCity] = useState("Alexandria")
  const [date, setDate] = useState("2026-10-10")
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDate(tomorrow.toISOString().split("T")[0])
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(
      `/signup?branch=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`,
    )
  }

  return (
    <div className={`hero-booking-bar w-full max-w-[620px] ${className}`}>
      {}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-[20px] sm:rounded-full border border-[#EADFC8]/20 bg-[#0B0A09]/85 p-2 sm:p-1.5 backdrop-blur-md shadow-2xl transition-all hover:border-[#EADFC8]/35"
      >
        {}
        <div className="relative flex-1 flex items-center gap-2.5 px-3.5 py-2.5 sm:py-1 rounded-xl sm:rounded-full bg-white/[0.04] sm:bg-transparent border border-white/5 sm:border-transparent">
          <MapPin className="h-4 w-4 text-[#C9A227] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] text-[#EADFC8]/70 font-medium">
              From
            </span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="Departure city"
              className="bg-transparent text-sm font-semibold text-[#F4F2EC] focus:outline-none cursor-pointer truncate pr-4"
            >
              {destinationsList.map((d) => (
                <option
                  key={d.city}
                  value={d.city}
                  className="bg-[#0B0A09] text-[#F4F2EC]"
                >
                  {d.city} {d.isHq ? "(HQ)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative flex-1 flex items-center gap-2.5 px-3.5 py-2.5 sm:py-1 rounded-xl sm:rounded-full bg-white/[0.04] sm:bg-transparent border border-white/5 sm:border-transparent">
          <Calendar className="h-4 w-4 text-[#C9A227] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] text-[#EADFC8]/70 font-medium">
              Date
            </span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Trip date"
              suppressHydrationWarning
              className="bg-transparent text-sm font-semibold text-[#F4F2EC] focus:outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>

        {}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-full bg-[#C9A227] px-6 py-3.5 sm:py-3 font-display text-sm font-bold text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.98] shrink-0 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          <span>Start booking</span>
          <ArrowRight className="h-4 w-4 stroke-[2.5]" />
        </button>
      </form>

      {}
      <p className="mt-3 text-xs tracking-normal text-[#B9B7B0]/80 pl-2">
        Open 24/7. 14 destinations. Sedan, SUV and van.
      </p>
    </div>
  )
}
