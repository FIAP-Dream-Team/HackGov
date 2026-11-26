import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";

import { fase3Deck as deck, fase3Timing as timing } from "./fase3-timeline";
import { loadFase3Fonts } from "./fase3-fonts";
import { DeckScene } from "./components/DeckScene";
import { SpeakerTag, TAG_HOLD } from "./components/SpeakerTag";
import type { CameraMove } from "./fase3-camera";

loadFase3Fonts();

/** Cross-fade between scenes, in frames. The incoming scene fades in over the outgoing one. */
const FADE = 9;
/** Cover and closing already show every face with its name. */
const TAG_BLOCKED = new Set(["01", "15"]);
/** A tag shorter than this is a flash, not a label. */
const MIN_TAG_FRAMES = 45;
/** A tag later than this into the turn stops saying who is talking. */
const MAX_TAG_DELAY = 75;

// Everything a scene needs, worked out once instead of on every frame.
const scenes = timing.scenes.map((cue, index) => {
  const scene = deck.scenes.find((s) => s.scene === cue.scene);
  if (!scene) throw new Error(`timing.json cita a cena ${cue.scene}, que o deck.json nao tem. Rode fase3:extract.`);
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

const sceneAt = (frame: number) => scenes.find((s) => frame >= s.cue.startFrame && frame < s.cue.endFrame) ?? scenes[scenes.length - 1];

/** Where the speaker tag goes for one turn; null when it cannot appear on time. */
const tagWindow = (turn: { startFrame: number; endFrame: number }) => {
  let start = turn.startFrame;
  for (const s of scenes) {
    if (TAG_BLOCKED.has(s.cue.scene) && start >= s.cue.startFrame && start < s.cue.endFrame) start = s.cue.endFrame;
  }
  if (start - turn.startFrame > MAX_TAG_DELAY) return null;
  const duration = Math.min(TAG_HOLD, turn.endFrame - start);
  return duration >= MIN_TAG_FRAMES ? { start, duration } : null;
};

export const Fase3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1E8E63" }}>
      <style dangerouslySetInnerHTML={{ __html: deck.globalCss }} />

      {scenes.map((s) => (
        <Sequence key={s.cue.scene} from={s.from} durationInFrames={s.durationInFrames} name={`${s.cue.scene} ${s.cue.label}`} layout="none">
          <CrossFade fade={s.fade}>
            <DeckScene scene={s.scene} reveals={s.reveals} camera={s.camera} />
          </CrossFade>
        </Sequence>
      ))}

      {timing.turns.map((turn) => {
        const window = tagWindow(turn);
        if (!window) return null;
        return (
          <Sequence key={turn.startFrame} from={window.start} durationInFrames={window.duration} name={`Locutor ${turn.speaker}`} layout="none">
            <SpeakerTag speaker={turn.speaker} durationInFrames={window.duration} onDark={sceneAt(window.start).scene.tone === "dark"} />
          </Sequence>
        );
      })}

      {/*
        Narration and music bed, already mixed: treated voice by voice
        (scripts/fase-3/treat-voice.py), music carved and ducked under it and the
        bus set to -14 LUFS / -1 dBTP (scripts/fase-3/mix.py).
      */}
      <Audio src={staticFile(timing.audio)} name="Mix" />
    </AbsoluteFill>
  );
};

const CrossFade: React.FC<{ fade: number; children: React.ReactNode }> = ({ fade, children }) => {
  const frame = useCurrentFrame();
  const opacity = fade === 0 ? 1 : interpolate(frame, [0, fade], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
