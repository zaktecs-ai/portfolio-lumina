import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const alt = "Muhammad Zakria — Web Data Scraper & Data Automation Expert";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* This route must run per request. Prerendered at build time it produced a card
   with an empty plate: the rasteriser resolves the portrait over HTTP, and there
   is no server to answer that request during the build. */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Share card, generated per request from the same design language as the site.
 *
 * Its one job: when the URL is pasted into Telegram, WhatsApp, Slack or X, the
 * preview looks like the *current* portfolio — paper, chrome, serif display
 * type, the mirror plate — and not like a generic link or the old site.
 *
 * Layout: identity and claim on the left, the portrait standing inside the
 * bevelled mirror plate on the right, with its own reflection under the
 * waterline. The headshot is read from /public so it always ships with the
 * deployment and never depends on a remote fetch.
 */
export default async function OpengraphImage() {
  /* Inline base64, not a URL: this renders in the rasteriser, and a data URI
     cannot depend on the deployment being able to fetch itself mid-build.
     JPEG because WebP is undecodable here. */
  let portrait = "";
  try {
    const buf = readFileSync(join(process.cwd(), "public", "img", "profile-og.jpg"));
    portrait = `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    portrait = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f5f2",
          color: "#0b0c0e",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* hairline grid, matching the live hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(11,12,14,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,12,14,0.055) 1px, transparent 1px)",
            backgroundSize: "66px 66px",
            display: "flex",
          }}
        />
        {/* the chrome glow that lives top-right on the site */}
        <div
          style={{
            position: "absolute",
            right: -140,
            top: -200,
            width: 760,
            height: 760,
            borderRadius: 380,
            background:
              "radial-gradient(circle at 42% 42%, rgba(185,200,226,0.9), rgba(220,226,238,0.28) 60%, rgba(246,245,242,0) 72%)",
            display: "flex",
          }}
        />

        {/* ── left: identity + claim ─────────────────────────────────── */}
        <div
          style={{
            width: 700,
            padding: "50px 18px 46px 62px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(160deg,#ffffff,#d7dde8 55%,#f7f8fb)",
                border: "1px solid rgba(11,12,14,0.10)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 23,
                color: "#16181d",
              }}
            >
              Z
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 21, color: "#0b0c0e" }}>Muhammad Zakria</span>
              <span style={{ fontSize: 11.5, letterSpacing: 2.6, color: "#6b6f7a", fontFamily: "monospace" }}>
                WEB DATA SCRAPER
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 63, lineHeight: 1.05, letterSpacing: -2.2 }}>I turn websites</span>
            <span style={{ fontSize: 63, lineHeight: 1.05, letterSpacing: -2.2, display: "flex", gap: 15 }}>
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
                clean
              </span>
            </span>
            <span style={{ fontSize: 63, lineHeight: 1.05, letterSpacing: -2.2 }}>structured data.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <span style={{ fontSize: 20, color: "#3a3d45", lineHeight: 1.42 }}>
              Scrapers, pipelines and verified B2B leads — 269k records delivered.
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 14,
                  letterSpacing: 1.6,
                  color: "#f6f5f2",
                  fontFamily: "monospace",
                  background: "#0b0c0e",
                  padding: "9px 15px",
                  borderRadius: 999,
                }}
              >
                zaktecs.dev
              </span>
              <span style={{ fontSize: 12, letterSpacing: 1.3, color: "#6b6f7a", fontFamily: "monospace" }}>
                269k ROWS · 186k LEADS · 12 BUILDS
              </span>
            </div>
          </div>
        </div>

        {/* ── right: the mirror plate, portrait standing in it ──────── */}
        <div
          style={{
            position: "relative",
            width: 400,
            marginTop: 46,
            marginBottom: 46,
            marginRight: 62,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            borderRadius: 3,
            background:
              "linear-gradient(168deg,#f4f7fb 0%,#cfd8e6 16%,#9fb0c8 38%,#e8eef7 52%,#a8b8cf 70%,#dbe4ef 84%,#8fa1bb 100%)",
            overflow: "hidden",
          }}
        >
          {/* corner chamfers — a mirror is cut, not rounded */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "linear-gradient(180deg,#ffffff,#c3cedd)", display: "flex" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: "linear-gradient(0deg,#6f7d92,#dde5ef)", display: "flex" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(90deg,#ffffff,#b9c6d8)", display: "flex" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(270deg,#ffffff,#9dabbf)", display: "flex" }} />

          {/* The photo fills the plate edge to edge. No waterline and no
              reflection strip: at WhatsApp's card size a 1px seam across the
              chest reads as a rendering bug, not as a mirror. The mirror is
              carried by the chamfered metal edges instead. */}
          <div style={{ display: "flex", width: "100%", height: "100%", overflow: "hidden" }}>
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={portrait}
                alt=""
                width={400}
                height={538}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
              />
            ) : null}
          </div>

          <span
            style={{
              position: "absolute",
              left: 14,
              top: 11,
              fontSize: 9.5,
              letterSpacing: 2.6,
              color: "rgba(30,38,52,0.5)",
              fontFamily: "monospace",
            }}
          >
            FIG. 01
          </span>
        </div>
      </div>
    ),
    size,
  );
}
