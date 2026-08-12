import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://tothewebpro.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  applicationName: "ToTheWebPro",
  appleWebApp: {
    title: "ToTheWebPro",
    statusBarStyle: "default",
    capable: true,
  },
  title: {
    default: "Free Online Tools for SEO, Images, Text & More | ToTheWebPro",
    template: "%s | ToTheWebPro",
  },
  description:
    "Free online web utility tools for SEO analysis, image compression, text editing, and developer utilities. Fast, privacy-focused, and no signup required.",
  keywords: [
    "SEO tools",
    "meta tag checker",
    "image compressor",
    "word counter",
    "character counter",
    "case converter",
    "free online tools",
    "web performance audit",
    "Core Web Vitals",
    "Generative Engine Optimization",
    "AEO tools",
  ],
  authors: [{ name: "ToTheWebPro Team", url: baseUrl }],
  creator: "ToTheWebPro",
  publisher: "ToTheWebPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-GB": baseUrl,
      "en-US": baseUrl,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
  other: {
    "geo.region": "GB",
    "geo.placename": "London",
    "geo.position": "51.5074;-0.1278",
    "ICBM": "51.5074, -0.1278",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ToTheWebPro",
    "url": baseUrl,
    "description": "Free online tools for SEO analysis, image compression, text editing, and developer utilities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ToTheWebPro",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "sameAs": [
      "https://twitter.com/tothewebpro"
    ]
  };

  return (
    <html lang="en-GB">
      <head>
        <link rel="author" href={`${baseUrl}/llms.txt`} type="text/plain" title="LLM AI Context" />
      </head>
      <body
        className={`${inter.variable} min-h-screen font-sans antialiased text-navy`}
      >
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-xl focus:bg-orange-600 focus:px-6 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === "production" && gaId && (
          <GoogleAnalytics gaId={gaId} />
        )}
      </body>
    </html>
  );
}