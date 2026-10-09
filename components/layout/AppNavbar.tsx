"use client"

import React, { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link, usePathname, useRouter } from "@/i18n/routing"
import { useApp } from "@/context/AppContext"
import Logo from "@/components/Logo"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import {
  Car,
  CalendarCheck,
  LogOut,
  Menu,
  X,
  Phone,
  Home,
  ChevronDown,
} from "lucide-react"

export default function AppNavbar() {
  const tNav = useTranslations("nav")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout, bookings } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  // Count active bookings (confirmed or pending)
  const activeBookingsCount = bookings.filter(
    (b) => b.status === "مؤكد" || b.status === "قيد الانتظار"
  ).length

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isCars = pathname === "/cars" || pathname.startsWith("/cars/")
  const isBookings = pathname === "/my-bookings"

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#2A2B2E] bg-[#0B0A09]/90 backdrop-blur-md transition-all duration-300"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-sm"
            title={tNav("home")}
          >
            <Logo showTagline={false} condensed={true} />
          </Link>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1 ms-6" aria-label={tNav("mainNavAria")}>
            <Link
              href="/cars"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                isCars
                  ? "bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 shadow-sm shadow-[#C9A227]/5"
                  : "text-[#B9B7B0] hover:text-[#F4F2EC] hover:bg-white/5"
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{tNav("fleet")}</span>
            </Link>

            <Link
              href="/my-bookings"
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all relative ${
                isBookings
                  ? "bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 shadow-sm shadow-[#C9A227]/5"
                  : "text-[#B9B7B0] hover:text-[#F4F2EC] hover:bg-white/5"
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{tNav("myBookings")}</span>
              {activeBookingsCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-[11px] font-bold text-[#0B0A09]">
                  {activeBookingsCount}
                </span>
              )}
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-[#B9B7B0]/70 hover:text-[#B9B7B0] hover:bg-white/5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{tNav("siteInterface")}</span>
            </Link>
          </nav>
        </div>

        {/* User profile, LanguageSwitcher & Hotline */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-[#2A2B2E] bg-[#141518] hover:border-[#C9A227]/50 transition-all text-start"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E6CF85] flex items-center justify-center text-[#0B0A09] font-bold text-xs shadow-sm">
                  {currentUser.name ? currentUser.name.slice(0, 2) : "GT"}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#F4F2EC] truncate max-w-[130px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-[#C9A227]">{tNav("vipClient")}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#B9B7B0] ms-1" />
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute end-0 mt-2 w-60 rounded-lg border border-[#2A2B2E] bg-[#141518] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-[#2A2B2E] mb-1">
                      <p className="text-xs font-bold text-[#F4F2EC]">{currentUser.name}</p>
                      <p className="text-[11px] text-[#B9B7B0] truncate mt-0.5">{currentUser.email}</p>
                      <p className="text-[11px] text-[#C9A227] mt-1 font-mono">
                        <bdi dir="ltr">{currentUser.phone}</bdi>
                      </p>
                    </div>

                    <Link
                      href="/my-bookings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#F4F2EC] hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-colors"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      <span>{tNav("myBookings")}</span>
                    </Link>

                    <Link
                      href="/cars"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#F4F2EC] hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-colors"
                    >
                      <Car className="w-4 h-4" />
                      <span>{tNav("fleet")}</span>
                    </Link>

                    <div className="my-1 border-t border-[#2A2B2E]" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-start"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{tNav("logOut")}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-[#F4F2EC] hover:text-[#C9A227] transition-colors"
              >
                {tNav("logIn")}
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-[#C9A227] text-[#0B0A09] text-xs font-bold hover:bg-[#E6CF85] transition-colors"
              >
                {tNav("signUp")}
              </Link>
            </div>
          )}

          {/* Quick Hotline */}
          <a
            href="tel:+201006803316"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#2A2B2E] text-xs font-medium text-[#B9B7B0] hover:text-[#C9A227] hover:border-[#C9A227]/40 transition-colors"
            title={tCommon("open247")}
          >
            <Phone className="w-3.5 h-3.5 text-[#C9A227]" />
            <bdi dir="ltr" className="font-mono text-[11px]">010 06803316</bdi>
          </a>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />

          {currentUser && (
            <Link
              href="/my-bookings"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#141518] border border-[#2A2B2E] text-[#C9A227] relative"
              title={tNav("myBookings")}
            >
              <CalendarCheck className="w-4 h-4" />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A227] text-[9px] font-bold text-[#0B0A09]">
                  {activeBookingsCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-[#2A2B2E] bg-[#141518] text-[#F4F2EC] hover:text-[#C9A227] transition-colors"
            aria-label={tNav("mobileNavAria")}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#2A2B2E] bg-[#0E0E10] px-4 py-6 md:hidden animate-in fade-in duration-200">
          <div className="mb-4 flex items-center justify-between pb-3 border-b border-[#2A2B2E]/60">
            <span className="text-xs text-[#B9B7B0]">{tNav("mobileNavAria")}</span>
            <LanguageSwitcher />
          </div>

          {currentUser && (
            <div className="mb-6 rounded-lg border border-[#2A2B2E] bg-[#141518] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E6CF85] flex items-center justify-center text-[#0B0A09] font-bold text-sm">
                  {currentUser.name ? currentUser.name.slice(0, 2) : "GT"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F4F2EC]">{currentUser.name}</h4>
                  <p className="text-xs text-[#B9B7B0]">{currentUser.email}</p>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 font-semibold">
                {tNav("activeAccount")}
              </span>
            </div>
          )}

          <nav className="flex flex-col space-y-2 mb-6">
            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-lg text-sm font-bold ${
                isCars ? "bg-[#C9A227] text-[#0B0A09]" : "text-[#F4F2EC] hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5" />
                <span>{tNav("fleet")}</span>
              </div>
              <span className="text-xs opacity-75">{tNav("fleetVehiclesCount")}</span>
            </Link>

            <Link
              href="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-lg text-sm font-bold ${
                isBookings ? "bg-[#C9A227] text-[#0B0A09]" : "text-[#F4F2EC] hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5" />
                <span>{tNav("myBookings")}</span>
              </div>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#0B0A09] text-xs font-bold">
                  {tNav("activeCountBadge", { count: activeBookingsCount })}
                </span>
              )}
            </Link>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg text-sm font-medium text-[#B9B7B0] hover:text-[#F4F2EC] hover:bg-white/5"
            >
              <Home className="w-5 h-5 text-[#C9A227]" />
              <span>{tNav("siteInterface")}</span>
            </Link>
          </nav>

          <div className="border-t border-[#2A2B2E] pt-4 flex flex-col gap-3">
            <a
              href="tel:+201006803316"
              className="flex items-center justify-center gap-2 p-3 rounded-lg border border-[#2A2B2E] text-sm font-semibold text-[#F4F2EC] hover:border-[#C9A227]"
            >
              <Phone className="w-4 h-4 text-[#C9A227]" />
              <span>
                {tNav("directCallPhone", { phone: "010 06803316" })}
              </span>
            </a>

            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm font-bold text-red-400 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{tNav("logOut")}</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-center rounded-lg border border-[#2A2B2E] text-sm font-bold text-[#F4F2EC]"
                >
                  {tNav("logIn")}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 text-center rounded-lg bg-[#C9A227] text-sm font-bold text-[#0B0A09]"
                >
                  {tNav("signUp")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
