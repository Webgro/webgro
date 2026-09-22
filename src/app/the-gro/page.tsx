import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import { JournalIndex } from "@/components/preview/journal/JournalIndex";
import { summarise } from "@/components/preview/journal/lines";
import { articles } from "@/content/the-gro";

export const metadata: Metadata = pageMeta({ ...PAGE_META.journal, path: "/the-gro" });

export default function PreviewTheGroPage() {
  return <JournalIndex articles={articles.map(summarise)} />;
}
