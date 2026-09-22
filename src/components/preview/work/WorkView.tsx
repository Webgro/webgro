import type { Category } from "@/content/work";
import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import type { WorkItem } from "./data";
import { WorkIndex } from "./WorkIndex";
import { WorkOutro } from "./WorkOutro";

export function WorkView({ items, labels }: { items: WorkItem[]; labels: Record<Category, string> }) {
  return (
    <PreviewShell initialTheme="ink">
      <WorkIndex items={items} labels={labels} />
      <WorkOutro />
      <Closing />
    </PreviewShell>
  );
}
