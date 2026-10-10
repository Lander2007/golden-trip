import { chromium } from "playwright"
import fs from "fs"
import path from "path"

const shotsDir = path.resolve(process.cwd(), "tests/shots-map-bug")
if (!fs.existsSync(shotsDir)) {
  fs.mkdirSync(shotsDir, { recursive: true })
}

const configs = [
  { locale: "/en", width: 1440, height: 900, name: "en-1440" },
  { locale: "/ar", width: 1440, height: 900, name: "ar-1440" },
  { locale: "/en", width: 390, height: 844, name: "en-390" },
  { locale: "/ar", width: 390, height: 844, name: "ar-390" },
]

const browser = await chromium.launch()

for (const cfg of configs) {
  console.log(`\n============================================================`)
  console.log(`RUNNING MEASUREMENT: ${cfg.name} (${cfg.locale} @ ${cfg.width}x${cfg.height})`)
  console.log(`============================================================`)

  const page = await browser.newPage({
    viewport: { width: cfg.width, height: cfg.height },
  })

  await page.goto(`http://localhost:3000${cfg.locale}`, { waitUntil: "load" })
  await page.waitForTimeout(1500)

  // Wait for fonts & ScrollTrigger setup
  await page.evaluate(() => {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh()
  })
  await page.waitForTimeout(500)

  // 1. Inspect all ScrollTriggers on page
  const allTriggers = await page.evaluate(() => {
    if (!window.ScrollTrigger) return []
    return window.ScrollTrigger.getAll().map((st) => ({
      id: st.vars.id || (st.trigger ? st.trigger.id || st.trigger.className || st.trigger.tagName : "none"),
      trigger: st.trigger ? (st.trigger.id ? `#${st.trigger.id}` : st.trigger.className ? `.${st.trigger.className.split(" ")[0]}` : st.trigger.tagName) : "none",
      start: Math.round(st.start),
      end: Math.round(st.end),
      pin: Boolean(st.pin),
      progress: Number(st.progress.toFixed(3)),
      isActive: st.isActive,
    }))
  })

  // Sort triggers by start
  allTriggers.sort((a, b) => a.start - b.start)

  console.log(`\n--- ALL SCROLLTRIGGERS FOR ${cfg.name} (Sorted by start) ---`)
  console.table(
    allTriggers.map((t) => {
      // Check if overlapping another pinned trigger
      const overlapsPinned = allTriggers.some(
        (other) =>
          other !== t &&
          other.pin &&
          t.pin &&
          Math.max(t.start, other.start) < Math.min(t.end, other.end)
      )
      return {
        id: t.id,
        trigger: t.trigger,
        start: t.start,
        end: t.end,
        span: t.end - t.start,
        pin: t.pin ? "YES" : "NO",
        OVERLAP_PIN: overlapsPinned ? "⚠️ OVERLAP" : "OK",
      }
    })
  )

  // Find map trigger coordinates
  const mapTriggerInfo = await page.evaluate(() => {
    const mapScene = document.getElementById("destinations")
    const st = window.ScrollTrigger?.getAll().find(
      (s) => s.trigger === mapScene || s.trigger?.id === "destinations"
    )
    if (st) {
      return { start: st.start, end: st.end, hasSt: true }
    }
    // Fallback: estimate from bounding rect
    const r = mapScene?.getBoundingClientRect()
    const top = (r ? r.top + window.scrollY : 2000)
    return { start: top, end: top + 1500, hasSt: false }
  })

  console.log(`Map Scene ScrollTrigger bounds:`, mapTriggerInfo)

  // Determine wheeling range: from middle of map scene to start of destinations list (+ extra steps)
  // Middle of map scene:
  const midMapY = Math.round(mapTriggerInfo.start + (mapTriggerInfo.end - mapTriggerInfo.start) * 0.45)
  // End of map / start of list:
  const endMapY = Math.round(mapTriggerInfo.end + 500)

  // First scroll directly to middle of map scene
  await page.evaluate((targetY) => {
    window.scrollTo({ top: targetY, behavior: "instant" })
  }, midMapY)
  await page.waitForTimeout(500)

  // Function to record step
  async function recordStep(stepIndex, direction) {
    return await page.evaluate(() => {
      const scrollY = Math.round(window.scrollY)
      const scrollHeight = document.documentElement.scrollHeight
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const centerEl = document.elementFromPoint(cx, cy)

      // Build ancestor chain
      const chain = []
      let curr = centerEl
      while (curr && curr !== document.documentElement) {
        const cs = window.getComputedStyle(curr)
        chain.push({
          tag: curr.tagName.toLowerCase(),
          id: curr.id || undefined,
          className: typeof curr.className === "string" ? curr.className : "",
          position: cs.position,
          zIndex: cs.zIndex,
          opacity: cs.opacity,
          visibility: cs.visibility,
          display: cs.display,
          backgroundColor: cs.backgroundColor,
          transform: cs.transform,
          filter: cs.filter,
          willChange: cs.willChange,
          contain: cs.contain,
          contentVisibility: cs.contentVisibility,
        })
        curr = curr.parentElement
      }

      // Check if center element is inside map scene or next scene (destinations list)
      const mapScene = document.getElementById("destinations")
      const pinSpacer = mapScene?.closest(".pin-spacer")
      const isInsideMapScene = Boolean(mapScene && mapScene.contains(centerEl))
      const isInsideNextScene = Boolean(
        centerEl?.closest(".destinations-list") ||
        centerEl?.closest("section")?.querySelector(".destinations-list") ||
        (centerEl?.tagName === "SECTION" && !centerEl.classList.contains("scene") && centerEl.id !== "destinations")
      )

      // Map scene bounding rect & styles
      let mapRect = null
      let mapStyles = null
      if (mapScene) {
        const r = mapScene.getBoundingClientRect()
        const cs = window.getComputedStyle(mapScene)
        mapRect = { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), width: Math.round(r.width) }
        mapStyles = { opacity: cs.opacity, visibility: cs.visibility, display: cs.display, position: cs.position }
      }

      // Pin spacer bounding rect & styles
      let spacerRect = null
      let spacerStyles = null
      if (pinSpacer) {
        const r = pinSpacer.getBoundingClientRect()
        const cs = window.getComputedStyle(pinSpacer)
        spacerRect = { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height), width: Math.round(r.width) }
        spacerStyles = { opacity: cs.opacity, visibility: cs.visibility, display: cs.display, position: cs.position }
      }

      // Active ScrollTriggers at this moment
      const activeSTs = (window.ScrollTrigger?.getAll() || [])
        .filter((st) => st.isActive)
        .map((st) => ({
          id: st.vars.id || (st.trigger ? st.trigger.id || st.trigger.className || st.trigger.tagName : "none"),
          trigger: st.trigger?.id ? `#${st.trigger.id}` : st.trigger?.tagName,
          progress: Number(st.progress.toFixed(3)),
          pin: Boolean(st.pin),
        }))

      return {
        scrollY,
        scrollHeight,
        centerTag: centerEl?.tagName?.toLowerCase(),
        centerId: centerEl?.id,
        centerClass: typeof centerEl?.className === "string" ? centerEl.className : "",
        isInsideMapScene,
        isInsideNextScene,
        isInsideValidScene: isInsideMapScene || isInsideNextScene,
        chain,
        mapRect,
        mapStyles,
        spacerRect,
        spacerStyles,
        activeSTs,
      }
    })
  }

  const stepsDown = []
  const stepsUp = []

  // Scroll DOWN in 40px steps
  console.log(`\nWheeling DOWN from scrollY ~${midMapY} to ~${endMapY} in 40px steps...`)
  let currentScroll = await page.evaluate(() => window.scrollY)
  let stepCount = 0

  while (currentScroll < endMapY && stepCount < 80) {
    stepCount++
    await page.mouse.wheel(0, 40)
    await page.waitForTimeout(120)
    const data = await recordStep(stepCount, "down")
    data.step = stepCount
    data.direction = "down"
    stepsDown.push(data)
    currentScroll = data.scrollY

    // Take screenshot if not inside valid scene or at key intervals
    if (!data.isInsideValidScene || stepCount % 10 === 0) {
      await page.screenshot({
        path: path.join(shotsDir, `${cfg.name}-down-step${stepCount}-y${data.scrollY}.png`),
      })
    }
  }

  // Scroll UP back to middle of map scene in 40px steps
  console.log(`Wheeling UP back to scrollY ~${midMapY} in 40px steps...`)
  let stepUpCount = 0
  while (currentScroll > midMapY && stepUpCount < 80) {
    stepUpCount++
    await page.mouse.wheel(0, -40)
    await page.waitForTimeout(120)
    const data = await recordStep(stepUpCount, "up")
    data.step = stepUpCount
    data.direction = "up"
    stepsUp.push(data)
    currentScroll = data.scrollY

    if (!data.isInsideValidScene || stepUpCount % 10 === 0) {
      await page.screenshot({
        path: path.join(shotsDir, `${cfg.name}-up-step${stepUpCount}-y${data.scrollY}.png`),
      })
    }
  }

  // Analyze blank / invalid range
  const invalidDown = stepsDown.filter((s) => !s.isInsideValidScene)
  const invalidUp = stepsUp.filter((s) => !s.isInsideValidScene)

  console.log(`\n--- RESULTS FOR ${cfg.name} ---`)
  if (invalidDown.length > 0) {
    const first = invalidDown[0]
    const last = invalidDown[invalidDown.length - 1]
    console.log(`❌ DOWNWARD BLANK DETECTED:`)
    console.log(`  First blank step: #${first.step} at scrollY: ${first.scrollY}px`)
    console.log(`  Last blank step:  #${last.step} at scrollY: ${last.scrollY}px`)
    console.log(`  Element covering center during blank:`, {
      tag: first.centerTag,
      id: first.centerId,
      class: first.centerClass,
    })
    console.log(`  Ancestor chain of covering element:`)
    console.dir(first.chain.slice(0, 5), { depth: null })
    console.log(`  Map Scene rect at blank start:`, first.mapRect)
    console.log(`  Pin Spacer rect at blank start:`, first.spacerRect)
    console.log(`  Active ScrollTriggers in blank range:`, first.activeSTs)
  } else {
    console.log(`✅ DOWNWARD: No blank detected (center always inside map or next scene)`)
  }

  if (invalidUp.length > 0) {
    const first = invalidUp[0]
    const last = invalidUp[invalidUp.length - 1]
    console.log(`❌ UPWARD BLANK DETECTED:`)
    console.log(`  First blank step: #${first.step} at scrollY: ${first.scrollY}px`)
    console.log(`  Last blank step:  #${last.step} at scrollY: ${last.scrollY}px`)
    console.log(`  Element covering center during blank:`, {
      tag: first.centerTag,
      id: first.centerId,
      class: first.centerClass,
    })
    console.log(`  Active ScrollTriggers in blank range:`, first.activeSTs)
  } else {
    console.log(`✅ UPWARD: No blank detected`)
  }

  await page.close()
}

await browser.close()
console.log(`\nMeasurements complete! Screenshots saved to tests/shots-map-bug/`)
