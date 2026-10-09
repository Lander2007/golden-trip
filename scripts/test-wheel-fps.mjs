import puppeteer from "puppeteer-core"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

async function runWheelFps() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto("http://localhost:3000", { waitUntil: "load" })
  await new Promise((r) => setTimeout(r, 1500))

  await page.evaluate(() => {
    window.__frameTimes = []
    let last = performance.now()
    window.__perfRunning = true

    function raf(t) {
      window.__frameTimes.push(t - last)
      last = t
      if (window.__perfRunning) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  })

  console.log("Simulating natural mouse wheel scrolling...")
  // Natural wheel scroll
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel({ deltaY: 150 })
    await new Promise((r) => setTimeout(r, 60))
  }

  // Settle
  await new Promise((r) => setTimeout(r, 1000))

  const results = await page.evaluate(() => {
    window.__perfRunning = false
    const frameTimes = window.__frameTimes
    const valid = frameTimes.filter((d) => d > 0 && d < 200)
    const avg = valid.reduce((a, b) => a + b, 0) / valid.length
    const fps = Math.round(1000 / avg)
    const longFrames = frameTimes.filter((d) => d > 50).length
    return {
      fps,
      avgMs: Math.round(avg * 10) / 10,
      longFrames,
      totalFrames: frameTimes.length,
    }
  })

  console.log("Natural Wheel Scroll Performance:")
  console.log(JSON.stringify(results, null, 2))

  await browser.close()
}

runWheelFps().catch(console.error)
