"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { NavItem, PageKey } from "@/lib/content";

/*
 * Desktop navigation links with a gliding indicator: a glowing electric-
 * blue line (and a soft pill of light) rests under the current page,
 * glides to whichever link is hovered or focused, and glides back when the
 * pointer leaves the rail. On first paint it grows in from the centre of
 * the current link. Pure CSS transitions on transform/opacity; reduced
 * motion: it moves without animating. No JS: links work and the current
 * page keeps its static underline (aria-current styling).
 */
export function NavLinks({ items, current }: { items: readonly NavItem[]; current: PageKey | null }) {
  const rail = useRef<HTMLUListElement>(null);
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ul = rail.current;
    const m = marker.current;
    if (!ul || !m) return;
    const links = [...ul.querySelectorAll<HTMLAnchorElement>("a")];
    const active = links.find((a) => a.getAttribute("aria-current") === "page") ?? null;

    const moveTo = (a: HTMLAnchorElement | null, instant = false) => {
      if (!a) {
        m.dataset.on = "false";
        return;
      }
      const r = a.getBoundingClientRect();
      const base = ul.getBoundingClientRect();
      if (instant) m.style.transition = "none";
      m.style.width = `${r.width}px`;
      m.style.transform = `translateX(${r.left - base.left}px)`;
      m.dataset.on = "true";
      if (instant) {
        void m.offsetWidth; // apply, then restore transitions
        m.style.transition = "";
      }
    };

    // First paint: place it on the current page without sliding in from 0,
    // then let it grow in (data-ready).
    moveTo(active, true);
    requestAnimationFrame(() => (m.dataset.ready = "true"));
    ul.dataset.enhanced = "true";

    const onOver = (e: Event) => {
      const a = (e.target as HTMLElement).closest("a");
      if (a && ul.contains(a)) moveTo(a as HTMLAnchorElement);
    };
    const back = () => moveTo(active);
    const onFocusOut = (e: FocusEvent) => {
      if (!ul.contains(e.relatedTarget as Node)) back();
    };
    const onResize = () => moveTo(active, true);
    ul.addEventListener("pointerover", onOver);
    ul.addEventListener("focusin", onOver);
    ul.addEventListener("pointerleave", back);
    ul.addEventListener("focusout", onFocusOut);
    window.addEventListener("resize", onResize);
    // The bar condenses on scroll (font metrics do not change, but keep it exact).
    const ro = new ResizeObserver(() => moveTo(active, true));
    ro.observe(ul);
    return () => {
      ul.removeEventListener("pointerover", onOver);
      ul.removeEventListener("focusin", onOver);
      ul.removeEventListener("pointerleave", back);
      ul.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      delete ul.dataset.enhanced;
    };
  }, [current]);

  return (
    <ul
      ref={rail}
      className="group/rail relative flex items-center gap-0.5 rounded-full border border-white/[0.07] bg-white/[0.03] p-1 shadow-[inset_0_1px_0_rgb(255_255_255/0.05)] xl:gap-1"
    >
      {/* Gliding indicator: soft pill of light + glowing underline. */}
      <span
        ref={marker}
        aria-hidden
        data-on="false"
        className="pointer-events-none absolute left-0 top-1 bottom-1 rounded-full bg-[linear-gradient(180deg,rgb(90_139_255/0.14),rgb(124_92_255/0.08))] opacity-0 shadow-[inset_0_0_0_1px_rgb(120_150_255/0.18)] transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[on=true]:opacity-100 motion-reduce:transition-none"
      >
        <span className="absolute inset-x-3 -bottom-px h-0.5 scale-x-0 rounded-full bg-[linear-gradient(90deg,transparent,#7aa2ff,#9d8bff,transparent)] shadow-[0_0_10px_rgb(90_139_255/0.95)] transition-transform duration-500 ease-out group-data-[enhanced=true]/rail:scale-x-100" />
      </span>
      {items.map((item) => (
        <li key={item.key} className="relative">
          <Link
            href={item.href}
            aria-current={item.key === current ? "page" : undefined}
            className={[
              "relative inline-flex min-h-10 items-center rounded-full px-4 text-[0.875rem] font-medium tracking-[0.01em] text-silver-300 transition-[color,text-shadow] duration-300",
              "hover:text-white hover:[text-shadow:0_0_14px_rgb(120_150_255/0.55)] focus-visible:text-white",
              "aria-[current=page]:text-white",
              // Without JS (indicator not enhanced): a static underline on the current page.
              "after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:rounded-full after:bg-[linear-gradient(90deg,transparent,#7aa2ff,transparent)] after:opacity-0 aria-[current=page]:after:opacity-100 group-data-[enhanced=true]/rail:after:hidden",
            ].join(" ")}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
