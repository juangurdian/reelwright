import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { makeTheme } from "../lib/theme";
import { MockScreen } from "../lib/MockScreen";
import { TitleScene } from "../scenes/TitleScene";
import { TaglineScene } from "../scenes/TaglineScene";
import { OrbitScene } from "../scenes/OrbitScene";
import { FeatureScene } from "../scenes/FeatureScene";
import { OutroScene } from "../scenes/OutroScene";

// Re-skin the whole video by changing this one object.
const theme = makeTheme({ accent: "#4acfa9" });

const ORBIT = [
  { label: "Sleep", color: "#3daef0" },
  { label: "HRV", color: "#4acfa9" },
  { label: "Strain", color: "#f59f0a" },
  { label: "Recovery", color: "#66e595" },
  { label: "Steps", color: "#7c8ee9" },
];

const D = { title: 60, tagline: 65, orbit: 150, f1: 95, f2: 95, outro: 90 };
const T = { fade: 15, slide: 18 };

export const DEMO_DURATION =
  Object.values(D).reduce((a, b) => a + b, 0) - (T.fade * 3 + T.slide * 1);

export const DemoPromo: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={D.title}>
        <TitleScene theme={theme} brand="Acme Fit" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.fade })} />

      <TransitionSeries.Sequence durationInFrames={D.tagline}>
        <TaglineScene
          theme={theme}
          words={[
            { t: "Your" },
            { t: "AI coach", accent: true },
            { t: "for every" },
            { t: "workout", accent: true },
          ]}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.fade })} />

      <TransitionSeries.Sequence durationInFrames={D.orbit}>
        <OrbitScene theme={theme} items={ORBIT} caption="Connects to" captionAccent="any wearable" />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 }, durationInFrames: T.slide })} />

      <TransitionSeries.Sequence durationInFrames={D.f1}>
        <FeatureScene
          theme={theme}
          side="right"
          kicker="Daily readiness"
          headline="Know how ready you are"
          sub="One score from your sleep, HRV and recovery."
          screen={<MockScreen theme={theme} title="Good morning" score={82} />}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.fade })} />

      <TransitionSeries.Sequence durationInFrames={D.f2}>
        <FeatureScene
          theme={theme}
          side="left"
          kicker="Adapts to you"
          headline="Training that changes daily"
          sub="It adjusts to your strain, sleep and how you feel."
          screen={<MockScreen theme={theme} title="Today's plan" score={64} />}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T.fade })} />

      <TransitionSeries.Sequence durationInFrames={D.outro}>
        <OutroScene theme={theme} brand="Acme Fit" tagline="One coach. Every wearable. Every day." cta="acmefit.app" />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
