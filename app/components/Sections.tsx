import Image from "next/image";
import { about, site, tools, experience } from "@/content/site";
import ToolTiles from "./ToolTiles";

/* ── Section header ───────────────────────────────────────────────── */

export function SecHead({
  index,
  label,
  title,
  aside,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="sec-head">
      <div className="sec-head-row">
        <div>
          <p className="eyebrow" data-reveal>
            {index} — {label}
          </p>
          <h2 className="display h2 sec-title" data-reveal data-reveal-delay="1">
            {title}
          </h2>
        </div>
        {aside ? (
          <p className="sec-aside" data-reveal data-reveal-delay="2">
            {aside}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/* ── About ────────────────────────────────────────────────────────────
   One paragraph, three labelled points, one closing line. Nothing else. */

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <SecHead
          index="01"
          label="About"
          title={
            <>
              I get data out of the web, and make it{" "}
              <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>usable</em>.
            </>
          }
        />

        <div className="about-grid">
          <figure className="about-portrait" data-reveal>
            <Image
              src={site.portrait}
              alt="Portrait of Muhammad Zakria"
              width={1000}
              height={1250}
              sizes="(max-width: 900px) 88vw, 380px"
              quality={82}
            />
            <figcaption className="portrait-caption">
              <div>
                <strong>{site.name}</strong>
                <span>{site.location}</span>
              </div>
              <span className="portrait-badge">
                <span className="dot" aria-hidden="true" />
                {site.availabilityShort}
              </span>
            </figcaption>
          </figure>

          <div className="about-copy">
            <p className="about-lede" data-reveal data-reveal-delay="1">
              {about.lead}
            </p>

            <ul className="about-points">
              {about.points.map((p, i) => (
                <li key={p.k} data-reveal data-reveal-delay={String(Math.min(i + 1, 3))}>
                  <b>{p.k}</b>
                  <span>{p.v}</span>
                </li>
              ))}
            </ul>

            <p className="about-close" data-reveal data-reveal-delay="3">
              {about.close}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Stack: real icons only ────────────────────────────────────────── */

export function Stack() {
  return (
    <section className="section" id="stack">
      <div className="wrap">
        <SecHead index="03" label="Stack" title="What I actually use." aside="Only tools I have shipped with." />
        <div data-reveal>
          <ToolTiles tools={tools} />
        </div>
      </div>
    </section>
  );
}

/* ── Experience ────────────────────────────────────────────────────── */

export function Experience() {
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SecHead index="04" label="Experience" title="Where I've worked." />
        <div className="exp-list">
          {experience.map((j, i) => (
            <article className="exp-row" key={j.company} data-reveal data-reveal-delay={String(Math.min(i + 1, 3))}>
              <div>
                <div className="exp-role">{j.role}</div>
                <div className="exp-company">{j.company}</div>
              </div>
              <p className="exp-summary">{j.summary}</p>
              <div className="exp-period">{j.period}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
