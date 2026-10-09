"use client" /* Full Name */ /* Email & Phone */ /* Departure Branch & Preferred Vehicle */ /* Password */ /* Submit Button (Solid Gold, NO arrow icon!) */ /* Switch to Login / Help */

import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, Phone, MessageSquare, AlertCircle } from "lucide-react"
import { destinationsList } from "../Destinations"

interface SignupFormProps {
  initialBranch?: string
}

export default function SignupForm({ initialBranch = "" }: SignupFormProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [branch, setBranch] = useState(initialBranch || "Alexandria")
  const [vehicle, setVehicle] = useState("suv")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!fullName.trim()) newErrors.fullName = "Please enter your full name."
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "Please enter a valid email address."
    if (!phone.trim() || phone.replace(/\D/g, "").length < 9) {
      newErrors.phone =
        "Please enter a valid Egyptian phone number (e.g., 010 1234 5678)."
    }
    if (!password || password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-sm border-2 border-[#C9A227] bg-[#141518] p-8 sm:p-10 text-center shadow-2xl animate-in fade-in duration-300">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
          <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
        </div>
        <h2 className="mt-5 font-display text-2xl sm:text-3xl font-extrabold text-[#F4F2EC]">
          Welcome to Golden Trip
        </h2>
        <p className="mt-3 text-base text-[#B9B7B0]">
          Your account has been created with departure branch:{" "}
          <strong className="text-[#C9A227] font-semibold">{branch}</strong>.
        </p>
        <p className="mt-2 text-sm text-[#B9B7B0]/80">
          Our dispatch team is ready 24/7 to confirm your vehicle schedule.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={`https://wa.me/201006803316?text=${encodeURIComponent(
              `Hello Golden Trip, I registered my account for ${fullName} from ${branch} branch.`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#C9A227] px-6 py-3 text-sm font-semibold text-[#0E0E10] hover:bg-[#E6CF85] transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Confirm on WhatsApp
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-[#2A2B2E] px-6 py-3 text-sm font-medium text-[#F4F2EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
          >
            Back to Highway Route
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-sm border border-[#2A2B2E] bg-[#141518] p-6 sm:p-10 shadow-2xl">
      <div className="mb-6 border-b border-[#2A2B2E] pb-4">
        <span className="font-mono text-xs font-semibold text-[#C9A227]">
          Client registration
        </span>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl font-extrabold text-[#F4F2EC]">
          Start your Golden Trip
        </h1>
        <p className="mt-2 text-sm text-[#B9B7B0]">
          One account for all 12 branches from Alexandria to Aswan.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold text-[#B9B7B0]"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Ahmed Hassan"
            className={`mt-1.5 w-full rounded-sm border bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
              errors.fullName
                ? "border-red-500"
                : "border-[#2A2B2E] focus:border-[#C9A227]"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.fullName}
            </p>
          )}
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-[#B9B7B0]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className={`mt-1.5 w-full rounded-sm border bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                errors.email
                  ? "border-red-500"
                  : "border-[#2A2B2E] focus:border-[#C9A227]"
              }`}
            />
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-semibold text-[#B9B7B0]"
            >
              Phone (Egypt)
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010 1234 5678"
              className={`mt-1.5 w-full rounded-sm border bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                errors.phone
                  ? "border-red-500"
                  : "border-[#2A2B2E] focus:border-[#C9A227]"
              }`}
            />
            {errors.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="branch"
              className="block text-xs font-semibold text-[#B9B7B0]"
            >
              Departure Branch
            </label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[#2A2B2E] bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            >
              {destinationsList.map((d) => (
                <option key={d.city} value={d.city}>
                  {d.city} {d.isHq ? "(Headquarters)" : `(${d.km} km)`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="vehicle"
              className="block text-xs font-semibold text-[#B9B7B0]"
            >
              Preferred Vehicle
            </label>
            <select
              id="vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[#2A2B2E] bg-[#0E0E10] px-3.5 py-2.5 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            >
              <option value="suv">Black Executive SUV</option>
              <option value="sedan">White Executive Sedan</option>
              <option value="van">White VIP Passenger Van</option>
            </select>
          </div>
        </div>

        {}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-[#B9B7B0]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
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
        <button
          type="submit"
          className="mt-2 w-full rounded-sm bg-[#C9A227] py-3.5 font-display text-base font-semibold text-[#0E0E10] transition-colors hover:bg-[#E6CF85] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]"
        >
          Create account & continue
        </button>
      </form>

      {}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A2B2E] pt-5 text-xs text-[#B9B7B0]">
        <span>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#C9A227] underline underline-offset-4 hover:text-[#E6CF85] transition-colors"
          >
            Log in
          </Link>
        </span>
        <Link href="/" className="hover:text-[#F4F2EC] transition-colors">
          ← Back to highway journey
        </Link>
      </div>
    </div>
  )
}
