"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * BranchesPictogram
 * Built ONLY from primitives: circles, triangles, and rectangles.
 * Colors: --gold (#C9A227), --sand (#EADFC8), --ember (#E07A2F), --ink (#0B0A09).
 * Flat fills, strictly no outlines. 160x160 square.
 */
export default function BranchesPictogram() {
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
    gsap.set(".b-base-outer", { scale: 0.2, opacity: 0 })
    gsap.set(".b-base-inner", { scale: 0.2, opacity: 0 })
    gsap.set(".b-ghost-left", { x: -35, y: 20, rotation: -25, opacity: 0 })
    gsap.set(".b-ghost-right", { x: 35, y: 20, rotation: 25, opacity: 0 })
    gsap.set(".b-pin-tip", { x: -30, y: 40, rotation: -40, opacity: 0 })
    gsap.set(".b-pin-head", { x: 35, y: -45, rotation: 35, opacity: 0 })
    gsap.set(".b-pin-halo", { x: -20, y: -30, rotation: 20, opacity: 0 })
    gsap.set(".b-pin-core", { x: 25, y: 25, rotation: -30, opacity: 0 })

    // Hide sister split pins initially
    gsap.set([".sister-pin-left", ".sister-pin-right", ".split-route-link"], {
      opacity: 0,
      scale: 0.1,
      transformOrigin: "80px 75px",
    })

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
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
    })

    return () => {
      tl.kill()
    }
  }, [])

  const handleMouseEnter = () => {
    if (isHoveredRef.current) return
    isHoveredRef.current = true

    // Splits into three distinct branch pins
    const tl = gsap.timeline()

    // Main pin elevates and scales slightly to anchor the top HQ position
    tl.to(".main-pin-group", {
      scale: 0.82,
      y: -22,
      transformOrigin: "80px 70px",
      duration: 0.38,
      ease: "power2.out",
    })
      // Fade out idle ghost nodes
      .to(
        [".b-ghost-left", ".b-ghost-right"],
        {
          opacity: 0,
          duration: 0.2,
        },
        0
      )
      // Left sister pin splits out to Cairo position
      .to(
        ".sister-pin-left",
        {
          opacity: 1,
          scale: 0.78,
          x: -42,
          y: 18,
          transformOrigin: "80px 70px",
          duration: 0.42,
          ease: "back.out(1.8)",
        },
        "-=0.25"
      )
      // Right sister pin splits out to Red Sea position
      .to(
        ".sister-pin-right",
        {
          opacity: 1,
          scale: 0.78,
          x: 42,
          y: 18,
          transformOrigin: "80px 70px",
          duration: 0.42,
          ease: "back.out(1.8)",
        },
        "-=0.35"
      )
      // Connecting highway bridges illuminate
      .to(
        ".split-route-link",
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.2"
      )
  }

  const handleMouseLeave = () => {
    isHoveredRef.current = false

    // Snaps back into single unified Alexandria pin
    const tl = gsap.timeline()

    tl.to(".split-route-link", {
      opacity: 0,
      scale: 0.2,
      duration: 0.2,
      ease: "power2.in",
    })
      .to(
        [".sister-pin-left", ".sister-pin-right"],
        {
          opacity: 0,
          scale: 0.1,
          x: 0,
          y: 0,
          transformOrigin: "80px 70px",
          duration: 0.35,
          ease: "power2.in",
        },
        0
      )
      .to(
        [".b-ghost-left", ".b-ghost-right"],
        {
          opacity: 1,
          duration: 0.3,
        },
        "-=0.1"
      )
      .to(
        ".main-pin-group",
        {
          scale: 1,
          y: 0,
          transformOrigin: "80px 70px",
          duration: 0.45,
          ease: "back.out(1.6)",
        },
        "-=0.22"
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
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      aria-label="Branches pictogram: map pin splitting into three branches"
      role="img"
    >
      {/* ============================================================== */}
      {/* GROUND HIGHWAY RADAR & TARGET DISCS                            */}
      {/* ============================================================== */}
      <circle
        className="geo-piece b-base-outer"
        cx="80"
        cy="134"
        r="32"
        fill="#EADFC8"
        opacity="0.12"
      />
      <circle
        className="geo-piece b-base-inner"
        cx="80"
        cy="134"
        r="18"
        fill="#C9A227"
        opacity="0.25"
      />
      <circle
        className="geo-piece b-base-inner"
        cx="80"
        cy="134"
        r="8"
        fill="#E07A2F"
      />

      {/* ============================================================== */}
      {/* IDLE NETWORK NODES (Faint Branch Anchors on Left & Right)       */}
      {/* ============================================================== */}
      <g className="geo-piece b-ghost-left" opacity="0.35">
        <rect x="52" y="88" width="22" height="3" fill="#EADFC8" rx="1.5" />
        <circle cx="44" cy="90" r="10" fill="#EADFC8" />
        <circle cx="44" cy="90" r="4" fill="#0B0A09" />
      </g>
      <g className="geo-piece b-ghost-right" opacity="0.35">
        <rect x="86" y="88" width="22" height="3" fill="#EADFC8" rx="1.5" />
        <circle cx="116" cy="90" r="10" fill="#EADFC8" />
        <circle cx="116" cy="90" r="4" fill="#0B0A09" />
      </g>

      {/* ============================================================== */}
      {/* SPLIT ROUTE CONNECTING HIGHWAY SEGMENTS (Illuminated on Hover) */}
      {/* ============================================================== */}
      <g className="split-route-link" opacity="0">
        <polygon
          points="74,54 44,82 46,86 78,58"
          fill="#C9A227"
          opacity="0.85"
        />
        <polygon
          points="86,54 116,82 114,86 82,58"
          fill="#C9A227"
          opacity="0.85"
        />
      </g>

      {/* ============================================================== */}
      {/* SISTER PIN LEFT: Cairo Branch (Revealed on Split)               */}
      {/* ============================================================== */}
      <g className="sister-pin-left" style={{ transformOrigin: "80px 70px" }}>
        {/* Triangle tip */}
        <polygon points="56,76 104,76 80,126" fill="#EADFC8" />
        {/* Circular head */}
        <circle cx="80" cy="58" r="26" fill="#EADFC8" />
        {/* Inner ring */}
        <circle cx="80" cy="58" r="14" fill="#0B0A09" />
        {/* Center pip in --gold */}
        <circle cx="80" cy="58" r="6" fill="#C9A227" />
      </g>

      {/* ============================================================== */}
      {/* SISTER PIN RIGHT: Red Sea Branch (Revealed on Split)            */}
      {/* ============================================================== */}
      <g className="sister-pin-right" style={{ transformOrigin: "80px 70px" }}>
        {/* Triangle tip */}
        <polygon points="56,76 104,76 80,126" fill="#E07A2F" />
        {/* Circular head */}
        <circle cx="80" cy="58" r="26" fill="#E07A2F" />
        {/* Inner ring */}
        <circle cx="80" cy="58" r="14" fill="#0B0A09" />
        {/* Center pip in --sand */}
        <circle cx="80" cy="58" r="6" fill="#EADFC8" />
      </g>

      {/* ============================================================== */}
      {/* PRIMARY PIN (Alexandria Headquarters Pin)                      */}
      {/* ============================================================== */}
      <g className="main-pin-group" style={{ transformOrigin: "80px 70px" }}>
        {/* Pin triangle tip pointing down in --ember */}
        <polygon
          className="geo-piece b-pin-tip"
          points="46,58 114,58 80,126"
          fill="#E07A2F"
        />

        {/* Pin circular head in --gold */}
        <circle
          className="geo-piece b-pin-head"
          cx="80"
          cy="50"
          r="34"
          fill="#C9A227"
        />

        {/* Inner concentric halo in --sand */}
        <circle
          className="geo-piece b-pin-halo"
          cx="80"
          cy="50"
          r="23"
          fill="#EADFC8"
        />

        {/* Dark lens core in --ink */}
        <circle
          className="geo-piece b-pin-core"
          cx="80"
          cy="50"
          r="14"
          fill="#0B0A09"
        />

        {/* Center target pip in --gold */}
        <circle
          className="geo-piece b-pin-core"
          cx="80"
          cy="50"
          r="7"
          fill="#C9A227"
        />

        {/* Pure center highlight dot in --sand */}
        <circle
          className="geo-piece b-pin-core"
          cx="80"
          cy="50"
          r="3"
          fill="#EADFC8"
        />
      </g>
    </svg>
  )
}
