import Image from "next/image";
import { capabilities, toolkit, process, site, experience } from "@/content/site";
import Faq from "./Faq";

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
          <h2 className="display h2 sec-title" data-reveal data-reveal-delay="1" style={{ marginTop: 14 }}>
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

/* ── About ────────────────────────────────────────────────────────── */

export function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <SecHead
          index="01"
          label="About"
          title={
            <>
              Built for the <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>messy</em> part of
              the web.
            </>
          }
          aside="Most scraping projects die on contact with reality: a bot wall, a layout change, a run that never finished. I build for that moment."
        />

        <div className="about-grid">
          <figure className="about-portrait" data-reveal>
            <Image
              src="/img/profile.webp"
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
            <p data-reveal data-reveal-delay="1">
              I&apos;m Zakria, a Python engineer based in Lahore. For the past year I&apos;ve built the unglamorous half
              of data work: <strong>getting the data out</strong> — from Google Maps, Dutch property portals, e-commerce
              marketplaces and business websites — and then making it clean enough that someone can actually act on it.
            </p>

            <p className="pull" data-reveal data-reveal-delay="2">
              &ldquo;Understand the source, handle the edge cases, hand over something the client can use.&rdquo;
            </p>

            <p data-reveal data-reveal-delay="2">
              Most of my work is white-label for agencies: the pipeline runs on a self-managed Linux VPS with cron
              schedules, checkpoint recovery and email verification wired in, and the deliverable lands in the client&apos;s
              Google Sheet or database without anyone copying and pasting.
            </p>

            <p data-reveal data-reveal-delay="3">
              Before freelancing I scraped and cleaned data at ITEH Limited and reported on workforce data at TEVTA
              Punjab — which is where the habit of <strong>checking the numbers before shipping them</strong> came from.
            </p>

            <dl className="about-facts" data-reveal data-reveal-delay="3">
              <div className="fact">
                <dt>Based in</dt>
                <dd>Lahore, Pakistan</dd>
              </div>
              <div className="fact">
                <dt>Working hours</dt>
                <dd>PKT · overlaps EU &amp; US-East</dd>
              </div>
              <div className="fact">
                <dt>Engagement</dt>
                <dd>Fixed-scope &amp; retainer</dd>
              </div>
              <div className="fact">
                <dt>Languages</dt>
                <dd>English, Urdu</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Capabilities ─────────────────────────────────────────────────── */

const glyphs: Record<string, React.ReactNode> = {
  scraping: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="5.6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.9 7.5h11.2M7.5 1.9c1.7 1.6 2.6 3.5 2.6 5.6s-.9 4-2.6 5.6C5.8 11.5 4.9 9.6 4.9 7.5s.9-4 2.6-5.6Z" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  ),
  pipelines: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="1.6" y="1.6" width="4.2" height="4.2" rx="1.1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="9.2" y="9.2" width="4.2" height="4.2" rx="1.1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5.8 3.7h3.1a1.9 1.9 0 0 1 1.9 1.9v3.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
  leadgen: (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="5.6" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="7.5" cy="7.5" r="2.1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7.5 1.9v1.6M7.5 11.5v1.6M1.9 7.5h1.6M11.5 7.5h1.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  ),
};

export function Capabilities() {
  return (
    <section className="section" id="capabilities" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SecHead
          index="02"
          label="Capabilities"
          title={
            <>
              Three things, <em style={{ fontStyle: "italic", color: "var(--ink-3)" }}>done properly</em>.
            </>
          }
          aside="I don't take on design work or app builds. This is the whole service — narrow enough that the details actually get handled."
        />

        <div className="caps">
          {capabilities.map((c, i) => (
            <article className="cap mirror" key={c.id} data-reveal data-reveal-delay={String(i + 1)}>
              <div className="cap-top">
                <span className="cap-index">{c.index}</span>
                <span className="cap-glyph" aria-hidden="true">
                  {glyphs[c.id]}
                </span>
              </div>
              <h3>{c.title}</h3>
              <p className="cap-blurb">{c.blurb}</p>
              <ul className="cap-points">
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Experience ───────────────────────────────────────────────────── */

export function Experience() {
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SecHead
          index="04"
          label="Experience"
          title="Short career, steep curve."
          aside="Three roles, one thread: extracting data, checking it, and reporting on it. The stack changed each time; the standard didn't."
        />

        <div className="exp-list">
          {experience.map((j, i) => (
            <article className="exp-row" key={j.company} data-reveal data-reveal-delay={String(Math.min(i + 1, 4))}>
              <div>
                <div className="exp-role">{j.role}</div>
                <div className="exp-company">
                  {j.company} · {j.location}
                </div>
              </div>
              <div>
                <p className="exp-summary">{j.summary}</p>
                <div className="exp-stack">
                  {j.stack.map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="exp-period">{j.period}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Toolkit ──────────────────────────────────────────────────────── */

export function Toolkit() {
  return (
    <section className="section" id="toolkit" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SecHead
          index="05"
          label="Toolkit"
          title="What's actually on the machine."
          aside="Grouped by the job each one does. No logos for tools I've read about — only what I've shipped with."
        />
        <div className="tool-grid" data-reveal>
          {toolkit.map((g) => (
            <div className="tool-cell" key={g.title}>
              <h4>{g.title}</h4>
              <div className="tool-chips">
                {g.items.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Process ──────────────────────────────────────────────────────── */

export function Process() {
  return (
    <section className="section" id="process" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SecHead
          index="06"
          label="Process"
          title="Four steps, no surprises."
          aside="The point of this sequence is that you find out whether the data is reachable in week one, not in week five."
        />
        <div className="proc">
          {process.map((p, i) => (
            <article className="proc-step mirror" key={p.step} data-reveal data-reveal-delay={String(i + 1)}>
              <span className="proc-num">{p.step}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


export { Faq };
