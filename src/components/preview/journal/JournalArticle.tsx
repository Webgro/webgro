"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Article } from "@/content/the-gro";
import { Closing } from "../Closing";
import { createGlPlanes } from "../glPlanes";
import { pv } from "../links";
import { PreviewShell } from "../PreviewShell";
import { SCENE_QUERY, useGsap } from "../useGsap";
import { Blocks, type TocItem } from "./Blocks";
import { KeepReading } from "./KeepReading";
import { SetTitle } from "./SetTitle";
import { Toc } from "./Toc";
import { tidy, type ArticleSummary } from "./lines";
import "./journal.css";

type ServiceSlug = NonNullable<Article["relatedService"]>;

const SERVICE_NOTE: Record<ServiceSlug, string> = {
  websites: "This article is based on the websites we build and look after.",
  consultancy: "This article is based on our consultancy work.",
  "automation-ai": "This article is based on our automation and AI work.",
  seo: "This article is based on our SEO work.",
  marketing: "This article is based on our marketing work.",
  design: "This article is based on our design work.",
};

/**
 * An article from The Gro. The hero is ink, the text is a sheet of paper that
 * rises over the photograph as a dome and flattens out (the scrubbed handover),
 * and from there on nothing moves except the brushed progress line and the
 * pull quotes, which light up a word at a time as they are read.
 */
