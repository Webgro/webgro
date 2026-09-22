"use client";

import Link from "next/link";
import { Fragment, useRef } from "react";
import { pv } from "../links";
import { useGsap } from "../useGsap";

const LINE = "We've launched a little over a hundred websites since 2012. The projects above are a selection.";

export function WorkOutro() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    const words = q(".pv-work-outro-word");
    gsap.set(words, { opacity: 0.14 });
    gsap.to(words, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: q(".pv-work-outro-line")[0], start: "top 82%", end: "bottom 50%", scrub: 0.4 },
    });
    gsap.from(q(".pv-work-outro-foot > *"), {
      y: 26, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: q(".pv-work-outro-foot")[0], start: "top 88%" },
    });
  });

  return (
    <section className="pv-work-outro" ref={root} data-pv-theme="ink">
      <h2 className="pv-work-outro-line">
        {LINE.split(" ").map((w, i) => (
          <Fragment key={i}>
            <span className="pv-work-outro-word">{w}</span>{" "}
          </Fragment>
        ))}
      </h2>
      <div className="pv-work-outro-foot">
        <p className="pv-lede">
          We can send you the full client list, or more detail on projects in your sector.
        </p>
        <div className="pv-work-outro-links">
          <Link href={pv("/contact")} className="pv-textlink" data-cursor>Ask for the client list</Link>
          <Link href={pv("/services")} className="pv-textlink" data-cursor>See our services</Link>
        </div>
      </div>
    </section>
  );
}
