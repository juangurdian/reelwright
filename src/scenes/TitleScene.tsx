import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../lib/theme";

/** Logo (optional) + brand name reveal with a glow and gentle float. */
export const TitleScene: React.FC<{ theme: Theme; brand: string; logoSrc?: string }> = ({
  theme,
  brand,
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoP = spring({ frame, fps, config: { damping: 200, mass: 0.7 } });
  const wordP = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const float = Math.sin(frame / 22) * 8;
  const glow = interpolate(Math.sin(frame / 18), [-1, 1], [0.25, 0.55]);

  return (
    <AbsoluteFill
      style={{
        background: theme.gradient,
        fontFamily: theme.fontFamily,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {logoSrc ? (
        <Img
          src={logoSrc}
          style={{
            width: 200,
            opacity: logoP,
            transform: `translateY(${interpolate(logoP, [0, 1], [40, float])}px) scale(${interpolate(logoP, [0, 1], [0.7, 1])})`,
            filter: `drop-shadow(0 0 ${40 * glow}px ${theme.accent})`,
          }}
        />
      ) : null}
      <h1
        style={{
          color: theme.text,
          fontSize: 110,
          fontWeight: 700,
          letterSpacing: 2,
          margin: 0,
          marginTop: logoSrc ? 36 : 0,
          opacity: wordP,
          transform: `translateY(${interpolate(wordP, [0, 1], [30, 0])}px)`,
          textShadow: `0 0 ${30 * glow}px ${theme.accent}55`,
        }}
      >
        {brand}
      </h1>
    </AbsoluteFill>
  );
};
