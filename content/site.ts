/**
 * Every string on the site. Written to be skimmed: one idea per block,
 * no sentence repeated, nothing padded.
 */

export const site = {
  name: "Muhammad Zakria",
  role: "Web Scraper · Data Analyst",
  discipline: "Scraping · Analysis · Automation",
  location: "Lahore, Pakistan",
  timezone: "Asia/Karachi",
  email: "zakria@zaktecs.dev",
  phone: "+92 320 6825657",
  whatsapp: "https://wa.me/923206825657",
  calendly: "https://calendly.com/zakriashahbaz/30min",
  github: "https://github.com/zaktecs-ai",
  linkedin: "https://linkedin.com/in/zakriashahbaz",
  siteUrl: "https://zaktecs.dev",
  availability: "Available for work",
  availabilityShort: "Available",
  profile: "/img/avatar-512.webp",
  portrait: "/img/profile.webp",
} as const;

/* ── Hero ─────────────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Portfolio 2026",
  lineOne: "I turn websites",
  mirror: "into",
  lineRest: "structured data.",
  lede: "I scrape sites, clean the mess, and put it in a sheet that updates itself.",
  points: ["Web scraping", "Data cleaning", "Automation"],
  stats: [
    { value: "269k+", label: "Records scraped" },
    { value: "186k", label: "Leads verified" },
    { value: "8", label: "Live projects" },
  ],
} as const;

/* ── About ────────────────────────────────────────────────────────────── */

export const about = {
  lead: "I'm Zakria, a web scraper and data analyst in Lahore. I take data stuck inside websites and turn it into clean spreadsheets your team can use.",
  points: [
    { k: "Scrape", v: "JS-heavy sites, logins, pagination, anti-bot." },
    { k: "Clean", v: "Dedupe, normalise, verify emails before delivery." },
    { k: "Automate", v: "Scheduled runs refresh your sheet on their own." },
  ],
  close: "Most work is white-label for agencies. I also keep the boring parts running: retries, checkpoints, run reports.",
};

/* ── Capabilities ─────────────────────────────────────────────────────── */

