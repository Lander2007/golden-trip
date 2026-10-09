"use client"

import React, { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link, useRouter } from "@/i18n/routing"
import { useApp } from "@/context/AppContext"
import {
  Car,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react"

export default function LoginForm() {
  const tAuth = useTranslations("auth")
  const tErrors = useTranslations("errors")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const router = useRouter()
  const { login, demoLogin, isAuthenticated } = useApp()

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
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

    if (!identifier.trim()) {
      newErrors.identifier = "identifierRequired"
    }
    if (!password.trim()) {
      newErrors.password = "passwordRequired"
    } else if (password.length < 4) {
      newErrors.password = "passwordTooShort"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorKeys(newErrors)
      return
    }

    setErrorKeys({})
    setLoading(true)
    try {
      await login(identifier, password)
      router.push("/cars")
    } catch {
      setErrorKeys({ form: "generalLoginError" })
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

  return (
    <div
      className="rounded-xl border border-[#2A2B2E] bg-[#141518]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Decorative Golden Accent Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-80" />

      {/* Header */}
      <div className="mb-8 border-b border-[#2A2B2E] pb-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/20">
            {tAuth("customerPortalTitle")}
          </span>
          <span className="text-xs text-[#B9B7B0]">{tAuth("demoVersionBadge")}</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#F4F2EC]">
          {tAuth("loginHeading")}
        </h1>
        <p className="mt-2 text-sm text-[#B9B7B0]">
          {tAuth("loginSubheading")}
        </p>
      </div>

      {/* Fast Demo Account Banner */}
      <div className="mb-6 rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/5 p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C9A227]">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{tAuth("demoAccountReadyTitle")}</span>
            </div>
            <p className="text-xs text-[#B9B7B0] mt-1">
              {tAuth("demoAccountCredentials", { password: "123456" })}
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
                <span>{tAuth("loggingInState")}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tAuth("instantLoginButton")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* General form error if any */}
      {errorKeys.form && (
        <div className="mb-5 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{tErrors(errorKeys.form as any)}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label
            htmlFor="identifier"
            className="block text-xs font-semibold text-[#B9B7B0] mb-1.5"
          >
            {tAuth("emailOrPhoneLabel")}
          </label>
          <div className="relative">
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={tAuth("emailOrPhonePlaceholder")}
              className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pe-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                errorKeys.identifier
                  ? "border-red-500"
                  : "border-[#2A2B2E] focus:border-[#C9A227]"
              }`}
            />
            <Mail className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
          </div>
          {errorKeys.identifier && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{tErrors(errorKeys.identifier as any)}</span>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold text-[#B9B7B0]"
            >
              {tAuth("passwordLabel")}
            </label>
            <span className="text-[11px] text-[#B9B7B0]/60">
              {tAuth("anyPasswordHint")}
            </span>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tAuth("passwordPlaceholder")}
              className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pe-10 ps-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                errorKeys.password
                  ? "border-red-500"
                  : "border-[#2A2B2E] focus:border-[#C9A227]"
              }`}
            />
            <Lock className="absolute top-3.5 end-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 start-3 text-[#B9B7B0] hover:text-[#F4F2EC] transition-colors"
              aria-label={showPassword ? tAuth("hidePasswordAria") : tAuth("showPasswordAria")}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errorKeys.password && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{tErrors(errorKeys.password as any)}</span>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[#B9B7B0]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[#2A2B2E] bg-[#0B0A09] accent-[#C9A227]"
            />
            <span>{tAuth("rememberMeLabel")}</span>
          </label>

          <a
            href={`https://wa.me/201006803316?text=${encodeURIComponent(tCommon("whatsAppAccountHelpMessage"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#C9A227] hover:underline"
          >
            {tAuth("accountHelpLink")}
          </a>
        </div>

        <button
          type="submit"
          disabled={loading || demoLoading}
          className="w-full mt-2 rounded-md bg-[#C9A227] py-3.5 font-bold text-sm text-[#0B0A09] transition-all hover:bg-[#E6CF85] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C9A227]/10"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-[#0B0A09] border-t-transparent rounded-full animate-spin" />
              <span>{tAuth("loggingInState")}</span>
            </>
          ) : (
            <>
              <span>{tAuth("loginButtonText")}</span>
              <Car className="w-4 h-4 rtl:-scale-x-100" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Signup & back */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A2B2E] pt-5 text-xs text-[#B9B7B0]">
        <span>
          {tAuth("noAccountYet")}{" "}
          <Link
            href="/signup"
            className="font-bold text-[#C9A227] hover:underline"
          >
            {tAuth("createNewAccountLink")}
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
