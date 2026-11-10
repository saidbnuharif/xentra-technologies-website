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
    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2 grid size-11 place-items-center rounded-md text-fg"
      >
        {open ? <X size={24} aria-hidden /> : <Menu size={24} aria-hidden />}
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
