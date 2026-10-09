"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { useApp } from "@/context/AppContext"
import { formatEGP, Booking } from "@/lib/mockData"
import {
  CalendarCheck,
  Car,
  Clock,
  CheckCircle2,
  Ban,
  Star,
  MapPin,
  Calendar,
  PlusCircle,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react"

export default function MyBookingsPage() {
  const t = useTranslations("myBookings")
  const tCommon = useTranslations("common")
  const { bookings, cancelBooking, reviewBooking, currentUser } = useApp()

  // Filter tab: "all" | "مؤكد" | "قيد الانتظار" | "مكتمل" | "ملغي"
  const [activeTab, setActiveTab] = useState<string>("all")

  // Cancel dialog state
  const [cancelingBookingId, setCancelingBookingId] = useState<string | null>(null)

  // Review modal state
  const [reviewingBooking, setReviewingBooking] = useState<Booking | null>(null)
  const [reviewRating, setReviewRating] = useState<number>(5)
  const [reviewComment, setReviewComment] = useState<string>("")
  const [reviewError, setReviewError] = useState<string>("")

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    if (activeTab === "all") return bookings
    return bookings.filter((b) => b.status === activeTab)
  }, [bookings, activeTab])

  // Status counts
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      confirmed: bookings.filter((b) => b.status === "مؤكد").length,
      pending: bookings.filter((b) => b.status === "قيد الانتظار").length,
      completed: bookings.filter((b) => b.status === "مكتمل").length,
      cancelled: bookings.filter((b) => b.status === "ملغي").length,
    }
  }, [bookings])

  const handleConfirmCancel = () => {
    if (cancelingBookingId) {
      cancelBooking(cancelingBookingId)
      setCancelingBookingId(null)
    }
  }

  const handleOpenReview = (booking: Booking) => {
    setReviewingBooking(booking)
    setReviewRating(5)
    setReviewComment("")
    setReviewError("")
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewingBooking) return
    if (!reviewComment.trim()) {
      setReviewError(t("commentPlaceholder"))
      return
    }

    reviewBooking(reviewingBooking.id, reviewRating, reviewComment.trim())
    setReviewingBooking(null)
  }

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "مؤكد":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t("statusConfirmedBadge")}</span>
          </span>
        )
      case "قيد الانتظار":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>{t("statusPendingBadge")}</span>
          </span>
        )
      case "مكتمل":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-950/80 text-blue-300 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t("statusCompletedBadge")}</span>
          </span>
        )
      case "ملغي":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-950/80 text-red-400 border border-red-500/30">
            <Ban className="w-3.5 h-3.5" />
            <span>{t("statusCancelledBadge")}</span>
          </span>
        )
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B0A09] text-[#F4F2EC] pb-24">
        {/* Hero Header */}
        <section className="border-b border-[#2A2B2E] bg-gradient-to-b from-[#141518] to-[#0B0A09] pt-10 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-3.5 py-1 text-xs font-bold text-[#C9A227] mb-3">
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>{t("dashboardBadge")}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-[#F4F2EC]">
                  {t("title")}
                </h1>
                <p className="mt-2 text-sm text-[#B9B7B0] max-w-2xl leading-relaxed">
                  {t("subtitle")}
                </p>
              </div>

              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-xs hover:bg-[#E6CF85] transition-all active:scale-95 shadow-md shadow-[#C9A227]/10 self-start md:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t("newBooking")}</span>
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="mt-8 flex flex-wrap gap-2 border-b border-[#2A2B2E] pb-3">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "all"
                    ? "bg-[#C9A227] text-[#0B0A09] shadow-sm"
                    : "bg-[#141518] text-[#B9B7B0] hover:text-[#F4F2EC] border border-[#2A2B2E]"
                }`}
              >
                <span>{t("tabAll")}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {counts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("مؤكد")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "مؤكد"
                    ? "bg-[#C9A227] text-[#0B0A09] shadow-sm"
                    : "bg-[#141518] text-[#B9B7B0] hover:text-[#F4F2EC] border border-[#2A2B2E]"
                }`}
              >
                <span>{t("tabConfirmed")}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {counts.confirmed}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("قيد الانتظار")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "قيد الانتظار"
                    ? "bg-[#C9A227] text-[#0B0A09] shadow-sm"
                    : "bg-[#141518] text-[#B9B7B0] hover:text-[#F4F2EC] border border-[#2A2B2E]"
                }`}
              >
                <span>{t("tabPending")}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {counts.pending}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("مكتمل")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "مكتمل"
                    ? "bg-[#C9A227] text-[#0B0A09] shadow-sm"
                    : "bg-[#141518] text-[#B9B7B0] hover:text-[#F4F2EC] border border-[#2A2B2E]"
                }`}
              >
                <span>{t("tabCompleted")}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {counts.completed}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("ملغي")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === "ملغي"
                    ? "bg-[#C9A227] text-[#0B0A09] shadow-sm"
                    : "bg-[#141518] text-[#B9B7B0] hover:text-[#F4F2EC] border border-[#2A2B2E]"
                }`}
              >
                <span>{t("tabCancelled")}</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
                  {counts.cancelled}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Bookings List Area */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          {filteredBookings.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-12 text-center max-w-md mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center text-[#C9A227] mx-auto mb-4">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#F4F2EC] mb-2">
                {t("emptyTitle")}
              </h3>
              <p className="text-sm text-[#B9B7B0] mb-6 leading-relaxed">
                {t("emptyDesc")}
              </p>
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-xs hover:bg-[#E6CF85] transition-all"
              >
                <Car className="w-4 h-4" />
                <span>{t("browseCars")}</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-[#2A2B2E] bg-[#141518] overflow-hidden shadow-xl transition-all duration-300 hover:border-[#C9A227]/40"
                >
                  {/* Top Meta Bar */}
                  <div className="bg-[#0E0E10] px-5 py-3.5 border-b border-[#2A2B2E] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#C9A227] text-sm tracking-wider">
                        {t("bookingIdPrefix", { id: b.id })}
                      </span>
                      <span className="text-[#B9B7B0]">
                        {t("bookingDate")}<span className="font-mono text-[#F4F2EC]">{b.createdAt}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(b.status)}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Car Image + Name: 4 cols */}
                    <div className="lg:col-span-4 flex items-center gap-4">
                      <img
                        src={b.carImage}
                        alt={b.carName}
                        className="w-28 sm:w-36 h-24 rounded-lg object-cover bg-[#0B0A09] border border-[#2A2B2E] shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-[#C9A227] bg-[#C9A227]/10 px-2 py-0.5 rounded border border-[#C9A227]/20">
                          {b.carType}
                        </span>
                        <h3 className="text-base font-bold text-[#F4F2EC] mt-1.5 leading-snug">
                          {b.carName}
                        </h3>
                        <p className="text-xs text-[#B9B7B0] font-mono mt-1">
                          {formatEGP(b.pricePerDay)} {t("perDay")}
                        </p>
                      </div>
                    </div>

                    {/* Trip Specs: 4 cols */}
                    <div className="lg:col-span-4 space-y-2.5 text-xs text-[#B9B7B0] border-t lg:border-t-0 lg:border-e border-[#2A2B2E] pt-4 lg:pt-0 lg:pe-6">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[#F4F2EC] font-semibold">{b.branchName}</span>
                          <span className="block text-[11px] text-[#B9B7B0]/70">
                            {t("toBranch", { branch: b.returnBranchName })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span>
                          {t("fromToDates", {
                            pickup: b.pickupDate,
                            returnDate: b.returnDate,
                            days: b.totalDays,
                          })}
                        </span>
                      </div>

                      {b.selectedExtras && b.selectedExtras.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {b.selectedExtras.map((ex, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-[#0B0A09] px-2 py-0.5 rounded border border-[#2A2B2E] text-[#E6CF85]"
                            >
                              + {ex.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing & Actions: 4 cols */}
                    <div className="lg:col-span-4 flex flex-col justify-between items-start lg:items-end border-t lg:border-t-0 border-[#2A2B2E] pt-4 lg:pt-0 lg:border-e lg:pe-6">
                      <div className="text-start lg:text-end mb-4">
                        <span className="text-xs text-[#B9B7B0] block">{t("totalAmount")}</span>
                        <span className="text-xl font-black text-[#C9A227] font-mono">
                          {formatEGP(b.totalPrice)}
                        </span>
                        <span className="text-[11px] text-[#B9B7B0] block">
                          {b.paymentMethod === "online" ? tCommon("onlinePayment") : tCommon("cashPayment")}
                        </span>
                      </div>

                      {/* Dynamic Action Buttons based on status */}
                      <div className="w-full flex flex-wrap gap-2 justify-start lg:justify-end">
                        {(b.status === "مؤكد" || b.status === "قيد الانتظار") && (
                          <button
                            onClick={() => setCancelingBookingId(b.id)}
                            className="px-4 py-2 rounded-md border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>{t("cancelBooking")}</span>
                          </button>
                        )}

                        {b.status === "مكتمل" && !b.userReview && (
                          <button
                            onClick={() => handleOpenReview(b)}
                            className="px-4 py-2 rounded-md bg-[#C9A227] text-xs font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#0B0A09]" />
                            <span>{t("reviewTrip")}</span>
                          </button>
                        )}

                        <Link
                          href={`/cars/${b.carId}`}
                          className="px-3.5 py-2 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] hover:border-[#C9A227] transition-all flex items-center gap-1"
                        >
                          <span>{t("viewCar")}</span>
                          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* If user already reviewed this completed booking */}
                  {b.userReview && (
                    <div className="bg-[#0B0A09] px-6 py-4 border-t border-[#2A2B2E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-[#C9A227] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t("publishedReview")}</span>
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < b.userReview!.rating
                                  ? "fill-[#C9A227] text-[#C9A227]"
                                  : "text-[#2A2B2E]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[#B9B7B0] italic">"{b.userReview.comment}"</span>
                      </div>
                      <span className="text-[11px] text-[#B9B7B0]/60 font-mono">{b.userReview.date}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL 1: CANCEL CONFIRMATION DIALOG */}
        {cancelingBookingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6 max-w-md w-full shadow-2xl relative text-start">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-[#F4F2EC] mb-2">
                {t("confirmCancelTitle", { id: cancelingBookingId })}
              </h3>
              <p className="text-xs text-[#B9B7B0] leading-relaxed mb-6">
                {t("confirmCancelDesc")}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCancelingBookingId(null)}
                  className="px-4 py-2.5 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] cursor-pointer"
                >
                  {t("cancelGoBack")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-5 py-2.5 rounded-md bg-red-600 text-xs font-bold text-white hover:bg-red-700 transition-all cursor-pointer shadow-md"
                >
                  {t("confirmCancelBtn")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD REVIEW TO COMPLETED CAR */}
        {reviewingBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="rounded-xl border border-[#2A2B2E] bg-[#141518] p-6 max-w-lg w-full shadow-2xl relative text-start">
              <button
                onClick={() => setReviewingBooking(null)}
                className="absolute top-4 end-4 p-1 rounded text-[#B9B7B0] hover:text-[#F4F2EC]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-[#C9A227] mb-2">
                <Sparkles className="w-4 h-4" />
                <span>{t("reviewModalBadge")}</span>
              </div>

              <h3 className="text-lg font-bold text-[#F4F2EC] mb-1">
                {t("reviewModalTitle", { carName: reviewingBooking.carName })}
              </h3>
              <p className="text-xs text-[#B9B7B0] mb-6">
                {t("reviewModalDesc")}
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-5">
                {/* Interactive Star Picker */}
                <div>
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-2">
                    {t("ratingLabel")}
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating
                              ? "fill-[#C9A227] text-[#C9A227]"
                              : "text-[#2A2B2E]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="me-3 text-xs font-bold text-[#C9A227]">
                      {reviewRating === 5
                        ? t("rating5")
                        : reviewRating === 4
                        ? t("rating4")
                        : reviewRating === 3
                        ? t("rating3")
                        : t("ratingAcceptable")}
                    </span>
                  </div>
                </div>

                {/* Comment Box */}
                <div>
                  <label className="block text-xs font-bold text-[#B9B7B0] mb-1.5">
                    {t("commentLabel")}
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={t("commentPlaceholder")}
                    className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] p-3 text-xs text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none"
                  />
                  {reviewError && (
                    <p className="text-xs text-red-400 mt-1">{reviewError}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewingBooking(null)}
                    className="px-4 py-2.5 rounded-md border border-[#2A2B2E] text-xs font-semibold text-[#B9B7B0] hover:text-[#F4F2EC] cursor-pointer"
                  >
                    {t("cancelBtn")}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-md bg-[#C9A227] text-xs font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all cursor-pointer shadow-md shadow-[#C9A227]/10"
                  >
                    {t("submitReviewBtn")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
