"use client";

import { useEffect } from "react";

/**
 * Tilt — pointer-reactive 3D tilt for cards, capped and damped.
 *
 * Rules that keep this from looking like a 2015 template:
 *  - max 4.5deg of rotation, never more
 *  - the lift is 5px, so cards read as heavy, not bouncy
 *  - a specular highlight follows the pointer across the surface
 *  - disabled on touch (no hover), where it would stick after a tap
 *
 * Applied by data attribute so it can be dropped on any element:
 *   <article data-tilt>
 */
export default function Tilt() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cards = document.querySelectorAll<HTMLElement>("[data-tilt]");
    if (!cards.length) return;

    let raf = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const apply = () => {
      raf = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      const rx = (-y * 4.5).toFixed(2);
      const ry = (x * 4.5).toFixed(2);
      el.style.setProperty("--tilt-x", `${rx}deg`);
      el.style.setProperty("--tilt-y", `${ry}deg`);
      el.style.setProperty("--glow-x", `${(x * 50 + 50).toFixed(1)}%`);
      el.style.setProperty("--glow-y", `${(y * 50 + 50).toFixed(1)}%`);
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-tilt]");
      if (!el) return;
      const r = el.getBoundingClientRect();
      pending = {
        el,
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onOut = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-tilt]");
      if (!el) return;
      const to = e.relatedTarget as HTMLElement | null;
      if (to && el.contains(to)) return;
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
