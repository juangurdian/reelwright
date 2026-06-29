import { Composition } from "remotion";
import { DemoPromo, DEMO_DURATION } from "./examples/DemoPromo";
import { CaptionedDemo, CAPTIONED_DURATION } from "./examples/CaptionedDemo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="DemoPromo"
        component={DemoPromo}
        durationInFrames={DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Word-level animated captions (TikTok style) */}
      <Composition
        id="CaptionedDemo"
        component={CaptionedDemo}
        durationInFrames={CAPTIONED_DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
