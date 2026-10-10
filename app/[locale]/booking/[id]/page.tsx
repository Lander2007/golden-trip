"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
import { money, number, date } from "@/lib/format"
import { transliterateArabicNameToEnglish } from "@/lib/translate"
import {
  Car,
  CheckCircle2,
  Calendar,
  MapPin,
  CreditCard,
  Banknote,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
} from "lucide-react"

function BookingCheckoutContent() {
  const t = useTranslations("directBooking")
  const tCommon = useTranslations("common")
  const locale = useLocale()

  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const carId = params.id as string

  const {
    getCarById,
    currentUser,
    createBooking,
    pickupBranch: defaultPickupBranch,
    returnBranch: defaultReturnBranch,
    pickupDate: defaultPickupDate,
    returnDate: defaultReturnDate,
  } = useApp()

  const car = getCarById(carId)

  // Sync document title to localized vehicle name
  useEffect(() => {
    if (car) {
      document.title = `${t("portalHeader")} — ${pick(car.name, locale)}`
    }
  }, [car, locale, t])

  // Wizard Step: 1 = Summary, 2 = Customer Info, 3 = Payment, 4 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Booking Parameters (from query or global context)
  const pickupBranch = searchParams.get("pickupBranch") || defaultPickupBranch
  const returnBranch = searchParams.get("returnBranch") || defaultReturnBranch
  const pickupDate = searchParams.get("pickupDate") || defaultPickupDate
  const returnDate = searchParams.get("returnDate") || defaultReturnDate

  // Parse extras from URL query
  const selectedExtraIds: string[] = useMemo(() => {
    try {
      const query = searchParams.get("extras")
      if (query) return JSON.parse(decodeURIComponent(query))
      return ["insurance"]
    } catch {
      return ["insurance"]
    }
  }, [searchParams])

  // Step 2 Form States (Pre-filled with logged-in user if available)
  const initialUserName = currentUser
    ? typeof currentUser.name === "object"
      ? pick(currentUser.name, locale)
      : currentUser.name
    : locale === "en"
    ? "Ahmed Mahmoud"
    : "أحمد محمود"

  const [customerName, setCustomerName] = useState(initialUserName)
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "01012345678")
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "demo@example.com")
  const [nationalId, setNationalId] = useState("29508140102345")
  const [licenseNumber, setLicenseNumber] = useState("DL-EGY-89420")
  const [notes, setNotes] = useState("")
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({})

  // Step 3 Payment State
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online")
  const [cardNumber, setCardNumber] = useState("4124 •••• •••• 9021")
  const [cardExpiry, setCardExpiry] = useState("09/28")
  const [cardCvv, setCardCvv] = useState("384")
  const [cardHolder, setCardHolder] = useState(
    locale === "en" ? "AHMED MAHMOUD" : "أحمد محمود"
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>("")

  // Calculations
  const rentalDays = useMemo(() => {
    return calculateDaysBetween(pickupDate, returnDate)
  }, [pickupDate, returnDate])

  const pickupBranchObj = useMemo(() => {
    return MOCK_BRANCHES.find((b) => b.id === pickupBranch) || MOCK_BRANCHES[0]
  }, [pickupBranch])

  const returnBranchObj = useMemo(() => {
    return MOCK_BRANCHES.find((b) => b.id === returnBranch) || MOCK_BRANCHES[0]
  }, [returnBranch])

  const selectedExtrasObj = useMemo(() => {
    return MOCK_EXTRAS.filter((e) => selectedExtraIds.includes(e.id))
  }, [selectedExtraIds])

  const baseRentalCost = useMemo(() => {
    if (!car) return 0
    return car.pricePerDay * rentalDays
  }, [car, rentalDays])

  const totalExtrasCost = useMemo(() => {
    const daily = selectedExtrasObj.reduce((sum, e) => sum + e.pricePerDay, 0)
    return daily * rentalDays
  }, [selectedExtrasObj, rentalDays])

  const subtotal = useMemo(() => {
    return baseRentalCost + totalExtrasCost
  }, [baseRentalCost, totalExtrasCost])

  const taxAmount = useMemo(() => {
    return Math.round(subtotal * 0.14) // 14% Egyptian VAT
  }, [subtotal])

  const grandTotal = useMemo(() => {
    return subtotal + taxAmount
  }, [subtotal, taxAmount])

  // Step 2 Form Validation
  const handleProceedFromStep2 = () => {
    const errors: Record<string, string> = {}
    const isEn = locale === "en"

    if (!customerName.trim()) {
      errors.name = isEn ? "Please enter your full name" : "يرجى إدخال الاسم بالكامل"
    }
    if (!customerPhone.trim()) {
      errors.phone = isEn ? "Please enter your phone number" : "يرجى إدخال رقم الهاتف"
    }
    if (!customerEmail.trim()) {
      errors.email = isEn ? "Please enter your email address" : "يرجى إدخال البريد الإلكتروني"
    }
    if (!nationalId.trim()) {
      errors.nationalId = isEn ? "Please enter national ID or passport" : "يرجى إدخال الرقم القومي أو جواز السفر"
    }
    if (!licenseNumber.trim()) {
      errors.license = isEn ? "Please enter driver license number" : "يرجى إدخال رقم رخصة القيادة"
    }

    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors)
      return
    }

    setStep2Errors({})
    setCurrentStep(3)
  }

  // Step 3 Submission Handler
  const handleConfirmBooking = async () => {
    if (!car) return
    setIsSubmitting(true)

    try {
      const created = await createBooking({
        carId: car.id,
        carName: car.name,
        carImage: car.image,
        carType: car.type,
        branchId: pickupBranch,
        branchName: pickupBranchObj.name,
        returnBranchId: returnBranch,
        returnBranchName: returnBranchObj.name,
        pickupDate,
        returnDate,
        totalDays: rentalDays,
        pricePerDay: car.pricePerDay,
        selectedExtras: selectedExtrasObj.map((e) => ({
          id: e.id,
          name: e.name,
          pricePerDay: e.pricePerDay,
        })),
        extrasTotal: totalExtrasCost,
        subtotal,
        tax: taxAmount,
        totalPrice: grandTotal,
        customerName: {
          en: transliterateArabicNameToEnglish(customerName),
          ar: customerName,
        },
        customerEmail,
        customerPhone,
        nationalId,
        paymentMethod,
        notes: notes.trim()
          ? {
              en: notes.trim(),
              ar: notes.trim(),
            }
          : undefined,
      })

      setConfirmedBookingId(created.id)
      setCurrentStep(4)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!car) {
    return (
      <ProtectedRoute>
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <Car className="w-16 h-16 text-[#C9A227] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#F4F2EC] mb-2">{t("carNotAvailable")}</h2>
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

  const stepsList = [
    { num: 1, title: t("stepDetails") },
    { num: 2, title: t("stepCustomer") },
    { num: 3, title: t("stepPayment") },
    { num: 4, title: t("stepConfirm") },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Stepper Header Bar */}
        <section className="border-b border-[#2A2B2E] bg-[#141518]/90 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <div className="text-center mb-6">
              <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-3 py-1 rounded-full border border-[#C9A227]/20">
                {t("portalHeader")}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#F4F2EC] mt-2">
                {t("completeBookingFor", { name: carName })}
              </h1>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
              <div className="absolute top-1/2 -translate-y-1/2 start-8 end-8 h-0.5 bg-[#2A2B2E] z-0" />
              {stepsList.map((st) => {
                const isPassed = currentStep > st.num
                const isCurrent = currentStep === st.num

                return (
                  <div key={st.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        isPassed
                          ? "bg-[#C9A227] text-[#0B0A09] shadow-md shadow-[#C9A227]/20"
                          : isCurrent
                          ? "bg-[#C9A227] text-[#0B0A09] ring-4 ring-[#C9A227]/20 font-black"
                          : "bg-[#141518] text-[#B9B7B0] border border-[#2A2B2E]"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : number(st.num, locale)}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                        isCurrent ? "text-[#C9A227] font-bold" : "text-[#B9B7B0]"
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Content Body */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-8">
          {/* STEP 1: BOOKING DETAILS SUMMARY */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Selected Car Highlight */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-5 flex flex-col sm:flex-row items-center gap-5">
                <img
                  src={car.image}
                  alt={carName}
                  className="w-full sm:w-48 h-32 rounded-lg object-cover bg-[#0B0A09]"
                />
                <div className="flex-1 text-start w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/30">
                      {t("categoryBadge", { type: categoryLabel })}
                    </span>
                    <span className="text-[11px] text-[#B9B7B0]">
                      {t("modelBadge", { year: number(car.year, locale) })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F4F2EC]">{carName}</h3>
                  <p className="text-xs text-[#B9B7B0] mt-1 line-clamp-1">
                    {pick(car.description, locale)}
                  </p>
                  <div className="mt-3 flex items-baseline gap-2 font-mono">
                    <span className="text-lg font-black text-[#C9A227]">
                      {money(car.pricePerDay, locale)}
                    </span>
                    <span className="text-xs text-[#B9B7B0]">{t("perDay")}</span>
                  </div>
                </div>
              </div>

              {/* Trip Parameters & Branch Details */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6 space-y-4">
                <h3 className="text-base font-bold text-[#F4F2EC] border-b border-[#2A2B2E] pb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span>{t("routeDetailsTitle")}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-[#C9A227] block">
                      {t("pickupBranch")}
                    </span>
                    <p className="text-sm font-bold text-[#F4F2EC]">
                      {pick(pickupBranchObj.name, locale)}
                    </p>
                    <p className="text-[#B9B7B0]">{pick(pickupBranchObj.address, locale)}</p>
                    <p className="text-[11px] text-[#B9B7B0] pt-1">
                      {t("pickupDateLabel")}{date(pickupDate, locale)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-[#C9A227] block">
                      {t("returnBranch")}
                    </span>
                    <p className="text-sm font-bold text-[#F4F2EC]">
                      {pick(returnBranchObj.name, locale)}
                    </p>
                    <p className="text-[#B9B7B0]">{pick(returnBranchObj.address, locale)}</p>
                    <p className="text-[11px] text-[#B9B7B0] pt-1">
                      {t("returnDateLabel")}{date(returnDate, locale)}
                    </p>
                  </div>
                </div>

                {/* Selected Extras */}
                {selectedExtrasObj.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#B9B7B0] mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("selectedExtrasTitle")}</span>
                    </h4>
                    <div className="space-y-1.5">
                      {selectedExtrasObj.map((extra) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between rounded-md bg-[#0B0A09] px-3 py-2 text-xs border border-[#2A2B2E]/60"
                        >
                          <span className="text-[#F4F2EC]">{pick(extra.name, locale)}</span>
                          <span className="font-mono text-[#C9A227]">
                            {t("extraPerDayFormat", {
                              price: money(extra.pricePerDay, locale),
                              total: money(extra.pricePerDay * rentalDays, locale),
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Itemization */}
                <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-4 space-y-2 text-xs pt-3">
                  <div className="flex justify-between text-[#B9B7B0]">
                    <span>
                      {t("baseRentSummary", {
                        days: rentalDays,
                        price: money(car.pricePerDay, locale),
                      })}
                    </span>
                    <span className="font-mono text-[#F4F2EC]">
                      {money(baseRentalCost, locale)}
                    </span>
                  </div>
                  {totalExtrasCost > 0 && (
                    <div className="flex justify-between text-[#B9B7B0]">
                      <span>{t("extrasCostSummary", { days: rentalDays })}</span>
                      <span className="font-mono text-[#C9A227]">
                        +{money(totalExtrasCost, locale)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#B9B7B0]">
                    <span>{t("vatSummary")}</span>
                    <span className="font-mono text-[#F4F2EC]">{money(taxAmount, locale)}</span>
                  </div>
                  <div className="border-t border-[#2A2B2E] pt-3 flex justify-between items-baseline font-bold">
                    <span className="text-sm text-[#F4F2EC]">{t("totalDue")}</span>
                    <span className="text-xl font-black text-[#C9A227] font-mono">
                      {money(grandTotal, locale)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-between items-center pt-2">
                <Link
                  href={`/cars/${car.id}`}
                  className="px-5 py-3 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] hover:border-[#C9A227] transition-all"
                >
                  {t("backToCarDetails")}
                </Link>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-sm hover:bg-[#E6CF85] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/10"
                >
                  <span>{t("continueToCustomerStep")}</span>
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CUSTOMER INFORMATION */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6 sm:p-8">
                <div className="border-b border-[#2A2B2E] pb-4 mb-6">
                  <span className="text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/20">
                    {t("autoFillBadge")}
                  </span>
                  <h2 className="text-xl font-bold text-[#F4F2EC] mt-2">
                    {t("personalDataTitle")}
                  </h2>
                  <p className="text-xs text-[#B9B7B0] mt-1">
                    {t("personalDataSubtitle")}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        {t("fullNameLabel")}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pe-10 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                        />
                        <User className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.name && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        {t("phoneLabel")}
                      </label>
                      <div className="relative">
                        <bdi dir="ltr" className="block">
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pe-10 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                          />
                        </bdi>
                        <Phone className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.phone && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                      {t("emailLabel")}
                    </label>
                    <div className="relative">
                      <bdi dir="ltr" className="block">
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pe-10 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                        />
                      </bdi>
                      <Mail className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60" />
                    </div>
                    {step2Errors.email && (
                      <p className="text-xs text-red-400 mt-1">{step2Errors.email}</p>
                    )}
                  </div>

                  {/* National ID & License */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        {t("idNumberLabel")}
                      </label>
                      <div className="relative">
                        <bdi dir="ltr" className="block">
                          <input
                            type="text"
                            value={nationalId}
                            onChange={(e) => setNationalId(e.target.value)}
                            placeholder="29508140102345"
                            className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pe-10 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                          />
                        </bdi>
                        <FileText className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.nationalId && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.nationalId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        {t("licenseNumberLabel")}
                      </label>
                      <div className="relative">
                        <bdi dir="ltr" className="block">
                          <input
                            type="text"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            placeholder="DL-EGY-89420"
                            className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pe-10 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                          />
                        </bdi>
                        <ShieldCheck className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.license && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.license}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                      {t("deliveryNotesLabel")}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-2.5 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] transition-all"
                >
                  {t("backToBookingDetails")}
                </button>

                <button
                  type="button"
                  onClick={handleProceedFromStep2}
                  className="px-8 py-3.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-sm hover:bg-[#E6CF85] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/10"
                >
                  <span>{t("continueToPaymentStep")}</span>
                  <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6 sm:p-8">
                <div className="border-b border-[#2A2B2E] pb-4 mb-6">
                  <h2 className="text-xl font-bold text-[#F4F2EC]">
                    {t("choosePaymentTitle")}
                  </h2>
                  <p className="text-xs text-[#B9B7B0] mt-1">
                    {t("totalDueSubtitle", { amount: money(grandTotal, locale) })}
                  </p>
                </div>

                {/* Payment Option Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Online Card Option */}
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-[#C9A227] bg-[#C9A227]/10 shadow-md shadow-[#C9A227]/10"
                        : "border-[#2A2B2E] bg-[#0B0A09] hover:border-[#2A2B2E]/90"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#F4F2EC]">
                        <CreditCard className="w-5 h-5 text-[#C9A227]" />
                        <span>{t("onlineCardTitle")}</span>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="accent-[#C9A227]"
                      />
                    </div>
                    <p className="text-xs text-[#B9B7B0] leading-relaxed">
                      {t("onlineCardDesc")}
                    </p>
                  </div>

                  {/* Cash Option */}
                  <div
                    onClick={() => setPaymentMethod("cash")}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "cash"
                        ? "border-[#C9A227] bg-[#C9A227]/10 shadow-md shadow-[#C9A227]/10"
                        : "border-[#2A2B2E] bg-[#0B0A09] hover:border-[#2A2B2E]/90"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#F4F2EC]">
                        <Banknote className="w-5 h-5 text-[#C9A227]" />
                        <span>{t("cashOnPickupTitle")}</span>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="accent-[#C9A227]"
                      />
                    </div>
                    <p className="text-xs text-[#B9B7B0] leading-relaxed">
                      {t("cashOnPickupDesc")}
                    </p>
                  </div>
                </div>

                {/* Conditional Card Form */}
                {paymentMethod === "online" && (
                  <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-5 sm:p-6 space-y-4">
                    {/* Simulated Credit Card Visual */}
                    <div className="rounded-xl bg-gradient-to-tr from-[#1b1916] via-[#2a2414] to-[#141518] p-5 border border-[#C9A227]/40 shadow-xl max-w-sm mx-auto mb-4 text-start">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-[#C9A227] tracking-widest uppercase">
                          Golden Card VIP
                        </span>
                        <div className="w-8 h-6 bg-[#C9A227]/30 rounded border border-[#C9A227]/50" />
                      </div>
                      <div className="text-lg font-mono tracking-widest text-[#F4F2EC] mb-4 text-center">
                        <bdi dir="ltr">{cardNumber}</bdi>
                      </div>
                      <div className="flex justify-between items-end text-xs text-[#B9B7B0]">
                        <div>
                          <span className="block text-[9px] uppercase">{t("cardHolderLabel")}</span>
                          <span className="font-bold text-[#F4F2EC] truncate max-w-[140px] block">
                            {cardHolder}
                          </span>
                        </div>
                        <div className="text-end font-mono">
                          <span className="block text-[9px] uppercase">{t("cardExpiryLabel")}</span>
                          <span className="text-[#F4F2EC]">
                            <bdi dir="ltr">{cardExpiry}</bdi>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#B9B7B0] mb-1">
                          {t("cardNumberLabel")}
                        </label>
                        <bdi dir="ltr" className="block">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full rounded-md border border-[#2A2B2E] bg-[#141518] px-3.5 py-2.5 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                          />
                        </bdi>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#B9B7B0] mb-1">
                            {t("cardExpiryInputLabel")}
                          </label>
                          <bdi dir="ltr" className="block">
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full rounded-md border border-[#2A2B2E] bg-[#141518] px-3.5 py-2.5 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                            />
                          </bdi>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#B9B7B0] mb-1">
                            {t("cardCvvLabel")}
                          </label>
                          <bdi dir="ltr" className="block">
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="•••"
                              className="w-full rounded-md border border-[#2A2B2E] bg-[#141518] px-3.5 py-2.5 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                            />
                          </bdi>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#B9B7B0] pt-2 border-t border-[#2A2B2E]">
                      <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>{t("mockCardNote")}</span>
                    </div>
                  </div>
                )}

                {/* Cash Note */}
                {paymentMethod === "cash" && (
                  <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-5 text-xs text-[#B9B7B0] space-y-2">
                    <p className="font-bold text-[#F4F2EC]">{t("cashTermsTitle")}</p>
                    <p>{t("cashTerm1", { amount: money(grandTotal, locale) })}</p>
                    <p>{t("cashTerm2")}</p>
                    <p>{t("cashTerm3")}</p>
                  </div>
                )}
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] transition-all"
                >
                  {t("backToCustomerData")}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-sm hover:bg-[#E6CF85] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0B0A09] border-t-transparent rounded-full animate-spin" />
                      <span>{t("processingBooking")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("confirmBookingNow")}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION SUCCESS */}
          {currentStep === 4 && (
            <div className="rounded-2xl border-2 border-[#C9A227] bg-[#141518] p-6 sm:p-10 text-center animate-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
              {/* Background celebration glow */}
              <div className="absolute top-0 end-1/2 translate-x-1/2 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Big Success Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] text-[#C9A227] shadow-xl shadow-[#C9A227]/20 mb-6">
                  <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
                </div>

                <span className="text-xs font-bold text-[#C9A227] tracking-widest uppercase">
                  {t("bookingSuccessBadge")}
                </span>
                <h2 className="mt-2 text-2xl sm:text-4xl font-black text-[#F4F2EC]">
                  {t("thankYouTitle")}
                </h2>
                <p className="mt-2 text-sm text-[#B9B7B0] max-w-md mx-auto leading-relaxed">
                  {t("bookingSuccessDesc")}
                </p>

                {/* Booking Code Banner */}
                <div className="my-6 inline-block rounded-xl border border-[#C9A227]/50 bg-[#0B0A09] px-6 py-4 shadow-inner">
                  <span className="block text-xs text-[#B9B7B0] mb-1">
                    {t("referenceNumberLabel")}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#C9A227] font-mono tracking-wider">
                    <bdi dir="ltr">{confirmedBookingId}</bdi>
                  </span>
                </div>

                {/* Summary Voucher Card */}
                <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-5 text-start text-xs max-w-xl mx-auto space-y-3 mb-8">
                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">{t("reservedCarLabel")}</span>
                    <span className="font-bold text-[#F4F2EC] text-sm">{carName}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">{t("pickupBranchLabel")}</span>
                    <span className="font-bold text-[#F4F2EC]">
                      {pick(pickupBranchObj.name, locale)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">{t("travelDatesLabel")}</span>
                    <span className="font-mono text-[#F4F2EC]">
                      {t("datesRangeWithDays", {
                        pickup: date(pickupDate, locale),
                        returnDate: date(returnDate, locale),
                        days: rentalDays,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">{t("paymentMethodLabel")}</span>
                    <span className="font-bold text-[#C9A227]">
                      {paymentMethod === "online"
                        ? tCommon("onlinePayment")
                        : tCommon("cashPayment")}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1 font-bold">
                    <span className="text-sm text-[#F4F2EC]">{t("totalAmountLabel")}</span>
                    <span className="text-lg font-black text-[#C9A227] font-mono">
                      {money(grandTotal, locale)}
                    </span>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/my-bookings"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#C9A227] px-8 py-3.5 text-sm font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all shadow-lg shadow-[#C9A227]/20"
                  >
                    <span>{t("viewInMyBookings")}</span>
                    <ArrowRight className="w-4 h-4 rtl:-scale-x-100" />
                  </Link>

                  <Link
                    href="/cars"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#2A2B2E] px-6 py-3.5 text-sm font-semibold text-[#F4F2EC] hover:border-[#C9A227] transition-all"
                  >
                    <span>{t("browseOtherCars")}</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0A09] flex items-center justify-center text-[#C9A227]">
          Loading...
        </div>
      }
    >
      <BookingCheckoutContent />
    </Suspense>
  )
}
