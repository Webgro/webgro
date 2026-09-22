import type { Metadata } from "next";
import { PreviewShell } from "@/components/preview/PreviewShell";
import { NotFoundView } from "@/components/preview/legal/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found · Webgro",
  robots: { index: false, follow: false },
};

/**
 * Custom 404. Lands any request that does not match a route (and is not caught
 * by the redirect table in next.config.ts or the .htaccess), and also anything
 * that calls notFound(), which every dynamic route does for a slug it does not
 * know.
 */
export default function NotFound() {
  return (
    <PreviewShell initialTheme="paper">
      <NotFoundView />
    </PreviewShell>
  );
}
