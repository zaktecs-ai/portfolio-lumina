"use client";

import { useEffect } from "react";

/**
 * Reveal — adds `.is-in` to `[data-reveal]` children once they enter the
 * viewport. One shared observer for the whole page; no per-element listeners.
 */
export default function Reveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    // A fixed-pixel bottom margin is safe; a percentage one can collapse the
    // root to zero height on tall phones, so nothing ever intersects and the
    // page below the fold stays invisible. Percentages are explicitly avoided.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            obs.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -64px 0px", threshold: 0.02 },
    );

    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.95) n.classList.add("is-in");
      else obs.observe(n);
    });

    /* Safety net: if a browser fails to fire intersections (or the user jumps
       via anchor), anything at or above the viewport must still be visible.
       Content is never gated on an animation succeeding. */
    let ticking = false;
    const sweep = () => {
      ticking = false;
      for (const n of nodes) {
        if (n.classList.contains("is-in")) continue;
        const r = n.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95) n.classList.add("is-in");
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(sweep);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const t = window.setTimeout(sweep, 1500);

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
