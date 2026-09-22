import { Closing } from "../Closing";
import { PreviewShell } from "../PreviewShell";
import { Contents } from "./Contents";
import { Masthead } from "./Masthead";
import type { ArticleSummary } from "./lines";
import "./journal.css";

/** The Gro index: a masthead and cover story, then the full contents page. */
export function JournalIndex({ articles }: { articles: ArticleSummary[] }) {
  return (
    <PreviewShell initialTheme="paper">
      {articles.length > 0 && <Masthead lead={articles[0]} />}
      <Contents articles={articles} />
      <Closing />
    </PreviewShell>
  );
}
