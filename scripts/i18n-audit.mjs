import { chromium } from "playwright"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, "..")

const BASE_URL = process.env.TEST_URL || "http://localhost:3000"

const ARABIC_CHAR_REGEX = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
const ARABIC_DIGIT_REGEX = /[\u0660-\u0669\u06F0-\u06F9]/

// Offender collection
const offenders = []

async function auditPage(page, routePath) {
  const url = `${BASE_URL}${routePath}`
  console.log(`Auditing: ${url}`)
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 })
    await page.waitForTimeout(600)

    const title = await page.title()
    if (ARABIC_CHAR_REGEX.test(title) || ARABIC_DIGIT_REGEX.test(title)) {
      offenders.push({
        route: routePath,
        selector: "<title>",
        text: title,
        type: "Document Title",
      })
    }

    const matches = await page.evaluate(() => {
      const arCharRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/
      const arDigitRegex = /[\u0660-\u0669\u06F0-\u06F9]/
      const found = []

      // Helper to check string
      function check(str, sel, nodeType) {
        if (!str || typeof str !== "string") return
        if (arCharRegex.test(str) || arDigitRegex.test(str)) {
          // Ignore elements explicitly designated as original user-generated content
          found.push({
            selector: sel,
            text: str.trim(),
            nodeType,
          })
        }
      }

      // 1. Text nodes
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
      let node
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim()
        if (text) {
          const parent = node.parentElement
          if (parent && !parent.closest("[data-ugc-original='true']")) {
            const tag = parent.tagName.toLowerCase()
            const cls = parent.className ? `.${parent.className.split(" ")[0]}` : ""
            check(text, `${tag}${cls}`, "TextNode")
          }
        }
      }

      // 2. Attributes: aria-label, alt, placeholder, title
      const allElements = document.querySelectorAll("*")
      allElements.forEach((el) => {
        if (el.closest("[data-ugc-original='true']")) return
        const tag = el.tagName.toLowerCase()
        const id = el.id ? `#${el.id}` : ""

        if (el.hasAttribute("aria-label")) {
          check(el.getAttribute("aria-label"), `${tag}${id}[aria-label]`, "aria-label")
        }
        if (el.hasAttribute("alt")) {
          check(el.getAttribute("alt"), `${tag}${id}[alt]`, "alt")
        }
        if (el.hasAttribute("placeholder")) {
          check(el.getAttribute("placeholder"), `${tag}${id}[placeholder]`, "placeholder")
        }
        if (el.hasAttribute("title")) {
          check(el.getAttribute("title"), `${tag}${id}[title]`, "title")
        }
      })

      return found
    })

    for (const m of matches) {
      offenders.push({
        route: routePath,
        selector: m.selector,
        text: m.text,
        type: m.nodeType,
      })
    }
  } catch (err) {
    console.warn(`Could not audit route ${routePath}:`, err.message)
  }
}

async function runAudit() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  })

  // Pre-seed demo login state in localStorage
  await context.addInitScript(() => {
    localStorage.setItem(
      "gt_prototype_user",
      JSON.stringify({
        id: "user-demo-1",
        name: "Ahmed Mahmoud El-Naggar",
        email: "demo@example.com",
        phone: "010 1234 5678",
        nationalId: "29508140102345",
        licenseNumber: "DL-EGY-89420",
      })
    )
  })

  const page = await context.newPage()

  // 1. Fleet route
  await auditPage(page, "/en/cars")

  // 2. All 14 vehicle detail routes
  for (let i = 1; i <= 14; i++) {
    await auditPage(page, `/en/cars/car-${i}`)
  }

  // 3. Direct booking route
  await auditPage(page, "/en/booking/car-1")

  // 4. My Bookings route
  await auditPage(page, "/en/my-bookings")

  console.log(`\n========================================`)
  console.log(`TOTAL OFFENDERS FOUND: ${offenders.length}`)
  console.log(`========================================`)

  await browser.close()
}

// Export for CLI or direct execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAudit().catch(console.error)
}
