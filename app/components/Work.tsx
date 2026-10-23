"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { projects, type Project } from "@/content/site";
import { SecHead } from "./Sections";

const CaseOverlay = dynamic(() => import("./CaseOverlay"), { ssr: false });

const accentColor: Record<string, string> = {
  sky: "var(--sky)",
  sage: "var(--sage)",
  sand: "var(--sand)",
  lilac: "var(--lilac)",
  rose: "var(--rose)",
};

export default function Work() {
  const [active, setActive] = useState<Project | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((p: Project, el: HTMLElement) => {
    // Load the case-study renderer on first intent instead of shipping it in the
    // initial bundle. The modal gets its own chunk, keeping first paint lean.
    lastFocus.current = el;
    setActive(p);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    lastFocus.current?.focus?.();
  }, []);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <SecHead
          index="02"
          label="Selected work"
          title={
            <>
              Eight builds, <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>269k rows</em>.</>
          }
          aside="Open a card for the method, the numbers and the repo."
        />

        <div className="work-list">
          {projects.map((p, i) => (
            <article className="work-card" key={p.slug} data-reveal data-reveal-delay={String(Math.min(i + 1, 3))} data-tilt>
              <div className="work-media">
                <div className="work-frame">
                  <span className="work-frame-bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <span className="work-frame-url">{p.domain}</span>
                  </span>
                  <div className="work-frame-shot">
                    <Image
                      src={p.cover}
                      alt={`${p.title} — ${p.category} project`}
                      fill
                      sizes="(max-width: 900px) 92vw, 620px"
                      style={{ objectFit: "cover", objectPosition: p.coverPos ?? "top center" }}
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  </div>
                </div>
                <span className="work-cat" data-source={p.source}>
                  <i style={{ background: accentColor[p.accent] }} aria-hidden="true" />
                  {p.category}
                </span>
              </div>

              <div className="work-body">
                <div className="work-top">
                  <span className="work-index">Project {p.index}</span>
                  <span className="work-year">{p.year}</span>
                </div>

                <div>
                  <h3 className="work-title">{p.title}</h3>
                  <p className="work-sub">{p.subtitle}</p>
                </div>

                <p className="work-summary">{p.summary}</p>

                <div className="work-metrics">
                  {p.outcome.map((m) => (
                    <div className="work-metric" key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="work-stack">
                  {p.stack.slice(0, 4).map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                  {p.stack.length > 4 ? <span className="tag">+{p.stack.length - 4}</span> : null}
                </div>

                <div className="work-actions">
                  <button
                    className="btn btn-sm"
                    onClick={(e) => open(p, e.currentTarget)}
                    aria-label={`Open case study: ${p.title}`}
                  >
                    Case study
                    <svg className="btn-arrow" width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {p.repo ? (
                    <a
                      className="btn btn-sm btn-ghost"
                      href={p.repo}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${p.title} on GitHub`}
                    >
                      GitHub ↗
                    </a>
                  ) : null}
                  {p.docs?.[1] ? (
                    <a className="btn btn-sm btn-ghost" href={p.docs[1].href} download>
                      Sample
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <CaseOverlay project={active} onClose={close} />
    </section>
  );
}
