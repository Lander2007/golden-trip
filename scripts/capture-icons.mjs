import puppeteer from "puppeteer-core"
import path from "path"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const ARTIFACTS_DIR = "C:\\Users\\kaled\\.gemini\\antigravity-ide\\brain\\473575f1-94ba-4f58-9c33-c3a30a5d0623"

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.goto("http://localhost:3000", { waitUntil: "networkidle0" })

  await page.evaluate(() => {
    const el = document.getElementById("why-golden-trip")
    if (el) el.scrollIntoView()
  })

  await new Promise((r) => setTimeout(r, 1500))

  const section = await page.$("#why-golden-trip .grid, #why-golden-trip .benefit")
  const cardsContainer = await page.evaluateHandle(() => {
    return document.querySelector("#why-golden-trip .benefit")?.parentElement
  })

  if (cardsContainer) {
    const outPath = path.join(ARTIFACTS_DIR, "enhanced_pictograms_cards.png")
    await cardsContainer.screenshot({ path: outPath })
    console.log("Saved close-up cards screenshot:", outPath)
  }

  await browser.close()
}

main().catch(console.error)
