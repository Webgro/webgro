"use client";

import { useRef } from "react";
import { SCENE_QUERY, STATIC_QUERY, useGsap } from "../useGsap";

/*
 * The hero image for /care-plans: a site health panel showing the jobs a care
 * plan does each month. It is an illustration, not a real client's figures.
 * The markup is the finished state, which is what reduced motion and no-JS
 * visitors see. The scene resets it, plays one run and settles, restarting
 * when the panel comes back into view.
 */

const PLUGINS = ["WooCommerce", "Yoast SEO", "Contact Form 7", "Akismet Anti-spam"];
const SCORE = 92;
const RING = 2 * Math.PI * 26;

/** Response times for the uptime line, in ms. Fixed so server and client markup match. */
const SEED = [214, 206, 221, 198, 232, 219, 204, 226, 241, 212, 203, 218, 229, 207, 199, 223, 236, 215, 208, 220, 211, 226, 202, 212];
const SW = 240;
const SH = 46;

function linePoints(v: number[]) {
  const step = (SW - 5) / (v.length - 1);
  return v.map((ms, i) => `${(i * step).toFixed(1)},${(SH - 6 - ((ms - 180) / 80) * (SH - 14)).toFixed(1)}`);
}
const areaPath = (pts: string[]) => `M0,${SH} L${pts.join(" L")} L${pts[pts.length - 1].split(",")[0]},${SH} Z`;

function Tick() {
  return (
    <svg className="pv-care-hp-tick" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 8.4l2.9 2.9 6.1-6.6" pathLength={1} />
    </svg>
  );
}

