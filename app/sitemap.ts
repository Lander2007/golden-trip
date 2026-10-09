import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://goldentrip.eg"
  const routes = ["", "/login", "/signup", "/cars", "/my-bookings"]
  const locales = ["en", "ar"]

  const items: MetadataRoute.Sitemap = []

  for (const route of routes) {
    for (const locale of locales) {
      items.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            ar: `${baseUrl}/ar${route}`,
          },
        },
      })
    }
  }

  return items
}
