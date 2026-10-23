import { ImageResponse } from "next/og";

export const alt = "Muhammad Zakria — Data Engineer, Web Scraping & B2B Data";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card. Built at the edge from the same tokens as the site: warm paper,
 * chrome word, one headline, one proof line. No stock art.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "58px 64px",
          background:
            "radial-gradient(900px 520px at 88% -10%, #e7ecf5 0%, #f3f2ef 55%, #f6f5f2 100%)",
          color: "#0b0c0e",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* hairline grid, matching the site */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(11,12,14,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,12,14,0.05) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "linear-gradient(160deg,#ffffff,#d7dde8 55%,#f7f8fb)",
                border: "1px solid rgba(11,12,14,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                color: "#16181d",
              }}
            >
              Z
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, color: "#0b0c0e" }}>Muhammad Zakria</span>
              <span
                style={{
                  fontSize: 13,
                  letterSpacing: 3,
                  color: "#6b6f7a",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                }}
              >
                Data Engineer · Lahore
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              letterSpacing: 3,
              color: "#6b6f7a",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Portfolio 2026
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 86, lineHeight: 1.02, letterSpacing: -2 }}>I turn the open web</span>
          <span style={{ fontSize: 86, lineHeight: 1.02, letterSpacing: -2, display: "flex", gap: 18 }}>
            <span>into</span>
            <span
              style={{
                fontStyle: "italic",
                backgroundImage:
                  "linear-gradient(168deg,#39445c 0%,#4e5c76 14%,#c9d4e4 28%,#5a6982 40%,#242b3a 54%,#b9c6da 68%,#3c475d 82%,#1b212c 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              clean,
            </span>
            {/* No leading space here: the flex `gap` above already separates the
                items, and `" ,"` rendered as an odd floater before the comma. */}
            <span>verified data.</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <span style={{ fontSize: 24, color: "#3a3d45", maxWidth: 640, lineHeight: 1.35 }}>
            Scrapers, pipelines and B2B lead systems — 269k records delivered.
          </span>
          <span
            style={{
              fontSize: 15,
              letterSpacing: 2,
              color: "#6b6f7a",
              fontFamily: "monospace",
              padding: "10px 16px",
              border: "1px solid rgba(11,12,14,0.16)",
              borderRadius: 999,
            }}
          >
            zaktecs.dev
          </span>
        </div>
      </div>
    ),
    size,
  );
}
