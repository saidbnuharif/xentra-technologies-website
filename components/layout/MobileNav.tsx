"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NavItem, PageKey } from "@/lib/content";

type MobileNavProps = {
  items: readonly NavItem[];
  /** Current page, marked aria-current="page". */
  current: PageKey | null;
  /** Server-rendered call to action shown at the foot of the panel. */
  cta?: ReactNode;
};

/*
 * Small-screen menu: an animated menu button (three lines that fold into
 * an X) and a glass dropdown that unfolds from under the bar — frosted
 * midnight navy, thin blue-violet edge (opaque: a blur cannot reach
 * through the already-blurred bar it hangs from) — with the links arriving in a
 * short stagger. Behaviour as before: Escape and a tap outside close it
 * (focus returns to the button), it closes at the desktop breakpoint, page
 * scrolling is locked while it is open, and the closed panel is `inert`.
 * CSS transitions only; reduced motion: no movement, just a fade.
 */
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

  // Three lines that fold into an X.
  const line = "absolute left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-current transition-[top,rotate,opacity,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        data-open={open}
        className="group/burger relative grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.06)] transition-[border-color,background-color,box-shadow] duration-300 hover:border-blue-300/40 data-[open=true]:border-blue-300/50 data-[open=true]:bg-blue-500/10 data-[open=true]:shadow-[0_0_20px_-6px_rgb(90_139_255/0.8)]"
      >
        <span aria-hidden className="relative block size-5">
          <span className={`${line} top-[4px] group-data-[open=true]/burger:top-[9px] group-data-[open=true]/burger:rotate-45`} />
          <span className={`${line} top-[9px] group-data-[open=true]/burger:w-0 group-data-[open=true]/burger:opacity-0`} />
          <span className={`${line} top-[14px] group-data-[open=true]/burger:top-[9px] group-data-[open=true]/burger:-rotate-45`} />
        </span>
      </button>

      {/*
        Always rendered so it can animate (CSS transitions only). `inert`
        removes the closed panel from tab order and the accessibility tree.
      */}
      <div
        id={panelId}
        inert={!open}
        data-open={open}
        className="group/menu invisible absolute inset-x-3 top-[calc(100%+0.5rem)] flex max-h-[calc(100svh-var(--xt-nav-height)-1.25rem)] origin-top -translate-y-2 scale-[0.97] flex-col overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#070c22] bg-[linear-gradient(160deg,#10193e,#060a1c_55%,#1c1442)] opacity-0 shadow-[0_30px_70px_-20px_rgb(0_0_0/0.9),0_0_50px_-20px_rgb(90_110_255/0.55),inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl transition-[opacity,translate,scale,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[open=true]:visible data-[open=true]:translate-y-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100"
      >
        {/* Thin blue-violet top edge. */}
        <span aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,#7aa2ff,#9d8bff,transparent)]" />
        <nav aria-label="Mobile" className="px-5 pt-3">
          <ul>
            {items.map((item, index) => (
              <li
                key={item.key}
                style={{ transitionDelay: open ? `${70 + index * 40}ms` : "0ms" }}
                className="translate-y-2 border-b border-white/[0.06] opacity-0 transition-[opacity,translate] duration-300 ease-out last:border-b-0 group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100 motion-reduce:translate-y-0"
              >
                <Link
                  href={item.href}
                  aria-current={item.key === current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="group/item relative flex min-h-14 items-center gap-4 rounded-2xl px-2 text-xl font-semibold tracking-tight text-silver-200 transition-colors active:text-white aria-[current=page]:text-white"
                >
                  <span aria-hidden className="w-6 font-mono text-label font-medium text-silver-400 group-aria-[current=page]/item:text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="group-aria-[current=page]/item:text-accent-gradient">{item.label}</span>
                  {/* Current page: a glowing dot. */}
                  <span
                    aria-hidden
                    className="hidden size-1.5 rounded-full bg-blue-300 shadow-[0_0_10px_rgb(120_150_255/1)] group-aria-[current=page]/item:block"
                  />
                  <ArrowUpRight
                    aria-hidden
                    size={18}
                    className="ml-auto text-silver-400 transition-[color,translate] duration-300 group-active/item:-translate-y-0.5 group-active/item:translate-x-0.5 group-aria-[current=page]/item:text-blue-300"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {cta ? (
          <div
            style={{ transitionDelay: open ? `${70 + items.length * 40}ms` : "0ms" }}
            className="mt-2 translate-y-2 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 opacity-0 transition-[opacity,translate] duration-300 ease-out group-data-[open=true]/menu:translate-y-0 group-data-[open=true]/menu:opacity-100 motion-reduce:translate-y-0"
          >
            {cta}
          </div>
        ) : null}
      </div>
    </div>
  );
}
