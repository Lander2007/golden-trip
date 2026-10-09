"use client"

import React from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"
import Logo from "@/components/Logo"
import { Phone, MessageSquare, MapPin, ShieldCheck, Clock } from "lucide-react"

export default function AppFooter() {
  const tFooter = useTranslations("footer")
  const tCommon = useTranslations("common")
  const locale = useLocale()

  const whatsAppPrefill = encodeURIComponent(tCommon("whatsAppDefaultMessage"))

  return (
    <footer
      className="relative z-20 border-t border-[#2A2B2E] bg-[#0E0E10] px-4 pt-12 pb-16 sm:px-6 lg:px-8 text-start"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo showTagline={false} condensed={true} />
            </Link>
            <p className="text-sm leading-relaxed text-[#B9B7B0] mb-4">
              {tFooter("appFooterSummary")}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C9A227]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{tFooter("operatingHours24")}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#F4F2EC] mb-4 border-b border-[#2A2B2E] pb-2">
              {tFooter("quickLinksTitle")}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B9B7B0]">
              <li>
                <Link href="/cars" className="hover:text-[#C9A227] transition-colors">
                  {tFooter("browseFleetLink")}
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-[#C9A227] transition-colors">
                  {tFooter("myBookingsLink")}
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#C9A227] transition-colors">
                  {tFooter("homePortalLink")}
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/201006803316?text=${whatsAppPrefill}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {tFooter("whatsAppSupportLink")}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches */}
          <div>
            <h4 className="text-sm font-bold text-[#F4F2EC] mb-4 border-b border-[#2A2B2E] pb-2">
              {tFooter("ourBranchesTitle")}
            </h4>
            <ul className="space-y-2 text-xs text-[#B9B7B0]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{tFooter("alexHqAddress")}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{tFooter("cairoAirportAddress")}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{tFooter("gizaZayedAddress")}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>{tFooter("resortsSummaryAddress")}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Assurance */}
          <div>
            <h4 className="text-sm font-bold text-[#F4F2EC] mb-4 border-b border-[#2A2B2E] pb-2">
              {tFooter("contactImmediateTitle")}
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+201006803316"
                className="flex items-center gap-2.5 rounded-lg border border-[#2A2B2E] bg-[#141518] p-3 text-sm font-bold text-[#F4F2EC] hover:border-[#C9A227] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9A227]" />
                <div className="text-start">
                  <span className="block text-[10px] text-[#B9B7B0] font-normal">
                    {tFooter("highwayHotline")}
                  </span>
                  <bdi dir="ltr" className="font-mono text-sm text-[#C9A227]">
                    010 06803316
                  </bdi>
                </div>
              </a>

              <a
                href={`https://wa.me/201006803316?text=${whatsAppPrefill}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-[#2A2B2E] bg-[#141518] p-3 text-sm font-bold text-[#F4F2EC] hover:border-[#C9A227] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A227]" />
                <div className="text-start">
                  <span className="block text-[10px] text-[#B9B7B0] font-normal">
                    {tFooter("instantChat")}
                  </span>
                  <span className="text-xs text-[#E6CF85]">
                    {tFooter("whatsAppCustomerService")}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#2A2B2E] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9B7B0]/70">
          <p>
            {tFooter("copyright", { year: new Date().getFullYear() })}{" "}
            {tFooter("rightsReservedEgypt")}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-[#C9A227]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{tFooter("prototypeBadge")}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
