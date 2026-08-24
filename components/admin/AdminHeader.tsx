"use client";
import Link from "next/link";
import { Plus, Globe, ArrowLeft } from "lucide-react";
interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href: string;
    icon?: "plus" | "back";
  };
}
export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Globe size={14} />
            <span>Visit Blog</span>
          </Link>
          {action && (
            <Link
              href={action.href}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all shadow-sm ${
                action.icon === "back"
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20"
              }`}
            >
              {action.icon === "back" ? <ArrowLeft size={16} /> : <Plus size={16} />}
              <span>{action.label}</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}