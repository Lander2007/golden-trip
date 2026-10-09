/**
 * Celestial Animation Constants
 * Tunable values for the Hero sunset-to-moon scroll transition.
 */
export const CELESTIAL_CONFIG = {
  // Fraction of hero frame height where desert horizon meets sky in photo
  HORIZON_Y: 0.74,

  // Sun start position (fraction of hero width and height)
  SUN_START: {
    x: 0.72, // 72% from left
    y: 0.30, // 30% from top
  },

  // Sun end position (fully sunken below the 74% horizon line)
  SUN_END: {
    x: 0.90, // 90% from left (drifts west/right)
    y: 0.81, // 81% from top (HORIZON_Y + 0.07, fully submerged)
  },

  // Moon position in upper western sky (never overlaps headline)
  MOON_POS: {
    desktop: { x: 0.84, y: 0.24 },
    mobile: { x: 0.80, y: 0.14 },
  },

  // Colors
  SUN_COLORS: {
    dawn: "#E07A2F",   // Warm ember gold
    mid: "#E8742A",    // Deep sunset orange
    dusk: "#C93D1B",   // Crimson red
  },
  MOON_COLOR: "#EADFC8", // Silver sand

  // Timeline scrub intervals (relative to Hero pinned 0..1 progress)
  TIMELINE: {
    sunSunsetEnd: 0.55,    // Sun fully below horizon by p=0.55
    duskHazePeak: 0.40,    // Dusk horizon haze peaks around p=0.40
    duskHazeEnd: 0.65,     // Dusk haze gone by p=0.65
    nightFadeStart: 0.25,  // Night overlay starts fading in
    nightFadeEnd: 0.80,    // Night overlay fully settled
    starsFadeStart: 0.45,  // Stars begin fading in
    starsFadeEnd: 0.85,    // Stars fully visible
    moonFadeStart: 0.55,   // Crescent moon begins fading in
    moonFadeEnd: 0.90,     // Crescent moon fully visible
    headlightsStart: 0.40, // Vehicle beams brighten as it gets dark
    headlightsEnd: 0.90,
  },
}
