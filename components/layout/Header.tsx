"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/seo-tools", label: "SEO" },
  { href: "/text-tools", label: "Text" },
  { href: "/image-tools", label: "Images" },
  { href: "/developer-tools", label: "Dev" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (mobileOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [mobileOpen]);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  }

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  const headerBg = "bg-white border-b border-orange-100";
  const textColor = "text-slate-700";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-red-500" />
      <header
        ref={navRef as React.RefObject<HTMLElement>}
        className={`sticky top-0 z-50 ${headerBg} shadow-lg`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              href="/"
              className="group flex items-center gap-2 text-xl font-black tracking-tight"
            >
              <div className="h-9 w-9 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-all">
                <span className="text-white font-bold text-sm">WT</span>
              </div>
              <span className={`hidden sm:block text-slate-800`}>
                <span className="text-orange-600">ToThe</span>
                <span>Web</span>
                <span className="text-orange-600">Pro</span>
              </span>
            </Link>
          </div>

          <form
            onSubmit={onSearch}
            className="hidden md:flex flex-1 max-w-md mx-4"
            role="search"
          >
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="header-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-slate-100/50 dark:bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-orange-500/50 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>
          </form>

          <nav
            className="hidden lg:flex items-center gap-1.5"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 shadow-sm"
                    : `${textColor} hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:shadow-md hover:-translate-y-0.5`
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-2 px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Get in Touch
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300 ${
            mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="p-4 space-y-4">
            <form onSubmit={onSearch} className="relative" role="search">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-sm"
              />
            </form>
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-slate-200 dark:border-slate-700" />
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-center bg-gradient-to-r from-orange-500 to-amber-400 text-white"
              >
                Get in Touch
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}