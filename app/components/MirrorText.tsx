"use client";

import { useEffect, useRef } from "react";

/**
 * MirrorText — a headline word rendered as polished metal, with a true
 * reflection hanging beneath it.
 *
 * Structure (no absolute positioning tricks — this is plain flex layout, which
 * is why the reflection cannot end up sitting on top of the original):
 *
 *   .mirror-text            inline-flex column, gap 0
 *     .mirror-text-word     the word, chrome ramp + pointer-tracked specular
 *     .mirror-text-flip     a copy, floated below, scaleY(-1) flipped on itself
 *
 * The flip is *in flow*, so the line it lives in reserves exactly the space the
 * reflection needs. It is masked to fade out and marked aria-hidden.
 */
export default function MirrorText({ text, className = "" }: { text: string; className?: string }) {
  const root = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 52, ty = 40, cx = 52, cy = 40;

    const onMove = (e: PointerEvent) => {
      const word = el.querySelector<HTMLElement>("[data-word]");
      if (!word) return;
      const r = word.getBoundingClientRect();
      tx = Math.max(-25, Math.min(125, ((e.clientX - r.left) / r.width) * 100));
      ty = Math.max(-35, Math.min(135, ((e.clientY - r.top) / r.height) * 100));
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const loop = () => {
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      el.style.setProperty("--mx", `${cx}%`);
      el.style.setProperty("--my", `${cy}%`);
      raf = Math.abs(tx - cx) > 0.15 || Math.abs(ty - cy) > 0.15 ? requestAnimationFrame(loop) : 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span className={`mirror-text ${className}`.trim()} ref={root}>
      <span className="mirror-text-stack">
        <span className="mirror-text-word" data-word data-text={text}>
          {text}
        </span>
        <span className="mirror-text-flip" aria-hidden="true" data-text={text}>
          {text}
        </span>
        <span className="mirror-text-waterline" aria-hidden="true" />
      </span>
    </span>
  );
}
