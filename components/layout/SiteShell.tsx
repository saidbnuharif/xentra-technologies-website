import type { ReactNode } from "react";
import type { PageKey } from "@/lib/content";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

/**
 * Shared page frame for every route: navbar (with the current page marked),
 * main content, footer, and the declarative animation layer.
 *
 * Rendered by each page rather than the root layout so MotionRoot remounts
 * on navigation and sets up fresh triggers for the new page's content.
 */
export function SiteShell({ current, children }: { current: PageKey | null; children: ReactNode }) {
  return (
    <>
      <Navbar current={current} />
      {/* tabIndex lets the skip link move keyboard focus, not just scroll. */}
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
      {/* Last, so pinned sections above are set up before its triggers. */}
      <MotionRoot />
    </>
  );
}
