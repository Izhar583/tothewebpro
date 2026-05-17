interface AdSlotProps {
  id: string;
  label?: string;
  className?: string;
}

export function AdSlot({
  id,
  label = "Advertisement",
  className = "",
}: AdSlotProps) {
  let style: React.CSSProperties = {};
  if (id === "tool-inline-primary" || id === "tool-inline-secondary") {
    style = { minHeight: "280px" };
  } else if (id === "tool-sidebar-sticky") {
    style = { minHeight: "600px" };
  }

  return (
    <aside
      aria-label={label}
      style={style}
      className={`flex min-h-[90px] items-center justify-center rounded-card border border-dashed border-orange-200 bg-orange-50/50 px-4 py-6 text-center text-sm text-slate-500 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="max-w-md space-y-1">
        <p className="font-bold text-slate-900">{label}</p>
        <p className="text-xs">
          Ad slot <span className="font-mono">{id}</span> — reserved for Google
          AdSense.
        </p>
      </div>
    </aside>
  );
}
