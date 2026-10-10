export type Locale = "en" | "ar"

export interface LocalizedString {
  en: string
  ar: string
}

export interface LocalizedList {
  en: string[]
  ar: string[]
}

export type VehicleCategory = "economy" | "sedan" | "suv" | "luxury" | "family_van"
export type TransmissionType = "automatic" | "manual"
export type FuelType = "petrol" | "diesel" | "hybrid" | "electric"
export type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled"

/**
 * Resolves a bilingual field for the active locale.
 *
 * Requirements:
 * - If the value for the active locale is missing:
 *   - In development, tests, and CI: throws an Error.
 *   - In production: logs an error and returns the fallback string.
 * - Callers rendering fallback in production should apply `data-missing-translation="true"`.
 */
export function pick(
  field: LocalizedString | null | undefined,
  locale: Locale | string = "ar"
): string {
  const normLocale = (locale === "en" ? "en" : "ar") as Locale
  const otherLocale: Locale = normLocale === "en" ? "ar" : "en"

  if (!field) {
    const errorMsg = `[i18n:pick] Missing LocalizedString object for locale "${normLocale}".`
    if (process.env.NODE_ENV !== "production") {
      throw new Error(errorMsg)
    }
    console.error(errorMsg)
    return ""
  }

  const val = field[normLocale]
  if (typeof val === "string" && val.trim().length > 0) {
    return val
  }

  // Active locale value is missing
  const fallback = field[otherLocale] || ""
  const errorMsg = `[i18n:pick] Translation missing for locale "${normLocale}" (has fallback: "${fallback}").`

  if (process.env.NODE_ENV !== "production") {
    throw new Error(errorMsg)
  }

  console.error(errorMsg)
  return fallback
}

/**
 * Resolves an array of localized strings (e.g. equipment list).
 */
export function pickList(
  field: LocalizedList | LocalizedString[] | null | undefined,
  locale: Locale | string = "ar"
): string[] {
  const normLocale = (locale === "en" ? "en" : "ar") as Locale
  if (!field) return []

  if (Array.isArray(field)) {
    return field.map((item) => pick(item, normLocale))
  }

  const val = field[normLocale]
  if (Array.isArray(val) && val.length > 0) {
    return val
  }

  const fallback = field[normLocale === "en" ? "ar" : "en"] || []
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`[i18n:pickList] Missing list for locale "${normLocale}".`)
  }
  return fallback
}
