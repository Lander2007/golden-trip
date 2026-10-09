"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useApp } from "@/context/AppContext"
import { MOCK_BRANCHES } from "@/lib/mockData"
import {
  Car,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Shield,
} from "lucide-react"

interface SignupFormProps {
  initialBranch?: string
}

export default function SignupForm({ initialBranch = "" }: SignupFormProps) {
  const router = useRouter()
  const { signup, demoLogin, isAuthenticated } = useApp()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [branch, setBranch] = useState(initialBranch || "alexandria")
  const [password, setPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
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

    if (!name.trim()) newErrors.name = "يرجى كتابة الاسم بالكامل."
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "يرجى إدخال بريد إلكتروني صحيح."
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "يرجى إدخال رقم هاتف صحيح للتواصل (مثل: 010 1234 5678)."
    }
    if (!password || password.length < 4) {
      newErrors.password = "كلمة المرور يجب ألا تقل عن 4 أحرف أو أرقام."
    }
    if (!agreeTerms) {
      newErrors.terms = "يرجى الموافقة على شروط الخدمة للمتابعة."
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)
    try {
      await signup({ name, email, phone })
      router.push("/cars")
    } catch {
      setErrors({ form: "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى." })
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    setErrors({})
    try {
      await demoLogin()
      router.push("/cars")
    } catch {
      setErrors({ form: "تعذر الدخول بالحساب التجريبي." })
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div
      dir="rtl"
      className="rounded-xl border border-[#2A2B2E] bg-[#141518]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Decorative Golden Glow */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-80" />

      {/* Header */}
      <div className="mb-8 border-b border-[#2A2B2E] pb-5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-1 rounded border border-[#C9A227]/20">
            انضم إلى أسطول جولدن تريب
          </span>
          <span className="text-xs text-[#B9B7B0]">تسجيل فوري</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#F4F2EC]">
          إنشاء حساب عميل جديد
        </h1>
        <p className="mt-2 text-sm text-[#B9B7B0]">
          احجز سيارتك المفضلة وسافر بين المحافظات المصرية براحة وأمان مطلق.
        </p>
      </div>

      {/* Fast Demo Option */}
      <div className="mb-6 rounded-lg border border-[#C9A227]/40 bg-[#C9A227]/5 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#C9A227]">
              <Sparkles className="w-4 h-4" />
              <span>تريد تجربة سريعة بدون كتابة بيانات؟</span>
            </div>
            <p className="text-xs text-[#B9B7B0] mt-1">
              استخدم الحساب التجريبي المسبق للدخول والتنقل بين الصفحات فوراً.
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
                <span>جاري التحميل...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>دخول بحساب تجريبي</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errors.form && (
        <div className="mb-5 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
            الاسم بالكامل
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: أحمد محمود النجار"
              className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pr-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                errors.name ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
              }`}
            />
            <User className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
          </div>
          {errors.name && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pr-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                  errors.email ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
                }`}
              />
              <Mail className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            </div>
            {errors.email && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              رقم الهاتف (واتساب)
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010 1234 5678"
                className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pr-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                  errors.phone ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
                }`}
              />
              <Phone className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            </div>
            {errors.phone && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="branch" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              الفرع المفضل للاستلام
            </label>
            <select
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-md border border-[#2A2B2E] bg-[#0B0A09] px-3.5 py-3 text-sm text-[#F4F2EC] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227] focus:outline-none"
            >
              {MOCK_BRANCHES.map((b) => (
                <option key={b.id} value={b.id} className="bg-[#141518]">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-[#B9B7B0] mb-1.5">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-md border bg-[#0B0A09] px-3.5 py-3 pr-10 text-sm text-[#F4F2EC] placeholder-[#B9B7B0]/40 transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227] ${
                  errors.password ? "border-red-500" : "border-[#2A2B2E] focus:border-[#C9A227]"
                }`}
              />
              <Lock className="absolute top-3.5 right-3 w-4 h-4 text-[#B9B7B0]/60 pointer-events-none" />
            </div>
            {errors.password && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.password}</span>
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
            <span>
              أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بجولدن تريب لحجز السيارات ورحلات الطرق السريعة.
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.terms}</span>
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
              <span>جاري إنشاء الحساب...</span>
            </>
          ) : (
            <>
              <span>إنشاء الحساب والمتابعة للسيارات</span>
              <Car className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login & back */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A2B2E] pt-5 text-xs text-[#B9B7B0]">
        <span>
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="font-bold text-[#C9A227] hover:underline"
          >
            تسجيل الدخول
          </Link>
        </span>
        <Link
          href="/"
          className="hover:text-[#F4F2EC] transition-colors flex items-center gap-1"
        >
          <span>العودة لصفحة الموقع</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </div>
    </div>
  )
}
