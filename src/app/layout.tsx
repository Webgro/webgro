import type { Metadata } from "next";
import { Inter, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { CookieBanner } from "@/components/CookieBanner";
import { JsonLd, organisationLd, websiteLd } from "@/components/JsonLd";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Display face. Plus_Jakarta_Sans is a free Google-Fonts geometric sans with a
// distinctive humanist character that reads visibly different from
// Inter (which the rest of the site uses for body copy). Picked as
// a permanent replacement for Satoshi after every attempt to self-
// host Satoshi failed: Fontshare's CDN serves placeholder woff2 files
// to non-browser clients (literally a 25KB binary with all name
// fields set to "false") to discourage hotlinking, AND Tailwind v4 /
// Turbopack strips @import url(fontshare) from the compiled bundle.
// Plus_Jakarta_Sans via next/font/google self-hosts via Vercel's same-origin
// CDN, no external dependency, no risk of regression.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Poppins was loaded for mockup UI (Fun Cases case study screens) but
// is below the fold and the system fallback is acceptable. Removed from
// the global font load to save a font request on every page.

export const metadata: Metadata = {
  metadataBase: new URL("https://webgro.co.uk"),
  title: "Webgro · eCommerce, WordPress, and production AI tools",
  description:
    "Shopify and WordPress built for conversion and speed. Production AI tools layered in where the numbers say yes. One senior studio, Bracknell-based.",
  openGraph: {
    title: "Webgro · Shopify, WordPress, and AI tools. One studio.",
    description:
      "A senior studio building eCommerce sites, WordPress builds, and production AI tools. Based in Bracknell, part of Broadbridge Group.",
    url: "https://webgro.co.uk",
    siteName: "Webgro",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webgro · Shopify, WordPress, and AI tools. One studio.",
    description:
      "A senior studio building eCommerce sites, WordPress builds, and production AI tools. Based in Bracknell, part of Broadbridge Group.",
  },
  alternates: {
    // RSS autodiscovery for The Gro. Site-wide so any reader extension
    // can find the feed from any page.
    types: {
      "application/rss+xml": "/the-gro/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd id="ld-org" data={organisationLd()} />
        <JsonLd id="ld-website" data={websiteLd()} />
        <GoogleAnalytics />
        <CustomCursor />
        <LenisProvider>{children}</LenisProvider>
        <CookieBanner />
      </body>
    </html>
  );
}
