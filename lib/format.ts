import type { Locale } from "./localized"

/**
 * Format money amount according to locale.
 * - en: "EGP 3,500" (single space, no nbsp, no extra characters)
 * - ar: "٣٬٥٠٠ ج.م" (Intl 'ar-EG' currency format cleaned to single space)
 */
export function money(amount: number, locale: Locale | string = "ar"): string {
  const isEn = locale === "en"
  const cleanAmount = Number.isFinite(amount) ? amount : 0

  if (isEn) {
    const raw = new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
      currencyDisplay: "code",
    }).format(cleanAmount)
    // Replace non-breaking spaces and ensure format is "EGP X,XXX"
    return raw.replace(/[\u00A0\u200E\u200F\s]+/g, " ").trim()
  }

  // Arabic format: "٣٬٥٠٠ ج.م"
  const raw = new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(cleanAmount)

  // Clean bidi marks, normalize nbsp and duplicate dots
  return raw
    .replace(/[\u200E\u200F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/ج\.م\.?/g, "ج.م")
    .trim()
}

/**
 * Formats a plain number according to the locale.
 * - en: Western digits (e.g. "1,400" or "4.8")
 * - ar: Eastern Arabic-Indic digits (e.g. "١٬٤٠٠" or "٤٫٨")
 */
export function number(
  n: number,
  locale: Locale | string = "ar",
  options?: Intl.NumberFormatOptions
): string {
  const cleanN = Number.isFinite(n) ? n : 0
  const isEn = locale === "en"
  return new Intl.NumberFormat(isEn ? "en-EG" : "ar-EG", options).format(cleanN)
}

/**
 * Format percentage (e.g. "14%" / "١٤%")
 */
export function percent(n: number, locale: Locale | string = "ar"): string {
  const isEn = locale === "en"
  return isEn ? `${n}%` : `${number(n, "ar")}%`
}

/**
 * Format distance in kilometers (e.g. "220 km" / "٢٢٠ كم")
 */
export function distance(km: number, locale: Locale | string = "ar"): string {
  const isEn = locale === "en"
  return isEn ? `${number(km, "en")} km` : `${number(km, "ar")} كم`
}

/**
 * Format date string into human-friendly representation.
 * - en: "1 Oct 2026"
 * - ar: "١ أكتوبر ٢٠٢٦"
 */
export function date(
  d: string | Date | number,
  locale: Locale | string = "ar"
): string {
  if (!d) return ""
  const dateObj = typeof d === "string" || typeof d === "number" ? new Date(d) : d
  if (isNaN(dateObj.getTime())) return String(d)

  const isEn = locale === "en"
  if (isEn) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(dateObj)
  }

  const raw = new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateObj)
  return raw.replace(/[\u200E\u200F]/g, "").trim()
}

/**
 * Format date range (e.g. "1 Oct 2026 – 4 Oct 2026" / "١ أكتوبر ٢٠٢٦ – ٤ أكتوبر ٢٠٢٦")
 */
export function dateRange(
  startDate: string | Date,
  endDate: string | Date,
  locale: Locale | string = "ar"
): string {
  const s = date(startDate, locale)
  const e = date(endDate, locale)
  return `${s} – ${e}`
}

/**
 * Format duration with full ICU plural rules.
 * English: 1 day, 2 days, 3 days...
 * Arabic (6 grammatical forms):
 * - 0: 0 يوم
 * - 1: يوم واحد
 * - 2: يومان
 * - 3-10: ٣ أيام (few)
 * - 11-99: ١٥ يوماً (many)
 * - 100+: ١٠٠ يوم (other)
 */
export function duration(days: number, locale: Locale | string = "ar"): string {
  const count = Math.max(0, Math.round(days))
  const isEn = locale === "en"

  if (isEn) {
    return count === 1 ? "1 day" : `${count} days`
  }

  // Arabic ICU Plurals
  if (count === 0) return "0 يوم"
  if (count === 1) return "يوم واحد"
  if (count === 2) return "يومان"

  const mod100 = count % 100
  if (mod100 >= 3 && mod100 <= 10) {
    return `${number(count, "ar")} أيام`
  }
  if (mod100 >= 11 && mod100 <= 99) {
    return `${number(count, "ar")} يوماً`
  }
  return `${number(count, "ar")} يوم`
}

/**
 * Format rating with locale digits and ICU plural verified reviews.
 * e.g. "4.9 / 5" in en, "٤٫٩ / ٥" in ar
 */
export function rating(score: number, locale: Locale | string = "ar"): string {
  const isEn = locale === "en"
  const formattedScore = isEn
    ? score.toFixed(1)
    : number(score, "ar", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const maxScore = isEn ? "5" : "٥"
  return `${formattedScore} / ${maxScore}`
}

/**
 * Format verified reviews count with ICU plural.
 * e.g. "(1 verified review)", "(2 verified reviews)"
 * ar: "(مراجعة واحدة موثقة)", "(مراجعتان موثقتان)", "(٣ مراجعات موثقة)"
 */
export function verifiedReviewsCount(
  count: number,
  locale: Locale | string = "ar"
): string {
  const isEn = locale === "en"
  if (isEn) {
    return count === 1 ? "(1 verified review)" : `(${count} verified reviews)`
  }

  if (count === 0) return "(لا توجد مراجعات بعد)"
  if (count === 1) return "(مراجعة واحدة موثقة)"
  if (count === 2) return "(مراجعتان موثقتان)"

  const mod100 = count % 100
  if (mod100 >= 3 && mod100 <= 10) {
    return `(${number(count, "ar")} مراجعات موثقة)`
  }
  return `(${number(count, "ar")} مراجعة موثقة)`
}
