import type { CSSProperties, ReactNode, Ref } from "react";
import "./bespoke.css";

/**
 * Shared pieces for the bespoke software mockups: the 16:10 frame, a small
 * line-icon set, and the Fun Cases Hub shell (dark icon rail plus the light
 * sidebar). All sample data in these mockups is invented.
 */

/** The outer box. Named for screen readers; everything drawn inside is hidden from them. */
export function Frame({
  label,
  loopRef,
  className = "",
  children,
}: {
  label: string;
  loopRef?: Ref<HTMLDivElement>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div ref={loopRef} role="img" aria-label={label} className="bm">
      <div aria-hidden="true" className={`bm-c ${className}`}>
        {children}
      </div>
    </div>
  );
}

const ICONS = {
  box: "M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5 12 12l8.5-4.5M12 12v9",
  truck: "M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  printer: "M7 8V3.5h10V8M7 17H4.5a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 4.5 8h15A1.5 1.5 0 0 1 21 9.5v6a1.5 1.5 0 0 1-1.5 1.5H17M7 14h10v6.5H7z",
  undo: "M8 5 3.5 9.5 8 14M3.5 9.5H14a6 6 0 0 1 0 12h-3",
  image: "M4 4.5h16v15H4zM4 16l4.5-4.5 4 4 3-3L20 17M9 9.5a1 1 0 1 0 0-.01",
  crop: "M7 2.5V17h14.5M2.5 7H17v14.5",
  sparkles: "M10 3.5l1.8 4.7 4.7 1.8-4.7 1.8L10 16.5l-1.8-4.7L3.5 10l4.7-1.8zM18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z",
  chat: "M4 5h16v11H11l-4.5 3.5V16H4z",
  split: "M4 12h6M10 12c3 0 3-6 6-6h4M10 12c3 0 3 6 6 6h4M17.5 3.5 20 6l-2.5 2.5M17.5 15.5 20 18l-2.5 2.5",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.2a6.5 6.5 0 0 1 3.5 5.8",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20.5 20.5",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2",
  check: "M4.5 12.5 9.5 17.5 19.5 6.5",
  chevron: "M9 5l7 7-7 7",
  eye: "M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  bell: "M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  tag: "M3.5 3.5h8l9 9-8 8-9-9zM8 8h.01",
  calendar: "M4 5.5h16v15H4zM4 10h16M8 3v4M16 3v4",
  chart: "M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
  pound: "M8 20h9M9 20c1.5-2 1-4 .5-6.500-.7-3.500-.5-8 4-8 1.800 0 3 .8 3.500 2M7 13.500h7",
  home: "M3.5 11 12 4l8.5 7M6 9.5V20h12V9.5",
  link: "M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1",
  mail: "M3.5 5.500h17v13h-17zM3.500 6.500 12 13l8.500-6.500",
  shield: "M12 3l7.500 3v6c0 4.500-3 7.500-7.500 9-4.500-1.500-7.500-4.500-7.500-9V6z",
  pin: "M12 21s6.500-6 6.500-11a6.500 6.500 0 0 0-13 0c0 5 6.500 11 6.500 11zM12 12.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5z",
  plus: "M12 5v14M5 12h14",
  refresh: "M20 5v5h-5M4 19v-5h5M19.500 10A8 8 0 0 0 5.500 7.500M4.500 14a8 8 0 0 0 14 2.500",
  scan: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 9v6M11 9v6M14 9v6M17 9v6",
  logout: "M9 4H4.500v16H9M14 8l4 4-4 4M18 12H9",
  wrench: "M14.500 6.500a4.500 4.500 0 0 0-5.800 5.800L3.500 17.500l3 3 5.200-5.200a4.500 4.500 0 0 0 5.800-5.800L14.500 12.500 11.500 9.500z",
  bolt: "M13 2.500 5 13.500h6l-1 8 8-11h-6z",
  pen: "M4 20l1-4.500L16.500 4l3.500 3.500L8.500 19zM14 6.500l3.500 3.500",
  share: "M12 15V4M8 8l4-4 4 4M5 13v7h14v-7",
  keyboard: "M3 6.500h18v11H3zM7 10.500h.01M11 10.500h.01M15 10.500h.01M8 14h8",
  move: "M4 12h16M15 7l5 5-5 5",
  book: "M5 4h13v16H5zM9 4v16M12 9h3",
  layers: "M12 3.500 3 8.500l9 5 9-5zM3 13l9 5 9-5",
  star: "M12 3.500l2.600 5.400 5.900.800-4.300 4.100 1.100 5.900L12 16.900 6.700 19.700l1.100-5.900L3.500 9.700l5.900-.800z",
  video: "M3.500 6.500h12v11h-12zM15.500 10.500l5-3v9l-5-3",
  pause: "M8 5v14M16 5v14",
  database: "M4.500 6c0-1.700 3.400-3 7.500-3s7.500 1.300 7.500 3-3.400 3-7.500 3-7.500-1.300-7.500-3zM4.500 6v12c0 1.700 3.400 3 7.500 3s7.500-1.300 7.500-3V6M4.500 12c0 1.700 3.400 3 7.500 3s7.500-1.300 7.500-3",
} as const;

export type IconName = keyof typeof ICONS;

export function Ico({ n, style }: { n: IconName; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={ICONS[n]} />
    </svg>
  );
}

/* ── Fun Cases Hub shell ──────────────────────────────────────────────── */

const RAIL: { key: string; label: string; icon: IconName }[] = [
  { key: "stock", label: "Stock", icon: "box" },
  { key: "shipping", label: "Shipping", icon: "truck" },
  { key: "print", label: "Print", icon: "printer" },
  { key: "returns", label: "Returns", icon: "undo" },
  { key: "content", label: "Content", icon: "image" },
  { key: "resizer", label: "Resizer", icon: "crop" },
  { key: "products", label: "Products", icon: "sparkles" },
  { key: "service", label: "Service", icon: "chat" },
];

