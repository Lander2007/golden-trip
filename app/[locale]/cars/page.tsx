"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useApp } from "@/context/AppContext"
import {
  MOCK_BRANCHES,
  calculateDaysBetween,
  formatEGP,
  Car,
} from "@/lib/mockData"
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
  Shield,
  Sparkles,
} from "lucide-react"

export default function CarsPage() {
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

  // Filter cars
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      // Search query
      if (
        searchQuery.trim() &&
        !car.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) &&
        !car.type.toLowerCase().includes(searchQuery.toLowerCase().trim())
      ) {
        return false
      }

      // Branch filter
      if (selectedBranchFilter !== "all" && car.branchId !== selectedBranchFilter) {
        return false
      }

      // Car type
      if (selectedType !== "all" && car.type !== selectedType) {
        return false
      }

      // Transmission
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
    { id: "all", label: "جميع الفئات" },
    { id: "اقتصادية", label: "اقتصادية" },
    { id: "سيدان", label: "سيدان" },
    { id: "SUV", label: "SUV دفع رباعي" },
    { id: "فاخرة", label: "فاخرة VIP" },
    { id: "عائلية", label: "عائلية وفان" },
  ]

  return (
    <ProtectedRoute>
      <div dir="rtl" className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Top Hero / Welcome Banner */}
        <section className="relative border-b border-[#2A2B2E] bg-gradient-to-b from-[#141518] to-[#0B0A09] pt-10 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3.5 py-1 text-xs font-bold text-[#C9A227] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>أسطول سيارات جولدن تريب المعتمد</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#F4F2EC] tracking-tight">
                  مرحباً بك،{" "}
                  <span className="text-[#C9A227]">
                    {currentUser?.name || "ضيفنا العزيز"}
                  </span>
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#B9B7B0] max-w-2xl leading-relaxed">
                  اختر سيارتك المفضلة من بين أحدث الموديلات المجهزة بالكامل للسفر والرحلات بين كافة محافظات ومطارات مصر.
                </p>
              </div>

              {/* Fast Stats Badges */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3">
                <div className="flex-1 sm:flex-initial rounded-lg border border-[#2A2B2E] bg-[#141518]/80 p-3.5 text-center min-w-[110px]">
                  <span className="block text-2xl font-black text-[#C9A227]">14+</span>
                  <span className="text-xs text-[#B9B7B0]">سيارة متاحة</span>
                </div>
                <div className="flex-1 sm:flex-initial rounded-lg border border-[#2A2B2E] bg-[#141518]/80 p-3.5 text-center min-w-[110px]">
                  <span className="block text-2xl font-black text-[#F4F2EC]">6</span>
                  <span className="text-xs text-[#B9B7B0]">فروع رئيسية</span>
                </div>
                <div className="flex-1 sm:flex-initial rounded-lg border border-[#2A2B2E] bg-[#141518]/80 p-3.5 text-center min-w-[110px]">
                  <span className="block text-2xl font-black text-[#E6CF85]">24/7</span>
                  <span className="text-xs text-[#B9B7B0]">دعم ومساعدة</span>
                </div>
              </div>
            </div>

            {/* Travel Dates & Pickup Selection Bar */}
            <div className="mt-8 rounded-xl border border-[#2A2B2E] bg-[#141518] p-4 sm:p-5 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                {/* Pickup Branch */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>فرع الاستلام</span>
                  </label>
                  <select
                    value={pickupBranch}
                    onChange={(e) => {
                      setPickupBranch(e.target.value)
                      setSelectedBranchFilter(e.target.value)
                    }}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none"
                  >
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#141518]">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Return Branch */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>فرع التسليم</span>
                  </label>
                  <select
                    value={returnBranch}
                    onChange={(e) => setReturnBranch(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none"
                  >
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id} className="bg-[#141518]">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Date */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>تاريخ الاستلام</span>
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none [color-scheme:dark]"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-bold text-[#C9A227] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>تاريخ التسليم ({rentalDays} {rentalDays === 1 ? "يوم" : rentalDays === 2 ? "يومان" : "أيام"})</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] focus:outline-none [color-scheme:dark]"
                  />
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
                    <span>تصفية النتائج</span>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-[#B9B7B0] hover:text-[#C9A227] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط</span>
                  </button>
                </div>

                {/* Search Box */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    البحث بالاسم أو الفئة
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="مثال: تويوتا، BMW، SUV..."
                      className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 pr-9 text-xs text-[#F4F2EC] placeholder-[#B9B7B0]/40 focus:border-[#C9A227] focus:outline-none"
                    />
                    <Search className="absolute top-2.5 right-2.5 w-4 h-4 text-[#B9B7B0]/50" />
                  </div>
                </div>

                {/* Filter by Branch */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    تصفية حسب موقع الفرع
                  </label>
                  <select
                    value={selectedBranchFilter}
                    onChange={(e) => setSelectedBranchFilter(e.target.value)}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                  >
                    <option value="all">جميع الفروع (6 فروع)</option>
                    {MOCK_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.city} - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Car Type */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    فئة السيارة
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
                    ناقل الحركة
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
                      الكل
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTransmission("أوتوماتيك")}
                      className={`py-1.5 rounded text-xs font-medium text-center transition-all ${
                        selectedTransmission === "أوتوماتيك"
                          ? "bg-[#C9A227] text-[#0B0A09] font-bold"
                          : "bg-[#0B0A09] text-[#B9B7B0] border border-[#2A2B2E]"
                      }`}
                    >
                      أوتوماتيك
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTransmission("يدوي")}
                      className={`py-1.5 rounded text-xs font-medium text-center transition-all ${
                        selectedTransmission === "يدوي"
                          ? "bg-[#C9A227] text-[#0B0A09] font-bold"
                          : "bg-[#0B0A09] text-[#B9B7B0] border border-[#2A2B2E]"
                      }`}
                    >
                      يدوي
                    </button>
                  </div>
                </div>

                {/* Max Price Range */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-[#B9B7B0]">الحد الأقصى للسعر / يوم</span>
                    <span className="text-[#C9A227] font-mono">{formatEGP(maxPrice)}</span>
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
                    <span>850 ج.م</span>
                    <span>15,000 ج.م</span>
                  </div>
                </div>

                {/* Availability Only Toggle */}
                <div className="pt-2 border-t border-[#2A2B2E]">
                  <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-[#B9B7B0]">
                    <span>السيارات المتاحة فقط</span>
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
                  تم العثور على{" "}
                  <strong className="text-[#C9A227] font-bold">{filteredCars.length}</strong>{" "}
                  سيارة جاهزة للحجز
                  {selectedBranchFilter !== "all" && (
                    <span>
                      {" "}في فرع {MOCK_BRANCHES.find((b) => b.id === selectedBranchFilter)?.city}
                    </span>
                  )}
                </p>

                <div className="text-xs text-[#B9B7B0]/80">
                  مدة الرحلة المحتسبة: <span className="font-bold text-[#F4F2EC]">{rentalDays} {rentalDays === 1 ? "يوم" : "أيام"}</span>
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
                  <h3 className="text-xl font-bold text-[#F4F2EC] mb-2">
                    لا توجد سيارات مطابقة لبحثك
                  </h3>
                  <p className="text-sm text-[#B9B7B0] mb-6 leading-relaxed">
                    لم نتمكن من العثور على سيارات تطابق الفلاتر المحددة. جرب توسيع نطاق السعر أو تغيير الفرع أو فئة السيارة.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-xs hover:bg-[#E6CF85] transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>إعادة ضبط جميع الفلاتر</span>
                  </button>
                </div>
              ) : (
                /* Cars Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCars.map((car) => {
                    const branchInfo = MOCK_BRANCHES.find((b) => b.id === car.branchId)
                    const totalTripPrice = car.pricePerDay * rentalDays

                    return (
                      <div
                        key={car.id}
                        className="group rounded-xl border border-[#2A2B2E] bg-[#141518] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#C9A227]/60 hover:shadow-xl hover:shadow-[#C9A227]/5"
                      >
                        {/* Top Image Section */}
                        <div className="relative h-48 w-full overflow-hidden bg-[#0B0A09]">
                          <img
                            src={car.image}
                            alt={car.name}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-black/30" />

                          {/* Category Tag */}
                          <span className="absolute top-3 right-3 rounded-md bg-[#0B0A09]/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-[#C9A227] border border-[#C9A227]/30">
                            {car.type}
                          </span>

                          {/* Availability Badge */}
                          <span
                            className={`absolute top-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-bold backdrop-blur-md flex items-center gap-1 border ${
                              car.available
                                ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                                : "bg-red-950/80 text-red-400 border-red-500/30"
                            }`}
                          >
                            {car.available ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>متاح الآن</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                <span>محجوز حالياً</span>
                              </>
                            )}
                          </span>

                          {/* Branch indicator */}
                          <div className="absolute bottom-2.5 right-3 flex items-center gap-1.5 text-xs text-[#F4F2EC] drop-shadow-md">
                            <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                            <span className="font-medium text-[11px]">
                              {branchInfo?.city} - {branchInfo?.name.split(" ")[1]}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Car Name & Rating */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-base font-bold text-[#F4F2EC] group-hover:text-[#C9A227] transition-colors leading-snug">
                                {car.name}
                              </h3>
                              <div className="flex items-center gap-1 bg-[#0B0A09] px-2 py-0.5 rounded border border-[#2A2B2E] text-xs shrink-0">
                                <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                                <span className="font-bold text-[#F4F2EC]">{car.rating}</span>
                                <span className="text-[10px] text-[#B9B7B0]">({car.reviews.length})</span>
                              </div>
                            </div>

                            {/* Key Specs Row */}
                            <div className="grid grid-cols-3 gap-1.5 py-3 border-y border-[#2A2B2E]/70 my-3 text-[11px] text-[#B9B7B0]">
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span>{car.seats} مقاعد</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Gauge className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span>{car.transmission}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Fuel className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span className="truncate">{car.fuel.split(" ")[0]}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing & CTA */}
                          <div className="pt-2">
                            <div className="flex items-baseline justify-between mb-4">
                              <div>
                                <span className="text-lg font-black text-[#F4F2EC] font-mono">
                                  {formatEGP(car.pricePerDay)}
                                </span>
                                <span className="text-xs text-[#B9B7B0] mr-1">/ يوم</span>
                              </div>

                              <div className="text-left text-[11px] text-[#B9B7B0]">
                                <span>إجمالي {rentalDays} {rentalDays === 1 ? "يوم" : "أيام"}: </span>
                                <span className="text-[#C9A227] font-bold font-mono">
                                  {formatEGP(totalTripPrice)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href={`/cars/${car.id}`}
                                className="flex items-center justify-center gap-1 py-2.5 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
                              >
                                <span>التفاصيل</span>
                                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                              </Link>

                              {car.available ? (
                                <Link
                                  href={`/cars/${car.id}`}
                                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-md bg-[#C9A227] text-xs font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all active:scale-95 shadow-md shadow-[#C9A227]/10"
                                >
                                  <span>احجز الآن</span>
                                </Link>
                              ) : (
                                <button
                                  disabled
                                  className="flex items-center justify-center py-2.5 rounded-md bg-[#2A2B2E]/50 text-xs font-semibold text-[#B9B7B0]/50 cursor-not-allowed"
                                >
                                  غير متاح
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
