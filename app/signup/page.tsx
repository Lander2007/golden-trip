import SignupForm from "@/components/auth/SignupForm"

export const metadata = {
  title: "Sign Up — Golden Trip",
  description:
    "Create your Golden Trip account and book transfers across Egypt.",
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
    <main className="relative min-h-[100svh] bg-[#0B0A09] px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      {/* Background film grain texture */}
      <div className="film-grain" />

      <div className="relative z-10 mx-auto max-w-xl">
        <SignupForm initialBranch={initialBranch} />
      </div>
    </main>
  )
}
