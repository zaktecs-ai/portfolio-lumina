/**
 * Single source of truth for every string on the site.
 * Copy is written for a recruiter / founder skim: short, concrete, no repetition.
 */

export const site = {
  name: "Muhammad Zakria",
  shortName: "Zakria",
  initials: "MZ",
  role: "Data Engineer",
  discipline: "Web Scraping, Pipelines & B2B Data",
  location: "Lahore, Pakistan",
  timezone: "Asia/Karachi",
  remote: "Works remote — PKT / GMT+5",
  email: "zakria@zaktecs.dev",
  phone: "+92 320 6825657",
  phoneHref: "tel:+923206825657",
  whatsapp: "https://wa.me/923206825657",
  calendly: "https://calendly.com/zakriashahbaz/30min",
  github: "https://github.com/zaktecs-ai",
  linkedin: "https://linkedin.com/in/zakriashahbaz",
  siteUrl: "https://zaktecs.dev",
  availability: "Open to freelance & contract",
  availabilityShort: "Available",
} as const;

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Portfolio — 2026",
  // The line is split so the mirror word can be treated separately.
  lineOne: "I turn the open web",
  mirror: "into clean",
  lineTwo: "structured, verified data",
  // ...
  headline: "I turn the open web into clean, verified data.",
  mirrorWord: "clean",
  lede:
    "Python engineer building scrapers, pipelines and B2B lead systems that survive real websites — anti-bot, pagination, JavaScript, 100k-row runs on a Linux VPS.",
  stats: [
    { value: 269, suffix: "k+", label: "Records delivered", note: "186k B2B · 67k healthcare · 15k listings" },
    { value: 27, suffix: "", label: "Enriched fields", note: "Email, socials, CMS, SSL, DMARC, GA4" },
    { value: 5, suffix: "", label: "Production projects", note: "Google Maps, marketplaces, real estate" },
  ],
} as const;

/* ── Capabilities ─────────────────────────────────────────────────────── */

export type Capability = {
  id: string;
  index: string;
  title: string;
  blurb: string;
  points: string[];
};

export const capabilities: Capability[] = [
  {
    id: "scraping",
    index: "01",
    title: "Web Scraping",
    blurb: "Sites that fight back — JS-rendered pages, rate limits, geo locks and anti-bot layers.",
    points: [
      "Playwright & Selenium for JS-heavy targets",
      "Scrapy / aiohttp for high-volume HTML",
      "Checkpoint + resume, retries, atomic writes",
      "Human-like pacing where it matters",
    ],
  },
  {
    id: "pipelines",
    index: "02",
    title: "Data Pipelines",
    blurb: "Source to spreadsheet without a human in the middle. Clean, deduped, scheduled.",
    points: [
      "Dedupe, normalise, validate in Pandas",
      "Cron / Make.com scheduling on a Linux VPS",
      "Google Sheets, Excel, CSV or Postgres",
      "Logs, retries and run reports you can audit",
    ],
  },
  {
    id: "leadgen",
    index: "03",
    title: "B2B Lead Systems",
    blurb: "Contact lists built from evidence, not guesses — every row traceable to a source.",
    points: [
      "Google Maps, Apollo, Sales Navigator sourcing",
      "DNS MX + SMTP email verification",
      "Disposable, role-account and asset filtering",
      "27-field enrichment ready for outreach tools",
    ],
  },
];

/* ── Projects ─────────────────────────────────────────────────────────── */

export type Metric = { value: string; label: string };
export type Shot = { src: string; alt: string; caption: string };

export type Project = {
  slug: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  cover: string;
  /** Shown in the browser-chrome strip on the card — sets context honestly. */
  domain: string;
  coverPos?: string;
  summary: string;
  challenge: string;
  approach: string[];
  outcome: Metric[];
  stack: string[];
  shots: Shot[];
  video?: { src: string; poster: string; caption: string };
  docs?: { label: string; href: string; hint: string }[];
  accent: string;
};

