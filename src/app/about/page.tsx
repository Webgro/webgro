import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About Webgro · AI-first eCommerce & WordPress agency, Bracknell",
  description:
    "We've sat on both sides of the brief. Webgro is a senior studio of five, part of Broadbridge Group, building and maintaining WordPress, Shopify, and AI tools for serious eCommerce.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <AboutView />
      </main>
      <Footer />
    </>
  );
}
