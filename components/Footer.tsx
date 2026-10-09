import Link from "next/link"
import { Phone, MessageSquare } from "lucide-react"
import Logo from "./Logo"

export default function Footer() {
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
            aria-label="Golden Trip home"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] rounded-sm"
          >
            {/* Tagline kept in footer */}
            <Logo showTagline={true} />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#B9B7B0]">
            Alexandria, Egypt.
            <br />
            Airport transfers and highway trips nationwide.
          </p>
        </div>

        {/* Quick Nav Links */}
        <nav
          aria-label="Footer navigation"
          className="flex flex-col gap-3.5 text-sm text-[#B9B7B0]"
        >
          <Link
            href="/#destinations"
            className="hover:text-[#F4F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            Destinations
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#F4F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            How it works
          </Link>
          <Link
            href="/#why-golden-trip"
            className="hover:text-[#F4F2EC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            Why Golden Trip
          </Link>
          <Link
            href="/signup"
            className="text-[#C9A227] hover:text-[#E6CF85] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            Book a vehicle
          </Link>
        </nav>

        {/* 24/7 Operations & Direct Contact */}
        <div>
          <p className="font-display text-lg font-bold text-[#F4F2EC]">
            Open 24/7.
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <a
              href="tel:+201006803316"
              className="inline-flex items-center gap-2 font-display text-lg font-bold text-[#F4F2EC] hover:text-[#C9A227] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <Phone className="h-4 w-4 text-[#C9A227]" />
              010 06803316
            </a>
            <a
              href="https://wa.me/201006803316"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#C9A227] hover:text-[#E6CF85] underline underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
            >
              <MessageSquare className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal Row */}
      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col items-center justify-between gap-4 border-t border-[#2A2B2E] pt-6 text-xs text-[#B9B7B0]/70 sm:flex-row">
        <span>
          © {new Date().getFullYear()} Golden Trip. All rights reserved.
        </span>
        <span>Alexandria, Egypt</span>
      </div>
    </footer>
  )
}
