import { ImageResponse } from "next/og";
import { brand } from "@/lib/config";
import { hurlikattu } from "@/lib/product";
import { formatINR } from "@/lib/pricing";

// Link previews (WhatsApp, Instagram, Facebook) don't render SVGs, so generate a PNG.
export const alt = `${brand.name} — homemade horse gram mix`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #fbf6ec 0%, #e8d9bd 100%)",
          color: "#3d2615",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: 6, color: "#3f6b3a" }}>
          HOMEMADE IN {brand.fromCity.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1 }}>{brand.name}</div>
          <div style={{ marginTop: 24, fontSize: 40, color: "#6b4423" }}>{brand.tagline}</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div
            style={{
              display: "flex",
              padding: "16px 32px",
              borderRadius: 999,
              background: "#3f6b3a",
              color: "#fbf6ec",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            {formatINR(hurlikattu.price)} · {hurlikattu.weight}
          </div>
          <div
            style={{
              display: "flex",
              padding: "16px 32px",
              borderRadius: 999,
              background: "#d99a2b",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            Ships across India
          </div>
        </div>
      </div>
    ),
    size,
  );
}
