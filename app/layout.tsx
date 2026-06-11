import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tothewebpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Free Online Tools for SEO, Images, Text & More | ToTheWebPro",
    template: "%s | ToTheWebPro",
  },
  description:
    "Free online tools for SEO analysis, image compression, text editing, and developer utilities. Fast and no signup required.",
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
    title: "Free Online Tools for SEO, Images, Text & More | ToTheWebPro",
    description:
      "Free online tools for SEO analysis, image compression, text editing, and developer utilities. Fast and no signup required.",
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
    title: "Free Online Tools for SEO, Images, Text & More | ToTheWebPro",
    description:
      "Free online tools for SEO analysis, image compression, text editing, and developer utilities. Fast and no signup required.",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-xl focus:bg-orange-600 focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}