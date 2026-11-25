"use client";

import { ArrowUp } from "lucide-react";

/**
 * Footer "Back to top": smooth scroll (instant with reduced motion), then
 * focus the header's home link so keyboard users start from the top too.
 * Without JavaScript the #main anchor still jumps up the page.
 */
export function BackToTop() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.querySelector<HTMLElement>("[data-site-header] a")?.focus({ preventScroll: true });
      }}
      className="group inline-flex min-h-11 items-center gap-2.5 text-sm text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
    >
      Back to top
      <span className="grid size-8 place-items-center rounded-full border border-line transition-[border-color,box-shadow] duration-300 group-hover:border-blue-400/60 group-hover:shadow-[0_0_14px_-2px_rgb(47_107_255/0.7)]">
        <ArrowUp aria-hidden size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
      </span>
    </a>
  );
}
