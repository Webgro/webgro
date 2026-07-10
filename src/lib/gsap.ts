/**
 * Single source of truth for gsap + ScrollTrigger.
 *
 * Every component that wants ScrollTrigger imports from this module.
 * Importing it triggers gsap.registerPlugin(ScrollTrigger) as a
 * side effect at module load time, on the client only.
 *
 * Why: the previous pattern registered ScrollTrigger inside
 * LenisProvider's deferred requestIdleCallback. Any component whose
 * useIsomorphicLayoutEffect ran BEFORE that idle callback fired
 * (usually every page that mounts an animated component quickly)
 * would crash inside ScrollTrigger.batch, which internally calls
 * gsap.delayedCall (added by the plugin registration).
 *
 * Registering here means the same import chain that gives you
 * ScrollTrigger also guarantees it's wired to gsap. No timing
 * dependencies, no race conditions, works during SSR (register call
 * is guarded by the window check).
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
export default gsap;
