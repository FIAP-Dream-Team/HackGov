import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { VIDEO } from "../theme";

type PdfSlideProps = {
  /** Path under public/, e.g. fase-2/01.jpg */
  file: string;
};

/** One rasterized deck page, already 1920x1080. */
export const PdfSlide: React.FC<PdfSlideProps> = ({ file }) => (
  <AbsoluteFill>
    <Img
      src={staticFile(file)}
      style={{ width: VIDEO.width, height: VIDEO.height, objectFit: "cover" }}
    />
  </AbsoluteFill>
);
