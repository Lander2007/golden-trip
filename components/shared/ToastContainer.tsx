"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useApp } from "@/context/AppContext"
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react"

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()
  const tA11y = useTranslations("a11y")

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 start-6 z-[120] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success"
        const isError = toast.type === "error"

        return (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-lg border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 bg-[#141518]/95 border-[#2A2B2E]"
            style={{
              borderColor: isSuccess ? "#C9A227" : isError ? "#EF4444" : "#3B82F6",
            }}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#C9A227] shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
              <span className="text-sm font-medium text-[#F4F2EC] leading-snug">
                {toast.message}
              </span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded text-[#B9B7B0] hover:text-[#F4F2EC] hover:bg-white/5 transition-colors shrink-0"
              aria-label={tA11y("closeNotificationAria")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
