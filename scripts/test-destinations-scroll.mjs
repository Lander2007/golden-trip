import puppeteer from "puppeteer-core"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log("Navigating to http://localhost:3000...")
  await page.goto("http://localhost:3000", { waitUntil: "networkidle2" })
  await new Promise((r) => setTimeout(r, 2000))

  // Scroll to #destinations
  console.log("Scrolling to #destinations...")
  await page.evaluate(() => {
    const el = document.getElementById("destinations")
    if (el) el.scrollIntoView({ behavior: "instant" })
  })
  await new Promise((r) => setTimeout(r, 1500))

  await page.screenshot({ path: "destinations-start.png" })
  console.log("Captured destinations-start.png")

  // Scroll down by 600px to reach Cairo / Sharm
  console.log("Scrolling down 600px...")
  await page.mouse.wheel({ deltaY: 600 })
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: "destinations-mid.png" })
  console.log("Captured destinations-mid.png")

  // Scroll down another 600px to reach Hurghada / Luxor
  console.log("Scrolling down another 600px...")
  await page.mouse.wheel({ deltaY: 600 })
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: "destinations-late.png" })
  console.log("Captured destinations-late.png")

  // Scroll down another 600px to reach Aswan
  console.log("Scrolling down another 600px...")
  await page.mouse.wheel({ deltaY: 600 })
  await new Promise((r) => setTimeout(r, 1200))
  await page.screenshot({ path: "destinations-aswan.png" })
  console.log("Captured destinations-aswan.png")

  // Test waypoint clicking
  console.log("Testing waypoint button 3 click (Sharm)...")
  await page.evaluate(() => {
    const buttons = document.querySelectorAll("button[aria-label*='Sharm']")
    if (buttons.length > 0) {
      buttons[0].click()
    }
  })
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: "destinations-sharm-clicked.png" })
  console.log("Captured destinations-sharm-clicked.png")

  await browser.close()
  console.log("Test finished successfully!")
}

run().catch(console.error)
