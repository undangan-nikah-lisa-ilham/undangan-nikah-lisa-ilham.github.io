import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { WEDDING } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Wedding of Lisa & Ilham",
  description:
    "Minggu, 8 November 2026 — Undangan pernikahan digital Lisa Fitri Anggraeni & Moh. Ilham Al Ubaidah di Kasembon, Malang.",
  openGraph: {
    title: "The Wedding of Lisa & Ilham",
    description: "Minggu, 8 November 2026 — Kasembon, Malang",
    type: "website",
    images: [{ url: WEDDING.coverPhoto, alt: "Lisa dan Ilham" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8a9a7b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://undangan-online-2b663-default-rtdb.firebaseio.com"
        />
        <link rel="preload" as="image" href={WEDDING.coverPhoto} />
        <link rel="preload" as="image" href={WEDDING.heroPhoto} />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Playfair+Display:wght@400;600;700&family=Great+Vibes&family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}