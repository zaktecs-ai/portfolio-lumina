"use client";

import { useEffect, useRef } from "react";
import Hero3D from "./Hero3D";

/**
 * MirrorStack — the hero's signature object, rebuilt as an actual mirror.
 *
 * The previous build stacked three frosted glass cards with rounded corners,
 * which read as "glassmorphism template", not as a mirror. This build is a
 * single bevelled mirror plate:
 *
 *  - hard, thin, 45° chamfer around the plate (mirror edges are cut, not rounded)
 *  - the plate face carries a real, live, planar reflection (see Hero3D)
 *  - a chrome armature behind the plate: two slim posts and a pivot knob, so the
 *    mirror reads as a *mounted object* rather than a floating rectangle
 *  - a soft floor shadow that tightens as the plate tilts
 *
 * Below 1100px, and with reduced motion, Hero3D never loads: the CSS plate
 * below stays as a static, beautifully-lit mirror instead of an empty box.
 */
export default function MirrorStack() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const plate = el.querySelector<HTMLElement>("[data-plate]");
    const shadow = el.querySelector<HTMLElement>("[data-shadow]");
    const sheen = el.querySelector<HTMLElement>("[data-sheen]");
    if (!plate) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.055;
      cy += (ty - cy) * 0.055;
      plate.style.transform = `rotateX(${(-cy * 4.5).toFixed(2)}deg) rotateY(${(cx * 7).toFixed(2)}deg) translate3d(${(cx * 6).toFixed(2)}px, ${(-cy * 5).toFixed(2)}px, 0)`;
      plate.style.setProperty("--sx", `${(50 + cx * 26).toFixed(1)}%`);
      plate.style.setProperty("--sy", `${(48 + cy * 22).toFixed(1)}%`);
      if (shadow) {
        shadow.style.transform = `translate3d(${(cx * -14).toFixed(1)}px, 0, 0) scaleX(${(1 - Math.abs(cy) * 0.06).toFixed(3)})`;
        shadow.style.opacity = `${(0.5 - Math.abs(cy) * 0.09).toFixed(2)}`;
      }
      if (sheen) sheen.style.opacity = `${(0.32 + Math.abs(cx) * 0.24).toFixed(2)}`;

      const settled = Math.abs(tx - cx) < 0.0015 && Math.abs(ty - cy) < 0.0015;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const idle = window.setInterval(() => {
      if (!raf) {
        tx = Math.sin(Date.now() / 5200) * 0.34;
        ty = Math.cos(Date.now() / 6100) * 0.24;
        raf = requestAnimationFrame(tick);
      }
    }, 2400);

    el.addEventListener("pointermove", onPointer, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      el.removeEventListener("pointermove", onPointer);
      window.clearInterval(idle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="mir" ref={root} aria-hidden="true">
      <div className="mir-armature">
        <span className="mir-post mir-post-l" />
        <span className="mir-post mir-post-r" />
        <span className="mir-pivot" />
      </div>

      <div className="mir-scene">
        <div className="mir-plate" data-plate>
          {/* the mirror itself: a static CSS reflection under the WebGL canvas */}
          <span className="mir-glass" />
          <span className="mir-sheen" data-sheen />
          {/* hard polished chamfer — the cue that says "mirror", not "card" */}
          <span className="mir-edge mir-edge-t" />
          <span className="mir-edge mir-edge-b" />
          <span className="mir-edge mir-edge-l" />
          <span className="mir-edge mir-edge-r" />
          <span className="mir-etch">
            <i>SPEC</i> 01
          </span>
        </div>
        <div className="mir-shadow" data-shadow />
        <div className="mir-glint" />
      </div>

      <div className="mir-3d">
        <Hero3D />
      </div>

      <span className="mir-caption">Fig. 01 — Bevelled mirror, live planar reflection</span>
    </div>
  );
}
