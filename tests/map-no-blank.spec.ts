import { test, expect } from "@playwright/test"

const CASES = [
  { locale: "en", width: 1440, height: 900, name: "desktop-en" },
  { locale: "ar", width: 1440, height: 900, name: "desktop-ar" },
  { locale: "en", width: 390, height: 844, name: "mobile-en" },
  { locale: "ar", width: 390, height: 844, name: "mobile-ar" },
]

for (const { locale, width, height, name } of CASES) {
  test(`map section does not blank or jump on scroll (${name})`, async ({ page }) => {
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

    // Determine target range: from start of map section through end of destinations list
    const range = await page.evaluate(() => {
      const trigger = (window as any).ScrollTrigger?.getById("destinations-pin")
      const map = document.getElementById("destinations")
      const list = document.querySelector(".destination-card, [data-scene='2-list'], #destinations ~ section")
      const scrollY = window.scrollY
      const mapRect = map?.getBoundingClientRect()
      const mapStart = trigger ? trigger.start : (mapRect ? mapRect.top + scrollY : 2880)
      const listBottom = list ? list.getBoundingClientRect().bottom + scrollY : mapStart + 3500
      return { mapStart: Math.max(0, mapStart), end: listBottom + 100 }
    })

    // Scroll to the start of the map section, syncing Lenis if active
    await page.evaluate((y) => {
      const lenis = (window as any).__lenis
      if (lenis) {
        lenis.scrollTo(y, { immediate: true })
      } else {
        window.scrollTo(0, y)
      }
    }, range.mapStart)
    await page.waitForTimeout(500)

    const centerX = width / 2
    const centerY = height / 2

    // Helper to evaluate all 4 assertions at current state
    const assertFrameState = async (stepInfo: string, isDownward: boolean, lastScrollY: number) => {
      return await page.evaluate(
        ({ cx, cy, isDown, prevY, vWidth, vHeight, step }) => {
          const currentY = window.scrollY

          // Assertion 3: scroll jumping and direction consistency
          if (isDown) {
            if (currentY < prevY - 2) {
              return {
                ok: false,
                reason: `Backward scroll jump at ${step}: prevY=${prevY}, currentY=${currentY}`,
              }
            }
            if (currentY - prevY > 800) {
              return {
                ok: false,
                reason: `Excessive forward scroll jump at ${step}: prevY=${prevY}, currentY=${currentY}`,
              }
            }
          } else {
            if (Math.abs(currentY - prevY) > 800) {
              return {
                ok: false,
                reason: `Excessive scroll jump during upward scroll at ${step}: prevY=${prevY}, currentY=${currentY}`,
              }
            }
          }

          // Assertion 1: Center element must be inside an element with [data-scene]
          const centerEl = document.elementFromPoint(cx, cy)
          if (!centerEl) {
            return { ok: false, reason: `No element at center (${cx}, ${cy}) at scrollY=${currentY}` }
          }

          const sceneContainer = centerEl.closest("[data-scene]")
          if (!sceneContainer) {
            const tag = centerEl.tagName
            const cls = centerEl.className
            return {
              ok: false,
              reason: `Center element <${tag} class="${cls}"> is NOT inside a [data-scene] container at scrollY=${currentY} (${step})`,
            }
          }

          // Assertion 2: No fixed or sticky overlay >80% viewport area and >0.5 opacity sits above scenes (except navbar)
          const fixedElements = document.querySelectorAll<HTMLElement>(
            "[class*='fixed'], [class*='sticky'], .vignette, .film-grain, [style*='fixed'], [style*='sticky']"
          )
          for (let i = 0; i < fixedElements.length; i++) {
            const el = fixedElements[i]
            if (el.tagName === "HEADER" || el.closest("header") || el.id === "navbar") continue
            const cs = window.getComputedStyle(el)
            if (cs.position === "fixed" || cs.position === "sticky") {
              const r = el.getBoundingClientRect()
              const area = r.width * r.height
              const vpArea = vWidth * vHeight
              const opacity = parseFloat(cs.opacity || "1")
              const zIndex = parseInt(cs.zIndex || "0", 10)
              if (area > 0.8 * vpArea && opacity > 0.5 && zIndex > 10 && cs.display !== "none" && cs.visibility !== "hidden") {
                return {
                  ok: false,
                  reason: `Disallowed overlay <${el.tagName} class="${el.className}"> with area ${(area / vpArea).toFixed(2)} and opacity ${opacity} above scenes (zIndex=${zIndex})`,
                }
              }
            }
          }

          // Assertion 4: While the map scene's wrapper is pinned, its height equals viewport height
          const mapScene = document.getElementById("destinations")
          if (mapScene) {
            const cs = window.getComputedStyle(mapScene)
            if (cs.position === "fixed") {
              const mr = mapScene.getBoundingClientRect()
              if (Math.abs(mr.height - vHeight) > 3) {
                return {
                  ok: false,
                  reason: `Map scene pinned height ${mr.height} != viewport height ${vHeight} at scrollY=${currentY}`,
                }
              }
            }
          }

          return { ok: true, currentY }
        },
        {
          cx: centerX,
          cy: centerY,
          isDown: isDownward,
          prevY: lastScrollY,
          vWidth: width,
          vHeight: height,
          step: stepInfo,
        }
      )
    }

    let lastScrollY = await page.evaluate(() => window.scrollY)

    // Wheel DOWN from map start through destinations list in 40px steps
    let stepCount = 0
    let reachedEnd = false
    while (!reachedEnd && stepCount < 200) {
      await page.mouse.wheel(0, 40)
      await page.waitForTimeout(25)

      stepCount++
      const res = await assertFrameState(`down-step-${stepCount}`, true, lastScrollY)
      expect(res.ok, res.reason).toBe(true)
      lastScrollY = res.currentY as number

      reachedEnd = await page.evaluate(
        (max) => window.scrollY >= max || window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50,
        range.end
      )
    }

    // Settle momentum before reversing scroll direction
    await page.waitForTimeout(400)
    lastScrollY = await page.evaluate(() => window.scrollY)

    // Wheel back UP to the map start in 40px steps
    let upStepCount = 0
    let reachedTop = false
    while (!reachedTop && upStepCount < 200) {
      await page.mouse.wheel(0, -40)
      await page.waitForTimeout(25)

      upStepCount++
      const res = await assertFrameState(`up-step-${upStepCount}`, false, lastScrollY)
      expect(res.ok, res.reason).toBe(true)
      lastScrollY = res.currentY as number

      reachedTop = await page.evaluate((min) => window.scrollY <= min, range.mapStart)
    }
  })
}
