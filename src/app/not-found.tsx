import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * Custom 404. Lands any request that doesn't match an existing route
 * (and isn't caught by the redirect table in next.config.ts or the
 * .htaccess).
 *
 * Kept short and on-brand rather than clever. The three links out are
 * the site's three main surfaces: work, services, contact. Anyone who
 * hit a 404 from a stale backlink has somewhere obvious to go.
 */
export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-wg-ink pb-32 pt-32 md:pb-40 md:pt-40">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-[20%] left-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(45,141,255,0.18)_0%,_transparent_70%)] blur-3xl"
              style={{ animation: "wgDrift 22s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-[0%] right-[5%] h-[55vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(124,58,237,0.14)_0%,_transparent_70%)] blur-3xl"
              style={{ animation: "wgDrift 28s ease-in-out infinite reverse" }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center md:px-12 lg:px-16">
            <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.28em] text-wg-blue">
              [ 404 ] Page not found
            </p>

            <h1 className="mt-8 font-[family-name:var(--font-display)] text-7xl font-bold leading-[0.95] tracking-tight text-white md:text-9xl lg:text-[12rem]">
              Off the{" "}
              <span className="bg-gradient-to-r from-wg-blue via-wg-violet to-wg-teal bg-clip-text pr-[0.35em] italic text-transparent">
                map.
              </span>
            </h1>

            <p className="mx-auto mt-10 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl md:leading-[1.5]">
              The page you were looking for isn&rsquo;t here. It might have
              moved, been retired, or never existed. Try one of the routes
              below, or email us and we&rsquo;ll point you at what you wanted.
            </p>

            <div className="mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              <Link
                href="/work"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
              >
                See the work
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/services"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/10"
              >
                Explore services
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <Link
                href="/contact"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full bg-wg-blue px-6 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-wg-ink"
              >
                Get in touch
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            <p className="mt-20 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-white/40">
              Or head back to the <Link href="/" className="text-white/80 underline underline-offset-4 hover:text-wg-blue" data-cursor="hover">homepage</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
