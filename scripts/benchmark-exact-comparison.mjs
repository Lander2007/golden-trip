import puppeteer from "puppeteer-core"
import fs from "fs"
import path from "path"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const ARTIFACTS_DIR = "C:\\Users\\kaled\\.gemini\\antigravity-ide\\brain\\473575f1-94ba-4f58-9c33-c3a30a5d0623"

async function runBenchmark() {
  console.log("Launching headless browser for 1:1 Comparison performance trace...")
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  const client = await page.target().createCDPSession()
  // 4x CPU Throttling (exact same as baseline)
  await client.send("Emulation.setCPUThrottlingRate", { rate: 4 })

  console.log("Navigating to production server http://localhost:3000...")
  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))

  const tracePath = path.join(ARTIFACTS_DIR, "optimized-exact-trace.json")
  console.log("Starting CDP performance trace with 4x CPU throttling...")
  await page.tracing.start({ path: tracePath, screenshots: false })

  // Measure FPS and frame durations during scroll
  await page.evaluate(() => {
    window.__perfFrames = []
    window.__perfLastTime = performance.now()
    function onFrame(now) {
      const delta = now - window.__perfLastTime
      window.__perfFrames.push(delta)
      window.__perfLastTime = now
      if (window.__perfCollecting) {
        requestAnimationFrame(onFrame)
      }
    }
    window.__perfCollecting = true
    requestAnimationFrame(onFrame)
  })

  // Scroll through the entire page smoothly over 6 seconds (exact same 120 steps as baseline)
  const totalScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  const steps = 120
  const stepDelay = 50 // 6 seconds total scroll
  const scrollIncrement = totalScroll / steps

  console.log(`Scrolling ${totalScroll}px across ${steps} steps...`)
  for (let i = 0; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * scrollIncrement)
    await new Promise((r) => setTimeout(r, stepDelay))
  }

  // Stop frame collection
  const frameDeltas = await page.evaluate(() => {
    window.__perfCollecting = false
    return window.__perfFrames
  })

  console.log("Stopping trace...")
  await page.tracing.stop()

  const vitals = await page.evaluate(() => {
    const paintEntries = performance.getEntriesByType("paint")
    const fcp = paintEntries.find((e) => e.name === "first-contentful-paint")?.startTime || 0
    return {
      fcp: Math.round(fcp),
      totalScrollTimeMs: 6000,
    }
  })

  await browser.close()

  console.log("Analyzing trace file...")
  const traceRaw = JSON.parse(fs.readFileSync(tracePath, "utf8"))
  const events = traceRaw.traceEvents || []

  let scriptingTime = 0
  let renderingTime = 0
  let paintingTime = 0
  let longTasksCount = 0
  const functionDurations = {}

  for (const ev of events) {
    const durMs = (ev.dur || 0) / 1000

    if (ev.name === "RunTask" && durMs > 50) {
      longTasksCount++
    }

    if (ev.cat && ev.cat.includes("devtools.timeline")) {
      if (["FunctionCall", "EvaluateScript", "v8.compile", "TimerFire", "FireAnimationFrame"].includes(ev.name)) {
        scriptingTime += durMs
        if (ev.args && ev.args.data) {
          const fnName = ev.args.data.functionName || ev.args.data.url || ev.name
          functionDurations[fnName] = (functionDurations[fnName] || 0) + durMs
        }
      } else if (["Layout", "UpdateLayoutTree", "RecalculateStyles"].includes(ev.name)) {
        renderingTime += durMs
      } else if (["Paint", "CompositeLayers", "Rasterize"].includes(ev.name)) {
        paintingTime += durMs
      }
    }
  }

  const validDeltas = frameDeltas.filter((d) => d > 0 && d < 500)
  const avgFrameDelta = validDeltas.reduce((a, b) => a + b, 0) / (validDeltas.length || 1)
  const avgFPS = Math.round(1000 / avgFrameDelta)

  const topFunctions = Object.entries(functionDurations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([fn, time]) => ({ function: fn, timeMs: Math.round(time) }))

  const summary = {
    avgFPS,
    longTasksCount,
    scriptingTimeMs: Math.round(scriptingTime),
    renderingTimeMs: Math.round(renderingTime),
    paintingTimeMs: Math.round(paintingTime),
    topFunctions,
    vitals,
  }

  console.log("\n=== STEP 4 EXACT 1:1 COMPARISON MEASUREMENTS ===")
  console.log(JSON.stringify(summary, null, 2))

  fs.writeFileSync(path.join(ARTIFACTS_DIR, "step4_exact_comparison.json"), JSON.stringify(summary, null, 2))
}

runBenchmark().catch(console.error)
