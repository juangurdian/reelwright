---
name: video-studio
description: Use when the user wants to create or edit a video — a promo, app demo, social clip, intro, or motion-graphics piece — in a Reelwright project. Drives the capture → generate → compose → edit → render pipeline so the agent produces a finished video from a description and assets.
---

# Video Studio

Produce a finished video for a non-expert user. You write the code and run the
tools; the user only describes what they want and supplies assets/keys.

## 1. Scope it (ask only what changes the work)
- Format: landscape 16:9, vertical 9:16, or both?
- Source visuals: user-provided images, real app screens to capture, or AI-generated?
- Audio: music only, AI voiceover + music, or none?
- Brand: accent color, logo, tagline/CTA.
Pick sensible defaults and proceed; don't over-ask.

## 2. Gather visuals
- **User images** → drop in `assets/images/`.
- **Real web app** → capture with Playwright at phone size (390×844); crop tight to the
  screen with ffmpeg; if low-res, upscale via `generate.mjs upscale` (fal aura-sr 4×).
- **AI footage** → `generate.mjs image|video|animate`; `removebg` for clean cut-outs.

## 3. Compose (Remotion)
- Define a `theme` via `makeTheme({ accent, bg, ... })`.
- Assemble the scene library (`TitleScene`, `TaglineScene`, `OrbitScene`, `FeatureScene`,
  `OutroScene`) inside a `<TransitionSeries>`. Put real screenshots in `<PhoneFrame src=.../>`.
- Register the composition in `src/Root.tsx`; compute duration from scene+transition lengths.

## 4. Edit & output
- Render: `npx remotion render <Id> output/<name>.mp4`.
- Generate/trim music and **mux** with ffmpeg (fade in/out).
- Optional: captions via WhisperX / mcp-video; trims/overlays via mcp-video.

## 5. Verify before claiming done
- `ffprobe` the output (duration, codec, has audio stream).
- Extract a frame per scene with ffmpeg and **look at it** before telling the user it's ready.
- Open it for the user; offer concrete next tweaks (pacing, music, vertical cut).

## Gotchas
- Deterministic only: no `Math.random()`/`Date.now()` in compositions — use `random(seed)`.
- Match `PhoneFrame` aspect to the screenshot so nothing clips.
- One version across all `@remotion/*` packages.
- Draft on cheap fal models; estimate cost before premium generations.
- Logo-free when depicting third-party products.
