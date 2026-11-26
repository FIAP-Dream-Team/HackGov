import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import type { DeckFont } from "./fase3-timeline";

const requested = new Set<string>();

/**
 * Loads the font files a deck ships with (public/<base>/) and holds the render
 * until they are in, so a frame never falls back to another face. Same idea as
 * loadFase3Fonts, for any deck the extractor wrote.
 */
export const loadDeckFonts = (fonts: DeckFont[], base: string) => {
  if (requested.has(base) || typeof document === "undefined") return;
  requested.add(base);

  const handle = delayRender(`Carregando as fontes de ${base}`);
  const faces = fonts.map((font) => {
    const face = new FontFace(font.family, `url(${staticFile(`${base}/${font.file}`)}) format("woff2")`, {
      weight: font.weight,
      style: font.style,
      unicodeRange: font.unicodeRange,
    });
    (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
    return face.load();
  });

  Promise.all(faces)
    .then(() => continueRender(handle))
    // A missing face must stop the render, not quietly swap the typeface.
    .catch((error) => cancelRender(new Error(`Fonte do deck nao carregou: ${error}`)));
};
