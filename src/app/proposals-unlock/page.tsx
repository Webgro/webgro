import type { Metadata } from "next";

/**
 * The password form shown for anything under /proposals. Never linked
 * from anywhere and never rendered at its own URL in practice: the
 * middleware rewrites gated proposal URLs here, so the address bar
 * keeps the proposal link the client was sent.
 */
export const metadata: Metadata = {
  title: "Client proposals · Webgro",
  robots: { index: false, follow: false },
};

export default async function ProposalsUnlock({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/proposals/", error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-wg-ink px-6">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-wg-ink-raised p-10 md:p-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-white.png"
            alt="Webgro"
            width={450}
            height={146}
            className="h-8 w-auto"
          />

          <p className="mt-10 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.25em] text-wg-blue">
            [ Client proposals ]
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white">
            This document is private.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Enter the password from your email to view it. If you don&rsquo;t
            have one, ask whoever sent you the link.
          </p>

          <form method="POST" action="/api/proposals/unlock" className="mt-8">
            <input type="hidden" name="next" value={next} />
            <label
              htmlFor="proposal-password"
              className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/50"
            >
              Password
            </label>
            <input
              id="proposal-password"
              name="password"
              type="password"
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-white/15 bg-wg-ink px-4 py-3 text-base text-white outline-none transition focus:border-wg-blue"
            />
            {error && (
              <p className="mt-3 text-sm text-red-400">
                That password isn&rsquo;t right. Try again.
              </p>
            )}
            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-white px-5 py-3 text-sm font-semibold text-wg-ink transition hover:bg-wg-blue hover:text-white"
            >
              View the proposal
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-white/35">
          Commercial in confidence · webgro.co.uk
        </p>
      </div>
    </main>
  );
}
