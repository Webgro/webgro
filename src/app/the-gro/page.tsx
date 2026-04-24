import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TheGroCarousel } from "@/components/TheGroCarousel";
import { articles } from "@/content/the-gro";

export const metadata = {
  title: "The Gro · Webgro Studio",
  description:
    "Essays, experiments, and field notes on building better websites and shipping AI that earns its keep.",
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
              <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent">
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
            <TheGroCarousel articles={articles} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
