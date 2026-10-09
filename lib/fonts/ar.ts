import { Reem_Kufi, IBM_Plex_Sans_Arabic, Amiri } from "next/font/google"

export const reemKufi = Reem_Kufi({
  subsets: ["arabic", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-reem-kufi",
  display: "swap",
})

export const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
})

export const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-amiri",
  display: "swap",
})
