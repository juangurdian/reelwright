import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../lib/theme";

/** Logo (optional) + tagline + a glowing call-to-action chip. */
export const OutroScene: React.FC<{
  theme: Theme;
  brand: string;
  tagline: string;
  cta: string;
  logoSrc?: string;
}> = ({ theme, brand, tagline, cta, logoSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 200 } });
  const ctaP = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  const pulse = 1 + Math.sin(frame / 14) * 0.04;

  return (
    <AbsoluteFill style={{ background: theme.gradient, fontFamily: theme.fontFamily, justifyContent: "center", alignItems: "center" }}>
      {logoSrc ? (
        <Img src={logoSrc} style={{ width: 150, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})`, filter: `drop-shadow(0 0 44px ${theme.accent}66)` }} />
      ) : null}
      <h1 style={{ color: theme.text, fontSize: 96, fontWeight: 700, margin: logoSrc ? "28px 0 0" : 0, opacity: p }}>{brand}</h1>
      <p style={{ color: theme.muted, fontSize: 36, margin: "12px 0 44px", opacity: p, textAlign: "center", maxWidth: 1000, lineHeight: 1.3 }}>
        {tagline}
      </p>
      <div
        style={{
          background: theme.accent,
          color: theme.bg,
          fontSize: 42,
          fontWeight: 700,
          padding: "20px 60px",
          borderRadius: 18,
          opacity: ctaP,
          transform: `scale(${ctaP * pulse})`,
          boxShadow: `0 0 60px ${theme.accent}55`,
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};
