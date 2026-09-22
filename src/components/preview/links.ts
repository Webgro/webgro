/**
 * Internal links used to be rewritten to sit under /preview while the redesign
 * was browsable alongside the old site. The redesign is now the site, so this
 * is the identity function: pv("/work") is "/work". It stays because every page
 * calls it, and because it is the one place to change if the whole site ever
 * needs to move under a prefix again.
 */
export const pv = (path: string) => path;
