import SignupForm from "@/components/auth/SignupForm"

export const metadata = {
  title: "إنشاء حساب — جولدن تريب | Golden Trip",
  description: "أنشئ حسابك في جولدن تريب واستمتع بحجز السيارات والتنقل الفاخر في مصر.",
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string | string[] }>
}) {
  const params = await searchParams
  const initialBranch =
    typeof params.branch === "string" ? params.branch : undefined

  return (
    <main dir="rtl" className="relative min-h-[100svh] bg-[#0B0A09] px-4 pt-28 pb-24 sm:px-6 lg:px-8">
      {/* Background film grain texture */}
      <div className="film-grain" />

      <div className="relative z-10 mx-auto max-w-xl">
        <SignupForm initialBranch={initialBranch} />
      </div>
    </main>
  )
}
