"use client"

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react"
import gsap from "gsap"
import Vehicle, { type VehicleVariant } from "./Vehicle"
import { LITE } from "@/lib/perf"

export interface ScrollCarHandle {
  setX: (xVw: number) => void
  setVariant: (variant: VehicleVariant) => void
  setVisible: (visible: boolean) => void
  setOpacity: (opacity: number) => void
  updatePhysics: (velocity: number, scrollDistance: number) => void
  setBeamBrightness: (brightness: number) => void
}

interface ScrollCarProps {
  initialVariant?: VehicleVariant
  reducedMotion?: boolean
}

const ScrollCar = forwardRef<ScrollCarHandle, ScrollCarProps>(
  function ScrollCar({ initialVariant = "suv", reducedMotion = false }, ref) {
    const [variant, setVariantState] = useState<VehicleVariant>(initialVariant)
    const [visible, setVisibleState] = useState(true)

    const rootRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<HTMLDivElement>(null)

    const currentXRef = useRef(6)
    const quickBodyY = useRef<((v: number) => void) | null>(null)
    const quickBodyRot = useRef<((v: number) => void) | null>(null)
    const quickShadowScaleX = useRef<((v: number) => void) | null>(null)

    useImperativeHandle(
      ref,
      () => ({
        setX: (xVw: number) => {
          currentXRef.current = xVw
          if (rootRef.current) {
            gsap.set(rootRef.current, { x: `${xVw}vw`, force3D: true })
          }
        },
        setVariant: (newVariant: VehicleVariant) => {
          setVariantState((prev) =>
            prev !== newVariant ? newVariant : prev
          )
        },
        setVisible: (isVisible: boolean) => {
          setVisibleState(isVisible)
          if (rootRef.current) {
            rootRef.current.style.opacity = isVisible ? "1" : "0"
          }
        },
        setOpacity: (opacity: number) => {
          if (rootRef.current) {
            rootRef.current.style.opacity = String(
              Math.max(0, Math.min(1, opacity))
            )
          }
        },
        updatePhysics: (velocity: number, scrollDistance: number) => {
          if (reducedMotion || LITE) return

          const absVel = Math.abs(velocity)
          const bob =
            Math.sin(scrollDistance * 0.05) *
            Math.min(2.8, absVel * 0.35)
          const lean = Math.max(
            -1.5,
            Math.min(1.5, -velocity * 0.045)
          )
          const shadowStretch =
            1 + Math.min(0.35, absVel * 0.008)

          if (quickBodyY.current && quickBodyRot.current) {
            quickBodyY.current(bob)
            quickBodyRot.current(lean)
          }
          if (quickShadowScaleX.current) {
            quickShadowScaleX.current(shadowStretch)
          }
        },
        setBeamBrightness: (brightness: number) => {
          if (rootRef.current) {
            rootRef.current.style.setProperty(
              "--beam-opacity",
              String(Math.max(0.2, Math.min(1.2, brightness)))
            )
          }
        },
      }),
      [reducedMotion]
    )

    useEffect(() => {
      if (rootRef.current) {
        gsap.set(rootRef.current, {
          x: `${currentXRef.current}vw`,
          force3D: true,
        })
      }
      if (bodyRef.current) {
        quickBodyY.current = gsap.quickSetter(bodyRef.current, "y", "px") as (v: number) => void
        quickBodyRot.current = gsap.quickSetter(bodyRef.current, "rotation", "deg") as (v: number) => void
      }
      if (shadowRef.current) {
        quickShadowScaleX.current = gsap.quickSetter(shadowRef.current, "scaleX") as (v: number) => void
      }
    }, [])

    const isFleet = variant === "fleet"

    return (
      <div
        ref={rootRef}
        className="road-zone-car absolute bottom-[4.5vh] select-none pointer-events-none"
        style={{
          left: 0,
          opacity: visible ? 1 : 0,
          width: isFleet
            ? "clamp(320px, 48vw, 680px)"
            : "clamp(260px, 32vw, 460px)",
        }}
        aria-hidden="true"
      >
        {/* Soft ground shadow that stretches with velocity */}
        <div
          ref={shadowRef}
          className="absolute bottom-[-3px] left-[8%] right-[8%] h-[14px] rounded-full bg-black/40"
        />

        <div ref={bodyRef} className="relative z-10">
          <Vehicle
            variant={variant}
            showBeam={!isFleet}
            className="w-full h-auto"
          />
        </div>
      </div>
    )
  }
)

export default ScrollCar