export const projects: Project[] = [
  {
    slug: "b2b-multi-niche",
    index: "01",
    title: "Multi-Niche B2B Lead Engine",
    subtitle: "12 US niches · 5,011 cities · 27 fields per row",
    category: "Lead Generation",
    year: "2026",
    cover: "/img/projects/b2b-multi-niche/cover.webp",
    domain: "google maps → sheets",
    summary:
      "An async-first enrichment engine that produced 186,662 verified B2B records across corporate law, industrial cleaning, property management, commercial roofing and med spas.",
    challenge:
      "A US agency needed one clean list spanning a dozen unrelated B2B verticals, all cities, with contactable emails — not a stack of half-filled spreadsheets. National chains had to be excluded or the list would be worthless.",
    approach: [
      "Playwright for Google Maps discovery; aiohttp at 15-way concurrency crawled each business site.",
      "Async DNS MX resolution verified candidate emails before they entered the dataset.",
      "27 enrichment columns per record: socials, CMS, GA4, Meta Pixel, SSL, DMARC, SPF, local schema, booking widgets, live chat.",
      "A 100+ mega-corp blocklist plus claimed-listing detection filtered out franchise noise.",
    ],
    outcome: [
      { value: "186,662", label: "Verified leads" },
      { value: "48%", label: "Email capture rate" },
      { value: "100%", label: "GMB-claimed coverage" },
      { value: "27", label: "Fields per record" },
    ],
    stack: ["Python", "Playwright", "aiohttp", "BeautifulSoup", "Pandas", "dnspython"],
    shots: [
      { src: "/img/projects/b2b-multi-niche/01.webp", alt: "Enrichment run summary", caption: "Run summary — niche and city throughput" },
      { src: "/img/projects/b2b-multi-niche/02.webp", alt: "Field coverage report", caption: "Field coverage across the full dataset" },
      { src: "/img/projects/b2b-multi-niche/03.webp", alt: "Sampling of enriched rows", caption: "Enriched rows with socials and CMS detection" },
      { src: "/img/projects/b2b-multi-niche/05.webp", alt: "Final export in spreadsheet", caption: "Export handed over as a working spreadsheet" },
    ],
    docs: [
      { label: "Case study", href: "/docs/b2b-lead-generation-case-study.pdf", hint: "PDF · 672 KB" },
      { label: "50-row sample", href: "/docs/b2b-buyer-sample-50.csv", hint: "CSV · 20 KB" },
    ],
    accent: "sky",
  },
  {
    slug: "us-healthcare",
    index: "02",
    title: "US Healthcare Lead Pipeline",
    subtitle: "4 verticals · 50 states · 2,740 cities",
    category: "Lead Generation",
    year: "2026",
    cover: "/img/projects/us-healthcare/cover.webp",
    domain: "google maps → scored csv",
    summary:
      "67,230 dental, med-spa, chiropractic and veterinary records with MX-verified email, treatment lists and telehealth signals — built to a scoring standard, not a row count.",
    challenge:
      "Healthcare outreach lives or dies on deliverability. The client wanted volume, but bad addresses would burn their sending domain — so verification had to happen inside the pipeline.",
    approach: [
      "1,528 Google Maps queries executed in batches of 150 with JSON checkpoint crash recovery.",
      "Homepage plus three internal pages crawled per business for treatment, insurance and booking signals.",
      "Every candidate email passed a syntax check, DNS MX lookup and multi-layer trap filter (14 dummy domains, 10 webmail providers, 14 asset extensions).",
      "Composite quality score applied per record; 90+ is what shipped.",
    ],
    outcome: [
      { value: "67,230", label: "Records" },
      { value: "62.8%", label: "Scored 90+" },
      { value: "98.9%", label: "Phone coverage" },
      { value: "50", label: "States covered" },
    ],
    stack: ["Python", "Playwright", "Requests", "dnspython", "Pandas", "urllib3"],
    shots: [
      { src: "/img/projects/us-healthcare/01.webp", alt: "Vertical breakdown", caption: "Vertical breakdown across four specialties" },
      { src: "/img/projects/us-healthcare/02.webp", alt: "State coverage", caption: "Coverage by state" },
      { src: "/img/projects/us-healthcare/03.webp", alt: "Email verification breakdown", caption: "Email verification results by category" },
      { src: "/img/projects/us-healthcare/04.webp", alt: "Scored dataset sample", caption: "Scored dataset with per-record flags" },
      { src: "/img/projects/us-healthcare/05.webp", alt: "Final sheet", caption: "Delivered sheet, filtered for score 90+" },
      { src: "/img/projects/us-healthcare/Server_log.webp", alt: "Server run log", caption: "VPS run log — batch checkpoints in flight" },
    ],
    docs: [
      { label: "Case study", href: "/docs/us-healthcare-case-study.pdf", hint: "PDF · 32 KB" },
      { label: "50-row sample", href: "/docs/healthcare-sample-50.csv", hint: "CSV · 35 KB" },
    ],
    accent: "sage",
  },
  {
    slug: "funda",
    index: "03",
    title: "Funda.nl Listings Scraper",
    subtitle: "585 search pages · 15,345 Dutch property listings",
    category: "Web Scraping",
    year: "2026",
    cover: "/img/projects/funda/cover.webp",
    domain: "funda.nl",
    summary:
      "Unattended crawl of the Netherlands' largest property marketplace — price, address, agent, energy label — with crash-safe checkpointing so a 585-page run never restarted from zero.",
    challenge:
      "A long crawl on a heavily-trafficked marketplace fails eventually. The requirement was simple and hard: no lost progress, no duplicate rows, no silent data gaps.",
    approach: [
      "Pagination walked page by page with structured extraction into typed records.",
      "Checkpoint file written after every page; a killed run resumes at the exact next page.",
      "Retry with backoff on soft blocks, plus request pacing tuned to keep the session alive.",
      "Final dataset validated for duplicates and missing price/agent fields.",
    ],
    outcome: [
      { value: "15,345", label: "Listings" },
      { value: "585", label: "Pages crawled" },
      { value: "0", label: "Duplicate rows" },
      { value: "100%", label: "Crash-resumable" },
    ],
    stack: ["Python", "Playwright", "BeautifulSoup", "Pandas"],
    shots: [
      { src: "/img/projects/funda/01.webp", alt: "Search results grid", caption: "Search results — paginated source" },
      { src: "/img/projects/funda/03.webp", alt: "Property detail page", caption: "Detail page used for field extraction" },
      { src: "/img/projects/funda/04.webp", alt: "Extracted listing table", caption: "Extracted records, price and agent columns" },
      { src: "/img/projects/funda/05.webp", alt: "Dataset overview", caption: "Dataset overview after cleaning" },
    ],
    video: { src: "/video/funda.mp4", poster: "/video/funda-poster.jpg", caption: "Live crawl — pages advancing with checkpoint writes" },
    accent: "sand",
  },
  {
    slug: "aliexpress",
    index: "04",
    title: "AliExpress Pricing Intel",
    subtitle: "9 categories · JSON-embedded pricing · PKR forced",
    category: "Web Scraping",
    year: "2026",
    cover: "/img/projects/aliexpress/cover.webp",
    domain: "aliexpress.com",
    summary:
      "An anti-detection crawler that pulls exact pricing, sold counts, ratings and review volume across nine high-margin categories — with currency and geo forced to the client's market.",
    challenge:
      "Prices shown to a visitor from a UK datacentre are not the prices a Pakistani buyer sees. The client needed market-accurate figures, not tourist prices.",
    approach: [
      "undetected-chromedriver session with cookie and geo manipulation to force PKR pricing.",
      "Pricing read from JSON payloads embedded in the page rather than rendered DOM, avoiding rounding drift.",
      "Atomic CSV writes with per-category checkpoint resume — a failed category never corrupts the file.",
      "Nine categories run in sequence with per-category reports.",
    ],
    outcome: [
      { value: "9", label: "Categories" },
      { value: "PKR", label: "Exact currency" },
      { value: "4", label: "Signals per product" },
      { value: "0", label: "Corrupt writes" },
    ],
    stack: ["Python", "Selenium", "undetected-chromedriver", "Pandas"],
    shots: [
      { src: "/img/projects/aliexpress/01.webp", alt: "Category listing page", caption: "Category listing under forced PKR pricing" },
      { src: "/img/projects/aliexpress/02.webp", alt: "Product detail", caption: "Product detail — sold count and rating" },
      { src: "/img/projects/aliexpress/03.webp", alt: "Extracted dataset", caption: "Extracted dataset with exact prices" },
      { src: "/img/projects/aliexpress/05.webp", alt: "Category summary", caption: "Per-category summary" },
      { src: "/img/projects/aliexpress/06.webp", alt: "Second pass comparison", caption: "Second pass — price drift comparison" },
    ],
    video: { src: "/video/aliexpress.mp4", poster: "/video/aliexpress-poster.jpg", caption: "Live run — categories stepping through PKR listings" },
    accent: "lilac",
  },
  {
    slug: "daraz",
    index: "05",
    title: "Daraz.pk Product Intelligence",
    subtitle: "10 categories · ~15,000 listings per run",
    category: "Web Scraping",
    year: "2026",
    cover: "/img/projects/daraz/cover.webp",
    domain: "daraz.pk",
    summary:
      "A headful Playwright scraper attached to a real Chrome session over the DevTools Protocol — pricing, discounts, units sold, reviews and seller location across Pakistan's largest marketplace.",
    challenge:
      "The marketplace detects headless browsers quickly. A synthetic session would not survive ten categories of continuous paging.",
    approach: [
      "Connected to a real Chrome instance via the DevTools Protocol instead of launching a headless runner.",
      "Human-like pacing with incremental CSV writes so partial results are always usable.",
      "Auto-stop on an empty page prevented infinite paging after a category ended.",
      "Seller location captured per row for regional pricing analysis.",
    ],
    outcome: [
      { value: "~15,000", label: "Listings / run" },
      { value: "10", label: "Categories" },
      { value: "CDP", label: "Real browser session" },
      { value: "Live", label: "Incremental writes" },
    ],
    stack: ["Python", "Playwright", "Chrome DevTools Protocol", "Pandas"],
    shots: [
      { src: "/img/projects/daraz/02.webp", alt: "Marketplace grid", caption: "Marketplace grid across ten categories" },
      { src: "/img/projects/daraz/03.webp", alt: "Product capture", caption: "Product capture — price and units sold" },
      { src: "/img/projects/daraz/04.webp", alt: "Scraper output", caption: "Scraper output during a live run" },
      { src: "/img/projects/daraz/05.webp", alt: "Dataset overview", caption: "Dataset overview by category" },
      { src: "/img/projects/daraz/06.webp", alt: "Seller rollup", caption: "Seller location rollup" },
      { src: "/img/projects/daraz/07.webp", alt: "Final export", caption: "Final export ready for analysis" },
    ],
    video: { src: "/video/daraz.mp4", poster: "/video/daraz-poster.jpg", caption: "Live run — pages advancing with incremental writes" },
    accent: "rose",
  },
];

