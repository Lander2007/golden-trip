"use client"

import { useTranslations } from "next-intl"

export default function CarIllustration() {
  const tA11y = useTranslations("a11y")

  return (
    <svg
      viewBox="0 0 520 210"
      role="img"
      aria-label={tA11y("flatCarIllustrationAria")}
      className="h-auto w-full"
    >
      <path
        d="M74 127 111 76c12-17 29-27 50-29l133-12c28-2 51 7 70 27l50 51 49 14c17 5 28 20 28 38v7H30v-13c0-16 10-28 25-32l19-5Z"
        fill="#F2B705"
        stroke="#1B1F22"
        strokeWidth="8"
        strokeLinejoin="round"
      />
      <path
        d="m142 77 32-10c7-2 14-3 21-4l90-8c20-2 37 5 51 19l29 32H119l23-29Z"
        fill="#F5F5F0"
        stroke="#1B1F22"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path d="M252 60v47M116 108h278" stroke="#1B1F22" strokeWidth="7" />
      <path
        d="M28 148h65M431 148h61"
        stroke="#F5F5F0"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <circle cx="139" cy="166" r="35" fill="#1B1F22" />
      <circle cx="139" cy="166" r="15" fill="#F5F5F0" />
      <circle cx="390" cy="166" r="35" fill="#1B1F22" />
      <circle cx="390" cy="166" r="15" fill="#F5F5F0" />
      <path d="M435 118h26l18 16h-44Z" fill="#0F5A3F" />
      <rect x="307" y="119" width="37" height="8" rx="4" fill="#1B1F22" />
    </svg>
  )
}
