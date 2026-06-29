import { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import type { Theme } from "./theme";

/**
 * TikTok-style animated captions. Feed it a Caption[] (from
 * `node scripts/generate.mjs transcribe ...`) and an optional voiceover audio.
 * The current word is highlighted in the theme accent. Drop it on top of any
 * composition as an overlay.
 */
const CaptionPage: React.FC<{ page: TikTokPage; theme: Theme; bottom: number }> = ({
  page,
  theme,
  bottom,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
      <div
        style={{
          maxWidth: "82%",
          textAlign: "center",
          marginBottom: bottom,
          fontFamily: theme.fontFamily,
          fontSize: 68,
          fontWeight: 800,
          lineHeight: 1.2,
          whiteSpace: "pre",
        }}
      >
        {page.tokens.map((t) => {
          const active = t.fromMs <= absoluteMs && t.toMs > absoluteMs;
          return (
            <span
              key={t.fromMs}
              style={{
                color: active ? theme.accent : theme.text,
                textShadow: "0 4px 18px rgba(0,0,0,0.85)",
                display: "inline-block",
                transform: active ? "scale(1.08)" : "scale(1)",
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const CaptionTrack: React.FC<{
  captions: Caption[];
  theme: Theme;
  audioSrc?: string;
  switchEveryMs?: number;
  bottom?: number;
}> = ({ captions, theme, audioSrc, switchEveryMs = 1000, bottom = 160 }) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: switchEveryMs }),
    [captions, switchEveryMs],
  );

  return (
    <AbsoluteFill>
      {audioSrc ? <Audio src={audioSrc} /> : null}
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          next ? (next.startMs / 1000) * fps : Infinity,
          startFrame + (switchEveryMs / 1000) * fps,
        );
        const durationInFrames = Math.max(1, Math.round(endFrame - startFrame));
        return (
          <Sequence key={i} from={Math.round(startFrame)} durationInFrames={durationInFrames}>
            <CaptionPage page={page} theme={theme} bottom={bottom} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
