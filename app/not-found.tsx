import Link from "next/link";
import { TOOLS } from "@/lib/tools-data";

export default function NotFound() {
  const picks = TOOLS.slice(0, 3);
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-3xl flex-col justify-center px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">
        404
      </p>
      <h1 className="mt-2 text-4xl font-bold text-navy">Page not found</h1>
      <p className="mt-3 text-body">
        The page you requested does not exist or has moved. Try a popular tool
        below or return home.
      </p>
      <div className="mt-8 space-y-3">
        {picks.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="glass-card block border-rose-100/40 px-4 py-3 text-sm font-semibold text-navy transition hover:border-primary/40 hover:shadow-soft"
          >
            {tool.icon} {tool.name}
          </Link>
        ))}
        <Link
          href="/"
          className="inline-flex text-sm font-semibold text-primary hover:underline"
        >
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
}
