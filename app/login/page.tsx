import LoginForm from "@/components/auth/LoginForm"

export const metadata = {
  title: "Log In — Golden Trip",
  description: "Access your Golden Trip account and track bookings nationwide.",
}

export default function LoginPage() {
  return (
    <main className="relative min-h-[100svh] bg-[#0B0A09] px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      {/* Background film grain texture */}
      <div className="film-grain" />

      <div className="relative z-10 mx-auto max-w-xl">
        <LoginForm />
      </div>
    </main>
  )
}
