"use client"

import { useLocale, useTranslations } from "next-intl"
import { usePathname, Link } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

interface LanguageSwitcherProps {
  className?: string
  variant?: "pill" | "sheet" | "header" | "standalone"
}

function LanguageSwitcherContent({
  className = "",
  variant = "pill",
}: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tA11y = useTranslations("a11y")

  // Handle scroll restoration on mount if returning from a language switch
  useEffect(() => {
    if (typeof window === "undefined") return
    const saved = sessionStorage.getItem("gt_lang_switch")
    if (saved) {
      try {
        const { sectionId, scrollY, ratio } = JSON.parse(saved)
        sessionStorage.removeItem("gt_lang_switch")
        const restore = () => {
          if (sectionId && document.getElementById(sectionId)) {
            document.getElementById(sectionId)!.scrollIntoView({ behavior: "instant" })
          } else if (scrollY !== undefined && scrollY > 0) {
            window.scrollTo({ top: scrollY, behavior: "instant" })
          } else if (ratio !== undefined) {
            const targetScroll = ratio * (document.documentElement.scrollHeight - window.innerHeight)
            window.scrollTo({ top: targetScroll, behavior: "instant" })
          }
          if ((window as any).ScrollTrigger?.refresh) {
            ;(window as any).ScrollTrigger.refresh()
          }
        }
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => {
            requestAnimationFrame(restore)
            setTimeout(restore, 100)
          })
        } else {
          setTimeout(restore, 50)
        }
      } catch {
        sessionStorage.removeItem("gt_lang_switch")
      }
    }
  }, [locale])

  const handleSwitchClick = () => {
    if (typeof window === "undefined") return
    // Detect currently visible section on landing page
    const sections = ["destinations", "how-it-works", "why-golden-trip"]
    let visibleSection = ""
    for (const id of sections) {
      const el = document.getElementById(id)
      if (el) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
          visibleSection = id
          break
        }
      }
    }
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const ratio = window.scrollY / maxScroll
    sessionStorage.setItem(
      "gt_lang_switch",
      JSON.stringify({ sectionId: visibleSection, scrollY: window.scrollY, ratio })
    )
  }

  // Preserve existing query params
  const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : ""
  const targetHref = `${pathname}${queryString}`

  return (
    <div
      role="group"
      aria-label={tA11y("languageSwitcherGroup")}
      className={`inline-flex items-center rounded-full border border-[#C9A227]/30 bg-[#0B0A09]/85 p-0.5 backdrop-blur-md ${className}`}
    >
      <Link
        href={targetHref}
        locale="en"
        lang="en"
        onClick={handleSwitchClick}
        aria-label={tA11y("languageSwitcherEn")}
        aria-pressed={locale === "en"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 font-mono text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD54F] ${
          locale === "en"
            ? "bg-[#C9A227] text-[#080D15] shadow-[0_0_10px_rgba(201,162,39,0.5)]"
            : "text-[#B9B7B0] hover:text-[#F4F2EC]"
        }`}
      >
        EN
      </Link>
      <Link
        href={targetHref}
        locale="ar"
        lang="ar"
        onClick={handleSwitchClick}
        aria-label={tA11y("languageSwitcherAr")}
        aria-pressed={locale === "ar"}
        className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 font-sans text-xs font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD54F] ${
          locale === "ar"
            ? "bg-[#C9A227] text-[#080D15] shadow-[0_0_10px_rgba(201,162,39,0.5)]"
            : "text-[#B9B7B0] hover:text-[#F4F2EC]"
        }`}
      >
        عربي
      </Link>
    </div>
  )
}

export default function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense
      fallback={
        <div
          role="group"
          className={`inline-flex items-center rounded-full border border-[#C9A227]/30 bg-[#0B0A09]/85 p-0.5 backdrop-blur-md ${props.className || ""}`}
        >
          <span className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 font-mono text-xs font-bold text-[#B9B7B0]">
            EN
          </span>
          <span className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 font-sans text-xs font-bold text-[#B9B7B0]">
            عربي
          </span>
        </div>
      }
    >
      <LanguageSwitcherContent {...props} />
    </Suspense>
  )
}
