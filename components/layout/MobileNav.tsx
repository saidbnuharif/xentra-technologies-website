"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import type { NavItem } from "@/lib/content";

type MobileNavProps = {
  items: readonly NavItem[];
  /** Server-rendered call to action shown at the foot of the panel. */
  cta?: ReactNode;
};

/** Client component: holds open/closed state for the small-screen menu. */
export function MobileNav({ items, cta }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Focus would otherwise stay on a link inside the now-hidden panel.
      toggleRef.current?.focus();
    };
    // Close if the viewport grows past the lg breakpoint (e.g. rotation),
    // so the menu is not left open-but-hidden behind the desktop nav.
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    // A tap or click anywhere outside the menu (and its button) closes it.
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    // Lock page scrolling behind the open menu. Padding replaces the
    // scrollbar's width (when there is one) so the page does not shift.
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const previous = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      html.style.overflow = previous.overflow;
      html.style.paddingRight = previous.paddingRight;
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  // Both icons stay mounted and cross-fade with a slight rotation.
  const icon = "absolute transition-[opacity,rotate,scale] duration-300 ease-out";

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="relative -mr-2 grid size-11 place-items-center rounded-md text-fg"
      >
        <Menu
          size={24}
          aria-hidden
          className={`${icon} ${open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
        />
        <X
          size={24}
          aria-hidden
          className={`${icon} ${open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"}`}
        />
      </button>

      {/*
        Always rendered so it can animate (CSS transitions only). `inert`
        removes the closed panel from tab order and the accessibility tree,
        exactly as `hidden` did. Links follow with a short CSS stagger.
      */}
      <div
        id={panelId}
        inert={!open}
        data-open={open}
        className="group/menu invisible absolute inset-x-0 top-full max-h-[calc(100svh-var(--xt-nav-height))] -translate-y-2 overflow-y-auto overscroll-contain border-b border-line bg-black opacity-0 transition-[opacity,translate,visibility] duration-300 ease-out data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100"
      >
        <nav aria-label="Mobile" className="px-gutter pt-2">
          <ul>
            {items.map((item, index) => (
              <li
                key={item.id}
                style={{ transitionDelay: open ? `${60 + index * 35}ms` : "0ms" }}
                className="translate-y-2 border-b border-line opacity-0 transition-[opacity,translate] duration-300 ease-out group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100"
              >
                <a
                  href={`#${item.id}`}
                  data-nav-link
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center gap-3 text-lg font-medium text-fg-muted transition-colors aria-[current=location]:text-fg"
                >
                  <span
                    aria-hidden
                    className="h-px w-0 bg-accent transition-all duration-300 [[aria-current=location]>&]:w-4"
                  />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {cta ? <div className="px-gutter py-6">{cta}</div> : null}
      </div>
    </div>
  );
}
