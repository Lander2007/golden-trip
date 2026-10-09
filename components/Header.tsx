"use client"

// Track scroll position to condense header and update active navigation

// Check section offsets

// Close mobile menu on route change

// Trap focus and handle Escape in mobile menu

// Smooth scroll handler with header offset
/* Logo sits left, outside the pill, inside the frame */ /* Floating glass pill centered, ~560px wide, blur, 1px sand border at 15% opacity */ /* Small gold km-marker tick under active link */ /* Right Action buttons: outside the pill */ /* Solid gold button with NO arrow icon */ /* Mobile Hamburger Button */ /* Docked Route Progress Line: visible once user scrolls past the hero frame */ /* Mobile Gantry-Styled Full Screen Navigation Menu */ /* Gantry Menu Header */ /* Gantry Road Sign Box */ /* Numbered Large Links */ /* Mobile CTA Buttons */ /* Solid gold sign up button with NO arrow */ /* Quick Contact Shortcuts: WhatsApp & Call */ /* Footer note in mobile menu */

import { useState, useEffect, useRef } from "react"
import { Link, usePathname } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { Menu, X, Phone, MessageSquare } from "lucide-react"
import gsap from "gsap"
import Logo from "./Logo"
import RouteProgressLine from "./RouteProgressLine"
import AppNavbar from "./layout/AppNavbar"
import LanguageSwitcher from "./LanguageSwitcher"

interface HeaderProps {
  km?: number
  activeSection?: string
}

