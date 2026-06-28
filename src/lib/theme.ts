import { loadFont } from "@remotion/google-fonts/DMSans";

const { fontFamily: DEFAULT_FONT } = loadFont();

/**
 * A Theme drives the look of every scene. Pass one into a composition to
 * re-skin the entire video for a different brand — no component edits needed.
 */
export type Theme = {
  bg: string;
  bgDeep: string;
  accent: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  fontFamily: string;
  gradient: string;
};

export const makeTheme = (overrides: Partial<Theme> = {}): Theme => {
  const bg = overrides.bg ?? "#0c1a2c";
  const bgDeep = overrides.bgDeep ?? "#070f1c";
  const accent = overrides.accent ?? "#4acfa9";
  return {
    bg,
    bgDeep,
    accent,
    card: overrides.card ?? "#1d2135",
    border: overrides.border ?? "#33374d",
    text: overrides.text ?? "#f8fafc",
    muted: overrides.muted ?? "#94a3b8",
    fontFamily: overrides.fontFamily ?? DEFAULT_FONT,
    gradient:
      overrides.gradient ??
      `radial-gradient(circle at 30% 20%, ${bg} 0%, ${bg} 45%, ${bgDeep} 100%)`,
  };
};

export const defaultTheme = makeTheme();