/* ── Experience ───────────────────────────────────────────────────────── */

export type Job = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  stack: string[];
};

export const experience: Job[] = [
  {
    role: "Freelance Python Engineer",
    company: "zaktecs.dev — independent",
    period: "Jun 2026 — Present",
    location: "Remote",
    summary:
      "Custom scrapers, data pipelines and B2B lead systems for agencies and founders. Long runs live on a self-managed Linux VPS with checkpointing and scheduled refresh.",
    stack: ["Python", "Playwright", "Scrapy", "Apollo.io", "Google Sheets"],
  },
  {
    role: "Data Scraper",
    company: "ITEH Limited",
    period: "Mar 2026 — May 2026",
    location: "Lahore",
    summary:
      "Built and maintained extraction jobs across multiple sources — anti-bot handling, pagination and cleaning — and delivered datasets ready for downstream analysis.",
    stack: ["Python", "Selenium", "BeautifulSoup", "Pandas"],
  },
  {
    role: "Data Analyst",
    company: "TEVTA Punjab",
    period: "Nov 2025 — Jan 2026",
    location: "Lahore",
    summary:
      "Consolidated survey and enrolment data for a workforce-development programme, rebuilt the reporting trackers and produced the recurring reports the team ran on.",
    stack: ["Excel", "SQL", "Pandas", "Google Sheets"],
  },
];

