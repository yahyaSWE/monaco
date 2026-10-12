import { ImageResponse } from "next/og";

export const alt = "Monaco Clinic – hudvård och skönhet i Eskilstuna";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#f7f4ed",
        color: "#34392b",
        padding: "64px 80px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: 54 }}>monaco.</span>
        <span style={{ fontSize: 16, letterSpacing: 4, color: "#6c725d" }}>
          CLINIC · ESKILSTUNA
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span style={{ fontSize: 76, lineHeight: 1.15 }}>
          Hudvård & skönhet.
        </span>
        <span style={{ fontSize: 76, lineHeight: 1.15, color: "#82876d" }}>
          Naturligt du.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          justifyContent: "space-between",
          borderTop: "1px solid #d6d0c3",
          paddingTop: 24,
        }}
      >
        <span>Hällstugatan 16, Eskilstuna</span>
        <span>Personlig omtanke. Avancerad hudvård.</span>
      </div>
    </div>,
    size,
  );
}
