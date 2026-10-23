# Muhammad Zakria — Portfolio (Lumina)

A light, mirror-finish portfolio for a data engineer. Built from scratch: no template,
no page builder. Next.js 16 (App Router), hand-written CSS, self-hosted fonts.

**Live:** https://zaktecs.dev

---

## What this is

Twelve production projects (six real build screenshots, six open-source builds), presented as evidence rather than decoration — each card
opens a case study with the brief, the method, the numbers and downloadable proof
(sample CSV, case-study PDF, or a recording of the run).

The design language is "Lumina": warm paper, near-black ink, and a single chrome accent.
Surfaces are either paper, glass, or polished metal — nothing else. The mirror treatment
appears in three places only: one word in the headline, the hero object, and the brand mark.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router | Static output, no server needed at runtime |
| Styling | Hand-written CSS + design tokens | Full control, ~31 KB gzipped, zero utility-class churn |
| Type | Instrument Serif / Geist / JetBrains Mono | Self-hosted woff2, latin subset, preloaded |
| Motion | CSS + one IntersectionObserver | No animation library in the bundle |
| Images | `next/image`, AVIF/WebP | 69 MB of source PNGs → ~4.6 MB shipped |

## Structure

```
app/
  layout.tsx          metadata, JSON-LD Person schema, font preloads
  page.tsx            section composition
  tokens.css          design tokens + primitives (type scale, mirror surfaces, buttons)
  globals.css         section and component styles
  fonts.css           self-hosted @font-face declarations
  opengraph-image.tsx share card, generated at build
  components/
    Nav.tsx           sticky nav, scroll progress, mobile sheet
    Hero.tsx          headline with pointer-tracked chrome word
    MirrorStack.tsx   the hero object: stacked glass panels
    Sections.tsx      About, Capabilities, Experience, Toolkit, Process (server)
    Work.tsx          project cards
    CaseOverlay.tsx   case-study modal (dynamically imported)
    Faq.tsx           accordion (client, isolated)
    Chrome.tsx        marquee, contact, footer
    Reveal.tsx        shared scroll-reveal observer
content/site.ts       every string on the site, in one file
public/               optimised images, video, docs, icons
scripts/              audit harnesses (see below)
```

## Verifying it

The site ships with the same harnesses used to build it. With a server running on
`http://127.0.0.1:4111` (see `scripts/serve.sh`):

```bash
python3 scripts/shoot.py --width 1440 --height 900          # screenshots + metrics
python3 scripts/shoot.py --width 390 --height 844 --mobile  # phone viewport
python3 scripts/e2e.py 1440 900                             # 34 functional checks
python3 scripts/e2e.py 390 844 mobile                       # 36 functional checks
python3 scripts/perf.py throttled                           # Core Web Vitals on 4G + 4x CPU
```

Measured on a 390 px viewport, 1.6 Mbps / 70 ms RTT, 4× CPU throttle:

- **LCP** ≈ 1.0 s
- **CLS** ≈ 0.014
- **~420 KB** transferred for a full first visit
- 0 console errors, 0 failed requests, 0 horizontal overflow, 0 text overlaps

## Accessibility

- Skip link, landmark structure, single `h1`
- Visible focus rings on every interactive element
- Keyboard-complete: nav, menu, accordion, modal (`Escape` closes)
- `prefers-reduced-motion` disables every animation and the reveal transitions
- Contrast checked against WCAG AA on the light palette (the chrome word is tuned so
  even its lightest stroke stays legible)

## Notes on the content

Copy was rewritten from the previous version of this portfolio — same facts, tighter
sentences, no duplicated paragraphs. Numbers are from the delivered datasets, samples of
which are downloadable inside each case study.

## Licence

Personal portfolio — all rights reserved. The code is here for reference; the content,
images and datasets are not for reuse.

---

## Asset provenance (important)

Every image inside a case study now belongs to *that* project. The earlier build had
screenshots for one project wired into another project's card, which is the fastest way
to lose a client's trust.

- `aliexpress/`, `daraz/`, `funda/`, `b2b/`, `us-healthcare/`, `medical/` — real build
  screenshots copied from the original project folders, each file verified against its
  own window title / domain before it was placed.
- `banner-*/cover.webp` — for the five repos that ship **no** screenshots, a single
  topic banner is used, chosen from a free-licence photo library and cropped to 1800×900.
  These cards have one shot each, not a fake gallery.
- `gh/every-site-*.jpg` — the repo's own README images.

Do not add a screenshot to a project unless you can point at the file it came from.
