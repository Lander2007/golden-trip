import puppeteer from "puppeteer-core"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

async function runGpuFps() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false, // Windowed with GPU acceleration
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto("http://localhost:3000", { waitUntil: "load" })
  await new Promise((r) => setTimeout(r, 1500))

  // Measure FPS during smooth scroll
  const results = await page.evaluate(async () => {
    let frameTimes = []
    let last = performance.now()
    let running = true

    function raf(t) {
      frameTimes.push(t - last)
      last = t
      if (running) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const totalScroll = document.documentElement.scrollHeight - window.innerHeight
    const start = performance.now()
    const duration = 4000

    return new Promise((resolve) => {
      function scrollStep(t) {
        const progress = Math.min((t - start) / duration, 1)
        window.scrollTo(0, progress * totalScroll)
        if (progress < 1) {
          requestAnimationFrame(scrollStep)
        } else {
          running = false
          const valid = frameTimes.filter((d) => d > 0 && d < 200)
          const avg = valid.reduce((a, b) => a + b, 0) / valid.length
          const fps = Math.round(1000 / avg)
          const longFrames = frameTimes.filter((d) => d > 50).length
          resolve({ fps, avgMs: Math.round(avg * 10) / 10, longFrames, totalFrames: frameTimes.length })
        }
      }
      requestAnimationFrame(scrollStep)
    })
  })

  console.log("Normal Browser (Real GPU Compositing) Scroll Performance:")
  console.log(JSON.stringify(results, null, 2))

  await browser.close()
}

runGpuFps().catch(console.error)
