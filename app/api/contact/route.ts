import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * POST /api/contact
 *
 * Delivers the portfolio contact form. Two channels, tried in order, because a
 * form that dies when one provider hits its quota is not a contact form:
 *
 *   1. Resend (HTTPS API) — resilient, survives an SMTP block
 *   2. Gmail SMTP — the workspace default, and the fallback when no key exists
 *
 * Both are configured outside the repo (`~/.hermes/email_config.json`, or env),
 * so no credential ever ships in the bundle.
 *
 * Guardrails: strict validation, a honeypot, and a minimum fill time. Bots get a
 * silent 200 so they cannot learn which check caught them.
 */

type SmtpCreds = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  to: string;
};

function env(name: string) {
  return process.env[name];
}

/** Read `~/.hermes/.env` and `~/.hermes/email_config.json` without a dotenv dep. */
function readHermesEnv(): Record<string, string> {
  try {
    const raw = readFileSync(join(homedir(), ".hermes", ".env"), "utf8");
    const out: Record<string, string> = {};
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
    return out;
  } catch {
    return {};
  }
}

function loadSmtp(): SmtpCreds | null {
  if (env("SMTP_HOST") && env("SMTP_USER") && env("SMTP_PASS")) {
    const port = Number(env("SMTP_PORT") ?? 587);
    return {
      host: env("SMTP_HOST")!,
      port,
      secure: port === 465,
      user: env("SMTP_USER")!,
      pass: env("SMTP_PASS")!,
      from: env("SMTP_FROM") ?? env("SMTP_USER")!,
      to: env("CONTACT_TO") ?? env("SMTP_USER")!,
    };
  }

  const paths = [env("EMAIL_CONFIG_PATH"), join(homedir(), ".hermes", "email_config.json")].filter(Boolean) as string[];
  for (const p of paths) {
    try {
      const raw = JSON.parse(readFileSync(p, "utf8")) as Record<string, unknown>;
      const smtp = (raw.smtp ?? raw) as Record<string, unknown>;
      const user = String(smtp.user ?? smtp.username ?? smtp.email ?? "");
      const pass = String(smtp.pass ?? smtp.password ?? smtp.app_password ?? "");
      if (!user || !pass) continue;
      const port = Number(smtp.port ?? 587);
      return {
        host: String(smtp.host ?? "smtp.gmail.com"),
        port,
        secure: smtp.secure === undefined ? port === 465 : Boolean(smtp.secure),
        user,
        pass,
        from: String(smtp.from ?? user),
        to: String(raw.to ?? user),
      };
    } catch {
      /* next path */
    }
  }
  return null;
}

const emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

type Payload = { name: string; email: string; company: string; budget: string; message: string };

function buildBodies(p: Payload) {
  const text = [
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    p.company ? `Company: ${p.company}` : "",
    p.budget ? `Budget: ${p.budget}` : "",
    "",
    p.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;color:#16181d">
    <div style="border-left:3px solid #0b0c0e;padding:2px 0 2px 16px;margin-bottom:24px">
      <div style="font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#6b6f7a">Portfolio enquiry</div>
      <div style="font-size:22px;margin-top:6px">${esc(p.name)}</div>
      <a href="mailto:${esc(p.email)}" style="color:#3a3d45;font-size:14px">${esc(p.email)}</a>
    </div>
    ${p.company ? `<p style="margin:0 0 6px"><strong>Company:</strong> ${esc(p.company)}</p>` : ""}
    ${p.budget ? `<p style="margin:0 0 18px"><strong>Budget:</strong> ${esc(p.budget)}</p>` : ""}
    <div style="background:#f6f5f2;border:1px solid #e6e4dd;border-radius:12px;padding:18px;white-space:pre-wrap;font-size:15px;line-height:1.6">${esc(p.message)}</div>
  </div>`;

  return { text, html };
}

async function sendViaResend(p: Payload, to: string, from: string, key: string): Promise<boolean> {
  const { text, html } = buildBodies(p);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: p.email,
      subject: `Portfolio enquiry — ${p.name}${p.company ? ` (${p.company})` : ""}`,
      text,
      html,
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const p: Payload = {
    name: String(body.name ?? "").trim().slice(0, 120),
    email: String(body.email ?? "").trim().slice(0, 200),
    company: String(body.company ?? "").trim().slice(0, 160),
    budget: String(body.budget ?? "").trim().slice(0, 60),
    message: String(body.message ?? "").trim().slice(0, 6000),
  };
  const honey = String(body.website ?? "").trim();
  const elapsed = Number(body.elapsed ?? 0);

  /* Bots: a 200 that sends nothing. */
  if (honey) return NextResponse.json({ ok: true, delivered: false });

  const errors: Record<string, string> = {};
  if (p.name.length < 2) errors.name = "Please add your name.";
  if (!emailRe.test(p.email)) errors.email = "That email address doesn't look right.";
  if (p.message.length < 20) errors.message = "A sentence or two about the site helps.";
  if (elapsed > 0 && elapsed < 1500) errors.message = "That was very fast — please try again.";
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const smtp = loadSmtp();
  const to = env("CONTACT_TO") ?? smtp?.to ?? "zakria@zaktecs.dev";
  const resendKey = env("RESEND_API_KEY") ?? readHermesEnv().RESEND_API_KEY;
  const resendFrom = env("CONTACT_FROM") ?? "Portfolio <hi@zaktecs.dev>";

  /* 1 — Resend first: HTTPS, so an SMTP quota block never costs a lead. */
  if (resendKey) {
    try {
      if (await sendViaResend(p, to, resendFrom, resendKey)) {
        return NextResponse.json({ ok: true, delivered: true, channel: "resend" });
      }
    } catch {
      /* fall through to SMTP */
    }
  }

  /* 2 — SMTP fallback. */
  if (smtp) {
    try {
      const transport = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
      });
      const { text, html } = buildBodies(p);
      await transport.sendMail({
        from: smtp.from,
        to,
        replyTo: `"${p.name}" <${p.email}>`,
        subject: `Portfolio enquiry — ${p.name}${p.company ? ` (${p.company})` : ""}`,
        text,
        html,
      });
      return NextResponse.json({ ok: true, delivered: true, channel: "smtp" });
    } catch (err) {
      const msg = String(err);
      /* A quota block is not the visitor's problem — say what actually happened. */
      const quota = msg.includes("550-5.4.5") || msg.toLowerCase().includes("limit exceeded");
      console.error("[contact] smtp failed", msg.slice(0, 400));
      return NextResponse.json(
        {
          ok: false,
          error: quota
            ? "The mailbox hit its daily sending limit. Please email me directly — it will work."
            : "The message could not be sent. Please email me directly.",
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json(
    { ok: false, error: "Mail is not configured on this server. Please use the email link." },
    { status: 503 },
  );
}
