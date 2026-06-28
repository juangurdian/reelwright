# Workflow: an app promo, end to end

A worked example of how the agent produces a promo. Mirror this for your project.

## 0. Brief
> "20s promo for my fitness app. Screens in `assets/images/app/`. Teal accent, tagline
> 'Train smarter'. Music only. 16:9 and 9:16."

## 1. Prep visuals
```bash
# If a screenshot has a busy background, crop tight to the screen:
ffmpeg -y -i assets/images/app/raw-home.png -vf "crop=W:H:X:Y" assets/images/app/home.png
# Low-res source? upscale 4x:
npm run gen upscale assets/images/app/home.png --out assets/images/app/home@4x.png
```

## 2. Generate anything missing
```bash
npm run gen image "abstract teal energy waves, dark bg" --out assets/images/bg.png
npm run gen music "uplifting electronic, building energy, no vocals" --seconds 20 --out assets/audio/track.mp3
```

## 3. Compose
Create `src/projects/MyPromo.tsx`:
```tsx
const theme = makeTheme({ accent: "#4acfa9" });
// <TransitionSeries> of TitleScene → TaglineScene → FeatureScene(src=home@4x) → OutroScene
export const MY_DURATION = /* sum of scene frames - overlapping transition frames */;
```
Register it in `src/Root.tsx` (16:9 at 1920×1080, and a 9:16 variant at 1080×1920).

## 4. Render + audio
```bash
npx remotion render MyPromo output/promo.mp4
ffmpeg -y -i output/promo.mp4 -i assets/audio/track.mp3 \
  -filter_complex "[1:a]atrim=0:20,afade=t=in:st=0:d=0.5,afade=t=out:st=18.6:d=1.4[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -shortest output/promo-music.mp4
```

## 5. Verify
```bash
ffprobe -v error -show_entries stream=codec_type -show_entries format=duration output/promo-music.mp4
ffmpeg -y -ss 6 -i output/promo-music.mp4 -frames:v 1 output/check.png   # then LOOK at it
```

## Tips
- Vertical (9:16): same composition, just register a second `<Composition>` at 1080×1920; the
  scene library re-flows. Tune `FeatureScene` to stack text above the phone for vertical.
- Keep the phone frame aspect matched to the screenshot so nothing clips.
- Iterate cheap: draft generations on `flux/schnell` + `ltx`, upgrade only the hero shots.
