import Link from "next/link";
import type { ToolDefinition } from "@/lib/types";
import {
  getToolCardIcon,
  TOOL_ICON_STROKE_COLOR,
} from "@/lib/tool-card-icons";

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const { Icon, iconContainerClass } = getToolCardIcon(tool.slug);

  return (
    <article
      className="group flex h-full flex-col rounded-3xl border border-slate-200/60 bg-white p-7 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/20 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]"
      aria-labelledby={`tool-card-${tool.slug}`}
    >
      <div
        className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconContainerClass} ring-1 ring-slate-900/[0.03] shadow-sm`}
        aria-hidden
      >
        <Icon
          className="h-7 w-7 shrink-0 transition-colors duration-300 group-hover:text-primary"
          strokeWidth={1.8}
          color={TOOL_ICON_STROKE_COLOR}
        />
      </div>

      <h3
        id={`tool-card-${tool.slug}`}
        className="text-xl font-bold leading-tight tracking-tight text-navy transition-colors group-hover:text-primary"
      >
        {tool.name}
      </h3>

      <p className="mt-3 flex-1 text-[14px] font-medium leading-relaxed text-body/70">
        {tool.shortDescription}
      </p>

      <div className="mt-8">
        <Link
          href={`/tools/${tool.slug}`}
          className="relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 p-px font-semibold shadow-sm transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          aria-label={`Open ${tool.name} tool`}
        >
          <span className="flex w-full items-center justify-center rounded-[15px] bg-white px-4 py-2.5 text-sm text-primary transition-all group-hover:bg-transparent group-hover:text-white">
            Launch Tool
          </span>
        </Link>
      </div>
    </article>
  );
}
