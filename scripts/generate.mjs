// Agent-driven media generation via fal.ai.
// Reads FAL_KEY from the environment automatically.
//
// Usage:
//   node scripts/generate.mjs image "a neon cyberpunk city street, rain"  [--out assets/images/city.png] [--model schnell|dev] [--ratio landscape_16_9|portrait_16_9|square]
//   node scripts/generate.mjs video "drone shot over a snowy mountain"     [--out assets/video/clip.mp4] [--model wan|ltx|kling] [--seconds 5]
//   node scripts/generate.mjs animate <imageUrlOrPath> "make it slowly zoom in" [--out assets/video/anim.mp4] [--model wan|kling]
//   node scripts/generate.mjs raw <fal/model/id> '{"json":"input"}' [--out path]
//
// Cheap defaults are used unless --model says otherwise. The script prints the
// fal endpoint and (where known) a rough cost so nothing pricey runs silently.

import { fal } from "@fal-ai/client";
import { writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

if (!process.env.FAL_KEY) {
  console.error("FAL_KEY is not set in the environment. Aborting.");
  process.exit(1);
}

// --- friendly aliases → fal endpoint ids (override with `raw`) ---
const IMAGE_MODELS = {
  schnell: "fal-ai/flux/schnell", // ~$0.003/MP — cheapest, fast drafts
  dev: "fal-ai/flux/dev", // higher quality
};
const VIDEO_MODELS = {
  ltx: "fal-ai/ltx-video", // cheapest video
  wan: "fal-ai/wan/v2.2-a14b/text-to-video", // cheap, good
  kling: "fal-ai/kling-video/v2.5-turbo/pro/text-to-video", // premium quality
};
const ANIMATE_MODELS = {
  wan: "fal-ai/wan/v2.2-5b/image-to-video",
  kling: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video",
};

// --- tiny arg parser ---
const [, , mode, ...rest] = process.argv;
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i++) {
  if (rest[i].startsWith("--")) {
    flags[rest[i].slice(2)] = rest[i + 1];
    i++;
  } else positional.push(rest[i]);
}

const ratioToImageSize = (r) => r || "landscape_16_9";

async function download(url, out) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(out, buf);
  return out;
}

async function toDataUri(p) {
  if (/^https?:\/\//.test(p)) return p; // already a URL
  const buf = await readFile(p);
  const ext = path.extname(p).slice(1) || "png";
  return `data:image/${ext};base64,${buf.toString("base64")}`;
}

function logResult(label, endpoint, out) {
  console.log(`\n✅ ${label}\n   endpoint: ${endpoint}\n   saved:    ${out}\n`);
}

async function main() {
  if (mode === "image") {
    const prompt = positional[0];
    const endpoint = IMAGE_MODELS[flags.model || "schnell"] || flags.model;
    const out = flags.out || `assets/images/gen-${Date.now()}.png`;
    console.log(`Generating image via ${endpoint} (~$0.003–0.03)...`);
    const r = await fal.subscribe(endpoint, {
      input: { prompt, image_size: ratioToImageSize(flags.ratio), num_images: 1 },
      logs: false,
    });
    const url = r.data.images?.[0]?.url;
    if (!url) throw new Error("No image returned: " + JSON.stringify(r.data).slice(0, 300));
    await download(url, out);
    logResult("Image generated", endpoint, out);
  } else if (mode === "video") {
    const prompt = positional[0];
    const endpoint = VIDEO_MODELS[flags.model || "ltx"] || flags.model;
    const out = flags.out || `assets/video/gen-${Date.now()}.mp4`;
    console.log(`Generating video via ${endpoint}...`);
    const input = { prompt };
    if (flags.seconds) input.duration = Number(flags.seconds);
    const r = await fal.subscribe(endpoint, { input, logs: false });
    const url = r.data.video?.url || r.data.videos?.[0]?.url;
    if (!url) throw new Error("No video returned: " + JSON.stringify(r.data).slice(0, 300));
    await download(url, out);
    logResult("Video generated", endpoint, out);
  } else if (mode === "animate") {
    const image = positional[0];
    const prompt = positional[1] || "";
    const endpoint = ANIMATE_MODELS[flags.model || "wan"] || flags.model;
    const out = flags.out || `assets/video/anim-${Date.now()}.mp4`;
    const image_url = await toDataUri(image);
    console.log(`Animating image via ${endpoint}...`);
    const r = await fal.subscribe(endpoint, { input: { prompt, image_url }, logs: false });
    const url = r.data.video?.url || r.data.videos?.[0]?.url;
    if (!url) throw new Error("No video returned: " + JSON.stringify(r.data).slice(0, 300));
    await download(url, out);
    logResult("Image animated", endpoint, out);
  } else if (mode === "upscale") {
    const image = positional[0];
    const endpoint = flags.model || "fal-ai/aura-sr";
    const out = flags.out || `assets/images/up-${Date.now()}.png`;
    const image_url = await toDataUri(image);
    const factor = Number(flags.factor || 4);
    console.log(`Upscaling ${factor}x via ${endpoint}...`);
    const r = await fal.subscribe(endpoint, {
      input: { image_url, upscaling_factor: factor },
      logs: false,
    });
    const url = r.data.image?.url || r.data.images?.[0]?.url;
    if (!url) throw new Error("No image returned: " + JSON.stringify(r.data).slice(0, 300));
    await download(url, out);
    logResult("Image upscaled", endpoint, out);
  } else if (mode === "removebg") {
    const image = positional[0];
    const endpoint = flags.model || "fal-ai/birefnet/v2";
    const out = flags.out || `assets/images/nobg-${Date.now()}.png`;
    const image_url = await toDataUri(image);
    console.log(`Removing background via ${endpoint}...`);
    const r = await fal.subscribe(endpoint, { input: { image_url }, logs: false });
    const url = r.data.image?.url || r.data.images?.[0]?.url;
    if (!url) throw new Error("No image returned: " + JSON.stringify(r.data).slice(0, 300));
    await download(url, out);
    logResult("Background removed", endpoint, out);
  } else if (mode === "music" || mode === "audio") {
    const prompt = positional[0];
    const endpoint = flags.model || "fal-ai/stable-audio-25/text-to-audio";
    const out = flags.out || `assets/audio/track-${Date.now()}.mp3`;
    const input = { prompt, total_seconds: Number(flags.seconds || 20) };
    console.log(`Generating audio via ${endpoint}...`);
    const r = await fal.subscribe(endpoint, { input, logs: false });
    const url =
      r.data.audio?.url || r.data.audio_file?.url || r.data.audio_url || r.data.file?.url;
    if (!url) throw new Error("No audio returned: " + JSON.stringify(r.data).slice(0, 400));
    await download(url, out);
    logResult("Audio generated", endpoint, out);
  } else if (mode === "raw") {
    const endpoint = positional[0];
    const input = JSON.parse(positional[1] || "{}");
    const out = flags.out || `assets/gen-${Date.now()}.out`;
    const r = await fal.subscribe(endpoint, { input, logs: false });
    const url =
      r.data.video?.url ||
      r.data.images?.[0]?.url ||
      r.data.videos?.[0]?.url ||
      r.data.audio?.url ||
      r.data.audio_file?.url;
    if (url) await download(url, out);
    console.log(JSON.stringify(r.data, null, 2));
    if (url) logResult("Raw generation", endpoint, out);
  } else {
    console.error("Unknown mode. Use: image | video | animate | raw");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Generation failed:", e.message || e);
  process.exit(1);
});
