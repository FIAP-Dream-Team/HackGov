// Palette lifted straight from the deck so every element added on top of the
// slides (speaker card, team strip) stays inside the project identity.
export const COLORS = {
  green: "#1E8E63",
  greenDeep: "#17724F",
  greenInk: "#12211A",
  greenInkDeep: "#0C2A1E",
  cream: "#F5F2EA",
  creamLine: "#DCD6C9",
  yellow: "#F5B700",
  yellowInk: "#B08200",
  blue: "#1D5FA8",
  mutedInk: "#6B7A72",
  white: "#FFFFFF",
} as const;

export const FONTS = {
  display: "'Bricolage Grotesque', Figtree, system-ui, sans-serif",
  body: "Figtree, system-ui, sans-serif",
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

/** Cross-fade length between slides, in frames. */
export const SLIDE_FADE = 9;

/** Build-in of the elements inside a slide, in frames. */
export const BUILD = {
  stagger: 3,
  duration: 13,
  offsetY: 20,
} as const;
