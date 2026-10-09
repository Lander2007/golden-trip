"use client"

import { useEffect, useState, useRef } from "react"

/**
 * Dev-only FPS meter
 * Toggle with the "f" key.
 * Removed/inactive in production.
 */
export default function DevFpsMeter() {
  const [visible, setVisible] = useState(false)
  const [fps, setFps] = useState(60)
  const [frameTime, setFrameTime] = useState(16.6)
  const [minFps, setMinFps] = useState(60)

  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(0)
  const minFpsRef = useRef(60)

  useEffect(() => {
    // Completely disable in production
    if (process.env.NODE_ENV === "production") return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === "f" || e.key === "F") {
        setVisible((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !visible) return

    let animId: number
    lastTimeRef.current = performance.now()
    frameCountRef.current = 0
    minFpsRef.current = 60

    const update = (now: number) => {
      frameCountRef.current++
      const delta = now - lastTimeRef.current

      if (delta >= 500) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta)
        const currentFrameTime = Number((delta / frameCountRef.current).toFixed(1))
        minFpsRef.current = Math.min(minFpsRef.current, currentFps)

        setFps(currentFps)
        setFrameTime(currentFrameTime)
        setMinFps(minFpsRef.current)

        frameCountRef.current = 0
        lastTimeRef.current = now
      }

      animId = requestAnimationFrame(update)
    }

    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [visible])

  if (process.env.NODE_ENV === "production" || !visible) {
    return null
  }

  const fpsColor = fps >= 55 ? "#4ade80" : fps >= 30 ? "#facc15" : "#f87171"

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] rounded-md border border-[#2A2B2E] bg-[#0E0E10]/90 px-3 py-2 font-mono text-xs shadow-2xl backdrop-blur-md pointer-events-none select-none text-[#F4F2EC]"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: fpsColor }}
        />
        <span className="font-bold text-sm" style={{ color: fpsColor }}>
          {fps} FPS
        </span>
        <span className="text-[#B9B7B0]/60">({frameTime}ms)</span>
      </div>
      <div className="mt-1 flex justify-between gap-3 text-[10px] text-[#B9B7B0]/60 border-t border-[#2A2B2E] pt-1">
        <span>Min: {minFps} FPS</span>
        <span>Press &apos;f&apos; to hide</span>
      </div>
    </div>
  )
}
