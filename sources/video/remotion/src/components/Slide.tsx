import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { BUILD, VIDEO } from "../theme";

/** Turns a deck inline-style string into the object React expects. */
export const parseStyle = (css: string): React.CSSProperties => {
  const style: Record<string, string> = {};
  // Split on semicolons that are not inside parentheses, so `var(--x, y)` and
  // `rgba(0,0,0,.5)` survive intact.
  let depth = 0;
  let buffer = "";
  const declarations: string[] = [];
  for (const char of css) {
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === ";" && depth === 0) {
      declarations.push(buffer);
      buffer = "";
      continue;
    }
    buffer += char;
  }
  declarations.push(buffer);

  for (const declaration of declarations) {
    const separator = declaration.indexOf(":");
    if (separator === -1) continue;
    const property = declaration.slice(0, separator).trim();
    const value = declaration.slice(separator + 1).trim();
    if (!property || !value) continue;
    // Custom properties must keep their literal name; everything else is
    // camel-cased the way React wants it.
    style[property.startsWith("--") ? property : property.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }

  return style as React.CSSProperties;
};

type SlideProps = {
  /** Inline style string copied from the deck <section>. */
  sectionStyle: string;
  /** Inner HTML of the deck <section>, rendered verbatim. */
  html: string;
  /** Skip the staggered build-in (used for stills and thumbnails). */
  staticRender?: boolean;
  /**
   * Direct children to blank out, by index; negative counts from the end. They
   * keep their box so the flex layout is unchanged — this is how the cover and
   * closing drop the printed name footer that the team faces replace.
   */
  hideChildren?: number[];
  /**
   * Elements tagged `data-reveal` in the deck markup, with the local frame each
   * one enters on. An element with no cue here stays visible: appearing early is
   * survivable, never appearing is not.
   */
  reveals?: { id: string; frame: number }[];
};

/** Staging of an individual element inside a slide. */
const REVEAL = { duration: 15, offsetY: 16 } as const;

const easeOut = (progress: number) => 1 - (1 - progress) ** 3;

/**
 * Renders one deck section at its native 1920x1080 and stages its direct
 * children in.
 *
 * The build-in writes straight to the DOM instead of wrapping each child in a
 * React element: the deck relies on the section being a flex or grid container,
 * so an extra wrapper would collapse the layout. Opacity and transform on a
 * flex child do not affect layout, which keeps the frame identical to the deck.
 */
export const Slide: React.FC<SlideProps> = ({
  sectionStyle,
  html,
  staticRender = false,
  hideChildren,
  reveals,
}) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);
  const hidden = hideChildren?.join(",") ?? "";
  const cues = reveals?.map((r) => `${r.id}:${r.frame}`).join(",") ?? "";

  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;

    const count = section.children.length;
    const blanked = new Set((hideChildren ?? []).map((i) => (i < 0 ? count + i : i)));

    for (const [index, node] of Array.from(section.children).entries()) {
      const child = node as HTMLElement;
      child.style.visibility = blanked.has(index) ? "hidden" : "visible";

      if (staticRender) {
        child.style.opacity = "1";
        child.style.transform = "none";
        continue;
      }

      const begin = index * BUILD.stagger;
      const progress = interpolate(frame, [begin, begin + BUILD.duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      // Cubic ease-out: settles fast, no overshoot, calm under narration.
      const eased = easeOut(progress);

      child.style.opacity = String(eased);
      // Whole pixels only: a fractional translate makes Chrome re-rasterise the
      // text at a new subpixel offset every frame, which reads as shimmering.
      child.style.transform = `translateY(${Math.round((1 - eased) * BUILD.offsetY)}px)`;
    }

    // Elements the narration calls out individually.
    const cueByfId = new Map((reveals ?? []).map((r) => [r.id, r.frame]));
    for (const node of Array.from(section.querySelectorAll("[data-reveal]"))) {
      const element = node as HTMLElement;
      const cue = cueByfId.get(element.dataset.reveal ?? "");

      if (staticRender || cue == null) {
        element.style.opacity = "1";
        element.style.transform = "none";
        continue;
      }

      const progress = interpolate(frame, [cue, cue + REVEAL.duration], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const eased = easeOut(progress);
      element.style.opacity = String(eased);
      element.style.transform = `translateY(${Math.round((1 - eased) * REVEAL.offsetY)}px)`;
    }
  }, [frame, staticRender, html, hideChildren, hidden, reveals, cues]);

  return (
    <AbsoluteFill>
      <div
        ref={ref}
        style={{
          width: VIDEO.width,
          height: VIDEO.height,
          overflow: "hidden",
          boxSizing: "border-box",
          ...parseStyle(sectionStyle),
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </AbsoluteFill>
  );
};
