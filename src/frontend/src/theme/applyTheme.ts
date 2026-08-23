import tokens from './tokens'

type ColorScale = Record<string, string>

export function applyTheme() {
  const root = document.documentElement.style
  const colors = tokens.core.color as Record<string, ColorScale>

  for (const [name, scale] of Object.entries(colors)) {
    for (const [step, value] of Object.entries(scale)) {
      root.setProperty(`--color-${name}-${step}`, value)
    }
  }
}
