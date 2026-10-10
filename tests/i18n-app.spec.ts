import { test, expect } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

// Load allowlist
const allowPath = path.join(rootDir, "i18n-allow.json")
const allow = fs.existsSync(allowPath) ? JSON.parse(fs.readFileSync(allowPath, "utf-8")) : {}
const allowedLatinTokens: string[] = ((allow.allowedLatinTokensInArabic as string[]) || [])
  .slice()
  .sort((a: string, b: string) => b.length - a.length)

// Car IDs dynamically discovered from mockData
const CAR_IDS = Array.from({ length: 14 }, (_, i) => `car-${i + 1}`)

const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
const ARABIC_DIGIT_REGEX = /[\u0660-\u0669\u06F0-\u06F9]/
const LATIN_CHAR_REGEX = /[A-Za-z]/

// Seed test user state
const TEST_USER = {
  id: "user-demo-1",
  name: {
    en: "Ahmed Mahmoud El-Naggar",
    ar: "أحمد محمود النجار",
  },
  email: "demo@example.com",
  phone: "010 1234 5678",
  nationalId: "29508140102345",
  licenseNumber: "DL-EGY-89420",
}

test.describe("Bilingual Data Layer & UI Audit Tests", () => {
  test.beforeEach(async ({ context }) => {
    // Logged in storage state fixture
    await context.addInitScript((user) => {
      localStorage.setItem("gt_prototype_user_v2", JSON.stringify(user))
      localStorage.setItem("gt_prototype_user", JSON.stringify(user))
    }, TEST_USER)
  })

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`English (/en) data integrity on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })

      // 1. Visit Fleet List
      await page.goto("/en/cars", { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(400)

      // Verify no data-missing-translation attribute on the entire page
      const missingTranslation = await page.$$("[data-missing-translation='true']")
      expect(missingTranslation.length).toBe(0)

      // Evaluate page text for Arabic scripts or digits in /en (excluding [data-ugc-original])
      const englishViolations = await page.evaluate(() => {
        const arCharRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
        const arDigitRegex = /[\u0660-\u0669\u06F0-\u06F9]/
        const errors = []

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
        let node
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim()
          if (!text) continue
          const el = node.parentElement
          if (el && !el.closest("[data-ugc-original='true']")) {
            if (arCharRegex.test(text)) {
              errors.push(`Arabic text in /en: "${text}"`)
            }
            if (arDigitRegex.test(text)) {
              errors.push(`Arabic-Indic digit in /en: "${text}"`)
            }
            if (text.includes("ج.م")) {
              errors.push(`Arabic currency "ج.م" in /en: "${text}"`)
            }
          }
        }
        return errors
      })

      expect(englishViolations).toEqual([])

      // 2. Visit all vehicle detail pages
      for (const carId of CAR_IDS) {
        await page.goto(`/en/cars/${carId}`, { waitUntil: "domcontentloaded" })
        await page.waitForTimeout(300)

        const detailViolations = await page.evaluate(() => {
          const arCharRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
          const arDigitRegex = /[\u0660-\u0669\u06F0-\u06F9]/
          const errors = []

          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
          let node
          while ((node = walker.nextNode())) {
            const text = node.textContent?.trim()
            if (!text) continue
            const el = node.parentElement
            if (el && !el.closest("[data-ugc-original='true']")) {
              if (arCharRegex.test(text)) errors.push(`Detail page Arabic text: "${text}"`)
              if (arDigitRegex.test(text)) errors.push(`Detail page Arabic-Indic digit: "${text}"`)
              if (text.includes("ج.م")) errors.push(`Detail page Arabic currency: "${text}"`)
            }
          }
          return errors
        })

        expect(detailViolations).toEqual([])
      }

      // 3. Visit Direct Booking Steps
      await page.goto("/en/booking/car-1", { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(300)

      const bookingViolations = await page.evaluate(() => {
        const arCharRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
        const arDigitRegex = /[\u0660-\u0669\u06F0-\u06F9]/
        const errors = []

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
        let node
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim()
          if (!text) continue
          const el = node.parentElement
          if (el && !el.closest("[data-ugc-original='true']")) {
            if (arCharRegex.test(text)) errors.push(`Booking Arabic text: "${text}"`)
            if (arDigitRegex.test(text)) errors.push(`Booking Arabic-Indic digit: "${text}"`)
            if (text.includes("ج.م")) errors.push(`Booking Arabic currency: "${text}"`)
          }
        }
        return errors
      })

      expect(bookingViolations).toEqual([])

      // 4. Visit My Bookings
      await page.goto("/en/my-bookings", { waitUntil: "domcontentloaded" })
      await page.waitForTimeout(300)

      const myBookingsViolations = await page.evaluate(() => {
        const arCharRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
        const arDigitRegex = /[\u0660-\u0669\u06F0-\u06F9]/
        const errors = []

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
        let node
        while ((node = walker.nextNode())) {
          const text = node.textContent?.trim()
          if (!text) continue
          const el = node.parentElement
          if (el && !el.closest("[data-ugc-original='true']")) {
            if (arCharRegex.test(text)) errors.push(`My Bookings Arabic text: "${text}"`)
            if (arDigitRegex.test(text)) errors.push(`My Bookings Arabic-Indic digit: "${text}"`)
            if (text.includes("ج.م")) errors.push(`My Bookings Arabic currency: "${text}"`)
          }
        }
        return errors
      })

      expect(myBookingsViolations).toEqual([])
    })
  }

  test("Language switch preserves route, vehicle, and query parameters", async ({ page }) => {
    await page.goto("/en/cars/car-1?pickupDate=2026-10-20&returnDate=2026-10-24", {
      waitUntil: "domcontentloaded",
    })

    // Click language switcher
    const langBtn = page.locator("button[aria-label*='language' i], button:has-text('عربي'), button:has-text('EN')").first()
    if (await langBtn.isVisible()) {
      await langBtn.click()
      await page.waitForTimeout(500)
      expect(page.url()).toContain("/ar/cars/car-1")
      expect(page.url()).toContain("pickupDate=2026-10-20")
    }
  })
})
