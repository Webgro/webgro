import type { CaseBlock, CaseStudy } from "@/content/work";
import { headlineFigures } from "./summaries";

/**
 * Turns the flat list of CaseBlocks into a journey with a spine:
 * background, then acts (one per chapter, or a single "approach" act when a
 * case study has no chapters), then the outcome. Inside an act, each text
 * section keeps the media that illustrates it, and results / comparisons
 * become their own moments.
 */

export type BlockOf<T extends CaseBlock["type"]> = Extract<CaseBlock, { type: T }>;
export type MediaBlock = BlockOf<"image" | "product" | "browser" | "phone" | "uiMock" | "split" | "gallery">;
export type Figure = { value: string; label: string; eyebrow?: string; footnote?: string };
export type Theme = "paper" | "ink";

export type Beat =
  | { kind: "text"; id: string; section: BlockOf<"section">; media: MediaBlock[] }
  | { kind: "media"; media: MediaBlock[] }
  | { kind: "results"; figures: Figure[]; lead: boolean }
  | { kind: "lighthouse"; block: BlockOf<"lighthouseScores"> }
  | { kind: "wipe"; block: BlockOf<"beforeAfter"> }
  | { kind: "sideBySide"; block: BlockOf<"beforeAfterStacked"> }
  | { kind: "quote"; block: BlockOf<"quote"> }
  | { kind: "aside"; text: string };

export type Act = {
  id: string;
  label: string;
  description?: string;
  beats: Beat[];
  /** Section headings inside the act, shown as a short contents list. */
  contents: Array<{ id: string; heading: string }>;
  theme: Theme;
};

export type Segment = { id: string; label: string };

export type Journey = {
  intro: string | null;
  prelude: Beat[];
  acts: Act[];
  /** True when the case study has no chapter blocks: problem, approach, outcome. */
  arc: boolean;
  /** Results pulled out of the approach act in arc mode, shown in the outcome. */
  outcomeBeats: Beat[];
  deliverables: BlockOf<"deliverables">[];
  figures: Figure[];
  headline: Figure[];
  segments: Segment[];
  backgroundTheme: Theme;
};

const MEDIA_TYPES = new Set<CaseBlock["type"]>(["image", "product", "browser", "phone", "uiMock", "split", "gallery"]);
const isMedia = (b: CaseBlock): b is MediaBlock => MEDIA_TYPES.has(b.type);

function figuresOf(block: CaseBlock): Figure[] {
  switch (block.type) {
    case "heroStat":
      return [{ value: block.value, label: block.label, eyebrow: block.eyebrow, footnote: block.footnote }];
    case "statGroup":
      return block.items;
    case "stats":
      return block.items.map((s) => ({ value: s.value, label: s.label }));
    case "lighthouseScores":
      return block.scores.map((s) => ({
        value: String(s.after),
        label: `up from ${s.before}`,
        eyebrow: `Lighthouse ${s.label}`,
      }));
    default:
      return [];
  }
}

function toBeats(blocks: CaseBlock[], prefix: string): Beat[] {
  const beats: Beat[] = [];
  let n = 0;
  for (const block of blocks) {
    const last = beats[beats.length - 1];
    if (isMedia(block)) {
      if (last && (last.kind === "text" || last.kind === "media")) last.media.push(block);
      else beats.push({ kind: "media", media: [block] });
      continue;
    }
    switch (block.type) {
      case "section":
        n += 1;
        beats.push({ kind: "text", id: `${prefix}-${n}`, section: block, media: [] });
        break;
      case "heroStat":
        beats.push({ kind: "results", figures: figuresOf(block), lead: true });
        break;
      case "statGroup":
      case "stats":
        beats.push({ kind: "results", figures: figuresOf(block), lead: false });
        break;
      case "lighthouseScores":
        beats.push({ kind: "lighthouse", block });
        break;
      case "beforeAfter":
        beats.push({ kind: "wipe", block });
        break;
      case "beforeAfterStacked":
        beats.push({ kind: "sideBySide", block });
        break;
      case "quote":
        beats.push({ kind: "quote", block });
        break;
      case "intro":
        beats.push({ kind: "aside", text: block.text });
        break;
      default:
        break;
    }
  }
  return beats;
}

const contentsOf = (beats: Beat[]) =>
  beats.flatMap((b) => (b.kind === "text" ? [{ id: b.id, heading: b.section.heading }] : []));

