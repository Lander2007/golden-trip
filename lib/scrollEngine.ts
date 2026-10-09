// Plain mutable scroll state to prevent React re-renders on scroll ticks
export interface ScrollState {
  value: number // Normalized 0.0 to 1.0 scroll progress
  km: number // Traveled distance (0 to 980 km)
  velocity: number // Current scroll velocity from Lenis
  activeCityIndex: number // Current active route city index (0 to 5)
}

export const scrollProgress: ScrollState = {
  value: 0,
  km: 0,
  velocity: 0,
  activeCityIndex: 0,
}

type CityChangeListener = (cityIndex: number) => void
const cityChangeListeners: Set<CityChangeListener> = new Set()

export function subscribeCityChange(listener: CityChangeListener): () => void {
  cityChangeListeners.add(listener)
  listener(scrollProgress.activeCityIndex)
  return () => {
    cityChangeListeners.delete(listener)
  }
}

export function getActiveCityIndex(km: number): number {
  if (km < 110) return 0 // Alexandria
  if (km < 360) return 1 // Cairo
  if (km < 575) return 2 // Sharm El-Sheikh
  if (km < 745) return 3 // Hurghada
  if (km < 910) return 4 // Luxor
  return 5 // Aswan
}

export function updateScrollProgress(p: number, vel = 0): void {
  const clamped = Math.max(0, Math.min(1, p))
  scrollProgress.value = clamped
  const km = Math.round(clamped * 980)
  scrollProgress.km = km
  scrollProgress.velocity = vel

  const nextCityIndex = getActiveCityIndex(km)
  if (nextCityIndex !== scrollProgress.activeCityIndex) {
    scrollProgress.activeCityIndex = nextCityIndex
    cityChangeListeners.forEach((fn) => fn(nextCityIndex))
  }
}
