import React from "react";
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

import { gsPitchDeck as deck, gsPitchTiming as timing } from "./gspitch-timeline";
import { loadDeckFonts } from "./deck-fonts";
import { DeckScene } from "./components/DeckScene";
import { GsSpeakerTag, GS_TAG_HOLD } from "./components/GsSpeakerTag";

loadDeckFonts(deck.fonts, "gs-pitch/fonts");

// Pitch of the Alertaí (Global Solution 2026, Entrega 1). The deck (global-solution/deck/alertai.html)
// timed to the five recorded voices by scripts/gs-pitch/align.mjs, the app takes playing inside the
// deck's phone and browser frames, and a speaker tag on every change of voice.

/** Cross-fade between scenes, in frames. */
const FADE = 9;
/** The signature scene already shows the whole team by name. */
const TAG_BLOCKED = new Set(["11"]);
const MIN_TAG_FRAMES = 45;
/** The tag fades in over 12 frames: it starts this much before the voice, so it is there with the first word. */
const TAG_LEAD = 6;
/** Same entrance as the deck's default fade (DeckScene): 14 frames, 14 px rise. */
const ENTER = 14;
const RISE = 14;

type Rect = { left: number; top: number; width: number; height: number; radius: number };
/** Part of the phone recording (384x832) hidden above the screen: the status bar and Chrome's address bar. */
type Crop = { sourceWidth: number; sourceHeight: number; top: number };

// The phone takes are screen recordings of the prototype in Chrome. The status bar and the address
// bar end at y 77 (page at rest) or 66 (scrolled, the bar shrinks); the app header starts at 102-118.
// Hiding the top 92 px removes the browser in both states and keeps the app whole. The deck's phone
// is made as tall as what is left (PHONE_CSS): 384x740 at 344 wide is a 344x663 screen.
const PHONE_CROP: Crop = { sourceWidth: 384, sourceHeight: 832, top: 92 };
const SCREEN_H = Math.round(((PHONE_CROP.sourceHeight - PHONE_CROP.top) * 344) / PHONE_CROP.sourceWidth);
// .phone: 14 px bezel, 50 px screen radius, right 128. s05 is centred (top 194), s06 and s07 at 232.
// The browser of s08 sits in .body (128, 288) at (1040, 40), 504 wide with a 12 px bezel: its screen is
// set to 16:9 (480x270) so the computer take fills it without losing the sides.
const PHONE_CSS = `
.s-alertai .phone { top: 194px; height: ${SCREEN_H + 28}px; }
.s-funciona .phone, .s-cascata .phone { height: ${SCREEN_H + 28}px; }
.s-proto .browser img { height: 270px; object-fit: cover; object-position: top; }
/* Where the take enters together with its frame, the still under it would show through the fade. */
.s-alertai .phone img, .s-cascata .phone img, .s-proto .browser img, .s-mapa .browser img { visibility: hidden; }
`;

/**
 * Each reveal enters with the length align.mjs timed it for (timing.json, durationInFrames): the cue is
 * set so the element is legible when its word starts, which only holds if the entrance lasts exactly what
 * the cue assumed. Elements with their own data-dur in the deck keep it (align.mjs reads it too).
 */
const durationById = new Map(timing.reveals.map((r) => [r.id, r.durationInFrames]));
const withEntranceLengths = (html: string) =>
  // The optional "/" keeps SVG's self-closing tags (<path .../>) self-closing.
  html.replace(/<([a-z][a-z0-9]*)(\s[^>]*?data-reveal="([^"]*)"[^>]*?)(\/?)>/g, (tag, name: string, attrs: string, id: string, close: string) => {
    if (/\sdata-dur=/.test(attrs)) return tag;
    const dur = durationById.get(id);
    return dur ? `<${name}${attrs} data-dur="${dur}"${close}>` : tag;
  });
const PHONE_HIGH: Rect = { left: 1434, top: 208, width: 344, height: SCREEN_H, radius: 50 };
const PHONE_LOW: Rect = { left: 1434, top: 246, width: 344, height: SCREEN_H, radius: 50 };
const BROWSER: Rect = { left: 1180, top: 340, width: 480, height: 270, radius: 12 };
// s05m: .browser at (128, 288), 1092 wide with a 12 px bezel; the take is a 1135x680 crop, 1068x640 here.
const BROWSER_MAP: Rect = { left: 140, top: 300, width: 1068, height: 640, radius: 12 };

/** A stretch of a recording, in seconds of that file. */
type Clip = { file: string; from: number; to: number };

