import Link from "next/link"
import Sign from "./Sign"

export default function AccountHelp({
  login = false,
  branch,
}: {
  login?: boolean
  branch?: string
}) {
  const message = login
    ? "Hello Golden Trip, I need help accessing my account."
    : `Hello Golden Trip, I'd like to book a trip${
        branch ? ` from ${branch}` : ""
      }.`

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 pb-20 pt-36">
      <Sign>
        <div
          role="heading"
          aria-level={1}
          className="font-display text-4xl font-extrabold text-gold"
        >
          {login ? "Account assistance" : "Let’s plan your trip"}
        </div>
        <p className="mt-6 leading-relaxed text-lane-white">
          {login
            ? "Online account access is not available on this website yet. Contact Golden Trip for help with your account or an existing booking."
            : "Online registration and booking are not available on this website yet. Contact Golden Trip to arrange your journey and confirm availability."}
        </p>
        {branch && !login && (
          <p className="mt-4 text-soft-gold">Selected branch: {branch}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`https://wa.me/201006803316?text=${encodeURIComponent(message)}`}
            className="press bg-gold px-6 py-3 font-semibold text-asphalt"
          >
            Contact on WhatsApp
          </Link>
          <Link
            href="tel:+201006803316"
            className="press border border-gold px-6 py-3 text-gold"
          >
            Call Golden Trip
          </Link>
        </div>
        <Link
          href="/"
          className="mt-8 inline-block text-gold underline underline-offset-4"
        >
          Back to the journey
        </Link>
      </Sign>
    </main>
  )
}
