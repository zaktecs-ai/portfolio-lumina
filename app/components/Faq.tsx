"use client";

import { useState } from "react";
import { site, faq } from "@/content/site";
import { SecHead } from "./Sections";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section" id="faq" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <SecHead
          index="05"
          label="FAQ"
          title="The questions that come up first."
          aside={
            <>
              Anything else — email{" "}
              <a className="link-wipe" href={`mailto:${site.email}`} style={{ color: "var(--ink-1)" }}>
                {site.email}
              </a>
              .
            </>
          }
        />
        <div className="faq" data-reveal>
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className="faq-item" key={item.q}>
                <button
                  className="faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <div className="faq-a" id={`faq-a-${i}`} data-open={isOpen} role="region">
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}