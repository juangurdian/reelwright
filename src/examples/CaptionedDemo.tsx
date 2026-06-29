import { AbsoluteFill } from "remotion";
import type { Caption } from "@remotion/captions";
import { makeTheme } from "../lib/theme";
import { CaptionTrack } from "../lib/CaptionTrack";
import sample from "./sample-captions.json";

// Captions produced by: node scripts/generate.mjs transcribe <voiceover.mp3>
const captions = sample as Caption[];
const theme = makeTheme();

const lastMs = captions.length ? captions[captions.length - 1].endMs : 4000;
export const CAPTIONED_DURATION = Math.ceil((lastMs / 1000) * 30) + 18;

/**
 * Word-level animated captions over a background. To add the voiceover audio,
 * pass `audioSrc={staticFile("vo.mp3")}` to <CaptionTrack/> (audio omitted here
 * so the example renders with no external assets).
 */
export const CaptionedDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: theme.gradient }}>
      <CaptionTrack captions={captions} theme={theme} switchEveryMs={900} bottom={470} />
    </AbsoluteFill>
  );
};
