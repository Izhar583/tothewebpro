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
  return (
    <aside
      aria-label={label}
      className={`flex min-h-[90px] items-center justify-center rounded-card border border-dashed border-teal-800/15 bg-white/55 px-4 py-6 text-center text-sm text-body shadow-soft backdrop-blur-sm ${className}`}
    >
      <div className="max-w-md space-y-1">
        <p className="font-medium text-navy">{label}</p>
        <p className="text-xs">
          Ad slot <span className="font-mono">{id}</span> — reserve for Google
          AdSense after approval. Keep ads outside interactive controls.
        </p>
      </div>
    </aside>
  );
}
