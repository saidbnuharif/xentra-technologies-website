import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display, Sora } from "next/font/google";
import { company } from "@/lib/content";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { ParticleField } from "@/components/effects/ParticleField";
import { XTransition } from "@/components/transition/XTransition";
import { pageOpenGraph, SITE_URL } from "@/lib/site";
import "./globals.css";

/*
 * Typography: Inter for body text and interface (navigation, buttons,
 * forms); Sora for headings and section titles; Playfair Display (italic
 * only) for the one highlighted word or phrase in a heading; Geist Mono for
 * the small uppercase labels. Mapped in globals.css.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${company.name} | ${company.tagline.text}`;

// The approved company description replaces the earlier draft.
export const metadata: Metadata = {
  // Inner pages set `title: "Services"` etc. → "Services | Xentra Technologies".
  title: { default: title, template: `%s | ${company.name}` },
  description: company.description.text,
  // NEXT_PUBLIC_SITE_URL (set in the host's environment at build time, see
  // lib/site.ts) makes canonical, Open Graph and sitemap URLs absolute.
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  applicationName: company.name,
  // Home; inner pages set their own (pageOpenGraph).
  openGraph: pageOpenGraph({ title, description: company.description.text, path: "/" }),
  twitter: { card: "summary" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // Silver theme experiment: switches the 3D scene to its light materials.
      data-theme="silver"
      className={`${inter.variable} ${sora.variable} ${playfair.variable} ${geistMono.variable} antialiased`}
      // Browser extensions (dark mode, translation, grammar, AI assistants…)
      // add their own attributes to <html> and <body> before React hydrates.
      // suppressHydrationWarning ignores attribute differences on these two
      // elements only; everything inside them is still checked.
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-blue-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        {children}
        {/* Ambient brand particles: above content (z-30), below the WhatsApp
            button (z-40) and navbar (z-50); click-through. */}
        <ParticleField />
        <WhatsAppFloat />
        {/* The X page transition (persists across navigation). */}
        <XTransition />
      </body>
    </html>
  );
}
