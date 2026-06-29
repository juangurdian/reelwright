# Reelwright 🎬

**An agent-driven video studio.** Point an AI coding agent (like [Claude Code](https://claude.com/claude-code)) at this repo and ask it to *"make a promo for my app"* — it captures real screens, generates AI footage, composes motion graphics in code, edits with FFmpeg, and renders a finished video. No timeline, no GUI, no video-editing experience required.

> Built by an agent, for agents. The human describes the video; the agent produces it.

![Reelwright demo — rendered entirely from code](docs/media/demo.gif)

https://github.com/juangurdian/reelwright

---

## Why

Video editors are GUIs built for humans. AI agents can't click timelines — but they *can* write code, call APIs, and run CLIs. Reelwright is the missing layer: a set of **reusable scene components**, a **generation CLI**, and an **operating guide** that together let an agent produce real videos headlessly.

It's not one tool — it's a **pipeline** the agent conducts:

```
  ┌─────────────────────────────────────────────────────────┐
  │        AI agent (Claude Code) — plans & orchestrates       │
  └─────────────────────────────────────────────────────────┘
     │              │                │               │
 1. CAPTURE     2. GENERATE      3. COMPOSE      4. EDIT / OUT
 Playwright     fal.ai           Remotion        FFmpeg +
 (real app      (image, video,   (React → video; mcp-video,
  screens)       voice, music,    themed scene    mux audio,
 + ffmpeg crop   upscale, bg-     library)        captions)
                 removal)
```

## What's in the box

| Layer | What it gives you |
|------|-------------------|
| **Scene library** (`src/scenes`) | `TitleScene`, `TaglineScene`, `FeatureScene`, `OrbitScene`, `OutroScene` — all theme-driven and prop-driven |
| **Components** (`src/lib`) | `PhoneFrame` (device mockup), `MockScreen` (asset-free placeholder), `theme.ts` (re-skin everything from one object) |
| **Generation CLI** (`scripts/generate.mjs`) | One command over [fal.ai](https://fal.ai): `image`, `video`, `animate`, `music`, `upscale`, `removebg`, `raw` |
| **Agent skill** (`skills/video-studio`) | Teaches the agent the full capture→generate→compose→edit→render workflow |
| **Operating guide** (`CLAUDE.md`) | Conventions + gotchas the agent reads at session start |

## Quickstart (humans)

```bash
git clone https://github.com/juangurdian/reelwright && cd reelwright
npm install
npm run demo          # renders examples → output/demo.mp4 (no API key needed)
npm run dev           # opens Remotion Studio to preview/edit live
```

The demo renders entirely from code with **zero external assets** (uses `MockScreen`). To use AI generation:

```bash
cp .env.example .env  # add your FAL_KEY from https://fal.ai
npm run gen image "a neon product render on a dark background" --out assets/images/hero.png
npm run gen animate assets/images/hero.png "slow cinematic rotation" --model wan
npm run gen music "uplifting electronic intro, no vocals" --seconds 20 --out assets/audio/track.mp3
```

## Quickstart (agents)

Open this repo in Claude Code and say what you want:

> *"Make a 20-second promo for my app. Here are screenshots in `assets/images/` — use the teal/navy theme."*

The agent reads `CLAUDE.md` + the `video-studio` skill and runs the pipeline. See [`docs/WORKFLOW.md`](docs/WORKFLOW.md).

## Re-skin in one object

```ts
const theme = makeTheme({ accent: "#ff5a36", bg: "#10100f" });
// every scene now uses the new palette — no component edits
```

## Requirements

- Node 18+, [FFmpeg](https://ffmpeg.org) on PATH
- (optional) a [fal.ai](https://fal.ai) key for AI generation
- (optional) `mcp-video` + WhisperX for natural-language editing & captions — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Contributing

Early and open. We want more scenes, more device frames, more themes, and capture/edit recipes. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the design, then open a PR or issue. MIT licensed.

## Acknowledgements

Stands on the shoulders of [Remotion](https://remotion.dev) (source-available), [fal.ai](https://fal.ai), [FFmpeg](https://ffmpeg.org), `mcp-video`, and [WhisperX](https://github.com/m-bain/whisperX).
