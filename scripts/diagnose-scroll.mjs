import puppeteer from "puppeteer-core"
import fs from "fs"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"

async function runDiagnose() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1440,900"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  await page.goto("http://localhost:3000", { waitUntil: "load" })
  await new Promise((r) => setTimeout(r, 1500))

  await page.tracing.start({ path: "diagnose-trace.json", screenshots: false })

  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel({ deltaY: 200 })
    await new Promise((r) => setTimeout(r, 60))
  }

  await page.tracing.stop()
  await browser.close()

  console.log("Analyzing diagnose-trace.json...")
  const trace = JSON.parse(fs.readFileSync("diagnose-trace.json", "utf8"))
  const events = trace.traceEvents || []

  const longTasks = []
  for (const ev of events) {
    const durMs = (ev.dur || 0) / 1000
    if (durMs > 30 && ev.name) {
      longTasks.push({ name: ev.name, durMs: Math.round(durMs), cat: ev.cat, args: ev.args })
    }
  }

  console.log(`Found ${longTasks.length} events over 30ms:`)
  console.log(JSON.stringify(longTasks.slice(0, 15), null, 2))
}

runDiagnose().catch(console.error)
