import { test, expect } from "@playwright/test"
import fs from "fs"
import path from "path"

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop-1440" },
  { width: 1024, height: 768, name: "desktop-1024" },
  { width: 768, height: 1024, name: "tablet-768" },
  { width: 390, height: 844, name: "mobile-390" },
]

const LOCALES = ["en", "ar"] as const

const STATIONS = [
  { id: "alexandria", progress: 0.0, nameEn: "Alexandria", nameAr: "الإسكندرية" },
  { id: "cairo", progress: 0.1728, nameEn: "Cairo", nameAr: "القاهرة" },
  { id: "sharm", progress: 0.5346, nameEn: "Sharm El Sheikh", nameAr: "شرم الشيخ" },
  { id: "hurghada", progress: 0.6398, nameEn: "Hurghada", nameAr: "الغردقة" },
  { id: "luxor", progress: 0.8350, nameEn: "Luxor", nameAr: "الأقصر" },
  { id: "aswan", progress: 1.0, nameEn: "Aswan", nameAr: "أسوان" },
]

// Ensure screenshot directory exists
const SHOTS_DIR = path.join(process.cwd(), "tests", "shots-map-labels")
if (!fs.existsSync(SHOTS_DIR)) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true })
}

for (const { width, height, name: vpName } of VIEWPORTS) {
  for (const locale of LOCALES) {
    test(`map section labels and typography (${locale} - ${vpName})`, async ({ page }) => {
      test.setTimeout(180000)
      await page.setViewportSize({ width, height })
      await page.goto(`/${locale}`, { waitUntil: "load" })
      await page.waitForLoadState("networkidle")

      // Wait for hydration and pinned ScrollTrigger setup
      if (width >= 768) {
        await page.waitForFunction(
          () => Boolean((window as any).ScrollTrigger?.getById("destinations-pin")),
          { timeout: 15000 }
        )
      } else {
        await page.waitForSelector("#destinations", { state: "attached" })
      }
      await page.waitForTimeout(600)

      // Exactly ONE label element per city in the DOM
      const labelCount = await page.locator(".map-label").count()
      expect(labelCount, "Must have exactly 6 label elements (one per city)").toBe(6)

      // Test each of the 6 stations
      for (let sIdx = 0; sIdx < STATIONS.length; sIdx++) {
        const station = STATIONS[sIdx]

        // Activate station via scroll or clicking stepper button
        if (width >= 768) {
          await page.evaluate(({ prog }) => {
            const trigger = (window as any).ScrollTrigger?.getById("destinations-pin")
            if (trigger) {
              const targetY = trigger.start + prog * (trigger.end - trigger.start)
              const lenis = (window as any).__lenis
              if (lenis) {
                lenis.scrollTo(targetY, { immediate: true })
              } else {
                window.scrollTo({ top: targetY, behavior: "instant" as ScrollBehavior })
              }
              trigger.scroll(targetY)
              trigger.update()
            }
          }, { prog: station.progress })
        } else {
          // On mobile, scroll map into view and click station button
          await page.evaluate(() => {
            const el = document.getElementById("destinations")
            if (el) el.scrollIntoView({ behavior: "instant" })
          })
          const stepperBtn = page.locator("#destinations .grid-cols-6 button").nth(sIdx)
          if (await stepperBtn.isVisible()) {
            await stepperBtn.click()
          }
        }

        await page.waitForTimeout(300)

        // 1. Mobile vs Desktop visible label count
        if (width < 640) {
          const visibleLabels = await page.locator(".map-label:visible").count()
          expect(visibleLabels, `Mobile below 640px must only show 1 active label for ${station.id}`).toBe(1)
        } else {
          const visibleLabels = await page.locator(".map-label:visible").count()
          expect(visibleLabels, `Desktop/Tablet must have at least 1 visible label`).toBeGreaterThanOrEqual(1)
        }

        // 2. Validate font sizes for all visible labels
        const visibleLabelData = await page.evaluate(() => {
          const labels = Array.from(document.querySelectorAll<HTMLElement>(".map-label"))
            .filter((el) => {
              const style = window.getComputedStyle(el)
              return style.display !== "none" && style.visibility !== "hidden" && parseFloat(style.opacity) > 0.05
            })
          return labels.map((el) => ({
            city: el.dataset.city || "",
            isActive: el.classList.contains("is-active"),
            fontSize: parseFloat(window.getComputedStyle(el).fontSize),
          }))
        })

        for (const lbl of visibleLabelData) {
          if (locale === "en") {
            if (lbl.isActive) {
              expect(lbl.fontSize, `Active label ${lbl.city} size in English`).toBeGreaterThanOrEqual(15.8)
              expect(lbl.fontSize, `Active label ${lbl.city} size in English`).toBeLessThanOrEqual(20.2)
            } else {
              expect(lbl.fontSize, `Inactive label ${lbl.city} size in English`).toBeGreaterThanOrEqual(11.8)
              expect(lbl.fontSize, `Inactive label ${lbl.city} size in English`).toBeLessThanOrEqual(14.2)
            }
          } else {
            if (lbl.isActive) {
              expect(lbl.fontSize, `Active label ${lbl.city} size in Arabic`).toBeGreaterThanOrEqual(17.8)
              expect(lbl.fontSize, `Active label ${lbl.city} size in Arabic`).toBeLessThanOrEqual(21.2)
            } else {
              expect(lbl.fontSize, `Inactive label ${lbl.city} size in Arabic`).toBeGreaterThanOrEqual(12.8)
              expect(lbl.fontSize, `Inactive label ${lbl.city} size in Arabic`).toBeLessThanOrEqual(15.2)
            }
          }
        }

        // 3. No label under 12px anywhere in the section (13px in Arabic)
        const minSizeViolations = await page.evaluate((loc) => {
          const section = document.getElementById("destinations")
          if (!section) return []
          const minAllowed = loc === "ar" ? 12.8 : 11.8
          const violations: string[] = []
          const walker = document.createTreeWalker(section, NodeFilter.SHOW_ELEMENT)
          let node = walker.nextNode()
          while (node) {
            const el = node as HTMLElement
            // Only inspect leaf nodes or nodes with direct non-empty text content
            const directText = Array.from(el.childNodes)
              .filter((n) => n.nodeType === Node.TEXT_NODE)
              .map((n) => n.textContent?.trim())
              .join("")
            if (directText && el.children.length === 0) {
              const size = parseFloat(window.getComputedStyle(el).fontSize)
              if (size < minAllowed) {
                violations.push(`${el.tagName}.${el.className.slice(0, 30)}: ${size}px ("${directText.slice(0, 20)}")`)
              }
            }
            node = walker.nextNode()
          }
          return violations
        }, locale)
        expect(minSizeViolations, `No text under 12px (13px ar) in #destinations`).toEqual([])

        // 4. No collisions between any two visible labels, and none intersects 56px top safe area
        const collisionData = await page.evaluate(() => {
          const frame = document.querySelector(".map-frame") as HTMLElement | null
          if (!frame) return { frameTop: 0, overlaps: [], inSafeArea: [] }
          const frameRect = frame.getBoundingClientRect()
          const safeTop = frameRect.top + 55.5 // 56px top safe area with small subpixel tolerance

          const labels = Array.from(document.querySelectorAll<HTMLElement>(".map-label"))
            .filter((el) => {
              const style = window.getComputedStyle(el)
              return style.display !== "none" && style.visibility !== "hidden" && parseFloat(style.opacity) > 0.05
            })
            .map((el) => {
              const r = el.getBoundingClientRect()
              return {
                city: el.dataset.city || "",
                left: r.left,
                right: r.right,
                top: r.top,
                bottom: r.bottom,
              }
            })

          const inSafeArea: string[] = []
          for (const l of labels) {
            if (l.top < safeTop) {
              inSafeArea.push(`${l.city} top ${l.top.toFixed(1)} < safeArea ${safeTop.toFixed(1)}`)
            }
          }

          const overlaps: string[] = []
          for (let i = 0; i < labels.length; i++) {
            for (let j = i + 1; j < labels.length; j++) {
              const a = labels[i]
              const b = labels[j]
              const intersects = !(
                a.right <= b.left ||
                a.left >= b.right ||
                a.bottom <= b.top ||
                a.top >= b.bottom
              )
              if (intersects) {
                overlaps.push(`${a.city} overlaps with ${b.city}`)
              }
            }
          }

          return { frameTop: frameRect.top, overlaps, inSafeArea }
        })

        expect(collisionData.inSafeArea, `No label inside 56px top safe area for ${station.id}`).toEqual([])
        expect(collisionData.overlaps, `No labels overlap for ${station.id}`).toEqual([])

        // 5. Letter-spacing is EXACTLY 0 for all Arabic text in the section
        if (locale === "ar") {
          const trackingViolations = await page.evaluate(() => {
            const section = document.getElementById("destinations")
            if (!section) return []
            const violations: string[] = []
            const walker = document.createTreeWalker(section, NodeFilter.SHOW_ELEMENT)
            let node = walker.nextNode()
            while (node) {
              const el = node as HTMLElement
              if (el.innerText?.trim()) {
                const ls = window.getComputedStyle(el).letterSpacing
                if (ls !== "0px" && ls !== "normal") {
                  const val = parseFloat(ls)
                  if (Math.abs(val) > 0.01) {
                    violations.push(`${el.tagName}.${el.className.slice(0, 30)}: ${ls}`)
                  }
                }
              }
              node = walker.nextNode()
            }
            return violations
          })
          expect(trackingViolations, "Arabic letter-spacing must be 0").toEqual([])
        }

        // 6. No horizontal overflow
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth + 1
        })
        expect(hasOverflow, "Page must not have horizontal overflow").toBe(false)

        // 7. Save screenshots of all 6 stations at 1440 and 390
        if (width === 1440 || width === 390) {
          const mapSection = page.locator("#destinations")
          const shotPath = path.join(SHOTS_DIR, `${locale}-${width}-${station.id}.png`)
          await mapSection.screenshot({ path: shotPath })
        }
      }
    })
  }
}
