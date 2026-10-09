import puppeteer from "puppeteer-core"
import fs from "fs"
import path from "path"

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const ARTIFACTS_DIR = "C:\\Users\\kaled\\.gemini\\antigravity-ide\\brain\\473575f1-94ba-4f58-9c33-c3a30a5d0623"

async function testSunsetToMoon() {
  console.log("Launching headless Chrome for Sunset-to-Moon verification...")
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log("Navigating to http://localhost:3000...")
  await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 30000 })
  await new Promise((r) => setTimeout(r, 1800)) // settle entrance

  // 1. Initial State (Dawn)
  console.log("Checking Initial Dawn State (p=0)...")
  const state0 = await page.evaluate(() => {
    const sun = document.querySelector(".hero-sun-wrapper")
    const moon = document.querySelector(".hero-moon-wrapper")
    const stars = document.querySelector(".hero-stars")
    const haze = document.querySelector(".hero-dusk-haze")
    const hero = document.getElementById("alexandria")

    const heroRect = hero?.getBoundingClientRect()
    const sunRect = sun?.getBoundingClientRect()
    const moonRect = moon?.getBoundingClientRect()

    return {
      sunLeft: sunRect ? Math.round(sunRect.left) : null,
      sunTop: sunRect ? Math.round(sunRect.top) : null,
      sunOpacity: sun ? window.getComputedStyle(sun).opacity : null,
      moonOpacity: moon ? window.getComputedStyle(moon).opacity : null,
      starsOpacity: stars ? window.getComputedStyle(stars).opacity : null,
      hazeOpacity: haze ? window.getComputedStyle(haze).opacity : null,
      heroHeight: heroRect ? Math.round(heroRect.height) : null,
    }
  })
  console.log("State 0 (Dawn):", JSON.stringify(state0, null, 2))
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "sunset_01_dawn.png") })

  // 2. Mid Sunset (Scroll down 400px)
  console.log("Scrolling to Mid Sunset...")
  await page.evaluate(() => window.scrollTo(0, 450))
  await new Promise((r) => setTimeout(r, 600))

  const stateMid = await page.evaluate(() => {
    const sun = document.querySelector(".hero-sun-wrapper")
    const moon = document.querySelector(".hero-moon-wrapper")
    const haze = document.querySelector(".hero-dusk-haze")
    const sunRect = sun?.getBoundingClientRect()

    return {
      sunLeft: sunRect ? Math.round(sunRect.left) : null,
      sunTop: sunRect ? Math.round(sunRect.top) : null,
      moonOpacity: moon ? window.getComputedStyle(moon).opacity : null,
      hazeOpacity: haze ? window.getComputedStyle(haze).opacity : null,
    }
  })
  console.log("State Mid (Sunset Haze):", JSON.stringify(stateMid, null, 2))
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "sunset_02_haze.png") })

  // 3. Late Sunset / Moon Emergence (Scroll down 900px)
  console.log("Scrolling to Moon Emergence...")
  await page.evaluate(() => window.scrollTo(0, 950))
  await new Promise((r) => setTimeout(r, 600))

  const stateNight = await page.evaluate(() => {
    const sun = document.querySelector(".hero-sun-wrapper")
    const moon = document.querySelector(".hero-moon-wrapper")
    const stars = document.querySelector(".hero-stars")
    const sunRect = sun?.getBoundingClientRect()
    const moonRect = moon?.getBoundingClientRect()

    return {
      sunTop: sunRect ? Math.round(sunRect.top) : null,
      moonLeft: moonRect ? Math.round(moonRect.left) : null,
      moonTop: moonRect ? Math.round(moonRect.top) : null,
      moonOpacity: moon ? window.getComputedStyle(moon).opacity : null,
      starsOpacity: stars ? window.getComputedStyle(stars).opacity : null,
    }
  })
  console.log("State Night (Crescent Moon Visible):", JSON.stringify(stateNight, null, 2))
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "sunset_03_moon.png") })

  // 4. Reverse Scroll back up to 0
  console.log("Testing reverse scroll back to top...")
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 600))

  const stateReversed = await page.evaluate(() => {
    const sun = document.querySelector(".hero-sun-wrapper")
    const moon = document.querySelector(".hero-moon-wrapper")
    const stars = document.querySelector(".hero-stars")
    const sunRect = sun?.getBoundingClientRect()

    return {
      sunTop: sunRect ? Math.round(sunRect.top) : null,
      sunLeft: sunRect ? Math.round(sunRect.left) : null,
      moonOpacity: moon ? window.getComputedStyle(moon).opacity : null,
      starsOpacity: stars ? window.getComputedStyle(stars).opacity : null,
    }
  })
  console.log("State Reversed (Back to Dawn):", JSON.stringify(stateReversed, null, 2))
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, "sunset_04_reversed.png") })

  await browser.close()
  console.log("\nSunset-to-Moon verification finished successfully!")
}

testSunsetToMoon().catch(console.error)
