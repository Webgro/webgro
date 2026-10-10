import { isNewWork } from "@/content/new-work";

/** The small "New" tag beside a recently added case study. Renders nothing for the rest. */
export function NewTag({ slug }: { slug: string }) {
  if (!isNewWork(slug)) return null;
  return <span className="pv-new">New</span>;
}
