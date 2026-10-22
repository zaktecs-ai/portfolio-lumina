import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./tokens.css";
import "./globals.css";
import { site } from "@/content/site";

/* Fonts are self-hosted (see app/fonts.css) and preloaded here: the headline
   face is on the critical path, so it must not wait for a discovered CSS rule. */

const title = "Muhammad Zakria — Data Engineer, Web Scraping & B2B Data";
const description =
  "Python engineer in Lahore building scrapers, automated pipelines and verified B2B lead systems. 269k+ records delivered across Google Maps, marketplaces and real estate.";

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: title,
    template: "%s — Muhammad Zakria",
  },
  description,
  applicationName: "Muhammad Zakria — Portfolio",
  authors: [{ name: "Muhammad Zakria", url: site.siteUrl }],
  creator: "Muhammad Zakria",
  keywords: [
    "Python developer Pakistan",
    "web scraping engineer",
    "data pipeline developer",
    "B2B lead generation",
    "Playwright scraping",
    "Scrapy developer",
    "Google Maps scraper",
    "email verification",
    "data automation",
    "Muhammad Zakria",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.siteUrl,
    siteName: "Muhammad Zakria",
    title,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Muhammad Zakria — Data Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f6f5f2",
  colorScheme: "light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Zakria",
  jobTitle: "Data Engineer — Web Scraping & B2B Data",
  email: "mailto:zakria@zaktecs.dev",
  telephone: "+92-320-6825657",
  url: site.siteUrl,
  image: `${site.siteUrl}/img/profile.webp`,
  address: { "@type": "PostalAddress", addressLocality: "Lahore", addressCountry: "PK" },
  sameAs: [site.github, site.linkedin],
  knowsAbout: ["Web scraping", "Data pipelines", "B2B lead generation", "Python", "Playwright", "Scrapy"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}