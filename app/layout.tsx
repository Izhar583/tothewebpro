import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tothewebpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "ToTheWebPro | Free SEO, Text & Image Tools",
    template: "%s | ToTheWebPro",
  },
  description:
    "Free browser-based tools for SEO professionals, content creators, and developers. Word counter, meta title checker, image compressor, and more — no account required.",
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-GB": baseUrl,
      "en-US": baseUrl,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
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
        url: `${baseUrl}/og-default.png`,
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
    images: [`${baseUrl}/og-default.png`],
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