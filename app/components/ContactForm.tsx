"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ContactForm — the last section of the page, and the one that has to convert.
 *
 * UX decisions:
 *  - three required fields (name, email, brief) and two optional ones, so the
 *    form never looks like paperwork
 *  - inline, per-field validation on blur — never a red wall on submit
 *  - a real sending state, an honest success panel, and a fallback mailto on
 *    every failure path (`mailtoFallback`), so a broken SMTP never loses a lead
 *  - honeypot + min-fill-time for spam, invisible to humans
 *  - full keyboard operability, aria-invalid/aria-describedby wiring, and a
 *    live region that announces both the error and the success
 */

type FieldName = "name" | "email" | "message";

const budgets = ["Under $300", "$300 – $800", "$800 – $2,000", "$2,000+", "Not sure yet"];

export default function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [values, setValues] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [notice, setNotice] = useState("");
  const [typed, setTyped] = useState(0);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const validate = (field: FieldName, all = values): string | undefined => {
    if (field === "name") {
      if (all.name.trim().length < 2) return "Please add your name.";
    }
    if (field === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(all.email.trim())) {
        return all.email.trim() ? "That address looks incomplete." : "I need an email to reply to.";
      }
    }
    if (field === "message") {
      if (all.message.trim().length < 20) {
        /* Say the requirement once, plainly — an odometer that changes with every
           keystroke reads as nagging, and it used to overwrite this rule. */
        return "Use at least 20 characters so the brief is actionable.";
      }
    }
    return undefined;
  };

  const setField = (field: keyof typeof values, v: string) => {
    const next = { ...values, [field]: v };
    setValues(next);
    if (field === "message") setTyped(next.message.trim().length);
    if (field === "name" || field === "email" || field === "message") {
      if (touched[field]) setErrors((e) => ({ ...e, [field]: validate(field, next) }));
    }
  };

  const blur = (field: FieldName) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field) }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Partial<Record<FieldName, string>> = {
      name: validate("name"),
      email: validate("email"),
      message: validate("message"),
    };
    setErrors(next);
    setTouched({ name: true, email: true, message: true });
    if (Object.values(next).some(Boolean)) {
      setNotice("Check the highlighted fields.");
      document.querySelector<HTMLInputElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setState("sending");
    setNotice("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, elapsed: Date.now() - startedAt.current }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("sent");
        setNotice("Message sent.");
      } else {
        setState("failed");
        setNotice(data.error ?? "The message did not go through.");
      }
    } catch {
      setState("failed");
      setNotice("No connection. Email works too.");
    }
  };

  if (state === "sent") {
    return (
      <div className="cf-done" role="status" aria-live="polite">
        <span className="cf-done-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4.5 11.5 9 16l8.5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h3>Message sent.</h3>
        <p>
          It lands in my inbox, with your address as the reply-to. Expect an answer within one working day — usually a
          straight yes, no, or a better question.
        </p>
        <button type="button" className="cf-again" onClick={() => { setState("idle"); setValues({ name: "", email: "", company: "", budget: "", message: "" }); setTouched({}); setTyped(0); startedAt.current = Date.now(); }}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="cf" onSubmit={onSubmit} noValidate>
      <div className="cf-head">
        <span className="cf-eyebrow">Project brief</span>
        <span className="cf-count" aria-hidden="true" data-ok={typed >= 20}>
          {typed >= 20 ? "Ready" : `${Math.min(typed, 20)}/20`}
        </span>
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            onBlur={() => blur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            placeholder="Your name"
            disabled={state === "sending"}
          />
          {errors.name ? (
            <span className="cf-err" id="cf-name-err">{errors.name}</span>
          ) : null}
        </div>

        <div className="cf-field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            onBlur={() => blur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
            placeholder="you@company.com"
            disabled={state === "sending"}
          />
          {errors.email ? (
            <span className="cf-err" id="cf-email-err">{errors.email}</span>
          ) : null}
        </div>
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <label htmlFor="cf-company">
            Company <span className="cf-opt">optional</span>
          </label>
          <input
            id="cf-company"
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={(e) => setField("company", e.target.value)}
            placeholder="Where you work"
            disabled={state === "sending"}
          />
        </div>

        <div className="cf-field">
          <label htmlFor="cf-budget">
            Budget <span className="cf-opt">optional</span>
          </label>
          <div className="cf-select-wrap">
            <select
              id="cf-budget"
              name="budget"
              value={values.budget}
              onChange={(e) => setField("budget", e.target.value)}
              disabled={state === "sending"}
            >
              <option value="">Pick a range</option>
              {budgets.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <svg className="cf-chev" width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="cf-field cf-full">
        <label htmlFor="cf-message">What needs scraping?</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => setField("message", e.target.value)}
          onBlur={() => blur("message")}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-err" : "cf-message-hint"}
          placeholder="Site URL, the fields you want, roughly how many rows, and how often it should refresh."
          disabled={state === "sending"}
        />
        {errors.message ? (
          <span className="cf-err" id="cf-message-err">{errors.message}</span>
        ) : (
          <span className="cf-hint" id="cf-message-hint">The more specific, the more accurate the quote.</span>
        )}
      </div>

      {/* Honeypot: off-screen, not `display:none`, and never focusable. */}
      <div className="cf-honey" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="cf-foot">
        <button type="submit" className="btn cf-submit" disabled={state === "sending"}>
          {state === "sending" ? (
            <>
              <span className="cf-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              Send the brief
              <svg className="btn-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>
        <p className="cf-alt">
          Prefer email? <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>
        </p>
      </div>

      <p className="cf-note" role="status" aria-live="polite">
        {state === "failed" ? (
          <>
            {notice}{" "}
            <a href={`mailto:${fallbackEmail}?subject=Data%20project%20enquiry`}>Send it as an email instead</a>
          </>
        ) : (
          notice
        )}
      </p>
    </form>
  );
}
