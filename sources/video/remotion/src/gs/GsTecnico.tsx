import React from "react";
import { Composition, Folder } from "remotion";
import { BEATS, OVERLAY_DUR } from "./tecnico-beats";
import { FPS, H, W, sec } from "./tokens";
import { M01 } from "./tecnico/M01";
import { M02 } from "./tecnico/M02";
import { M03 } from "./tecnico/M03";
import { M05 } from "./tecnico/M05";
import { M07 } from "./tecnico/M07";
import { M08 } from "./tecnico/M08";
import { M09 } from "./tecnico/M09";
import { M10 } from "./tecnico/M10";
import { M11 } from "./tecnico/M11";
import { OVERLAYS, Overlay } from "./tecnico/overlays";
import { TecnicoEdit, gsTecnicoEdl } from "./TecnicoEdit";

// Motions of the Alertaí technical video (backlog E6). Full-screen inserts render to H.264;
// overlays render to ProRes 4444 with alpha (scripts/gs/render-tecnico.mjs). GSTecnico is the whole
// edit, cut from John's narration by scripts/gs-tecnico/build.py.
export const FULLSCREEN = [
  { id: "GS-M01-abertura", component: M01, dur: BEATS.M01.dur },
  { id: "GS-M02-camadas", component: M02, dur: BEATS.M02.dur },
  { id: "GS-M03-modelo", component: M03, dur: BEATS.M03.dur },
  { id: "GS-M05-mapa-cascata", component: M05, dur: BEATS.M05.dur },
  { id: "GS-M07-dados", component: M07, dur: BEATS.M07.dur },
  { id: "GS-M08-prepared", component: M08, dur: BEATS.M08.dur },
  { id: "GS-M09-problema1", component: M09, dur: BEATS.M09.dur },
  { id: "GS-M10-problema2", component: M10, dur: BEATS.M10.dur },
  { id: "GS-M11-fecho", component: M11, dur: BEATS.M11.dur },
] as const;

export const GsTecnico: React.FC = () => (
  <Folder name="GS-tecnico">
    <Composition id="GSTecnico" component={TecnicoEdit} durationInFrames={Math.max(1, gsTecnicoEdl.durationInFrames)} fps={FPS} width={W} height={H} />
    {FULLSCREEN.map((m) => (
      <Composition key={m.id} id={m.id} component={m.component} durationInFrames={sec(m.dur)} fps={FPS} width={W} height={H} />
    ))}
    {OVERLAYS.map((o) => (
      <Composition
        key={o.id}
        id={o.id}
        component={Overlay}
        defaultProps={{ spec: o }}
        durationInFrames={sec(OVERLAY_DUR)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </Folder>
);
