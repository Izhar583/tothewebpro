import Link from "next/link";
import { TOOLS } from "@/lib/tools-data";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const seoTools = TOOLS.filter((t) => t.category === "seo");
  const textTools = TOOLS.filter((t) => t.category === "text");
  const imageTools = TOOLS.filter((t) => t.category === "image");
  const devTools = TOOLS.filter((t) => t.category === "developer");

  return (
    <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-sm">WT</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                ToThe<span className="text-orange-500">WebPro</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              High-performance utilities for SEO pros, developers & content creators.
              Fast, private, no sign-up required.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
              >
                Contact Us
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition-all"
              >
                Read Blog
              </Link>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
                SEO Tools
              </h4>
              <ul className="space-y-2.5">
                {seoTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
                Developer
              </h4>
              <ul className="space-y-2.5">
                {devTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
              Text Tools
            </h4>
            <ul className="space-y-2.5">
              {textTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">
              Image Tools
            </h4>
            <ul className="space-y-2.5">
              {imageTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-400 hover:text-orange-500 transition-colors"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} ToTheWebPro</span>
            <span className="text-slate-700">•</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-400">All systems operational</span>
            </div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">v1.0.5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}