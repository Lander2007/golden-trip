"use client"

import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Phone, MessageSquare } from "lucide-react"
import Logo from "./Logo"
import AppFooter from "./layout/AppFooter"

export default function Footer() {
  const tFooter = useTranslations("footer")
  const tNav = useTranslations("nav")
  const tCommon = useTranslations("common")
  const pathname = usePathname()

  const isAppRoute = pathname.startsWith("/cars") || pathname.startsWith("/booking") || pathname.startsWith("/my-bookings")
  if (isAppRoute) {
    return <AppFooter />
  }

  return (
    <footer
      id="footer"
      className="relative z-30 border-t border-[#2A2B2E] bg-[#0B0A09] px-6 pt-16 pb-24 lg:px-12"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-12 md:flex-row">
        {/* Brand & Location */}
        <div>
          <Link
            href="/"
            aria-label={tFooter("homeLinkAria")}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-sm"
          >
            <Logo showTagline={true} />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#B9B7B0]">
            {tFooter("brandDescLine1")}
            <br />
            {tFooter("brandDescLine2")}
          </p>
        </div>

        {/* Quick Nav Links */}
        <nav
          aria-label={tNav("footerNavAria")}
          className="flex flex-col gap-3.5 text-sm text-[#B9B7B0]"
        >
          <Link
            href="/#destinations"
            className="hover:text-[#F4F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            {tNav("destinations")}
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#F4F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            {tNav("howItWorks")}
          </Link>
          <Link
            href="/#why-golden-trip"
            className="hover:text-[#F4F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            {tNav("whyGoldenTrip")}
          </Link>
          <Link
            href="/signup"
            className="text-[#C9A227] hover:text-[#E6CF85] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            {tFooter("bookAVehicle")}
          </Link>
        </nav>

        {/* 24/7 Operations & Direct Contact */}
        <div>
          <p className="font-display text-lg font-bold text-[#F4F2EC]">
            {tFooter("openRoundTheClock")}
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a
              href="tel:+201006803316"
              className="inline-flex items-center gap-2 font-display text-lg font-bold text-[#F4F2EC] hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <Phone className="h-4 w-4 text-[#C9A227]" />
              <bdi dir="ltr">{tCommon("phone")}</bdi>
            </a>
            <a
              href={`https://wa.me/201006803316?text=${encodeURIComponent(tCommon("whatsAppDefaultMessage"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#C9A227] hover:text-[#E6CF85] underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{tCommon("chatWhatsApp")}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal Row */}
      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-[#2A2B2E] pt-6 text-xs text-[#B9B7B0]/70 sm:flex-row">
        <span>
          {tCommon("allRightsReserved", { year: new Date().getFullYear() })}
        </span>
        <span>{tCommon("companyLocation")}</span>
      </div>
    </footer>
  )
}

