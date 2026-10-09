"use client" /* Email or Phone */ /* Password */ /* Remember me */ /* Submit */ /* Switch to Sign up / Help */

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, MessageSquare, AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loggedIn, setLoggedIn] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!identifier.trim()) {
      newErrors.identifier = "Please enter your email or phone number."
    }
    if (!password) {
      newErrors.password = "Please enter your password."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoggedIn(true)
  }

  if (loggedIn) {
    return (
      <div className="rounded-sm border-2 border-[#C9A227] bg-[#141518] p-8 sm:p-10 text-center shadow-2xl animate-in fade-in duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>
        <h2 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold text-[#F4F2EC]">
          Welcome Back
        </h2>
        <p className="mt-3 text-base text-[#B9B7B0]">
          You are now signed into Golden Trip.
        </p>
        <p className="mt-2 text-sm text-[#B9B7B0]/80">
          Your active highway reservations and vehicle status are synchronized.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm bg-[#C9A227] px-6 py-3 text-sm font-semibold text-[#0E0E10] hover:bg-[#E6CF85] transition-colors"
          >
            Go to Journey Dashboard
          </Link>
          <a
            href="https://wa.me/201006803316"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#2A2B2E] px-6 py-3 text-sm font-medium text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
          >
            <MessageSquare className="h-4 w-4 text-[#C9A227]" />
            Direct WhatsApp Support
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-sm border border-[#2A2B2E] bg-[#141518] p-6 sm:p-10 shadow-2xl">
      <div className="mb-6 border-b border-[#2A2B2E] pb-4">
        <span className="font-mono text-xs font-semibold text-[#C9A227]">
          Account portal
        </span>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#F4F2EC]">
          Log in to Golden Trip
        </h1>
        <p className="mt-2 text-sm text-[#B9B7B0]">
          Follow your bookings and manage your vehicles nationwide.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {}
        <div>
          <label
            htmlFor="identifier"
            className="block text-xs font-semibold text-[#B9B7B0]"
          >
            Email or Phone Number
          </label>
          <input
            id="identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="e.g. 010 1234 5678 or name@domain.com"
            className={`mt-1.5 w-full rounded-sm border bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.identifier
                ? "border-red-500"
                : "border-[#2A2B2E] focus:border-[#C9A227]"
            }`}
          />
          {errors.identifier && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.identifier}
            </p>
          )}
        </div>

        {}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#B9B7B0]"
            >
              Password
            </label>
            <a
              href="https://wa.me/201006803316?text=Hello%20Golden%20Trip,%20I%20need%20help%20resetting%20my%20password."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#C9A227] hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`mt-1.5 w-full rounded-sm border bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.password
                ? "border-red-500"
                : "border-[#2A2B2E] focus:border-[#C9A227]"
            }`}
          />
          {errors.password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.password}
            </p>
          )}
        </div>

        {}
        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded-[2px] border-[#2A2B2E] bg-[#0E0E10] text-[#C9A227] accent-[#C9A227] focus:ring-[#C9A227]"
          />
          <label htmlFor="rememberMe" className="text-xs text-[#B9B7B0]">
            Remember this device for 30 days
          </label>
        </div>

        {}
        <button
          type="submit"
          className="mt-2 w-full rounded-sm bg-[#C9A227] py-3.5 font-display text-base font-semibold text-[#0E0E10] transition-colors hover:bg-[#E6CF85] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          Log in
        </button>
      </form>

      {}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A2B2E] pt-5 text-xs text-[#B9B7B0]">
        <span>
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#C9A227] underline underline-offset-4 hover:text-[#E6CF85] transition-colors"
          >
            Sign up
          </Link>
        </span>
        <Link href="/" className="hover:text-[#F4F2EC] transition-colors">
          ← Back to highway journey
        </Link>
      </div>
    </div>
  )
}
