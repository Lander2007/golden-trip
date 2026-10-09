import puppeteer from "puppeteer-core"
import path from "path"
import fs from "fs"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const ARTIFACTS_DIR = "C:\\Users\\kaled\\.gemini\\antigravity-ide\\brain\\473575f1-94ba-4f58-9c33-c3a30a5d0623"

const VIEWPORTS = [
  { name: "desktop_1920x1080", width: 1920, height: 1080 },
  { name: "desktop_1440x900", width: 1440, height: 900 },
  { name: "short_1440x657", width: 1440, height: 657 },
  { name: "laptop_1366x768", width: 1366, height: 768 },
  { name: "short_1280x720", width: 1280, height: 720 },
  { name: "tablet_1024x768", width: 1024, height: 768 },
  { name: "tablet_768x1024", width: 768, height: 1024 },
  { name: "mobile_390x844", width: 390, height: 844 },
]

async function main() {
  console.log("Starting Phase 7b verification...")
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  })

  const results = []

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing ${vp.name} (${vp.width}x${vp.height}) ---`)
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    await page.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 30000 })

    // Wait for fonts and ResizeObserver to calculate sizes
    await new Promise((r) => setTimeout(r, 1200))

    const heroAudit = await page.evaluate(() => {
      const hero = document.getElementById("alexandria")
      const wordmark = document.querySelector(".hero-wordmark")
      const headline = document.querySelector("h1")
      const bookingBar = document.querySelector(".hero-booking-bar")
      const roadZone = document.querySelector(".road-zone")
      const celestial = document.querySelector(".celestial-wrapper")

      const heroRect = hero ? hero.getBoundingClientRect() : null
      const wordmarkRect = wordmark ? wordmark.getBoundingClientRect() : null
      const bookingRect = bookingBar ? bookingBar.getBoundingClientRect() : null
      const roadRect = roadZone ? roadZone.getBoundingClientRect() : null
      const celestialRect = celestial ? celestial.getBoundingClientRect() : null

      const windowW = window.innerWidth
      const windowH = window.innerHeight

      // Check if booking bar collides with road zone
      let bookingOverlapsRoad = false
      if (bookingRect && roadRect) {
        bookingOverlapsRoad = bookingRect.bottom > roadRect.top
      }

      // Check wordmark width vs window width
      let wordmarkFits = true
      if (wordmarkRect) {
        wordmarkFits = wordmarkRect.width <= windowW + 2
      }

      return {
        windowW,
        windowH,
        heroHeight: heroRect ? Math.round(heroRect.height) : 0,
        bookingBottom: bookingRect ? Math.round(bookingRect.bottom) : 0,
        roadTop: roadRect ? Math.round(roadRect.top) : 0,
        bookingOverlapsRoad,
        wordmarkWidth: wordmarkRect ? Math.round(wordmarkRect.width) : 0,
        wordmarkFits,
        celestialPosition: celestialRect ? {
          x: Math.round(celestialRect.left),
          y: Math.round(celestialRect.top),
          width: Math.round(celestialRect.width),
          height: Math.round(celestialRect.height),
        } : null,
      }
    })

    console.log(`Hero height: ${heroAudit.heroHeight}px (min 620px required)`)
    console.log(`Booking bar bottom: ${heroAudit.bookingBottom}px vs Road zone top: ${heroAudit.roadTop}px`)
    console.log(`Overlap with road zone: ${heroAudit.bookingOverlapsRoad ? "YES (COLLISION!)" : "NO (CLEAN)"}`)
    console.log(`Wordmark width: ${heroAudit.wordmarkWidth}px vs Window: ${heroAudit.windowW}px -> Fits: ${heroAudit.wordmarkFits ? "YES" : "NO"}`)

    // Capture start screenshot
    const shotStart = path.join(ARTIFACTS_DIR, `phase7b_${vp.name}_start.png`)
    await page.screenshot({ path: shotStart })
    console.log(`Captured: ${shotStart}`)

    // If 1440x900, test celestial scroll transition
    if (vp.name === "desktop_1440x900") {
      console.log("\nTesting celestial scroll transition on 1440x900...")
      // Scroll partially through hero pin (approx 40% of hero pin scroll)
      await page.evaluate(() => {
        window.scrollBy(0, 450)
      })
      await new Promise((r) => setTimeout(r, 600))
      const shotMid = path.join(ARTIFACTS_DIR, "phase7b_desktop_1440_mid.png")
      await page.screenshot({ path: shotMid })
      console.log(`Captured mid-scroll: ${shotMid}`)

      // Scroll to end of hero pin (approx 95% of hero pin scroll)
      await page.evaluate(() => {
        window.scrollBy(0, 600)
      })
      await new Promise((r) => setTimeout(r, 600))
      const shotNight = path.join(ARTIFACTS_DIR, "phase7b_desktop_1440_night.png")
      await page.screenshot({ path: shotNight })
      console.log(`Captured night crescent: ${shotNight}`)
    }

    results.push({ vp, heroAudit })
    await page.close()
  }

  await browser.close()
  console.log("\nAll viewports tested! Summary saved.")
}

main().catch(console.error)