type Take = {
  scene: string;
  /** Played one after the other; the last frame holds until the next take or the end of the scene. */
  clips: Clip[];
  /** data-reveal whose cue starts the take. */
  at?: string;
  /**
   * Fala whose sound was recorded with this take (João narrating while he uses the map). The take then
   * starts with the scene, at the second of the file that matches the narration, and stays in sync.
   */
  sync?: string;
  rect: Rect;
  /** Phone recordings hide the browser's bars; computer takes fill the screen. */
  crop?: Crop;
  /** The take enters together with the frame (same fade); otherwise it cuts in over the still. */
  enters?: boolean;
  /** Frames its first frame holds before it plays (a synced take whose sound starts after the cut). */
  delay?: number;
};

// edicao-pitch.md, "Takes do app". The phone recordings were made in Safari on an iPhone: at the top of a
// page Safari shows its full address bar and a bottom toolbar, and it shrinks both once the page scrolls.
// Only the scrolled stretches are used (each frame classified on 17/11: address-bar text at rows 68-80
// means the full UI). That also drops the page reload at the start of B20, the Mapa screen at the start
// of B23, the iOS bairro picker and the keyboard of the Reportar take.
//   s05  B20 Início scrolled (Guaíba, mapa, seus bairros) -> X1 Mapa ao vivo
//   s06  Reportar with "Falta de água" picked -> gravidade and the Enviar button -> B22 Ocorrência ("Já voltou" 0 -> 1 de 3)
//   s07  B23 Alerta em cascata scrolling through the porquê, o que fazer and the contacts
//   s08  B25 the flow on the computer
const TAKES: Take[] = [
  {
    scene: "05", at: "s05-app", rect: PHONE_HIGH, crop: PHONE_CROP, enters: true,
    clips: [{ file: "B20-inicio.mp4", from: 3.5, to: 7.1 }, { file: "X1-mapa-ao-vivo.mp4", from: 4.1, to: 6.0 }],
  },
  {
    scene: "06", at: "s06-r1", rect: PHONE_LOW, crop: PHONE_CROP,
    clips: [{ file: "B21-reportar-completo.mp4", from: 3.55, to: 4.5 }, { file: "B21-reportar-completo.mp4", from: 7.0, to: 10.6 }],
  },
  { scene: "06", at: "s06-r3", rect: PHONE_LOW, crop: PHONE_CROP, clips: [{ file: "B22-ocorrencia.mp4", from: 1.2, to: 4.15 }] },
  {
    scene: "07", at: "s07-app", rect: PHONE_LOW, crop: PHONE_CROP, enters: true,
    clips: [{ file: "B23-alerta-cascata.mp4", from: 4.85, to: 10.55 }],
  },
  { scene: "08", at: "s08-pc", rect: BROWSER, enters: true, clips: [{ file: "B25-fluxo-computador.mp4", from: 0.5, to: 18.25 }] },
  // Review of 18/11: falas/joao-mapa.mp4 cropped to the app (no sidebar), the open "Ir para" list
  // covered until it closes at 3.5 s. `from` is replaced by the sync point.
  { scene: "05m", sync: "f05m", rect: BROWSER_MAP, clips: [{ file: "X2-mapa-computador.mp4", from: 0, to: 19.6 }] },
];

const revealFrame = (id: string | undefined) => {
  const r = timing.reveals.find((x) => x.id === id);
  if (!r) throw new Error(`O take depende do reveal ${id}, que nao esta no timing.json. Rode scripts/gs-pitch/align.mjs.`);
  return r.startFrame;
};

const scenes = timing.scenes.map((cue, index) => {
  const raw = deck.scenes.find((s) => s.scene === cue.scene);
  if (!raw) throw new Error(`timing.json cita a cena ${cue.scene}, que o deck.json nao tem. Rode extract-deck.`);
  const scene = { ...raw, html: withEntranceLengths(raw.html) };
  const from = cue.startFrame;
  const last = index === timing.scenes.length - 1;
  const durationInFrames = Math.max(1, cue.endFrame + (last ? 0 : FADE) - from);
  const own = TAKES.filter((t) => t.scene === cue.scene);
  return {
    cue,
    scene,
    from,
    fade: index === 0 ? 0 : FADE,
    durationInFrames,
    reveals: timing.reveals.filter((r) => r.scene === cue.scene).map((r) => ({ id: r.id, frame: r.startFrame - from })),
    // Each take runs until the next one in the scene, or to the end of the scene, frozen on its last frame.
    takes: own.map((t, k) => {
      const end = k + 1 < own.length ? revealFrame(own[k + 1].at) - from : durationInFrames;
      if (t.sync) {
        const fala = timing.falas.find((f) => f.id === t.sync);
        if (fala?.placedAt == null || fala.sourceIn == null) {
          throw new Error(`O take de ${t.scene} sincroniza com ${t.sync}, sem placedAt/sourceIn no timing.json. Rode align.mjs.`);
        }
        // Narration second T plays source second sourceIn + (T - placedAt). When the scene cuts in
        // before the fala's audio begins, the first frame holds on screen until it does.
        const lead = cue.start - fala.placedAt;
        const delay = Math.max(0, Math.round(-lead * timing.fps));
        const clips = t.clips.map((c) => ({ ...c, from: fala.sourceIn! + Math.max(0, lead) }));
        return { ...t, clips, delay, start: 0, duration: Math.max(1, end) };
      }
      const start = revealFrame(t.at) - from;
      return { ...t, start, duration: Math.max(1, end - start) };
    }),
  };
});

