import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { OnboardingForm } from "@/components/forms/OnboardingForm";

/**
 * Link-only onboarding form. `robots: noindex` prevents Google from
 * indexing the page even if the URL leaks into the web; robots.txt
 * Disallow also blocks crawling. The URL is handed directly to new
 * clients — not linked from nav, footer, or the sitemap.
 */
export const metadata: Metadata = {
  title: "New client onboarding · Webgro",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function OnboardingPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <OnboardingForm />
      </main>
      <Footer />
    </>
  );
}
