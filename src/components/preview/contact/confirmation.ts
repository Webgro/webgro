/**
 * Brings a form's confirmation into view and moves keyboard focus to it, so
 * nobody who was scrolled down the form when they pressed send is left looking
 * at the space where it used to be.
 *
 * The move is instant, like every other programmatic scroll on the site (the
 * sent state in ContactTop, the field jumps in EnquiryFlow and CharityApply).
 * A smooth window scroll fights Lenis, and prefers-reduced-motion asks for a
 * jump rather than an animation, so one instant move is right either way.
 *
 * Focus is set with preventScroll so the browser doesn't undo the position.
 * A second pass on the next frame settles anything Lenis carried over from
 * momentum that was still running when the form was sent, and the scroll event
 * lets the shell re-read the page colour now the section has changed.
 *
 * Returns a cleanup that cancels the queued frame.
 */
export function revealConfirmation(
  panel: HTMLElement | null,
  focusTarget: HTMLElement | null,
  /** Room to leave above the panel, for example for the fixed nav. */
  offset = 0,
): () => void {
  const jump = () => {
    if (!panel) return;
    const top = Math.max(0, panel.getBoundingClientRect().top + window.scrollY - offset);
    if (Math.abs(window.scrollY - top) > 1) window.scrollTo({ top, left: 0, behavior: "instant" });
  };

  jump();
  focusTarget?.focus({ preventScroll: true });

  const frame = requestAnimationFrame(() => {
    jump();
    window.dispatchEvent(new Event("scroll"));
  });

  return () => cancelAnimationFrame(frame);
}