export function buildJourney(cs: CaseStudy): Journey {
  const body = cs.body.filter((b) => b.type !== "deliverables");
  const deliverables = cs.body.filter((b): b is BlockOf<"deliverables"> => b.type === "deliverables");

  const introIndex = body.findIndex((b) => b.type === "intro");
  const introBlock = introIndex === -1 ? null : (body[introIndex] as BlockOf<"intro">);
  const rest = body.filter((_, i) => i !== introIndex);

  const firstChapter = rest.findIndex((b) => b.type === "chapter");
  const arc = firstChapter === -1;

  let prelude: Beat[] = [];
  let outcomeBeats: Beat[] = [];
  const rawActs: Array<Omit<Act, "theme">> = [];

  if (arc) {
    const beats = toBeats(rest, "approach");
    const isOutcome = (b: Beat) => b.kind === "results" || b.kind === "lighthouse";
    outcomeBeats = beats.filter(isOutcome);
    const approach = beats.filter((b) => !isOutcome(b));
    rawActs.push({ id: "approach", label: "The approach", beats: approach, contents: contentsOf(approach) });
  } else {
    prelude = toBeats(rest.slice(0, firstChapter), "background");
    let current: { chapter: BlockOf<"chapter">; blocks: CaseBlock[] } | null = null;
    const flush = () => {
      if (!current) return;
      const beats = toBeats(current.blocks, current.chapter.id);
      rawActs.push({
        id: current.chapter.id,
        label: current.chapter.label,
        description: current.chapter.description,
        beats,
        contents: contentsOf(beats),
      });
    };
    for (const block of rest.slice(firstChapter)) {
      if (block.type === "chapter") {
        flush();
        current = { chapter: block, blocks: [] };
      } else {
        current?.blocks.push(block);
      }
    }
    flush();
  }

  // Paper and ink alternate all the way down, and always land on an ink
  // outcome followed by a paper handoff into the blue closing section.
  const backgroundTheme: Theme = rawActs.length % 2 ? "ink" : "paper";
  const acts: Act[] = rawActs.map((a, i) => ({
    ...a,
    theme: (i % 2 === 0) === (backgroundTheme === "paper") ? "ink" : "paper",
  }));

  const figures = cs.body.flatMap(figuresOf);

  const wanted = headlineFigures[cs.slug];
  let headline: Figure[] = [];
  if (wanted) {
    headline = wanted.flatMap((key) => {
      const f = figures.find((x) => x.value === key || x.eyebrow === key);
      return f ? [f] : [];
    });
  }
  if (headline.length === 0) headline = figures.filter((f) => /\d/.test(f.value)).slice(0, 3);
  if (headline.length === 0 && /\d/.test(cs.timeline)) {
    headline = [{ value: cs.timeline, label: "Timeline" }];
  }

  const segments: Segment[] = [
    { id: "background", label: "Background" },
    ...acts.map((a) => ({ id: a.id, label: a.label })),
    { id: "outcome", label: "Results" },
  ];

  return {
    intro: introBlock?.text ?? null,
    prelude,
    acts,
    arc,
    outcomeBeats,
    deliverables,
    figures,
    headline,
    segments,
    backgroundTheme,
  };
}

/** Every image path a case study refers to, so the server can check them. */
export function collectSources(cs: CaseStudy): string[] {
  const out = new Set<string>();
  const add = (s?: string) => { if (s) out.add(s); };
  add(cs.heroImage);
  for (const b of cs.body) {
    switch (b.type) {
      case "section":
        add(b.phone?.src);
        break;
      case "image":
      case "product":
      case "phone":
        add(b.src);
        break;
      case "browser":
        add(b.src);
        add(b.phone?.src);
        break;
      case "split":
        add(b.left.src);
        add(b.right.src);
        break;
      case "beforeAfter":
      case "beforeAfterStacked":
        add(b.before.src);
        add(b.after.src);
        break;
      case "gallery":
        b.images.forEach((i) => add(i.src));
        break;
      default:
        break;
    }
  }
  return [...out];
}

/** Splits "+300%" into a countable number and the text around it. */
export function parseFigure(value: string) {
  const m = value.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m || m[1].includes("#")) return null;
  const raw = m[2].replace(/,/g, "");
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { prefix: m[1], end: parseFloat(raw), decimals, suffix: m[3], grouped: m[2].includes(",") };
}

/** Tailwind aspect classes in the content ("aspect-[16/10]") become CSS aspect-ratio values. */
export function aspectOf(cls: string | undefined, fallback: string): string {
  if (!cls) return fallback;
  const m = cls.match(/aspect-\[(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\]/);
  if (m) return `${m[1]} / ${m[2]}`;
  if (cls.includes("aspect-square")) return "1 / 1";
  if (cls.includes("aspect-video")) return "16 / 9";
  return fallback;
}
