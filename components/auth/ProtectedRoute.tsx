"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter, Link } from "@/i18n/routing"
import { useApp } from "@/context/AppContext"
import { Lock } from "lucide-react"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const tAuth = useTranslations("auth")
  const { isAuthenticated, isHydrated, demoLogin } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login")
    }
  }, [isHydrated, isAuthenticated, router])

  if (!isHydrated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#C9A227] border-t-transparent animate-spin mb-4" />
        <p className="text-[#B9B7B0] text-sm font-medium">
          {tAuth("verifyingAccountState")}
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#141518] border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] mb-6 shadow-lg shadow-[#C9A227]/5">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F2EC] mb-3">
          {tAuth("loginRequiredTitle")}
        </h2>
        <p className="text-[#B9B7B0] max-w-md text-sm sm:text-base leading-relaxed mb-8">
          {tAuth("loginRequiredMessage")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <button
            onClick={() => demoLogin().then(() => router.refresh())}
            className="w-full py-3 px-5 rounded-md bg-[#C9A227] text-[#0B0A09] font-bold text-sm hover:bg-[#E6CF85] transition-all active:scale-95 shadow-md cursor-pointer"
          >
            {tAuth("instantDemoAccessButton")}
          </button>
          <Link
            href="/login"
            className="w-full py-3 px-5 rounded-md border border-[#2A2B2E] text-[#F4F2EC] font-semibold text-sm hover:border-[#C9A227] hover:text-[#C9A227] transition-all text-center"
          >
            {tAuth("loginPageButton")}
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
