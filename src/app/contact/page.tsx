import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactView } from "@/components/ContactView";

export const metadata: Metadata = {
  title: "Contact Webgro · Start the conversation",
  description:
    "Send a brief, email us, or come by the studio in Bracknell. 30 minutes, no decks, no pressure. Usually reply within one working day.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <ContactView />
      </main>
      <Footer />
    </>
  );
}
