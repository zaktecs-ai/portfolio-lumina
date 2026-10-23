"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ToolTiles — the stack as a wall of real, full-colour brand marks.
 *
 * Two colour rules matter here:
 *  - PNG marks (Apollo, Hunter, Skrapp…) are already coloured, so they are used
 *    untouched.
 *  - SVG marks from simple-icons are single-path silhouettes. They are inlined
 *    and filled with the brand's own hex, because a black Python logo and a
 *    black Google Sheets logo read as a generic icon set, not as tools.
 *
 * Interaction: tiles tilt toward the pointer and float their pad; the pad's
 * shadow tightens as it lifts. Touch devices get a plain, flat grid.
 */

type Tool = { name: string; src: string; color: string; group: string };

export default function ToolTiles({ tools }: { tools: Tool[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [group, setGroup] = useState<string>("All");
  const [colorSvg, setColorSvg] = useState<Record<string, string>>({});

  const groups = ["All", ...Array.from(new Set(tools.map((t) => t.group)))];
  const shown = group === "All" ? tools : tools.filter((t) => t.group === group);

  /* Colourise the single-path SVGs once, by filling with the brand hex.
     Fetch is same-origin and cached, so this is a handful of small requests. */
  useEffect(() => {
    let cancelled = false;
    const svgs = Array.from(new Set(tools.filter((t) => t.src.endsWith(".svg")).map((t) => t.src)));
    Promise.all(
      svgs.map(async (src) => {
        try {
          const res = await fetch(src);
          const text = await res.text();
          const tool = tools.find((t) => t.src === src);
          const colour = tool?.color ?? "#111111";
          const coloured = text.replace(/<svg([^>]*)>/, `<svg$1 fill="${colour}">`);
          return [src, coloured] as const;
        } catch {
          return [src, ""] as const;
        }
      }),
    ).then((pairs) => {
      if (!cancelled) setColorSvg(Object.fromEntries(pairs.filter(([, v]) => v)));
    });
    return () => {
      cancelled = true;
    };
  }, [tools]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-tile]"));
    let raf = 0;
    const reset = (t: HTMLElement) => {
      t.style.setProperty("--tilt-x", "0deg");
      t.style.setProperty("--tilt-y", "0deg");
      t.style.setProperty("--lift", "0px");
    };
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        for (const t of tiles) {
          const r = t.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          const d = Math.hypot(dx, dy);
          if (d < 1.7) {
            const f = 1 - d / 1.7;
            t.style.setProperty("--tilt-x", `${(-dy * 8 * f).toFixed(2)}deg`);
            t.style.setProperty("--tilt-y", `${(dx * 10 * f).toFixed(2)}deg`);
            t.style.setProperty("--lift", `${(5 * f).toFixed(1)}px`);
          } else reset(t);
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
      <div className="tools-filter" role="tablist" aria-label="Filter by group">
        {groups.map((g) => (
          <button key={g} role="tab" aria-selected={group === g} className="tools-chip" onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </div>

      <ul className="tools-grid">
        {shown.map((t, i) => (
          <li
            className="tool-tile"
            data-tile
            key={`${t.group}-${t.name}`}
            style={{ animationDelay: `${Math.min(i, 20) * 22}ms` }}
          >
            <span className="tool-pad">
              {t.src.endsWith(".svg") && colorSvg[t.src] ? (
                <span
                  className="tool-glyph"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: colorSvg[t.src] }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={t.src} alt="" aria-hidden="true" width={30} height={30} loading="lazy" decoding="async" />
              )}
            </span>
            <span className="tool-name">{t.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
