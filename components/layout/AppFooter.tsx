"use client"

import React from "react"
import Link from "next/link"
import Logo from "@/components/Logo"
import { Phone, MessageSquare, MapPin, ShieldCheck, Clock } from "lucide-react"

export default function AppFooter() {
  return (
    <footer
      dir="rtl"
      className="relative z-20 border-t border-[#2A2B2E] bg-[#0E0E10] px-4 pt-12 pb-16 sm:px-6 lg:px-8 text-right"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Logo showTagline={false} condensed={true} />
            </Link>
            <p className="text-sm leading-relaxed text-[#B9B7B0] mb-4">
              خدمة تأجير السيارات الفاخرة ورحلات الطرق السريعة بين كافة محافظات ومطارات جمهورية مصر العربية بأعلى معايير الرفاهية والأمان.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C9A227]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>خدمة العملاء والتشغيل على مدار 24 ساعة</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#F4F2EC] mb-4 border-b border-[#2A2B2E] pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B9B7B0]">
              <li>
                <Link href="/cars" className="hover:text-[#C9A227] transition-colors">
                  تصفح أسطول السيارات
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-[#C9A227] transition-colors">
                  متابعة وتفاصيل حجوزاتي
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-[#C9A227] transition-colors">
                  الصفحة الرئيسية للموقع
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/201006803316"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A227] transition-colors"
                >
                  الدعم الفني عبر واتساب
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Branches */}
          <div>
            <h4 className="text-sm font-bold text-[#F4F2EC] mb-4 border-b border-[#2A2B2E] pb-2">
              فروعنا في مصر
            </h4>
            <ul className="space-y-2 text-xs text-[#B9B7B0]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>الإسكندرية (المقر الرئيسي)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>القاهرة (مطار القاهرة صالة 3)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>الجيزة (الشيخ زايد)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                <span>شرم الشيخ & الغردقة & مطروح</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Assurance */}
          <div>
            <h4 className="text-sm font-bold text-[#F4F2EC] mb-4 border-b border-[#2A2B2E] pb-2">
              تواصل معنا فوراً
            </h4>
            <div className="space-y-3">
              <a
                href="tel:+201006803316"
                className="flex items-center gap-2.5 rounded-lg border border-[#2A2B2E] bg-[#141518] p-3 text-sm font-bold text-[#F4F2EC] hover:border-[#C9A227] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C9A227]" />
                <div className="text-right">
                  <span className="block text-[10px] text-[#B9B7B0] font-normal">الخط الساخن المباشر</span>
                  <span className="font-mono text-sm text-[#C9A227]">010 06803316</span>
                </div>
              </a>

              <a
                href="https://wa.me/201006803316?text=مرحباً%20جولدن%20تريب،%20أود%20الاستفسار%20عن%20حجز%20سيارة"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border border-[#2A2B2E] bg-[#141518] p-3 text-sm font-bold text-[#F4F2EC] hover:border-[#C9A227] transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A227]" />
                <div className="text-right">
                  <span className="block text-[10px] text-[#B9B7B0] font-normal">محادثة فورية</span>
                  <span className="text-xs text-[#E6CF85]">واتساب خدمة العملاء</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#2A2B2E] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B9B7B0]/70">
          <p>© {new Date().getFullYear()} جولدن تريب (Golden Trip) — جميع الحقوق محفوظة لجمهورية مصر العربية.</p>
          <div className="flex items-center gap-2 text-[11px] text-[#C9A227]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>نموذج تجريبي تفاعلي للعرض (Interactive Prototype)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
