"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TOOLS } from "@/lib/tools-data";
import { AdSlot } from "@/components/ui/AdSlot";

const SIDEBAR_LINKS = [
  { title: "Home", href: "/", icon: "🏠" },
  { title: "Explore", href: "/#categories", icon: "🔎" },
  { title: "SEO Tools", href: "/seo-tools", icon: "📊" },
  { title: "Text Tools", href: "/text-tools", icon: "✏️" },
  { title: "Image Tools", href: "/image-tools", icon: "🖼️" },
  { title: "Developer", href: "/developer-tools", icon: "⚡" },
  { title: "Blog", href: "/blog", icon: "📰" },
];

const TOOL_LINKS = [
  { href: "/tools/meta-title-description-checker", label: "Meta Checker" },
  { href: "/tools/word-counter", label: "Word Counter" },
  { href: "/tools/case-converter", label: "Case Converter" },
  { href: "/tools/character-counter", label: "Char Counter" },
  { href: "/tools/image-compressor", label: "Image Compressor" },
  { href: "/tools/image-resizer", label: "Image Resizer" },
  { href: "/tools/image-converter", label: "Image Converter" },
  { href: "/tools/password-generator", label: "Password Gen" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  const isHomeOrExplore = pathname === "/" || pathname === "/#categories";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-white shadow-xl shadow-orange-900/30 transition-all hover:scale-105 hover:shadow-2xl lg:hidden border border-orange-400/50"
        aria-label="Toggle menu"
      >
        <span className="text-xl">{isOpen ? "✕" : "☰"}</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed right-0 top-[52px] z-40 h-[calc(100vh-52px)] w-full max-w-[320px] transform transition-transform duration-300 ease-out lg:sticky lg:top-[72px] lg:h-[calc(100vh-100px)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full w-full bg-white rounded-3xl border border-orange-100 shadow-sm shadow-orange-900/5 lg:mr-4 overflow-y-auto">
          <nav className="flex h-full flex-col py-6 px-4">
            <div className="px-3 mb-8">
              <Link
                href="/"
                className="flex items-center gap-2.5 text-lg font-bold tracking-tight"
              >
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <span className="text-white text-sm">WT</span>
                </div>
                <span className="text-slate-900">
                  ToThe<span className="text-orange-600">WebPro</span>
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h3 className="px-3 mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Top Tools
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {TOOL_LINKS.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-orange-50 bg-orange-50/30 text-center transition-all hover:bg-orange-50 hover:border-orange-100 group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">
                      {TOOLS.find(t => `/tools/${t.slug}` === tool.href)?.icon || "🛠️"}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 truncate w-full">
                      {tool.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {SIDEBAR_LINKS.map((link) => {
                const isActive = isHomeOrExplore && link.href === "/"
                  ? true
                  : pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-500/20"
                        : "text-slate-600 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    <span className={`text-lg transition-transform duration-200 group-hover:scale-110 ${isActive ? "filter brightness-110" : ""}`}>
                      {link.icon}
                    </span>
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:text-orange-600 hover:bg-orange-50"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">🔧</span>
                  <span>All Tools</span>
                </span>
                <span className={`text-xs transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {toolsOpen && (
                <div className="mt-2 ml-2 space-y-1 border-l-2 border-orange-100 pl-3">
                  {TOOL_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-orange-100 text-orange-700"
                            : "text-slate-500 hover:text-orange-600 hover:bg-orange-50/50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-orange-100">
              <div className="mb-6">
                <AdSlot id="sidebar-footer" className="min-h-[120px]" />
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:text-orange-600 hover:bg-orange-50"
              >
                <span className="text-lg">💬</span>
                <span>Contact</span>
              </Link>
              <div className="flex items-center justify-between px-3 py-3 mt-2">
                <span className="text-xs font-medium text-slate-400">v1.0.5</span>
                <div className="flex gap-2">
                  <Link href="/privacy-policy" className="text-xs text-slate-400 hover:text-orange-600 transition-colors">Privacy</Link>
                  <span className="text-slate-200">•</span>
                  <Link href="/terms" className="text-xs text-slate-400 hover:text-orange-600 transition-colors">Terms</Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}