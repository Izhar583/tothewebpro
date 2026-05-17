import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tothewebpro.com"),
  title: {
    default: "ToTheWebPro | Free SEO, Text & Image Tools",
    template: "%s | ToTheWebPro",
  },
  description:
    "Free browser-based tools for SEO professionals, content creators, and developers. Word counter, meta title checker, image compressor, and more — no account required.",
  alternates: {
    canonical: "https://tothewebpro.com",
    languages: {
      "en-GB": "https://tothewebpro.com",
      "en-US": "https://tothewebpro.com",
    },
  },
  openGraph: {
    locale: "en_GB",
    type: "website",
    siteName: "ToTheWebPro",
    title: "ToTheWebPro | Free SEO, Text & Image Tools",
    description:
      "Free browser-based tools for SEO professionals, content creators, and developers. Word counter, meta title checker, image compressor, and more — no account required.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "ToTheWebPro | Free SEO, Text & Image Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tothewebpro",
    creator: "@tothewebpro",
    title: "ToTheWebPro | Free SEO, Text & Image Tools",
    description:
      "Free browser-based tools for SEO professionals, content creators, and developers. Word counter, meta title checker, image compressor, and more — no account required.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body
        className={`${inter.variable} min-h-screen font-sans antialiased text-navy`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}