# Roadmap

Reelwright's direction. Informed by a research pass on the faceless/AI-video space,
the Remotion ecosystem, and OSS dev-tool growth playbooks. Help shape it — open an issue!

## Now (table stakes)
- [ ] **AI voiceover (TTS)** with a *TTS-first* timing model — generate the voiceover first,
      then derive scene durations from the audio. Providers: ElevenLabs / fal (hosted),
      Piper / Kokoro (free local).
- [ ] **Word-level auto-captions** — Whisper/WhisperX → animated, highlighted captions.
- [ ] **Multi-format rendering** — 9:16 / 1:1 / 16:9 from one composition (responsive scenes).
- [ ] **Demo GIF + topics + Show HN launch.** (in progress)

## Next
- [ ] **More device frames** — tablet, laptop, browser window, smartwatch (generalize `PhoneFrame`).
- [ ] **Chart / data-viz scenes** — bar/line/number-counter scenes for data-driven videos.
- [ ] **Template gallery + brand-kit presets** — `makeTheme` presets; clone-a-look examples.
- [ ] **Ship as a Claude Code plugin** — bundle the `video-studio` skill + an MCP server;
      distribute from this repo as a marketplace + list in the community marketplace.
- [ ] **CI visual-render check** — render in CI, snapshot a frame per scene, assert determinism.

## Later
- [ ] **Renderer abstraction** — a thin interface with an MIT backend option (Revideo, which has a
      Node SSR API) alongside Remotion, so the core can stay fully OSS. Needs a porting spike.
- [ ] **Render at scale** — Remotion Lambda / serverless parallel rendering recipe.
- [ ] **B-roll generation + stock footage** integration.
- [ ] **More transitions / effects** library; light-leaks, glows, particle accents.

## Non-goals (for now)
- A GUI timeline editor (this is agent/code-first by design).
- Paywalling the core. Any future sustainability (hosted render, pro templates, sponsors)
  follows the "MIT framework + optional hosted service" precedent.

## Contributing
Great first areas: new device frames, new scenes, new themes. See [CONTRIBUTING.md](CONTRIBUTING.md).
