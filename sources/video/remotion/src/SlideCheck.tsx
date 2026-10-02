import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont as loadBricolage } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";

import { deck } from "./timeline";
import { Slide } from "./components/Slide";
import { TeamStrip } from "./components/TeamStrip";
import { COLORS } from "./theme";

loadBricolage();
loadFigtree();

export type SlideCheckProps = {
  /** Zero-based index into the extracted deck sections. */
  index: number;
  /** Draw the team faces over this slide, as the cover and closing do. */
  team: boolean;
};

/**
 * One deck section, fully built, with no timing attached. This is the fast way
 * to check that a slide survived the trip out of the HTML deck before spending
 * a full render on it.
 */
export const SlideCheck: React.FC<SlideCheckProps> = ({ index, team }) => {
  const section = deck.slides[index];

  if (!section) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.greenInk,
          color: COLORS.white,
          alignItems: "center",
          justifyContent: "center",
          fontSize: 48,
        }}
      >
        Slide {index} nao existe (o deck tem {deck.slides.length})
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.greenInk }}>
      <style dangerouslySetInnerHTML={{ __html: deck.globalCss }} />
      <Slide
        sectionStyle={section.style}
        html={section.html}
        staticRender
        hideChildren={team ? [-1] : undefined}
      />
      {team ? <TeamStrip staticRender tone={index === 0 ? "onGreen" : "onDark"} /> : null}
    </AbsoluteFill>
  );
};
