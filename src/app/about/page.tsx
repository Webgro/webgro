import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About Webgro · Shopify, WordPress, and AI tools. One studio.",
  description:
    "We've sat on both sides of the brief. Webgro is a senior studio of five, part of Broadbridge Group, building Shopify and WordPress sites plus production AI tools.",
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
