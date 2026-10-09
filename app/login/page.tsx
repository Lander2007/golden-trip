import LoginForm from "@/components/auth/LoginForm"

export const metadata = {
  title: "تسجيل الدخول — جولدن تريب | Golden Trip",
  description: "سجل الدخول لحسابك في جولدن تريب واستعرض أسطول السيارات وحجوزاتك.",
}

export default function LoginPage() {
  return (
    <main dir="rtl" className="relative min-h-[100svh] bg-[#0B0A09] px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* Background film grain texture */}
      <div className="film-grain" />

      <div className="relative z-10 mx-auto max-w-xl">
        <LoginForm />
      </div>
    </main>
  )
}
