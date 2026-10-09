import type { Metadata } from "next"
import { setRequestLocale } from "next-intl/server"
import LoginForm from "@/components/auth/LoginForm"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === "ar"
  return {
    title: isAr
      ? "تسجيل الدخول — جولدن تريب"
      : "Sign in — Golden Trip",
    description: isAr
      ? "سجل الدخول لحسابك في جولدن تريب واستعرض أسطول السيارات وحجوزاتك في مصر."
      : "Sign in to your Golden Trip account and explore Egypt fleet bookings.",
  }
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="relative min-h-[100svh] bg-[#0B0A09] px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      <div className="film-grain" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-xl">
        <LoginForm />
      </div>
    </main>
  )
}
