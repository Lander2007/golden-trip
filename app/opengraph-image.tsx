import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Golden Trip — Highway Transfers & Fleet Across Egypt"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0E0E10",
        backgroundImage:
          "radial-gradient(circle at 50% 30%, #1A1B20 0%, #0E0E10 100%)",
        border: "4px solid #C9A227",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            backgroundColor: "#C9A227",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0E0E10",
            fontWeight: 900,
            fontSize: "24px",
          }}
        >
          GT
        </div>
        <div
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#C9A227",
            letterSpacing: "-0.02em",
          }}
        >
          Golden Trip
        </div>
      </div>

      <div
        style={{
          fontSize: "64px",
          fontWeight: 800,
          color: "#F4F2EC",
          textAlign: "center",
          lineHeight: 1.1,
          letterSpacing: "-0.04em",
          maxWidth: "960px",
          marginBottom: "24px",
        }}
      >
        Your trip starts at your door.
      </div>

      <div
        style={{
          fontSize: "24px",
          color: "#B9B7B0",
          textAlign: "center",
          maxWidth: "800px",
        }}
      >
        Airport transfers, resort runs, and city-to-city trips across Egypt.
      </div>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "48px",
          color: "#C9A227",
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        <span>Alexandria</span>
        <span>·</span>
        <span>Cairo</span>
        <span>·</span>
        <span>Sharm El-Sheikh</span>
        <span>·</span>
        <span>Hurghada</span>
        <span>·</span>
        <span>Luxor</span>
        <span>·</span>
        <span>Aswan</span>
      </div>
    </div>,
    {
      ...size,
    },
  )
}
