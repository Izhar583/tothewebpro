import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Prevents invisible text while font loads (fixes FCP/LCP)
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tothewebpro.com"),
  title: {
    default: "ToTheWebPro — Free SEO, Text & Image Tools",
    template: "%s | ToTheWebPro",
  },
  description:
    "Free online tools for SEO, text, and images. Fast, privacy-conscious utilities built for marketers and developers.",
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
    images: [
      {
        url: "/og-default.png", // Add a 1200×630 PNG to /public/og-default.png
        width: 1200,
        height: 630,
        alt: "ToTheWebPro — Free SEO, Text & Image Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tothewebpro",
    creator: "@tothewebpro",
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
