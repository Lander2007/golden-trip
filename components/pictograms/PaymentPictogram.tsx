"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * PaymentPictogram
 * Built ONLY from primitives: rounded rectangles, circles, half-circle cuts, and triangles.
 * Colors: --gold (#C9A227), --sand (#EADFC8), --ember (#E07A2F), --ink (#0B0A09).
 * Flat fills, strictly no outlines. 160x160 square.
 */
export default function PaymentPictogram() {
  const rootRef = useRef<SVGSVGElement>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const pieces = el.querySelectorAll(".geo-piece")

    // Set initial scattered and rotated state
    gsap.set(pieces, {
      opacity: 0,
      transformOrigin: "50% 50%",
    })
    gsap.set(".p-note-shadow", { x: -30, y: -25, rotation: -18, opacity: 0 })
    gsap.set(".p-note-base", { x: -40, y: -20, rotation: -12, opacity: 0 })
    gsap.set(".p-note-inner", { x: 25, y: -30, rotation: 15, opacity: 0 })
    gsap.set(".p-note-field", { x: -20, y: 25, rotation: -20, opacity: 0 })
    gsap.set(".p-note-medallion", { x: 30, y: 30, rotation: 45, opacity: 0 })
    gsap.set(".p-note-cuts", { x: -35, y: 15, rotation: 30, opacity: 0 })
    gsap.set(".p-note-accents", { x: 20, y: -25, rotation: -35, opacity: 0 })
    gsap.set(".p-coin-small", { x: 45, y: -35, rotation: 60, opacity: 0 })
    gsap.set(".p-coin-shadow", { x: 35, y: 40, rotation: -25, opacity: 0 })
    gsap.set(".p-coin-main", { x: 50, y: 35, rotation: 55, opacity: 0 })
    gsap.set(".p-coin-bevel", { x: 30, y: 45, rotation: -40, opacity: 0 })
    gsap.set(".p-coin-face", { x: 20, y: 25, rotation: 30, opacity: 0 })
    gsap.set(".p-coin-star", { x: -25, y: 35, rotation: -60, opacity: 0 })
    gsap.set(".p-coin-pip", { x: 0, y: 20, rotation: 0, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    })

    // Staggered fly-in locking together in 0.9s total
    tl.to(pieces, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.05,
      ease: "power3.out",
    })

    return () => {
      tl.kill()
    }
  }, [])

  const handleMouseEnter = () => {
    if (isHoveredRef.current) return
    isHoveredRef.current = true

    // Responsive reshuffle on hover and return
    const tl = gsap.timeline({
      onComplete: () => {
        isHoveredRef.current = false
      },
    })

    tl.to(".group-coin", {
      x: 8,
      y: -6,
      rotation: 10,
      transformOrigin: "112px 96px",
      duration: 0.28,
      ease: "power2.out",
    })
      .to(
        ".group-note",
        {
          x: -6,
          y: 4,
          rotation: -3,
          transformOrigin: "64px 76px",
          duration: 0.28,
          ease: "power2.out",
        },
        0
      )
      .to(".group-coin", {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.45,
        ease: "back.out(2)",
      })
      .to(
        ".group-note",
        {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.45,
          ease: "back.out(2)",
        },
        "-=0.35"
      )
  }

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 160 160"
      width="160"
      height="160"
      className="w-[160px] h-[160px] cursor-pointer select-none transition-transform duration-300 hover:scale-[1.03]"
      onMouseEnter={handleMouseEnter}
      onFocus={handleMouseEnter}
      tabIndex={0}
      aria-label="Payment pictogram: coin overlapping banknote"
      role="img"
    >
      {/* ============================================================== */}
      {/* BANKNOTE GROUP                                                 */}
      {/* ============================================================== */}
      <g className="group-note">
        {/* Subtle under-sheet depth card in --sand 25% */}
        <rect
          className="geo-piece p-note-shadow"
          x="18"
          y="38"
          width="106"
          height="68"
          rx="10"
          fill="#EADFC8"
          opacity="0.22"
        />

        {/* Banknote Main Body (Rounded Rectangle in --sand) */}
        <rect
          className="geo-piece p-note-base"
          x="12"
          y="46"
          width="108"
          height="70"
          rx="10"
          fill="#EADFC8"
        />

        {/* Banknote Outer Inset Frame (Rectangle in --gold) */}
        <rect
          className="geo-piece p-note-inner"
          x="18"
          y="52"
          width="96"
          height="58"
          rx="6"
          fill="#C9A227"
        />

        {/* Banknote Deep Inset Field (Rectangle in --ink) */}
        <rect
          className="geo-piece p-note-field"
          x="26"
          y="58"
          width="80"
          height="46"
          rx="4"
          fill="#0B0A09"
        />

        {/* Banknote Security Corner Triangles in --ember */}
        <polygon
          className="geo-piece p-note-accents"
          points="20,54 32,54 20,66"
          fill="#E07A2F"
        />
        <polygon
          className="geo-piece p-note-accents"
          points="20,108 32,108 20,96"
          fill="#E07A2F"
        />
        <polygon
          className="geo-piece p-note-accents"
          points="112,54 100,54 112,66"
          fill="#E07A2F"
        />

        {/* Banknote Center Watermark Medallion (Concentric Circles in --gold & --sand) */}
        <circle
          className="geo-piece p-note-medallion"
          cx="66"
          cy="81"
          r="16"
          fill="#C9A227"
        />
        <circle
          className="geo-piece p-note-medallion"
          cx="66"
          cy="81"
          r="9"
          fill="#EADFC8"
        />
        <circle
          className="geo-piece p-note-medallion"
          cx="66"
          cy="81"
          r="4.5"
          fill="#0B0A09"
        />

        {/* Half-circle cuts into edges in --ink */}
        <path
          className="geo-piece p-note-cuts"
          d="M 12 70 A 11 11 0 0 1 12 92 Z"
          fill="#0B0A09"
        />
        <path
          className="geo-piece p-note-cuts"
          d="M 120 70 A 11 11 0 0 0 120 92 Z"
          fill="#0B0A09"
        />
      </g>

      {/* ============================================================== */}
      {/* COIN GROUP (Overlapping the Banknote)                          */}
      {/* ============================================================== */}
      <g className="group-coin">
        {/* Companion Upper-Right Coin (Circle in --sand & --ember) */}
        <circle
          className="geo-piece p-coin-small"
          cx="128"
          cy="66"
          r="18"
          fill="#0B0A09"
          opacity="0.3"
        />
        <circle
          className="geo-piece p-coin-small"
          cx="126"
          cy="64"
          r="17"
          fill="#EADFC8"
        />
        <circle
          className="geo-piece p-coin-small"
          cx="126"
          cy="64"
          r="12"
          fill="#E07A2F"
        />
        <circle
          className="geo-piece p-coin-small"
          cx="126"
          cy="64"
          r="6"
          fill="#C9A227"
        />

        {/* Main Coin Drop Silhouette in --ink */}
        <circle
          className="geo-piece p-coin-shadow"
          cx="114"
          cy="100"
          r="33"
          fill="#0B0A09"
          opacity="0.45"
        />

        {/* Main Coin Outer Rim (Circle in --gold) */}
        <circle
          className="geo-piece p-coin-main"
          cx="112"
          cy="96"
          r="32"
          fill="#C9A227"
        />

        {/* Main Coin Bevel Tier (Circle in --ember) */}
        <circle
          className="geo-piece p-coin-bevel"
          cx="112"
          cy="96"
          r="26"
          fill="#E07A2F"
        />

        {/* Main Coin Face Disc (Circle in --gold) */}
        <circle
          className="geo-piece p-coin-face"
          cx="112"
          cy="96"
          r="21"
          fill="#C9A227"
        />

        {/* Four-Point Geometric Star Emblem built ONLY from 4 triangles in --sand */}
        <polygon
          className="geo-piece p-coin-star"
          points="112,81 115.5,92 108.5,92"
          fill="#EADFC8"
        />
        <polygon
          className="geo-piece p-coin-star"
          points="112,111 115.5,100 108.5,100"
          fill="#EADFC8"
        />
        <polygon
          className="geo-piece p-coin-star"
          points="97,96 108,92.5 108,99.5"
          fill="#EADFC8"
        />
        <polygon
          className="geo-piece p-coin-star"
          points="127,96 116,92.5 116,99.5"
          fill="#EADFC8"
        />

        {/* Coin Inner Core Circle in --ink */}
        <circle
          className="geo-piece p-coin-pip"
          cx="112"
          cy="96"
          r="6.5"
          fill="#0B0A09"
        />

        {/* Coin Center Pip in --sand */}
        <circle
          className="geo-piece p-coin-pip"
          cx="112"
          cy="96"
          r="3"
          fill="#EADFC8"
        />
      </g>
    </svg>
  )
}