export default function Header({ km = 0, activeSection }: HeaderProps) {
  const tNav = useTranslations("nav")
  const tCommon = useTranslations("common")
  const [condensed, setCondensed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<string>("")
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const condensedRef = useRef(false)
  const activeNavRef = useRef("")
  const offsetsRef = useRef({ destinations: 0, howItWorks: 0, whyUs: 0 })

  useEffect(() => {
    // Cache section offset tops to prevent layout thrashing on scroll
    const measureSections = () => {
      const destinations = document.getElementById("destinations")
      const howItWorks = document.getElementById("how-it-works")
      const whyUs = document.getElementById("why-golden-trip")
      offsetsRef.current = {
        destinations: destinations ? destinations.offsetTop : 0,
        howItWorks: howItWorks ? howItWorks.offsetTop : 0,
        whyUs: whyUs ? whyUs.offsetTop : 0,
      }
    }

    measureSections()

    if (typeof window !== "undefined" && (window as any).ScrollTrigger) {
      ;(window as any).ScrollTrigger.addEventListener("refresh", measureSections)
    }

    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(measureSections, 150)
    }
    window.addEventListener("resize", handleResize, { passive: true })

    let dirty = true
    const markDirty = () => {
      dirty = true
    }
    const onTick = () => {
      if (!dirty) return
      dirty = false
      const scrollY = window.scrollY
      const nextCondensed = scrollY > 24
      if (nextCondensed !== condensedRef.current) {
        condensedRef.current = nextCondensed
        setCondensed(nextCondensed)
      }

      if (activeSection) {
        if (activeSection !== activeNavRef.current) {
          activeNavRef.current = activeSection
          setActiveNav(activeSection)
        }
        return
      }

      const scrollPos = scrollY + 200
      const { destinations, howItWorks, whyUs } = offsetsRef.current

      let nextNav = ""
      if (whyUs > 0 && scrollPos >= whyUs) {
        nextNav = "why-golden-trip"
      } else if (howItWorks > 0 && scrollPos >= howItWorks) {
        nextNav = "how-it-works"
      } else if (destinations > 0 && scrollPos >= destinations) {
        nextNav = "destinations"
      }

      if (nextNav !== activeNavRef.current) {
        activeNavRef.current = nextNav
        setActiveNav(nextNav)
      }
    }

    window.addEventListener("scroll", markDirty, { passive: true })
    gsap.ticker.add(onTick)
    onTick()

    return () => {
      window.removeEventListener("scroll", markDirty)
      window.removeEventListener("resize", handleResize)
      gsap.ticker.remove(onTick)
      clearTimeout(resizeTimer)
    }
  }, [activeSection])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        return
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            last.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === last) {
            first.focus()
            e.preventDefault()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    // Push state to enable back button to close menu
    window.history.pushState({ menu: true }, "")
    const handlePopState = () => {
      setMobileOpen(false)
    }
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("popstate", handlePopState)
      document.body.style.overflow = ""
      if (window.history.state?.menu) {
        window.history.back()
      }
    }
  }, [mobileOpen])

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    if (pathname === "/" || pathname === "") {
      e.preventDefault()
      const target = document.querySelector(hash)
      if (target) {
        const headerOffset = condensed ? 56 : 72
        const elementPosition = target.getBoundingClientRect().top
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset + 2
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
        setActiveNav(hash.replace("#", ""))
        setMobileOpen(false)
      }
    } else {
      setMobileOpen(false)
    }
  }

  const navLinks = [
    {
      label: tNav("destinations"),
      href: "/#destinations",
      id: "destinations",
      num: "01",
    },
    {
      label: tNav("howItWorks"),
      href: "/#how-it-works",
      id: "how-it-works",
      num: "02",
    },
    {
      label: tNav("whyGoldenTrip"),
      href: "/#why-golden-trip",
      id: "why-golden-trip",
      num: "03",
    },
  ]

  const isAppRoute = pathname.startsWith("/cars") || pathname.startsWith("/booking") || pathname.startsWith("/my-bookings")
  if (isAppRoute) {
    return <AppNavbar />
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-5 md:px-8 lg:px-12 pointer-events-none transition-all duration-300 ${
          condensed 
            ? "pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] sm:pt-[calc(env(safe-area-inset-top,0px)+0.75rem)]" 
            : "pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] sm:pt-[calc(env(safe-area-inset-top,0px)+1.75rem)] lg:pt-[calc(env(safe-area-inset-top,0px)+2rem)]"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          <div className="pointer-events-auto shrink-0">
            <Link
              href="/"
              aria-label={tCommon("brand")}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-sm block"
            >
              <Logo showTagline={false} condensed={condensed} />
            </Link>
          </div>

          <nav
            aria-label={tNav("mainNavAria")}
            className={`nav-pill pointer-events-auto hidden items-center justify-center lg:flex mx-4 rounded-full border border-[#EADFC8]/15 bg-[#0B0A09]/75 transition-all duration-300 ${
              condensed
                ? "py-1.5 px-5 gap-5 text-xs"
                : "py-2 px-6 gap-6 text-sm"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = activeNav === link.id
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleAnchorClick(e, `#${link.id}`)}
                  className={`relative py-1 font-medium transition-colors ${
                    isActive
                      ? "text-[#F4F2EC]"
                      : "text-[#B9B7B0] hover:text-[#F4F2EC]"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-sm`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 h-[3px] w-4 rounded-[1px] bg-[#C9A227]"
                      aria-hidden="true"
                    />
                  )}
                </a>
              )
            })}
            <div className="h-4 w-[1px] bg-[#EADFC8]/20" aria-hidden="true" />
            <LanguageSwitcher variant="pill" />
          </nav>

          <div className="pointer-events-auto hidden items-center gap-5 lg:flex shrink-0">
            <Link
              href="/login"
              className="text-sm font-medium text-[#F4F2EC]/85 transition-colors hover:text-[#C9A227] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-sm px-2 py-1"
            >
              {tCommon("logIn")}
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-sm bg-[#C9A227] px-5 py-2 text-sm font-semibold text-[#0B0A09] transition-colors hover:bg-[#E6CF85] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0A09]"
            >
              {tCommon("signUp")}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="pointer-events-auto lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label={tNav("openMenuAria")}
              aria-expanded={mobileOpen}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EADFC8]/20 bg-[#141518] text-[#F4F2EC] hover:text-[#C9A227] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <Menu className="h-6 w-6 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </header>

      {/* Docked Route Progress Line: visible once user scrolls past the hero frame */}
      {pathname === "/" && (
        <div
          className={`hidden md:block transition-opacity duration-300 ${
            condensed
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <RouteProgressLine km={km} condensed={condensed} />
        </div>
      )}

      {/* Mobile Gantry-Styled Full Screen Navigation Menu */}
      {mobileOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label={tNav("mobileNavAria")}
          className="fixed inset-0 z-[100] flex flex-col bg-[#0B0A09] px-6 py-6 overflow-y-auto animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#2A2B2E] pb-5">
            <Logo showTagline={false} condensed={false} />
            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="sheet" />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={tNav("closeMenuAria")}
                className="flex h-11 w-11 items-center justify-center rounded-sm border border-[#2A2B2E] text-[#F4F2EC] hover:text-[#C9A227] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
              >
                <X className="h-6 w-6 stroke-[2.2]" />
              </button>
            </div>
          </div>

          <div className="my-auto py-8">
            <div className="rounded-sm border-2 border-[#C9A227] bg-[#141518] p-6">
              <div className="mb-4 flex items-center justify-between border-b border-[#2A2B2E] pb-3 text-xs font-medium text-[#C9A227]">
                <span>{tNav("routeNavigator")}</span>
                <span>{tNav("egyptTitle")}</span>
              </div>

              <nav className="flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, `#${link.id}`)}
                    className="group flex items-baseline gap-4 py-2 font-display text-2xl font-bold tracking-tight text-[#F4F2EC] hover:text-[#C9A227] transition-colors"
                  >
                    <span className="font-mono text-sm font-semibold text-[#C9A227]">
                      {link.num}
                    </span>
                    <span>{link.label}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-[#2A2B2E]">
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-sm bg-[#C9A227] text-base font-semibold text-[#0E0E10] transition-colors hover:bg-[#E6CF85]"
                >
                  {tCommon("signUp")}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-sm border border-[#2A2B2E] text-base font-medium text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
                >
                  {tCommon("logIn")}
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/201006803316?text=${encodeURIComponent(tCommon("whatsAppDefaultMessage"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2.5 rounded-sm border border-[#2A2B2E] bg-[#161719] py-3 text-sm font-medium text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-[#C9A227]" />
                <span>{tCommon("chatWhatsApp")} · <bdi dir="ltr">{tCommon("phone")}</bdi></span>
              </a>
              <a
                href="tel:+201006803316"
                className="flex flex-1 items-center justify-center gap-2.5 rounded-sm border border-[#2A2B2E] bg-[#161719] py-3 text-sm font-medium text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
              >
                <Phone className="h-4 w-4 text-[#C9A227]" />
                <span>{tCommon("callUs")}</span>
              </a>
            </div>
          </div>

          <div className="border-t border-[#2A2B2E] pt-4 text-center text-xs text-[#B9B7B0]">
            {tCommon("companyLocation")} · {tCommon("open247")}
          </div>
        </div>
      )}
    </>
  )
}

