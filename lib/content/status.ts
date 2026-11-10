/**
 * Content status model.
 *
 * Every piece of site copy is either `approved` (signed off by Xentra) or
 * `draft` (temporary, written for review). Drafts and placeholders are shown,
 * clearly marked, only when `showDrafts` is true:
 *   - always during `next dev`
 *   - in a build made with XENTRA_SHOW_DRAFTS=true (review builds)
 * A normal production build drops every draft automatically, so placeholder
 * copy can never be published by accident.
 */

export type ContentStatus = "approved" | "draft";

export type Copy = {
  readonly text: string;
  readonly status: ContentStatus;
};

export const approved = (text: string): Copy => ({ text, status: "approved" });
export const draft = (text: string): Copy => ({ text, status: "draft" });

export const showDrafts =
  process.env.NODE_ENV !== "production" ||
  process.env.XENTRA_SHOW_DRAFTS === "true";

/** True when this copy may be rendered in the current build. */
export function isVisible(copy: Copy | null | undefined): copy is Copy {
  if (!copy) return false;
  return copy.status === "approved" || showDrafts;
}

/** Filters a list down to the entries renderable in the current build. */
export function visibleOnly<T extends { status: ContentStatus }>(
  items: readonly T[],
): T[] {
  return items.filter((item) => item.status === "approved" || showDrafts);
}
