"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ToolTiles — the toolkit as a wall of real brand marks.
 *
 * Each tile is a small physical object: the icon sits on a glass pad, tilts in
 * 3D toward the pointer, and casts a reflection. On touch (no hover) the tilt
 * is replaced by a scroll-linked lift, so the grid still feels alive on a phone.
 *
 * Icons are the vendors' own marks (see public/icons/tools), not redrawn
 * approximations — a Python logo that is not Python's logo reads as fake.
 */

export type Tool = { name: string; src: string; group: string };

export default function ToolTiles({ tools }: { tools: Tool[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState<string>("All");

  const groups = ["All", ...Array.from(new Set(tools.map((t) => t.group)))];
  const shown = activeGroup === "All" ? tools : tools.filter((t) => t.group === activeGroup);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return; // touch: CSS handles it

    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-tile]"));
    let raf = 0;

    const reset = (t: HTMLElement) => {
      t.style.setProperty("--rx", "0deg");
      t.style.setProperty("--ry", "0deg");
      t.style.setProperty("--tz", "0px");
    };

    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        for (const t of tiles) {
          const r = t.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = (e.clientX - cx) / (r.width / 2);
          const dy = (e.clientY - cy) / (r.height / 2);
          const d = Math.hypot(dx, dy);
          // Only tiles near the pointer react: a whole grid tilting at once
          // looks like a toy, one or two tiles lifting looks expensive.
          if (d < 1.6) {
            const fall = 1 - d / 1.6;
            t.style.setProperty("--rx", `${(-dy * 9 * fall).toFixed(2)}deg`);
            t.style.setProperty("--ry", `${(dx * 11 * fall).toFixed(2)}deg`);
            t.style.setProperty("--tz", `${(6 * fall).toFixed(1)}px`);
          } else {
            reset(t);
          }
        }
      });
    };
    const onLeave = () => tiles.forEach(reset);

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [shown]);

  return (
    <div className="tools" ref={root}>
      <div className="tools-filter" role="tablist" aria-label="Filter tools by group">
        {groups.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={activeGroup === g}
            className="tools-chip"
            onClick={() => setActiveGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>

      <ul className="tools-grid">
        {shown.map((t, i) => (
          <li className="tool-tile" data-tile key={`${t.group}-${t.name}`} style={{ animationDelay: `${Math.min(i, 18) * 26}ms` }}>
            <span className="tool-pad">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" aria-hidden="true" width={34} height={34} loading="lazy" decoding="async" />
            </span>
            <span className="tool-name">{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
