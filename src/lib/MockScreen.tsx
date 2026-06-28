import type { Theme } from "./theme";

/**
 * A procedurally-drawn placeholder app screen so the demo renders with zero
 * external assets. In a real project you'd pass a real screenshot to
 * <PhoneFrame src={...}/> instead (captured via Playwright or provided).
 */
export const MockScreen: React.FC<{ theme: Theme; title?: string; score?: number }> = ({
  theme,
  title = "Good morning",
  score = 82,
}) => {
  const card: React.CSSProperties = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: 20,
    padding: 18,
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: theme.bg,
        fontFamily: theme.fontFamily,
        padding: "44px 22px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxSizing: "border-box",
      }}
    >
      <div style={{ color: theme.muted, fontSize: 16 }}>{title}</div>
      <div style={{ color: theme.text, fontSize: 30, fontWeight: 700, marginTop: -8 }}>Alex</div>

      {/* score gauge */}
      <div style={{ ...card, alignItems: "center", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ color: theme.accent, fontSize: 13, fontWeight: 600, letterSpacing: 2 }}>
          TODAY'S SCORE
        </div>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: `10px solid ${theme.border}`,
            borderTopColor: theme.accent,
            borderRightColor: theme.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(45deg)",
          }}
        >
          <span style={{ transform: "rotate(-45deg)", color: theme.text, fontSize: 52, fontWeight: 800 }}>
            {score}
          </span>
        </div>
        <div style={{ color: theme.accent, fontSize: 16, fontWeight: 600 }}>PRIMED</div>
      </div>

      {/* metric row */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          ["HRV", "48"],
          ["SLEEP", "7:12"],
          ["READY", "70"],
        ].map(([k, v]) => (
          <div key={k} style={{ ...card, flex: 1, textAlign: "center", padding: 12 }}>
            <div style={{ color: theme.text, fontSize: 22, fontWeight: 700 }}>{v}</div>
            <div style={{ color: theme.muted, fontSize: 11, letterSpacing: 1 }}>{k}</div>
          </div>
        ))}
      </div>

      {/* session card */}
      <div style={{ ...card }}>
        <div style={{ color: theme.accent, fontSize: 12, fontWeight: 600 }}>TODAY · 55 MIN</div>
        <div style={{ color: theme.text, fontSize: 20, fontWeight: 700, marginTop: 4 }}>
          Lower Body · Strength
        </div>
        <div
          style={{
            background: theme.accent,
            color: theme.bg,
            textAlign: "center",
            borderRadius: 12,
            padding: 12,
            marginTop: 14,
            fontWeight: 700,
          }}
        >
          Start session
        </div>
      </div>

      {/* bottom nav */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-around" }}>
        {["Home", "Plan", "Coach", "Stats", "You"].map((t, i) => (
          <div key={t} style={{ color: i === 0 ? theme.accent : theme.muted, fontSize: 12 }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};
