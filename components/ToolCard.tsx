import Link from "next/link";
import type { ToolDefinition } from "@/lib/types";
import {
  getToolCardIcon,
} from "@/lib/tool-card-icons";

interface ToolCardProps {
  tool: ToolDefinition;
  variant?: "light" | "dark";
}

export function ToolCard({ tool, variant = "dark" }: ToolCardProps) {
  const { Icon, iconContainerClass } = getToolCardIcon(tool.slug);

  const isDark = variant === "dark";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group block h-full rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
        isDark
          ? "border-slate-800/60 bg-slate-900/80 hover:border-orange-500/30 hover:bg-slate-900"
          : "border-orange-100 bg-white hover:border-orange-200 hover:shadow-md shadow-sm"
      }`}
      aria-labelledby={`tool-card-${tool.slug}`}
    >
      <article className="p-6 flex flex-col h-full items-center text-center">
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110 ${iconContainerClass}`}
          aria-hidden
        >
          <Icon className="h-7 w-7 shrink-0" />
        </div>

        <h3
          id={`tool-card-${tool.slug}`}
          className={`text-lg font-black leading-tight tracking-tight transition-colors group-hover:text-orange-600 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          {tool.name}
        </h3>

        <p className={`mt-3 flex-1 text-xs font-medium leading-relaxed line-clamp-2 ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}>
          {tool.shortDescription}
        </p>

        <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-transform">
          Use Tool
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </article>
    </Link>
  );
}