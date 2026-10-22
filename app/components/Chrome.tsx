import { site } from "@/content/site";

const marquee = [
  "Google Maps extraction",
  "Playwright",
  "Scrapy",
  "DNS MX verification",
  "Google Sheets delivery",
  "Apollo.io",
  "Sales Navigator",
  "Cron pipelines",
  "Checkpoint resume",
  "Pandas",
  "Postgres",
  "undetected-chromedriver",
];

export function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <span className="marquee-item" key={`${m}-${i}`}>
            {m}
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
            <div>
              <p className="eyebrow">08 — Contact</p>
              <h2 className="display h2 contact-title" style={{ marginTop: 14 }}>
                Send the source. I&apos;ll tell you if it&apos;s{" "}
                <em style={{ fontStyle: "italic" }}>scrapable</em>.
              </h2>
              <p className="contact-lede">
                Useful first message: the URL or platform, the fields you need, an approximate row count and how often
                the data should refresh. You&apos;ll get an honest scope and a fixed price — or a straight no.
              </p>
              <div className="contact-actions">
                <a className="btn" href={`mailto:${site.email}?subject=Data%20project%20enquiry`}>
                  Email me
                  <svg className="btn-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a className="btn btn-ghost" href={site.calendly} target="_blank" rel="noreferrer noopener">
                  Book 30 minutes
                </a>
              </div>
            </div>

            <dl className="contact-side">
              <ContactRow label="Email" value={site.email} href={`mailto:${site.email}`} />
              <ContactRow label="WhatsApp" value={site.phone} href={site.whatsapp} />
              <ContactRow label="LinkedIn" value="/in/zakriashahbaz" href={site.linkedin} />
              <ContactRow label="GitHub" value="/zaktecs-ai" href={site.github} />
              <ContactRow label="Location" value="Lahore, PK · GMT+5" />
            </dl>
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
            <a href="#capabilities">Capabilities</a>
            <a href="#work">Work</a>
            <a href="#experience">Experience</a>
            <a href="#faq">FAQ</a>
            <a href={`mailto:${site.email}`}>Email</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {site.name}. Designed and built from scratch — Next.js, hand-written CSS, no template.</p>
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
