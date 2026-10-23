import { site } from "@/content/site";
import ContactForm from "./ContactForm";

/* The marquee is a second pass at the toolkit: same real marks, moving.
   It reinforces "these are the tools" without repeating a single sentence.
   `ext` is explicit because a few brands (Apollo) only ship raster marks. */
type MarqueeTool = { id: string; ext: "svg" | "png" };

const marqueeTools: MarqueeTool[] = [
  { id: "python", ext: "svg" },
  { id: "playwright", ext: "svg" },
  { id: "scrapy", ext: "svg" },
  { id: "selenium", ext: "svg" },
  { id: "aiohttp", ext: "svg" },
  { id: "pandas", ext: "svg" },
  { id: "numpy", ext: "svg" },
  { id: "jupyter", ext: "svg" },
  { id: "googlesheets", ext: "svg" },
  { id: "excel", ext: "svg" },
  { id: "postgresql", ext: "svg" },
  { id: "dify", ext: "svg" },
  { id: "github", ext: "svg" },
  { id: "linux", ext: "svg" },
  { id: "airtable", ext: "svg" },
  { id: "apollo", ext: "png" },
];

export function Marquee() {
  const items = [...marqueeTools, ...marqueeTools];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span className="marquee-item marquee-tool" key={`${m.id}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/icons/tools/${m.id}.${m.ext}`}
              alt=""
              width={15}
              height={15}
              loading="lazy"
              decoding="async"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="contact-inner" data-reveal>
          <div className="contact-grid">
            <div className="contact-pitch">
              <p className="eyebrow">06 — Contact</p>
              <h2 className="display h2 contact-title" style={{ marginTop: 14 }}>
                Send the link. I&apos;ll say if it&apos;s{" "}
                <em style={{ fontStyle: "italic" }}>scrapable</em>.
              </h2>
              <p className="contact-lede">
                Tell me the site, the fields and the row count. You&apos;ll get a fixed price or a straight no.
              </p>

              <ul className="contact-assurances">
                <li>
                  <span className="ca-k">Reply</span>
                  <span className="ca-v">Within one working day</span>
                </li>
                <li>
                  <span className="ca-k">Quote</span>
                  <span className="ca-v">Fixed price, before any work</span>
                </li>
                <li>
                  <span className="ca-k">Trial</span>
                  <span className="ca-v">100 rows from one source, free</span>
                </li>
              </ul>

              <dl className="contact-side">
                <ContactRow label="Email" value={site.email} href={`mailto:${site.email}`} />
                <ContactRow label="WhatsApp" value={site.phone} href={site.whatsapp} />
                <ContactRow label="LinkedIn" value="/in/zakriashahbaz" href={site.linkedin} />
                <ContactRow label="GitHub" value="/zaktecs-ai" href={site.github} />
                <ContactRow label="Location" value="Lahore, PK · GMT+5" />
              </dl>
            </div>

            <div className="contact-form-slot">
              <ContactForm fallbackEmail={site.email} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <dt>{label}</dt>
      <dd style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {value}
        {href ? (
          <svg className="arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 9 9 3M9 3H4.2M9 3v4.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </dd>
    </>
  );
  return href ? (
    <a className="contact-row" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener">
      {inner}
    </a>
  ) : (
    <div className="contact-row">{inner}</div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-top">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">
              Z
            </span>
            <span className="brand-text">
              <span className="brand-name">{site.name}</span>
              <span className="brand-role">{site.discipline}</span>
            </span>
          </a>
          <nav className="footer-links" aria-label="Footer">
            <a href="#about">About</a>
            <a href="#about">About</a>
            <a href="#work">Work</a>
            <a href="#stack">Stack</a>
            <a href="#experience">Experience</a>
            <a href="#faq">FAQ</a>
            <a href={`mailto:${site.email}`}>Email</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {site.name}. Built from scratch — Next.js, hand-written CSS.</p>
          <p>
            <a className="link-wipe" href="#top">
              Back to top ↑
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
