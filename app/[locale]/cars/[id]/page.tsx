"use client"

import React, { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useApp } from "@/context/AppContext"
import {
  MOCK_BRANCHES,
  MOCK_EXTRAS,
  calculateDaysBetween,
  formatEGP,
} from "@/lib/mockData"
import {
  Car as CarIcon,
  Star,
  Users,
  Gauge,
  Fuel,
  Briefcase,
  Calendar,
  MapPin,
  Check,
  ShieldCheck,
  Phone,
  MessageSquare,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  UserCheck,
  Shield,
  Navigation,
} from "lucide-react"

export default function CarDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string

  const {
    getCarById,
    pickupBranch,
    setPickupBranch,
    returnBranch,
    setReturnBranch,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useApp()

  const car = getCarById(carId)

  // Local state for selected extras
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([
    "insurance", // Pre-selected gold insurance for safety demo
  ])

  // Current branch info
  const branchInfo = useMemo(() => {
    return (
      MOCK_BRANCHES.find((b) => b.id === (car?.branchId || pickupBranch)) ||
      MOCK_BRANCHES[0]
    )
  }, [car, pickupBranch])

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    return calculateDaysBetween(pickupDate, returnDate)
  }, [pickupDate, returnDate])

  // Calculate costs
  const baseRentalCost = useMemo(() => {
    if (!car) return 0
    return car.pricePerDay * rentalDays
  }, [car, rentalDays])

  const extrasDailyCost = useMemo(() => {
    return MOCK_EXTRAS.filter((e) => selectedExtraIds.includes(e.id)).reduce(
      (sum, e) => sum + e.pricePerDay,
      0
    )
  }, [selectedExtraIds])

  const totalExtrasCost = useMemo(() => {
    return extrasDailyCost * rentalDays
  }, [extrasDailyCost, rentalDays])

  const subtotal = useMemo(() => {
    return baseRentalCost + totalExtrasCost
  }, [baseRentalCost, totalExtrasCost])

  const taxAmount = useMemo(() => {
    return Math.round(subtotal * 0.14) // 14% Egyptian VAT
  }, [subtotal])

  const grandTotal = useMemo(() => {
    return subtotal + taxAmount
  }, [subtotal, taxAmount])

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleProceedToBooking = () => {
    if (!car) return
    const extrasQuery = encodeURIComponent(JSON.stringify(selectedExtraIds))
    router.push(
      `/booking/${car.id}?pickupBranch=${pickupBranch}&returnBranch=${returnBranch}&pickupDate=${pickupDate}&returnDate=${returnDate}&extras=${extrasQuery}`
    )
  }

  if (!car) {
    return (
      <ProtectedRoute>
        <div dir="rtl" className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <CarIcon className="w-16 h-16 text-[#C9A227] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#F4F2EC] mb-2">لم يتم العثور على السيارة</h2>
          <p className="text-sm text-[#B9B7B0] mb-6">ربما تم تغيير المعرف أو لم تعد السيارة متاحة في النظام.</p>
          <Link
            href="/cars"
            className="px-6 py-2.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-xs"
          >
            العودة لأسطول السيارات
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  const getExtraIcon = (iconName: string) => {
    switch (iconName) {
      case "UserCheck":
        return <UserCheck className="w-4 h-4 text-[#C9A227]" />
      case "Shield":
        return <Shield className="w-4 h-4 text-[#C9A227]" />
      case "Navigation":
        return <Navigation className="w-4 h-4 text-[#C9A227]" />
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
      default:
        return <Sparkles className="w-4 h-4 text-[#C9A227]" />
    }
  }

  return (
    <ProtectedRoute>
      <div dir="rtl" className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Breadcrumb Bar */}
        <div className="border-b border-[#2A2B2E] bg-[#141518]/60 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-[#B9B7B0]">
            <Link href="/" className="hover:text-[#F4F2EC]">الرئيسية</Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-[#B9B7B0]/60" />
            <Link href="/cars" className="hover:text-[#F4F2EC]">أسطول السيارات</Link>
            <ChevronRight className="w-3.5 h-3.5 rotate-180 text-[#B9B7B0]/60" />
            <span className="text-[#C9A227] font-semibold">{car.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7/12: Car Details, Specs, Branches & Reviews */}
            <div className="lg:col-span-7 space-y-8">
              {/* Hero Showcase Image */}
              <div className="relative rounded-2xl border border-[#2A2B2E] bg-[#141518] overflow-hidden shadow-2xl">
                <div className="h-72 sm:h-96 w-full relative">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="rounded-md bg-[#0B0A09]/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-[#C9A227] border border-[#C9A227]/30">
                      فئة {car.type}
                    </span>
                    <span className="rounded-md bg-[#0B0A09]/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-[#F4F2EC] border border-white/10 font-mono">
                      موديل {car.year}
                    </span>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-bold backdrop-blur-md border ${
                        car.available
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : "bg-red-950/80 text-red-400 border-red-500/30"
                      }`}
                    >
                      {car.available ? "متاح للحجز الفوري" : "غير متاح حالياً"}
                    </span>
                  </div>

                  {/* Branch tag overlay */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-[#0B0A09]/80 backdrop-blur-md px-3.5 py-2 border border-[#2A2B2E]">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                    <span className="text-xs font-semibold text-[#F4F2EC]">
                      متواجد بـ {branchInfo.city} - {branchInfo.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2B2E] pb-5 mb-5">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#F4F2EC]">
                      {car.name}
                    </h1>
                    <p className="text-xs text-[#B9B7B0] mt-1">
                      كود المركبة: <span className="font-mono text-[#C9A227]">{car.id.toUpperCase()}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#0B0A09] px-3.5 py-2 rounded-lg border border-[#2A2B2E] shrink-0">
                    <Star className="w-5 h-5 fill-[#C9A227] text-[#C9A227]" />
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-[#F4F2EC]">{car.rating}</span>
                        <span className="text-xs text-[#B9B7B0]">/ 5</span>
                      </div>
                      <span className="text-[10px] text-[#B9B7B0]">({car.reviews.length} تقييم موثق)</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#B9B7B0] leading-relaxed mb-6">
                  {car.description}
                </p>

                {/* Key Technical Specifications Grid */}
                <h3 className="text-sm font-bold text-[#F4F2EC] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>المواصفات الفنية الرئيسية</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-right">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Users className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>سعة الركاب</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{car.seats} ركاب</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-right">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Gauge className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>ناقل الحركة</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{car.transmission}</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-right">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Fuel className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>نوع الوقود</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{car.fuel}</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-right">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>سعة الحقائب</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{car.luggage} حقائب كبيرة</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-right">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <CarIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>عدد الأبواب</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{car.doors} أبواب</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-right">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>سنة الموديل</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{car.year}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <h3 className="text-sm font-bold text-[#F4F2EC] mt-6 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>تجهيزات الراحة والسلامة المضمنة</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {car.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-md bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] border border-[#2A2B2E]/70"
                    >
                      <Check className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Information */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6">
                <h3 className="text-base font-bold text-[#F4F2EC] mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span>معلومات فرع التواجد والاستلام</span>
                </h3>

                <div className="space-y-3 text-xs text-[#B9B7B0]">
                  <p className="text-sm font-bold text-[#F4F2EC]">{branchInfo.name}</p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>{branchInfo.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>مواعيد العمل: {branchInfo.operatingHours}</span>
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-[#2A2B2E]">
                  <a
                    href={`tel:${branchInfo.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#F4F2EC] hover:border-[#C9A227] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>اتصل بالفرع: {branchInfo.phone}</span>
                  </a>
                  <a
                    href="https://wa.me/201006803316"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9A227]/10 text-xs font-semibold text-[#C9A227] hover:bg-[#C9A227]/20 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>استفسار عبر واتساب</span>
                  </a>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#2A2B2E] mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#F4F2EC]">
                      تقييمات وآراء العملاء
                    </h3>
                    <p className="text-xs text-[#B9B7B0] mt-0.5">
                      تقييمات حقيقية من عملاء استأجروا هذه السيارة سابقاً
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0B0A09] px-3 py-1.5 rounded-md border border-[#C9A227]/30">
                    <Star className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                    <span className="text-sm font-bold text-[#C9A227]">{car.rating}</span>
                  </div>
                </div>

                {car.reviews.length === 0 ? (
                  <p className="text-xs text-[#B9B7B0] text-center py-6">
                    لا توجد تقييمات مسجلة لهذه السيارة حتى الآن.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {car.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-4 text-right"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-xs font-bold text-[#C9A227]">
                              {rev.userName.slice(0, 1)}
                            </div>
                            <span className="text-xs font-bold text-[#F4F2EC]">{rev.userName}</span>
                          </div>
                          <span className="text-[10px] text-[#B9B7B0] font-mono">{rev.date}</span>
                        </div>

                        {/* Stars */}
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < rev.rating
                                  ? "fill-[#C9A227] text-[#C9A227]"
                                  : "text-[#2A2B2E]"
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-[#B9B7B0] leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right 5/12: Sticky Booking Calculator Panel */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-[#C9A227] bg-[#141518] p-6 shadow-2xl sticky top-28">
                {/* Header Price Banner */}
                <div className="flex items-baseline justify-between pb-5 border-b border-[#2A2B2E] mb-6">
                  <div>
                    <span className="text-2xl font-black text-[#F4F2EC] font-mono">
                      {formatEGP(car.pricePerDay)}
                    </span>
                    <span className="text-xs text-[#B9B7B0] mr-1">/ يوم</span>
                  </div>
                  <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/30">
                    أفضل سعر مضمون
                  </span>
                </div>

                {/* Booking Options Form */}
                <div className="space-y-4">
                  {/* Pickup & Return Branches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>فرع الاستلام</span>
                      </label>
                      <select
                        value={pickupBranch}
                        onChange={(e) => setPickupBranch(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                      >
                        {MOCK_BRANCHES.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.city} ({b.name.split(" ")[1]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>فرع التسليم</span>
                      </label>
                      <select
                        value={returnBranch}
                        onChange={(e) => setReturnBranch(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                      >
                        {MOCK_BRANCHES.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.city} ({b.name.split(" ")[1]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>تاريخ الاستلام</span>
                      </label>
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none [color-scheme:dark]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>تاريخ التسليم ({rentalDays} {rentalDays === 1 ? "يوم" : "أيام"})</span>
                      </label>
                      <input
                        type="date"
                        value={returnDate}
                        min={pickupDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Extras / Add-ons Section */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[#F4F2EC] mb-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>إضافات وخدمات مميزة (اختياري)</span>
                      </span>
                      <span className="text-[10px] text-[#B9B7B0]">لكل يوم</span>
                    </label>

                    <div className="space-y-2">
                      {MOCK_EXTRAS.map((extra) => {
                        const isChecked = selectedExtraIds.includes(extra.id)
                        return (
                          <div
                            key={extra.id}
                            onClick={() => toggleExtra(extra.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              isChecked
                                ? "border-[#C9A227] bg-[#C9A227]/5"
                                : "border-[#2A2B2E] bg-[#0B0A09] hover:border-[#2A2B2E]/90"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}} // handled by div
                                className="w-4 h-4 rounded border-[#2A2B2E] bg-[#0B0A09] accent-[#C9A227]"
                              />
                              <div>
                                <span className="block text-xs font-bold text-[#F4F2EC]">
                                  {extra.name}
                                </span>
                                <span className="block text-[10px] text-[#B9B7B0] line-clamp-1">
                                  {extra.description}
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-[#C9A227] font-mono shrink-0 mr-2">
                              +{extra.pricePerDay} ج.م
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Live Cost Calculation Table */}
                  <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-4 space-y-2.5 text-xs pt-3 mt-4">
                    <div className="flex justify-between text-[#B9B7B0]">
                      <span>إيجار السيارة ({rentalDays} {rentalDays === 1 ? "يوم" : "أيام"} × {formatEGP(car.pricePerDay)})</span>
                      <span className="font-mono text-[#F4F2EC]">{formatEGP(baseRentalCost)}</span>
                    </div>

                    {totalExtrasCost > 0 && (
                      <div className="flex justify-between text-[#B9B7B0]">
                        <span>تكلفة الإضافات المختارة ({rentalDays} {rentalDays === 1 ? "يوم" : "أيام"})</span>
                        <span className="font-mono text-[#C9A227]">+{formatEGP(totalExtrasCost)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#B9B7B0]">
                      <span>ضريبة القيمة المضافة الحكومية (14%)</span>
                      <span className="font-mono text-[#F4F2EC]">{formatEGP(taxAmount)}</span>
                    </div>

                    <div className="border-t border-[#2A2B2E] pt-3 flex justify-between items-baseline font-bold">
                      <span className="text-sm text-[#F4F2EC]">المبلغ الإجمالي التقريبي:</span>
                      <div className="text-left">
                        <span className="text-xl font-black text-[#C9A227] font-mono">
                          {formatEGP(grandTotal)}
                        </span>
                        <span className="block text-[10px] text-[#B9B7B0] font-normal">
                          شامل الضريبة والمسافات
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  {car.available ? (
                    <button
                      onClick={handleProceedToBooking}
                      className="w-full rounded-md bg-[#C9A227] py-4 font-bold text-sm text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-[#C9A227]/10"
                    >
                      <span>متابعة إتمام الحجز (4 خطوات سريعة)</span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full rounded-md bg-[#2A2B2E] py-4 font-bold text-sm text-[#B9B7B0]/60 cursor-not-allowed text-center"
                      >
                        السيارة غير متاحة حالياً للحجز
                      </button>
                      <p className="text-[11px] text-[#B9B7B0] text-center">
                        يمكنك اختيار سيارة أخرى من نفس الفئة من صفحة الأسطول.
                      </p>
                    </div>
                  )}

                  {/* Trust guarantees */}
                  <div className="pt-2 flex items-center justify-around text-[11px] text-[#B9B7B0]/80 border-t border-[#2A2B2E]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>إلغاء مجاني</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>استلام فوري</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>دعم 24/7</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
