/*
 * The X page transition's hand-off: a section asks for the transition
 * (playXTransition) and the overlay mounted in the root layout
 * (XTransition) runs it and navigates. If no overlay is ready (not
 * mounted, reduced motion, already running) it returns false and the
 * caller lets the link navigate as normal.
 */
export type XTransitionRequest = {
  href: string;
  /** Where the transition grows from (viewport px), e.g. the clicked panel. */
  origin: { x: number; y: number };
};

type Handler = (request: XTransitionRequest) => boolean;
let handler: Handler | null = null;

export function registerXTransition(next: Handler) {
  handler = next;
  return () => {
    if (handler === next) handler = null;
  };
}

export function playXTransition(request: XTransitionRequest) {
  return handler?.(request) ?? false;
}
