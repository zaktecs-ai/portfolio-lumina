"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

const links = [
  { href: "#about", label: "About", index: "01" },
  { href: "#work", label: "Work", index: "02" },
  { href: "#stack", label: "Stack", index: "03" },
  { href: "#experience", label: "Experience", index: "04" },
  { href: "#faq", label: "FAQ", index: "05" },
];

export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setStuck(window.scrollY > 16);
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.01, 0.2, 0.5] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="progress" style={{ width: `${progress * 100}%` }} aria-hidden="true" />

      <header className={`nav${stuck ? " is-stuck" : ""}`}>
        <div className="wrap nav-inner">
          <a className="brand" href="#top" aria-label={`${site.name} — home`}>
            {/* Circular portrait, not initials: the face is the brand mark. */}
            <span className="brand-avatar">
              <Image src={site.profile} alt="" width={80} height={80} sizes="36px" quality={90} priority />
              <span className="brand-avatar-ring" aria-hidden="true" />
            </span>
            <span className="brand-text">
              <span className="brand-name">{site.name}</span>
              <span className="brand-role">{site.role}</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <a key={l.href} className="nav-link" href={l.href} data-active={active === l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-right">
            <a className="btn btn-sm nav-cta" href={`mailto:${site.email}`}>
              Get in touch
            </a>
            <button
              className="menu-btn"
              aria-expanded={open}
              aria-controls="mobile-sheet"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="bars" aria-hidden="true">
                <i />
                <i />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div className="sheet" id="mobile-sheet" data-open={open}>
        {links.map((l) => (
          <a key={l.href} className="sheet-link" href={l.href} onClick={() => setOpen(false)}>
            <span>{l.label}</span>
            <span>{l.index}</span>
          </a>
        ))}
        <div className="sheet-foot">
          <a href={`mailto:${site.email}`} onClick={() => setOpen(false)}>
            {site.email}
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn ↗
          </a>
          <a href={site.github} target="_blank" rel="noreferrer noopener">
            GitHub ↗
          </a>
        </div>
      </div>
    </>
  );
}
