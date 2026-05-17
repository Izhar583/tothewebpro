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
      aria-hidden="true"
      className={`flex items-center justify-center rounded-card border border-dashed border-orange-200 bg-orange-50/50 px-4 py-6 text-center text-sm text-slate-500 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div style={style} aria-hidden="true" />
    </aside>
  );
}
