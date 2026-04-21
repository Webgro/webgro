import type { Metadata } from "next";
import { Inter, Geist_Mono, Poppins } from "next/font/google";
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

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://webgro.co.uk"),
  title: "Webgro · Your AI partner for digital growth",
  description:
    "Websites, eCommerce consultancy, automation and AI. From a studio that does both. Today's site. Tomorrow's system.",
  openGraph: {
    title: "Webgro · AI-first eCommerce & WordPress agency",
    description:
      "Shopify and WordPress builds, consultancy, and production AI tools. Based in Bracknell, part of Broadbridge Group.",
    url: "https://webgro.co.uk",
    siteName: "Webgro",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webgro · AI-first eCommerce & WordPress agency",
    description:
      "Shopify and WordPress builds, consultancy, and production AI tools. Based in Bracknell, part of Broadbridge Group.",
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
      className={`${inter.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
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
