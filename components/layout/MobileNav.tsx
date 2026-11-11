"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { NavItem, PageKey } from "@/lib/content";

type MobileNavProps = {
  items: readonly NavItem[];
  /** Current page, marked aria-current="page". */
  current: PageKey | null;
  /** Server-rendered call to action shown at the foot of the panel. */
  cta?: ReactNode;
};

/** Client component: holds open/closed state for the small-screen menu. */
export function MobileNav({ items, current, cta }: MobileNavProps) {
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
        className="group/menu invisible absolute inset-x-0 top-full flex h-[calc(100svh-var(--xt-nav-height))] -translate-y-2 flex-col overflow-y-auto overscroll-contain bg-black bg-[radial-gradient(80%_45%_at_100%_0%,rgb(47_107_255/0.16),transparent_70%),radial-gradient(70%_40%_at_0%_100%,rgb(47_107_255/0.1),transparent_70%)] opacity-0 transition-[opacity,translate,visibility] duration-300 ease-out data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:opacity-100"
      >
        <nav aria-label="Mobile" className="px-gutter pt-4">
          <ul>
            {items.map((item, index) => (
              <li
                key={item.key}
                style={{ transitionDelay: open ? `${60 + index * 35}ms` : "0ms" }}
                className="translate-y-2 border-b border-line opacity-0 transition-[opacity,translate] duration-300 ease-out group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100"
              >
                <Link
                  href={item.href}
                  aria-current={item.key === current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="group/item flex min-h-16 items-center gap-4 text-2xl font-semibold tracking-tight text-fg-muted transition-colors active:text-fg aria-[current=page]:text-fg"
                >
                  <span aria-hidden className="w-6 font-mono text-label font-medium text-fg-muted/70 group-aria-[current=page]/item:text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="group-aria-[current=page]/item:text-accent-gradient">{item.label}</span>
                  <ArrowUpRight
                    aria-hidden
                    size={20}
                    className="ml-auto text-fg-muted/60 transition-[color,translate] duration-300 group-active/item:translate-x-0.5 group-active/item:-translate-y-0.5 group-aria-[current=page]/item:text-accent"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {cta ? <div className="mt-auto px-gutter pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">{cta}</div> : null}
      </div>
    </div>
  );
}
