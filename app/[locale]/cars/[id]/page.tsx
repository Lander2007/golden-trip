"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useApp } from "@/context/AppContext"
import {
  MOCK_BRANCHES,
  MOCK_EXTRAS,
  calculateDaysBetween,
} from "@/lib/mockData"
import { pick } from "@/lib/localized"
import {
  money,
  number,
  date,
  verifiedReviewsCount,
} from "@/lib/format"
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
  Clock,
} from "lucide-react"

export default function CarDetailsPage() {
  const t = useTranslations("carDetails")
  const tCommon = useTranslations("common")
  const locale = useLocale()

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

  // Sync document title to localized car name
  useEffect(() => {
    if (car) {
      const localizedName = pick(car.name, locale)
      const brandName = locale === "ar" ? "جولدن تريب" : "Golden Trip"
      document.title = `${localizedName} — ${brandName}`
    }
  }, [car, locale])

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
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <CarIcon className="w-16 h-16 text-[#C9A227] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#F4F2EC] mb-2">{t("notFoundTitle")}</h2>
          <p className="text-sm text-[#B9B7B0] mb-6">{t("notFoundDesc")}</p>
          <Link
            href="/cars"
            className="px-6 py-2.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-xs"
          >
            {t("backToFleet")}
          </Link>
        </div>
      </ProtectedRoute>
    )
  }

  const carName = pick(car.name, locale)
  const categoryLabel =
    car.type === "economy"
      ? tCommon("categoryEconomy")
      : car.type === "sedan"
      ? tCommon("categorySedan")
      : car.type === "suv"
      ? tCommon("categorySuv")
      : car.type === "luxury"
      ? tCommon("categoryLuxury")
      : tCommon("categoryFamilyVan")

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
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Breadcrumb Bar */}
        <div className="border-b border-[#2A2B2E] bg-[#141518]/60 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center gap-2 text-xs text-[#B9B7B0]">
            <Link href="/" className="hover:text-[#F4F2EC]">{t("breadcrumbHome")}</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-[#B9B7B0]/60" />
            <Link href="/cars" className="hover:text-[#F4F2EC]">{t("breadcrumbFleet")}</Link>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180 text-[#B9B7B0]/60" />
            <span className="text-[#C9A227] font-semibold">{carName}</span>
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
                    alt={carName}
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-4 end-4 flex items-center gap-2">
                    <span className="rounded-md bg-[#0B0A09]/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-[#C9A227] border border-[#C9A227]/30">
                      {t("classBadge", { type: categoryLabel })}
                    </span>
                    <span className="rounded-md bg-[#0B0A09]/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-[#F4F2EC] border border-white/10 font-mono">
                      {t("yearBadge", { year: number(car.year, locale) })}
                    </span>
                  </div>

                  <div className="absolute top-4 start-4">
                    <span
                      className={`rounded-md px-3 py-1 text-xs font-bold backdrop-blur-md border ${
                        car.available
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                          : "bg-red-950/80 text-red-400 border-red-500/30"
                      }`}
                    >
                      {car.available ? tCommon("statusConfirmed") : tCommon("statusCancelled")}
                    </span>
                  </div>

                  {/* Branch tag overlay */}
                  <div className="absolute bottom-4 end-4 flex items-center gap-2 rounded-lg bg-[#0B0A09]/80 backdrop-blur-md px-3.5 py-2 border border-[#2A2B2E]">
                    <MapPin className="w-4 h-4 text-[#C9A227]" />
                    <span className="text-xs font-semibold text-[#F4F2EC]">
                      {t("locationInfo", {
                        city: pick(branchInfo.city, locale),
                        branch: pick(branchInfo.name, locale),
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2B2E] pb-5 mb-5">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#F4F2EC]">
                      {carName}
                    </h1>
                    <p className="text-xs text-[#B9B7B0] mt-1">
                      {t("vehicleCode", {
                        code: car.id.toUpperCase(),
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-[#0B0A09] px-3.5 py-2 rounded-lg border border-[#2A2B2E] shrink-0">
                    <Star className="w-5 h-5 fill-[#C9A227] text-[#C9A227]" />
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-black text-[#F4F2EC]">
                          {number(car.rating, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                        </span>
                        <span className="text-xs text-[#B9B7B0]">{t("ratingOutOf5")}</span>
                      </div>
                      <span className="text-[10px] text-[#B9B7B0]">
                        {verifiedReviewsCount(car.reviews.length, locale)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#B9B7B0] leading-relaxed mb-6">
                  {pick(car.description, locale)}
                </p>

                {/* Key Technical Specifications Grid */}
                <h3 className="text-sm font-bold text-[#F4F2EC] mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C9A227]" />
                  <span>{t("specsTitle")}</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-start">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Users className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("passengerCapacity")}</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">
                      {t("passengersCount", { count: number(car.seats, locale) })}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-start">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Gauge className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("transmission")}</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{transmissionLabel}</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-start">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Fuel className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("fuelType")}</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{fuelLabel}</span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-start">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("luggageCapacity")}</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">
                      {t("luggageCount", { count: number(car.luggage, locale) })}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-start">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <CarIcon className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("doorsCountLabel")}</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">
                      {t("doorsCount", { count: number(car.doors, locale) })}
                    </span>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3 text-start">
                    <div className="flex items-center gap-2 text-xs text-[#B9B7B0] mb-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("modelYear")}</span>
                    </div>
                    <span className="text-sm font-bold text-[#F4F2EC]">{number(car.year, locale)}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <h3 className="text-sm font-bold text-[#F4F2EC] mt-6 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>{t("featuresTitle")}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {car.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-md bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] border border-[#2A2B2E]/70"
                    >
                      <Check className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span>{pick(feature, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Branch Information */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6">
                <h3 className="text-base font-bold text-[#F4F2EC] mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span>{t("branchInfoTitle")}</span>
                </h3>

                <div className="space-y-3 text-xs text-[#B9B7B0]">
                  <p className="text-sm font-bold text-[#F4F2EC]">{pick(branchInfo.name, locale)}</p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>{pick(branchInfo.address, locale)}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                    <span>{t("workingHours", { hours: pick(branchInfo.operatingHours, locale) })}</span>
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 pt-4 border-t border-[#2A2B2E]">
                  <a
                    href={`tel:${branchInfo.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#F4F2EC] hover:border-[#C9A227] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>{t("callBranch", { phone: branchInfo.phone })}</span>
                  </a>
                  <a
                    href="https://wa.me/201006803316"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#C9A227]/10 text-xs font-semibold text-[#C9A227] hover:bg-[#C9A227]/20 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t("whatsAppInquiry")}</span>
                  </a>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#2A2B2E] mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-[#F4F2EC]">
                      {t("reviewsTitle")}
                    </h3>
                    <p className="text-xs text-[#B9B7B0] mt-0.5">
                      {t("reviewsSubtitle")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0B0A09] px-3 py-1.5 rounded-md border border-[#C9A227]/30">
                    <Star className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
                    <span className="text-sm font-bold text-[#C9A227]">
                      {number(car.rating, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </span>
                  </div>
                </div>

                {car.reviews.length === 0 ? (
                  <p className="text-xs text-[#B9B7B0] text-center py-6">
                    {t("noReviewsYet")}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {car.reviews.map((rev) => {
                      const reviewerName = pick(rev.userName, locale)
                      const isMissingTranslation =
                        !rev.comment[locale as "en" | "ar"] ||
                        rev.comment[locale as "en" | "ar"].trim() === ""

                      return (
                        <div
                          key={rev.id}
                          className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-4 text-start"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-xs font-bold text-[#C9A227]">
                                {reviewerName.slice(0, 1)}
                              </div>
                              <span className="text-xs font-bold text-[#F4F2EC]">{reviewerName}</span>
                            </div>
                            <span className="text-[10px] text-[#B9B7B0] font-mono">
                              {date(rev.date, locale)}
                            </span>
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

                          {/* Review Content with UGC fallback */}
                          {isMissingTranslation ? (
                            <div
                              lang={rev.originalLang || "ar"}
                              dir="auto"
                              data-ugc-original="true"
                              className="mt-1"
                            >
                              <span className="inline-block text-[10px] text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded mb-1">
                                {rev.originalLang === "en"
                                  ? tCommon("originalEnglish")
                                  : tCommon("originalArabic")}
                              </span>
                              <p className="text-xs text-[#B9B7B0] leading-relaxed">
                                {rev.comment[rev.originalLang || "ar"] ||
                                  rev.comment.ar ||
                                  rev.comment.en}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-[#B9B7B0] leading-relaxed">
                              {pick(rev.comment, locale)}
                            </p>
                          )}
                        </div>
                      )
                    })}
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
                      {money(car.pricePerDay, locale)}
                    </span>
                    <span className="text-xs text-[#B9B7B0] me-1">{t("perDay")}</span>
                  </div>
                  <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/30">
                    {t("bestPriceGuarantee")}
                  </span>
                </div>

                {/* Booking Options Form */}
                <div className="space-y-4">
                  {/* Pickup & Return Branches */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>{t("pickupBranch")}</span>
                      </label>
                      <select
                        value={pickupBranch}
                        onChange={(e) => setPickupBranch(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                      >
                        {MOCK_BRANCHES.map((b) => (
                          <option key={b.id} value={b.id}>
                            {pick(b.city, locale)} ({pick(b.name, locale)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>{t("returnBranch")}</span>
                      </label>
                      <select
                        value={returnBranch}
                        onChange={(e) => setReturnBranch(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                      >
                        {MOCK_BRANCHES.map((b) => (
                          <option key={b.id} value={b.id}>
                            {pick(b.city, locale)} ({pick(b.name, locale)})
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
                        <span>{t("pickupDate")}</span>
                      </label>
                      <bdi dir="ltr" className="block">
                        <input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none [color-scheme:dark]"
                        />
                      </bdi>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>{t("returnDateWithDays", { days: rentalDays })}</span>
                      </label>
                      <bdi dir="ltr" className="block">
                        <input
                          type="date"
                          value={returnDate}
                          min={pickupDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3 py-2 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none [color-scheme:dark]"
                        />
                      </bdi>
                    </div>
                  </div>

                  {/* Extras / Add-ons Section */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-[#F4F2EC] mb-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>{t("extrasTitle")}</span>
                      </span>
                      <span className="text-[10px] text-[#B9B7B0]">{t("perDaySmall")}</span>
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
                                  {pick(extra.name, locale)}
                                </span>
                                <span className="block text-[10px] text-[#B9B7B0] line-clamp-1">
                                  {pick(extra.description, locale)}
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-[#C9A227] font-mono shrink-0 me-2">
                              +{money(extra.pricePerDay, locale)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Live Cost Calculation Table */}
                  <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-4 space-y-2.5 text-xs pt-3 mt-4">
                    <div className="flex justify-between text-[#B9B7B0]">
                      <span>
                        {t("carRentalSummary", {
                          days: rentalDays,
                          price: money(car.pricePerDay, locale),
                        })}
                      </span>
                      <span className="font-mono text-[#F4F2EC]">{money(baseRentalCost, locale)}</span>
                    </div>

                    {totalExtrasCost > 0 && (
                      <div className="flex justify-between text-[#B9B7B0]">
                        <span>{t("extrasCostSummary", { days: rentalDays })}</span>
                        <span className="font-mono text-[#C9A227]">+{money(totalExtrasCost, locale)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#B9B7B0]">
                      <span>{t("vatSummary")}</span>
                      <span className="font-mono text-[#F4F2EC]">{money(taxAmount, locale)}</span>
                    </div>

                    <div className="border-t border-[#2A2B2E] pt-3 flex justify-between items-baseline font-bold">
                      <span className="text-sm text-[#F4F2EC]">{t("approxTotal")}</span>
                      <div className="text-end">
                        <span className="text-xl font-black text-[#C9A227] font-mono">
                          {money(grandTotal, locale)}
                        </span>
                        <span className="block text-[10px] text-[#B9B7B0] font-normal">
                          {t("inclusiveNote")}
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
                      <span>{t("proceedBooking")}</span>
                      <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full rounded-md bg-[#2A2B2E] py-4 font-bold text-sm text-[#B9B7B0]/60 cursor-not-allowed text-center"
                      >
                        {t("carUnavailableBtn")}
                      </button>
                      <p className="text-[11px] text-[#B9B7B0] text-center">
                        {t("carUnavailableNote")}
                      </p>
                    </div>
                  )}

                  {/* Trust guarantees */}
                  <div className="pt-2 flex items-center justify-around text-[11px] text-[#B9B7B0]/80 border-t border-[#2A2B2E]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("featureFreeCancel")}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("featureInstantPickup")}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("featureSupport247")}</span>
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
