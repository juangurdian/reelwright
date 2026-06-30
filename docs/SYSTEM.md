# Reelwright — Full System Reference

Everything the system is, how each part works, and how to run it — including how to
pair it with a **local Gen-AI stack** (Stability Matrix / Forge / ComfyUI) so generation
can come from either the cloud (fal.ai) or your own GPU.

- **Repo:** https://github.com/juangurdian/reelwright
- **What it is:** an *agent-driven video studio* — an AI coding agent (Claude Code) orchestrates a
  capture → generate → compose → edit pipeline to produce finished videos from a prompt + assets.
- **Not** a GUI editor. Everything is code, CLI, and API — drivable headlessly by an agent.

---

## 1. Mental model

```
            ┌──────────────────────────────────────────────────────┐
 ORCHESTRATOR│   AI agent (Claude Code) — plans, wires, verifies      │
            └──────────────────────────────────────────────────────┘
      │                  │                    │                  │
 1. CAPTURE          2. GENERATE          3. COMPOSE         4. EDIT / OUTPUT
 Playwright          fal.ai (cloud)       Remotion           FFmpeg
 screenshots         OR local GPU         (React → video)    + mcp-video
 + ffmpeg crop       (Forge/ComfyUI)      themed scenes      + captions + mux
```

The agent is the conductor. Each layer is an independent, headless tool. **Layer 2 (generate)
is backend-swappable**: cloud (fal) today, local GPU as an alternative (see §7).

---

## 2. Repository layout

```
reelwright/
├── README.md            Pitch, quickstart, architecture diagram
├── CLAUDE.md            Agent operating guide (read at session start)
├── ROADMAP.md           Direction + status
├── CONTRIBUTING.md      How to contribute
├── docs/
│   ├── ARCHITECTURE.md  Layer-by-layer design
│   ├── WORKFLOW.md      A worked end-to-end promo example
│   └── SYSTEM.md        ← this file
├── skills/video-studio/SKILL.md   The Claude Code skill that drives the pipeline
├── scripts/generate.mjs           The fal.ai generation CLI
├── src/
│   ├── index.ts · Root.tsx        Composition registry
│   ├── lib/
│   │   ├── theme.ts               makeTheme() — re-skin everything from one object
│   │   ├── PhoneFrame.tsx         Device mockup (src screenshot OR children)
│   │   ├── MockScreen.tsx         Asset-free placeholder app screen
│   │   └── CaptionTrack.tsx       TikTok-style word-level captions (@remotion/captions)
│   ├── scenes/                    Title · Tagline · Feature · Orbit · Outro
│   └── examples/                  DemoPromo (16:9) · CaptionedDemo (9:16)
└── assets/{images,video,audio}/   Inputs (gitignored)
```

---

## 3. The four layers in detail

### Layer 1 — Capture
Get real pixels from a running app. **Playwright** drives a headless browser to screenshot or
screen-record at device resolution (e.g. 390×844). **FFmpeg** crops tight to the screen, removing
any surrounding chrome. Low-res sources are sharpened with the `upscale` generator (§5).
Native mobile apps: provide screenshots, or capture from an emulator.

### Layer 2 — Generate
AI assets. Two interchangeable backends:
- **Cloud — fal.ai** (default, see §5/§6): fast, best video quality, pay-per-use.
- **Local — your GPU** (see §7): free, private, excellent images, limited video.

### Layer 3 — Compose (Remotion)
React → video, frame-accurate, headless. The **scene library** (§4) is theme-driven and
prop-driven. A video is a `<TransitionSeries>` of scenes registered as a `<Composition>` in
`src/Root.tsx`. Render at any resolution (16:9, 9:16, 1:1) by registering multiple compositions.

> Remotion is **source-available** (free for individuals/small orgs; paid company license at
> scale + cloud-render units). A future renderer-abstraction may add an MIT backend (Revideo).

### Layer 4 — Edit / Output
**FFmpeg** for muxing audio, trims, fades, format/aspect conversion. **mcp-video** (an MCP
server over FFmpeg) gives the agent natural-language editing. Captions are produced by the
`transcribe` generator and rendered by `CaptionTrack`.

---

## 4. Scene library (`src/scenes`, `src/lib`)

All scenes accept a `theme` (from `makeTheme()`) and are prop-driven — no hardcoded brand.

| Component | Purpose | Key props |
|---|---|---|
| `TitleScene` | Logo/brand reveal with glow + float | `brand`, `logoSrc?` |
| `TaglineScene` | Kinetic words; `accent:true` per word | `words[]` |
| `FeatureScene` | Caption + animated phone (left/right) | `kicker`, `headline`, `sub`, `src?` or `screen?`, `side` |
| `OrbitScene` | Items orbit a center in a 3D-ish ellipse | `items[]`, `centerLogoSrc?`, `caption` |
| `OutroScene` | Logo + tagline + CTA chip | `brand`, `tagline`, `cta`, `logoSrc?` |
| `PhoneFrame` (lib) | Device mockup; matches iPhone aspect | `src?` or `children`, `width` |
| `MockScreen` (lib) | Placeholder app screen (no assets) | `title`, `score` |
| `CaptionTrack` (lib) | Word-level animated captions + optional audio | `captions[]`, `audioSrc?`, `switchEveryMs`, `bottom` |

**Re-skin everything:** `const theme = makeTheme({ accent: "#ff5a36", bg: "#10100f" })`.

---

## 5. Generation CLI — `scripts/generate.mjs`

