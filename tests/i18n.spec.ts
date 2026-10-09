import { test, expect } from "@playwright/test"
import fs from "fs"
import path from "path"

const allowConfig = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "i18n-allow.json"), "utf8")
)

const allowedLatinTokens: string[] = (
  allowConfig.allowedLatinTokensInArabic || []
).sort((a: string, b: string) => b.length - a.length)

const allowedArabicTokens: string[] = (
  allowConfig.allowedArabicTokensInEnglish || []
).sort((a: string, b: string) => b.length - a.length)

const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/

function cleanAndCheckLatin(text: string): { isValid: boolean; remainingLatin: string; stripped: string } {
  let s = text
  for (const token of allowedLatinTokens) {
    s = s.split(token).join(" ")
  }
  // Remove URLs, tel protocols, email addresses, and standard digit patterns
  s = s.replace(/https?:\/\/[^\s]+/g, " ")
  s = s.replace(/tel:[^\s]+/g, " ")
  s = s.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, " ")

  const match = s.match(/[A-Za-z]/g)
  if (match) {
    return {
      isValid: false,
      remainingLatin: [...new Set(match)].join(""),
      stripped: s,
    }
  }
  return { isValid: true, remainingLatin: "", stripped: s }
}

function cleanAndCheckArabic(text: string): { isValid: boolean; remainingArabic: string } {
  let s = text
  for (const token of allowedArabicTokens) {
    s = s.split(token).join(" ")
  }
  const match = s.match(arabicRegex)
  if (match) {
    return {
      isValid: false,
      remainingArabic: match.join(""),
    }
  }
  return { isValid: true, remainingArabic: "" }
}

const routes = [
  { path: "/en", locale: "en" },
  { path: "/ar", locale: "ar" },
  { path: "/en/login", locale: "en" },
  { path: "/ar/login", locale: "ar" },
  { path: "/en/signup", locale: "en" },
  { path: "/ar/signup", locale: "ar" },
  { path: "/en/404", locale: "en" },
  { path: "/ar/404", locale: "ar" },
]

const viewports = [
  { width: 390, height: 844, name: "mobile-390" },
  { width: 1440, height: 900, name: "desktop-1440" },
]

test.describe("i18n Verification Suite", () => {
  test.beforeAll(() => {
    const shotsDir = path.resolve(process.cwd(), "tests/shots-i18n")
    if (!fs.existsSync(shotsDir)) {
      fs.mkdirSync(shotsDir, { recursive: true })
    }
  })

  for (const vp of viewports) {
    for (const r of routes) {
      test(`${r.locale.toUpperCase()} route ${r.path} @ ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height })
        await page.goto(r.path, { waitUntil: "load" })
        await page.waitForTimeout(300)

        // 1. Validate html lang and dir
        const html = page.locator("html")
        await expect(html).toHaveAttribute("lang", r.locale)
        await expect(html).toHaveAttribute("dir", r.locale === "ar" ? "rtl" : "ltr")

        // 2. Validate horizontal overflow
        const isOverflowing = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        })
        expect(isOverflowing).toBe(false)

        // 3. Collect visible text nodes + key attributes
        const collectedItems = await page.evaluate(() => {
          const items: { type: string; value: string }[] = []

          if (document.title) {
            items.push({ type: "title", value: document.title })
          }

          const metaDesc = document
            .querySelector('meta[name="description"]')
            ?.getAttribute("content")
          if (metaDesc) {
            items.push({ type: "meta-description", value: metaDesc })
          }

          const all = Array.from(document.querySelectorAll("body *"))
          for (const el of all) {
            const tag = el.tagName.toLowerCase()
            if (["script", "style", "noscript", "template"].includes(tag)) continue

            const style = window.getComputedStyle(el)
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              style.opacity === "0"
            ) {
              continue
            }

            for (const attr of ["aria-label", "alt", "placeholder", "title"]) {
              const val = el.getAttribute(attr)
              if (val && val.trim()) {
                items.push({ type: `attr:${attr}`, value: val })
              }
            }

            for (const child of Array.from(el.childNodes)) {
              if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent?.trim()
                if (text) {
                  items.push({ type: "text", value: text })
                }
              }
            }
          }
          return items
        })

        // 4. Validate script constraints
        if (r.locale === "en") {
          const violations: any[] = []
          for (const item of collectedItems) {
            const res = cleanAndCheckArabic(item.value)
            if (!res.isValid) {
              violations.push({ item, remainingArabic: res.remainingArabic })
            }
          }
          expect(violations).toEqual([])
        } else {
          const violations: any[] = []
          for (const item of collectedItems) {
            const res = cleanAndCheckLatin(item.value)
            if (!res.isValid) {
              violations.push({ item, remainingLatin: res.remainingLatin, stripped: res.stripped })
            }
          }
          expect(violations).toEqual([])
        }

        // 5. Save screenshot
        const cleanName = r.path.replace(/\//g, "-").replace(/^-/, "") || "root"
        await page.screenshot({
          path: path.resolve(
            process.cwd(),
            `tests/shots-i18n/${cleanName}-${vp.width}x${vp.height}.png`
          ),
          fullPage: false,
        })
      })
    }
  }

  test("Signup empty form validation messages conform to locale script", async ({ page }) => {
    // English signup validation
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/en/signup", { waitUntil: "networkidle" })
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(400)

    let enErrors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("p, span, div"))
        .filter((el) => {
          const text = el.textContent || ""
          const style = window.getComputedStyle(el)
          return (
            (el.className.includes("text-red") || el.className.includes("text-rose")) &&
            style.display !== "none" &&
            text.trim().length > 0
          )
        })
        .map((el) => el.textContent?.trim() || "")
    })
    for (const msg of enErrors) {
      expect(arabicRegex.test(msg)).toBe(false)
    }

    // Arabic signup validation
    await page.goto("/ar/signup", { waitUntil: "networkidle" })
    await page.locator('button[type="submit"]').click()
    await page.waitForTimeout(400)

    let arErrors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("p, span, div"))
        .filter((el) => {
          const text = el.textContent || ""
          const style = window.getComputedStyle(el)
          return (
            (el.className.includes("text-red") || el.className.includes("text-rose")) &&
            style.display !== "none" &&
            text.trim().length > 0
          )
        })
        .map((el) => el.textContent?.trim() || "")
    })

    for (const msg of arErrors) {
      const res = cleanAndCheckLatin(msg)
      expect(res.isValid).toBe(true)
    }
  })

  test("Language switcher flips locale, dir, and preserves section/scroll position", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/en", { waitUntil: "load" })
    await page.waitForTimeout(500)

    // Scroll down to why-golden-trip section
    await page.evaluate(() => {
      const el = document.getElementById("why-golden-trip")
      if (el) el.scrollIntoView({ behavior: "instant" })
      else window.scrollTo({ top: 1200, behavior: "instant" })
    })
    await page.waitForTimeout(300)

    const initialScrollY = await page.evaluate(() => window.scrollY)
    expect(initialScrollY).toBeGreaterThan(100)

    // Click language switcher to Arabic
    const switcherAr = page.locator('a[lang="ar"]').first()
    await switcherAr.click()

    await page.waitForURL(/\/ar/)
    await page.waitForTimeout(1000)

    // Assert URL has /ar prefix
    expect(page.url()).toContain("/ar")

    // Assert dir flipped to rtl
    const dir = await page.locator("html").getAttribute("dir")
    expect(dir).toBe("rtl")

    // Assert scroll position / section is preserved
    const newScrollY = await page.evaluate(() => window.scrollY)
    expect(newScrollY).toBeGreaterThan(100)
  })
})
