export const PERF_FEATURES = [
  "grain",
  "dust",
  "blur",
  "blend",
  "glow",
  "parallax",
  "sun",
  "stars",
  "canvas",
] as const

export type PerfFeature = (typeof PERF_FEATURES)[number]

function readOffFlags(): Set<string> {
  if (typeof window === "undefined") return new Set()
  const raw = new URLSearchParams(window.location.search).get("off")
  if (!raw) return new Set()
  return new Set(
    raw
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean)
  )
}

function computeLite(): boolean {
  if (typeof window === "undefined") return false
  return (
    window.matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
    (navigator.hardwareConcurrency || 4) <= 4 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    new URLSearchParams(window.location.search).has("lite")
  )
}

/** Computed once on the client at module load. */
export const LITE = computeLite()

/** URL `?off=` tokens, e.g. grain,dust,blur,blend,glow,parallax,sun,stars */
export const FLAGS: ReadonlySet<string> = readOffFlags()

export function off(feature: string): boolean {
  if (typeof document !== "undefined") {
    return document.documentElement.hasAttribute(`data-off-${feature}`)
  }
  return FLAGS.has(feature)
}

export function applyPerfFlags(html: HTMLElement = document.documentElement) {
  if (LITE) html.classList.add("lite")
  FLAGS.forEach((feature) => {
    html.setAttribute(`data-off-${feature}`, "")
  })
}

export function setFeatureOff(feature: string, disabled: boolean) {
  if (typeof document === "undefined") return
  if (disabled) {
    document.documentElement.setAttribute(`data-off-${feature}`, "")
  } else {
    document.documentElement.removeAttribute(`data-off-${feature}`)
  }
}

export function showPerfLab(): boolean {
  if (typeof window === "undefined") return false
  return new URLSearchParams(window.location.search).has("perflab")
}
