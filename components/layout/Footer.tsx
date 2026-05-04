import Link from "next/link";
import { TOOLS } from "@/lib/tools-data";

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Blog & Guides" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export function Footer() {
  // Group tools by category
  const seoTools = TOOLS.filter((t) => t.category === "seo");
  const textTools = TOOLS.filter((t) => t.category === "text");
  const imageTools = TOOLS.filter((t) => t.category === "image");
  const devTools = TOOLS.filter((t) => t.category === "developer");

  return (
    <footer className="mt-auto border-t border-white/5 bg-[#0a0f1d] pt-20 pb-10 text-slate-300">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-2xl font-black tracking-tighter"
            >
              <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                ToTheWeb
              </span>
              <span className="text-white">Pro</span>
              <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]" />
            </Link>
            <p className="text-[15px] leading-relaxed text-slate-400/90">
              High-performance web utilities designed for professionals who demand speed and privacy.
            </p>
            <div className="flex gap-4">
              {/* Optional Social Icons can go here */}
            </div>
          </div>

          {/* Column 2: SEO & Dev */}
          <div className="space-y-10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                SEO Power
              </h4>
              <ul className="mt-6 space-y-3">
                {seoTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-[14px] transition-colors hover:text-white"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                Developer
              </h4>
              <ul className="mt-6 space-y-3">
                {devTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="text-[14px] transition-colors hover:text-white"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Text */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
              Text Editing
            </h4>
            <ul className="mt-6 space-y-3">
              {textTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-[14px] transition-colors hover:text-white"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Image */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
              Image Magic
            </h4>
            <ul className="mt-6 space-y-3">
              {imageTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-[14px] transition-colors hover:text-white"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Pages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
              Explore
            </h4>
            <ul className="mt-6 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 border-t border-white/5 pt-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-[13px] font-medium text-slate-500">
            © {new Date().getFullYear()} ToTheWebPro. All rights reserved. 
            <span className="ml-2 opacity-50">| Designed for high-speed workflows.</span>
          </p>
          <div className="flex items-center gap-4">
             <div className="h-1 w-24 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 to-sky-400" />
             </div>
             <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">v1.0.5 Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
