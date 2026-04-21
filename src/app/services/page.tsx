import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { services } from "@/content/services";
import type { Accent } from "@/content/work";

export const metadata = {
  title: "Services · Webgro Studio",
  description:
    "Six capabilities from one studio. Websites, consultancy, automation & AI, SEO, marketing, and design. Built to work together.",
};

const accentDot: Record<Accent, string> = {
  blue: "bg-wg-blue",
  violet: "bg-wg-violet",
  teal: "bg-wg-teal",
};

const accentText: Record<Accent, string> = {
  blue: "text-wg-blue",
  violet: "text-wg-violet",
  teal: "text-wg-teal",
};

const accentHoverBorder: Record<Accent, string> = {
  blue: "hover:border-wg-blue/60",
  violet: "hover:border-wg-violet/60",
  teal: "hover:border-wg-teal/60",
};

const accentGradientFrom: Record<Accent, string> = {
  blue: "from-wg-blue/20",
  violet: "from-wg-violet/20",
  teal: "from-wg-teal/20",
};

export default function ServicesIndex() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="pointer-events-none absolute top-[10%] left-[5%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.12)_0%,_transparent_70%)] blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-wg-violet" />
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-violet">
                Services
              </p>
            </div>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
              Six capabilities,{" "}
              <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent">
                one studio.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/60">
              Each service stands on its own. Most clients end up across two or
              three because they work better together. Pick a starting point and
              we&rsquo;ll tell you honestly if it&rsquo;s the right one.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="bg-wg-ink py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:gap-8">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  data-cursor="hover"
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised p-10 transition-all duration-500 hover:-translate-y-1 md:p-12 ${accentHoverBorder[s.accent]}`}
                >
                  {/* Accent glow */}
                  <div
                    className={`pointer-events-none absolute -right-1/4 -top-1/3 h-[200%] w-[60%] bg-gradient-to-br ${accentGradientFrom[s.accent]} via-transparent to-transparent opacity-35 blur-3xl`}
                  />

                  <div className="relative flex items-start justify-between">
                    <span
                      className={`font-[family-name:var(--font-mono)] text-sm font-medium tracking-[0.2em] ${accentText[s.accent]}`}
                    >
                      {s.num}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${accentDot[s.accent]} opacity-70`} />
                  </div>

                  <h2 className="relative mt-16 font-[family-name:var(--font-display)] text-4xl font-bold leading-[0.95] tracking-tight text-white md:text-6xl">
                    {s.name}
                  </h2>

                  <p className="relative mt-4 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                    {s.tagline}
                  </p>

                  <p className="relative mt-6 max-w-md text-base leading-relaxed text-white/70">
                    {s.summary}
                  </p>

                  <div className="relative mt-8 flex flex-wrap gap-2">
                    {s.capabilities.slice(0, 5).map((cap) => (
                      <span
                        key={cap}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/70"
                      >
                        {cap}
                      </span>
                    ))}
                    {s.capabilities.length > 5 && (
                      <span className="font-[family-name:var(--font-mono)] px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/40">
                        +{s.capabilities.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-auto flex items-center justify-between pt-10">
                    <span className="text-sm font-medium text-white">
                      Read more
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-wg-ink">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 9L9 3M9 3H4M9 3V8"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/10 bg-wg-ink-raised py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <p className="max-w-md text-lg text-white/60">
                Not sure which service fits? Start a conversation, we&rsquo;ll
                tell you where the biggest wins sit before you commit.
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
