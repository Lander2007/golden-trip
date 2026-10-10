"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useApp } from "@/context/AppContext"
import {
  MOCK_BRANCHES,
  calculateDaysBetween,
} from "@/lib/mockData"
import { pick } from "@/lib/localized"
import { money, number, duration } from "@/lib/format"
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Fuel,
  Gauge,
  Star,
  CheckCircle,
  XCircle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react"

export default function CarsPage() {
  const t = useTranslations("carsCatalog")
  const tCommon = useTranslations("common")
  const locale = useLocale()

  const {
    cars,
    currentUser,
    pickupBranch,
    setPickupBranch,
    returnBranch,
    setReturnBranch,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useApp()

  // Filters state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all")
  const [maxPrice, setMaxPrice] = useState<number>(15000)
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("all")
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    return calculateDaysBetween(pickupDate, returnDate)
  }, [pickupDate, returnDate])

  // Simulate short loading skeleton on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  // Filter cars (bilingual search across English and Arabic names/types)
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameEn = car.name.en.toLowerCase()
        const nameAr = car.name.ar.toLowerCase()
        const matchesName = nameEn.includes(q) || nameAr.includes(q)
        const matchesType = car.type.toLowerCase().includes(q)
        if (!matchesName && !matchesType) {
          return false
        }
      }

      // Branch filter
      if (selectedBranchFilter !== "all" && car.branchId !== selectedBranchFilter) {
        return false
      }

      // Car type (using enum code)
      if (selectedType !== "all" && car.type !== selectedType) {
        return false
      }

      // Transmission (using enum code)
      if (selectedTransmission !== "all" && car.transmission !== selectedTransmission) {
        return false
      }

      // Max price
      if (car.pricePerDay > maxPrice) {
        return false
      }

      // Availability
      if (onlyAvailable && !car.available) {
        return false
      }

      return true
    })
  }, [
    cars,
    searchQuery,
    selectedBranchFilter,
    selectedType,
    selectedTransmission,
    maxPrice,
    onlyAvailable,
  ])

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedType("all")
    setSelectedTransmission("all")
    setMaxPrice(15000)
    setSelectedBranchFilter("all")
    setOnlyAvailable(false)
  }

  const carTypes = [
    { id: "all", label: t("typeAll") },
    { id: "economy", label: t("typeEconomy") },
    { id: "sedan", label: t("typeSedan") },
    { id: "suv", label: t("typeSuv") },
    { id: "luxury", label: t("typeLuxury") },
    { id: "family_van", label: t("typeFamily") },
  ]

  const currentUserName = currentUser
    ? typeof currentUser.name === "object"
      ? pick(currentUser.name, locale)
      : currentUser.name
    : t("defaultGuest")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Top Hero / Welcome Banner */}
        <section className="relative border-b border-[#2A2B2E] bg-gradient-to-b from-[#141518] to-[#0B0A09] pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 end-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3.5 py-1 text-xs font-bold text-[#C9A227] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t("badge")}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F2EC] tracking-tight">
                  {t("welcome", { name: currentUserName })}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#B9B7B0] max-w-2xl leading-relaxed">
                  {t("subtitle")}
                </p>
              </div>

              {/* Fast Stats Badges */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <div className="flex-1 sm:flex-initial rounded-lg border border-[#2A2B2E] bg-[#141518]/80 p-3.5 text-center min-w-[110px]">
                  <span className="block text-2xl font-black text-[#C9A227]">
                    {number(14, locale)}+
                  </span>
                  <span className="text-xs text-[#B9B7B0]">{t("statCarsAvailable")}</span>
                </div>
                <div className="flex-1 sm:flex-initial rounded-lg border border-[#2A2B2E] bg-[#141518]/80 p-3.5 text-center min-w-[110px]">
                  <span className="block text-2xl font-black text-[#F4F2EC]">
                    {number(6, locale)}
                  </span>
                  <span className="text-xs text-[#B9B7B0]">{t("statMainBranches")}</span>
                </div>
                <div className="flex-1 sm:flex-initial rounded-lg border border-[#2A2B2E] bg-[#141518]/80 p-3.5 text-center min-w-[110px]">
                  <span className="block text-2xl font-black text-[#E6CF85]">
                    <bdi dir="ltr">24/7</bdi>
                  </span>
                  <span className="text-xs text-[#B9B7B0]">{t("statSupport")}</span>
                </div>
              </div>
            </div>

            {/* Quick Filter & Dates Ribbon */}
            <div className="mt-8 rounded-xl border border-[#2A2B2E] bg-[#141518] p-4 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Pickup Branch */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t("pickupBranch")}</span>
                  </label>
                  <select
                    value={pickupBranch}
                    onChange={(e) => setPickupBranch(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none"
                  >
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#141518]">
                        {pick(b.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Return Branch */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t("returnBranch")}</span>
                  </label>
                  <select
                    value={returnBranch}
                    onChange={(e) => setReturnBranch(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none"
                  >
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#141518]">
                        {pick(b.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Date */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t("pickupDate")}</span>
                  </label>
                  <bdi dir="ltr" className="block">
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none [color-scheme:dark]"
                    />
                  </bdi>
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t("returnDateWithDays", { days: rentalDays })}</span>
                  </label>
                  <bdi dir="ltr" className="block">
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none [color-scheme:dark]"
                    />
                  </bdi>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area: Filters + Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-5 shadow-lg sticky top-28">
                <div className="flex items-center justify-between pb-4 border-b border-[#2A2B2E] mb-5">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#F4F2EC]">
                    <SlidersHorizontal className="w-4 h-4 text-[#C9A227]" />
                    <span>{t("filterTitle")}</span>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-[#B9B7B0] hover:text-[#C9A227] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t("resetFilters")}</span>
                  </button>
                </div>

                {/* Search Box */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    {t("searchLabel")}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t("searchPlaceholder")}
                      className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] pe-8 ps-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none placeholder:text-[#B9B7B0]/40"
                    />
                    <Search className="absolute top-2.5 end-2.5 w-4 h-4 text-[#B9B7B0]/50" />
                  </div>
                </div>

                {/* Filter by Branch */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    {t("branchFilterLabel")}
                  </label>
                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                  >
                    <option value="all">{t("allBranches")}</option>
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {pick(b.city, locale)} - {pick(b.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Car Type */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    {t("categoryLabel")}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {carTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                          selectedType === type.id
                            ? "bg-[#C9A227] text-[#0B0A09] shadow-sm font-bold"
                            : "bg-[#0B0A09] text-[#B9B7B0] border border-[#2A2B2E] hover:border-[#C9A227]/40 hover:text-[#F4F2EC]"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transmission */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    {t("transmissionLabel")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTransmission("all")}
                      className={`py-1.5 rounded text-xs font-medium text-center transition-all ${
                        selectedTransmission === "all"
                          ? "bg-[#C9A227] text-[#0B0A09] font-bold"
                          : "bg-[#0B0A09] text-[#B9B7B0] border border-[#2A2B2E]"
                      }`}
                    >
                      {t("all")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTransmission("automatic")}
                      className={`py-1.5 rounded text-xs font-medium text-center transition-all ${
                        selectedTransmission === "automatic"
                          ? "bg-[#C9A227] text-[#0B0A09] font-bold"
                          : "bg-[#0B0A09] text-[#B9B7B0] border border-[#2A2B2E]"
                      }`}
                    >
                      {t("automatic")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTransmission("manual")}
                      className={`py-1.5 rounded text-xs font-medium text-center transition-all ${
                        selectedTransmission === "manual"
                          ? "bg-[#C9A227] text-[#0B0A09] font-bold"
                          : "bg-[#0B0A09] text-[#B9B7B0] border border-[#2A2B2E]"
                      }`}
                    >
                      {t("manual")}
                    </button>
                  </div>
                </div>

                {/* Max Price Range */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#B9B7B0]">{t("maxPriceLabel")}</span>
                    <span className="text-[#C9A227] font-mono">{money(maxPrice, locale)}</span>
                  </div>
                  <input
                    type="range"
                    min="850"
                    max="15000"
                    step="250"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#C9A227] bg-[#0B0A09] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#B9B7B0]/60 mt-1">
                    <span>{money(850, locale)}</span>
                    <span>{money(15000, locale)}</span>
                  </div>
                </div>

                {/* Availability Only Toggle */}
                <div className="pt-2 border-t border-[#2A2B2E]">
                  <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-[#B9B7B0]">
                    <span>{t("onlyAvailableLabel")}</span>
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={(e) => setOnlyAvailable(e.target.checked)}
                      className="w-4 h-4 rounded border-[#2A2B2E] bg-[#0B0A09] accent-[#C9A227]"
                    />
                  </label>
                </div>
              </div>
            </aside>

            {/* Main Cars Grid */}
            <main className="lg:col-span-3">
              {/* Results Count bar */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#2A2B2E]/60">
                <p className="text-sm text-[#B9B7B0]">
                  {t("foundCars", { count: filteredCars.length })}
                  {selectedBranchFilter !== "all" && (
                    <span>
                      {" "}
                      {t("inBranch", {
                        branch: pick(
                          MOCK_BRANCHES.find((b) => b.id === selectedBranchFilter)?.city,
                          locale
                        ),
                      })}
                    </span>
                  )}
                </p>

                <div className="text-xs text-[#B9B7B0]/80">
                  {t("tripDuration")}
                  <span className="font-bold text-[#F4F2EC]">
                    {duration(rentalDays, locale)}
                  </span>
                </div>
              </div>

              {/* Loading Skeleton */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-4 animate-pulse space-y-4"
                    >
                      <div className="h-44 bg-white/5 rounded-lg" />
                      <div className="h-4 bg-white/10 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                      <div className="h-10 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : filteredCars.length === 0 ? (
                /* Empty State */
                <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-12 text-center max-w-lg mx-auto my-10">
                  <div className="w-16 h-16 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] mx-auto mb-4">
                    <Filter className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#F4F2EC] mb-2">{t("noCarsTitle")}</h3>
                  <p className="text-xs text-[#B9B7B0] leading-relaxed mb-6">
                    {t("noCarsDesc")}
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2 rounded-md bg-[#C9A227] text-xs font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all"
                  >
                    {t("resetAllFilters")}
                  </button>
                </div>
              ) : (
                /* Car Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => {
                    const branchInfo = MOCK_BRANCHES.find((b) => b.id === car.branchId)
                    const totalTripPrice = car.pricePerDay * rentalDays

                    const carName = pick(car.name, locale)
                    const city = pick(branchInfo?.city, locale)
                    const gov = pick(branchInfo?.governorate, locale)
                    const locationLabel = gov && gov !== city ? `${city}, ${gov}` : city

                    const categoryLabel =
                      car.type === "economy"
                        ? t("typeEconomy")
                        : car.type === "sedan"
                        ? t("typeSedan")
                        : car.type === "suv"
                        ? t("typeSuv")
                        : car.type === "luxury"
                        ? t("typeLuxury")
                        : t("typeFamily")

                    const transmissionLabel =
                      car.transmission === "automatic"
                        ? tCommon("transmissionAutomatic")
                        : tCommon("transmissionManual")

                    const fuelLabel =
                      car.fuel === "diesel"
                        ? tCommon("fuelDiesel")
                        : car.fuel === "hybrid"
                        ? tCommon("fuelHybrid")
                        : car.fuel === "electric"
                        ? tCommon("fuelElectric")
                        : tCommon("fuelPetrol")

                    return (
                      <div
                        key={car.id}
                        className="group rounded-xl border border-[#2A2B2E] bg-[#141518] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#C9A227]/60 hover:shadow-xl hover:shadow-[#C9A227]/5"
                      >
                        {/* Top Image Section */}
                        <div className="relative h-48 w-full overflow-hidden bg-[#0B0A09]">
                          <img
                            src={car.image}
                            alt={carName}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-black/30" />

                          {/* Category Tag */}
                          <span className="absolute top-3 end-3 rounded-md bg-[#0B0A09]/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#C9A227] border border-[#C9A227]/30">
                            {categoryLabel}
                          </span>

                          {/* Availability Badge */}
                          <span
                            className={`absolute top-3 start-3 rounded-md px-2 py-0.5 text-[10px] font-bold backdrop-blur-md flex items-center gap-1 border ${
                              car.available
                                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                : "bg-red-950/80 text-red-400 border-red-500/30"
                            }`}
                          >
                            {car.available ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>{t("availableNow")}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>{t("reservedNow")}</span>
                              </>
                            )}
                          </span>

                          {/* Branch indicator */}
                          <div className="absolute bottom-2.5 end-3 flex items-center gap-1.5 text-xs text-[#F4F2EC] drop-shadow-md">
                            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span className="font-medium text-[11px]">
                              {locationLabel}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Car Name & Rating */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-base font-bold text-[#F4F2EC] group-hover:text-[#C9A227] transition-colors leading-snug">
                                {carName}
                              </h3>
                              <div className="flex items-center gap-1 bg-[#0B0A09] px-2 py-0.5 rounded border border-[#2A2B2E] text-xs shrink-0">
                                <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                                <span className="font-bold text-[#F4F2EC]">
                                  {number(car.rating, locale, {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1,
                                  })}
                                </span>
                                <span className="text-[10px] text-[#B9B7B0]">
                                  ({number(car.reviews.length, locale)})
                                </span>
                              </div>
                            </div>

                            {/* Key Specs Row */}
                            <div className="grid grid-cols-3 gap-1.5 py-3 border-y border-[#2A2B2E]/70 my-3 text-[11px] text-[#B9B7B0]">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span>{t("seatsCount", { count: number(car.seats, locale) })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Gauge className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span>{transmissionLabel}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Fuel className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span className="truncate">{fuelLabel}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing & CTA */}
                          <div className="pt-2">
                            <div className="flex items-baseline justify-between mb-4">
                              <div>
                                <span className="text-lg font-black text-[#F4F2EC] font-mono">
                                  {money(car.pricePerDay, locale)}
                                </span>
                                <span className="text-xs text-[#B9B7B0] me-1">{t("perDay")}</span>
                              </div>

                              <div className="text-end text-[11px] text-[#B9B7B0]">
                                <span>{t("totalDuration", { days: rentalDays })}</span>
                                <span className="text-[#C9A227] font-bold font-mono">
                                  {money(totalTripPrice, locale)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href={`/cars/${car.id}`}
                                className="flex items-center justify-center gap-1 py-2.5 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
                              >
                                <span>{t("viewDetails")}</span>
                                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                              </Link>

                              {car.available ? (
                                <Link
                                  href={`/cars/${car.id}`}
                                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-[#C9A227] text-xs font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all active:scale-95 shadow-md shadow-[#C9A227]/10"
                                >
                                  <span>{t("bookNow")}</span>
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="flex items-center justify-center py-2.5 rounded-md bg-[#2A2B2E]/50 text-xs font-semibold text-[#B9B7B0]/50 cursor-not-allowed"
                                >
                                  {t("unavailable")}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
