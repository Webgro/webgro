type Gsap = typeof import("gsap").default;
type ScrollTriggerStatic = typeof import("gsap/ScrollTrigger").ScrollTrigger;

/** Each row draws its rule, lifts its title out of the mask, then fades in the small print. */
export function revealRows(gsap: Gsap, rows: HTMLElement[]) {
  rows.forEach((row) => {
    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 90%" } });
    tl.from(row.querySelector(".pv-jrnl-row-rule"), { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, 0)
      .from(row.querySelector(".pv-jrnl-row-title"), { yPercent: 106, duration: 1, ease: "power3.out" }, 0.12)
      .from(row.querySelectorAll(".pv-jrnl-row-meta > span, .pv-jrnl-row-excerpt, .pv-jrnl-row-thumb"), {
        autoAlpha: 0, y: 16, duration: 0.8, ease: "power3.out", stagger: 0.05,
      }, 0.3);
  });
}

/** Phones have no hover, so the brushed marker goes to whichever row is being read. */
export function lightRows(ScrollTrigger: ScrollTriggerStatic, rows: HTMLElement[]) {
  rows.forEach((row) => {
    ScrollTrigger.create({
      trigger: row, start: "top 58%", end: "bottom 40%",
      toggleClass: { targets: row, className: "is-lit" },
    });
  });
}
