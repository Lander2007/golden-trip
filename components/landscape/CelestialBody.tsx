"use client"

import CelestialBody from "@/components/CelestialBody"
export type { CelestialProps } from "@/components/CelestialBody"

export interface CelestialBodyHandle {
  update: (progress: number) => void
}

export default CelestialBody
