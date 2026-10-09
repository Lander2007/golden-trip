import puppeteer from "puppeteer-core"
import path from "path"
import fs from "fs"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const ARTIFACTS_DIR = "C:\\Users\\kaled\\.gemini\\antigravity-ide\\brain\\473575f1-94ba-4f58-9c33-c3a30a5d0623"

const VIEWPORTS = [
  { name: "desktop_1440", width: 1440, height: 900 },
  { name: "tablet_1024", width: 1024, height: 768 },
  { name: "tablet_768", width: 768, height: 1024 },
  { name: "mobile_390", width: 390, height: 844 },
]

async function main() {
  console.log("Launching Chrome at:", CHROME_PATH)
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  })

  const results = []

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing Viewport ${vp.name} (${vp.width}x${vp.height}) ---`)
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height })

    await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 })
    // Wait for animations to settle
    await new Promise((r) => setTimeout(r, 1500))

    const audit = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth
      const winW = window.innerWidth
      const hasHorizontalScroll = docW > winW

      // Check pictograms in Why Golden Trip
      const pictograms = Array.from(document.querySelectorAll("#why-golden-trip svg"))
      const picInfo = pictograms.map((svg) => {
        const rect = svg.getBoundingClientRect()
        return {
          tag: svg.tagName,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          ariaLabel: svg.getAttribute("aria-label"),
        }
      })

      // Check scenes
      const scenes = ["hero", "welcome", "how-it-works", "destinations", "why-golden-trip", "ready"]
      const sceneRects = scenes.map((id) => {
        const el = document.getElementById(id)
        if (!el) return { id, found: false }
        const r = el.getBoundingClientRect()
        return {
          id,
          found: true,
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
        }
      })

      return {
        docW,
        winW,
        hasHorizontalScroll,
        picInfo,
        sceneRects,
      }
    })

    console.log(`Horizontal overflow: ${audit.hasHorizontalScroll ? "YES (ERROR)" : "NO (OK)"} (${audit.docW}px vs ${audit.winW}px)`)
    console.log("Pictograms detected:", audit.picInfo.length, JSON.stringify(audit.picInfo))

    // Capture screenshots
    const screenshotPath = path.join(ARTIFACTS_DIR, `audit_${vp.name}.png`)
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log(`Saved screenshot: ${screenshotPath}`)

    // Scroll to #why-golden-trip to check pictograms
    await page.evaluate(() => {
      const el = document.getElementById("why-golden-trip")
      if (el) el.scrollIntoView()
    })
    await new Promise((r) => setTimeout(r, 1200))
    const whyPicPath = path.join(ARTIFACTS_DIR, `audit_${vp.name}_why.png`)
    await page.screenshot({ path: whyPicPath, fullPage: false })

    // Scroll to #ready to check final CTA
    await page.evaluate(() => {
      const el = document.getElementById("ready")
      if (el) el.scrollIntoView()
    })
    await new Promise((r) => setTimeout(r, 1200))
    const readyPath = path.join(ARTIFACTS_DIR, `audit_${vp.name}_ready.png`)
    await page.screenshot({ path: readyPath, fullPage: false })

    results.push({ viewport: vp, audit })
    await page.close()
  }

  await browser.close()
  console.log("\nAudit complete! Writing audit_summary.json...")
  fs.writeFileSync(path.join(ARTIFACTS_DIR, "audit_summary.json"), JSON.stringify(results, null, 2))
}

main().catch((err) => {
  console.error("Audit failed:", err)
  process.exit(1)
})
