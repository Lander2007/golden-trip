"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * ReviewsPictogram
 * Built ONLY from primitives: triangles (polygons with 3 points).
 * Colors: --gold (#C9A227), --sand (#EADFC8), --ember (#E07A2F), --ink (#0B0A09).
 * Flat fills, strictly no outlines. 160x160 square.
 */
export default function ReviewsPictogram() {
  const rootRef = useRef<SVGSVGElement>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const pieces = el.querySelectorAll(".geo-piece")

    // Set initial scattered and rotated state
    gsap.set(pieces, {
      opacity: 0,
      transformOrigin: "80px 68px",
    })
    gsap.set(".r-facet-0", { y: -50, rotation: 30, opacity: 0 })
    gsap.set(".r-facet-1", { x: 45, y: -30, rotation: -40, opacity: 0 })
    gsap.set(".r-facet-2", { x: 50, y: 15, rotation: 35, opacity: 0 })
    gsap.set(".r-facet-3", { x: 40, y: 45, rotation: -45, opacity: 0 })
    gsap.set(".r-facet-4", { x: 20, y: 50, rotation: 25, opacity: 0 })
    gsap.set(".r-facet-5", { x: -20, y: 50, rotation: -30, opacity: 0 })
    gsap.set(".r-facet-6", { x: -40, y: 45, rotation: 40, opacity: 0 })
    gsap.set(".r-facet-7", { x: -50, y: 15, rotation: -35, opacity: 0 })
    gsap.set(".r-facet-8", { x: -45, y: -30, rotation: 45, opacity: 0 })
    gsap.set(".r-facet-9", { y: -50, rotation: -30, opacity: 0 })
    gsap.set(".r-tail-main", { x: -35, y: 50, rotation: -50, opacity: 0 })
    gsap.set(".r-tail-bevel", { x: -25, y: 40, rotation: 30, opacity: 0 })
    gsap.set(".r-sparkle", { scale: 0.1, opacity: 0 })

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

    tl.to(".star-facet-group", {
      scale: 1.08,
      rotation: 6,
      transformOrigin: "80px 68px",
      duration: 0.28,
      ease: "power2.out",
    })
      .to(
        ".star-tail-group",
        {
          x: -6,
          y: 8,
          rotation: -10,
          transformOrigin: "80px 68px",
          duration: 0.28,
          ease: "power2.out",
        },
        0
      )
      .to(".star-facet-group", {
        scale: 1,
        rotation: 0,
        duration: 0.45,
        ease: "back.out(2)",
      })
      .to(
        ".star-tail-group",
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
      aria-label="Reviews pictogram: geometric star built from triangles with speech bubble tail"
      role="img"
    >
      {/* ============================================================== */}
      {/* RATING ACCENT SPARKLES (Pure Triangles)                        */}
      {/* ============================================================== */}
      <polygon
        className="geo-piece r-sparkle"
        points="136,28 139,36 133,36"
        fill="#C9A227"
      />
      <polygon
        className="geo-piece r-sparkle"
        points="136,44 139,36 133,36"
        fill="#EADFC8"
      />
      <polygon
        className="geo-piece r-sparkle"
        points="26,34 29,40 23,40"
        fill="#EADFC8"
      />
      <polygon
        className="geo-piece r-sparkle"
        points="26,46 29,40 23,40"
        fill="#E07A2F"
      />

      {/* ============================================================== */}
      {/* SPEECH BUBBLE TAIL (Pure Triangles in --ember & --gold)        */}
      {/* ============================================================== */}
      <g className="star-tail-group">
        {/* Tail base silhouette shadow in --ink */}
        <polygon
          className="geo-piece r-tail-main"
          points="51,106 74,88 26,146"
          fill="#0B0A09"
          opacity="0.4"
        />

        {/* Tail main triangle in --ember pointing down-left */}
        <polygon
          className="geo-piece r-tail-main"
          points="51,104 74,86 28,144"
          fill="#E07A2F"
        />

        {/* Tail inner bevel facet in --gold */}
        <polygon
          className="geo-piece r-tail-bevel"
          points="51,104 28,144 38,104"
          fill="#C9A227"
        />
      </g>

      {/* ============================================================== */}
      {/* 5-POINT FACETED STAR (Ten Precision Triangles Meeting at C)     */}
      {/* C = (80, 68), R = 50, r = 23                                    */}
      {/* ============================================================== */}
      <g className="star-facet-group">
        {/* 1. Top Right Facet (C, Top Tip, Top-Right Valley) */}
        <polygon
          className="geo-piece r-facet-0"
          points="80,68 80,18 94,50"
          fill="#C9A227"
        />

        {/* 2. Right Upper Facet (C, Top-Right Valley, Right Tip) */}
        <polygon
          className="geo-piece r-facet-1"
          points="80,68 94,50 128,53"
          fill="#EADFC8"
        />

        {/* 3. Right Lower Facet (C, Right Tip, Bottom-Right Valley) */}
        <polygon
          className="geo-piece r-facet-2"
          points="80,68 128,53 102,75"
          fill="#C9A227"
        />

        {/* 4. Bottom-Right Outer Facet (C, Bottom-Right Valley, Bottom-Right Tip) */}
        <polygon
          className="geo-piece r-facet-3"
          points="80,68 102,75 109,108"
          fill="#E07A2F"
        />

        {/* 5. Bottom-Right Inner Facet (C, Bottom-Right Tip, Bottom Valley) */}
        <polygon
          className="geo-piece r-facet-4"
          points="80,68 109,108 80,91"
          fill="#C9A227"
        />

        {/* 6. Bottom-Left Inner Facet (C, Bottom Valley, Bottom-Left Tip) */}
        <polygon
          className="geo-piece r-facet-5"
          points="80,68 80,91 51,108"
          fill="#EADFC8"
        />

        {/* 7. Bottom-Left Outer Facet (C, Bottom-Left Tip, Bottom-Left Valley) */}
        <polygon
          className="geo-piece r-facet-6"
          points="80,68 51,108 58,75"
          fill="#C9A227"
        />

        {/* 8. Left Lower Facet (C, Bottom-Left Valley, Left Tip) */}
        <polygon
          className="geo-piece r-facet-7"
          points="80,68 58,75 32,53"
          fill="#E07A2F"
        />

        {/* 9. Left Upper Facet (C, Left Tip, Top-Left Valley) */}
        <polygon
          className="geo-piece r-facet-8"
          points="80,68 32,53 66,50"
          fill="#C9A227"
        />

        {/* 10. Top Left Facet (C, Top-Left Valley, Top Tip) */}
        <polygon
          className="geo-piece r-facet-9"
          points="80,68 66,50 80,18"
          fill="#EADFC8"
        />
      </g>
    </svg>
  )
}
