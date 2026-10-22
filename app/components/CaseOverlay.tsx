"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/content/site";

/**
 * Case-study overlay. Loaded on demand (dynamic import from Work.tsx) so the
 * modal's markup and controller never sit in the first-paint bundle.
 */
export default function CaseOverlay({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (project && panel.current) panel.current.scrollTop = 0;
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <div
      className="case"
      data-open={!!project}
      aria-hidden={!project}
      role="dialog"
      aria-modal="true"
      aria-label={project ? `${project.title} case study` : "Case study"}
    >
      <div className="case-scrim" onClick={onClose} />
      {project ? (
        <div className="case-panel" role="document">
          <div className="case-bar">
            <div className="case-bar-title">
              <strong>{project.title}</strong>
              <span className="mono" style={{ flex: "none" }}>
                {project.category}
              </span>
            </div>
            <button className="case-close" onClick={onClose} aria-label="Close case study">
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div className="case-scroll" ref={panel}>
            <div className="case-hero">
              <Image
                src={project.cover}
                alt={`${project.title} cover`}
                fill
                sizes="(max-width: 900px) 100vw, 1080px"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            </div>

            <div className="case-inner">
              <div>
                <h3 className="case-h">{project.title}</h3>
                <p className="case-sub" style={{ marginTop: 8 }}>
                  {project.subtitle} · {project.year}
                </p>
              </div>

              <div className="case-block">
                <span className="case-label">The brief</span>
                <p>{project.challenge}</p>
              </div>

              <div className="case-block">
                <span className="case-label">How it was built</span>
                <ol className="case-steps">
                  {project.approach.map((a, i) => (
                    <li key={a}>
                      <b>{String(i + 1).padStart(2, "0")}</b>
                      <span>{a}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="case-block">
                <span className="case-label">Outcome</span>
                <div className="case-outcome">
                  {project.outcome.map((m) => (
                    <div key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="case-block">
                <span className="case-label">Stack</span>
                <div className="work-stack">
                  {project.stack.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {project.video ? (
                <div className="case-block">
                  <span className="case-label">Run recording</span>
                  <div className="case-video">
                    <video
                      src={project.video.src}
                      poster={project.video.poster}
                      controls
                      playsInline
                      preload="none"
                      aria-label={project.video.caption}
                    />
                  </div>
                  <p className="body" style={{ fontSize: 12.5 }}>
                    {project.video.caption}
                  </p>
                </div>
              ) : null}

              <div className="case-block">
                <span className="case-label">Screens</span>
                <div className="case-shots">
                  {project.shots.map((s) => (
                    <figure className="case-shot" key={s.src}>
                      <Image
                        src={s.src}
                        alt={s.alt}
                        width={1600}
                        height={900}
                        sizes="(max-width: 640px) 92vw, 480px"
                        style={{ width: "100%", height: "auto" }}
                      />
                      <figcaption>{s.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              {project.docs?.length ? (
                <div className="case-block">
                  <span className="case-label">Evidence</span>
                  <div className="case-docs">
                    {project.docs.map((d) => (
                      <a
                        className="case-doc"
                        key={d.href}
                        href={d.href}
                        target={d.href.endsWith(".pdf") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        download={!d.href.endsWith(".pdf")}
                      >
                        <b>{d.label}</b>
                        <span>{d.hint}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="hairline" />
              <div className="case-docs">
                <a className="btn btn-sm" href="#contact" onClick={onClose}>
                  Discuss a similar build
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
