# Contributing to Reelwright

Thanks for wanting to help build the agent-driven video studio! It's early and open.

## Ways to contribute
- **New scenes** — add to `src/scenes`. Take a `theme` prop, animate off `useCurrentFrame()`, keep it prop-driven (no hardcoded brand/colors).
- **Device frames** — generalize `PhoneFrame` (tablet, laptop, watch, browser).
- **Themes / presets** — export new palettes from `src/lib/theme.ts`.
- **Generators** — add a mode to `scripts/generate.mjs` (a new fal model or capability).
- **Recipes** — capture/edit workflows in `docs/`.
- **Examples** — a new composition in `src/examples` that shows off a use case.

## Dev setup
```bash
npm install
npm run demo   # must still render after your change
npm run dev    # live preview
```

## Rules of the road
- **Determinism:** never `Math.random()` / `Date.now()` in a composition — use Remotion's `random(seed)`.
- Keep all `@remotion/*` packages on one version.
- Match `PhoneFrame` aspect to any screenshot so nothing clips.
- Don't commit large media (see `.gitignore`); commit small example assets only.
- Logo-free when depicting third-party products.

## PRs
Small, focused PRs. Include a one-line note on what you changed and a rendered frame/GIF if it's visual. Be kind. MIT licensed — by contributing you agree your work is MIT.
