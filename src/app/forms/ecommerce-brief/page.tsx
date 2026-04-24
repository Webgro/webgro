import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { EcommerceBriefForm } from "@/components/forms/EcommerceBriefForm";

export const metadata: Metadata = {
  title: "eCommerce website brief · Webgro",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function EcommerceBriefPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <EcommerceBriefForm />
      </main>
      <Footer />
    </>
  );
}