Reads `FAL_KEY` from env. Downloads results into `assets/`. `npm run gen <mode> ...`

| Mode | Input → Output | Default model | Notes |
|---|---|---|---|
| `image` | text → image | `flux/schnell` | `--model dev`, `--ratio square|portrait_16_9` |
| `video` | text → video | `ltx-video` | `--model wan|kling`, `--seconds N` |
| `animate` | image → video | `wan i2v` | `--model kling` |
| `tts` | text → voiceover | `kokoro/american-english` | `--voice af_heart`, `--speed 1` |
| `transcribe` | audio → `Caption[]` JSON | `whisper` | word-level; feeds `CaptionTrack` |
| `music` | text → audio | `stable-audio-25` | `--seconds N` |
| `upscale` | image → 4× image | `aura-sr` | sharpen low-res screenshots |
| `removebg` | image → cut-out PNG | `birefnet/v2` | clean compositing |
| `raw` | any fal model | — | `raw <model-id> '<json>'` |

**Cost discipline:** draft on cheap models (flux schnell ~$0.003/img, ltx/wan ~$0.05/s,
kokoro ~$0.02/1k chars); reserve premium (kling/veo) for finals.

---

## 6. Cloud generation (fal.ai) — rough costs
- Images: FLUX schnell ~$0.003 · FLUX dev / Kontext ~$0.03–0.04
- Video: Wan ~$0.05/s · Kling ~$0.07/s · Veo premium ~$0.40/s
- Voice: Kokoro ~$0.02/1k chars · Music: stable-audio per clip
- Upscale / bg-remove: a few cents each

Prepaid credits. Set a spend cap in the fal dashboard.

---

## 7. Local generation backend (your GPU) — integration plan

Your local stack (see the *Local Gen-AI Setup* reference) can serve as Layer 2 instead of fal —
**free, private, unlimited**, with cloud-grade images. Hardware: RTX 3070 Laptop 8 GB + 40 GB RAM.

| Tool | Role | Headless API for the agent |
|---|---|---|
| **Stability Matrix** | Launcher / model manager (`C:\AI`) | starts the UIs below |
| **Forge** | Image gen (SDXL, FLUX) | A1111-compatible REST: `POST http://127.0.0.1:7860/sdapi/v1/txt2img` |
| **ComfyUI** | Image + **video** (LTX, Wan) | `POST http://127.0.0.1:8188/prompt` with a workflow JSON; poll `/history` |
| **FramePack** | Low-VRAM image→video | Pinokio app (mostly GUI) |

**Models:** images — Juggernaut XL (SDXL), FLUX.1 dev Q8 (~1–3 min), FLUX schnell;
video — LTX-Video (3–5s), Wan 2.1/2.2 1.3B. 14B/Hunyuan flagship video is out of reach on 8 GB.

**Capability honesty:** local **images are near state-of-the-art** (the model is the ceiling, the
GPU only sets speed/size — upscale in tiles to 2K/4K). Local **video is good for 2–5s clips** at
modest resolution; for fast or premium video, use cloud (Kling/Veo via fal).

### How the bridge would work (proposed — not yet built)
Add a local backend to `generate.mjs` selectable via `--backend local|fal`:
- `image --backend local` → call Forge `/sdapi/v1/txt2img` (or a ComfyUI workflow), save PNG to `assets/`.
- `video --backend local` → submit a ComfyUI LTX/Wan workflow to `/prompt`, poll `/history`, download.
- Everything downstream (compose, captions, edit) is identical — only the source of pixels changes.

This is the key to "leverage both systems": **one Reelwright pipeline, two generation backends.**

### Cloud vs. local — decision guide
| Want… | Use |
|---|---|
| Fast iteration / drafts / unlimited images | **Local** (Forge/FLUX) |
| Privacy, zero cost, offline | **Local** |
| Premium / long / high-res **video** | **Cloud** (fal: Kling/Veo) |
| Quick one-off without GPU spin-up | **Cloud** (fal) |
| TTS voiceover + captions | Either (fal Kokoro now; local TTS later) |

---

## 8. Determinism & gotchas (Remotion)
- **No `Math.random()` / `Date.now()`** in compositions — use Remotion's `random(seed)`.
- Animate off `useCurrentFrame()` with `spring()` / `interpolate()`.
- All `@remotion/*` packages share **one exact version**.
- Match `PhoneFrame` aspect to the screenshot so nothing clips.
- Compute composition `durationInFrames` from scene + transition lengths (transitions overlap).
- Logo-free when depicting third-party products.

---

## 9. End-to-end example (the proven flow)
1. **Capture** app screens (Playwright) → crop (ffmpeg) → `upscale` if soft.
2. **Voiceover:** `gen tts "<script>"` → `gen transcribe vo.mp3` → `Caption[]`.
3. **Compose:** theme + scene library + `<PhoneFrame src=...>` + `<CaptionTrack>`; register composition.
4. **Render:** `npx remotion render <Id> output/x.mp4`.
5. **Audio:** `gen music` (or the VO) → ffmpeg mux with fades.
6. **Verify:** `ffprobe` + extract a frame per scene and look at it before shipping.

See `docs/WORKFLOW.md` for the copy-paste version.

---

## 10. Distribution & roadmap
- Distributed as a GitHub repo + the portable `video-studio` SKILL.md (works in Claude Code,
  Codex, Cursor, Gemini, Copilot). Planned: a one-command **Claude Code plugin** (skill + MCP).
- Status and next steps live in [`ROADMAP.md`](../ROADMAP.md).
