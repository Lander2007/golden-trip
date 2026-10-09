"use client"

// Body physics: 2 to 3px harmonic vertical bob and pitch lean up to 1.5deg

// Throttle React state for wheel rotation and dust particle canvas to keep 60fps
/* Soft ground shadow that stretches with velocity */ /* Sand-dust trail emitted behind rear wheel (mounted client-only) */ /* Vehicle body with physics bob and lean */

import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react"
import gsap from "gsap"
import Vehicle, { type VehicleVariant } from "./Vehicle"
import DustTrail from "./vehicle/DustTrail"

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
    const [beamBrightness, setBeamBrightnessState] = useState(0.5)
    const [velState, setVelState] = useState(0)
    const [mounted, setMounted] = useState(false)

    const rootRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<HTMLDivElement>(null)
    const dustRef = useRef<HTMLDivElement>(null)

    const currentXRef = useRef(6)
    const lastVelUpdateRef = useRef(0)

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
          if (reducedMotion) return

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

          if (bodyRef.current) {
            bodyRef.current.style.transform = `translate3d(0, ${bob}px, 0) rotate(${lean}deg)`
          }
          if (shadowRef.current) {
            shadowRef.current.style.transform = `scaleX(${shadowStretch})`
          }

          const now = performance.now()
          if (now - lastVelUpdateRef.current > 64) {
            lastVelUpdateRef.current = now
            setVelState(velocity)
          }
        },
        setBeamBrightness: (brightness: number) => {
          setBeamBrightnessState(brightness)
        },
      }),
      [reducedMotion]
    )

    useEffect(() => {
      setMounted(true)
      if (rootRef.current) {
        gsap.set(rootRef.current, {
          x: `${currentXRef.current}vw`,
          force3D: true,
        })
      }
    }, [])

    const isFleet = variant === "fleet"

    return (
      <div
        ref={rootRef}
        className="road-zone-car absolute bottom-[4.5vh] will-change-transform select-none pointer-events-none transition-opacity duration-300"
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
          className="absolute bottom-[-3px] left-[8%] right-[8%] h-[14px] rounded-full bg-black/65 blur-[6px] will-change-transform"
        />

        {/* Sand-dust trail emitted behind rear wheel (mounted client-only) */}
        {mounted && !isFleet && !reducedMotion && (
          <div
            ref={dustRef}
            className="absolute left-[-60px] bottom-[-8px] pointer-events-none z-0"
          >
            <DustTrail velocity={velState} reducedMotion={reducedMotion} />
          </div>
        )}

        {/* Vehicle body with physics bob and lean */}
        <div ref={bodyRef} className="relative z-10 will-change-transform">
          <Vehicle
            variant={variant}
            showBeam={!isFleet}
            beamBrightness={beamBrightness}
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    )
  }
)

export default ScrollCar
