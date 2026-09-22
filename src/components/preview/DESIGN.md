# Webgro redesign concept: design brief for every page under /preview

The homepage concept lives at `/preview` (dark hero, the client's pick) and `/preview/light`. The client (Michael, Webgro's founder)
loved it and wants the same level of craft on every other page. Read the homepage source first. It is the
reference for quality, tone and technique:

- `src/components/preview/PreviewHome.tsx` and the section components beside it
- `src/components/preview/preview.css` (tokens, type scale, shared utilities)
- `src/components/preview/content.ts` (the copy voice)

## The idea

Webgro's logo has a hand-brushed blue "W". Everything follows from that: warm paper and ink, big confident
Satoshi type, and a dry blue brushstroke wiped in under ONE key phrase per section at most. The site should feel
made by people with taste, not generated. Motion is the showpiece: scroll scenes that tell a story
(wireframe becomes website, camera pulls back to a wall of work), WebGL images that bend with scroll speed,
text that lights up as you read. Each page needs at least one signature scroll scene of that calibre, designed
around that page's actual content, plus careful micro-interactions everywhere else.

## Hard bans (the client can spot an AI-made site a mile off)

- No marquees or auto-scrolling tickers.
- No gradient text, no blue/violet/teal gradients, no glow blobs, no glassmorphism, no pill "eyebrow" badges with
  pulsing dots, no mono `[ 01 ]` bracket labels, no emoji, no icon-in-a-rounded-square feature grids, no generic
  three-card rows.
- No em dashes anywhere (copy, comments, alt text). En dashes only for numeric ranges.
- No staccato fragment copy ("Fast. Clean. Yours."), no rule-of-three filler, no "not X, but Y" constructions,
  no "elevate / seamless / unlock / supercharge / leverage / in today's digital landscape".
- The only colours are paper `#f2efe9`, ink `#0d0d0f`, blue `#2d8dff`, white, and neutral tints of ink/paper.
  The old site's violet and teal accents are retired. Client imagery supplies all other colour.

## Copy voice

Plain, warm, slightly dry British English, written the way Michael would say it across a table. Full sentences.
USE CONTRACTIONS (we've, that's, it's, don't): the first draft avoided them and the client said it read as AI.
Be specific and concrete. Short sentences are fine when they are real sentences. Examples from the homepage:

- "Everything starts on paper, because a drawing is a lot cheaper to change than a finished website."
- "Whoever answers your email is the one doing the work."
- "We'd rather keep a client for ten years than win an award for a launch, although we've been lucky enough to
  do a bit of both."

Facts: only use facts, figures, client names and claims that already exist in `src/content/*.ts` or the existing
page components. Rewrite the wording freely, but never invent a number, a result, a testimonial or a service.
Founded 2012. Bracknell, Berkshire. Small senior team (Michael, Lily, Matt, Kira). Five awards. Don't mention Broadbridge Group anywhere except the footer credit.

## Tech ground rules

- Next.js 16 App Router, React 19, Tailwind 4 available but the concept uses plain CSS. This Next version has
  breaking changes: before using any Next API you are unsure of, read the guide in `node_modules/next/dist/docs/`.
  Mirror the patterns of the existing live route you are redesigning (e.g. `params` is a Promise; use
  `generateStaticParams` where the live route does).
- Routes go in `src/app/preview/<same path as live site>/page.tsx`, a server component that exports
  `metadata` with `robots: { index: false, follow: false }` and renders your client view.
- Wrap every page in `<PreviewShell initialTheme="paper" | "ink">` from `@/components/preview/PreviewShell`.
  It supplies nav, footer, the brush SVG filter, and page colour switching.
- Sections declare their colour with `data-pv-theme="paper" | "ink" | "blue"` on the `<section>`. The shell flips
  `--pv-bg` / `--pv-fg` when a section crosses the viewport middle. Use `var(--pv-fg)`, `var(--pv-bg)`,
  `var(--pv-muted)`, `var(--pv-rule)`, `var(--pv-blue)`, `var(--pv-pad)`, `var(--pv-display)`, `var(--pv-ease)`
  so your sections follow the flip. Alternate paper and ink through the page for rhythm.
- ALL internal links go through `pv()` from `@/components/preview/links` (e.g. `pv("/work/fun-cases")`) so the
  concept can be browsed end to end without leaving `/preview`.
