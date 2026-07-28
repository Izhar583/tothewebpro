/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'tothewebpro.vercel.app',
          },
        ],
        destination: 'https://tothewebpro.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    const isProduction = process.env.VERCEL_ENV === "production";
    const securityHeaders = [
      { key: "X-Frame-Options", value: "DENY" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        // Disable features the site does not use.
        // Update this list if you add camera/mic/payment features.
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), payment=(), geolocation=(), usb=()",
      },
      {
        // CSP: allow self + Google Fonts + Vercel Analytics + AdSense (placeholder).
        // Tighten 'script-src' once you add AdSense publisher ID.
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          // Scripts: self, Vercel analytics, Google AdSense, jsdelivr (for AI models), blob for workers, WASM compilation
          `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' 'unsafe-eval' blob: https://va.vercel-scripts.com https://cdn.jsdelivr.net https://unpkg.com https://staticimgly.com https://pagead2.googlesyndication.com https://www.googletagmanager.com`,
          // Styles: self + Google Fonts + inline (Tailwind)
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          // Fonts: Google Fonts CDN
          "font-src 'self' https://fonts.gstatic.com",
          // Images: self + data URIs + blob URIs (canvas exports) + Google ad images
          "img-src 'self' data: blob: https:",
          // Connect: self + Vercel analytics + fetch-meta API + jsdelivr/unpkg/staticimgly (WASM/Models) + Unsplash (Samples) + Google Analytics/Tag Manager
          "connect-src 'self' blob: https://va.vercel-scripts.com https://cdn.jsdelivr.net https://unpkg.com https://staticimgly.com https://images.unsplash.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
          // Workers: allow blob workers
          "worker-src 'self' blob:",
          // Frames: deny all (no iframes used)
          "frame-src 'none'",

          // Objects: deny
          "object-src 'none'",
          // Base URI: restrict to self
          "base-uri 'self'",
          // Form submissions: only to self
          "form-action 'self'",
        ].join("; "),
      },
    ];

    return [
      // ── Long-term cache for AI model assets (221 MB, hash-named, immutable) ──
      {
        source: "/static/imgly/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ── Security headers for all other routes ────────────────────────
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

