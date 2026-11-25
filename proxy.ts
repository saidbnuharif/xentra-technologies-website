import { NextResponse, type NextRequest } from "next/server";
import { caseStudies } from "@/lib/content/case-studies";
import { visibleOnly } from "@/lib/content/status";

/*
 * Case-study slugs that are not publishable must return a real 404.
 *
 * With Cache Components, `dynamicParams = false` is unavailable, so an
 * unknown slug would otherwise render on demand and send HTTP 200 before the
 * page calls notFound() (a "soft 404"). This proxy rewrites any unknown slug
 * to the prerendered placeholder entry, which is a static 404.
 * Scoped by `matcher` to /case-studies/<slug> only.
 */
const PLACEHOLDER = "__none__";
const publishable = new Set(visibleOnly(caseStudies).map((study) => study.slug));

export function proxy(request: NextRequest) {
  const slug = decodeURIComponent(request.nextUrl.pathname.split("/")[2] ?? "");
  if (publishable.has(slug) || slug === PLACEHOLDER) return NextResponse.next();
  return NextResponse.rewrite(new URL(`/case-studies/${PLACEHOLDER}`, request.url));
}

export const config = {
  matcher: "/case-studies/:slug",
};
