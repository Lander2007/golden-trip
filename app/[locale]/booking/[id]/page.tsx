"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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
  Car,
  CheckCircle2,
  Calendar,
  MapPin,
  CreditCard,
  Banknote,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Printer,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react"

export default function BookingCheckoutPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const carId = params.id as string

  const {
    getCarById,
    currentUser,
    createBooking,
    pickupBranch: globalPickupBranch,
    returnBranch: globalReturnBranch,
    pickupDate: globalPickupDate,
    returnDate: globalReturnDate,
  } = useApp()

  const car = getCarById(carId)

  // Current step state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>("")

  // URL parameters or fallback to context defaults
  const paramPickupBranch = searchParams.get("pickupBranch") || globalPickupBranch
  const paramReturnBranch = searchParams.get("returnBranch") || globalReturnBranch
  const paramPickupDate = searchParams.get("pickupDate") || globalPickupDate
  const paramReturnDate = searchParams.get("returnDate") || globalReturnDate

  let parsedExtras: string[] = ["insurance"]
  try {
    const rawExtras = searchParams.get("extras")
    if (rawExtras) {
      parsedExtras = JSON.parse(decodeURIComponent(rawExtras))
    }
  } catch {
    parsedExtras = ["insurance"]
  }

  // Booking config state
  const [pickupBranch, setPickupBranch] = useState(paramPickupBranch)
  const [returnBranch, setReturnBranch] = useState(paramReturnBranch)
  const [pickupDate, setPickupDate] = useState(paramPickupDate)
  const [returnDate, setReturnDate] = useState(paramReturnDate)
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>(parsedExtras)

  // Step 2 Customer form state (prefilled from fake account)
  const [customerName, setCustomerName] = useState(currentUser?.name || "أحمد محمود النجار")
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "demo@example.com")
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "010 1234 5678")
  const [nationalId, setNationalId] = useState(currentUser?.nationalId || "29508140102345")
  const [licenseNumber, setLicenseNumber] = useState(currentUser?.licenseNumber || "DL-EGY-89420")
  const [notes, setNotes] = useState("يرجى تجهيز السيارة في بهو الاستلام بالموعد المحدد")
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({})

  // Step 3 Payment method state
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cash">("online")
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444")
  const [cardHolder, setCardHolder] = useState(customerName)
  const [cardExpiry, setCardExpiry] = useState("12/28")
  const [cardCvv, setCardCvv] = useState("321")

  // Update cardHolder if name changes
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name)
      setCustomerEmail(currentUser.email)
      setCustomerPhone(currentUser.phone)
      setNationalId(currentUser.nationalId || "29508140102345")
      setLicenseNumber(currentUser.licenseNumber || "DL-EGY-89420")
      setCardHolder(currentUser.name)
    }
  }, [currentUser])

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

  const baseRentalCost = useMemo(() => {
    if (!car) return 0
    return car.pricePerDay * rentalDays
  }, [car, rentalDays])

  const selectedExtrasObj = useMemo(() => {
    return MOCK_EXTRAS.filter((e) => selectedExtraIds.includes(e.id)).map((e) => ({
      id: e.id,
      name: e.name,
      pricePerDay: e.pricePerDay,
    }))
  }, [selectedExtraIds])

  const totalExtrasDaily = useMemo(() => {
    return selectedExtrasObj.reduce((sum, e) => sum + e.pricePerDay, 0)
  }, [selectedExtrasObj])

  const totalExtrasCost = useMemo(() => {
    return totalExtrasDaily * rentalDays
  }, [totalExtrasDaily, rentalDays])

  const subtotal = useMemo(() => {
    return baseRentalCost + totalExtrasCost
  }, [baseRentalCost, totalExtrasCost])

  const taxAmount = useMemo(() => {
    return Math.round(subtotal * 0.14)
  }, [subtotal])

  const grandTotal = useMemo(() => {
    return subtotal + taxAmount
  }, [subtotal, taxAmount])

  // Validation for Step 2
  const handleProceedFromStep2 = () => {
    const errs: Record<string, string> = {}
    if (!customerName.trim()) errs.name = "الاسم بالكامل مطلوب."
    if (!customerEmail.trim() || !customerEmail.includes("@")) errs.email = "بريد إلكتروني غير صالح."
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, "").length < 8)
      errs.phone = "رقم هاتف صحيح مطلوب للتواصل."
    if (!nationalId.trim() || nationalId.length < 10)
      errs.nationalId = "يرجى إدخال الرقم القومي أو جواز السفر."
    if (!licenseNumber.trim()) errs.license = "رقم رخصة القيادة مطلوب."

    if (Object.keys(errs).length > 0) {
      setStep2Errors(errs)
      return
    }

    setStep2Errors({})
    setCurrentStep(3)
  }

  // Final submit at Step 3
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
        selectedExtras: selectedExtrasObj,
        extrasTotal: totalExtrasCost,
        subtotal,
        tax: taxAmount,
        totalPrice: grandTotal,
        customerName,
        customerEmail,
        customerPhone,
        nationalId,
        paymentMethod,
        notes,
      })

      setConfirmedBookingId(created.id)
      setCurrentStep(4)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!car) {
    return (
      <ProtectedRoute>
        <div dir="rtl" className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <Car className="w-16 h-16 text-[#C9A227] mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-[#F4F2EC] mb-2">السيارة غير متوفرة</h2>
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

  const stepsList = [
    { num: 1, title: "تفاصيل الحجز" },
    { num: 2, title: "بيانات العميل" },
    { num: 3, title: "طريقة الدفع" },
    { num: 4, title: "تأكيد الحجز" },
  ]

  return (
    <ProtectedRoute>
      <div dir="rtl" className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Stepper Header Bar */}
        <section className="border-b border-[#2A2B2E] bg-[#141518]/90 pt-8 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* Title */}
            <div className="text-center mb-6">
              <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-3 py-1 rounded-full border border-[#C9A227]/20">
                بوابة الحجز المباشر — أسطول مصر
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#F4F2EC] mt-2">
                إتمام حجز: {car.name}
              </h1>
            </div>

            {/* Stepper Wizard Indicator */}
            <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
              {/* Connecting Background Line */}
              <div className="absolute top-1/2 right-6 left-6 -translate-y-1/2 h-1 bg-[#2A2B2E] z-0" />
              {/* Active Golden Line Progress */}
              <div
                className="absolute top-1/2 right-6 -translate-y-1/2 h-1 bg-[#C9A227] z-0 transition-all duration-500"
                style={{
                  width: `${((currentStep - 1) / 3) * 100}%`,
                }}
              />

              {stepsList.map((step) => {
                const isCompleted = step.num < currentStep
                const isCurrent = step.num === currentStep
                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#C9A227] text-[#0B0A09] shadow-md shadow-[#C9A227]/30"
                          : isCurrent
                          ? "bg-[#141518] border-2 border-[#C9A227] text-[#C9A227] shadow-lg shadow-[#C9A227]/20 ring-4 ring-[#C9A227]/10"
                          : "bg-[#0B0A09] border border-[#2A2B2E] text-[#B9B7B0]/60"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs mt-2 font-semibold transition-colors ${
                        isCurrent
                          ? "text-[#C9A227]"
                          : isCompleted
                          ? "text-[#F4F2EC]"
                          : "text-[#B9B7B0]/50"
                      }`}
                    >
                      {step.title}
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
                  alt={car.name}
                  className="w-full sm:w-48 h-32 rounded-lg object-cover bg-[#0B0A09]"
                />
                <div className="flex-1 text-right w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/30">
                      فئة {car.type}
                    </span>
                    <span className="text-[11px] text-[#B9B7B0]">موديل {car.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F4F2EC]">{car.name}</h3>
                  <p className="text-xs text-[#B9B7B0] mt-1 line-clamp-1">{car.description}</p>
                  <div className="mt-3 flex items-baseline gap-2 font-mono">
                    <span className="text-lg font-black text-[#C9A227]">{formatEGP(car.pricePerDay)}</span>
                    <span className="text-xs text-[#B9B7B0]">/ يوم</span>
                  </div>
                </div>
              </div>

              {/* Trip Parameters & Branch Details */}
              <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6 space-y-4">
                <h3 className="text-base font-bold text-[#F4F2EC] border-b border-[#2A2B2E] pb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C9A227]" />
                  <span>تفاصيل محطات الرحلة والتواريخ</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-[#C9A227] block">محطة الاستلام</span>
                    <p className="text-sm font-bold text-[#F4F2EC]">{pickupBranchObj.name}</p>
                    <p className="text-[#B9B7B0]">{pickupBranchObj.address}</p>
                    <p className="text-[11px] text-[#B9B7B0] font-mono pt-1">تاريخ الاستلام: {pickupDate}</p>
                  </div>

                  <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-[#C9A227] block">محطة التسليم</span>
                    <p className="text-sm font-bold text-[#F4F2EC]">{returnBranchObj.name}</p>
                    <p className="text-[#B9B7B0]">{returnBranchObj.address}</p>
                    <p className="text-[11px] text-[#B9B7B0] font-mono pt-1">
                      تاريخ التسليم: {returnDate} ({rentalDays} {rentalDays === 1 ? "يوم" : "أيام"})
                    </p>
                  </div>
                </div>

                {/* Selected Extras */}
                {selectedExtrasObj.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-[#B9B7B0] mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>الخدمات والإضافات المختارة:</span>
                    </h4>
                    <div className="space-y-1.5">
                      {selectedExtrasObj.map((extra) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between rounded-md bg-[#0B0A09] px-3 py-2 text-xs border border-[#2A2B2E]/60"
                        >
                          <span className="text-[#F4F2EC]">{extra.name}</span>
                          <span className="font-mono text-[#C9A227]">
                            +{extra.pricePerDay} ج.م/يوم (إجمالي: {formatEGP(extra.pricePerDay * rentalDays)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Itemization */}
                <div className="rounded-lg border border-[#2A2B2E] bg-[#0B0A09] p-4 space-y-2 text-xs pt-3">
                  <div className="flex justify-between text-[#B9B7B0]">
                    <span>قيمة الإيجار الأساسية ({rentalDays} أيام × {formatEGP(car.pricePerDay)})</span>
                    <span className="font-mono text-[#F4F2EC]">{formatEGP(baseRentalCost)}</span>
                  </div>
                  {totalExtrasCost > 0 && (
                    <div className="flex justify-between text-[#B9B7B0]">
                      <span>إجمالي الإضافات المختارة ({rentalDays} أيام)</span>
                      <span className="font-mono text-[#C9A227]">+{formatEGP(totalExtrasCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#B9B7B0]">
                    <span>ضريبة القيمة المضافة الحكومية (14%)</span>
                    <span className="font-mono text-[#F4F2EC]">{formatEGP(taxAmount)}</span>
                  </div>
                  <div className="border-t border-[#2A2B2E] pt-3 flex justify-between items-baseline font-bold">
                    <span className="text-sm text-[#F4F2EC]">الإجمالي المطلوب سداده:</span>
                    <span className="text-xl font-black text-[#C9A227] font-mono">
                      {formatEGP(grandTotal)}
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
                  العودة لتفاصيل السيارة
                </Link>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-sm hover:bg-[#E6CF85] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/10"
                >
                  <span>المتابعة لبيانات العميل (خطوة 2)</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
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
                    تمت التعبئة تلقائياً من الحساب التجريبي
                  </span>
                  <h2 className="text-xl font-bold text-[#F4F2EC] mt-2">
                    البيانات الشخصية ومعلومات السائق
                  </h2>
                  <p className="text-xs text-[#B9B7B0] mt-1">
                    يمكنك تعديل أي بيان قبل إتمام تأكيد الحجز.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        الاسم بالكامل (كما في بطاقة الهوية)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pr-10 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                        />
                        <User className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.name && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        رقم الهاتف المسجل
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pr-10 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                        />
                        <Phone className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.phone && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                      البريد الإلكتروني لإرسال الإيصال
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pr-10 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                      />
                      <Mail className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60" />
                    </div>
                    {step2Errors.email && (
                      <p className="text-xs text-red-400 mt-1">{step2Errors.email}</p>
                    )}
                  </div>

                  {/* National ID & License */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        الرقم القومي / جواز السفر
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={nationalId}
                          onChange={(e) => setNationalId(e.target.value)}
                          placeholder="29508140102345"
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pr-10 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                        />
                        <FileText className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.nationalId && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.nationalId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                        رقم رخصة القيادة السارية
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="DL-EGY-89420"
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 pr-10 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                        />
                        <ShieldCheck className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60" />
                      </div>
                      {step2Errors.license && (
                        <p className="text-xs text-red-400 mt-1">{step2Errors.license}</p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                      ملاحظات خاصة لتسليم السيارة (اختياري)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: يرجى تجهيز السيارة الساعة 9 صباحاً، أو رقم الرحلة الجوية..."
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
                  العودة لتفاصيل الحجز
                </button>

                <button
                  type="button"
                  onClick={handleProceedFromStep2}
                  className="px-8 py-3.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-sm hover:bg-[#E6CF85] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9A227]/10"
                >
                  <span>المتابعة لخطوة الدفع (خطوة 3)</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
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
                    اختر وسيلة الدفع المفضلة
                  </h2>
                  <p className="text-xs text-[#B9B7B0] mt-1">
                    المبلغ الإجمالي المستحق:{" "}
                    <strong className="text-[#C9A227] font-mono text-sm">{formatEGP(grandTotal)}</strong>
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
                        <span>دفع أونلاين بالبطاقة</span>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="accent-[#C9A227]"
                      />
                    </div>
                    <p className="text-xs text-[#B9B7B0] leading-relaxed">
                      بطاقات فيزا، ماستركارد، ميزة البنكية مع تشفير آمن ومعالجة فورية تجريبية.
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
                        <span>دفع كاش عند الاستلام</span>
                      </div>
                      <input
                        type="radio"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="accent-[#C9A227]"
                      />
                    </div>
                    <p className="text-xs text-[#B9B7B0] leading-relaxed">
                      ادفع نقداً لموظف الفرع عند معاينة السيارة واستلام المفتاح والعقد الرسمي.
                    </p>
                  </div>
                </div>

                {/* Conditional Card Form */}
                {paymentMethod === "online" && (
                  <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-5 sm:p-6 space-y-4">
                    {/* Simulated Credit Card Visual */}
                    <div className="rounded-xl bg-gradient-to-tr from-[#1b1916] via-[#2a2414] to-[#141518] p-5 border border-[#C9A227]/40 shadow-xl max-w-sm mx-auto mb-4 text-right">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xs font-bold text-[#C9A227] tracking-widest uppercase">Golden Card VIP</span>
                        <div className="w-8 h-6 bg-[#C9A227]/30 rounded border border-[#C9A227]/50" />
                      </div>
                      <div className="text-lg font-mono tracking-widest text-[#F4F2EC] mb-4 text-center">
                        {cardNumber}
                      </div>
                      <div className="flex justify-between items-end text-xs text-[#B9B7B0]">
                        <div>
                          <span className="block text-[9px] uppercase">حامل البطاقة</span>
                          <span className="font-bold text-[#F4F2EC] truncate max-w-[140px] block">{cardHolder}</span>
                        </div>
                        <div className="text-left font-mono">
                          <span className="block text-[9px] uppercase">انتهاء</span>
                          <span className="text-[#F4F2EC]">{cardExpiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#B9B7B0] mb-1">رقم البطاقة</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full rounded-md border border-[#2A2B2E] bg-[#141518] px-3.5 py-2.5 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#B9B7B0] mb-1">تاريخ الانتهاء</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full rounded-md border border-[#2A2B2E] bg-[#141518] px-3.5 py-2.5 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#B9B7B0] mb-1">رمز الأمان CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full rounded-md border border-[#2A2B2E] bg-[#141518] px-3.5 py-2.5 text-xs text-[#F4F2EC] font-mono focus:border-[#C9A227] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#B9B7B0] pt-2 border-t border-[#2A2B2E]">
                      <Lock className="w-3.5 h-3.5 text-[#C9A227]" />
                      <span>معالجة نموذجية آمنة (Prototype Mock) دون أي خصم فعلي من الرصيد.</span>
                    </div>
                  </div>
                )}

                {/* Cash Note */}
                {paymentMethod === "cash" && (
                  <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-5 text-xs text-[#B9B7B0] space-y-2">
                    <p className="font-bold text-[#F4F2EC]">شروط الدفع النقدي في الفرع:</p>
                    <p>• يرجى إحضار المبلغ الإجمالي ({formatEGP(grandTotal)}) عند الحضور لاستلام السيارة.</p>
                    <p>• يجب إبراز أصل بطاقة الرقم القومي أو جواز السفر وأصل رخصة القيادة السارية.</p>
                    <p>• ستحصل على إيصال استلام رسمي وعقد فوري من جولدن تريب.</p>
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
                  العودة لبيانات العميل
                </button>

                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="px-9 py-4 rounded-md bg-[#C9A227] text-[#0B0A09] font-black text-sm hover:bg-[#E6CF85] transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl shadow-[#C9A227]/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#0B0A09] border-t-transparent rounded-full animate-spin" />
                      <span>جاري معالجة وتأكيد الحجز...</span>
                    </>
                  ) : (
                    <>
                      <span>تأكيد الحجز الآن</span>
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
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-80 h-80 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {/* Big Success Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] text-[#C9A227] shadow-xl shadow-[#C9A227]/20 mb-6">
                  <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
                </div>

                <span className="text-xs font-bold text-[#C9A227] tracking-widest uppercase">
                  تم تأكيد الحجز بنجاح
                </span>
                <h2 className="mt-2 text-2xl sm:text-4xl font-black text-[#F4F2EC]">
                  شكراً لاختيارك جولدن تريب!
                </h2>
                <p className="mt-2 text-sm text-[#B9B7B0] max-w-md mx-auto leading-relaxed">
                  تم تسجيل حجزك بنجاح في قاعدة بيانات الأسطول وإرسال رسالة تأكيد إلى بريدك الإلكتروني.
                </p>

                {/* Booking Code Banner */}
                <div className="my-6 inline-block rounded-xl border border-[#C9A227]/50 bg-[#0B0A09] px-6 py-4 shadow-inner">
                  <span className="block text-xs text-[#B9B7B0] mb-1">رقم الحجز المرجعي الخاص بك:</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#C9A227] font-mono tracking-wider">
                    {confirmedBookingId}
                  </span>
                </div>

                {/* Summary Voucher Card */}
                <div className="rounded-xl border border-[#2A2B2E] bg-[#0B0A09] p-5 text-right text-xs max-w-xl mx-auto space-y-3 mb-8">
                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">السيارة المحجوزة:</span>
                    <span className="font-bold text-[#F4F2EC] text-sm">{car.name}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">فرع الاستلام:</span>
                    <span className="font-bold text-[#F4F2EC]">{pickupBranchObj.name}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">تاريخ الاستلام والتسليم:</span>
                    <span className="font-mono text-[#F4F2EC]">
                      {pickupDate} إلى {returnDate} ({rentalDays} أيام)
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#2A2B2E] pb-2.5">
                    <span className="text-[#B9B7B0]">طريقة السداد:</span>
                    <span className="font-bold text-[#C9A227]">
                      {paymentMethod === "online" ? "دفع إلكتروني بالبطاقة" : "دفع نقدي كاش عند الاستلام"}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1 font-bold">
                    <span className="text-sm text-[#F4F2EC]">المبلغ الإجمالي:</span>
                    <span className="text-lg font-black text-[#C9A227] font-mono">
                      {formatEGP(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Final Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/my-bookings"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#C9A227] px-8 py-3.5 text-sm font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all shadow-lg shadow-[#C9A227]/20"
                  >
                    <span>عرض الحجز في "حجوزاتي"</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </Link>

                  <Link
                    href="/cars"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#2A2B2E] px-6 py-3.5 text-sm font-semibold text-[#F4F2EC] hover:border-[#C9A227] transition-all"
                  >
                    <span>تصفح سيارات أخرى</span>
                  </Link>

                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-[#2A2B2E] bg-[#141518] px-5 py-3.5 text-sm font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] hover:border-[#C9A227] transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الإيصال</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
