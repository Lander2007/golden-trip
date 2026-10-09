import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  const messages = (await import(`../messages/${locale}.json`)).default

  return {
    locale,
    messages,
    onError(error) {
      throw error
    },
    getMessageFallback({ key }) {
      throw new Error(`Missing translation message for key: "${key}" in locale: "${locale}"`)
    },
  }
})
