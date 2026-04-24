import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WordPressBriefForm } from "@/components/forms/WordPressBriefForm";

export const metadata: Metadata = {
  title: "WordPress website brief · Webgro",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function WordPressBriefPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <WordPressBriefForm />
      </main>
      <Footer />
    </>
  );
}
