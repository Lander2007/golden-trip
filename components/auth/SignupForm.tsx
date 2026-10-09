"use client"

import React, { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { useApp } from "@/context/AppContext"
import { MOCK_BRANCHES } from "@/lib/mockData"
import {
  Car,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
} from "lucide-react"

interface SignupFormProps {
  initialBranch?: string
}

export default function SignupForm({ initialBranch = "" }: SignupFormProps) {
  const tAuth = useTranslations("auth")
  const tErrors = useTranslations("errors")
  const tCommon = useTranslations("common")
  const tNav = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const { signup, demoLogin, isAuthenticated } = useApp()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [branch, setBranch] = useState(initialBranch || "alexandria")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [errorKeys, setErrorKeys] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/cars")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "nameRequired"
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "emailInvalid"
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "phoneInvalid"
    }
    if (!password || password.length < 4) {
      newErrors.password = "passwordTooShort"
    }
    if (!agreeTerms) {
      newErrors.terms = "termsRequired"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorKeys(newErrors)
      return
    }

    setErrorKeys({})
    setLoading(true)
    try {
      await signup({ name, email, phone })
      router.push("/cars")
    } catch {
      setErrorKeys({ form: "generalSignupError" })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    setErrorKeys({})
    try {
      await demoLogin()
      router.push("/cars")
    } catch {
      setErrorKeys({ form: "demoLoginError" })
    } finally {
      setDemoLoading(false)
    }
  }

  const getBranchLabel = (branchId: string) => {
    switch (branchId) {
      case "alexandria":
        return tCommon("alexandriaOrigin")
      case "cairo":
        return tCommon("cairoBranch")
      case "giza":
        return tCommon("gizaBranch")
      case "sharm":
        return tCommon("sharmBranch")
      case "hurghada":
        return tCommon("hurghadaBranch")
      case "matruh":
        return tCommon("matruhBranch")
      default:
        return branchId
    }
  }

  return (
    <div
      className="rounded-xl border border-[#2A2B2E] bg-[#141518]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Decorative Golden Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-80" />

      {/* Header */}
      <div className="mb-8 border-b border-[#2A2B2E] pb-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/20">
            {tAuth("joinFleetTitle")}
          </span>
          <span className="text-xs text-[#B9B7B0]">{tAuth("instantSignupBadge")}</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#F4F2EC]">
          {tAuth("signupHeading")}
        </h1>
        <p className="mt-2 text-sm text-[#B9B7B0]">
          {tAuth("signupSubheading")}
        </p>
      </div>

      {/* Fast Demo Option */}
      <div className="mb-6 rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/5 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C9A227]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{tAuth("demoFastSignupPrompt")}</span>
            </div>
            <p className="text-xs text-[#B9B7B0] mt-1">
              {tAuth("demoFastSignupDesc")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#C9A227] px-4 py-2 text-xs font-bold text-[#0B0A09] hover:bg-[#E6CF85] transition-all active:scale-95 shadow-md shrink-0 cursor-pointer disabled:opacity-50"
          >
            {demoLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-[#0B0A09] border-t-transparent rounded-full animate-spin" />
                <span>{tAuth("creatingAccountState")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tAuth("signupWithDemoButton")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorKeys.form && (
        <div className="mb-5 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{tErrors(errorKeys.form as any)}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
            {tAuth("fullNameLabel")}
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tAuth("fullNamePlaceholder")}
              className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pe-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                errorKeys.name ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
              }`}
            />
            <User className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
          </div>
          {errorKeys.name && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{tErrors(errorKeys.name as any)}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              {tAuth("emailFieldLabel")}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tAuth("emailFieldPlaceholder")}
                className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pe-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                  errorKeys.email ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
                }`}
              />
              <Mail className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            </div>
            {errorKeys.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{tErrors(errorKeys.email as any)}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              {tAuth("phoneFieldLabel")}
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={tAuth("phoneFieldPlaceholder")}
                className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pe-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                  errorKeys.phone ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
                }`}
              />
              <Phone className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            </div>
            {errorKeys.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{tErrors(errorKeys.phone as any)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="branch" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              {tAuth("preferredBranchLabel")}
            </label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227] focus:outline-none"
            >
              {MOCK_BRANCHES.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#141518]">
                  {getBranchLabel(b.id)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              {tAuth("passwordLabel")}
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tAuth("passwordPlaceholder")}
                className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pe-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                  errorKeys.password ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
                }`}
              />
              <Lock className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            </div>
            {errorKeys.password && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{tErrors(errorKeys.password as any)}</span>
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#B9B7B0]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#2A2B2E] bg-[#0B0A09] accent-[#C9A227]"
            />
            <span>{tAuth("agreeTermsCheckbox")}</span>
          </label>
          {errorKeys.terms && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{tErrors(errorKeys.terms as any)}</span>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || demoLoading}
          className="w-full mt-4 rounded-md bg-[#C9A227] py-3.5 font-bold text-sm text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C9A227]/10"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0B0A09] border-t-transparent rounded-full animate-spin" />
              <span>{tAuth("creatingAccountState")}</span>
            </>
          ) : (
            <>
              <span>{tAuth("createAccountButtonText")}</span>
              <Car className="w-4 h-4 rtl:-scale-x-100" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login & back */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A2B2E] pt-5 text-xs text-[#B9B7B0]">
        <span>
          {tAuth("alreadyRegistered")}{" "}
          <Link
            href="/login"
            className="font-bold text-[#C9A227] hover:underline"
          >
            {tNav("logIn")}
          </Link>
        </span>
        <Link
          href="/"
          className="hover:text-[#F4F2EC] transition-colors flex items-center gap-1"
        >
          <span>{tAuth("backToHomeLink")}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
        </Link>
      </div>
    </div>
  )
}
