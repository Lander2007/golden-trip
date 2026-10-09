"use client"

import { useEffect, useState } from "react"
import gsap from "gsap"
import {
  applyPerfFlags,
  LITE,
  PERF_FEATURES,
  setFeatureOff,
  showPerfLab,
  type PerfFeature,
} from "@/lib/perf"

const LABELS: Record<PerfFeature, string> = {
  grain: "grain",
  dust: "dust",
  blur: "backdrop blur",
  blend: "blend modes",
  glow: "glows",
  parallax: "parallax layers",
  sun: "sun/moon",
  stars: "stars",
  canvas: "canvas",
}

function pauseOffscreenLoops() {
  const nodes = document.querySelectorAll("[data-loop]")
  if (nodes.length === 0) return () => {}

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-offscreen", !entry.isIntersecting)
      }
    },
    { threshold: 0 }
  )
  nodes.forEach((node) => io.observe(node))
  return () => io.disconnect()
}

export default function PerfLab() {
  const [open, setOpen] = useState(false)
  const [fps, setFps] = useState(0)
  const [offs, setOffs] = useState<Record<string, boolean>>({})

  useEffect(() => {
    applyPerfFlags()
    const initial: Record<string, boolean> = {}
    PERF_FEATURES.forEach((feature) => {
      initial[feature] = document.documentElement.hasAttribute(`data-off-${feature}`)
    })
    setOffs(initial)
    setOpen(showPerfLab())
    return pauseOffscreenLoops()
  }, [])

  useEffect(() => {
    if (!open) return

    let frames = 0
    let last = gsap.ticker.time

    const onTick = () => {
      frames += 1
      const now = gsap.ticker.time
      const elapsed = now - last
      if (elapsed >= 0.5) {
        setFps(Math.round(frames / elapsed))
        frames = 0
        last = now
      }
    }

    gsap.ticker.add(onTick)
    return () => {
      gsap.ticker.remove(onTick)
    }
  }, [open])

  if (!open) return null

  const fpsColor = fps >= 55 ? "#4ade80" : fps >= 30 ? "#facc15" : "#f87171"

  return (
    <div
      className="hidden md:block fixed bottom-3 right-3 z-[9999] w-[220px] rounded-md border border-[#2A2B2E] bg-[#0B0A09]/90 p-3 font-mono text-[11px] text-[#F4F2EC] pointer-events-auto select-none"
      role="region"
      aria-label="Performance lab"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-bold" style={{ color: fpsColor }}>
          {fps} FPS
        </span>
        <span className="text-[#B9B7B0]">{LITE ? "LITE" : "FULL"}</span>
      </div>
      <div className="flex flex-col gap-1">
        {PERF_FEATURES.map((feature) => (
          <label key={feature} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(offs[feature])}
              onChange={(e) => {
                const disabled = e.target.checked
                setFeatureOff(feature, disabled)
                setOffs((prev) => ({ ...prev, [feature]: disabled }))
              }}
            />
            <span>off {LABELS[feature]}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
