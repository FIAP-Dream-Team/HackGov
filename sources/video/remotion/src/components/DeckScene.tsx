import React, { useLayoutEffect, useMemo, useRef } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cameraAt, type CameraMove } from "../fase3-camera";
import type { DeckScene as DeckSceneData } from "../fase3-timeline";

type DeckSceneProps = {
  scene: DeckSceneData;
  /** data-reveal ids with the frame, relative to the scene, each one enters on. */
  reveals: { id: string; frame: number }[];
  /** Camera moves on the scene's figure, relative to the scene. */
  camera: CameraMove[];
  /** Folder under public/ the deck's img/ was copied to by the extractor. */
  assetBase?: string;
};

/**
 * How an element the narration calls out comes in, picked by its data-anim.
 * Without data-anim it fades and rises, which is all the Fase 3 deck uses.
 *
 *   fade       opacity and a 14px rise
 *   wipe       uncovered from one side (data-dir: right, the default, left, up, down)
 *   draw       the strokes of an SVG drawn along their length (solid lines only)
 *   count      the number counts up to data-count (data-decimals for decimals)
 *   pop        grows from data-scale (default 0.7) while it fades in
 *   highlight  the <mark> highlighter sweeps in; the text itself never hides
 *
 * data-dur overrides the length, in frames.
 */
type Anim = "fade" | "wipe" | "draw" | "count" | "pop" | "highlight";
const DURATION: Record<Anim, number> = { fade: 14, wipe: 22, draw: 26, count: 30, pop: 14, highlight: 18 };
const RISE = 14;
/** A wipe uncovers along one axis and leaves this much room on the other, so labels hanging outside the box still show. */
const WIPE_BLEED = "-400px";
/** How far a legend item fades while the camera is on another one. */
const LEGEND_DIM = 0.38;
const LEGEND_FADE = 12;

const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

const wipeClip = (dir: string, p: number) => {
  const hidden = `${((1 - p) * 100).toFixed(3)}%`;
  const b = WIPE_BLEED;
  switch (dir) {
    case "left":
      return `inset(${b} 0 ${b} ${hidden})`;
    case "up":
      return `inset(${hidden} ${b} 0 ${b})`;
    case "down":
      return `inset(0 ${b} ${hidden} ${b})`;
    default:
      return `inset(${b} ${hidden} ${b} 0)`;
  }
};

const STROKES = "path, line, polyline, polygon, circle, rect, ellipse";

