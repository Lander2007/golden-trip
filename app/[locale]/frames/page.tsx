import { Link, routing } from "@/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import Journey from "@/components/Journey"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { MotionNote } from "@/components/Scene"
import Odometer from "@/components/Odometer"
import RouteBoard from "@/components/RouteBoard"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Frames({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ size?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const mobile = (await searchParams).size === "mobile"

  return (
    <div className="overflow-x-auto pt-28">
      <div className="mx-6 mb-8 flex flex-wrap items-center gap-6 text-sm">
        <h1 className="font-display text-2xl text-gold">
          Golden Trip / Storyboard
        </h1>
        <Link href="/frames" className={!mobile ? "text-gold underline" : ""}>
          Desktop · 1440
        </Link>
        <Link
          href="/frames?size=mobile"
          className={mobile ? "text-gold underline" : ""}
        >
          Mobile · 390
        </Link>
        <Link href="/">Live journey ↗</Link>
      </div>
      <div
        className={`frame-sheet relative mx-auto ${
          mobile ? "frame-mobile w-[390px]" : "w-[1440px]"
        }`}
      >
        <Journey frames />
        <div className="relative min-h-[500px] bg-asphalt pt-20">
          <Header />
          <Footer />
          <div className="absolute bottom-4 start-6 z-40">
            <Odometer km={980} />
          </div>
          <div className="absolute end-6 top-24 z-40">
            <RouteBoard active={5} />
          </div>
        </div>
        <MotionNote index={6} />
      </div>
    </div>
  )
}
