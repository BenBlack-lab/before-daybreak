import { ImageResponse } from "next/og";
export const alt =
  "Before Daybreak — Getting everyone out is only half the story.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#14201b",
        color: "#eee7d6",
        padding: "64px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 18, letterSpacing: 5, color: "#d6b678" }}>
          A GAME OF CONSEQUENCES
        </div>
        <div style={{ fontSize: 90, marginTop: 30, lineHeight: 1.05 }}>
          Before Daybreak
        </div>
        <div
          style={{
            fontSize: 27,
            color: "#c5cdbf",
            marginTop: 30,
            lineHeight: 1.5,
          }}
        >
          Getting everyone out is only half the story.
        </div>
        <div style={{ fontSize: 18, color: "#d6b678", marginTop: 35 }}>
          Three decisions. A promise you may regret.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: 85,
          top: 110,
          width: 235,
          height: 400,
          borderRadius: "120px 120px 0 0",
          background: "#d6b678",
          border: "18px solid #2b3c2f",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            height: 120,
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          {[82, 99, 73, 90].map((h, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: h,
                background: "#14201b",
                borderRadius: "15px 15px 0 0",
              }}
            />
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