/** Draws every stroke under `node` to `p` of its length. */
const drawStrokes = (node: Element, p: number) => {
  const targets = node.matches(STROKES) ? [node] : Array.from(node.querySelectorAll(STROKES));
  for (const el of targets as SVGGeometryElement[]) {
    if (typeof el.getTotalLength !== "function") continue;
    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length * (1 - p)}`;
  }
};

/**
 * One section of a deck (Fase 3, EC-1), rendered verbatim at 1920x1080 and
 * animated frame by frame: elements tagged data-reveal enter on their cue, the
 * figure follows its camera moves, and the legend item that explains what the
 * camera is on stays lit while the others step back.
 *
 * Styles are written straight to the DOM, as in Fase 1's Slide: wrapping deck
 * nodes in React elements would break the deck's own grid and flex layouts.
 * Every frame sets every animated property from scratch, so any frame renders
 * the same on its own, which is what parallel rendering needs.
 */
export const DeckScene: React.FC<DeckSceneProps> = ({ scene, reveals, camera, assetBase = "fase-3" }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLDivElement>(null);

  // The deck points at img/...; in the bundle those files live in public/<assetBase>/img/.
  const html = useMemo(
    () => scene.html.replace(/src="img\/([^"]+)"/g, (_, path: string) => `src="${staticFile(`${assetBase}/img/${path}`)}"`),
    [scene.html, assetBase],
  );

  // Raw <img> tags are invisible to Remotion, so the frame waits for them here.
  useLayoutEffect(() => {
    const pending = Array.from(ref.current?.querySelectorAll("img") ?? []).filter((img) => !img.complete);
    if (!pending.length) return;
    const handle = delayRender(`Imagens da cena ${scene.scene}`);
    let left = pending.length;
    const done = () => {
      left -= 1;
      if (left === 0) continueRender(handle);
    };
    for (const img of pending) {
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    }
  }, [html, scene.scene]);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    // --- reveals ----------------------------------------------------------
    const cueById = new Map(reveals.map((r) => [r.id, r.frame]));
    const revealOpacity = new Map<HTMLElement, number>();
    for (const node of Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))) {
      const cue = cueById.get(node.dataset.reveal ?? "");
      const anim = (node.dataset.anim ?? "fade") as Anim;
      const duration = Number(node.dataset.dur) || DURATION[anim] || DURATION.fade;
      // No cue: complete for the whole scene. Appearing early beats never appearing.
      const raw = cue == null ? 1 : clamp01((frame - cue) / duration);
      let opacity = 1;

      switch (anim) {
        case "wipe": {
          const p = easeInOut(raw);
          node.style.clipPath = p >= 1 ? "" : wipeClip(node.dataset.dir ?? "right", p);
          break;
        }
        case "draw": {
          const p = easeInOut(raw);
          drawStrokes(node, p);
          // A zero-length dash still paints round caps as dots.
          opacity = p > 0 ? 1 : 0;
          break;
        }
        case "count": {
          const p = easeOut(raw);
          const target = Number(node.dataset.count ?? "0");
          const decimals = Number(node.dataset.decimals ?? "0");
          node.textContent = (target * p).toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
          opacity = clamp01(raw * 4);
          break;
        }
        case "pop": {
          const p = easeOut(raw);
          const from = Number(node.dataset.scale ?? "0.7");
          opacity = p;
          node.style.transform = p >= 1 ? "" : `scale(${(from + (1 - from) * p).toFixed(4)})`;
          break;
        }
        case "highlight": {
          node.style.setProperty("--hl", `${(easeInOut(raw) * 100).toFixed(2)}%`);
          break;
        }
        default: {
          const p = easeOut(raw);
          opacity = p;
          // Whole pixels: a fractional translate re-rasterises text every frame and shimmers.
          if (getComputedStyle(node).display !== "inline") {
            node.style.transform = p >= 1 ? "" : `translateY(${Math.round((1 - p) * RISE)}px)`;
          }
        }
      }
      revealOpacity.set(node, opacity);
      node.style.opacity = String(opacity);
    }

    // --- camera -----------------------------------------------------------
    const stage = root.querySelector<HTMLElement>(".fig-stage");
    const canvasEl = root.querySelector<HTMLElement>(".fig-canvas");
    let shot: { focus: string; since: number } | null = null;
    if (stage && canvasEl && scene.canvas) {
      const result = cameraAt(
        frame,
        scene.camera ?? "tudo",
        camera,
        scene.focus,
        { width: stage.clientWidth, height: stage.clientHeight },
        scene.canvas,
      );
      canvasEl.style.transform = result.transform;
      shot = result;
    }

    // --- legend follows the camera ----------------------------------------
    if (shot) {
      const { focus, since } = shot;
      const previous = camera.filter((m) => m.frame < since).pop()?.focus ?? scene.camera ?? "tudo";
      const weight = (target: string, item: string) => (target === "tudo" || target === item ? 1 : LEGEND_DIM);
      const t = interpolate(frame, [since, since + LEGEND_FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      for (const item of Array.from(root.querySelectorAll<HTMLElement>("[data-legend-for]"))) {
        const key = item.dataset.legendFor ?? "";
        const lit = weight(previous, key) + (weight(focus, key) - weight(previous, key)) * t;
        item.style.opacity = String((revealOpacity.get(item) ?? 1) * lit);
      }
    }
  }, [frame, reveals, camera, scene]);

  return (
    <AbsoluteFill>
      <div ref={ref} style={{ width: 1920, height: 1080, overflow: "hidden" }} dangerouslySetInnerHTML={{ __html: html }} />
    </AbsoluteFill>
  );
};
