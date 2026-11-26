import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fade, prog } from "../anim";
import { C, F, MARGIN, RADIUS } from "../tokens";

// Shared layout of M09 and M10, so the two technical problems read the same way:
// left = what the system did (the data), and under it, the code that fixed it;
// right = the alternative we weighed (struck through, with why) and the solution.
// Dark, sober version (17/11): blocks one step above Tinta, 1px rules, highlights in Jacarandá-claro.

const BLOCK = "#2A2240";
const MARK = "rgba(185,164,238,0.22)";

export const LEFT_W = 860;
export const RIGHT_X = 1088;
export const RIGHT_W = 1920 - MARGIN - RIGHT_X; // 704

/** A rows frame: white surface, 1px rule, the single radius. */
export const Frame: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div
    style={{
      position: "absolute",
      left: MARGIN,
      top,
      width: LEFT_W,
      background: BLOCK,
      border: `1px solid ${C.noiteRule}`,
      borderRadius: RADIUS,
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

/**
 * One row of the frame. Enters with a fade at `at`; if `collapseAt` is given, it folds into the
 * row above (height to 0, slide up, fade) — the duplicate becoming one.
 */
export const Row: React.FC<{
  at: number;
  height: number;
  collapseAt?: number;
  first?: boolean;
  children: React.ReactNode;
}> = ({ at, height, collapseAt, first = false, children }) => {
  const frame = useCurrentFrame();
  const c = collapseAt === undefined ? 0 : prog(frame, collapseAt, 0.6);
  const h = height * (1 - c);
  return (
    <div
      style={{
        height: h,
        overflow: "hidden",
        borderTop: first || h < 1 ? "none" : `1px solid ${C.noiteRule}`,
      }}
    >
      <div
        style={{
          height,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 32px",
          transform: `translateY(${-c * height * 0.6}px)`,
          opacity: 1 - c,
          ...fade(frame, at),
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** Short lead-in that names a block (lowercase content, not a spaced caps label). */
export const Lead: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <p style={{ margin: 0, font: `500 24px/1.3 ${F.texto}`, color: C.noite2, ...style }}>{children}</p>
);

/** The alternative we weighed: Sora heading struck through by a 3px Tinta-2 line that sweeps in. */
export const Struck: React.FC<{ children: React.ReactNode; strikeAt: number }> = ({ children, strikeAt }) => {
  const frame = useCurrentFrame();
  const p = prog(frame, strikeAt, 0.6);
  const dim = interpolate(p, [0, 1], [1, 0.62]);
  return (
    <p style={{ margin: "16px 0 0", font: `700 40px/1.2 ${F.titulo}`, letterSpacing: "-0.01em", color: C.noiteTexto }}>
      <span
        style={{
          opacity: dim,
          backgroundImage: `linear-gradient(${C.noite2}, ${C.noite2})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 56%",
          backgroundSize: `${p * 100}% 3px`,
          WebkitBoxDecorationBreak: "slice",
          boxDecorationBreak: "slice",
        }}
      >
        {children}
      </span>
    </p>
  );
};

type Seg = { t: string; k?: "kw" | "mark" | "dim" };

/** Code block under the data: white surface, mono, keywords in Jacarandá, the key part marked in lilac. */
export const Code: React.FC<{ top: number; at: number; markAt: number; lines: Seg[][] }> = ({
  top,
  at,
  markAt,
  lines,
}) => {
  const frame = useCurrentFrame();
  const hl = prog(frame, markAt, 0.5) * 100;
  return (
    <div
      style={{
        position: "absolute",
        left: MARGIN,
        top,
        width: LEFT_W,
        padding: "24px 32px",
        background: BLOCK,
        border: `1px solid ${C.noiteRule}`,
        borderRadius: RADIUS,
        font: `400 24px/1.6 ${F.mono}`,
        color: C.noiteTexto,
        whiteSpace: "pre",
        fontVariantLigatures: "none",
        ...fade(frame, at),
      }}
    >
      {lines.map((line, i) => (
        <div key={i}>
          {line.length === 0
            ? " "
            : line.map((s, j) => (
                <span
                  key={j}
                  style={
                    s.k === "kw"
                      ? { color: C.jacaClaro, fontWeight: 600 }
                      : s.k === "dim"
                        ? { color: C.noite2 }
                        : s.k === "mark"
                          ? {
                              fontWeight: 600,
                              backgroundImage: `linear-gradient(${MARK}, ${MARK})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "0 100%",
                              backgroundSize: `${hl}% 100%`,
                              color: hl > 0 ? C.jacaClaro : C.noiteTexto,
                            }
                          : undefined
                  }
                >
                  {s.t}
                </span>
              ))}
        </div>
      ))}
    </div>
  );
};

/** Right column container: a vertical flow, so later blocks keep their place while still invisible. */
export const RightCol: React.FC<{ top: number; children: React.ReactNode }> = ({ top, children }) => (
  <div
    style={{
      position: "absolute",
      left: RIGHT_X,
      top,
      width: RIGHT_W,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

/** 1px rule between the alternative and the solution. */
export const Rule: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: 1,
        margin: "40px 0",
        background: C.noiteRule,
        transformOrigin: "0 50%",
        transform: `scaleX(${prog(frame, at, 0.5)})`,
      }}
    />
  );
};
