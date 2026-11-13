import type { MetadataRoute } from "next";
import { caseStudies } from "@/lib/content/case-studies";
import { showDrafts } from "@/lib/content/status";
import { INDEXED_PATHS, SITE_URL } from "@/lib/site";

/** /sitemap.xml — the public pages and any approved case studies.
 *  Needs NEXT_PUBLIC_SITE_URL (absolute URLs); empty without it, and in
 *  review builds. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL || showDrafts) return [];
  const studies = caseStudies.filter((study) => study.status === "approved").map((study) => `/case-studies/${study.slug}`);
  const paths = [...INDEXED_PATHS, ...(studies.length ? ["/case-studies", ...studies] : [])];
  return paths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
