import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../lib/theme";
import { PhoneFrame } from "../lib/PhoneFrame";

/**
 * Feature beat: caption on one side, animated phone on the other.
 * Pass a screenshot `src` OR a `screen` node (e.g. <MockScreen/>).
 */
export const FeatureScene: React.FC<{
  theme: Theme;
  kicker: string;
  headline: string;
  sub: string;
  side?: "left" | "right";
  src?: string;
  screen?: React.ReactNode;
}> = ({ theme, kicker, headline, sub, side = "right", src, screen }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const phoneP = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const textP = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  const float = Math.sin(frame / 24) * 10;

  const phone = (
    <div
      style={{
        transform: `translateY(${interpolate(phoneP, [0, 1], [120, float])}px) scale(${interpolate(phoneP, [0, 1], [0.86, 1])}) rotate(${interpolate(phoneP, [0, 1], [side === "right" ? 4 : -4, 0])}deg)`,
        opacity: phoneP,
      }}
    >
      <PhoneFrame theme={theme} src={src} width={420}>
        {screen}
      </PhoneFrame>
    </div>
  );

  const text = (
    <div
      style={{
        maxWidth: 620,
        opacity: textP,
        transform: `translateX(${interpolate(textP, [0, 1], [side === "right" ? -50 : 50, 0])}px)`,
      }}
    >
      <div style={{ color: theme.accent, fontSize: 30, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", marginBottom: 18 }}>
        {kicker}
      </div>
      <h2 style={{ color: theme.text, fontSize: 76, fontWeight: 700, lineHeight: 1.05, margin: 0 }}>{headline}</h2>
      <p style={{ color: theme.muted, fontSize: 34, lineHeight: 1.4, marginTop: 26 }}>{sub}</p>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        background: theme.gradient,
        fontFamily: theme.fontFamily,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: "0 140px",
      }}
    >
      {side === "right" ? (
        <>
          {text}
          {phone}
        </>
      ) : (
        <>
          {phone}
          {text}
        </>
      )}
    </AbsoluteFill>
  );
};
