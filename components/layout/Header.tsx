"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";

const navLinks = [
  { href: "/seo-tools", label: "SEO Tools" },
  { href: "/text-tools", label: "Text Tools" },
  { href: "/image-tools", label: "Image Tools" },
  { href: "/developer-tools", label: "Dev Tools" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navRef = useRef<HTMLElement>(null);

  // Close mobile nav on Escape key
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Close mobile nav on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (open && navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  function onSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    setOpen(false);
  }

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500" />
      <header
        ref={navRef as React.RefObject<HTMLElement>}
        className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 shadow-[0_2px_30px_-10px_rgba(0,0,0,0.08)] backdrop-blur-2xl"
      >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 md:flex-nowrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/50 text-navy shadow-sm transition hover:bg-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <span className="text-xl">✕</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-navy"
            aria-label="ToTheWebPro home"
          >
            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent transition group-hover:from-sky-500 group-hover:to-blue-600">
              ToTheWeb
            </span>
            <span className="text-navy">Pro</span>
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
          </Link>
        </div>

        <form
          onSubmit={onSearch}
          className="relative order-3 w-full md:order-none md:max-w-xs md:flex-1 lg:max-w-sm"
          role="search"
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body/50" />
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full rounded-2xl border border-slate-200 bg-white/60 py-2.5 pl-10 pr-4 text-sm text-navy shadow-sm transition-all placeholder:text-body/50 focus:border-primary/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:shadow-[0_0_20px_-5px_rgba(37,99,235,0.2)]"
          />
        </form>

        <nav
          id="primary-nav"
          className={`${
            open ? "flex" : "hidden"
          } w-full flex-col gap-2 pb-2 md:flex md:w-auto md:flex-row md:items-center md:gap-6 md:pb-0`}
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-[13px] font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                isActive(link.href) ? "text-primary" : "text-navy/80"
              }`}
              onClick={() => setOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary md:-bottom-2" />
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
    </>
  );
}

