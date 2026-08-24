"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Globe,
  Search,
} from "lucide-react";

interface AdminSidebarProps {
  username?: string;
}

export function AdminSidebar({ username = "Admin" }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "All Posts",
      href: "/admin/posts",
      icon: FileText,
      active: pathname === "/admin/posts",
    },
    {
      label: "Add New Post",
      href: "/admin/posts/new",
      icon: PlusCircle,
      active: pathname === "/admin/posts/new",
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative h-8 w-24">
            <Image
              src="/logo-silver.png"
              alt="ToTheWebPro"
              fill
              sizes="96px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            Admin Panel
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-950/70 z-40 backdrop-blur-sm"
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 py-4 border-b border-slate-800/80 flex items-center justify-between relative">
          <Link
            href="/admin"
            className="flex items-center gap-3 group w-full pr-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative h-10 w-24 shrink-0">
              <Image
                src="/logo-silver.png"
                alt="ToTheWebPro"
                fill
                sizes="96px"
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-white mt-0.5">
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden absolute top-4 right-4 text-slate-400 hover:text-white p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Link to Public Site */}
        <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition-colors font-medium"
          >
            <Globe size={13} />
            <span>View Website</span>
            <ExternalLink size={11} className="opacity-60" />
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="text-orange-400 hover:text-orange-300 font-semibold"
          >
            Live Blog →
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? "bg-orange-600 text-white font-semibold shadow-md shadow-orange-600/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} className={item.active ? "text-white" : "text-slate-400"} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Tools
          </div>

          <Link
            href="/tools/meta-title-description-checker"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
          >
            <span className="flex items-center gap-3">
              <Search size={16} className="text-slate-400 group-hover:text-orange-400" />
              <span>SERP Checker</span>
            </span>
            <ExternalLink size={12} className="text-slate-500 group-hover:text-slate-300" />
          </Link>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-orange-400 text-xs shrink-0">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{username}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