export type HubLink = { label: string; icon: IconName; on?: boolean; count?: number };
export type HubSection = { title?: string; links: HubLink[] };

export function HubShell({
  rail,
  workspace,
  nav,
  mainClass = "",
  children,
}: {
  rail: string;
  workspace: string;
  nav: HubSection[];
  mainClass?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="bm-rail">
        {RAIL.map((r) => (
          <div key={r.key} className={`bm-rail-i ${r.key === rail ? "is-on" : ""}`}>
            <div className="bm-rail-t">
              <Ico n={r.icon} />
              {r.key === "service" && <span className="bm-rail-b">7</span>}
            </div>
            <span className="bm-rail-c">{r.label}</span>
          </div>
        ))}
        <div className="bm-rail-f">
          <Ico n="users" />
          <Ico n="gear" />
        </div>
      </div>
      <div className="bm-side">
        <div className="bm-logo">Fun Cases</div>
        <div className="bm-ws">{workspace}</div>
        {nav.map((s, i) => (
          <div key={i} className="bm-col">
            {s.title && <div className="bm-sec">{s.title}</div>}
            {s.links.map((l) => (
              <div key={l.label} className={`bm-lk ${l.on ? "is-on" : ""}`}>
                <Ico n={l.icon} />
                <span className="bm-trunc">{l.label}</span>
                {l.count !== undefined && <span className="bm-lk-n">{l.count}</span>}
              </div>
            ))}
          </div>
        ))}
        <div className="bm-user">
          <span className="bm-av">ST</span>
          <span className="bm-user-t bm-trunc">
            Sam T.<span>Editor</span>
          </span>
        </div>
      </div>
      <div className={`bm-main ${mainClass}`}>{children}</div>
    </>
  );
}

/** Stock workspace sidebar, cropped to the sections a mockup needs. */
export function stockNav(active: string, parts: ("actions" | "manage" | "planning" | "admin")[]): HubSection[] {
  const all: Record<string, HubSection> = {
    actions: {
      title: "Actions",
      links: [
        { label: "Dashboard", icon: "home" },
        { label: "Adjust Stock", icon: "pen" },
        { label: "Book In", icon: "plus" },
        { label: "Move Stock", icon: "move" },
        { label: "Find Stock", icon: "search" },
        { label: "Pick Orders", icon: "scan" },
        { label: "Stock Takes", icon: "list" },
      ],
    },
    manage: {
      title: "Manage",
      links: [
        { label: "SKUs", icon: "tag" },
        { label: "Locations", icon: "pin" },
        { label: "Inventory", icon: "layers" },
        { label: "Movement History", icon: "clock" },
      ],
    },
    planning: {
      title: "Planning",
      links: [
        { label: "Overview", icon: "grid" },
        { label: "SKU planning", icon: "tag" },
        { label: "Cover", icon: "calendar" },
        { label: "Forecast accuracy", icon: "chart" },
        { label: "Movement report", icon: "file" },
        { label: "Purchase orders", icon: "box" },
      ],
    },
    admin: {
      title: "Admin",
      links: [
        { label: "Analytics", icon: "chart" },
        { label: "Timekeeping", icon: "clock" },
        { label: "Backups", icon: "database" },
      ],
    },
  };
  return parts.map((p) => ({
    title: all[p].title,
    links: all[p].links.map((l) => ({ ...l, on: `${p}:${l.label}` === active })),
  }));
}

/* ── Drawn stand-ins for pictures ─────────────────────────────────────── */

const PATTERNS = [
  "radial-gradient(circle, #161616 0 20%, transparent 22%) 0 0 / 0.55em 0.55em #ffc933",
  "repeating-linear-gradient(135deg, #ff7bb2 0 0.28em, #fff8ec 0 0.56em)",
  "conic-gradient(#35bdf2 25%, #fff 0 50%, #35bdf2 0 75%, #fff 0) 0 0 / 0.7em 0.7em",
  "radial-gradient(circle, #fff 0 16%, transparent 18%) 0 0 / 0.5em 0.5em #8a4fd3",
  "repeating-linear-gradient(0deg, #58bb46 0 0.25em, #dff5d8 0 0.5em)",
  "radial-gradient(circle, #fff8ec 0 24%, transparent 26%) 0 0 / 0.75em 0.75em #f03e2e",
  "linear-gradient(160deg, #3d6be0, #35bdf2)",
  "repeating-linear-gradient(90deg, #ff8a26 0 0.25em, #ffc933 0 0.5em)",
];
const GROUNDS = ["#dff3fd", "#fff1c9", "#ffe3ef", "#e9defa", "#dff5d8", "#ffe6d2"];
const SOLIDS = ["#35bdf2", "#ffc933", "#ff7bb2", "#8a4fd3", "#58bb46", "#f03e2e", "#3d6be0", "#ff8a26"];

/** A small drawn picture: a patterned phone case on a tint, or a text graphic. */
export function Art({ k, kind = "case", style }: { k: number; kind?: "case" | "text" | "auto"; style?: CSSProperties }) {
  const isText = kind === "text" || (kind === "auto" && k % 3 === 0);
  const vars = isText
    ? { "--a": SOLIDS[k % SOLIDS.length], "--b": k % 2 ? "#161616" : "#fff" }
    : { "--a": GROUNDS[k % GROUNDS.length], "--b": PATTERNS[k % PATTERNS.length] };
  return <span className={`bm-art ${isText ? "bm-art--text" : ""}`} style={{ ...(vars as CSSProperties), ...style }} />;
}