export const capabilities = [
  {
    id: "scraping",
    index: "01",
    title: "Web Scraping",
    blurb: "Sites that block bots, load with JavaScript, or hide data behind pagination.",
    points: ["Playwright & Selenium", "Scrapy for volume", "Checkpoint + resume"],
  },
  {
    id: "pipelines",
    index: "02",
    title: "Data Cleaning",
    blurb: "Raw rows in, usable rows out — deduped, normalised and checked.",
    points: ["Pandas & NumPy", "Email verification", "Sheets or database"],
  },
  {
    id: "leadgen",
    index: "03",
    title: "Lead Systems",
    blurb: "B2B contact lists built from evidence, every row traceable to a source.",
    points: ["Google Maps & Apollo", "DNS MX checks", "27-field enrichment"],
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
  repo?: string;
  accent: string;
  source?: "github" | "client";
};

export const projects: Project[] = [
  {
    slug: "every-site-scraping",
    index: "01",
    title: "Every-Site Scraping",
    subtitle: "Open-source CLI — any URL list to 90 columns",
    category: "Open Source",
    year: "2026",
    cover: "/img/gh/every-site-banner.jpg",
    domain: "github.com/zaktecs-ai",
    coverPos: "center",
    summary:
      "A parallel scraper and crawler: paste URLs, get one row per page across a fixed 90-column schema — SEO, contacts, socials, tech stack.",
    challenge:
      "Every scrape project starts by rebuilding the same extractor. One tool should handle any site list without bespoke code.",
    approach: [
      "Parallel fetch with crash-safe resume and flat memory, so a 10k-URL job survives a restart.",
      "Robots-aware by default; CSV, JSON, JSONL or SQLite from one run.",
      "A fixed 90-column schema, so datasets from different runs merge cleanly.",
    ],
    outcome: [
      { value: "90", label: "Columns" },
      { value: "163", label: "Tests" },
      { value: "900+", label: "Sites validated" },
      { value: "MIT", label: "Licence" },
    ],
    stack: ["Python", "BeautifulSoup", "lxml", "requests"],
    shots: [
      { src: "/img/gh/every-site-how.jpg", alt: "How the scraper works", caption: "Fetch, parse, one 90-column row per page" },
      { src: "/img/gh/every-site-resume.jpg", alt: "Crash-safe resume", caption: "Resume after a kill — no duplicates, no lost rows" },
    ],
    repo: "https://github.com/zaktecs-ai/every-site-scraping",
    accent: "sky",
    source: "github",
  },
  {
    slug: "google-maps-engine",
    index: "02",
    title: "Google Maps Lead Engine",
    subtitle: "Businesses plus website enrichment to CSV and Excel",
    category: "Open Source",
    year: "2026",
    cover: "/img/projects/b2b-multi-niche/cover.webp",
    domain: "google maps to sheets",
    summary:
      "Searches Maps for any query, opens every listing, then visits each business site for emails, socials and tech stack. 72 columns, resumable for weeks.",
    challenge: "Long lead runs die halfway. The engine had to survive reboots and still export clean, joined data.",
    approach: [
      "Streams listings per query and enriches each site, escalating to Playwright only when a site needs JS.",
      "Multi-signal dedupe that removes repeats without collapsing multi-location chains.",
      "Early keep/reject filters, so the server never enriches records you don't want.",
    ],
    outcome: [
      { value: "72", label: "Columns" },
      { value: "~200k", label: "Records per run" },
      { value: "2 wks", label: "Unattended" },
      { value: "2", label: "Export formats" },
    ],
    stack: ["Python", "Playwright", "Pandas", "openpyxl"],
    shots: [
      { src: "/img/projects/b2b-multi-niche/01.webp", alt: "Run summary", caption: "Run summary — query and city throughput" },
      { src: "/img/projects/b2b-multi-niche/03.webp", alt: "Enriched rows", caption: "Enriched rows with socials and CMS detection" },
      { src: "/img/projects/b2b-multi-niche/05.webp", alt: "Final export", caption: "Export handed over as a working spreadsheet" },
    ],
    repo: "https://github.com/zaktecs-ai/basic-google-map-scraper-engine",
    accent: "sage",
    source: "github",
  },
  {
    slug: "zillow-agents",
    index: "03",
    title: "Zillow Agent Scraper",
    subtitle: "1,500 agents with verified phone numbers",
    category: "Open Source",
    year: "2026",
    cover: "/img/projects/us-healthcare/cover.webp",
    domain: "zillow.com",
    summary:
      "Real-estate agents from Zillow's reviews directory with verified phones. One HTTP request per page, no browser, no CAPTCHA solving.",
    challenge: "Zillow exposes only 25 pages per city, and tracking IDs masquerade as phone numbers.",
    approach: [
      "Pages fetched through an API instead of a browser — one request each, no proxy management.",
      "Append plus checkpoint writes: kill it any time, the next run continues with no duplicates.",
      "Four-layer phone extraction with strict validation, so tracking numbers never ship.",
    ],
    outcome: [
      { value: "1,500", label: "Agents" },
      { value: "100%", label: "Valid phones" },
      { value: "4", label: "Extraction layers" },
      { value: "25+", label: "Cities per sweep" },
    ],
    stack: ["Python", "requests", "Pandas"],
    shots: [
      { src: "/img/projects/us-healthcare/01.webp", alt: "Directory coverage", caption: "Directory sweep across city windows" },
      { src: "/img/projects/us-healthcare/03.webp", alt: "Phone verification", caption: "Phone validation results per record" },
      { src: "/img/projects/us-healthcare/05.webp", alt: "Delivered sheet", caption: "Delivered sheet, one row per agent" },
    ],
    repo: "https://github.com/zaktecs-ai/zillow-agent-scraper",
    accent: "sand",
    source: "github",
  },
  {
    slug: "facebook-comments",
    index: "04",
    title: "Facebook Comment Extractor",
    subtitle: "Public posts, no login, CSV and JSON out",
    category: "Open Source",
    year: "2026",
    cover: "/img/projects/daraz/cover.webp",
    domain: "facebook.com",
    summary:
      "Paste a public post URL, get structured comments. No account, no cookies, no API key — it reads what the logged-out site already ships.",
    challenge: "Public comments sit behind Relay payloads and signed GraphQL calls, and most tools demand a login.",
    approach: [
      "Parses the server-rendered Relay payload Facebook sends to any logged-out browser.",
      "Replays the site's own GraphQL operations for cursor pagination and replies.",
      "Falls back to a rendered copy only if both layers come up short.",
    ],
    outcome: [
      { value: "0", label: "Logins needed" },
      { value: "3", label: "Extraction layers" },
      { value: "2", label: "Output formats" },
      { value: "2", label: "GitHub stars" },
    ],
    stack: ["Python", "requests", "JSON"],
    shots: [
      { src: "/img/projects/daraz/02.webp", alt: "Post page", caption: "Public post page — the only input needed" },
      { src: "/img/projects/daraz/03.webp", alt: "Comment capture", caption: "Captured comments with reply threads" },
      { src: "/img/projects/daraz/06.webp", alt: "CSV output", caption: "Structured CSV output" },
    ],
    repo: "https://github.com/zaktecs-ai/facebook-comment-scraper",
    accent: "lilac",
    source: "github",
  },
  {
    slug: "lahore-jobs",
    index: "05",
    title: "Lahore Data Job Alerts",
    subtitle: "253 career pages, emailed every 8 hours",
    category: "Automation",
    year: "2026",
    cover: "/img/projects/funda/cover.webp",
    domain: "cron every 8h",
    summary:
      "Scrapes 253 verified Lahore career pages, keeps only entry-level data roles, and emails new matches every eight hours.",
    challenge: "Job boards bury junior roles under senior listings, and reposted jobs would spam the inbox.",
    approach: [
      "Fetcher, parser, matcher and notifier as separate stages, with a seen-jobs file for dedupe.",
      "Matcher rejects senior roles and anything above two years, then verifies experience on the job page.",
      "Runs on cron every eight hours, with a curl fallback for protected sites.",
    ],
    outcome: [
      { value: "253", label: "Career pages" },
      { value: "33", label: "Tests" },
      { value: "8h", label: "Cron cycle" },
      { value: "0", label: "Duplicate alerts" },
    ],
    stack: ["Python", "aiohttp", "Linux", "Cron"],
    shots: [
      { src: "/img/projects/funda/01.webp", alt: "Career page", caption: "Career page source" },
      { src: "/img/projects/funda/04.webp", alt: "Matched roles", caption: "Matched entry-level roles" },
    ],
    repo: "https://github.com/zaktecs-ai/lahore-job-alerts",
    accent: "rose",
    source: "github",
  },
  {
    slug: "data-toolkit",
    index: "06",
    title: "Data Automation Toolkit",
    subtitle: "15 tools for people who don't code",
    category: "Open Source",
    year: "2026",
    cover: "/img/projects/aliexpress/cover.webp",
    domain: "python toolkit.py",
    summary:
      "Fifteen small programs for non-technical users: pull a table into Excel, merge 30 sheets, verify emails, send per-client reports.",
    challenge: "Clients needed these jobs done without a terminal or a bespoke script for every task.",
    approach: [
      "One menu, one command: each tool asks a couple of questions and hands back a file.",
      "Every tool explained in plain words, with Windows, macOS and Linux steps.",
      "Built so a client can run their own refresh instead of paying for a rerun.",
    ],
    outcome: [
      { value: "15", label: "Tools" },
      { value: "1", label: "Command" },
      { value: "3", label: "Platforms" },
      { value: "MIT", label: "Licence" },
    ],
    stack: ["Python", "Pandas", "openpyxl"],
    shots: [
      { src: "/img/projects/aliexpress/01.webp", alt: "Table extraction", caption: "Pull a table straight into Excel" },
      { src: "/img/projects/aliexpress/03.webp", alt: "Merged output", caption: "Merged and cleaned output" },
    ],
    repo: "https://github.com/zaktecs-ai/data-automation-toolkit",
    accent: "sky",
    source: "github",
  },
  {
    slug: "b2b-multi-niche",
    index: "07",
    title: "Multi-Niche B2B Engine",
    subtitle: "12 US niches, 186,662 verified leads",
    category: "Client Work",
    year: "2026",
    cover: "/img/projects/b2b-multi-niche/cover.webp",
    domain: "google maps to sheets",
    summary:
      "186,662 verified B2B records across 12 niches and 5,011 cities, with 27 enrichment fields and a chain blocklist.",
    challenge: "One clean list across a dozen unrelated verticals, with contactable emails and no national chains.",
    approach: [
      "Playwright discovery plus 15-way concurrent site crawling.",
      "Async DNS MX verification before any address entered the dataset.",
      "27 fields per row: socials, CMS, GA4, Pixel, SSL, DMARC, schema, booking, chat.",
    ],
    outcome: [
      { value: "186,662", label: "Verified leads" },
      { value: "48%", label: "Email capture" },
      { value: "27", label: "Fields" },
      { value: "5,011", label: "Cities" },
    ],
    stack: ["Python", "Playwright", "aiohttp", "Pandas"],
    shots: [
      { src: "/img/projects/b2b-multi-niche/02.webp", alt: "Field coverage", caption: "Field coverage across the dataset" },
      { src: "/img/projects/us-healthcare/Server_log.webp", alt: "Server run log", caption: "Server run log — checkpoints in flight" },
    ],
    docs: [
      { label: "Case study", href: "/docs/b2b-lead-generation-case-study.pdf", hint: "PDF" },
      { label: "50-row sample", href: "/docs/b2b-buyer-sample-50.csv", hint: "CSV" },
    ],
    accent: "sage",
    source: "client",
  },
  {
    slug: "us-healthcare",
    index: "08",
    title: "US Healthcare Leads",
    subtitle: "67,230 records across 50 states",
    category: "Client Work",
    year: "2026",
    cover: "/img/projects/us-healthcare/cover.webp",
    domain: "google maps to scored csv",
    summary:
      "67,230 dental, med-spa, chiropractic and veterinary records with MX-verified email and a quality score per row.",
    challenge: "Volume was easy; deliverability was not. Bad addresses would burn the client's sending domain.",
    approach: [
      "1,528 Maps queries in batches of 150 with JSON checkpoint recovery.",
      "Every email passed syntax, DNS MX and a trap filter for dummy domains and asset filenames.",
      "A composite score per record; only 90+ shipped.",
    ],
    outcome: [
      { value: "67,230", label: "Records" },
      { value: "62.8%", label: "Scored 90+" },
      { value: "98.9%", label: "Phone coverage" },
      { value: "50", label: "States" },
    ],
    stack: ["Python", "Playwright", "dnspython", "Pandas"],
    shots: [
      { src: "/img/projects/us-healthcare/02.webp", alt: "State coverage", caption: "Coverage by state" },
      { src: "/img/projects/us-healthcare/04.webp", alt: "Scored dataset", caption: "Scored dataset with per-record flags" },
    ],
    docs: [
      { label: "Case study", href: "/docs/us-healthcare-case-study.pdf", hint: "PDF" },
      { label: "50-row sample", href: "/docs/healthcare-sample-50.csv", hint: "CSV" },
    ],
    accent: "lilac",
    source: "client",
  },
];

/* ── Experience ───────────────────────────────────────────────────────── */

export const experience = [
  {
    role: "Freelance Python Engineer",
    company: "zaktecs.dev",
    period: "Jun 2026 — Now",
    summary: "Scrapers, pipelines and lead systems for agencies and founders.",
    stack: ["Python", "Playwright", "Scrapy"],
  },
  {
    role: "Data Scraper",
    company: "ITEH Limited",
    period: "Mar — May 2026",
    summary: "Extraction jobs across multiple sources, with anti-bot handling and cleaning.",
    stack: ["Python", "Selenium", "Pandas"],
  },
  {
    role: "Data Analyst",
    company: "TEVTA Punjab",
    period: "Nov 2025 — Jan 2026",
    summary: "Consolidated survey data and rebuilt the recurring reporting trackers.",
    stack: ["Excel", "SQL", "Pandas"],
  },
];

/* ── Toolkit: only tools actually used, each with a real brand mark ───── */

export type Tool = { name: string; src: string; color: string; group: string };

export const tools: Tool[] = [
  { name: "Python", src: "/icons/tools/python.svg", color: "#3776AB", group: "Languages" },
  { name: "SQL", src: "/icons/tools/mysql.svg", color: "#4479A1", group: "Languages" },
  { name: "JavaScript", src: "/icons/tools/javascript.svg", color: "#F7DF1E", group: "Languages" },
  { name: "HTML / CSS", src: "/icons/tools/html5.svg", color: "#E34F26", group: "Languages" },
  { name: "Bash", src: "/icons/tools/gnubash.svg", color: "#4EAA25", group: "Languages" },

  { name: "Playwright", src: "/icons/tools/playwright.svg", color: "#2EAD33", group: "Scraping" },
  { name: "Scrapy", src: "/icons/tools/scrapy.svg", color: "#60A839", group: "Scraping" },
  { name: "Selenium", src: "/icons/tools/selenium.svg", color: "#43B02A", group: "Scraping" },
  { name: "aiohttp", src: "/icons/tools/aiohttp.svg", color: "#2C5BB4", group: "Scraping" },
  { name: "Apify", src: "/icons/tools/apify.svg", color: "#97D700", group: "Scraping" },
  { name: "Postman", src: "/icons/tools/postman.svg", color: "#FF6C37", group: "Scraping" },

  { name: "Pandas", src: "/icons/tools/pandas.svg", color: "#150458", group: "Data" },
  { name: "NumPy", src: "/icons/tools/numpy.svg", color: "#013243", group: "Data" },
  { name: "Jupyter", src: "/icons/tools/jupyter.svg", color: "#F37626", group: "Data" },
  { name: "JSON / CSV", src: "/icons/tools/json.svg", color: "#111111", group: "Data" },
  { name: "Postgres", src: "/icons/tools/postgresql.svg", color: "#4169E1", group: "Data" },
  { name: "SQLite", src: "/icons/tools/sqlite.svg", color: "#003B57", group: "Data" },

  { name: "Google Sheets", src: "/icons/tools/googlesheets.svg", color: "#34A853", group: "Delivery" },
  { name: "Excel", src: "/icons/tools/excel.svg", color: "#217346", group: "Delivery" },
  { name: "Apps Script", src: "/icons/tools/googleappsscript.svg", color: "#4285F4", group: "Delivery" },
  { name: "Google Drive", src: "/icons/tools/googledrive.svg", color: "#4285F4", group: "Delivery" },
  { name: "Airtable", src: "/icons/tools/airtable.svg", color: "#18BFFF", group: "Delivery" },
  { name: "Notion", src: "/icons/tools/notion.svg", color: "#111111", group: "Delivery" },

  { name: "Google Maps", src: "/icons/tools/googlemaps.svg", color: "#4285F4", group: "Lead data" },
  { name: "Apollo.io", src: "/icons/tools/apollo.png", color: "#FACC15", group: "Lead data" },
  { name: "Sales Navigator", src: "/icons/tools/salesnavigator.png", color: "#0A66C2", group: "Lead data" },
  { name: "Prospeo", src: "/icons/tools/prospeo.png", color: "#E5484D", group: "Lead data" },
  { name: "Skrapp", src: "/icons/tools/skrapp.png", color: "#1E88E5", group: "Lead data" },
  { name: "Hunter", src: "/icons/tools/hunter.png", color: "#F97316", group: "Lead data" },
  { name: "LeadSpace", src: "/icons/tools/leadspace.png", color: "#C026D3", group: "Lead data" },
  { name: "SearchLeads", src: "/icons/tools/searchleads.png", color: "#F59E0B", group: "Lead data" },
  { name: "NeverBounce", src: "/icons/tools/neverbounce.png", color: "#0F9BD7", group: "Lead data" },

  { name: "Linux", src: "/icons/tools/linux.svg", color: "#FCC624", group: "Automation" },
  { name: "Make.com", src: "/icons/tools/make.svg", color: "#6D00CC", group: "Automation" },
  { name: "Git", src: "/icons/tools/git.svg", color: "#F05032", group: "Automation" },
  { name: "GitHub", src: "/icons/tools/github.svg", color: "#181717", group: "Automation" },
  { name: "Docker", src: "/icons/tools/docker.svg", color: "#2496ED", group: "Automation" },
  { name: "DigitalOcean", src: "/icons/tools/digitalocean.svg", color: "#0080FF", group: "Automation" },
];

/* ── Process ──────────────────────────────────────────────────────────── */

export const process = [
  { step: "01", title: "Scope", body: "Fields, row count, refresh rate." },
  { step: "02", title: "Trial run", body: "100 rows from one source." },
  { step: "03", title: "Build", body: "Checkpoints, retries, pacing." },
  { step: "04", title: "Hand over", body: "Sheet, CSV or database." },
];

/* ── FAQ ──────────────────────────────────────────────────────────────── */

export const faq = [
  { q: "How long does a project take?", a: "One to two weeks for a single site. Multi-source pipelines run three to six weeks." },
  { q: "Can you get past anti-bot protection?", a: "Usually — real browser sessions, pacing and proxy rotation. Where terms forbid extraction, I'll say so." },
  { q: "What if the site changes layout?", a: "The scraper breaks; that's normal. I keep maintenance retainers so selectors get repaired and alerts fire on empty runs." },
  { q: "How do you verify leads?", a: "Syntax, then DNS MX, then optional SMTP — plus dedupe and filters for disposable and role accounts." },
  { q: "What format do I get?", a: "Google Sheets, Excel, CSV, JSON or a database table — whatever fits how you already work." },
];
