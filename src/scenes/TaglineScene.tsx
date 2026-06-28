import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../lib/theme";

export type Word = { t: string; accent?: boolean };

/** Kinetic tagline: words rise in, `accent: true` words use the theme accent. */
export const TaglineScene: React.FC<{ theme: Theme; words: Word[] }> = ({ theme, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        background: theme.gradient,
        fontFamily: theme.fontFamily,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 220px",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 24px", justifyContent: "center" }}>
        {words.map((w, i) => {
          const p = spring({ frame: frame - i * 8, fps, config: { damping: 200 } });
          return (
            <span
              key={i}
              style={{
                fontSize: 88,
                fontWeight: 700,
                lineHeight: 1.15,
                color: w.accent ? theme.accent : theme.text,
                opacity: p,
                transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
              }}
            >
              {w.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
