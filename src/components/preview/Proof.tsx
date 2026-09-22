"use client";

import Link from "next/link";
import { Fragment, useRef } from "react";
import { awards, clients } from "./content";
import { pv } from "./links";
import { ShopifyPartner } from "./ShopifyPartner";
import { useGsap } from "./useGsap";

export function Proof() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, ({ gsap }) => {
    const q = gsap.utils.selector(root.current!);
    gsap.from(q(".pv-client"), {
      yPercent: 100, duration: 0.9, ease: "power3.out", stagger: 0.04,
      scrollTrigger: { trigger: q(".pv-clients")[0], start: "top 80%" },
    });
    q(".pv-award").forEach((row) => {
      gsap.from(row, {
        autoAlpha: 0, y: 24, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 90%" },
      });
    });
  });

  return (
    <section className="pv-proof" ref={root} data-pv-theme="paper">
      <div className="pv-proof-clients">
        <p className="pv-label">Clients</p>
        <p className="pv-clients">
          {clients.map((c, i) => (
            <Fragment key={c.slug}>
              <span className="pv-client-mask">
                <Link href={pv(`/work/${c.slug}`)} className="pv-client" data-cursor>
                  {c.name}{i < clients.length - 1 ? "," : "."}
                </Link>
              </span>{" "}
            </Fragment>
          ))}
        </p>
      </div>
      <div className="pv-proof-awards">
        <p className="pv-lede">
          Five awards since 2020, including Best Web Design Agency in the UK in 2022.
        </p>
        <ShopifyPartner className="pv-proof-partner" />
        <ul>
          {awards.map((a) => (
            <li className="pv-award" key={a.year + a.title + a.region}>
              <span>{a.year}</span>
              <span>{a.title}</span>
              <span>{a.region}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