/* ── Toolkit ──────────────────────────────────────────────────────────── */

export type ToolGroup = { title: string; items: string[] };

export const toolkit: ToolGroup[] = [
  {
    title: "Languages & core",
    items: ["Python", "SQL", "JavaScript (basics)", "HTML / CSS"],
  },
  {
    title: "Scraping",
    items: ["Playwright", "Scrapy", "Selenium", "undetected-chromedriver", "requests", "httpx", "aiohttp", "BeautifulSoup", "lxml"],
  },
  {
    title: "Data",
    items: ["Pandas", "NumPy", "openpyxl", "regex", "Jupyter", "Postgres", "MySQL", "SQLite"],
  },
  {
    title: "Lead sourcing",
    items: ["Apollo.io", "Sales Navigator", "Prospeo", "LeadSpace", "Hunter.io", "Skrapp", "SearchLeads", "Google Maps"],
  },
  {
    title: "Verification",
    items: ["DNS MX", "SMTP checks", "NeverBounce", "dedupe & normalisation", "disposable & role filters"],
  },
  {
    title: "Delivery & ops",
    items: ["Google Sheets", "Excel", "Apps Script", "Make.com", "Cron", "Git & GitHub", "Linux VPS", "Docker (basics)"],
  },
];

/* ── Process ──────────────────────────────────────────────────────────── */

