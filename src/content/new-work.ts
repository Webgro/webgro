/**
 * Case studies that carry a "New" tag wherever they are listed: the work page,
 * the case study itself, the client list on the homepage and the "next
 * project" link. Add a slug to tag it, remove it when it stops being new.
 */
export const NEW_WORK: ReadonlySet<string> = new Set(["berrymae", "fleaway"]);

export const isNewWork = (slug: string) => NEW_WORK.has(slug);
