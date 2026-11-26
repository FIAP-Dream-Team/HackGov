import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

import { ec1Deck as deck, ec1Timing as timing } from "./ec1-timeline";
import { loadDeckFonts } from "./deck-fonts";
import { DeckScene } from "./components/DeckScene";
import { SpeakerTag, TAG_HOLD } from "./components/SpeakerTag";
import type { CameraMove } from "./fase3-camera";

loadDeckFonts(deck.fonts, "ec-1/fonts");

/** Cross-fade between scenes, in frames. The incoming scene fades in over the outgoing one. */
const FADE = 9;
/** John narrates alone: his tag shows once, as the first content slide comes in (the cover already has every face). */
const TAG_SCENE = "02";
const TAG_DELAY = 12;
/** The deck's PDF-only parts (the video link) never show in the video. */
const VIDEO_ONLY_CSS = ".scene .only-pdf { display: none !important; }";

const scenes = timing.scenes.map((cue, index) => {
  const scene = deck.scenes.find((s) => s.scene === cue.scene);
  if (!scene) throw new Error(`timing.json cita a cena ${cue.scene}, que o deck.json nao tem. Rode ec1:extract.`);
  const from = cue.startFrame;
  const last = index === timing.scenes.length - 1;
  return {
    cue,
    scene,
    from,
    fade: index === 0 ? 0 : FADE,
    // Stay mounted through the next scene's fade, so it fades in over this one.
    durationInFrames: Math.max(1, cue.endFrame + (last ? 0 : FADE) - from),
    reveals: timing.reveals.filter((r) => r.scene === cue.scene).map((r) => ({ id: r.id, frame: r.startFrame - from })),
    camera: timing.camera
      .filter((c) => c.scene === cue.scene)
      .map((c): CameraMove => ({ focus: c.focus, frame: c.startFrame - from, durationInFrames: c.durationInFrames })),
  };
});

const tagScene = scenes.find((s) => s.cue.scene === TAG_SCENE);

export const EC1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1E8E63" }}>
      <style dangerouslySetInnerHTML={{ __html: `${deck.globalCss}\n${VIDEO_ONLY_CSS}` }} />

      {scenes.map((s) => (
        <Sequence key={s.cue.scene} from={s.from} durationInFrames={s.durationInFrames} name={`${s.cue.scene} ${s.cue.label}`} layout="none">
          <CrossFade fade={s.fade}>
            <DeckScene scene={s.scene} reveals={s.reveals} camera={s.camera} assetBase="ec-1" />
          </CrossFade>
        </Sequence>
      ))}

      {tagScene ? (
        <Sequence from={tagScene.from + TAG_DELAY} durationInFrames={TAG_HOLD} name="Locutor john" layout="none">
          <SpeakerTag speaker="john" durationInFrames={TAG_HOLD} onDark={tagScene.scene.tone === "dark"} />
        </Sequence>
      ) : null}

      {/*
        Narration and music bed, already mixed (scripts/ec-1/treat-voice.py,
        music-bed.mjs, mix.py). Before the narration exists the timing is an
        estimate and there is nothing to play.
      */}
      {timing.audio ? <Audio src={staticFile(timing.audio)} name="Mix" /> : null}
    </AbsoluteFill>
  );
};

const CrossFade: React.FC<{ fade: number; children: React.ReactNode }> = ({ fade, children }) => {
  const frame = useCurrentFrame();
  const opacity = fade === 0 ? 1 : interpolate(frame, [0, fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