export function HealthPanel() {
  const root = useRef<HTMLElement>(null);
  const initial = linePoints(SEED);
  const last = initial[initial.length - 1].split(",");

  useGsap(root, ({ gsap }) => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const panel = q(".pv-care-hp")[0] as HTMLElement;
    const mm = gsap.matchMedia();

    mm.add(STATIC_QUERY, () => {
      panel.classList.remove("is-scene");
    });

    mm.add(SCENE_QUERY, () => {
      const spark = el.querySelector<SVGSVGElement>(".pv-care-hp-spark")!;
      const line = el.querySelector<SVGPolylineElement>(".pv-care-hp-line")!;
      const area = el.querySelector<SVGPathElement>(".pv-care-hp-area")!;
      const dot = q(".pv-care-hp-dot")[0] as HTMLElement;
      const ms = q(".pv-care-hp-ms")[0] as HTMLElement;
      const backup = q(".pv-care-hp-backup")[0] as HTMLElement;
      const scoreNum = q(".pv-care-hp-score")[0] as HTMLElement;
      const ringArc = el.querySelector<SVGCircleElement>(".pv-care-hp-ring-arc")!;
      const count = q(".pv-care-hp-count")[0] as HTMLElement;
      const rows = (q(".pv-care-hp-plugin") as HTMLElement[]).map((row) => ({
        row,
        bar: row.querySelector(".pv-care-hp-bar-fill") as HTMLElement,
        status: row.querySelector(".pv-care-hp-status") as HTMLElement,
      }));
      const report = q(".pv-care-hp-report")[0] as HTMLElement;
      const reportText = q(".pv-care-hp-report-text")[0] as HTMLElement;

      const values = [...SEED];
      let seconds = 120;
      let n = 0;
      const drawLine = () => {
        const pts = linePoints(values);
        line.setAttribute("points", pts.join(" "));
        area.setAttribute("d", areaPath(pts));
        const [x, y] = pts[pts.length - 1].split(",");
        dot.style.left = `${(+x / SW) * 100}%`;
        dot.style.top = `${(+y / SH) * 100}%`;
        ms.textContent = String(values[values.length - 1]);
      };
      const showBackup = () => {
        const m = Math.floor(seconds / 60);
        backup.textContent = `${m} min ${String(seconds % 60).padStart(2, "0")} s ago`;
      };
      const setCount = (k: number) => { count.textContent = `${k} of ${rows.length} done`; };

      const reset = () => {
        seconds = 120;
        showBackup();
        setCount(0);
        rows.forEach((r) => {
          r.row.classList.remove("is-done", "is-running");
          r.status.textContent = "Waiting";
        });
        gsap.set(rows.map((r) => r.bar), { scaleX: 0 });
        gsap.set(spark, { clipPath: "inset(-10% 100% -10% 0%)" });
        gsap.set(dot, { autoAlpha: 0 });
        gsap.set(ringArc, { strokeDashoffset: RING });
        scoreNum.textContent = "0";
        report.classList.remove("is-done");
        reportText.textContent = "Preparing monthly report";
      };

      const score = { v: 0 };
      const tl = gsap.timeline({ paused: true, onStart: reset });
      tl.fromTo(spark, { clipPath: "inset(-10% 100% -10% 0%)" }, { clipPath: "inset(-10% 0% -10% 0%)", duration: 1.4, ease: "power2.inOut" }, 0.2)
        .to(dot, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, 1.4)
        .fromTo(score, { v: 0 }, {
          v: SCORE, duration: 1.9, ease: "power2.out",
          onUpdate: () => { scoreNum.textContent = String(Math.round(score.v)); },
        }, 0.4)
        .fromTo(ringArc, { strokeDashoffset: RING }, { strokeDashoffset: RING * (1 - SCORE / 100), duration: 1.9, ease: "power2.out" }, 0.4);
      rows.forEach((r, k) => {
        const at = 0.9 + k * 0.85;
        tl.call(() => { r.row.classList.add("is-running"); r.status.textContent = "Updating"; }, [], at)
          .fromTo(r.bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power1.inOut" }, at)
          .call(() => {
            r.row.classList.remove("is-running");
            r.row.classList.add("is-done");
            r.status.textContent = "Updated";
            setCount(k + 1);
          }, [], at + 0.72);
      });
      tl.call(() => {
        report.classList.add("is-done");
        reportText.textContent = "Monthly report ready";
      }, [], 0.9 + rows.length * 0.85 + 0.35);

      // Panel entrance, once. Hidden by CSS until is-ready, so nothing flashes.
      reset();
      panel.classList.add("is-ready");
      gsap.fromTo(panel, { autoAlpha: 0, y: 28, rotationX: 10, transformPerspective: 1200, transformOrigin: "50% 100%" }, {
        autoAlpha: 1, y: 0, rotationX: 0, duration: 1.2, delay: 0.55, ease: "power3.out",
      });

      // The live bits (backup counter, uptime line) tick once a second, but
      // only while the panel is on screen.
      let timer: ReturnType<typeof setInterval> | null = null;
      const tick = () => {
        seconds += 1;
        showBackup();
        if (++n % 2 === 0) {
          const last = values[values.length - 1];
          values.shift();
          values.push(Math.round(Math.max(186, Math.min(252, last + (Math.random() - 0.5) * 34))));
          drawLine();
        }
      };
      let started = false;
      let away = false;
      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          if (!started) { started = true; tl.delay(1).restart(true); }
          else if (away) tl.delay(0.3).restart(true);
          else tl.resume();
          away = false;
          if (timer === null) timer = setInterval(tick, 1000);
        } else {
          away = true;
          tl.pause();
          if (timer !== null) { clearInterval(timer); timer = null; }
        }
      });
      io.observe(panel);

      return () => {
        io.disconnect();
        if (timer !== null) clearInterval(timer);
        tl.kill();
        // Back to the finished markup state.
        values.splice(0, values.length, ...SEED);
        drawLine();
        backup.textContent = "2 minutes ago";
        setCount(rows.length);
        scoreNum.textContent = String(SCORE);
        rows.forEach((r) => {
          r.row.classList.remove("is-running");
          r.row.classList.add("is-done");
          r.status.textContent = "Updated";
        });
        report.classList.add("is-done");
        reportText.textContent = "Monthly report ready";
        panel.classList.remove("is-ready");
      };
    });

    return () => mm.revert();
  });

  return (
    <figure className="pv-care-hp-wrap" ref={root}>
      <div className="pv-care-hp is-scene" aria-hidden="true">
        <div className="pv-care-hp-top">
          <div>
            <p className="pv-care-hp-title">Site health</p>
            <p className="pv-care-hp-site">yoursite.co.uk</p>
          </div>
          <span className="pv-care-hp-chip">WordPress</span>
        </div>

        <div className="pv-care-hp-block">
          <div className="pv-care-hp-head">
            <span className="pv-care-hp-label">Uptime</span>
            <span className="pv-care-hp-up"><span className="pv-care-hp-up-dot" />Up</span>
          </div>
          <div className="pv-care-hp-sparkbox">
            <svg className="pv-care-hp-spark" viewBox={`0 0 ${SW} ${SH}`} preserveAspectRatio="none">
              <path className="pv-care-hp-area" d={areaPath(initial)} />
              <polyline className="pv-care-hp-line" points={initial.join(" ")} />
            </svg>
            <span
              className="pv-care-hp-dot"
              style={{ left: `${(+last[0] / SW) * 100}%`, top: `${(+last[1] / SH) * 100}%` }}
            />
          </div>
          <div className="pv-care-hp-meta">
            <span>Checked every 5 minutes</span>
            <span>Response <span className="pv-care-hp-ms">{SEED[SEED.length - 1]}</span> ms</span>
          </div>
        </div>

        <div className="pv-care-hp-tiles">
          <div className="pv-care-hp-tile">
            <span className="pv-care-hp-label">Last backup</span>
            <span className="pv-care-hp-backup">2 minutes ago</span>
            <span className="pv-care-hp-sub">Daily, kept for 30 days</span>
          </div>
          <div className="pv-care-hp-tile pv-care-hp-speed">
            <span className="pv-care-hp-ring">
              <svg viewBox="0 0 64 64">
                <circle className="pv-care-hp-ring-bg" cx="32" cy="32" r="26" />
                <circle
                  className="pv-care-hp-ring-arc"
                  cx="32" cy="32" r="26"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * (1 - SCORE / 100)}
                />
              </svg>
              <span className="pv-care-hp-score">{SCORE}</span>
            </span>
            <span className="pv-care-hp-speed-text">
              <span className="pv-care-hp-label">Speed score</span>
              <span className="pv-care-hp-sub">Home page</span>
            </span>
          </div>
        </div>

        <div className="pv-care-hp-block pv-care-hp-updates">
          <div className="pv-care-hp-head">
            <span className="pv-care-hp-label">Plugin updates</span>
            <span className="pv-care-hp-count">{PLUGINS.length} of {PLUGINS.length} done</span>
          </div>
          <ul className="pv-care-hp-list">
            {PLUGINS.map((p) => (
              <li className="pv-care-hp-plugin is-done" key={p}>
                <span className="pv-care-hp-name">{p}</span>
                <span className="pv-care-hp-bar"><span className="pv-care-hp-bar-fill" /></span>
                <span className="pv-care-hp-state">
                  <span className="pv-care-hp-status">Updated</span>
                  <Tick />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pv-care-hp-report is-done">
          <svg className="pv-care-hp-doc" viewBox="0 0 20 20">
            <path d="M5 2.5h6.5L15 6v11.5H5z M11.5 2.5V6H15 M7.5 10h5 M7.5 13h5" />
          </svg>
          <span className="pv-care-hp-report-text">Monthly report ready</span>
          <Tick />
        </div>
      </div>
    </figure>
  );
}
