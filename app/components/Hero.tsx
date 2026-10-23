"use client";

import { useEffect, useRef, useState } from "react";
import { site, hero } from "@/content/site";
import MirrorStack from "./MirrorStack";
import MirrorText from "./MirrorText";

/* A live PKT clock — a small honest detail, not decoration. */
function LocalClock() {
  const [t, setT] = useState<string>("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setT(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Karachi",
          hour12: false,
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{t || "--:--"}</span>;
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
        <div className="hero-grid" />
      </div>

      <div className="wrap hero-inner" ref={root}>
        <div className="hero-top">
          <p className="eyebrow">{hero.eyebrow}</p>
          <p className="hero-status">
            <span className="dot" aria-hidden="true" />
            {site.availability}
          </p>
        </div>

        <div className="hero-stage">
          <aside className="hero-rail" aria-hidden="true">
            <span className="rail-item">
              <i>01</i> Scrape
            </span>
            <span className="rail-item">
              <i>02</i> Clean
            </span>
            <span className="rail-item">
              <i>03</i> Deliver
            </span>
            <span className="rail-line" />
          </aside>

          {/* The headline is one block with a light sweep travelling across the
              whole of it, left to right — the metal reads as one surface. */}
          <h1 className="display h1 hero-title hero-sweep" data-sweep="true">
            <span className="hero-line">
              <span className="reveal-word">{hero.lineOne}</span>
            </span>
            <span className="hero-line hero-line-mirror">
              {/* The chrome word and its reflection — the only metal in the type.
                  The leading word is its own span with a real space after it, so
                  "into" and "clean" never fuse into one token. */}
              <span className="reveal-word hero-mirror-lead">{hero.mirror}</span>
              <MirrorText text="clean" className="hero-mirror" />
            </span>
            <span className="hero-line">
              <span className="reveal-word">{hero.lineRest}</span>
            </span>
          </h1>

          <div className="hero-stack-slot">
            <MirrorStack />
          </div>
        </div>

        <div className="hero-foot">
          <div className="hero-foot-lead">
            <p className="lede hero-lede">{hero.lede}</p>
          </div>

          <div className="hero-actions">
            <a className="btn" href="#work">
              See the work
              <svg className="btn-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a className="btn btn-ghost" href={`mailto:${site.email}`}>
              Get in touch
            </a>
          </div>
        </div>

        <dl className="hero-stats">
          {hero.stats.map((s) => (
            <div className="hero-stat" key={s.label}>
              <dd>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-meta wrap">
        <span className="mono">
          {site.location} · <LocalClock /> PKT
        </span>
        <span className="hero-meta-scroll mono" aria-hidden="true">
          Scroll
          <span className="scroll-line" />
        </span>
        <a className="mono link-wipe" href={site.github} target="_blank" rel="noreferrer noopener">
          GitHub ↗
        </a>
      </div>
    </section>
  );
}
