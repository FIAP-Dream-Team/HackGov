import { cancelRender, continueRender, delayRender, staticFile } from "remotion";

// Sora (titles) and Figtree (text), the same OFL files the deck ships in deck/fonts/,
// copied to public/gs/fonts/. Loaded here and the render waits for them: a Google Fonts
// link falls back to another face in headless Chrome (trap paid in Fase 3).

const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const LATIN_EXT =
  "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF";

const FACES: { family: string; slug: string; weights: number[] }[] = [
  { family: "Sora", slug: "sora", weights: [500, 600, 700, 800] },
  { family: "Figtree", slug: "figtree", weights: [400, 500, 600, 700] },
];

let requested = false;

export const loadGsFonts = () => {
  if (requested || typeof document === "undefined") return;
  requested = true;

  const handle = delayRender("Carregando Sora e Figtree do Alertaí");
  const loads: Promise<FontFace>[] = [];
  for (const { family, slug, weights } of FACES) {
    for (const weight of weights) {
      for (const [subset, range] of [
        ["latin", LATIN],
        ["latin-ext", LATIN_EXT],
      ] as const) {
        const url = staticFile(`gs/fonts/${slug}-${subset}-${weight}-normal.woff2`);
        const face = new FontFace(family, `url(${url}) format("woff2")`, {
          weight: String(weight),
          style: "normal",
          unicodeRange: range,
        });
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
        loads.push(face.load());
      }
    }
  }

  Promise.all(loads)
    .then(() => continueRender(handle))
    .catch((error) => cancelRender(new Error(`Fonte do Alertaí nao carregou: ${error}`)));
};
