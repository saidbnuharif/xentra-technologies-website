import type { Metadata } from "next";
import { company } from "@/lib/content";

/*
 * Site-wide SEO settings.
 *
 * NEXT_PUBLIC_SITE_URL (e.g. https://www.example.com, no trailing slash)
 * must be set in the hosting environment AT BUILD TIME: it makes canonical
 * and Open Graph URLs absolute and fills the sitemap. Without it the site
 * still builds and works; those URLs stay relative and the sitemap is empty.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || null;

/** Link-preview image: the official logo, unaltered (1254 × 1254, on black). */
const SHARE_IMAGE = { url: "/images/xentra-logo.svg.jpeg", width: 1254, height: 1254, alt: company.name };

/** Open Graph for one page: its own title and description, the shared image. */
export function pageOpenGraph({ title, description, path }: { title: string; description: string; path: string }): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: company.name,
    title,
    description,
    url: path,
    images: [SHARE_IMAGE],
  };
}

/** Indexable pages, for the sitemap (Privacy stays out until reviewed). */
export const INDEXED_PATHS = ["/", "/about", "/services", "/how-we-work", "/contact"] as const;
