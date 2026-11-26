import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { fase3Deck } from "./fase3-timeline";

let requested = false;

/**
 * Loads the IBM Plex files the deck ships with (public/fase-3/fonts/) and holds
 * the render until they are in. Same files as the browser preview, so a frame
 * never falls back to another face: the first deck export did exactly that with
 * the Google Fonts link, drawing the code in Courier.
 */
export const loadFase3Fonts = () => {
  if (requested || typeof document === "undefined") return;
  requested = true;

  const handle = delayRender("Carregando IBM Plex do deck");
  const faces = fase3Deck.fonts.map((font) => {
    const face = new FontFace(font.family, `url(${staticFile(`fase-3/fonts/${font.file}`)}) format("woff2")`, {
      weight: font.weight,
      style: font.style,
      unicodeRange: font.unicodeRange,
    });
    // FontFaceSet.add exists in every browser Remotion renders with; the DOM lib
    // this project compiles against only declares it with DOM.Iterable.
    (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
    return face.load();
  });

  Promise.all(faces)
    .then(() => continueRender(handle))
    // A missing face must stop the render, not quietly swap the typeface.
    .catch((error) => cancelRender(new Error(`Fonte do deck nao carregou: ${error}`)));
};
