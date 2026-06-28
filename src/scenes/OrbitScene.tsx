import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Theme } from "../lib/theme";

export type OrbitItem = { label: string; src?: string; color?: string };

/**
 * Items orbit a glowing center in a depth-scaled ellipse (fake 3D).
 * Pass `src` per item for real cut-out images, or omit for a colored badge.
 */
export const OrbitScene: React.FC<{
  theme: Theme;
  items: OrbitItem[];
  centerLogoSrc?: string;
  caption: string;
  captionAccent?: string;
}> = ({ theme, items, centerLogoSrc, caption, captionAccent }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const Rx = width * 0.3;
  const Ry = height * 0.2;
  const orbit = frame * 0.014;
  const n = items.length;

  return (
    <AbsoluteFill style={{ background: theme.gradient, fontFamily: theme.fontFamily, perspective: 1400 }}>
      {/* connection lines */}
      {items.map((_, i) => {
        const a = orbit + (i / n) * Math.PI * 2;
        const x = cx + Rx * Math.cos(a);
        const y = cy + Ry * Math.sin(a);
        const dist = Math.hypot(x - cx, y - cy);
        const ang = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
        const depth = (Math.sin(a) + 1) / 2;
        const pop = spring({ frame: frame - 14 - i * 7, fps, config: { damping: 200 } });
        const pulse = 0.3 + 0.4 * ((Math.sin(frame / 8 - i) + 1) / 2);
        return (
          <div
            key={`l${i}`}
            style={{
              position: "absolute",
              left: cx,
              top: cy,
              width: dist,
              height: 2,
              transformOrigin: "0 50%",
              transform: `rotate(${ang}deg)`,
              background: `linear-gradient(90deg, ${theme.accent}00, ${theme.accent})`,
              opacity: pop * pulse * (0.4 + depth * 0.6),
            }}
          />
        );
      })}

      {/* center */}
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", zIndex: 50 }}>
        {centerLogoSrc ? (
          <Img src={centerLogoSrc} style={{ width: 150, filter: `drop-shadow(0 0 ${30 + 15 * Math.sin(frame / 12)}px ${theme.accent})` }} />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: theme.accent,
              boxShadow: `0 0 ${40 + 20 * Math.sin(frame / 12)}px ${theme.accent}`,
            }}
          />
        )}
      </div>

      {/* orbiting items */}
      {items.map((it, i) => {
        const a = orbit + (i / n) * Math.PI * 2;
        const x = cx + Rx * Math.cos(a);
        const y = cy + Ry * Math.sin(a);
        const depth = (Math.sin(a) + 1) / 2;
        const scale = 0.55 + depth * 0.6;
        const pop = spring({ frame: frame - 14 - i * 7, fps, config: { damping: 200, mass: 0.7 } });
        const spinY = Math.sin(frame / 22 + i) * 22;
        const size = 170;
        const color = it.color ?? theme.accent;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex: Math.round(depth * 100),
              transform: `translate(-50%,-50%) scale(${scale * pop})`,
              opacity: interpolate(depth, [0, 1], [0.5, 1]) * pop,
            }}
          >
            <div style={{ perspective: 600 }}>
              {it.src ? (
                <Img src={it.src} style={{ width: size, height: size, objectFit: "contain", transform: `rotateY(${spinY}deg)`, filter: "drop-shadow(0 14px 30px rgba(0,0,0,0.6))" }} />
              ) : (
                <div
                  style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, ${color}, ${color}88)`,
                    transform: `rotateY(${spinY}deg)`,
                    boxShadow: `0 14px 30px rgba(0,0,0,0.5), 0 0 30px ${color}55`,
                  }}
                />
              )}
            </div>
            <div style={{ textAlign: "center", color: theme.text, fontSize: 22, fontWeight: 600, marginTop: 6, opacity: depth, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
              {it.label}
            </div>
          </div>
        );
      })}

      {/* caption */}
      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", color: theme.text, fontSize: 58, fontWeight: 700, opacity: spring({ frame: frame - 30, fps, config: { damping: 200 } }) }}>
        {caption} {captionAccent ? <span style={{ color: theme.accent }}>{captionAccent}</span> : null}
      </div>
    </AbsoluteFill>
  );
};
