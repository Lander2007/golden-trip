import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import SignupForm from "@/components/auth/SignupForm"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === "ar"
  return {
    title: isAr
      ? "إنشاء حساب — جولدن تريب"
      : "Create account — Golden Trip",
    description: isAr
      ? "أنشئ حسابك في جولدن تريب واستمتع بحجز السيارات والتنقل الفاخر على الطرق السريعة."
      : "Create your Golden Trip account for luxury vehicle rentals and transfers across Egypt.",
  }
}

export default async function SignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ branch?: string | string[] }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const sParams = await searchParams
  const initialBranch =
    typeof sParams.branch === "string" ? sParams.branch : undefined

  return (
    <main className="relative min-h-[100svh] bg-[#0B0A09] px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="film-grain" aria-hidden="true" />
      <div className="absolute top-6 end-6 z-20">
        <LanguageSwitcher />
      </div>
      <div className="relative z-10 mx-auto max-w-xl">
        <SignupForm initialBranch={initialBranch} />
      </div>
    </main>
  )
}
