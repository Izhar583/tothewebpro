interface SpinnerProps {
  label: string;
}

export function Spinner({ label }: SpinnerProps) {
  return (
    <div
      className="flex items-center gap-3 text-sm text-body"
      role="status"
      aria-live="polite"
    >
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      <span>{label}</span>
    </div>
  );
}
