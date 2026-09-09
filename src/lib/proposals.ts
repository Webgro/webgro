/**
 * Shared config for the /proposals password gate. The middleware checks
 * the cookie, the unlock API sets it, the unlock page renders the form.
 * One password for all client proposals; rotate it here.
 */
export const PROPOSALS_PASSWORD = "Webgro!";
export const PROPOSALS_COOKIE = "wg_proposals";
/** Opaque value stored in the cookie once unlocked (not the password). */
export const PROPOSALS_TOKEN = "u8Qm3kXf51pTzRcViJ0wYhN7bAgEsLdD";
