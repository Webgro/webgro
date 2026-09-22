import type { Metadata } from "next";
import { PAGE_META, pageMeta } from "@/components/preview/seo";
import { caseStudies, categoryLabel } from "@/content/work";
import { WorkView } from "@/components/preview/work/WorkView";
import { workExtras, workImage, type WorkItem } from "@/components/preview/work/data";

export const metadata: Metadata = pageMeta({ ...PAGE_META.work, path: "/work" });

export default function PreviewWorkPage() {
  // Only the fields the index needs cross into the client bundle, so the long
  // case study bodies in work.ts stay on the server.
  const items: WorkItem[] = caseStudies.map((c) => {
    const extra = workExtras[c.slug];
    return {
      slug: c.slug,
      client: c.client,
      tag: c.tag,
      year: c.year,
      categories: c.categories,
      imgLg: extra ? workImage(c.slug, "lg") : c.heroImage,
      imgSm: extra ? workImage(c.slug, "sm") : c.heroImage,
      w: extra?.w ?? 1600,
      h: extra?.h ?? 1055,
      blurb: extra?.blurb ?? c.excerpt,
      figure: extra?.figure,
    };
  });

  return <WorkView items={items} labels={categoryLabel} />;
}
