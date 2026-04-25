import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * React warns when useLayoutEffect runs during SSR. This helper lets
 * components run effects synchronously after DOM commit but before
 * browser paint on the client, which is exactly what GSAP's
 * gsap.set/initial-state pattern needs to avoid a flash of
 * SSR-rendered content before the animation's "from" state is applied.
 *
 * On the server, the body of the effect never runs (no useEffect or
 * useLayoutEffect runs during render-to-string anyway), so the
 * runtime branch here is purely about silencing the warning.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
