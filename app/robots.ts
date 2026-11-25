import type { MetadataRoute } from "next";
import { showDrafts } from "@/lib/content/status";
import { SITE_URL } from "@/lib/site";

/** /robots.txt — review builds (drafts visible) are never crawled. */
export default function robots(): MetadataRoute.Robots {
  if (showDrafts) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(SITE_URL ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  };
}
