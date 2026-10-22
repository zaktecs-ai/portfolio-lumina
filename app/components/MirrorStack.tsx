"use client";

import { useEffect, useRef } from "react";

/**
 * MirrorStack — the hero's signature object.
 *
 * Three offset glass panels, each with a chrome rim, a specular sweep and a
 * mirrored floor reflection. It is deliberately a *designed* object rather
 * than an ambient particle field: at 320px, in a screenshot, or on a projector
 * it still reads as a bespoke element instead of decorative noise.
 *
 * Behaviour:
 *  - scroll-linked rotation (the stack assembles as you scroll into the hero)
 *  - pointer parallax with damping
 *  - one shared rAF, all work on composited transforms
 *  - fully static under prefers-reduced-motion
 */
export default function MirrorStack() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"));
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let entrance = 0;

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      entrance = Math.min(1, entrance + 0.02);

      panels.forEach((p, i) => {
        const depth = i + 1;
        const rotY = cx * (5 + depth * 2.2) + (1 - entrance) * (18 * depth);
        const rotX = -cy * (3 + depth * 1.4) + (1 - entrance) * -6;
        const lift = -cy * (6 + depth * 3);
        const baseY = Number(p.dataset.baseY || 0);
        const z = p.classList.contains("stack-hud") ? depth * 26 + 26 : depth * 26;
        p.style.transform = `translate3d(${cx * (10 + depth * 6)}px, ${baseY + lift}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        p.style.setProperty("--sx", `${50 + cx * 26}%`);
        p.style.setProperty("--sy", `${50 + cy * 22}%`);
      });

      const settled = Math.abs(tx - cx) < 0.002 && Math.abs(ty - cy) < 0.002 && entrance >= 1;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    // Idle drift so the object is never dead-still before the pointer arrives.
    const idle = window.setInterval(() => {
      if (!raf) {
        tx = Math.sin(Date.now() / 4200) * 0.55;
        ty = Math.cos(Date.now() / 5600) * 0.4;
        raf = requestAnimationFrame(tick);
      }
    }, 1800);

    raf = requestAnimationFrame(tick);
    el.addEventListener("pointermove", onPointer, { passive: true });

    return () => {
      el.removeEventListener("pointermove", onPointer);
      window.clearInterval(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="stack" ref={root} aria-hidden="true">
      <div className="stack-glow" />

      <div className="stack-stage">
        {[0, 1, 2].map((i) => (
          <div
            className={`stack-panel stack-panel-${i}`}
            data-panel
            data-base-y={[26, 0, -26][i]}
            key={i}
          >
            <span className="stack-rim" />
            <span className="stack-face" />
            <span className="stack-sheen" />
            <span className="stack-reflect" />
          </div>
        ))}

        {/* A live read-out inside the front panel: this is what the object is *for*. */}
        <div className="stack-hud" data-panel data-base-y={-26}>
          <span className="hud-row">
            <span className="hud-key">rows</span>
            <span className="hud-val">186,662</span>
          </span>
          <span className="hud-row">
            <span className="hud-key">email</span>
            <span className="hud-val">48.0%</span>
          </span>
          <span className="hud-row">
            <span className="hud-key">dup</span>
            <span className="hud-val">0.00%</span>
          </span>
          <span className="hud-bar">
            <i style={{ width: "84%" }} />
          </span>
        </div>
      </div>

      <span className="stack-caption">Fig. 01 — Clean, verified, delivered</span>
    </div>
  );
}
