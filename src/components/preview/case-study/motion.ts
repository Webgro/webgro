type Gsap = typeof import("gsap").default;

/**
 * A figure that counts. The element carries its finished text in the markup
 * (so it reads correctly before scripts and with reduced motion) plus data
 * attributes describing the number inside it.
 */
export function counter(el: HTMLElement) {
  const end = Number(el.dataset.end ?? 0);
  const from = Number(el.dataset.from ?? 0);
  const decimals = Number(el.dataset.dec ?? 0);
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const grouped = el.dataset.grouped === "1";
  const original = el.textContent;
  const state = { v: from };
  const render = () => {
    const n = grouped
      ? state.v.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : state.v.toFixed(decimals);
    el.textContent = `${prefix}${n}${suffix}`;
  };
  return { state, end, render, restore: () => { el.textContent = original; } };
}

/**
 * Counts every [data-end] figure inside `root` up once, on a timer, as it enters
 * the viewport. Deliberately not scrubbed: a reader who stops scrolling halfway
 * must never be left looking at a half-counted (wrong) result.
 */
export function scrubCounters(gsap: Gsap, root: HTMLElement) {
  const restores: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-end]").forEach((el) => {
    const c = counter(el);
    c.render();
    restores.push(c.restore);
    gsap.to(c.state, {
      v: c.end, duration: 1.3, ease: "power2.out", onUpdate: c.render, onComplete: c.restore,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
  return () => restores.forEach((r) => r());
}

/**
 * Shared entrances for the frames in Media.tsx: browser screenshots wipe in
 * behind a blue scan line (the same move as the homepage hero), phones swing
 * up into place, product demos settle, and photographs drift so the WebGL
 * layer has some speed to bend them with.
 */
export function animateMedia(gsap: Gsap, root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".pv-cs-browser-view").forEach((view) => {
    const st = { trigger: view, start: "top 86%", end: "top 34%", scrub: 0.5 };
    gsap.fromTo(view.querySelector(".pv-cs-browser-shot"), { clipPath: "inset(0% 0% 100% 0%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: st,
    });
    gsap.fromTo(view.querySelector(".pv-cs-scan"), { autoAlpha: 1, yPercent: 0 }, {
      yPercent: 100, ease: "none", scrollTrigger: st,
    });
  });

  root.querySelectorAll<HTMLElement>(".pv-cs-phone").forEach((phone) => {
    gsap.fromTo(phone.querySelector(".pv-cs-phone-body"), { yPercent: 16, rotate: 6, autoAlpha: 0 }, {
      yPercent: 0, rotate: 0, autoAlpha: 1, ease: "power2.out",
      scrollTrigger: { trigger: phone, start: "top 96%", end: "top 52%", scrub: 0.5 },
    });
  });

  root.querySelectorAll<HTMLElement>(".pv-cs-mock").forEach((mock) => {
    gsap.fromTo(mock.querySelector(".pv-cs-mock-panel"), { y: 70, scale: 0.965, autoAlpha: 0 }, {
      y: 0, scale: 1, autoAlpha: 1, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: mock, start: "top 84%" },
    });
  });

  root.querySelectorAll<HTMLElement>(".pv-cs-media").forEach((media) => {
    media.querySelectorAll<HTMLElement>(".pv-cs-gl, .pv-cs-product").forEach((img, i) => {
      gsap.fromTo(img, { y: 70 + i * 46 }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "top 30%", scrub: 0.6 },
      });
    });
  });
}
