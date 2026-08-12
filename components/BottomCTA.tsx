import Link from "next/link";

export function BottomCTA() {
  return (
    <section className="py-16 md:py-24 overflow-hidden relative border-t border-orange-100/60">
      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
          The Right Tool Is Already Waiting
        </h2>
        <p className="mt-4 text-base md:text-lg text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
          Technical work deserves technical precision. Open any tool, run your task, move on. That&apos;s the whole deal.
        </p>
        <Link
          href="/seo-tools"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-10 py-4 text-sm font-bold text-white transition hover:bg-orange-700 active:scale-95"
        >
          Browse All Tools →
        </Link>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 blur-[120px] rounded-full pointer-events-none -z-0" />
    </section>
  );
}
