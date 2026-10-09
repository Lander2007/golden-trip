import Link from "next/link"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations("errors")

  return (
    <main className="relative min-h-[100svh] bg-[#0B0A09] flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="film-grain" aria-hidden="true" />
      <div className="relative z-10 max-w-md rounded-2xl border border-[#2A2B2E] bg-[#141518]/90 p-8 shadow-2xl backdrop-blur-md">
        <span className="font-mono text-sm font-bold text-[#C9A227] tracking-wider">
          404 · HIGHWAY DETOUR
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-[#F4F2EC]">
          {t("pageNotFoundTitle")}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#B9B7B0]">
          {t("pageNotFoundMessage")}
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#C9A227] px-6 py-3 font-display text-sm font-bold text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
          >
            {t("backToHighwayButton")}
          </Link>
        </div>
      </div>
    </main>
  )
}