export function JournalArticle({
  article,
  toc,
  next,
}: {
  article: Article;
  toc: TocItem[];
  next: ArticleSummary[];
}) {
  const service = article.relatedService;
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    // Reading progress: a brush line wiped across the top of the page. The wipe
    // and the stroke move in opposite directions so the stroke itself stays put.
    gsap.set(q(".pv-jrnl-progress"), { autoAlpha: 1 });
    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: q(".pv-jrnl-prose")[0], start: "top 70%", end: "bottom 70%", scrub: 0.3 },
    })
      .fromTo(q(".pv-jrnl-progress-wipe"), { xPercent: -100 }, { xPercent: 0 }, 0)
      .fromTo(q(".pv-jrnl-progress-stroke"), { xPercent: 100 }, { xPercent: 0 }, 0);

    mm.add(SCENE_QUERY, () => {
      el.classList.add("is-scene");
      const hero = q(".pv-jrnl-hero")[0] as HTMLElement;
      const cap = q(".pv-jrnl-sheet-cap")[0] as HTMLElement;
      const media = q(".pv-jrnl-hero-media")[0] as HTMLElement;

      // The handover. The paper rises over the foot of the photograph as a dome
      // and flattens into the top edge of the sheet, while the photograph drags
      // behind so the paper overtakes it.
      const handover = { trigger: cap, start: "top bottom", end: "top 30%", scrub: 0.4 };
      gsap.fromTo(cap, { clipPath: "ellipse(58% 0% at 50% 100%)" }, {
        clipPath: "ellipse(170% 145% at 50% 100%)", ease: "none", scrollTrigger: { ...handover },
      });
      gsap.fromTo(media, { y: 0 }, {
        y: () => cap.offsetHeight * 0.4, ease: "none",
        scrollTrigger: { ...handover, invalidateOnRefresh: true },
      });
      gsap.fromTo(q(".pv-jrnl-hero-copy"), { autoAlpha: 1, yPercent: 0 }, {
        autoAlpha: 0.12, yPercent: -7, ease: "power1.in",
        scrollTrigger: { trigger: hero, start: "top top", end: "+=75%", scrub: 0.4 },
      });

      // Pull quotes and callouts light up as they are read. Opacity only, so
      // nothing shifts under the reader's eye.
      (q(".pv-jrnl-lit") as HTMLElement[]).forEach((block) => {
        const words = block.querySelectorAll(".pv-jrnl-word");
        gsap.fromTo(words, { opacity: 0.16 }, {
          opacity: 1, ease: "none", stagger: 0.1,
          scrollTrigger: { trigger: block, start: "top 84%", end: "bottom 56%", scrub: 0.4 },
        });
        const stroke = block.querySelector(".pv-jrnl-callout-stroke");
        if (stroke) {
          gsap.fromTo(stroke, { clipPath: "inset(0% 0% 100% 0%)" }, {
            clipPath: "inset(0% 0% 0% 0%)", ease: "none",
            scrollTrigger: { trigger: block, start: "top 84%", end: "bottom 60%", scrub: 0.4 },
          });
        }
      });

      let planes: ReturnType<typeof createGlPlanes> = null;
      let io: IntersectionObserver | undefined;
      if (canvas.current) {
        planes = createGlPlanes(canvas.current, [media]);
        if (planes) {
          io = new IntersectionObserver(([e]) => planes?.setRunning(e.isIntersecting), { rootMargin: "20% 0px" });
          io.observe(hero);
        }
      }

      return () => {
        io?.disconnect();
        planes?.destroy();
        el.classList.remove("is-scene");
      };
    });

    return () => mm.revert();
  });

  return (
    <PreviewShell initialTheme="ink">
      <article className="pv-jrnl-article" ref={root}>
        <div className="pv-jrnl-progress" aria-hidden="true">
          <div className="pv-jrnl-progress-wipe">
            <svg className="pv-jrnl-progress-stroke" viewBox="0 0 300 30" preserveAspectRatio="none">
              <path
                filter="url(#pv-rough)"
                d="M0 11 C 60 7, 180 8, 297 12 C 301 12.5, 301 18, 296 18.5 C 200 22, 80 19, 0 21 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <section className="pv-jrnl-hero" data-pv-theme="ink">
          <canvas className="pv-jrnl-canvas" ref={canvas} aria-hidden="true" />
          <div className="pv-jrnl-hero-copy">
            <p className="pv-jrnl-crumb">
              <Link href={pv("/the-gro")} className="pv-textlink" data-cursor>The Gro</Link>
              <span aria-hidden="true">/</span>
              <span>{article.category}</span>
            </p>
            <h1 className="pv-jrnl-hero-title pv-jrnl-rise">
              <SetTitle text={tidy(article.title)} wide={26} narrow={16} />
            </h1>
            <div className="pv-jrnl-hero-row">
              <p className="pv-jrnl-standfirst">{tidy(article.excerpt)}</p>
              <dl className="pv-jrnl-byline">
                <div>
                  <dt>Written by</dt>
                  <dd>{article.author}</dd>
                </div>
                <div>
                  <dt>Published</dt>
                  <dd>{article.date}</dd>
                </div>
                <div>
                  <dt>Reading time</dt>
                  <dd>{article.readTime.replace(/\s*read$/i, "")}</dd>
                </div>
              </dl>
            </div>
          </div>
          <figure className="pv-jrnl-hero-figure">
            <div className="pv-jrnl-hero-media pv-jrnl-gl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.heroImage} alt="" width={1240} height={692} fetchPriority="high" />
            </div>
          </figure>
        </section>

        <section className="pv-jrnl-sheet" data-pv-theme="paper">
          <span className="pv-jrnl-sheet-cap" aria-hidden="true" />
          <div className="pv-jrnl-layout">
            <Toc items={toc} />
            <div className="pv-jrnl-prose">
              <Blocks blocks={article.body} />
            </div>
            <footer className="pv-jrnl-end">
              <p>
                Written by{" "}
                <Link href={pv("/about")} className="pv-textlink" data-cursor>{article.author}</Link>
                {article.author === "Michael Broadbridge" ? ", co-founder and CEO of Webgro" : ""}. Articles in The Gro
                are drafted with help from AI and edited by a person before they are published.
              </p>
              {service && (
                <p>
                  {SERVICE_NOTE[service]}{" "}
                  <Link href={pv(`/services/${service}`)} className="pv-textlink" data-cursor>
                    See the service
                  </Link>
                  .
                </p>
              )}
            </footer>
          </div>
        </section>
      </article>

      <KeepReading articles={next} />
      <Closing />
    </PreviewShell>
  );
}
