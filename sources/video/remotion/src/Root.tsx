import React from "react";
import { Composition } from "remotion";
import { MinhaVez } from "./MinhaVez";
import { Fase2 } from "./Fase2";
import { Fase2Check } from "./Fase2Check";
import { Fase3 } from "./Fase3";
import { EC1 } from "./EC1";
import { GsTecnico } from "./gs/GsTecnico";
import { GSPitch } from "./GSPitch";
import { gsPitchTiming } from "./gspitch-timeline";
import { SlideCheck } from "./SlideCheck";
import { timing } from "./timeline";
import { fase2Timing } from "./fase2-timeline";
import { fase3Timing } from "./fase3-timeline";
import { ec1Timing } from "./ec1-timeline";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MinhaVez"
        component={MinhaVez}
        // Duration comes from the narration itself, via scripts/align.mjs.
        durationInFrames={Math.max(1, timing.durationInFrames)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* QA only: renders a single deck section, fully built, no audio. */}
      <Composition
        id="SlideCheck"
        component={SlideCheck}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ index: 0, team: true }}
      />

      <Composition
        id="Fase2"
        component={Fase2}
        durationInFrames={Math.max(1, fase2Timing.durationInFrames)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      <Composition
        id="Fase2Check"
        component={Fase2Check}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ page: 11 }}
      />

      {/* Deck HTML da Fase 3 no tempo da narracao: scripts/fase-3/align.mjs. */}
      <Composition
        id="Fase3"
        component={Fase3}
        durationInFrames={Math.max(1, fase3Timing.durationInFrames)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Enterprise Challenge, Atividade 1: deck HTML do EC-1 no tempo da narracao (scripts/ec-1/align.mjs). */}
      <Composition
        id="EC1"
        component={EC1}
        durationInFrames={Math.max(1, ec1Timing.durationInFrames)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* Global Solution 2026 (Alertai): motions do video tecnico, src/gs/. */}
      <GsTecnico />

      {/* Global Solution 2026 (Alertai): pitch, deck timed to the five voices (scripts/gs-pitch/align.mjs). */}
      <Composition
        id="GSPitch"
        component={GSPitch}
        durationInFrames={Math.max(1, gsPitchTiming.durationInFrames)}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