export const process = [
  {
    step: "01",
    title: "Scope the fields",
    body: "Which columns, how many rows, how often. That decision drives the whole build — it happens before a line of code.",
  },
  {
    step: "02",
    title: "Trial run",
    body: "One source, a hundred rows. If the data is not reachable or the fields do not extract cleanly, you find out in a day, not a week.",
  },
  {
    step: "03",
    title: "Build & harden",
    body: "The right tool per target, checkpointing, retries and pacing so an eight-hour run survives a block at hour six.",
  },
  {
    step: "04",
    title: "Verify & hand over",
    body: "Dedupe, format, verify emails, then deliver to Sheets, Excel, CSV or your database — with schedules if you want it live.",
  },
];

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export const faq = [
  {
    q: "How long does a typical project take?",
    a: "A single-site scraper is usually one to two weeks. Multi-source pipelines with verification and enrichment run three to six weeks, depending on how much the target fights back.",
  },
  {
    q: "Can you get around anti-bot protection?",
    a: "Often, yes — real browser sessions, pacing, proxy rotation and geo-consistent headers handle most commercial protections. Where a site's terms clearly forbid extraction, I will say so rather than pretend otherwise.",
  },
  {
    q: "What happens when a website changes its layout?",
    a: "The scraper breaks, and that is normal. I keep maintenance retainers so selectors get repaired, alerts fire when a run returns zero rows, and the data keeps flowing.",
  },
  {
    q: "How do you verify lead lists?",
    a: "Syntax, then DNS MX, then optional SMTP probing. On top of that: deduplication, normalisation, and filters for disposable domains, role accounts and image filenames hiding in email fields.",
  },
  {
    q: "Which format do I get the data in?",
    a: "Whatever fits your workflow — Google Sheets, Excel, CSV, JSON, or a Postgres table. Recurring jobs can refresh those automatically on a schedule.",
  },
  {
    q: "Do you sign NDAs and work with agencies?",
    a: "Yes to both. A large share of the work is white-label: the agency delivers, I stay invisible behind it.",
  },
];