const sceneAt = (frame: number) => scenes.find((s) => frame >= s.cue.startFrame && frame < s.cue.endFrame) ?? scenes[scenes.length - 1];

/** Where the speaker tag goes for one turn; null when it would be a flash or land on the signature. */
const tagWindow = (turn: { startFrame: number; endFrame: number }) => {
  const start = Math.max(0, turn.startFrame - TAG_LEAD);
  if (TAG_BLOCKED.has(sceneAt(start).cue.scene)) return null;
  const duration = Math.min(GS_TAG_HOLD, turn.endFrame - start);
  return duration >= MIN_TAG_FRAMES ? { start, duration } : null;
};

export const GSPitch: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#221B33" }}>
      <style dangerouslySetInnerHTML={{ __html: `${deck.globalCss}
${PHONE_CSS}` }} />

      {scenes.map((s) => (
        <Sequence key={s.cue.scene} from={s.from} durationInFrames={s.durationInFrames} name={`${s.cue.scene} ${s.cue.label}`} layout="none">
          <CrossFade fade={s.fade}>
            <DeckScene scene={s.scene} reveals={s.reveals} camera={[]} assetBase="gs-pitch" />
            {s.takes.map((t) => (
              <Sequence key={`${t.at ?? t.sync}`} from={t.start} durationInFrames={t.duration} name={`Take ${t.clips.map((c) => c.file).join(" + ")}`} layout="none">
                <TakeLayer take={t} />
              </Sequence>
            ))}
          </CrossFade>
        </Sequence>
      ))}

      {timing.turns.map((turn) => {
        const window = tagWindow(turn);
        if (!window) return null;
        return (
          <Sequence key={turn.startFrame} from={window.start} durationInFrames={window.duration} name={`Locutor ${turn.speaker}`} layout="none">
            <GsSpeakerTag speaker={turn.speaker} durationInFrames={window.duration} onDark={sceneAt(window.start).scene.tone === "dark"} />
          </Sequence>
        );
      })}

      {/* Five voices treated one by one, music bed ducked under them, bus at -14 LUFS (scripts/gs-pitch). */}
      <Audio src={staticFile(timing.audio)} name="Mix" />
    </AbsoluteFill>
  );
};

const TakeLayer: React.FC<{ take: Take }> = ({ take }) => {
  const frame = useCurrentFrame();
  const fps = timing.fps;
  // Which clip this frame falls in; past the last one, its last frame holds.
  const lengths = take.clips.map((c) => Math.max(1, Math.floor((c.to - c.from) * fps)));
  let k = 0;
  let local = Math.max(0, frame - (take.delay ?? 0));
  while (k < take.clips.length - 1 && local >= lengths[k]) {
    local -= lengths[k];
    k += 1;
  }
  const clip = take.clips[k];
  const held = Math.min(local, lengths[k] - 1);
  const p = take.enters ? interpolate(frame, [0, ENTER], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const eased = 1 - (1 - p) ** 3;
  const { left, top, width, height, radius } = take.rect;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        overflow: "hidden",
        borderRadius: radius,
        opacity: eased,
        transform: eased >= 1 ? undefined : `translateY(${Math.round((1 - eased) * RISE)}px)`,
      }}
    >
      <Freeze frame={held}>
        <OffthreadVideo
          key={`${clip.file}@${clip.from}`}
          src={staticFile(`gs-pitch/takes/${clip.file}`)}
          trimBefore={Math.round(clip.from * fps)}
          muted
          style={
            take.crop
              ? {
                  position: "absolute",
                  left: 0,
                  top: -(take.crop.top * width) / take.crop.sourceWidth,
                  width,
                  height: (take.crop.sourceHeight * width) / take.crop.sourceWidth,
                }
              : { width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }
          }
        />
      </Freeze>
    </div>
  );
};

const CrossFade: React.FC<{ fade: number; children: React.ReactNode }> = ({ fade, children }) => {
  const frame = useCurrentFrame();
  const opacity = fade === 0 ? 1 : interpolate(frame, [0, fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
