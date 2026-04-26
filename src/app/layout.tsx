import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
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

// Satoshi is declared via plain @font-face in globals.css and served
// from /public/fonts/satoshi-{400,500,700,900}.woff2. We tried
// next/font/local but it auto-rewrote the font-family to a lowercase
// hashed name, which collided with the literal 'Satoshi' references
// already in the codebase. Plain @font-face is boring and bulletproof.

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
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
