import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { articles, type Accent } from "@/content/the-gro";

export const metadata = {
  title: "The Gro · Webgro Studio",
  description:
    "Essays, experiments, and field notes on building better websites and shipping AI that earns its keep.",
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

// Brand-tinted gradient strip behind the title overlay. Keeps the
// readability dark zone in the article's accent colour rather than
// generic black.
const accentTitleGradient: Record<Accent, string> = {
  blue:   "from-wg-ink via-wg-ink/85 to-wg-blue/10",
  violet: "from-wg-ink via-wg-ink/85 to-wg-violet/10",
  teal:   "from-wg-ink via-wg-ink/85 to-wg-teal/10",
};

export default function TheGroIndex() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-wg-ink-raised pb-20 pt-32 md:pb-28 md:pt-40">
          <div className="pointer-events-none absolute top-[10%] left-[5%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.10)_0%,_transparent_70%)] blur-3xl" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-wg-violet"></span>
              <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.25em] text-wg-violet">
                The Gro
              </p>
            </div>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-5xl font-bold leading-[0.95] tracking-tight text-white md:text-7xl lg:text-[7.5rem]">
              Thinking out{" "}
              <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] text-transparent">
                loud.
              </span>
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/60">
              Essays, experiments, and field notes from the studio. On building better websites, shipping AI that earns its keep, and the crossover where the real work happens.
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 bg-wg-ink py-20 md:py-24">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-6">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/the-gro/${a.slug}`}
                  data-cursor="hover"
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-wg-ink-raised transition-all duration-500 hover:-translate-y-1 ${accentHoverBorder[a.accent]}`}
                >
                  {/* Hero image with title overlay */}
                  <div className="relative aspect-[16/11] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.heroImage}
                      alt={a.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                    />

                    {/* Brand-tinted readability gradient: deep ink at the
                        bottom fading to a hint of the article's accent
                        colour at the top, then transparent. Slight, not
                        overpowering. */}
                    <div
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t ${accentTitleGradient[a.accent]}`}
                    />

                    {/* Top: category + read-time pills */}
                    <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${accentText[a.accent]} backdrop-blur-md`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${accentDot[a.accent]}`} />
                        {a.category}
                      </div>
                      <div className="inline-flex items-center rounded-full border border-white/20 bg-wg-ink/70 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
                        {a.readTime}
                      </div>
                    </div>

                    {/* Bottom: title overlaid on the gradient */}
                    <h3 className="absolute inset-x-0 bottom-0 px-6 pb-6 font-[family-name:var(--font-display)] text-xl font-bold leading-tight tracking-tight text-white md:px-8 md:pb-7 md:text-2xl">
                      {a.title}
                    </h3>
                  </div>

                  {/* Text block: excerpt + date + read-more chevron */}
                  <div className="flex flex-1 flex-col p-8">
                    <p className="text-sm leading-relaxed text-white/60">
                      {a.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-8">
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/40">
                        {a.date}
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
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