- Shared utilities you can use (do not redefine): classes `pv-h1`, `pv-h2`, `pv-h3`, `pv-lede`, `pv-label`,
  `pv-btn` (+ `pv-btn--light`, `pv-btn--white`; wrap the label in a `<span>`), `pv-textlink`, `pv-line` (overflow
  mask for line reveals: `<span class="pv-line"><span>text</span></span>`), `pv-brushed` + `<BrushStroke />`
  from `./Brush` (see HeroScene / Letter / Closing for usage and the clip-path wipe).
- End every page with `<Closing />` from `@/components/preview/Closing` (the blue dome CTA) unless the page is
  the contact page or a legal page.
- Add `data-cursor` to interactive elements (the site has a custom cursor that reacts to it).
- Images: plain `<img>` with width/height and `loading="lazy"` below the fold (add the eslint-disable comment the
  homepage uses). Source imagery is in `public/work/**` and `public/preview/**`. Some originals are 1.5 to 2 MB
  PNGs saved as .jpg; if you need them, write optimised copies into `public/preview/` with Python PIL
  (see sizes in `public/preview/`), never hot-link a 2 MB file.

### Motion rules (learned the hard way on the homepage)

- Use the `useGsap(scopeRef, ({ gsap, ScrollTrigger }) => { ... })` hook from `./useGsap`. It lazy-loads GSAP,
  scopes selectors and reverts on unmount. Inside it use `gsap.matchMedia()` with `SCENE_QUERY`
  (motion allowed, ALL screen sizes) and `STATIC_QUERY` (reduced motion). Lenis smooth scroll and ScrollTrigger
  are already wired globally by the root layout.
- MOBILE GETS THE SAME SCENES. The client explicitly asked for this. Adapt geometry for portrait (see how
  HeroScene.measure() and the `@media (max-width: 899px)` blocks handle it) instead of switching scenes off. Use
  `svh` units for pinned stage heights on phones.
- The CSS default must be the finished, readable state, so the page works before JS and with reduced motion.
  GSAP sets hidden/initial states itself. Toggle an `is-scene` class from inside `mm.add(SCENE_QUERY, ...)` when a
  layout needs to change for a pinned scene, and remove it on cleanup.
- ABOVE THE FOLD, never switch layout from JS. The client saw the hero load, jump and resize when `is-scene` was
  added after hydration. For a first-screen scene, render the `is-scene` class in the markup (see HeroScene), hide
  only the parts GSAP must place first (`:not(.is-ready)`), and have the STATIC_QUERY branch remove the class.
- Never put a CSS `transition` on a property GSAP is animating on the same element (move hover transforms to a
  wrapper). Animating `filter` from nothing starts at brightness(0): always use `fromTo` with an explicit start.
- For pinned scenes use function-based values plus `invalidateOnRefresh: true`, and re-measure in
  `onRefreshInit`. Do not add `will-change: transform` to large scaled layers (it caused blank frames).
- Inline-block mask spans swallow trailing spaces: put the `{" "}` outside the mask span.
- WebGL: `createGlPlanes(canvas, elements)` in `./glPlanes` redraws DOM images as bendy planes that follow their
  element's box (see WorkReel for the canvas markup/CSS, IntersectionObserver gating and cleanup). Reuse it where
  imagery moves; do not add three.js or any new dependency.
- Keep it fast: transforms and opacity only in scrubbed animations, no layout thrash in rAF loops, lazy-load below
  the fold, respect `prefers-reduced-motion`.

## File ownership (several agents are working in parallel)

- Put your components in `src/components/preview/<your-area>/` and your styles in ONE css file there, imported by
  your view component. Prefix every class `pv-<area>-` (for example `pv-cs-`, `pv-about-`).
- Do NOT edit shared files: anything directly inside `src/components/preview/` (preview.css, PreviewShell,
  PreviewNav, PreviewFooter, content.ts, useGsap, glPlanes, Brush, links, homepage sections), anything in
  `src/content/`, or any live-site component or route. Import them, do not change them. If you believe a shared
  file needs a change, do not make it: describe it in your final report.
- Do not touch `src/app/preview/page.tsx` or `src/app/preview/light/`.

## Verifying your work

- Run `npx tsc --noEmit -p .` and `npx eslint <your files>` and fix everything they report in your files.
- Do NOT run `next dev`, `next build`, or any browser/preview tool: a dev server is already running and the
  browser is shared. Visual QA happens centrally afterwards, so re-read your CSS and scene maths carefully, think
  through 1440x900, 1280x720 and 375x812, and keep layouts robust (clamp(), min(), no fixed pixel heights for text).
- Grep your files for the em dash character before you finish.

## Final report

List the files you created, describe the signature scene and the main interactions, note any content you were
unsure about, and flag any shared-file change you would have wanted.
