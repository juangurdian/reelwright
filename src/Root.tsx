import { Composition } from "remotion";
import { DemoPromo, DEMO_DURATION } from "./examples/DemoPromo";

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
    </>
  );
};
