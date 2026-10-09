"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ALL_CITIES, type CityData } from "./egyptMapData"

export default function DestinationsList() {
  return (
    <div className="mt-8 w-full border-t border-[#2A2B2E] pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs font-semibold text-[#C9A227]">
            Network directory
          </span>
          <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-[#F4F2EC]">
            All 14 Destinations Across Egypt
          </h3>
        </div>
        <p className="text-xs text-[#B9B7B0]/70 max-w-xs sm:text-right">
          Direct private transfers, resort runs & highway fleet pickups available nationwide.
        </p>
      </div>

      {/* Compact 14 Destinations Link Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        {ALL_CITIES.map((dest: CityData, index: number) => {
          return (
            <Link
              key={dest.id}
              href={`/signup?branch=${encodeURIComponent(dest.city)}`}
              className="group relative flex flex-row sm:flex-col items-center sm:items-stretch sm:justify-between rounded-sm border border-[#2A2B2E] bg-[#141518]/90 p-3 sm:p-3.5 transition-all duration-200 hover:border-[#C9A227] hover:bg-[#1a1b20] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] min-h-[48px]"
            >
              <div className="flex items-center sm:justify-between gap-3 sm:gap-0 w-full sm:w-auto">
                <span className="font-mono text-[10px] font-bold text-[#B9B7B0]/60 w-4 sm:w-auto">
                  {String(index + 1).padStart(2, "0")}
                </span>
                
                <h4 className="font-display text-sm font-bold text-[#F4F2EC] group-hover:text-[#C9A227] transition-colors truncate sm:hidden">
                  {dest.city}
                </h4>

                <div className="ml-auto sm:ml-0 flex items-center gap-2">
                  {dest.isHq ? (
                    <span className="rounded-xs border border-[#C9A227] bg-[#C9A227]/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-[#C9A227]">
                      HQ
                    </span>
                  ) : dest.isRouteCity ? (
                    <span className="rounded-xs bg-[#2A2B2E] px-1.5 py-0.5 font-mono text-[9px] text-[#E6CF85]">
                      Main
                    </span>
                  ) : null}
                  <span className="text-[11px] text-[#B9B7B0] sm:hidden block ml-2">
                    {dest.km === 0 ? "0 km" : `${dest.km} km`}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 hidden sm:block">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-[#F4F2EC] group-hover:text-[#C9A227] transition-colors truncate">
                    {dest.city}
                  </h4>
                  <ArrowUpRight
                    className="h-3 w-3 text-[#B9B7B0]/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#C9A227]"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-1 flex items-baseline justify-between text-[11px] text-[#B9B7B0]">
                  <span>{dest.km === 0 ? "0 km" : `${dest.km} km`}</span>
                  <span className="text-[10px] text-[#B9B7B0]/50">from Alex</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <p className="mt-4 text-center sm:text-left text-[11px] font-mono text-[#B9B7B0]/50">
        * All distances measured along main highway routes from Alexandria headquarters (to be confirmed by the client).
      </p>
    </div>
  )
}
