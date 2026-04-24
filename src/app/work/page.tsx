import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { caseStudies } from "@/content/work";
import { WorkBrowser } from "./WorkBrowser";

export const metadata = {
  title: "Work · Webgro Studio",
  description:
    "Selected case studies from the studio. eCommerce, luxury, brand, and AI-extended builds. 100+ projects shipped.",
};

export default function WorkIndex() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="pointer-events-none absolute top-[10%] left-[5%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.12)_0%,_transparent_70%)] blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-wg-blue"></span>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-blue">
                Selected work
              </p>
            </div>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
              Work that{" "}
              <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
                earns its keep.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/60">
              Selected projects from our roster of 100+ shipped builds.
              eCommerce, luxury, brand systems, and AI-extended work. Filter by
              the kind of project you&rsquo;re weighing up.
            </p>
          </div>
        </section>

        {/* Filter + masonry grid (client component) */}
        <WorkBrowser caseStudies={caseStudies} />

        {/* Footer callout */}
        <section className="border-t border-white/10 bg-wg-ink-raised py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <p className="max-w-md text-lg text-white/60">
                What you&rsquo;re seeing is a slice. Ask us for the full client
                list or a deep dive on a sector near yours.
              </p>
              <Link
                href="/#contact"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-7 py-4 text-base font-medium text-white transition hover:bg-white hover:text-wg-ink"
              >
                Start the project
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
