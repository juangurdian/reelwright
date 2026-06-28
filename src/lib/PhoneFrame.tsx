import { Img } from "remotion";
import type { Theme } from "./theme";

/**
 * A sleek phone mockup. Pass a screenshot `src` OR arbitrary `children`
 * (e.g. a <MockScreen/>). The outer height matches a ~0.46 phone-screen
 * aspect so full-screen screenshots fit with no clipping.
 */
export const PhoneFrame: React.FC<{
  theme: Theme;
  src?: string;
  width?: number;
  children?: React.ReactNode;
}> = ({ theme, src, width = 400, children }) => {
  const height = Math.round(width * 2.116);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: width * 0.12,
        background: "linear-gradient(160deg, #3a4055 0%, #0a0d16 60%)",
        padding: width * 0.022,
        boxShadow: `0 50px 130px rgba(0,0,0,0.65), 0 0 90px ${theme.accent}33`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: width * 0.1,
          overflow: "hidden",
          background: theme.bg,
        }}
      >
        {src ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "top center",
            }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
