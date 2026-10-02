import React from "react";
import { AbsoluteFill } from "remotion";

import { fase2Timing } from "./fase2-timeline";
import { PdfSlide } from "./components/PdfSlide";
import { COLORS } from "./theme";

export type Fase2CheckProps = {
  /** 1-based page number in the PDF / roteiro (1 = capa, 12 = encerramento). */
  page: number;
};

/** One rasterized Fase 2 slide, no timing. */
export const Fase2Check: React.FC<Fase2CheckProps> = ({ page }) => {
  const slide = fase2Timing.slides.find((entry) => Number(entry.slide) === page);

  if (!slide) {
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
        Slide {page} nao existe (o deck tem {fase2Timing.slides.length})
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.cream }}>
      <PdfSlide file={slide.file} />
    </AbsoluteFill>
  );
};
