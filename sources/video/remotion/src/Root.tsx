import React from "react";
import { Composition } from "remotion";
import { MinhaVez } from "./MinhaVez";
import { SlideCheck } from "./SlideCheck";
import { timing } from "./timeline";
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
    </>
  );
};
