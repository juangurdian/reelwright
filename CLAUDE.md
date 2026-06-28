# Reelwright — agent operating guide

You are producing video for a user with no video-editing experience. You author
and render everything in code. Read this before starting.

## The pipeline
1. **Capture** real screens (Playwright) or accept user-provided images → `assets/images/`.
2. **Generate** missing footage with `scripts/generate.mjs` (fal.ai).
3. **Compose** with Remotion — assemble the themed scene library into a composition.
4. **Edit / output** — render with Remotion, then FFmpeg/mcp-video for trims, captions, music mux.

## Commands
- Preview: `npm run dev` (human only) · List: `npx remotion compositions`
- Render: `npx remotion render <Id> output/<name>.mp4 [--props='{...}']`
- Generate: `node scripts/generate.mjs <image|video|animate|music|upscale|removebg|raw> ...`
- Mux music: `ffmpeg -i video.mp4 -i track.mp3 -filter_complex "[1:a]atrim=0:<dur>,afade=t=out:st=<dur-1.4>:d=1.4[a]" -map 0:v -map "[a]" -c:v copy -c:a aac -shortest out.mp4`

## Scene library (`src/scenes`) — all take a `theme` prop
- `TitleScene` — logo/brand reveal. `TaglineScene` — kinetic words (`accent: true` per word).
- `FeatureScene` — caption + phone; pass `src` (screenshot) or `screen` (a node like `<MockScreen/>`).
- `OrbitScene` — items orbit a center in a depth-scaled ellipse (the "connects to anything" beat).
- `OutroScene` — logo + tagline + CTA chip.

## Hard rules (Remotion)
- **Determinism:** never `Math.random()` / `Date.now()` in a composition — use Remotion's `random(seed)`.
- Animate off `useCurrentFrame()` with `spring()` / `interpolate()`.
- All `@remotion/*` packages share ONE version.
- Compute composition duration from scene + transition lengths (transitions overlap).

## Working with real app screens
- Capture with Playwright at phone resolution, or accept user images.
- If screenshots include a busy background, **crop tight to the screen** with ffmpeg, then
  **upscale** (`generate.mjs upscale`, fal aura-sr 4×) if the source is low-res.
- Put a real screenshot in `<PhoneFrame src=.../>`; match the frame aspect so nothing clips.

## Cost discipline (fal)
Draft on cheap models (flux schnell ~$0.003/img, wan/ltx ~$0.05/s); only use premium
(kling/veo) once a prompt is dialed in. Estimate cost before anything pricey.

## Brand / legal
- Re-skin via `makeTheme({...})` — never hardcode colors in scenes.
- When depicting third-party products (e.g. wearables), generate **logo-free** representations.
