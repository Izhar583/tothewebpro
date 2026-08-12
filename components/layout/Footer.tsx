import Link from "next/link";
import Image from "next/image";
import { TOOLS } from "@/lib/tools-data";
import { BottomCTA } from "@/components/BottomCTA";

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
    <>
      <BottomCTA />
      <footer className="border-t border-slate-900 bg-gradient-to-b from-slate-950 via-slate-950 to-black pt-16 pb-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-gradient-to-tr from-orange-600/10 to-amber-500/0 blur-[130px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-orange-500/5 to-transparent blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Brand section */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="group block relative w-36 h-24 transition-all duration-300">
              <Image
                src="/logo-silver.png"
                alt="ToTheWebPro"
                fill
                sizes="144px"
                className="object-contain filter brightness-95 group-hover:brightness-110 group-hover:scale-[1.03] transition-all duration-300"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              High-performance utilities for SEO pros, developers & content creators.
              Fast, private, no sign-up required.
            </p>
            
            {/* Premium Interactive Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/10 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] transition-all duration-300"
              >
                <span>Contact Us</span>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4z" />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-900/40 border border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <span>Read Blog</span>
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                SEO Tools
              </h4>
              <ul className="space-y-2.5">
                {seoTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-slate-400 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 block"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Developer
              </h4>
              <ul className="space-y-2.5">
                {devTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-sm text-slate-400 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 block"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Text Tools
            </h4>
            <ul className="space-y-2.5">
              {textTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-400 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 block"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Image Tools
            </h4>
            <ul className="space-y-2.5">
              {imageTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-slate-400 hover:text-orange-500 hover:translate-x-1 transition-all duration-200 block"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>© {new Date().getFullYear()} ToTheWebPro</span>
            <span className="text-slate-800">•</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400">All systems operational</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-900/80 border border-slate-800/80 rounded px-2 py-0.5 uppercase tracking-widest">
              v1.0.5
            </span>
          </div>
        </div>
      </div>
    </footer>
  </>
  );
}