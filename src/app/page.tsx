import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { WorkSection } from "@/components/WorkSection";
import { ServicesSection } from "@/components/ServicesSection";
import { TheGroSection } from "@/components/TheGroSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <WorkSection />
        <ServicesSection />
        <TheGroSection />
        <FAQSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
