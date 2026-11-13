import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { company } from "@/lib/content";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { ParticleField } from "@/components/effects/ParticleField";
import { XTransition } from "@/components/transition/XTransition";
import { pageOpenGraph, SITE_URL } from "@/lib/site";
import "./globals.css";

// Temporary: Geist stays until the Xentra brand typeface is confirmed.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
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
