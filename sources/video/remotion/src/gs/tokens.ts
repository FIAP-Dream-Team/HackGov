// Alertaí visual system, same tokens as the deck (sources/video/global-solution/deck/alertai.html)
// and the app (frontend/src/styles/tema.css). Rules that came with them (approved by John, 16/11):
// spacing in multiples of 8, side margin 128, one radius (16), 1px rules instead of shadows,
// color with a function (Jacarandá = brand and what the voice points at, Folha = cascade / the
// warning that arrives in time, red/orange/yellow only for severity with the word written),
// the logo lilac never as text, no small caps label above every title.

export const C = {
  petala: "#F6F3FB",
  lilas: "#ECE6F8",
  aguaMapa: "#E0D9F1",
  rule: "#DCD3EE",
  tinta: "#221B33",
  tinta2: "#5D5470",
  jaca: "#5B3FA8",
  jacaClaro: "#B9A4EE",
  folha: "#27704C",
  atencao: "#F2C230",
  perigo: "#E8731C",
  grande: "#C62828",
  resolvido: "#2E7D4F",
  contexto: "#8E80B8",
  noiteTexto: "#F6F3FB",
  noite2: "#B8AECF",
  noiteRule: "#3A3150",
  acentoLogo: "#9B7FE0",
  branco: "#FFFFFF",
} as const;

export const F = {
  titulo: "'Sora', system-ui, sans-serif",
  texto: "'Figtree', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
} as const;

/** Type scale of the deck: 20 note, 24 label, 30 body, 44 highlight, 72 title, 200 number. */
export const S = {
  nota: 20,
  rotulo: 24,
  corpo: 30,
  destaque: 44,
  titulo: 72,
  numero: 200,
} as const;

export const MARGIN = 128;
export const RADIUS = 16;
export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** Seconds to frames at the project rate. */
export const sec = (s: number) => Math.round(s * FPS);
