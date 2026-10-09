"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import Sign from "./Sign"

export default function AccountHelp({
  login = false,
  branch,
}: {
  login?: boolean
  branch?: string
}) {
  const tAuth = useTranslations("auth")
  const tCommon = useTranslations("common")

  const defaultMsg = login
    ? tCommon("whatsAppAccountHelpMessage")
    : tCommon("whatsAppDefaultMessage")

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 pb-20 pt-36">
      <Sign>
        <div
          role="heading"
          aria-level={1}
          className="font-display text-4xl font-extrabold text-gold"
        >
          {login ? tAuth("accountAssistanceTitle") : tAuth("planYourTripTitle")}
        </div>
        <p className="mt-6 leading-relaxed text-lane-white">
          {login
            ? tAuth("accountAssistanceMessage")
            : tAuth("planYourTripMessage")}
        </p>
        {branch && !login && (
          <p className="mt-4 text-soft-gold">
            {tAuth("selectedBranchMessage", { branch })}
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`https://wa.me/201006803316?text=${encodeURIComponent(defaultMsg)}`}
            className="press bg-gold px-6 py-3 font-semibold text-asphalt"
          >
            {tAuth("contactWhatsAppButton")}
          </Link>
          <Link
            href="tel:+201006803316"
            className="press border border-gold px-6 py-3 text-gold"
          >
            {tAuth("callCompanyButton")}
          </Link>
        </div>
        <Link
          href="/"
          className="mt-8 inline-block text-gold underline underline-offset-4"
        >
          {tAuth("backToJourneyLink")}
        </Link>
      </Sign>
    </main>
  )
}
