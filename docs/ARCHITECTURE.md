# Architecture

ReelForge is a **pipeline**, not an app. The AI agent is the orchestrator; each layer is
an independent, headless tool the agent drives.

## Layers

### 1. Capture
Get real pixels. [Playwright](https://playwright.dev) drives a headless browser to screenshot
or screen-record a running web app at device resolution. FFmpeg crops screenshots tight to the
screen. (Native mobile apps: provide screenshots, or capture via emulator.)

### 2. Generate
AI assets via [fal.ai](https://fal.ai), wrapped by `scripts/generate.mjs`:

| Mode | Does | Example model |
|------|------|---------------|
| `image` | text → image | `flux/schnell`, `flux/dev` |
| `video` | text → video | `ltx-video`, `wan`, `kling` |
| `animate` | image → video | `wan i2v` |
| `music` / `audio` | text → audio | `stable-audio-25` |
| `upscale` | sharpen/enlarge | `aura-sr` (4×) |
| `removebg` | cut-out | `birefnet/v2` |
| `raw` | any fal model | — |

Results download into `assets/`. Swap models with `--model`.

### 3. Compose
[Remotion](https://remotion.dev) renders React → video, frame-accurate and headless. The
**scene library** (`src/scenes`) is theme-driven and prop-driven; `src/lib` holds `PhoneFrame`,
`MockScreen`, and the `theme` system. A composition is a `<TransitionSeries>` of scenes.

> Remotion is source-available (free for individuals/small companies; paid company license at
> scale). For a fully-OSI alternative, the scene patterns port to Motion Canvas / Revideo.

### 4. Edit / output
FFmpeg for muxing audio, trims, and format/aspect conversions. `mcp-video` (an MCP server over
FFmpeg) gives the agent natural-language editing + Whisper captions. WhisperX for word-level
subtitle timing.

## Design principles
- **Theme-first.** Re-skin any video by passing a new `theme` — no component edits.
- **Asset-optional demo.** `MockScreen` lets the repo render with zero external files.
- **Deterministic.** Frame-driven animation only, so renders are reproducible.
- **Agent-legible.** `CLAUDE.md` + the `video-studio` skill encode the workflow and gotchas.

## Extending
- **New scene?** Add to `src/scenes`, take a `theme` prop, animate off `useCurrentFrame()`.
- **New device frame?** Generalize `PhoneFrame` (tablet, laptop, watch).
- **New generator?** Add a mode to `generate.mjs`.
- **New theme/preset?** Export from `theme.ts`.
